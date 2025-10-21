import { IoIosArrowBack } from "react-icons/io";
import banner from "../assets/imgs/banner03.png";
import RevealBannerButton from "./effects/RevealBannerButton.effect.jsx";
function RegisterScreen({ onBack }) {
  return (
    <section className="flex flex-col items-center justify-center space-y-4">
      <IoIosArrowBack className="cursor-pointer text-3xl" onClick={onBack} />
      <hr className="border-gray-700 mb-4" />
      <div className="text-center text-lg font-semibold mb-3">
        Create an account
      </div>

      <form
        className="space-y-3"
        method="POST"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          name="name"
          type="text"
          placeholder="Full name"
          required
          className="input-field w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-xl focus:outline-none focus:ring-apple-500 focus:border-apple-500 sm:text-sm"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="input-field w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-xl focus:outline-none focus:ring-apple-500 focus:border-apple-500 sm:text-sm"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="input-field w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-xl focus:outline-none focus:ring-apple-500 focus:border-apple-500 sm:text-sm"
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          required
          className="input-field w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-xl focus:outline-none focus:ring-apple-500 focus:border-apple-500 sm:text-sm"
        />

        {/* <button
          type="submit"
          className="group relative w-full flex justify-center py-3 px-4 border border-pink-200 text-sm font-medium rounded-xl text-white bg-transparent hover:bg-apple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-apple-500 transition duration-150 ease-in-out"
        >
          Create account
        </button> */}
      </form>
      <RevealBannerButton banner={banner} />
    </section>
  );
}
export { RegisterScreen };
