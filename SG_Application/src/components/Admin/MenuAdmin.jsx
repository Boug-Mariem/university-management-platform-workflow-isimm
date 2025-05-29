import React, { useState,useEffect } from "react";
import { FaBars } from "react-icons/fa"; 
import { TbHome2 } from "react-icons/tb";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import GeneralNavbar from "../GeneralNavbar";
import NavbarAdmin from "./NavbarAdmin";
import AdminDashboard from "./AdminDashboard";
import { TbChartHistogram } from "react-icons/tb";
import { IoPersonOutline } from "react-icons/io5";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { IoArrowRedoCircleOutline } from "react-icons/io5";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import AfficheEmployer from "./AfficheEmployer";
import AfficheEnseignant from "./AfficheEnseignant";
import AfficheAdmin from "./AfficheAdmin";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import DetailUser from "./DetailUser";
import AjoutEmployer from "./AjoutEmployer";
import AjoutEnseignant from "./AjoutEnseignant";
import AjoutAdmin from "./AjoutAdmin";
import DetailEnseignant from "./DetailEnseignant";
import DetailAdmin from "./DetailAdmin";
import DemandeRecuSimple from "./DemandeRecuSimple";
import CreateTache from "./CreateTache";
import DetailAttestation from "./DetailAttestation";
import DetailDemandeConge from "./DetailDemandeConge";
import ToutesTaches from "./ToutesTaches";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { FaRegFilePdf } from "react-icons/fa6";
import RapportPDF from "./RapportPDF";
import AfficheEmployerSimple from "./AfficheEmployerSimple";
import AfficheEnseignantSimple from "./AfficheEnseignantSimple";
import AdminProfileSimple from "./AdminProfileSimple";
import ChangePassword from "./ChangePassword";
import { motion } from "framer-motion";
import { jwtDecode } from 'jwt-decode';





