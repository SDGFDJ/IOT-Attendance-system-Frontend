import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const isValid = Object.values(data).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.login,
        data,
      });

      if (response.data?.success) {
        toast.success("Login successful");

        // ✅ backend already set cookies
        // ✅ now fetch user using cookie
        const userRes = await Axios({
          ...SummaryApi.userDetails,
        });

        dispatch(setUserDetails(userRes.data.data));

        setData({ email: "", password: "" });
        navigate("/");

      } else {
        toast.error(response.data?.message || "Login failed");
      }

    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>

        <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label>Email :</label>
            <input
              type='email'
              name='email'
              value={data.email}
              onChange={handleChange}
              className='bg-blue-50 p-2 border rounded outline-none'
              placeholder='Enter your email'
            />
          </div>

          <div className='grid gap-1'>
            <label>Password :</label>
            <div className='bg-blue-50 p-2 border rounded flex items-center'>
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                value={data.password}
                onChange={handleChange}
                className='w-full outline-none'
                placeholder='Enter your password'
              />
              <div
                onClick={() => setShowPassword(prev => !prev)}
                className='cursor-pointer'
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>

            <Link
              to="/forgot-password"
              className='block ml-auto hover:text-primary-200'
            >
              Forgot password?
            </Link>
          </div>

          <button
            disabled={!isValid}
            className={`${
              isValid ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"
            } text-white py-2 rounded font-semibold`}
          >
            Login
          </button>
        </form>

        <p>
          Don't have account?{" "}
          <Link to="/register" className='font-semibold text-green-700'>
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
