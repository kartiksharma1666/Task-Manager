import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <Link to="/dashboard" className="text-lg font-bold">Task List</Link>
      <div>
        {user ? (
          <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
        ) : (
          <Link to="/login" className="px-4">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
