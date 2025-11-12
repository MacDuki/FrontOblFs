import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useTranslation } from "react-i18next";
import banner from "../../assets/imgs/banner03.png";
import { useAuth } from "../../hooks/useAuth.js";
import RevealBannerButton from "../Effects/RevealBannerButton.effect.jsx";
function RegisterScreen({ onBack }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeat_password: "",
  });
  const { register, login, isLoading, error, clearError } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Solo limpiar error si el usuario ha cambiado significativamente los datos
    // No limpiar inmediatamente para que pueda leer el mensaje
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.repeat_password) {
      alert(t('auth.passwordsMismatch'));
      return;
    }

    if (!formData.username || !formData.email || !formData.password) return;

    
    if (error) clearError();

    try {
     
      const registerResult = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        repeat_password: formData.repeat_password,
      });

     
      if (registerResult.type.endsWith("/fulfilled")) {
        await login({
          username: formData.username,
          password: formData.password,
          rememberMe: true, 
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center space-y-4 h-auto">
      <IoIosArrowBack className="cursor-pointer text-3xl" onClick={onBack} />
      <hr className="border-gray-700 mb-4" />
      <div className="text-center text-lg font-semibold mb-3">
        {t('auth.createAccount')}
      </div>

      {error && (
        <div className="w-full p-3 bg-red-500/20 border border-red-500 rounded-xl text-red-300 text-sm flex justify-between items-center">
          <span>{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="ml-2 text-red-300 hover:text-red-100 transition-colors"
            title={t('auth.dismissError')}
          >
            ✕
          </button>
        </div>
      )}

      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          placeholder={t('auth.username')}
          value={formData.username}
          onChange={handleChange}
          required
          className="input-field w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-xl focus:outline-none focus:ring-apple-500 focus:border-apple-500 sm:text-sm"
        />
        <input
          name="email"
          type="email"
          placeholder={t('auth.email')}
          value={formData.email}
          onChange={handleChange}
          required
          className="input-field w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-xl focus:outline-none focus:ring-apple-500 focus:border-apple-500 sm:text-sm"
        />
        <input
          name="password"
          type="password"
          placeholder={t('auth.password')}
          value={formData.password}
          onChange={handleChange}
          required
          className="input-field w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-xl focus:outline-none focus:ring-apple-500 focus:border-apple-500 sm:text-sm"
        />
        <input
          name="repeat_password"
          type="password"
          placeholder={t('auth.repeatPassword')}
          value={formData.repeat_password}
          onChange={handleChange}
          required
          className="input-field w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-xl focus:outline-none focus:ring-apple-500 focus:border-apple-500 sm:text-sm"
        />

        <button
          type="submit"
          disabled={
            isLoading ||
            !formData.username ||
            !formData.email ||
            !formData.password ||
            !formData.repeat_password
          }
          className="group relative w-full flex justify-center py-3 px-4 border border-pink-200 text-sm font-medium rounded-xl text-white bg-transparent hover:bg-apple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-apple-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('common.loading') : t('auth.createAccount')}
        </button>
      </form>

      {/* Opcional: Mantener el botón visual pero sin funcionalidad */}
      <div className="mt-4">
        <RevealBannerButton banner={banner} label="Welcome!" />
      </div>
    </section>
  );
}
export { RegisterScreen };
