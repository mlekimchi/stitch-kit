import { useState } from 'react';
import { getStitch } from '../../data/stitches';
import { StitchPopup } from '../pattern/StitchPopup';

interface StitchCardProps {
  abbr: string;
}

export function StitchCard({ abbr }: StitchCardProps) {
  const stitch = getStitch(abbr);
  const [showPopup, setShowPopup] = useState(false);
  if (!stitch) return null;

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className="w-full flex items-start gap-3 bg-sage-pale rounded-2xl p-3 border border-sage-light active:scale-[0.98] transition-transform text-left"
      >
        <div
          className="w-14 h-14 flex-shrink-0 bg-white rounded-xl p-1.5 shadow-soft"
          dangerouslySetInnerHTML={{ __html: stitch.svgPath }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sage-dark text-sm font-mono">{stitch.abbr}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
              stitch.category === 'decrease' ? 'bg-rose-pale text-rose-dark' :
              stitch.category === 'slip'     ? 'bg-cream-200 text-yarn-brown' :
              stitch.category === 'rib'      ? 'bg-sage-pale text-sage-dark' :
                                               'bg-cream-300 text-yarn-brown'
            }`}>
              {stitch.category}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-0.5 leading-snug">{stitch.name}</p>
          <p className="text-xs text-gray-500 mt-1 leading-snug">{stitch.description}</p>
          {(stitch.steps && stitch.steps.length > 0) && (
            <p className="text-[10px] text-rose-dusty mt-1.5 font-medium">Tap for diagram →</p>
          )}
        </div>
      </button>
      {showPopup && <StitchPopup abbr={abbr} onClose={() => setShowPopup(false)} />}
    </>
  );
}
