import personne from '../assets/images/personne.png';
import GeneralNavbar from "./GeneralNavbar";
import { useState } from 'react';
import { FiEdit, FiCheck } from 'react-icons/fi';
import { VscAccount } from "react-icons/vsc";

const Profile = () => {
    const [userInfo, setUserInfo] = useState({
      nom: 'nomutilisateur',
      prenom: 'prenomutilisateur',
      role: 'roleutilisateur',
    });
    const { cinUser } = location.state || {};
    const [editingField, setEditingField] = useState(null); // Gérer le champ actuellement en mode édition

    const handleEditClick = (field) => { //field est le champ par exemple nom , prenom ...
      setEditingField(field); // Activer le mode édition pour le champ spécifique
    };

    const handleSaveClick = () => {
      setEditingField(null); // Désactiver le mode édition
    };

    const handleChange = (e, field) => {
      setUserInfo({ ...userInfo, [field]: e.target.value }); // Mettre à jour la valeur du champ
    };  
  return (
    <div className="min-h-screen">
        <GeneralNavbar/>
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-sm mx-auto">
        
        {/* Cercle avec photo de l'utilisateur */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24  rounded-full overflow-hidden relative ">
            <VscAccount
                className="  text-blue-500 p-1 shadow-lg"
                  size={100} // Taille de l'icône
            />
          </div>
        </div>
  
        {/* Informations de l'utilisateur */}
        <div className="text-center">
        <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto">
          {Object.keys(userInfo).map((field) => (
            <li
              key={field}
              className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm hover:shadow-md"
            >
              <span className="font-semibold text-blue-500 capitalize">
                {field} :
              </span>
              {editingField === field ? (
                <input
                  type="text"
                  value={userInfo[field]}
                  onChange={(e) => handleChange(e, field)}
                  className="text-gray-700 border-b-2 border-blue-500 rounded p-1"
                />
              ) : (
                <span className="text-gray-700">{userInfo[field]}</span>
              )}
              <button
                onClick={
                  editingField === field
                    ? handleSaveClick // Sauvegarder les modifications
                    : () => handleEditClick(field) // Activer le mode édition
                }
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                {editingField === field ? <FiCheck /> : <FiEdit />}
              </button>
            </li>
          ))}
        </ul>
      </div>
      </div>
      </div>
    );
  };

export default  Profile;