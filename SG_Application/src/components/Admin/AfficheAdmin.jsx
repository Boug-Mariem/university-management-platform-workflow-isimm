import React, { useState,useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import { FaUserXmark } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion";

const AfficheAdmin = () => {
  const navigate = useNavigate();
  // Liste initiale d'Admin
  const [Admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get('http://localhost:8081/api/administrateur/')
        .then((response) => {
          setAdmins(response.data); 
        })
        .catch((error) => {
            console.error("Il y a eu une erreur lors de la récupération des admins!", error);
        });
    }, []); 
  
  // Gestion de la suppression d'un Admin
  const handleDelete = async (cin) => {
    try {
      const response = await axios.delete(`http://localhost:8081/api/administrateur/delete/${cin}`);
      if (response.data === "Administrateur supprimé avec succès") {
        setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.cin !== cin));
        alert("Administrateur supprimé avec succès");
      } else {
        alert("Erreur lors de la suppression de .... l'Administrateur : " + response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'Administrateur:', error);
      alert('Erreur lors de la suppression de l\'Administrateur');
    }
  };

  // Filtrage intelligent (recherche)
  const filteredAdmins = Admins.filter((Admin) => {
    return (
        Admin.nom.toLowerCase().includes(search.toLowerCase()) ||
        Admin.prenom.toLowerCase().includes(search.toLowerCase()) ||
        Admin.email.toLowerCase().includes(search.toLowerCase()) ||
        Admin.telephone.includes(search) ||
        Admin.cin.includes(search)||
        Admin.sexe.toLowerCase().includes(search.toLowerCase())||
        Admin.dateNaissance.includes(search)||
        Admin.lieuNaissance.toLowerCase().includes(search.toLowerCase())||
        Admin.niveauEtude.toLowerCase().includes(search.toLowerCase())||
        Admin.diplome.toLowerCase().includes(search.toLowerCase())||
        Admin.specialiteDipolme.toLowerCase().includes(search.toLowerCase())||
        Admin.grade.toLowerCase().includes(search.toLowerCase())||
        Admin.centreTravaille.toLowerCase().includes(search.toLowerCase())||
        Admin.handicap.toLowerCase().includes(search.toLowerCase())||
        Admin.etatFamiliale.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Rediriger vers la page des détails
  const handleViewDetails =async (cin) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/administrateur/find/${cin}`);
      const adminData = response.data;
      navigate('/Menu/DetailAdmin',{ state: { admin: adminData } });
    } catch (err) {
      console.error(err.response?.data?.error || "Erreur lors de la recherche.");
    }
};

  // Ajouter un nouvel Admin (simulé pour l'instant)
  const handleAddAdmin = () => {
    navigate('/Menu/AjoutAdmin');
  };

  return (
    <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
    <div className=" bg-gray-100 min-h-screen mt-7">
      {/* Barre de recherche */}
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Rechercher un Admin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={handleAddAdmin}
          className="ml-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800 transition"
        >
          <FaUserPlus />
          Ajouter un Admin
        </button>
      </div>

      {/* Tableau des Admin */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full table-auto ">
          <thead className="bg-blue-500 text-white ">
            <tr>
              <th className="px-4 py-2 text-center">CIN</th>
              <th className="px-4 py-2 text-center">Nom</th>
              <th className="px-4 py-2 text-center">Prénom</th>
              <th className="px-4 py-2 text-center">Email</th>
              <th className="px-4 py-2 text-center">Téléphone</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((Admin) => (
              <tr key={Admin.cin} className="hover:bg-gray-100">
                <td className="px-4 py-2">{Admin.cin}</td>
                <td className="px-4 py-2">{Admin.nom}</td>
                <td className="px-4 py-2">{Admin.prenom}</td>
                <td className="px-4 py-2">{Admin.email}</td>
                <td className="px-4 py-2">{Admin.telephone}</td>
                <td className="px-4 py-2 flex justify-center gap-4">
                  <button
                    onClick={() => handleViewDetails(Admin.cin)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <FaUserPen size={20} />
                    Détails
                  </button>
                  <button
                    onClick={() => handleDelete(Admin.cin)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <FaUserXmark size={20} />
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAdmins.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Aucun Admin trouvé.
          </div>
        )}
      </div>
    </div>
    </motion.div>
  );
};

export default AfficheAdmin;
