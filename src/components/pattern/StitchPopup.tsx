import { useState } from 'react';
import { getStitch } from '../../data/stitches';

interface Props {
  abbr: string;
  onClose: () => void;
}

export function StitchPopup({ abbr, onClose }: Props) {
  const stitch = getStitch(abbr);
  const [stepIndex, setStepIndex] = useState(0);

  const hasSteps = !!(stitch?.steps && stitch.steps.length > 1);
  const currentSvg  = hasSteps ? stitch!.steps![stepIndex].svgPath : stitch?.svgPath;
  const stepLabel   = hasSteps ? stitch!.steps![stepIndex].label   : null;
  const totalSteps  = hasSteps ? stitch!.steps!.length : 0;

  const categoryColor =
    stitch?.category === 'decrease' ? 'bg-rose-pale text-rose-dark'    :
    stitch?.category === 'increase' ? 'bg-sage-pale text-sage-dark'     :
    stitch?.category === 'slip'     ? 'bg-cream-200 text-gray-600'      :
    stitch?.category === 'rib'      ? 'bg-sage-pale text-sage-dark'     :
                                      'bg-cream-300 text-gray-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-card mx-6 p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl font-semibold text-gray-800">{abbr}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {stitch ? (
          <>
            {/* SVG diagram — wider/taller for step diagrams */}
            <div
              className={`mx-auto mb-2 bg-cream-100 rounded-2xl flex items-center justify-center ${
                hasSteps ? 'w-full h-44 p-4' : 'w-20 h-20 p-3'
              }`}
              dangerouslySetInnerHTML={{ __html: currentSvg ?? '' }}
            />

            {/* Step navigation */}
            {hasSteps && (
              <div className="flex items-center justify-between mb-3 px-1">
                <button
                  onClick={() => setStepIndex(i => Math.max(0, i - 1))}
                  disabled={stepIndex === 0}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 disabled:opacity-25 hover:bg-cream-200 transition-colors text-lg"
                >‹</button>

                {/* Dot indicators */}
                <div className="flex gap-1.5">
                  {stitch.steps!.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setStepIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === stepIndex ? 'bg-sage scale-125' : 'bg-cream-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setStepIndex(i => Math.min(totalSteps - 1, i + 1))}
                  disabled={stepIndex === totalSteps - 1}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 disabled:opacity-25 hover:bg-cream-200 transition-colors text-lg"
                >›</button>
              </div>
            )}

            {/* Step label or stitch name */}
            {stepLabel
              ? <p className="text-xs font-semibold text-sage-dark text-center mb-3">{stepLabel}</p>
              : <p className="text-sm font-medium text-gray-700 mb-1">{stitch.name}</p>
            }

            <p className="text-sm text-gray-500 leading-relaxed">{stitch.description}</p>

            <span className={`mt-3 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor}`}>
              {stitch.category}
            </span>
          </>
        ) : (
          <p className="text-sm text-gray-500">No diagram available for "{abbr}".</p>
        )}
      </div>
    </div>
  );
}
