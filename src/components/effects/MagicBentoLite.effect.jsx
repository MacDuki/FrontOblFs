// Simple, sin librerías ni efectos. Misma distribución y contenido. Mismo nombre.

function MagicBentoLite() {
  return (
    <div className="select-none overflow-hidden w-full flex justify-center bg-transparent h-full lg:max-h-[600px] lg:h-[600px] ">
      <div className="grid gap-2 p-3 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3 auto-rows-[minmax(180px,auto)]">
        {/* Stepper - Large top left (spans 2 columns, 2 rows) */}
        <div
          className="flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-xl lg:col-span-2 lg:row-span-2"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Teamwork</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-medium mb-1 truncate">
              Collaboration
            </h3>
            <p className="text-xs leading-5 opacity-80 line-clamp-2">
              Work together seamlessly
            </p>
          </div>
        </div>

        {/* Analytics - Top right first */}
        <div
          className="flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Insights</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-medium mb-1 truncate">Analytics</h3>
            <p className="text-xs leading-5 opacity-80 line-clamp-2">
              Track user behavior
            </p>
          </div>
        </div>

        {/* Dashboard - Top right second */}
        <div
          className="flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Overview</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-medium mb-1 truncate">Dashboard</h3>
            <p className="text-xs leading-5 opacity-80 line-clamp-2">
              Centralized data view
            </p>
          </div>
        </div>

        {/* Automation - Middle right (spans 2 columns) */}
        <div
          className="flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-xl lg:col-span-2"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Efficiency</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-medium mb-1 truncate">Automation</h3>
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

        {/* Integration - Bottom left */}
        <div
          className="flex flex-col justify-between relative min-h-[180px] w-full p-5 rounded-2xl border border-white/10 text-white overflow-hidden transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-xl"
          style={{ backgroundColor: "#060010" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-base opacity-90">Connectivity</span>
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
            <span className="text-base opacity-90">Protection</span>
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

export default MagicBentoLite;
