import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// Public Pages
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import UserMenuMobile from "../pages/UserMenuMobile";

// Dashboard Layout
import Dashboard from "../layouts/Dashboard";
import Profile from "../pages/Profile";
import MyOrders from "../pages/MyOrders";
import Address from "../pages/Address";

// Smart Attendance Pages
import StudentsPage from "../pages/StudentsPage";
import AddStudent from "../pages/AddStudent";
import StudentProfilePage from "../pages/StudentProfilePage";
import StudentAttendanceCalendar from "../pages/StudentAttendanceCalendar";
import AttendanceDayDetails from "../pages/AttendanceDayDetails";
import ScanAttendancePage from "../pages/ScanAttendancePage";

// Admin Pages
import AdminAllOrders from "../pages/AdminAllOrders";
import CategoryPage from "../pages/CategoryPage";
import SubCategoryPage from "../pages/SubCategoryPage";
import UploadProduct from "../pages/UploadProduct";
import ProductAdmin from "../pages/ProductAdmin";

// Product Pages
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartMobile from "../pages/CartMobile";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [

      // 🔓 PUBLIC ROUTES
      { index: true, element: <Home /> },
      { path: "search", element: <SearchPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verification-otp", element: <OtpVerification /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "user", element: <UserMenuMobile /> },

      // 🔐 DASHBOARD
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "myorders", element: <MyOrders /> },
          { path: "address", element: <Address /> },

          // ✅ SMART ATTENDANCE
          { path: "students", element: <StudentsPage /> },
          { path: "add-student", element: <AddStudent /> },
          { path: "student/:id", element: <StudentProfilePage /> },
          { path: "student/:id/attendance", element: <StudentAttendanceCalendar /> },
          { path: "attendance/details/:id", element: <AttendanceDayDetails /> },
{ path: "attendance-scan", element: <ScanAttendancePage /> },

          // 🛒 ADMIN
          { path: "orders", element: <AdminAllOrders /> },
          { path: "category", element: <CategoryPage /> },
          { path: "subcategory", element: <SubCategoryPage /> },
          { path: "upload-product", element: <UploadProduct /> },
          { path: "product", element: <ProductAdmin /> },
        ],
      },

      // 🧾 PRODUCT DISPLAY
      { path: "product/:product", element: <ProductDisplayPage /> },

      // 🛍️ CATEGORY BROWSING (KEEP LAST)
      {
        path: ":category/:subCategory",
        element: <ProductListPage />,
      },

      // 💳 CHECKOUT
      { path: "cart", element: <CartMobile /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "success", element: <Success /> },
      { path: "cancel", element: <Cancel /> },
    ],
  },
]);

export default router;
