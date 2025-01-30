import React, { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';

function Signup({ onSignup, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would validate and create account here
    onSignup();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-[#FF4500] rounded-full mb-4">
            <UtensilsCrossed className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join QuickBite today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF4500] focus:ring focus:ring-[#FF4500] focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF4500] focus:ring focus:ring-[#FF4500] focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF4500] focus:ring focus:ring-[#FF4500] focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF4500] focus:ring focus:ring-[#FF4500] focus:ring-opacity-50"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-[#FF4500] focus:ring-[#FF4500]"
              required
            />
            <label className="ml-2 text-sm text-gray-600">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#FF4500] text-white rounded-md hover:bg-[#CC3700] focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-opacity-50"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-[#FF4500] hover:text-[#CC3700] font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;