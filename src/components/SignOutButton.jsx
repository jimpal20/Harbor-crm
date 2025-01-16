import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

export default function SignOutButton() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <LogOut className="w-4 h-4 mr-2 text-gray-500" />
      Sign Out
    </button>
  );
}