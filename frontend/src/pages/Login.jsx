import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate("/");
      } else {
        setServerError("Giriş yapılamadı. Lütfen email ve şifrenizi kontrol edin.");
      }
    } catch (error) {
      setServerError(error.message || "Sunucuya ulaşılamadı. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Hesabınıza Giriş Yapın
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              id="email"
              {...register("email", {
                required: "Email zorunludur",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Geçersiz email adresi",
                },
              })}
              type="email"
              autoComplete="email"
              placeholder="email@example.com"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Şifre</label>
            <input
              id="password"
              {...register("password", {
                required: "Şifre zorunludur",
              })}
              type="password"
              autoComplete="current-password"
              placeholder="******"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {serverError && <p className="text-red-500 text-sm mt-2 text-center">{serverError}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center text-gray-500 dark:text-gray-400 text-sm">
          <Link to="/reset-password" className="text-blue-600 dark:text-blue-400 hover:underline">
            Şifrenizi mi unuttunuz?
          </Link>
          <div className="mt-2">
            Hesabınız yok mu?{" "}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
              Hemen Kaydolun
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
