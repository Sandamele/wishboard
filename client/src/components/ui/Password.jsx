import { useState } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
export default function Password({ name, onChange, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex border border-gray-400 rounded-lg">
      <input
        name={name}
        type={!showPassword ? 'password' : 'text'}
        onChange={onChange}
        className="rounded-lg p-2 ps-3 w-full outline-0 text-slate-800 font-inter"
        {...props}
      />
      <span
        className="text-2xl text-gray-600 me-2 cursor-pointer mt-2"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
      </span>
    </div>
  );
}
