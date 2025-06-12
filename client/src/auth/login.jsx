import React from 'react';
import InputBox from '../components/ui/InputBox';
import Password from '../components/ui/Password';
import Button from '../components/ui/Button';
import { FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router';
export default function Login() {
  return (
    <>
      <title>Login | Wishboard</title>
      <div className="text-center mb-3">
        <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
        <h3 className="text-sm text-slate-400">
          Login to continue where you left off
        </h3>
      </div>
      <div className="mt-5">
        <label className="text-sm">Email</label>
        <InputBox name="email" type="text" placeholder="Enter your email" />
      </div>
      <div className="mt-5">
        <label className="text-sm">Password</label>
        <Password name="new-password" placeholder="Enter your password" />
      </div>
      <Button className="mt-6">Sign Up</Button>
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300" />
        <span className="mx-4 text-gray-500 text-sm">or</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>
      <Button
        className="flex items-center justify-center p-2 border border-slate-400 bg-white"
        textClass="text-indigo"
      >
        <FaGoogle className="me-2 text-red-500" /> Login with Google
      </Button>
      <p className="mt-6 text-center text-slate-600">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-indigo">
          Sign up
        </Link>
      </p>
    </>
  );
}
