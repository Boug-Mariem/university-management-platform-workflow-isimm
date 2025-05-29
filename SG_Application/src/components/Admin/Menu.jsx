import React, { useState,useEffect } from "react";
import { FaBars } from "react-icons/fa"; 
import { TbHome2 } from "react-icons/tb";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import GeneralNavbar from "../GeneralNavbar";
import NavbarAdmin from "./NavbarAdmin";
import AdminDashboard from "./AdminDashboard";
import { TbChartHistogram } from "react-icons/tb";
import AdminProfile from "./AdminProfile";
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
import DemandeRecu from "./DemandeRecu";
import CreateTache from "./CreateTache";
import DetailAttestation from "./DetailAttestation";
import DetailDemandeConge from "./DetailDemandeConge";
import ToutesTaches from "./ToutesTaches";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import RapportPDF from "./RapportPDF";
import { FaRegFilePdf } from "react-icons/fa6";
import ChangePassword from "./ChangePassword";
import { motion } from "framer-motion";
import { jwtDecode } from 'jwt-decode';

const Menu = () => {
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
}, [navigate]); // Dépendance uniquement sur navigate

  // Second useEffect : Appeler l'API une fois que cinUser est défini
  useEffect(() => {
      if (CinUser) { // Vérifie que cinUser n'est pas null
          const chercherEmp = async () => {
              try {
                  const response = await axios.get(`http://localhost:8081/api/administrateur/find/${CinUser}`);
                  setadmin(response.data);
              } catch (error) {
                  console.error("Erreur lors de la récupération du super Admin:", error);
              }
          };
          chercherEmp();
      }
  }, [CinUser]); // Dépendance sur cinUser

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
        <NavbarAdmin role="SuperAdmin" admin={admin}/>
    
    <div className="flex h-screen mt-[-15px]">
         
      {/* Menu latéral */}
      <nav 
        className={`bg-blue-500  text-white rounded-lg shadow-lg${
          isMenuCollapsed ? "w-20" : "w-64"
        } p-4 space-y-4 transition-all duration-300 h-[630px] `}
      >
        {/* Bouton pour réduire/agrandir */}
        <button
          onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
          className="w-full text-left py-2 px-4 rounded-lg hover:bg-blue-800 flex items-center mb-10"  
        >
          <FaBars size={18} />
          {!isMenuCollapsed && <span className="ml-2">Réduire</span>}
        </button>

        

        {/* Options du menu */}
        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "dashboard" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() =>{navigate('/Menu/',{ state: { adminU:admin}});setSelectedMenu("dashboard");} } 
        >
          <TbHome2 size={18} />
          {!isMenuCollapsed && <span className="ml-2">Accueil</span>}
        </button>
        {/*enseignant*/}
        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "enseignant" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() => {navigate('/Menu/AfficheEnseignant');setSelectedMenu("enseignant");}}
        >
          <IoPersonOutline size={18}/>
          {!isMenuCollapsed && <span className="ml-2 ">Enseignant</span>}
        </button>
        {/*employer*/}
        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "employer" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() => {navigate('/Menu/AfficheEmployer');setSelectedMenu("employer");}}
        >
          <IoPersonOutline size={18}/>
          {!isMenuCollapsed && <span className="ml-2">Employer</span>}
        </button>
        {/*admin*/}
        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "admin" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() => {navigate('/Menu/AfficheAdmin');setSelectedMenu("admin");}}
        >
          <IoPersonOutline size={18}/>
          {!isMenuCollapsed && <span className="ml-2">Admin</span>}
        </button>
        {/*demande recu*/}
        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "DemandeRecu" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() => {navigate('/Menu/DemandeRecu');setSelectedMenu("DemandeRecu");}}
        >
          <IoArrowRedoCircleOutline size={18}/>
          {!isMenuCollapsed && <span className="ml-2">Demandes recus</span>}
        </button>
        {/*Attribuer des tâches*/}
        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "AttribuerTaches" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() => {navigate('/Menu/CreateTache');setSelectedMenu("AttribuerTaches");}}
        >
          <HiOutlineDocumentAdd size={18}/>
          {!isMenuCollapsed && <span className="ml-2">Attribuer des tâches</span>}
        </button>
        {/*doc a verifier*/}
        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "ToutesTaches" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() =>  {navigate('/Menu/ToutesTaches');setSelectedMenu("ToutesTaches");}}
        >
          <HiOutlineClipboardDocumentCheck size={18}/>
          {!isMenuCollapsed && <span className="ml-2">Consulter les Taches</span>}
        </button>
        {/*repport odf*/}
        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "rapport" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() =>{navigate('/Menu/RapportPDF');setSelectedMenu("rapport");}}
        >
          <FaRegFilePdf  size={18}/>
          {!isMenuCollapsed && <span className="ml-2">Rapport PDF</span>}
        </button>

        <button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "profile" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() => {navigate('/Menu/AdminProfile',{ state: { adminU:admin}});setSelectedMenu("profile");}}
        >
          <IoPersonCircleOutline  size={18} />
          {!isMenuCollapsed && <span className="ml-2">Profil</span>}
        </button>

        {/*<button
          className={`w-full text-left py-2 px-4 rounded-lg ${
            selectedMenu === "settings" ? "underline bg-blue-800" : "hover:bg-blue-800"
          } flex items-center`}
          onClick={() => {navigate('/Menu/',{ state: { adminU:admin}});setSelectedMenu("settings");}}
        >
          <IoSettingsOutline size={20}/>
          {!isMenuCollapsed && <span className="ml-2">Paramètres</span>}
        </button>*/}
      </nav>
      

      {/* Contenu principal */}
      <main className="flex-grow p-6 bg-gray-100 h-[630px]">
        <Routes>
          <Route path="/" element={<AdminDashboard /> } />
          <Route path="/AdminProfile" element={<AdminProfile />} />
          <Route path="/AfficheEmployer" element={<AfficheEmployer />} />
          <Route path="/AfficheEnseignant" element={<AfficheEnseignant />} />
          <Route path="/AfficheAdmin" element={<AfficheAdmin />} />
          <Route path="/DetailUser" element={<DetailUser />} />
          <Route path="/DetailEnseignant" element={<DetailEnseignant />} />
          <Route path="/DetailAdmin" element={<DetailAdmin />} />
          <Route path="/AjoutEmployer" element={<AjoutEmployer />} />
          <Route path="/AjoutEnseignant" element={<AjoutEnseignant />} />
          <Route path="/AjoutAdmin" element={<AjoutAdmin />} />
          <Route path="/DemandeRecu" element={<DemandeRecu />} />
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

export default Menu;
