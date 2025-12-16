import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { GraduationCap, X } from "lucide-react";
import isAdmin from "../utils/isAdmin";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout });
      if (response.data.success) {
        close?.();
        dispatch(logout());
        localStorage.clear();
        toast.success("Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleClose = () => close?.();

  return (
    <div className="flex flex-col h-full">

      {/* 🔝 HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Account
        </h2>
        <button
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X size={22} />
        </button>
      </div>

      {/* 👤 USER INFO */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-500">Signed in as</p>
        <p className="font-medium text-gray-800 truncate">
          {user.name || user.mobile}
        </p>

        <Link
          onClick={handleClose}
          to="/dashboard/profile"
          className="inline-block mt-2 text-sm text-green-600 hover:underline"
        >
          View Profile →
        </Link>
      </div>

      <Divider />

      {/* 📋 MENU */}
      <div className="flex-1 overflow-y-auto space-y-1 text-sm mt-2">

        {/* ADMIN OPTIONS */}
        {isAdmin(user.role) && (
          <>
            <Link
              onClick={handleClose}
              to="/dashboard/students"
              className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-green-50 transition"
            >
              <GraduationCap size={18} />
              <span>Students</span>
            </Link>

            <Link
              onClick={handleClose}
              to="/dashboard/add-student"
              className="px-3 py-3 rounded-md hover:bg-green-50 transition"
            >
              + Add Student
            </Link>

            <Divider />
          </>
        )}

        {/* COMMON */}
        <Link
          onClick={handleClose}
          to="/dashboard/address"
          className="px-3 py-3 rounded-md hover:bg-gray-100 transition"
        >
          Saved Address
        </Link>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-3 rounded-md text-red-600 hover:bg-red-50 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