const MenuAdmin = () => {
  const navigate = useNavigate();
  const [CinUser, setCinUser] = useState(null);
  const [admin,setadmin]=useState(null);

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
          navigate("/login");
      } else {
          try {
              const decodedToken = jwtDecode(token);
              setCinUser(decodedToken.cin); // Récupère le CIN depuis le token
          } catch (error) {
              console.error("Erreur lors du décodage du token:", error);
              navigate("/login"); // Redirige si token invalide
          }
      }
  }, [navigate]);

      useEffect(() => {
        if (CinUser) {
        const chercherEmp = async () => {
          try {
            const response = await axios.get(`http://localhost:8081/api/administrateur/find/${CinUser}`);
            setadmin(response.data); 
          } catch (error) {
            console.error("Erreur lors de la récupération de l'admin:", error);
          }
        };
        chercherEmp();
      }
      }, [CinUser]);

  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false); 
  const [selectedMenu, setSelectedMenu] = useState("dashboard"); 
  if (!CinUser) {
    return <div>Chargement...</div>;
  }
  return (
    <div>
        <GeneralNavbar/>
        <motion.div
                  className="relative z-10"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
        {admin ? (
          <>
        <NavbarAdmin role="Admin" admin={admin}/>
    
    <div className="flex h-screen mt-[-15px]">
    

         
      {/* Menu latéral */}
      <nav
        className={` bg-blue-500  text-white rounded-lg shadow-lg${
          isMenuCollapsed ? "w-20" : "w-64"
        } p-6 space-y-4 transition-all duration-300 h-[630px] `}
      >
        {/* Bouton pour réduire/agrandir */}
        <button
          onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
          className="w-full text-left py-2 px-4 rounded-lg hover:bg-blue-800 flex items-center mb-10"
        >
          <FaBars size={20} />
          {!isMenuCollapsed && <span className="ml-2">Réduire</span>}
        </button>

        {/* Options du menu */}
        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "dashboard" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() =>{navigate('/MenuAdmin/',{ state: { adminU:admin}});setSelectedMenu("dashboard");} } 
        >
          <TbHome2 size={20} />
          {!isMenuCollapsed && <span className="ml-2">Accueil</span>}
        </button>
        {/*enseignant*/}
        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "enseignant" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() => {navigate('/MenuAdmin/AfficheEnseignantSimple');setSelectedMenu("enseignant");}}
        >
          <IoPersonOutline size={20}/>
          {!isMenuCollapsed && <span className="ml-2">Enseignant</span>}
        </button>
        {/*employer*/}
        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "employer" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() => {navigate('/MenuAdmin/AfficheEmployerSimple');setSelectedMenu("employer");}}
        >
          <IoPersonOutline size={20}/>
          {!isMenuCollapsed && <span className="ml-2">Employer</span>}
        </button>
        {/*demande recu*/}
        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "DemandeRecu" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() => {navigate('/MenuAdmin/DemandeRecuSimple');setSelectedMenu("DemandeRecu");}}
        >
          <IoArrowRedoCircleOutline size={20}/>
          {!isMenuCollapsed && <span className="ml-2">Demandes recus</span>}
        </button>
        {/*Attribuer des tâches*/}
        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "AttribuerTaches" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() => {navigate('/MenuAdmin/CreateTache');setSelectedMenu("AttribuerTaches");}}
        >
          <HiOutlineDocumentAdd size={20}/>
          {!isMenuCollapsed && <span className="ml-2">Attribuer des tâches</span>}
        </button>
        {/*doc a verifier*/}
        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "ToutesTaches" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() =>  {navigate('/MenuAdmin/ToutesTaches');setSelectedMenu("ToutesTaches");}}
        >
          <HiOutlineClipboardDocumentCheck size={20}/>
          {!isMenuCollapsed && <span className="ml-2">Consulter les Taches</span>}
        </button>
        {/*repport odf*/}
        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
          selectedMenu === "rapport" ? "underline bg-blue-800" : "hover:bg-blue-800"
        } flex items-center`}
          onClick={() =>{navigate('/MenuAdmin/RapportPDF');setSelectedMenu("rapport");}}
        >
          <FaRegFilePdf  size={20}/>
        {!isMenuCollapsed && <span className="ml-2">Rapport PDF</span>}
        </button>

        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "profile" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() => {navigate('/MenuAdmin/AdminProfileSimple',{ state: { adminU:admin}});setSelectedMenu("profile");}}
        >
          <IoPersonCircleOutline  size={20} />
          {!isMenuCollapsed && <span className="ml-2">Profil</span>}
        </button>
      </nav>

      {/* Contenu principal */}
      <main className="flex-grow p-6 bg-gray-100 h-[630px]">
        <Routes>
          <Route path="/" element={<AdminDashboard /> } />
          <Route path="/AdminProfileSimple" element={<AdminProfileSimple />} />
          <Route path="/AfficheEmployerSimple" element={<AfficheEmployerSimple />} />
          <Route path="/AfficheEnseignantSimple" element={<AfficheEnseignantSimple />} />
          <Route path="/DetailUser" element={<DetailUser />} />
          <Route path="/DetailEnseignant" element={<DetailEnseignant />} />
          <Route path="/AjoutEmployer" element={<AjoutEmployer />} />
          <Route path="/AjoutEnseignant" element={<AjoutEnseignant />} />
          <Route path="/AjoutAdmin" element={<AjoutAdmin />} />
          <Route path="/DemandeRecuSimple" element={<DemandeRecuSimple />} />
          <Route path="/CreateTache" element={<CreateTache />} />  
          <Route path="/DetailAttestation" element={<DetailAttestation />} />
          <Route path="/DetailDemandeConge" element={<DetailDemandeConge />} /> 
          <Route path="/ToutesTaches" element={<ToutesTaches />} />   
          <Route path="/RapportPDF" element={<RapportPDF />} />   
          <Route path="/ChangePassword" element={<ChangePassword />} />   
        </Routes>
      </main>
    </div>
    </>
  ) : (
            <div>Chargement des données de l admin...</div> // Message pendant le chargement
          )}
          </motion.div>
    </div>
  );
};

export default MenuAdmin;
