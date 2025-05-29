import React, { useState,useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import { FaUserXmark } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion";


const AfficheEnseignantSimple = () => {
  const navigate = useNavigate();
  // Liste initiale d'enseignant
  const [enseignants, setenseignants] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    axios.get('http://localhost:8081/api/enseignant/')
        .then((response) => {
          setenseignants(response.data); 
        })
        .catch((error) => {
            console.error("Il y a eu une erreur lors de la récupération des enseignants!", error);
        });
    }, []);

  // Gestion de la suppression d'un enseignant
  const handleDelete = async (cin) => {
    try {
      const response = await axios.delete(`http://localhost:8081/api/enseignant/delete/${cin}`);
      if (response.data === "Enseignant supprimé avec succès") {
        setenseignants((prevens) => prevens.filter((ens) => ens.cin !== cin));
        alert("Enseignant supprimé avec succès");
      } else {
        alert("Erreur lors de la suppression de .... l'Enseignant : " + response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'Enseignant:', error);
      alert('Erreur lors de la suppression de l\'Enseignant');
    }
  };

  // Filtrage intelligent (recherche)
  const filteredenseignants = enseignants.filter((enseignant) => {
    return (
        enseignant.nom.toLowerCase().includes(search.toLowerCase()) ||
        enseignant.prenom.toLowerCase().includes(search.toLowerCase()) ||
        enseignant.email.toLowerCase().includes(search.toLowerCase()) ||
        enseignant.telephone.includes(search)||
        enseignant.cin.includes(search)||
        enseignant.sexe.toLowerCase().includes(search.toLowerCase())||
        enseignant.dateNaissance.includes(search)||
        enseignant.lieuNaissance.toLowerCase().includes(search.toLowerCase())||
        enseignant.niveauEtude.toLowerCase().includes(search.toLowerCase())||
        enseignant.diplome.toLowerCase().includes(search.toLowerCase())||
        enseignant.specialiteDipolme.toLowerCase().includes(search.toLowerCase())||
        enseignant.grade.toLowerCase().includes(search.toLowerCase())||
        enseignant.centreTravaille.toLowerCase().includes(search.toLowerCase())||
        enseignant.handicap.toLowerCase().includes(search.toLowerCase())||
        enseignant.etatFamiliale.toLowerCase().includes(search.toLowerCase())||
        enseignant.position.toLowerCase().includes(search.toLowerCase())||
        enseignant.etat.toLowerCase().includes(search.toLowerCase())||
        enseignant.filière.toLowerCase().includes(search.toLowerCase())||
        enseignant.specalite.toLowerCase().includes(search.toLowerCase())||
        enseignant.departement.toLowerCase().includes(search.toLowerCase())  
    );
  });

  // Rediriger vers la page des détails
  const handleViewDetails =async (cin) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/enseignant/find/${cin}`);
      const enseignantData = response.data;
      navigate('/MenuAdmin/DetailEnseignant',{ state: { enseignant: enseignantData } });
    } catch (err) {
      console.error(err.response?.data?.error || "Erreur lors de la recherche.");
    }
};

  // Ajouter un nouvel enseignant (simulé pour l'instant)
  const handleAddenseignant = () => {
    navigate('/MenuAdmin/AjoutEnseignant');
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
          placeholder="Rechercher un Enseignant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={handleAddenseignant}
          className="ml-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800 transition"
        >
          <FaUserPlus />
          Ajouter un Enseignant
        </button>
      </div>

      {/* Tableau des enseignant */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden element-scroll">
        <table className="w-full table-auto  ">
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
            {filteredenseignants.map((enseignant) => (
              <tr key={enseignant.cin} className="hover:bg-gray-100">
                <td className="px-4 py-2">{enseignant.cin}</td>
                <td className="px-4 py-2">{enseignant.nom}</td>
                <td className="px-4 py-2">{enseignant.prenom}</td>
                <td className="px-4 py-2">{enseignant.email}</td>
                <td className="px-4 py-2">{enseignant.telephone}</td>
                <td className="px-4 py-2 flex justify-center gap-4">
                  <button
                    onClick={() => handleViewDetails(enseignant.cin)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <FaUserPen size={20} />
                    Détails
                  </button>
                  <button
                    onClick={() => handleDelete(enseignant.cin)}
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
        {filteredenseignants.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Aucun Enseignant trouvé.
          </div>
        )}
      </div>
    </div>
    </motion.div>
  );
};

export default AfficheEnseignantSimple;
