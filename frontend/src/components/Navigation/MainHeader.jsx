import { NavLink } from "react-router-dom";

const MainHeader = () => {
  return (
    <nav className="bg-gray-800">
      
        <div className="header-container p-6 flex gap-5 justify-start border">
          <NavLink
            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
            to="/"
          >
            Dashboard
          </NavLink>
          <NavLink
            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
            to="/projects"
          >
            Projects
          </NavLink>
        </div>
      
    </nav>
  );
};

export default MainHeader;
