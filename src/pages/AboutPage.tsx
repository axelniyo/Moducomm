import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 rounded-xl shadow-sm border border-gray-200">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-4">
          Quality Meets Innovation.
        </h1>
        <h2 className="text-2xl font-bold text-primary text-center mb-8">
          Welcome to Baoba
        </h2>

        <div className="prose prose-lg max-w-none text-gray-600">
          <p>
            At Baoba, we are dedicated to providing premium apparel and lifestyle accessories for the modern digital generation. Founded with a passion for technology and design, our store serves as a bridge between professional utility and personal style.
          </p>

          <h3>Our Mission</h3>
          <p>
            Our mission is simple: to curate a collection of high-quality products that celebrate the creativity and drive of the tech community. Whether you are a developer writing the code of tomorrow, a digital creator, or someone who appreciates smart design, we create products that fit your lifestyle.
          </p>

          <h3>Our Commitment to Quality</h3>
          <p>
            We believe that the products you use every day should be built to last. That is why we partner with industry-leading global fulfillment centers to ensure that every t-shirt, bag, and accessory meets strict quality standards. From the durability of our fabrics to the precision of our prints, we do not cut corners.
          </p>

          <h3>Why Shop With Us?</h3>
          <ul>
            <li><strong>Global Reach:</strong> We proudly ship to customers worldwide, with production facilities in the USA and Europe to ensure fast delivery.</li>
            <li><strong>Secure Shopping:</strong> Your security is our priority. Our store utilizes top-tier encryption and trusted payment gateways to ensure your data is always protected.</li>
            <li><strong>Customer First:</strong> We are committed to an excellent shopping experience. If you have a question, our support team is ready to assist.</li>
          </ul>

          <p className="mt-8 text-center">
            Thank you for choosing Baoba. We look forward to being part of your journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
