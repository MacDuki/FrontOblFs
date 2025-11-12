import { useForm } from "react-hook-form";
import { IoIosArrowBack } from "react-icons/io";
import { useTranslation } from "react-i18next";
import banner from "../../assets/imgs/banner03.png";
import { useAuth } from "../../hooks/useAuth.js";
import RevealBannerButton from "../Effects/RevealBannerButton.effect.jsx";

function RegisterScreen({ onBack }) {
  const { t } = useTranslation();
  const { register: registerUser, login, isLoading, error, clearError } = useAuth();
  
  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      repeat_password: "",
    }
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    if (error) clearError();

    try {
      const registerResult = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        repeat_password: data.repeat_password,
      });

      if (registerResult.type.endsWith("/fulfilled")) {
        await login({
          username: data.username,
          password: data.password,
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

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder={t('auth.username')}
          {...register("username", { 
            required: t('auth.usernameRequired'),
            minLength: { value: 3, message: t('auth.usernameMinLength') }
          })}
          className="input-field w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-xl focus:outline-none focus:ring-apple-500 focus:border-apple-500 sm:text-sm"
        />
        {errors.username && <span className="text-red-400 text-xs">{errors.username.message}</span>}
        
        <input
          type="email"
          placeholder={t('auth.email')}
          {...register("email", { 
            required: t('auth.emailRequired'),
            pattern: { value: /^\S+@\S+$/i, message: t('auth.emailInvalid') }
          })}
          className="input-field w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-xl focus:outline-none focus:ring-apple-500 focus:border-apple-500 sm:text-sm"
        />
        {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
        
        <input
          type="password"
          placeholder={t('auth.password')}
          {...register("password", { 
            required: t('auth.passwordRequired'),
            minLength: { value: 6, message: t('auth.passwordMinLength') }
          })}
          className="input-field w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-xl focus:outline-none focus:ring-apple-500 focus:border-apple-500 sm:text-sm"
        />
        {errors.password && <span className="text-red-400 text-xs">{errors.password.message}</span>}
        
        <input
          type="password"
          placeholder={t('auth.repeatPassword')}
          {...register("repeat_password", { 
            required: t('auth.repeatPasswordRequired'),
            validate: value => value === password || t('auth.passwordsMismatch')
          })}
          className="input-field w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-xl focus:outline-none focus:ring-apple-500 focus:border-apple-500 sm:text-sm"
        />
        {errors.repeat_password && <span className="text-red-400 text-xs">{errors.repeat_password.message}</span>}

        <button
          type="submit"
          disabled={isLoading || !isValid}
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
