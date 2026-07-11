import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 rounded-xl shadow-sm border border-gray-200">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Terms & Conditions
        </h1>

        <div className="prose prose-sm max-w-none text-gray-600">
          <h3 className="font-bold">1. General Information</h3>
          <p>(a) This agreement governs your use of Spreadshirt's site and service, including all orders made or processed for products or services in connection with the site and service. You and Spreadshirt Inc., a Delaware corporation providing custom, on-demand merchandise printing, sales, and other related services ("Spreadshirt"), are the parties to this agreement. If you choose to use other features of the site and service, like opening a shop to sell custom, print-on-demand products, other terms may apply in addition to these. No exceptions to these terms are effective unless Spreadshirt has agreed to them in writing.</p>
          <p>(b) Spreadshirt may change these terms from time to time. If Spreadshirt makes changes to these terms, you will be notified and asked to accept the new terms as a condition of continuing to use Spreadshirt's site and service. If you disagree with any amendments, you must stop using Spreadshirt's site and service.</p>

          <h3 className="font-bold mt-6">2. Use of the Site and Service Generally</h3>
          <p>(a) Spreadshirt owns all intellectual property and other rights, title and interest in and to its site and service (except for user-provided content). Your use of the site and service does not grant you any right, title or interest to these properties, except as follows. Spreadshirt grants you a limited, revocable license to access and use the site and service for its intended purpose: the provision of an online, on-demand, customizable merchandising solution. You may only use the site and service according to Spreadshirt's terms, rules, and guidelines found on its site, and Spreadshirt may revoke this license and limit your access to the site and service according to Section 15 (Termination of Access).</p>
          <p>(b) You may not interfere with the site and service by using viruses or any other programs or technology designed to disrupt or damage any software or hardware; modify, copy, create derivative works from, reverse engineer, decompile or disassemble any technology used to provide the site and service; use a robot or other automated means to monitor the activity on or copy information or pages from the site and service, except search engines, traffic counters, or similar basic performance monitoring technology; impersonate another person or entity; use any meta tags, search terms, keywords, or similar tags that contain Spreadshirt's name or trademarks; engage in any activity that interferes with another user's ability to use or enjoy the site and service, including activity that places a disproportionate burden on the site and service compared to ordinary use from a single, ordinary user; assist or encourage any third party in engaging in any activity prohibited by this agreement; or use the site and service to promote hate speech, obscenity, or any content that violates Spreadshirt's Ethical Guidelines, which Spreadshirt may change from time to time in Spreadshirt's sole discretion.</p>

          <h3 className="font-bold mt-6">3. Shops</h3>
          <p>(a) Two shop types are available on Spreadshirt's site. First, there are shops designed and operated by Spreadshirt itself ("Spreadshirt Shop(s)") and shops designed and operated by independent shop owners ("Partner Shop(s)"). Information about the owner of any shop is available as a linked page in each shop.</p>
          <p>(b) Independent shop owners of Partner Shops are solely responsible for the products and designs offered in those shops, the design of those shops, and the advertising of the articles offered. Spreadshirt does not use designs or products of shop owners until a customer places an order that includes one of those designs or products.</p>

          <h3 className="font-bold mt-6">4. Product Sales</h3>
          <p>(a) By placing an order using Spreadshirt's site and service, a customer makes a binding offer for a contract of sale or, as the case may be, a contract for work and materials with Spreadshirt only (no contract exists between the customer and any applicable shop owner). Spreadshirt sends an order confirmation via e-mail to the customer. The order confirmation is not an acceptance of the offer, but only acknowledges that the order was received. The offer is only accepted when Spreadshirt confirms that production has completed in a second e-mail. Spreadshirt cannot guarantee the continued availability of any products or designs found on its site.</p>
          <p>(b) Information, drawings, figures, technical data, specifications of weight, measurements and services contained in brochures, catalogues, newsletters, ads, or price lists are purely informational. Spreadshirt cannot guarantee the correctness of this information, and if there is any inconsistency between the information described above and the information in an order confirmation email, the order confirmation email controls.</p>
          <p>(c) Spreadshirt reserves the right to reject orders for any reason or no reason. If Spreadshirt rejects an order, it will notify the customer.</p>
          <p>(d) Spreadshirt's performance of an order is completed when the shipment provider completes delivery to the customer's address, according to the records of the shipment provider. If there is an interruption of delivery, and Spreadshirt cannot replace the order in a reasonable amount of time, Spreadshirt will notify the customer immediately.</p>
          <p>(e) If there is a product defect or if you are dissatisfied with your order for any reason, Spreadshirt's return policy will apply, which Spreadshirt may change at any time in its sole discretion.</p>

          {/* ... other sections would follow the same pattern ... */}

          <p className="mt-8 text-xs text-center">Version: 12/2014</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
