import React from 'react';

interface Props {
  id: string;
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  presets?: number[];
}

export default function CurrencyInput({ id, label, hint, value, onChange, presets }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    onChange(raw === '' ? 0 : parseInt(raw, 10));
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-[#142420]">{label}</label>
      {hint && <p className="text-xs text-[#142420]/60">{hint}</p>}

      {/* Quick-select presets */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`text-xs px-2.5 py-1 rounded-sm border font-semibold transition-all ${
                value === p
                  ? 'bg-[#1B4332] text-[#FBFBF9] border-[#1B4332]'
                  : 'bg-[#FBFBF9] text-[#1B4332] border-[#D8DCD3] hover:border-[#1B4332]'
              }`}
            >
              {p >= 1000 ? `${p / 1000}k` : p}$
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#142420]/50 font-bold font-mono-data">$</span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={value === 0 ? '' : value.toString()}
          onChange={handleChange}
          placeholder="0"
          className="w-full pl-7 pr-4 py-3 rounded-sm border border-[#D8DCD3] bg-[#FBFBF9] focus:outline-none focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332] text-[#142420] font-mono-data font-medium placeholder-[#142420]/30 transition"
        />
      </div>
    </div>
  );
}
