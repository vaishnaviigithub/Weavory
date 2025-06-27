import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* About Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">About Weavory</h3>
              <p className="text-gray-600 leading-relaxed max-w-md">
                Bridging tradition with technology, Weavory empowers artisans and preserves India's rich handloom heritage. 
                Join us in celebrating centuries of craftsmanship in the digital age.
                <br />
                <br />
              </p>
            </div>
            <div className="flex items-center space-x-6">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Youtube, label: 'Youtube' }
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="group"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                  <span className="ml-4 text-gray-600 leading-relaxed">
                    GNITS, Shaikpet
                    <br />Hyderabad, India
                  </span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <a href="tel:+911234567890" className="ml-4 text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                    +91 123 456 7890
                  </a>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <a href="mailto:support@weavory.com" className="ml-4 text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                    support@weavory.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Weavory. All rights reserved.
            </p>
            {/* <div className="flex space-x-8 text-sm text-gray-500">
              {['Privacy Policy', 'Terms of Service', 'Shipping Info'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="hover:text-indigo-600 transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;