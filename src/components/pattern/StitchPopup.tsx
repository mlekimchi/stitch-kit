import { getStitch } from '../../data/stitches';

interface Props {
  abbr: string;
  onClose: () => void;
}

export function StitchPopup({ abbr, onClose }: Props) {
  const stitch = getStitch(abbr);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-card mx-6 p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl font-semibold text-gray-800">{abbr}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {stitch ? (
          <>
            <div
              className="w-20 h-20 mx-auto mb-4 bg-cream-100 rounded-2xl p-3"
              dangerouslySetInnerHTML={{ __html: stitch.svgPath }}
            />
            <p className="text-sm font-medium text-gray-700 mb-1">{stitch.name}</p>
            <p className="text-sm text-gray-500 leading-relaxed">{stitch.description}</p>
            <span className={`mt-3 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
              stitch.category === 'decrease' ? 'bg-rose-pale text-rose-dark' :
              stitch.category === 'slip'     ? 'bg-cream-200 text-yarn-brown' :
              stitch.category === 'rib'      ? 'bg-sage-pale text-sage-dark' :
                                               'bg-cream-300 text-yarn-brown'
            }`}>
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
