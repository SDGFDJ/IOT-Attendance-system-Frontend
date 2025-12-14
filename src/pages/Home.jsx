import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Wifi, BarChart3 } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      
      {/* ================= HERO SECTION ================= */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-400 to-teal-300">
        <div className="absolute inset-0 bg-black/20"></div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10 text-center px-6 max-w-5xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-xl">
            IoT Attendance System
          </h1>

          <p className="text-xl md:text-2xl text-white/95 mb-10 leading-relaxed">
            Smart • Secure • Automated attendance management using  
            <span className="font-semibold"> IoT & Cloud Technology</span>
          </p>

          <motion.button
            onClick={() => navigate("/dashboard/students")}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 
                       text-white rounded-xl shadow-xl font-semibold text-lg"
          >
            Start Now
          </motion.button>
        </motion.div>
      </div>

      {/* ================= FEATURES SECTION ================= */}
      <div className="container mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-gray-900 mb-14"
        >
          Why Choose Our System?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Feature 1 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-8 shadow-lg border"
          >
            <GraduationCap size={50} className="text-emerald-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Student Management
            </h3>
            <p className="text-gray-600">
              Add, update and manage students with complete profile & photo.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-8 shadow-lg border"
          >
            <Wifi size={50} className="text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              IoT Based Attendance
            </h3>
            <p className="text-gray-600">
              RFID / ESP32 based real-time attendance with high accuracy.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-8 shadow-lg border"
          >
            <BarChart3 size={50} className="text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Reports & Analytics
            </h3>
            <p className="text-gray-600">
              Daily, monthly & student-wise attendance reports instantly.
            </p>
          </motion.div>

        </div>
      </div>

      {/* ================= FOOTER CTA ================= */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to digitize your attendance?
        </h2>

        <motion.button
          onClick={() => navigate("/dashboard/students")}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 bg-white text-emerald-700 
                     rounded-xl font-semibold text-lg shadow-lg"
        >
          Go to Dashboard
        </motion.button>
      </div>

    </section>
  );
};

export default Home;
