import { useThemeTweaks, ACCENTS } from '../../context/ThemeTweaks';
import { I } from '../icons/Icons';
import './TweaksPanel.css';

function Seg({ value, options, onChange }) {
  return (
    <div className="seg tweaks-seg">
      {options.map((o) => (
        <button key={o} className={value === o ? 'on' : ''} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}

export default function TweaksPanel() {
  const { tweaks, setTweak, panelOpen, setPanelOpen } = useThemeTweaks();
  if (!panelOpen) return null;

  return (
    <div className="tweaks-panel glass" role="dialog" aria-label="Appearance settings">
      <div className="tweaks-head">
        <b>Appearance</b>
        <button className="icon-btn" onClick={() => setPanelOpen(false)} aria-label="Close settings">
          <I.close />
        </button>
      </div>
      <div className="tweaks-body">
        <div className="tweaks-sect">Accent</div>
        <div className="tweaks-swatches">
          {ACCENTS.map((c) => (
            <button
              key={c}
              className={'swatch' + (tweaks.accent === c ? ' on' : '')}
              style={{ background: c }}
              onClick={() => setTweak('accent', c)}
              aria-label={`Accent ${c}`}
              aria-pressed={tweaks.accent === c}
            />
          ))}
        </div>

        <div className="tweaks-sect">Ambient</div>
        <Seg value={tweaks.ambient} options={['cool', 'warm', 'slate']} onChange={(v) => setTweak('ambient', v)} />

        <div className="tweaks-sect">Glass blur</div>
        <div className="tweaks-row">
          <input
            type="range"
            min={6}
            max={46}
            step={2}
            value={tweaks.glassBlur}
            onChange={(e) => setTweak('glassBlur', Number(e.target.value))}
            aria-label="Glass blur"
          />
          <span className="tweaks-val">{tweaks.glassBlur}px</span>
        </div>

        <div className="tweaks-sect">Card size</div>
        <Seg value={tweaks.density} options={['compact', 'regular', 'comfy']} onChange={(v) => setTweak('density', v)} />
      </div>
    </div>
  );
}
