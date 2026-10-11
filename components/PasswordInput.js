'use client';

import { useState } from 'react';

export default function PasswordInput({ id, value, onChange, minLength, autoComplete = 'current-password', ...rest }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        className="input pr-16"
        value={value}
        onChange={onChange}
        minLength={minLength}
        autoComplete={autoComplete}
        required
        {...rest}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-2 top-[calc(50%+4px)] -translate-y-1/2 px-2 py-1 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/10"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
