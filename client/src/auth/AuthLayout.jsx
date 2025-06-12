import React from 'react';
import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <div className="font-inter  justify-self-center-safe mt-16 w-[400px] p-5 shadow/20 rounded-2xl">
      <Outlet />
    </div>
  );
}
