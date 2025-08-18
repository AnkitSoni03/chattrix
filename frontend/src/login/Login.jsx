import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handelInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const login = await axios.post(`/api/auth/login`, userInput);
      const data = login.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      toast.success(data.message);
      localStorage.setItem("chattrix", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/");
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
            <span className="text-white">Login</span>
            <img
              src="/chattrix-logo-removebg-preview-new.png"
              alt="Chattrix Logo"
              className="h-12 inline-block"
            />
          </h1>

          <form onSubmit={handelSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-200 font-semibold mb-2 text-sm tracking-wide">
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                type="email"
                onChange={handelInput}
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 hover:bg-opacity-70"
              />
            </div>

            <div>
              <label className="block text-gray-200 font-semibold mb-2 text-sm tracking-wide">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                onChange={handelInput}
                placeholder="Enter your password"
                required
                className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 hover:bg-opacity-70"
              />
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
                "Sign In"
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
              Don't have an account?{" "}
              <Link to={"/register"}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 font-bold underline cursor-pointer transition-all duration-200">
                  Register Now!
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
