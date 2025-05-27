
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-ry-black text-ry-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Rendered Youth</h3>
            <p className="text-gray-300 max-w-md">
              Empowering young artists by turning their creativity into wearable art. 
              Every drawing tells a story, every T-shirt supports a dream.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/store" className="hover:text-ry-yellow">Shop Designs</a></li>
              <li><a href="/creators" className="hover:text-ry-yellow">Meet Creators</a></li>
              <li><a href="/upload" className="hover:text-ry-yellow">Upload Art</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/legal/terms" className="hover:text-ry-yellow">Terms</a></li>
              <li><a href="/legal/privacy" className="hover:text-ry-yellow">Privacy</a></li>
              <li><a href="/contact" className="hover:text-ry-yellow">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Rendered Youth. Made with ❤️ for young artists everywhere.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
