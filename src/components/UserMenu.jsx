import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink } from "react-icons/hi";
import { GraduationCap } from "lucide-react"; 
import isAdmin from '../utils/isAdmin'

const UserMenu = ({close}) => {

  const user = useSelector((state)=> state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async()=> {
      try {
        const response = await Axios({
          ...SummaryApi.logout
        })
        if(response.data.success){
          close && close()
          dispatch(logout())
          localStorage.clear()
          toast.success("Logged out successfully!")
          navigate("/")
        }
      } catch (error) {
        AxiosToastError(error)
      }
  }

  const handleClose = () => close && close()

  return (
    <div>

      {/* User name + Profile */}
      <div className='font-semibold'>My Account</div>
      <div className='text-sm flex items-center gap-2'>
        <span className='max-w-52 text-ellipsis line-clamp-1'>
          {user.name || user.mobile}
        </span>
        <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-green-600'>
          <HiOutlineExternalLink size={15}/>
        </Link>
      </div>

      <Divider/>

      {/* MENU OPTIONS */}
      <div className='text-sm grid gap-1'>

        {/* Only Admin can see Students Management */}
        {isAdmin(user.role) && (
          <>
            <Link 
              onClick={handleClose} 
              to={"/dashboard/students"} 
              className='px-2 hover:bg-green-100 flex items-center gap-2 py-1'
            >
              <GraduationCap size={18}/>
              Students
            </Link>

            <Link onClick={handleClose} to={"/dashboard/add-student"} className='px-2 hover:bg-green-100 py-1'>
              + Add Student
            </Link>
          </>
        )}


        
        <Link onClick={handleClose} to={"/dashboard/address"} className='px-2 hover:bg-orange-200 py-1'>
          Save Address
        </Link>

        <button onClick={handleLogout} className='text-left px-2 hover:bg-red-200 py-1'>
          Log Out
        </button>

      </div>
    </div>
  )
}

export default UserMenu
