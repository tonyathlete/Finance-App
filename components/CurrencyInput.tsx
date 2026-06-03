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
      <label htmlFor={id} className="text-sm font-semibold text-blue-900">{label}</label>
      {hint && <p className="text-xs text-blue-600">{hint}</p>}

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
                  ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                  : 'bg-white text-blue-700 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {p >= 1000 ? `${p / 1000}k` : p}$
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 font-bold">$</span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={value === 0 ? '' : value.toString()}
          onChange={handleChange}
          placeholder="0"
          className="w-full pl-7 pr-4 py-3 rounded-xl border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-blue-900 font-medium placeholder-blue-300 transition"
        />
      </div>
    </div>
  );
}
