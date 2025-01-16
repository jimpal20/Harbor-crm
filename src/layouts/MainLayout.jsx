import { Outlet, useLocation } from "react-router-dom";
import SignOutButton from "../components/SignOutButton";
import { ChevronLeft } from "lucide-react";

export default function MainLayout() {
  const location = useLocation();
  const isContactPage = location.pathname.includes('/contacts/');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="flex h-16 items-center justify-between">
            {isContactPage ? (
              <div className="flex items-center">
                <button 
                  onClick={() => window.history.back()}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-xl font-semibold text-gray-900">Contact Details</h1>
              </div>
            ) : (
              <h1 className="text-xl font-semibold text-gray-900">Harbor CRM</h1>
            )}
            <SignOutButton />
          </div>
        </div>
      </nav>
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl sm:px-6 md:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}