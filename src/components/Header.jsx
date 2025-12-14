import React, { useState } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';
import { GraduationCap } from "lucide-react";

const Header = () => {
  const [isMobile] = useMobile()
  const location = useLocation()
  const isSearchPage = location.pathname === "/search"
  const navigate = useNavigate()
  const user = useSelector((state)=> state?.user)
  const [openUserMenu,setOpenUserMenu] = useState(false)
  const cartItem = useSelector(state => state.cartItem.cart)
  const { totalPrice, totalQty} = useGlobalContext()
  const [openCartSection,setOpenCartSection] = useState(false)

  const redirectToLoginPage = ()=> {
      navigate("/login")
  }

  // ⭐ Handle Profile Click Based On Role ⭐
  const handleProfileClick = () => {
    if (!user?._id) return redirectToLoginPage();

    if (user.role === "STUDENT" && user.studentId) {
      return navigate(`/dashboard/student/${user.studentId}`);
    }

    setOpenUserMenu(prev => !prev);
  };

  return (
    <header className='h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center bg-white'>
      {
        !(isSearchPage && isMobile) && (
          <div className='container mx-auto flex items-center px-2 justify-between'>

            {/* Logo */}
            <Link to={"/"} className='flex items-center'>
              <img src={logo} width={200} alt='logo' className='hidden lg:block' />
              <img src={logo} width={160} alt='logo' className='lg:hidden' />
            </Link>

            {/* Search */}
            <div className='hidden lg:block'>
              <Search/>
            </div>

            {/* Right Side Buttons */}
            <div className='hidden lg:flex items-center gap-10'>

              {/* Students List Only For Admin */}
              { user.role === "ADMIN" && (
<Link to="/dashboard/students" className='flex items-center gap-2 text-gray-700 hover:text-green-700 transition'>
                  <GraduationCap size={24} />
                  <span className="text-sm font-medium">Students</span>
                </Link>
              )}

              {/* Account Handler */}
              { user?._id ? (
                <div className='relative'>
                  <div onClick={handleProfileClick} className='cursor-pointer flex items-center gap-1'>
                    <p className='font-medium text-gray-700'>Account</p>
                    { openUserMenu ? <GoTriangleUp size={22}/> : <GoTriangleDown size={22}/> }
                  </div>

                  { openUserMenu && user.role === "ADMIN" && (
                    <div className='absolute bg-white right-0 top-10 shadow-lg rounded p-4 min-w-52'>
                      <UserMenu close={()=>setOpenUserMenu(false)}/>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={redirectToLoginPage} className='text-lg font-medium hover:text-green-700'>Login</button>
              )}

              {/* Cart Button */}
              <button onClick={()=>setOpenCartSection(true)} className='flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white'>
                <BsCart4 size={26}/>
                <div className='font-semibold text-sm'>
                  {
                    cartItem[0] ? (
                      <>
                        <p>{totalQty} Items</p>
                        <p>{DisplayPriceInRupees(totalPrice)}</p>
                      </>
                    ) : (
                      <p>My Cart</p>
                    )
                  }
                </div>
              </button>

            </div>

            {/* Mobile User Icon */}
            <button className='text-gray-700 lg:hidden' onClick={handleProfileClick}>
              <FaRegCircleUser size={26}/>
            </button>

          </div>
        )
      }

      {/* Mobile Search */}
      <div className='container mx-auto px-2 lg:hidden'>
        <Search/>
      </div>

      {/* Cart Section */}
      { openCartSection && (
        <DisplayCartItem close={()=>setOpenCartSection(false)}/>
      )}

    </header>
  )
}

export default Header
