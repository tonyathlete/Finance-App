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
      <label htmlFor={id} className="text-sm font-semibold text-amber-900">{label}</label>
      {hint && <p className="text-xs text-amber-600">{hint}</p>}

      {/* Quick-select presets */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition-all ${
                value === p
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-white text-amber-700 border-amber-200 hover:border-amber-400 hover:bg-amber-50'
              }`}
            >
              {p >= 1000 ? `${p / 1000}k` : p}$
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 font-bold">$</span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={value === 0 ? '' : value.toString()}
          onChange={handleChange}
          placeholder="0"
          className="w-full pl-7 pr-4 py-3 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-amber-900 font-medium placeholder-amber-300 transition"
        />
      </div>
    </div>
  );
}
