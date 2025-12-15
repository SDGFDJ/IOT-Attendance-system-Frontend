// base URL from .env
export const baseURL = import.meta.env.VITE_API_URL;

const SummaryApi = {

  // ---------------- USER AUTH -------------------
  register: { url: "/api/user/register", method: "post" },
  login: { url: "/api/user/login", method: "post" },
  forgot_password: { url: "/api/user/forgot-password", method: "put" },
  forgot_password_otp_verification: { url: "/api/user/verify-forgot-password-otp", method: "put" },
  resetPassword: { url: "/api/user/reset-password", method: "put" },
  refreshToken: { url: "/api/user/refresh-token", method: "post" },
  userDetails: { url: "/api/user/user-details", method: "get" },
  logout: { url: "/api/user/logout", method: "get" },
  uploadAvatar: { url: "/api/user/upload-avatar", method: "put" },
  updateUserDetails: { url: "/api/user/update-user", method: "put" },

  // ---------------- STUDENT MANAGEMENT -------------------
  addStudent: { url: "/api/user/students", method: "post" },
  getStudents: { url: "/api/user/students", method: "get" },

  getStudentById: (id) => ({
    url: `/api/user/students/${id}`,
    method: "get",
  }),

  updateStudent: (id) => ({
    url: `/api/user/students/${id}`,
    method: "put",
  }),

  deleteStudent: (id) => ({
    url: `/api/user/students/${id}`,
    method: "delete",
  }),

  // ✅ FIXED
  getStudentAttendanceMonth: (id, month, year) => ({
    url: `/api/attendance/by-month/${id}?month=${month}&year=${year}`,
    method: "get",
  }),

  // ---------------- ATTENDANCE SYSTEM -------------------

markAttendance: {
  url: "/api/attendance/scan",
  method: "post",
},

getStudentAttendanceMonth: (id, month, year) => ({
  url: `/api/attendance/by-month/${id}`,
  method: "get",
  params: { month, year },
}),

getStudentAttendanceDay: (id, day, month, year) => ({
  url: `/api/attendance/by-day/${id}`,
  method: "get",
  params: { day, month, year },
}),

  // ---------------- ECOMMERCE -------------------
  addCategory: { url: "/api/category/add-category", method: "post" },
  getCategory: { url: "/api/category/get", method: "get" },
  updateCategory: { url: "/api/category/update", method: "put" },
  deleteCategory: { url: "/api/category/delete", method: "delete" },

  createSubCategory: { url: "/api/subcategory/create", method: "post" },
  getSubCategory: { url: "/api/subcategory/get", method: "post" },
  updateSubCategory: { url: "/api/subcategory/update", method: "put" },
  deleteSubCategory: { url: "/api/subcategory/delete", method: "delete" },

  createProduct: { url: "/api/product/create", method: "post" },
  getProduct: { url: "/api/product/get", method: "post" },
  updateProductDetails: { url: "/api/product/update-product-details", method: "put" },
  deleteProduct: { url: "/api/product/delete-product", method: "delete" },
  searchProduct: { url: "/api/product/search-product", method: "post" },

  addTocart: { url: "/api/cart/create", method: "post" },
  getCartItem: { url: "/api/cart/get", method: "get" },
  updateCartItemQty: { url: "/api/cart/update-qty", method: "put" },
  deleteCartItem: { url: "/api/cart/delete-cart-item", method: "delete" },

  createAddress: { url: "/api/address/create", method: "post" },
  getAddress: { url: "/api/address/get", method: "get" },
  updateAddress: { url: "/api/address/update", method: "put" },
  disableAddress: { url: "/api/address/disable", method: "delete" },

  CashOnDeliveryOrder: { url: "/api/order/cash-on-delivery", method: "post" },
  payment_url: { url: "/api/order/checkout", method: "post" },
  cancelOrder: { url: "/api/order/cancel", method: "post" },
  getOrderItems: { url: "/api/order/order-list", method: "get" },

  getAllOrders: { url: "/api/order/admin/orders", method: "get" },
  updateOrderStatus: { url: "/api/order/admin/update-status", method: "post" },

  uploadImage: { url: "/api/file/upload", method: "post" },
};

export default SummaryApi;