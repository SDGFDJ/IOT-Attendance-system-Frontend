import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useMobile from "../hooks/useMobile";
import UserMenu from "./UserMenu";
import { FaRegCircleUser } from "react-icons/fa6";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { GraduationCap } from "lucide-react";
import { FaMicrochip } from "react-icons/fa";

const Header = () => {
  const [isMobile] = useMobile();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const redirectToLoginPage = () => navigate("/login");

  const handleProfileClick = () => {
    if (!user?._id) {
      redirectToLoginPage();
      return;
    }

    if (user.role === "STUDENT" && user.studentId) {
      navigate(`/dashboard/student/${user.studentId}`);
      return;
    }

    setOpenUserMenu((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 h-16">

        {/* BRAND */}
        <Link to="/" className="flex items-center gap-2">
          <FaMicrochip className="text-green-400 text-2xl" />
          <div className="leading-tight">
            <h1 className="text-lg font-bold">Smart IoT Attendance</h1>
            <p className="text-[11px] text-gray-400">
              Secure • Real-Time • Reliable
            </p>
          </div>
        </Link>

        {/* DESKTOP */}
        <div className="hidden lg:flex items-center gap-8">
          {user?.role === "ADMIN" && (
            <Link
              to="/dashboard/students"
              className="flex items-center gap-2 hover:text-green-400"
            >
              <GraduationCap size={22} />
              <span className="text-sm">Students</span>
            </Link>
          )}

          {user?._id ? (
            <div className="relative">
              <div
                onClick={handleProfileClick}
                className="cursor-pointer flex items-center gap-1 hover:text-green-400"
              >
                <span className="text-sm">Account</span>
                {openUserMenu ? <GoTriangleUp size={16} /> : <GoTriangleDown size={16} />}
              </div>

              {openUserMenu && user.role === "ADMIN" && (
                <div className="absolute right-0 top-10 bg-white text-black shadow-xl rounded-xl p-4 w-64">
                  <UserMenu close={() => setOpenUserMenu(false)} />
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={redirectToLoginPage}
              className="text-sm hover:text-green-400"
            >
              Login
            </button>
          )}
        </div>

        {/* MOBILE ICON */}
        <button className="lg:hidden" onClick={handleProfileClick}>
          <FaRegCircleUser size={24} />
        </button>
      </div>

      {/* ✅ FIXED MOBILE MENU (NO FULL HEIGHT) */}
      {isMobile && openUserMenu && user?.role === "ADMIN" && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setOpenUserMenu(false)}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* floating card */}
          <div
            className="absolute right-2 top-16 bg-white text-black shadow-xl rounded-xl p-4 w-64"
            onClick={(e) => e.stopPropagation()}
          >
            <UserMenu close={() => setOpenUserMenu(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
