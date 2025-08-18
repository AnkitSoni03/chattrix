import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({});

  const handelInput = (e) => {
    setInputData({
      ...inputData,
      [e.target.id]: e.target.value,
    });
  };

  const selectGender = (selectGender) => {
    setInputData((prev) => ({
      ...prev,
      gender: selectGender === inputData.gender ? "" : selectGender,
    }));
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (inputData.password !== inputData.confpassword.toLowerCase()) {
      setLoading(false);
      return toast.error("Password Dosen't match");
    }
    try {
      const register = await axios.post(`/api/auth/register`, inputData);
      const data = register.data;
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        console.log(data.message);
      }
      toast.success(data?.message);
      localStorage.setItem("chattrix", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-4">
      <div className="w-full max-w-lg mx-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-gray-700">
          <h1 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <span className="text-white">Register</span>
            <img
              src="/chattrix-logo-removebg-preview-new.png"
              alt="Chattrix Logo"
              className="h-12 inline-block"
            />
          </h1>

          <form onSubmit={handelSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-200 font-semibold mb-2 text-sm tracking-wide">
                  FULL NAME
                </label>
                <input
                  id="fullname"
                  type="text"
                  onChange={handelInput}
                  placeholder="Enter Full Name"
                  required
                  className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 hover:bg-opacity-70"
                />
              </div>

              <div>
                <label className="block text-gray-200 font-semibold mb-2 text-sm tracking-wide">
                  USERNAME
                </label>
                <input
                  id="username"
                  type="text"
                  onChange={handelInput}
                  placeholder="Enter UserName"
                  required
                  className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 hover:bg-opacity-70"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-200 font-semibold mb-2 text-sm tracking-wide">
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                type="email"
                onChange={handelInput}
                placeholder="Enter email"
                required
                className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 hover:bg-opacity-70"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-200 font-semibold mb-2 text-sm tracking-wide">
                  PASSWORD
                </label>
                <input
                  id="password"
                  type="password"
                  onChange={handelInput}
                  placeholder="Enter password"
                  required
                  className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 hover:bg-opacity-70"
                />
              </div>

              <div>
                <label className="block text-gray-200 font-semibold mb-2 text-sm tracking-wide">
                  CONFIRM PASSWORD
                </label>
                <input
                  id="confpassword"
                  type="password"
                  onChange={handelInput}
                  placeholder="Enter Confirm password"
                  required
                  className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 hover:bg-opacity-70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-200 font-semibold text-sm tracking-wide">
                GENDER
              </label>
              <div className="flex gap-8 justify-center">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    onChange={() => selectGender("male")}
                    checked={inputData.gender === "male"}
                    type="checkbox"
                    className="w-4 h-4 text-emerald-600 bg-gray-800 border-2 border-gray-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-200 text-sm group-hover:text-emerald-400 transition-colors">
                    Male
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    checked={inputData.gender === "female"}
                    onChange={() => selectGender("female")}
                    type="checkbox"
                    className="w-4 h-4 text-emerald-600 bg-gray-800 border-2 border-gray-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-200 text-sm group-hover:text-emerald-400 transition-colors">
                    Female
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="border-t border-gray-600 flex-1"></div>
              <span className="px-3 text-gray-400 text-xs">OR</span>
              <div className="border-t border-gray-600 flex-1"></div>
            </div>
            <p className="text-gray-300 text-sm">
              Already have an account?{" "}
              <Link to={"/login"}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 font-bold underline cursor-pointer transition-all duration-200">
                  Login Now!
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
