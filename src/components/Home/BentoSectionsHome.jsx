// Simple, sin librerías ni efectos. Misma distribución y contenido. Mismo nombre.
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { GiTrophiesShelf } from "react-icons/gi";
import { HiOutlineCollection } from "react-icons/hi";
import { MdOutlineFormatQuote, MdOutlinePets } from "react-icons/md";
import { TfiStatsUp } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";

import Stepper, { Step } from "./Stepper";

function BentoSectionsHome() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  return (
    <div className="select-none overflow-hidden w-full flex justify-center bg-transparent h-full lg:max-h-[600px] lg:h-[600px] ">
      <div className="grid gap-2 p-3 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3 auto-rows-[minmax(180px,auto)]">
        {/* Stepper */}
        <div
          className="flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/30 lg:col-span-2 lg:row-span-2"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Start reading now</span>
          </div>

          {/* Contenido de stepper */}
          <Stepper
            initialStep={1}
            onStepChange={(step) => {
              console.log(step);
            }}
            onFinalStepCompleted={() => console.log("All steps completed!")}
            backButtonText="Previous"
            nextButtonText="Next"
          >
            <Step>
              <h2>Welcome to the React Bits stepper!</h2>
              <p>Check out the next step!</p>
            </Step>
            <Step>
              <h2>Step 2</h2>
              <img
                style={{
                  height: "100px",
                  width: "100%",
                  objectFit: "cover",
                  objectPosition: "center -70px",
                  borderRadius: "15px",
                  marginTop: "1em",
                }}
                src="https://www.purrfectcatgifts.co.uk/cdn/shop/collections/Funny_Cat_Cards_640x640.png?v=1663150894"
              />
              <p>Custom step content!</p>
            </Step>
            <Step>
              <h2>How about an input?</h2>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name?"
              />
            </Step>
            <Step>
              <h2>Final Step</h2>
              <p>You made it!</p>
            </Step>
          </Stepper>
        </div>

        {/* Statistics  */}
        <div
          className="cursor-pointer flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-all duration-300 ease-out delay-75 hover:scale-[1.05] hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/30"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Stats</span>
          </div>
          <div className="flex flex-col">
            <TfiStatsUp size={48} />
          </div>
        </div>

        {/* trophies  */}
        <div
          className="cursor-pointer flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-all duration-300 ease-out delay-100 hover:scale-[1.05] hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20 hover:border-yellow-500/30"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Trophies</span>
          </div>
          <div className="flex flex-col">
            <GiTrophiesShelf size={48} />
          </div>
        </div>

        {/* Pets */}
        <div
          className=" cursor-pointer flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-all duration-300 ease-out delay-150 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/20 hover:border-green-500/30 lg:col-span-2"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Pets</span>
          </div>
          <div className="flex flex-col">
            <MdOutlinePets size={48} />
          </div>
        </div>

        {/* Quote */}
        <div
          className="cursor-pointer flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-all duration-300 ease-out delay-200 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/20 hover:border-pink-500/30 lg:col-span-2"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Motivation quote</span>
          </div>
          <div className="flex flex-col">
            <MdOutlineFormatQuote size={48} />
          </div>
        </div>

        {/* My Books */}
        <div
          className="cursor-pointer flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-all duration-300 ease-out delay-250 hover:scale-[1.05] hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/30"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">My Books</span>
          </div>
          <div className="flex flex-col">
            <HiOutlineCollection size={48} />
          </div>
        </div>

        {/* Search Books */}
        <div
          className="flex flex-col cursor-pointer justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-all duration-300 ease-out delay-300 hover:scale-[1.05] hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-500/30"
          style={{ backgroundColor: "#060010" }}
          onClick={() => navigate("/discover-books")}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Search Books</span>
          </div>
          <div className="flex flex-col">
            <CiSearch size={48} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BentoSectionsHome;
