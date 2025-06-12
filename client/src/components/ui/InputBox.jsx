import React from 'react';

export default function InputBox({
  name = '',
  type = 'text',
  onChange,
  ...props
}) {
  return (
    <input
      name={name}
      type={type}
      onChange={onChange}
      className="border border-gray-400 rounded-lg p-2 ps-3 w-full outline-0 text-slate-800 font-inter"
      {...props}
    />
  );
}
