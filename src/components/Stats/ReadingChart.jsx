import { useMemo } from "react";

function ReadingChart({ libraryItems }) {
  const chartData = useMemo(() => {
    if (!libraryItems || libraryItems.length === 0) {
      return {
        reading: 0,
        completed: 0,
        toRead: 0,
      };
    }

    const reading = libraryItems.filter(
      (item) => item.estado === "LEYENDO"
    ).length;
    const completed = libraryItems.filter(
      (item) => item.estado === "TERMINADO"
    ).length;
    const toRead = libraryItems.filter(
      (item) => item.estado === "NONE" || !item.estado
    ).length;

    return { reading, completed, toRead };
  }, [libraryItems]);

  const total = chartData.reading + chartData.completed + chartData.toRead || 1;
  const readingPercent = ((chartData.reading / total) * 100).toFixed(0);
  const completedPercent = ((chartData.completed / total) * 100).toFixed(0);
  const toReadPercent = ((chartData.toRead / total) * 100).toFixed(0);

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 h-full flex flex-col">
      <h3 className="text-white font-semibold mb-4">Reading Distribution</h3>

      {/* Progress Bars */}
      <div className="flex-1 flex flex-col justify-center gap-6">
        {/* Reading */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70 text-sm">Currently Reading</span>
            <span className="text-white font-semibold">
              {chartData.reading} ({readingPercent}%)
            </span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${readingPercent}%` }}
            />
          </div>
        </div>

        {/* Completed */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70 text-sm">Completed</span>
            <span className="text-white font-semibold">
              {chartData.completed} ({completedPercent}%)
            </span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
              style={{ width: `${completedPercent}%` }}
            />
          </div>
        </div>

        {/* To Read */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70 text-sm">To Read</span>
            <span className="text-white font-semibold">
              {chartData.toRead} ({toReadPercent}%)
            </span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${toReadPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
          <span className="text-white/60 text-xs">Reading</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600" />
          <span className="text-white/60 text-xs">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600" />
          <span className="text-white/60 text-xs">To Read</span>
        </div>
      </div>
    </div>
  );
}

export default ReadingChart;
