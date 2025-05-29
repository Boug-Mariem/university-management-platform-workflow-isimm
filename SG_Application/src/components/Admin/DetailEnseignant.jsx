import React, { useState, useEffect } from "react";
import { TbHistoryToggle } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";
import { FiEdit, FiCheck } from 'react-icons/fi';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { motion } from "framer-motion";

const DetailEnseignant = () => {
  const location = useLocation();
  const { enseignant } = location.state || {}; 
  
  const [userInfo, setUserInfo] = useState({
    cin:"",
    matricule:"",
    nom: "",
    prenom:"",
    telephone: "",
    email: "",
    dateNaissance:"",
    lieuNaissance:"",
    sexe:"",
    adresse:"",
    departement:"",
    niveauEtude:"",
    diplome:"",
    specialiteDipolme:"",
    grade:"",
    dateEntreAdministrative:"",
    dateNommationGrade:"",
    dateInscriptionGrade:"",
    centreTravaille:"",
    handicap:"",
    etatFamiliale:"",
    nbEnfant:"",
    password:"",
    position:"",
    etat:"",
    filière:"",
    specalite:"",
    dateInscriptionPosition:"",
    categorie:"",
    section:"",
    nbCongeMax:"",
    notes:""
  });

  useEffect(() => {
    if (enseignant) {
      setUserInfo(enseignant); // Remplir userInfo avec les données de l'enseignant si elles existent
    }
  }, [enseignant]);
  const fieldLabels = {
    cin: "CIN",
    matricule: "Matricule",
    nom: "Nom",
    prenom: "Prénom",
    telephone: "Numéro de téléphone",
    email: "Adresse email",
    dateNaissance: "Date de naissance",
    lieuNaissance: "Lieu de naissance",
    sexe: "Sexe",
    adresse: "Adresse",
    departement:"Departement",
    niveauEtude: "Niveau d'étude",
    diplome: "Diplôme",
    specialiteDipolme: "Spécialité du diplôme",
    grade: "Grade",
    dateEntreAdministrative: "Date d'entrée administrative",
    dateNommationGrade: "Date de nomination au grade",
    dateInscriptionGrade: "Date d'inscription au grade",
    centreTravaille: "Centre de travail",
    handicap: "Handicap",
    etatFamiliale: "État familial",
    nbEnfant: "Nombre d'enfants",
    position: "Position",
    etat: "État",
    filière: "Filière",
    specalite: "Spécialité",
    dateInscriptionPosition: "Date d'inscription à la position",
    categorie: "Catégorie",
    section: "Section",
    nbCongeMax: "Nombre de jours de congé",
    notes: "Notes",
  };
  
  const fieldsToDisplay = [
    "cin",
    "matricule",
    "nom",
    "prenom",
    "telephone",
    "email",
    "dateNaissance",
    "lieuNaissance",
    "sexe",
    "adresse",
    "departement",
    "niveauEtude",
    "diplome",
    "specialiteDipolme",
    "grade",
    "dateEntreAdministrative",
    "dateNommationGrade",
    "dateInscriptionGrade",
    "centreTravaille",
    "handicap",
    "etatFamiliale",
    "nbEnfant",
    "position",
    "etat",
    "filière",
    "specalite",
    "dateInscriptionPosition",
    "categorie",
    "section",
    "nbCongeMax",
    "notes",
  ];

  const [editingField, setEditingField] = useState(null);

  const handleEditClick = (field) => {
    setEditingField(field);
  };

  const handleSaveClick =async () => {
    try {
      const response = await axios.post('http://localhost:8081/api/enseignant/modifier', userInfo);
      console.log('Enseignant modifie avec succès:', response.data);
      setEditingField(null);
    } catch (error) {
      console.error('Erreur lors de la modification de l\'Enseignant:', error);
    }
  };
  
  const handleChange =  (e, field) => {
    setUserInfo({ ...userInfo, [field]: e.target.value });
  };

  const [leaveHistory,setLeaveHistory] = useState([]);
  const [remainingDays,setRemainingDays] = useState(null);
  // Récupérer l'historique des congés et les jours restants
  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        if (userInfo.cin) {
        const response = await axios.get(`http://localhost:8081/api/demandeConge/his/enseignant/${userInfo.cin}`);
        setLeaveHistory(response.data.historiqueConge); 
        setRemainingDays(response.data.joursRestants); }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique des congés:", error);
      }
    };
    fetchLeaveHistory();
  }, [userInfo.cin]);

  return (
    <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
    <div className="min-h-screen bg-gray-100 p-8 ">
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-6">
        {/* Boîte des informations utilisateur */}
        <div className="bg-white p-6 rounded-lg shadow-lg ">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-md">
              <VscAccount className="text-blue-500" size={80} />
            </div>

            {/* Titre */}
            <h2 className="text-2xl font-bold text-blue-600">
              Profil Enseignant
            </h2>
          </div>

          {/* Informations de l'utilisateur */}
          <div className="text-center">
          <ul className="mt-4 space-y-3 mb-4 max-h-[383px] element-scroll">
            {fieldsToDisplay.map((field) => (
              <li
                key={field}
                className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm hover:shadow-md"
              >
                <span className="font-semibold text-blue-500 capitalize text-sm ">
                  {fieldLabels[field] || field} : {/* Utilisation de fieldLabels */}
                </span>
                {editingField === field ? (
                  <input
                    type="text"
                    value={userInfo[field]}
                    onChange={(e) => handleChange(e, field)}
                    className="text-gray-700 border-b-2 border-blue-500 rounded p-1"
                  />
                ) : (
                  <span className="text-gray-700">{userInfo[field] || "N/A"}</span>
                )}
                {/* Condition pour masquer le bouton de modification pour 'cin' */}
                  {field !== 'cin' && (
                    <button
                      onClick={
                        editingField === field
                          ? handleSaveClick
                          : () => handleEditClick(field)
                      }
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      {editingField === field ? <FiCheck /> : <FiEdit />}
                    </button>
                  )}
              </li>
            ))}
          </ul>
          </div>
        </div>

        {/* Boîte de l'historique des congés */}
        <div className="bg-white p-6 rounded-lg shadow-lg ">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-blue-500 flex items-center">
              <TbHistoryToggle size={28} className="mr-2" />
              Historique des Congés
            </h2>

            {/* Cercle des jours restants */}
            <div className="w-28 h-28 bg-gradient-to-r from-blue-500 to-gray-800 text-white flex items-center justify-center rounded-full shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">{remainingDays}</div>
                <div className="text-sm">Jours Restants</div>
              </div>
            </div>
          </div>

          <ul className="mt-4 space-y-3 max-h-[383px] element-scroll">
          {leaveHistory.length > 0 ? (
          leaveHistory.map((leave) => (
                <li
                    key={leave.id}
                    className="p-4 bg-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                    <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-500">{leave.type}</span>
                    <span className="text-sm text-gray-500">
                        {leave.nbJours} jours
                    </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                        <span className="font-medium">Début:</span>
                        <span>{new Date(leave.debutconge).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center space-x-2 mt-1">
                        <span className="font-medium">Fin:</span>
                        <span>{new Date(leave.finconge).toLocaleDateString()}</span>
                    </div>
                    </div>
                </li>
                ))
              ) : (
                <li className="p-4 bg-gray-50 rounded-xl text-center text-gray-400">
                  Historique vide
                </li>
              )}
          </ul>
        </div>
      </div>
    </div>
    </motion.div>
  );
};

export default DetailEnseignant;
