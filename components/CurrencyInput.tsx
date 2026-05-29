import React from 'react';

interface Props {
  id: string;
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
}

export default function CurrencyInput({ id, label, hint, value, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    onChange(raw === '' ? 0 : parseInt(raw, 10));
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-amber-900">
        {label}
      </label>
      {hint && <p className="text-xs text-amber-600">{hint}</p>}
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
