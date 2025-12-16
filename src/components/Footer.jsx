import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaMicrochip,
  FaUserGraduate,
  FaShieldAlt
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-gray-300">
      <div className="container mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand / System Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FaMicrochip className="text-green-400 text-2xl" />
            <h2 className="text-2xl font-bold text-white">
              Smart IoT Attendance
            </h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            A secure, real-time IoT based attendance management system
            designed for schools, colleges and institutions.
          </p>

          <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
            <FaShieldAlt className="text-green-400" />
            <span>Secure • Reliable • Real-Time</span>
          </div>
        </div>

        {/* System Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            System Access
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/login" className="hover:text-green-400 transition">
                Admin Login
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-green-400 transition">
                Student Login
              </a>
            </li>
            <li>
              <a href="/dashboard/students" className="hover:text-green-400 transition">
                Student Records
              </a>
            </li>
            <li>
              <a href="/attendance" className="hover:text-green-400 transition">
                Attendance Reports
              </a>
            </li>
          </ul>
        </div>

        {/* Contact / Institution */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Institution Support
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-green-400" />
              <span>+91 88309 30200</span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-green-400" />
              <span>support@iotattendance.in</span>
            </li>
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-green-400 mt-1" />
              <span>Thane, Maharashtra, India</span>
            </li>
            <li className="flex items-center gap-2">
              <FaClock className="text-green-400" />
              <span>Mon – Sat | 9:00 AM – 6:00 PM</span>
            </li>
          </ul>
        </div>

        {/* Social / Academic */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Academic Network
          </h3>

          <div className="flex items-center gap-3 mb-4 text-sm text-gray-400">
            <FaUserGraduate className="text-green-400" />
            <span>Trusted by Students & Faculty</span>
          </div>

          <div className="flex gap-4 text-2xl">
            <a href="#" className="hover:text-blue-500 transition">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-pink-500 transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-blue-400 transition">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Smart IoT Attendance System  
        <span className="mx-1">|</span>
        Developed by{" "}
        <span className="text-white font-semibold">
          Gaurav Yadav
        </span>
      </div>
    </footer>
  );
};

export default Footer;
