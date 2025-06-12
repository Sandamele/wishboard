import Password from '../components/ui/Password';
import Button from '../components/ui/Button';
import InputBox from '../components/ui/InputBox';
import { FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router';
import { useFormik } from 'formik';
import { registerSchema } from '../schema/registerSchema';
export default function Register() {
  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      console.log(values)
    },
  });
  return (
    <>
      <title>Sign Up | Wishboard</title>
      <div className="text-center mb-3">
        <h2 className="text-2xl font-bold mb-2">Create your account</h2>
        <h3 className="text-sm text-slate-400">
          Sign up get started with Wishboard
        </h3>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="mt-5">
          <label className="text-sm">Email</label>
          <InputBox
            name="email"
            id="email"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.email}
            placeholder="Enter your email"
          />
          {(formik.touched.email && formik.errors.email) ? <span className='text-[12px] text-red-500'>{formik.errors.email}</span> : ""}
        </div>
        <div className="mt-5">
          <label className="text-sm">Username</label>
          <InputBox
            name="username"
            id="username"
            type="text"
            placeholder="Enter your username"
            onChange={formik.handleChange}
            value={formik.values.username}
          />
          {(formik.touched.username && formik.errors.username) ? <span className='text-[12px] text-red-500'>{formik.errors.username}</span> : ""}
        </div>
        <div className="mt-5">
          <label className="text-sm">Password</label>
          <Password
            name="newPassword"
            id="newPassword"
            onChange={formik.handleChange}
            value={formik.values.newPassword}
            placeholder="Enter your password"
          />
          {(formik.touched.newPassword && formik.errors.newPassword) ? <span className='text-[12px] text-red-500'>{formik.errors.newPassword}</span> : ""}

        </div>
        <div className="mt-5">
          <label className="text-sm">Confirm Password</label>
          <Password
            name="confirmPassword"
            id="confirmPassword"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            placeholder="Confirm your password"
          />
          {(formik.touched.confirmPassword && formik.errors.confirmPassword) ? <span className='text-[12px] text-red-500'>{formik.errors.confirmPassword}</span> : ""}
        </div>
        <Button className="mt-6" type="submit">Sign Up</Button>
      </form>
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300" />
        <span className="mx-4 text-gray-500 text-sm">or</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>
      <Button
        className="flex items-center justify-center p-2 border border-slate-400 bg-white"
        textClass="text-indigo"
      >
        <FaGoogle className="me-2 text-red-500" /> Continue with Google
      </Button>
      <p className="mt-6 text-center text-slate-600">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-indigo">
          Login
        </Link>
      </p>
    </>
  );
}
