import React, { useState ,useEffect} from 'react';
import logo from '../assets/images/logoisimm.png';
import { useNavigate } from 'react-router-dom'; 

const GeneralNavbar = () => {
  const [isFixed, setIsFixed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsFixed(true); // Fixe la navbar après 100px de scroll
      } else {
        setIsFixed(false); // Remet la navbar normale en haut de la page
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
//bg-white p-4 shadow-lg flex justify-between items-center rounded-lg mb-4 border border-gray-200
  return (
    <div className={`p-4 shadow-lg flex justify-between items-center border border-gray-200 mb-4 rounded-lg
      transition-all duration-300 bg-white z-50 ${isFixed ? "fixed top-0 left-0 w-full" : ""}`}>
      {/* Logo et nom de l'application */}
      <div className="flex items-center space-x-4">
        <img
          src={logo}
          alt="Logo de l'application"
          className="w-10 h-10 rounded-md"
        />
        <span
          className="text-2xl font-semibold text-blue-600 tracking-wide"
        >
          ISIMM WorkFlow
        </span>
      </div>

      {/* Boutons de navigation */}
      <div className="flex items-center space-x-6">
        
        <button onClick={()=>{navigate('/');localStorage.removeItem("token");}} 
        className="px-4 py-2 rounded-lg bg-blue-500 text-white shadow-md hover:bg-blue-600 transition duration-300">
          Logout
          
        </button>

        
      </div>
    </div>
  );
};

export default GeneralNavbar;
