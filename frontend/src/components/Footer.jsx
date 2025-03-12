import { Link } from "react-router-dom";
import { FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-950 to-indigo-950 text-gray-300 py-8 px-6 md:px-12 shadow-lg shadow-purple-800/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        {/* Left: Brand & Links */}
        <div className="text-center md:text-left">
          <Link
            to="/"
            className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-300 hover:to-purple-300 transition-all duration-300"
          >
            Sargam
          </Link>
          <div className="mt-4 space-x-6">
            <Link
              to="/about"
              className="text-sm hover:text-purple-300 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm hover:text-purple-300 transition-colors duration-200"
            >
              Contact
            </Link>
            <Link
              to="/terms"
              className="text-sm hover:text-purple-300 transition-colors duration-200"
            >
              Terms
            </Link>
          </div>
        </div>

        {/* Right: Social Icons */}
        <div className="flex space-x-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-300 transition-all duration-300 hover:scale-110"
          >
            <FaGithub size={24} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-300 transition-all duration-300 hover:scale-110"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="mailto:support@sargam.com"
            className="text-gray-400 hover:text-purple-300 transition-all duration-300 hover:scale-110"
          >
            <FaEnvelope size={24} />
          </a>
        </div>
      </div>

      {/* Bottom: Copyright */}
      <div className="text-center mt-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Sargam. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;