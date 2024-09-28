"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { FaSun, FaMoon, FaUser, FaLock, FaUserCheck } from 'react-icons/fa';
import { FaArrowRightToBracket } from 'react-icons/fa6';
import { SlLogin } from "react-icons/sl";
import { TiUserDelete } from "react-icons/ti";

import './styles.css';

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lastLogin, setLastLogin] = useState(''); // State for last login
  const [autoLogin, setAutoLogin] = useState(false); // Trigger for auto-login

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  useEffect(() => {
    // Retrieve saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // Retrieve last logged-in user and password from localStorage
    const lastLoggedInUser = localStorage.getItem('lastLogin');
    const savedPassword = localStorage.getItem('password'); // Stored password (insecure, for demo purposes)
    if (lastLoggedInUser && savedPassword) {
      setLastLogin(lastLoggedInUser);
    }
  }, []);

  // Trigger auto-login after username and password are updated
  useEffect(() => {
    if (autoLogin && username && password) {
      handleSubmit(new Event('submit')); // Trigger form submission
      setAutoLogin(false); // Reset auto-login trigger
    }
  }, [username, password, autoLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const sessionToken = data.sessionToken;
        localStorage.setItem('session', sessionToken);
  
        // Store the username and password in localStorage for future reference
        localStorage.setItem('lastLogin', username);
        localStorage.setItem('password', password); // Store password (not recommended for production)
  
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ !',
          confirmButtonText: 'ตกลง',
        }).then(() => {
          // Navigate to /pos with darkMode as a query parameter
          router.push(`/pos?darkMode=${darkMode}`);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถเข้าสู่ระบบได้',
          confirmButtonText: 'ตกลง',
          text: data.error || 'Something went wrong!',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle click on last login to autofill the username and password, and trigger auto-login
  const handleLastLoginClick = () => {
    const savedPassword = localStorage.getItem('password'); // Retrieve stored password
    if (savedPassword) {
      setUsername(lastLogin); // Autofill username
      setPassword(savedPassword); // Autofill password
      setAutoLogin(true); // Trigger auto-login
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'ไม่พบรหัสผ่าน',
        text: 'กรุณากรอกรหัสผ่านด้วยตนเอง',
      });
    }
  };

  // Handle delete last login functionality
  const handleDeleteLastLogin = () => {
    localStorage.removeItem('lastLogin');
    localStorage.removeItem('password');
    setLastLogin(''); // Clear the lastLogin state
    Swal.fire({
      icon: 'info',
      title: 'ข้อมูลการล็อกอินถูกลบแล้ว',
      confirmButtonText: 'ตกลง',
    });
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-black' : 'bg-blue-200'}`}>
      <header className="flex justify-between items-center p-4">
        <div className="cursor-pointer" onClick={toggleTheme}>
          <div className={`transition-transform duration-500 ${darkMode ? 'rotate-180' : 'rotate-0'}`}>
            {darkMode ? (
              <FaSun className="text-yellow-500 text-2xl transition-colors duration-500 animate-pulse-slow" />
            ) : (
              <FaMoon className="text-blue-800 text-2xl transition-colors duration-500 animate-pulse-slow" />
            )}
          </div>
        </div>
      </header>

      <main className="flex flex-grow justify-center items-center opacity-90">
        {/* Centered Login Card */}
        <div className={`card w-full max-w-sm transition-all duration-1000 ease-in-out shadow-xl ${darkMode ? 'bg-gray-900' : 'bg-blue-500'} slide-in-left animate-fade-in`}>
          <div className="card-body">
            <h1 className={`typewriter-animation text-3xl font-bold text-center ${darkMode ? 'text-blue-300' : 'text-black'} mb-6`}></h1>
            
            <form onSubmit={handleSubmit}>
              <div className="form-control relative mb-4">
                <FaUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-blue-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder=" "
                  className={`peer input input-bordered w-full pl-10 py-3 rounded-md border-2 transition-all duration-200 ease-in-out 
                    ${darkMode ? 'bg-gray-800 text-blue-200 border-gray-600 focus:border-blue-500' : 'bg-blue-100 text-black border-gray-300 focus:border-blue-500'}`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label
                  className={`absolute left-10 top-0 transform -translate-y-1/2 transition-all duration-200 ease-in-out pointer-events-none z-10 px-1
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:-translate-y-1/2 
                    peer-focus:top-[-17px] peer-focus:text-xs peer-focus:translate-y-0 
                    ${username ? 'top-[-9px] text-xs' : ''} 
                    ${darkMode ? 'text-blue-400 peer-focus:text-blue-400' : 'text-black peer-focus:text-black'}`}
                >
                  ชื่อผู้ใช้งาน หรือ อีเมล
                </label>
              </div>

              <div className="form-control relative mb-4 mt-6">
                <FaLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-blue-400' : 'text-gray-500'}`} />
                <input
                  type="password"
                  placeholder=" "
                  className={`peer input input-bordered w-full pl-10 py-3 rounded-md border-2 transition-all duration-200 ease-in-out 
                    ${darkMode ? 'bg-gray-800 text-blue-200 border-gray-600 focus:border-blue-500' : 'bg-blue-100 text-black border-gray-300 focus:border-blue-500'}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label
                  className={`absolute left-10 top-0 transform -translate-y-1/2 transition-all duration-200 ease-in-out pointer-events-none z-10 px-1
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:-translate-y-1/2 
                    peer-focus:top-[-16px] peer-focus:text-xs peer-focus:translate-y-0 
                    ${password ? 'top-[-8px] text-xs' : ''} 
                    ${darkMode ? 'text-blue-400 peer-focus:text-blue-400' : 'text-black peer-focus:text-black'}`}
                >
                  รหัสผ่าน
                </label>
              </div>

              <div className="form-control mt-4">
                <button
                  className={`btn w-full py-2 flex items-center justify-center gap-2 ${
                    darkMode ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-500 hover:bg-blue-400 text-white'
                  } transition-all duration-200 ease-in-out`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'ยืนยันการเข้าสู่ระบบ...' : <>
                    <SlLogin className="text-lg" /> เข้าสู่ระบบ
                  </>}
                </button>
              </div>

              {lastLogin && (
  <>
    <h3 className='mt-4 text-sm font-semibold text-white-600'>
      Quick Last Login
    </h3>

    <div className="flex items-center justify-between mt-2">
  {/* Quick Login Information */}
  <div
    className={`last-login-container flex items-center justify-between w-full max-w-[500px] p-3 rounded-md shadow-md transition-transform transform hover:scale-105 cursor-pointer ${
      darkMode ? 'bg-gray-800 border-blue-500' : 'bg-blue-100 border-blue-300'
    }`}
    onClick={handleLastLoginClick} // Clickable quick login
  >
    <div className="flex items-center space-x-2">
      <FaUserCheck className={`text-xl ${darkMode ? 'text-blue-500' : 'text-blue-700'}`} />
      <span className={`text-sm font-medium ${darkMode ? 'text-blue-500' : 'text-blue-800'}`}>
        <strong>{lastLogin}</strong>
      </span>
    </div>

    <FaArrowRightToBracket className={`text-sm arrow-icon transition-transform duration-300 ${darkMode ? 'text-blue-500' : 'text-blue-700'}`} />
  </div>

  {/* Delete Last Login Icon with Tooltip */}
  <div className="ml-4 relative flex items-center space-x-2 group">
    <TiUserDelete
      onClick={handleDeleteLastLogin} // Call the delete function
      className="text-2xl cursor-pointer text-red-500 hover:text-red-700"
    />
    <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      ลบข้อมูลการล็อกอิน
    </span>
  </div>
</div>



  </>
)}


            </form>

            <p className="mt-4 text-center">
              <a
                href="/get-pos"
                className={`link ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-white hover:text-blue-300'}`}
              >
                รับการใช้งานระบบ
              </a>
            </p>
          </div>
        </div>
      </main>

      <footer className="footer footer-center bg-base-300 text-base-content p-4 mt-auto">
        <aside>
          <p>Copyright © {new Date().getFullYear()} - All right reserved by Supernatural Co. Ltd</p>
        </aside>
      </footer>
    </div>
  );
};

export default Login;
