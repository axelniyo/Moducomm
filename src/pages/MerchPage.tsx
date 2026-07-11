import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../modules/auth/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const MerchPage: React.FC = () => {
  const [iframeHeight, setIframeHeight] = useState('2000px');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeInitializedRef = useRef(false);
  const messageListenerSetupRef = useRef(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Set up message listener once on component mount - NEVER remove it
  useEffect(() => {
    let currentPath = location.pathname + location.search;
    
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      // Handle iframe resize
      if (event.data.type === 'iframeResize') {
        const newHeight = event.data.height + 50;
        setIframeHeight(`${newHeight}px`);
      }

      // Handle Spreadshop navigation
      if (event.data.type === 'spreadshopNavigate') {
        const newPath = event.data.path;
        if (newPath && window.location.pathname !== newPath) {
          window.history.pushState(null, '', newPath);
          currentPath = newPath; // Update currentPath to track iframe navigation
        }
      }

      // Handle auth check request from iframe
      if (event.data.type === 'checkAuth') {
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            { type: 'authResponse', isAuthenticated },
            '*'
          );
        }
      }

      // Handle redirect to login request from iframe
      if (event.data.type === 'redirectToLogin') {
        // Use currentPath which tracks iframe navigation
        navigate('/login', { state: { from: { pathname: currentPath } } });
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Note: We intentionally don't clean up this listener
    // because it needs to remain attached for the entire component lifetime
  }, [isAuthenticated, navigate, location]);

  // Separate effect for iframe initialization
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Reset initialization flag when location changes so iframe can reinitialize
    iframeInitializedRef.current = false;

    const doc = iframe.contentDocument;
    if (!doc) return;

    // Extract the current path to use as startToken for Spreadshop
    // Remove leading slash if present
    const currentPath = location.pathname === '/' ? '' : location.pathname.slice(1);
    const startToken = currentPath + location.search;

    // The complete HTML content for the iframe
    const iframeContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Merch Store</title>
          <style>
              body, html { margin: 0; padding: 0; width: 100%; }
              .sprd-header__title { visibility: hidden !important; }
              .sprd-department-filter { position: absolute !important; top: 10px !important; left: 15px !important; z-index: 100 !important; }
              #sprd-startpage-trust-elements, #sprd-startpage-cyo-intro, #sprd-startpage-designs-with-products, .sprd-info-footer, .sprd-service-footer, #buttonSpreadshirt { display: none !important; }
          </style>
      </head>
      <body>
          <div id="myShop"></div>
          <script>
              var spread_shop_config = {
                  shopName: 'baoba',
                  locale: 'us_US',
                  prefix: 'https://baoba.myspreadshop.com',
                  baseId: 'myShop',
                  view: 'grid',
                  usePushState: true,
                  updateHistory: true,
                  pushStateBaseUrl: '/',
                  startToken: '${startToken}'
              };
          </script>
          <script type="text/javascript" src="https://baoba.myspreadshop.com/shopfiles/shopclient/shopclient.nocache.js" defer></script>
          <script>
              // Intercept fetch requests to prevent add-to-cart API calls before auth
              const originalFetch = window.fetch;
              window.fetch = function(...args) {
                  const url = args[0]?.toString() || '';
                  const method = (args[1]?.method || 'GET').toUpperCase();
                  
                  // Check if this is an add-to-cart request (Spreadshirt uses /baskets endpoint)
                  if (url.includes('baskets') && method === 'POST') {
                      // Return a promise that checks auth first
                      return new Promise((resolve, reject) => {
                          const checkAuthHandler = function(event) {
                              if (event.data && event.data.type === 'authResponse') {
                                  window.removeEventListener('message', checkAuthHandler);
                                  
                                  if (event.data.isAuthenticated) {
                                      // Proceed with original fetch
                                      originalFetch.apply(window, args)
                                          .then(resolve)
                                          .catch(reject);
                                  } else {
                                      window.parent.postMessage({ type: 'redirectToLogin' }, '*');
                                      // Reject with 401
                                      resolve(new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }));
                                  }
                              }
                          };
                          
                          window.addEventListener('message', checkAuthHandler);
                          window.parent.postMessage({ type: 'checkAuth' }, '*');
                      });
                  }
                  
                  // For other requests, proceed normally
                  return originalFetch.apply(this, args);
              };
              
              const sendHeight = () => {
                  const height = document.body.scrollHeight;
                  window.parent.postMessage({ type: 'iframeResize', height: height }, '*');
              };
              const resizeObserver = new ResizeObserver(sendHeight);
              resizeObserver.observe(document.body);
              setInterval(sendHeight, 500);
              window.onload = sendHeight;

              // Listen for Spreadshop navigation and notify parent
              const originalPushState = history.pushState;
              const originalReplaceState = history.replaceState;

              history.pushState = function(...args) {
                  originalPushState.apply(history, args);
                  const path = args[2] || '/';
                  window.parent.postMessage({ type: 'spreadshopNavigate', path: path }, '*');
              };

              history.replaceState = function(...args) {
                  originalReplaceState.apply(history, args);
                  const path = args[2] || '/';
                  window.parent.postMessage({ type: 'spreadshopNavigate', path: path }, '*');
              };

              // Listen for add-to-cart button clicks
              document.addEventListener('click', function(e) {
                  const target = e.target;
                  
                  // Check if clicked element is an add-to-cart button
                  const btn = target.tagName === 'BUTTON' ? target : target.closest('button');
                  if (btn) {
                      const text = btn.textContent.toLowerCase().trim();
                      if (text.includes('add to cart') || text.includes('in den warenkorb')) {
                          // Fetch interception will handle the auth check
                      }
                  }
              }, false);
          </script>
      </body>
      </html>
    `;

    // Write the content to the iframe
    doc.open();
    doc.write(iframeContent);
    doc.close();
    
    // Mark iframe as initialized to prevent re-running effect
    iframeInitializedRef.current = true;
  }, [location]); // Only re-run when location changes

  return (
    <div className="relative">
      <iframe
        ref={iframeRef}
        title="Baoba Merch Store"
        style={{
          width: '100%',
          height: iframeHeight,
          border: 'none',
          display: 'block',
          transition: 'height 0.2s ease-in-out'
        }}
        // The src attribute has been removed
      />
    </div>
  );
};

export default MerchPage;
