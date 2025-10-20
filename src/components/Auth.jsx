import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import logoW from "../assets/v4wNoBg.png";
import "./auth.css";
import BlurText from "./effects/BlurText.effect.jsx";
import MechanicalText from "./effects/MechanicalText.effect.jsx";
export default function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  return (
    <main className="font-general min-h-full flex items-center justify-center py-12 px-4 text-gray-100 select-none ">
      {/* //definicion de card */}
      <section
        className={` ${
          isLogin || isRegister ? "hidden" : "flex flex-col"
        } max-w-sm  w-full rounded-xl p-4 space-y-6`}
      >
        {/* Header part */}
        <div>
          <div className="flex w-full justify-center">
            <MechanicalText
              className="mt-6 text-center text-[70px] font-Relieve"
              text={"weRead"}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              initialDelay={1300}
            />
            <img src={logoW} className="w-38 h-auto" />
          </div>

          <div className="mt-4 h-36">
            <BlurText
              text={[
                "La información es libertadora. La educación es la premisa del progreso, en toda sociedad, en toda familia.",
              ]}
              className="h-24"
              delay={50}
            />
            <p className="py-2">
              <strong>Kofi Annan</strong>
            </p>
          </div>
        </div>
        {/* Buttons part */}

        <div
          className="flex flex-col
           justify-between items-center w-full space-y-4 "
        >
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setIsRegister(false);
            }}
            class="cursor-pointer group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-[#6B2F4A] hover:before:[box-shadow:_20px_20px_20px_30px_#2B444D] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4 origin-left hover:decoration-2 hover:text-[#6B2F4A] relative bg-[#000000] h-16 w-64 border text-left p-3 text-gray-50 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-[#6B2F4A] before:rounded-full before:blur-lg after:absolute after:z-10 after:w-20 after:h-20 after:content[''] after:bg-[#2B444D] after:right-8 after:top-3 after:rounded-full after:blur-lg hover:scale-105"
          >
            Sign In
          </button>

          <div class="relative group">
            <button
              onClick={() => {
                setIsLogin(false);
                setIsRegister(!isRegister);
              }}
              class="relative inline-block p-px font-semibold leading-6 text-white bg-[#000000] shadow-2xl cursor-pointer rounded-2xl shadow-[#2B444D] transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-[#6B2F4A]"
            >
              <span class="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#6B2F4A] via-[#2B444D] to-[#000000] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
              <span class="relative z-10 block px-6 py-3 rounded-2xl bg-[#000000]">
                <div class="relative z-10 flex items-center space-x-3">
                  <span class="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-[#6B2F4A]">
                    Begin Journey
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-[#6B2F4A]"
                  >
                    <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
                  </svg>
                </div>
              </span>
            </button>
          </div>

          {/* <button
         
            className="cursor-pointer w-full h-12 py-2 px-4 border rounded-xl xl:w-32 xl:h-32"
          >
            Login
          </button>
          <button
          
            className="cursor-pointer py-2 px-4 border rounded-xl  xl: w-32 h-32   "
          >
            Register
          </button> */}
        </div>
      </section>
      {/* Login part */}
      <section className={`${isLogin ? "block enter" : "exit hidden"}`}>
        <div
          className="flex
            items-center
            justify-center
          "
        >
          <div className="w-1/4">
            <IoIosArrowBack
              className="cursor-pointer text-3xl"
              onClick={() => {
                setIsLogin(false);
              }}
            />
          </div>
          <div className="w-3/4 ">
            <h2 className="">We are glad to see you again!</h2>
          </div>
        </div>
        {/* start login */}
        <form className="mt-8 space-y-6" method="POST">
          {/* Inputs fields */}
          <div className="rounded-xl shadow-sm space-y-4">
            {/* Email input field */}
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
            {/* Password input field */}
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
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-apple-600 focus:ring-apple-500 border-gray-100 rounded-xl"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-100"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-apple-600 hover:text-apple-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          {/* Button sign in */}
          <div>
            <div class="relative group">
              <button class="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
                <span class="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>

                <span class="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                  <div class="relative z-10 flex items-center space-x-2">
                    <span class="transition-all duration-500 group-hover:translate-x-1">
                      Sign In
                    </span>
                    <svg
                      class="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                      data-slot="icon"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clip-rule="evenodd"
                        d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                        fill-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </span>
              </button>
            </div>
          </div>
        </form>

        <div className="text-center mt-10 text-sm text-gray-200">
          Don't have an account?
          <a
            href="#"
            className="font-medium text-apple-600 pl-2 hover:text-apple-500"
          >
            Create one now
          </a>
        </div>
        {/* End login  */}
      </section>

      {/*Register part*/}
      <section className={`${isRegister ? "block enter" : "exit hidden"} pt-4`}>
        <IoIosArrowBack
          className="cursor-pointer text-3xl"
          onClick={() => {
            setIsRegister(false);
          }}
        />
        <hr className="border-gray-700 mb-4" />
        <div className="text-center text-lg font-semibold mb-3">
          Create account
        </div>
        <form
          className="space-y-3"
          method="POST"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <input
              name="name"
              type="text"
              placeholder="Full name"
              required
              className="input-field appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-xl focus:outline-none focus:ring-apple-500 focus:border-apple-500 sm:text-sm"
            />
          </div>

          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="input-field appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-xl focus:outline-none focus:ring-apple-500 focus:border-apple-500 sm:text-sm"
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="input-field appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-xl focus:outline-none focus:ring-apple-500 focus:border-apple-500 sm:text-sm"
            />
          </div>

          <div>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              required
              className="input-field appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-xl focus:outline-none focus:ring-apple-500 focus:border-apple-500 sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-pink-200 text-sm font-medium rounded-xl text-white bg-transparent hover:bg-apple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-apple-500 transition duration-150 ease-in-out"
            >
              Create account
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
