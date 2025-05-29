import personne from '../../assets/images/personne.png';
import GeneralNavbar from "../GeneralNavbar";
import { useState,useEffect } from 'react';
import { FiEdit, FiCheck } from 'react-icons/fi';
import { VscAccount } from "react-icons/vsc";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";


import axios from 'axios';

const ProfileEnseignant = () => {
    const navigate = useNavigate();
  const location = useLocation();
  const { User } = location.state || {};
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
            if (User) {
              setUserInfo(User); // Remplir userInfo avec les données de l'enseignant si elles existent
            }
          }, [User]);
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
    const [editingField, setEditingField] = useState(null); // Gérer le champ actuellement en mode édition

    const handleEditClick = (field) => { //field est le champ par exemple nom , prenom ...
      setEditingField(field); // Activer le mode édition pour le champ spécifique
    };
    const allerChangePassword=(pers) =>{
      navigate('/ChangePasswordEns',{ state: { User: pers } });
    }
    const handleSaveClick =async () => {
      try {
        const response = await axios.post('http://localhost:8081/api/enseignant/modifier', userInfo);
        console.log('Enseignant modifie avec succès:', response.data);
        setEditingField(null);
      } catch (error) {
        console.error('Erreur lors de la modification de l\'Enseignant:', error);
      }
    };

    const handleChange = (e, field) => {
      setUserInfo({ ...userInfo, [field]: e.target.value }); // Mettre à jour la valeur du champ
    };  
  return (
    <div className="min-h-screen">
        <GeneralNavbar/>
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-2xl mx-auto mt-10">
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
                  <button onClick={()=>allerChangePassword(User)} className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:shadow-lg focus:outline-none">
                Modifier le mot de passe
            </button>
      </div>
      </motion.div>
      </div>
    );
  };

export default  ProfileEnseignant;