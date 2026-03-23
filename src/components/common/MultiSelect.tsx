import React, { useState, useRef, useEffect } from 'react';

interface MultiSelectProps {
  label: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  values,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (val: string) => {
    if (values.includes(val)) onChange(values.filter((x) => x !== val));
    else onChange([...values, val]);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          color: values.length ? 'var(--accent2)' : 'var(--text2)',
          padding: '5px 10px',
          borderRadius: 'var(--radius)',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          fontFamily: 'var(--font)',
          transition: 'border-color .2s',
        }}
      >
        {label}
        {values.length > 0 && (
          <span
            style={{
              background: 'var(--accent)',
              color: '#fff',
              borderRadius: 20,
              padding: '0 5px',
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            {values.length}
          </span>
        )}
        <span style={{ fontSize: 9, opacity: 0.5 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            zIndex: 1000,
            minWidth: 150,
            padding: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,.6)',
          }}
        >
          {options.map((opt) => (
            <label
              key={opt}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 12,
                color: values.includes(opt) ? 'var(--accent2)' : 'var(--text2)',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={values.includes(opt)}
                onChange={() => toggle(opt)}
                style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};