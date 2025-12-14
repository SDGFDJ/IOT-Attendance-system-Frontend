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

// User Dashboard Pages
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




// Admin Pages (E-Commerce Safe)
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
      // 👉 PUBLIC ROUTES
      { path: "", element: <Home /> },
      { path: "search", element: <SearchPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verification-otp", element: <OtpVerification /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "user", element: <UserMenuMobile /> },

      // 👉 USER DASHBOARD (Protected UI)
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "myorders", element: <MyOrders /> },
          { path: "address", element: <Address /> },

          // ⭐ SMART ATTENDANCE SYSTEM
          { path: "students", element: <StudentsPage /> },
          { path: "add-student", element: <AddStudent /> },
          { path: "student/:id", element: <StudentProfilePage /> },
          { path: "/dashboard/student/:id/attendance",element:<StudentAttendanceCalendar />},
          { path:"/dashboard/attendance/details/:id"
 , element:<AttendanceDayDetails />},
 {
  path: "/dashboard/scan-attendance",
  element: <ScanAttendancePage />
},

          // 🛒 ADMIN (Existing E-Commerce Modules)
          { path: "orders", element: <AdminAllOrders /> },
          { path: "category", element: <CategoryPage /> },
          { path: "subcategory", element: <SubCategoryPage /> },
          { path: "upload-product", element: <UploadProduct /> },
          { path: "product", element: <ProductAdmin /> },
        ],
      },

      // 👉 Dynamic Product Routes (SAFE ORDER)
      { path: "product/:product", element: <ProductDisplayPage /> },

      // 👉 Category/Subcategory Browsing
      {
        path: ":category",
        children: [
          { path: ":subCategory", element: <ProductListPage /> }
        ],
      },

      // 👉 Checkout Routes
      { path: "cart", element: <CartMobile /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "success", element: <Success /> },
      { path: "cancel", element: <Cancel /> },
    ]
  }
]);

export default router;
