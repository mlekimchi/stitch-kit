import { useTimer } from '../../hooks/useTimer';
import { useStore } from '../../store/useStore';

export function TimerSection() {
  const { timer, formatTime, getRate } = useTimer();
  const { startTimer, stopTimer, lapTimer, resetTimer } = useStore(s => ({
    startTimer: s.startTimer,
    stopTimer:  s.stopTimer,
    lapTimer:   s.lapTimer,
    resetTimer: s.resetTimer,
  }));

  const rate = getRate();

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-cream-200 overflow-hidden">
      <div className="px-4 pt-3 pb-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Timer</h3>

        {/* Elapsed */}
        <div className="text-center mb-3">
          <span className="text-3xl font-mono font-semibold text-gray-800 tabular-nums">
            {formatTime(timer.elapsed)}
          </span>
          {timer.isRunning && (
            <span className="ml-2 inline-block w-2 h-2 bg-rose-dusty rounded-full animate-pulse" />
          )}
        </div>

        {/* Rate */}
        {rate && (
          <div className="flex justify-center gap-4 mb-3 text-xs text-gray-500">
            <span className="bg-cream-100 px-2 py-1 rounded-lg">
              <span className="font-semibold text-gray-700">{rate.minPerRow.toFixed(1)}</span> min/row
            </span>
            <span className="bg-cream-100 px-2 py-1 rounded-lg">
              <span className="font-semibold text-gray-700">{Math.round(rate.rowsPerHour)}</span> rows/hr
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          {!timer.isRunning ? (
            <button
              onClick={startTimer}
              className="flex-1 py-2.5 bg-sage text-white font-medium rounded-xl text-sm hover:bg-sage-dark active:scale-95 transition-all"
            >
              ▶ Start
            </button>
          ) : (
            <button
              onClick={stopTimer}
              className="flex-1 py-2.5 bg-rose-dusty text-white font-medium rounded-xl text-sm hover:bg-rose-dark active:scale-95 transition-all"
            >
              ■ Stop
            </button>
          )}
          <button
            onClick={lapTimer}
            disabled={!timer.isRunning}
            className="px-4 py-2.5 bg-cream-200 text-gray-600 font-medium rounded-xl text-sm disabled:opacity-40 hover:bg-cream-300 active:scale-95 transition-all"
          >
            Lap
          </button>
          <button
            onClick={resetTimer}
            className="px-3 py-2.5 bg-cream-100 text-gray-400 font-medium rounded-xl text-sm hover:bg-cream-200 active:scale-95 transition-all"
          >
            ↺
          </button>
        </div>
      </div>

      {/* Lap log */}
      {timer.laps.length > 0 && (
        <div className="border-t border-cream-200 px-4 py-2 max-h-32 overflow-y-auto">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Laps</p>
          {[...timer.laps].reverse().map((lap, i) => (
            <div key={lap.id} className="flex justify-between text-xs text-gray-600 py-0.5">
              <span className="text-gray-400">#{timer.laps.length - i}</span>
              <span className="truncate mx-2 text-gray-500">{lap.sectionName} row {lap.rowNumber}</span>
              <span className="font-mono tabular-nums">{
                (() => {
                  const s = Math.floor(lap.elapsed / 1000) % 60;
                  const m = Math.floor(lap.elapsed / 60000);
                  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
                })()
              }</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
