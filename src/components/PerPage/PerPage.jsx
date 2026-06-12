/* Per-page selector — how many cards to show per view (20 / 40 / 60).
   Reuses the design's segmented (.seg) control. */
const OPTIONS = [20, 40, 60];

export default function PerPage({ value, onChange }) {
  return (
    <div className="perpage">
      <span className="lbl">Show</span>
      <div className="seg">
        {OPTIONS.map((n) => (
          <button
            key={n}
            className={value === n ? 'on' : ''}
            onClick={() => onChange(n)}
            aria-pressed={value === n}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
