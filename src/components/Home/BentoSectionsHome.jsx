// Simple, sin librerías ni efectos. Misma distribución y contenido. Mismo nombre.
import Stepper, { Step } from "./Stepper";

function BentoSectionsHome() {
  return (
    <div className="select-none overflow-hidden w-full flex justify-center bg-transparent h-full lg:max-h-[600px] lg:h-[600px] ">
      <div className="grid gap-2 p-3 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3 auto-rows-[minmax(180px,auto)]">
        {/* Stepper - Large top left (spans 2 columns, 2 rows) */}
        <div
          className="flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-xl lg:col-span-2 lg:row-span-2"
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

        {/* Statistics - Top right first */}
        <div
          className="flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Statistics</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-medium mb-1 truncate">Statistics</h3>
            <p className="text-xs leading-5 opacity-80 line-clamp-2">
              Track user behavior
            </p>
          </div>
        </div>

        {/* trophies - Top right second */}
        <div
          className="flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Trophies</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-medium mb-1 truncate">Trophies</h3>
            <p className="text-xs leading-5 opacity-80 line-clamp-2">
              Centralized data view
            </p>
          </div>
        </div>

        {/* Pet - Middle right (spans 2 columns) */}
        <div
          className="flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-xl lg:col-span-2"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Pets</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-medium mb-1 truncate">Pets</h3>
            <p className="text-xs leading-5 opacity-80 line-clamp-2">
              Streamline workflows
            </p>
          </div>
        </div>

        {/* Quote - Bottom (spans 2 columns) */}
        <div
          className="flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-xl lg:col-span-2"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Motivation</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-medium mb-1 truncate">Quote</h3>
            <p className="text-xs leading-5 opacity-80 line-clamp-2">
              Inspirational daily quotes
            </p>
          </div>
        </div>

        {/* Badges - Bottom left */}
        <div
          className="flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Books</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-medium mb-1 truncate">Integration</h3>
            <p className="text-xs leading-5 opacity-80 line-clamp-2">
              Connect favorite tools
            </p>
          </div>
        </div>

        {/* Security - Bottom second */}
        <div
          className="flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Collections</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-medium mb-1 truncate">Security</h3>
            <p className="text-xs leading-5 opacity-80 line-clamp-2">
              Enterprise-grade protection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BentoSectionsHome;
