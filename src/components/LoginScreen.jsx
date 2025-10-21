import { IoIosArrowBack } from "react-icons/io";
function LoginScreen({ onBack }) {
  return (
    <section className="h-[450px]">
      <div className="flex items-center justify-center ">
        <div className="w-1/4">
          <IoIosArrowBack
            className="cursor-pointer text-3xl"
            onClick={onBack}
          />
        </div>
        <div className="w-3/4">
          <h2>We are glad to see you again!</h2>
        </div>
      </div>

      <form className="mt-8 space-y-6" method="POST">
        <div className="rounded-xl shadow-sm space-y-4">
          <div>
            <div className="form-control">
              <input type="text" required />
              <label>
                <span style={{ transitionDelay: "0ms" }}>E</span>
                <span style={{ transitionDelay: "50ms" }}>m</span>
                <span style={{ transitionDelay: "100ms" }}>a</span>
                <span style={{ transitionDelay: "150ms" }}>i</span>
                <span style={{ transitionDelay: "200ms" }}>l</span>
              </label>
            </div>
          </div>

          <div>
            <div className="form-control">
              <input type="text" required />
              <label>
                <span style={{ transitionDelay: "0ms" }}>P</span>
                <span style={{ transitionDelay: "50ms" }}>a</span>
                <span style={{ transitionDelay: "100ms" }}>s</span>
                <span style={{ transitionDelay: "150ms" }}>s</span>
                <span style={{ transitionDelay: "200ms" }}>w</span>
                <span style={{ transitionDelay: "250ms" }}>o</span>
                <span style={{ transitionDelay: "300ms" }}>r</span>
                <span style={{ transitionDelay: "350ms" }}>d</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-apple-600 focus:ring-apple-500 border-gray-100 rounded-xl"
            />
            <span className="ml-2 block text-sm text-gray-100">
              Remember me
            </span>
          </label>

          <a
            href="#"
            className="text-sm font-medium text-apple-600 hover:text-apple-500"
          >
            Forgot your password?
          </a>
        </div>

        <div>
          <div className="relative group">
            <button className="relative inline-block p-px font-semibold leading-6 text-white bg-[#040400] shadow-2xl cursor-pointer rounded-xl shadow-[#2f485c] transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#b5412a] via-[#2f485c] to-[#040400] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              <span className="relative z-10 block px-6 py-3 rounded-xl bg-[#040400]">
                <div className="relative z-10 flex items-center space-x-2">
                  <span className="transition-all duration-500 group-hover:translate-x-1">
                    Sign In
                  </span>
                  <svg
                    className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    ></path>
                  </svg>
                </div>
              </span>
            </button>
          </div>
        </div>
      </form>

      <div className="text-center mt-10 text-sm text-gray-200">
        Don&apos;t have an account?
        <a
          href="#"
          className="font-medium text-apple-600 pl-2 hover:text-apple-500"
        >
          Create one now
        </a>
      </div>
    </section>
  );
}

export { LoginScreen };
