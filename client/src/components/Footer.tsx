import React from "react";
import { Link } from "wouter";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ExternalLink,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#000080] text-white mt-10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                alt="Emblem of India"
                className="h-10 w-auto"
              />
              <h3 className="ml-3 font-['Poppins'] font-bold text-lg">
                E-Governance Portal
              </h3>
            </div>
            <p className="text-sm text-gray-300 max-w-md">
              Empowering citizens through technology and transparent governance.
              Making government services accessible to the common man in their
              locality.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-['Poppins'] font-medium mb-3 text-sm uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="/">
                    <a className="hover:text-white">Home</a>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <a className="hover:text-white">About</a>
                  </Link>
                </li>
                <li>
                  <Link href="/services">
                    <a className="hover:text-white">Services</a>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <a className="hover:text-white">Contact</a>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-['Poppins'] font-medium mb-3 text-sm uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link href="/faqs">
                    <a className="hover:text-white">FAQs</a>
                  </Link>
                </li>
                <li>
                  <Link href="/tutorials">
                    <a className="hover:text-white">Tutorials</a>
                  </Link>
                </li>
                <li>
                  <Link href="/guidelines">
                    <a className="hover:text-white">Guidelines</a>
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap">
                    <a className="hover:text-white">Sitemap</a>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-['Poppins'] font-medium mb-3 text-sm uppercase tracking-wider">
                Connect
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white flex items-center">
                    <Twitter className="mr-2 h-4 w-4" /> Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white flex items-center">
                    <Facebook className="mr-2 h-4 w-4" /> Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white flex items-center">
                    <Instagram className="mr-2 h-4 w-4" /> Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white flex items-center">
                    <Youtube className="mr-2 h-4 w-4" /> YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-5 border-t border-blue-900 text-sm text-gray-300 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Government of India. All rights reserved.</p>
          <div className="flex mt-4 md:mt-0 space-x-5">
            <Link href="/terms">
              <a className="hover:text-white">Terms of Service</a>
            </Link>
            <Link href="/privacy">
              <a className="hover:text-white">Privacy Policy</a>
            </Link>
            <Link href="/accessibility">
              <a className="hover:text-white">Accessibility</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
