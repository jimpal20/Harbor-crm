import React from 'react';
import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* App Icon/Logo would go here */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;