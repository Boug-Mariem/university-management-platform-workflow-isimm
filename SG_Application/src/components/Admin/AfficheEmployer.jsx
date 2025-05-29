import React, { useState,useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import { FaUserPen } from "react-icons/fa6";
import { FaUserXmark } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion";


const AfficheEmployerSimple = () => {
  // Liste initiale d'employés
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get('http://localhost:8081/api/employer/')
        .then((response) => {
          setEmployees(response.data); 
        })
        .catch((error) => {
            console.error("Il y a eu une erreur lors de la récupération des employeurs!", error);
        });
    }, []);
  // Gestion de la suppression d'un employé
  const handleDelete = async (cin) => {
    try {
      const response = await axios.delete(`http://localhost:8081/api/employer/delete/${cin}`);
      if (response.data === "Employé supprimé avec succès") {
        setEmployees((prevemp) => prevemp.filter((emp) => emp.cin !== cin));
        alert("Employé supprimé avec succès");
      } else {
        alert("Erreur lors de la suppression de .... l'employé : " + response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé:', error);
      alert('Erreur lors de la suppression de l\'employé');
    }
  };

  // Filtrage intelligent (recherche)
  const filteredEmployees = employees.filter((employee) => {
    return (
      employee.nom.toLowerCase().includes(search.toLowerCase()) ||
      employee.prenom.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase()) ||
      employee.telephone.includes(search)||
      employee.cin.includes(search)||
      employee.sexe.toLowerCase().includes(search.toLowerCase())||
      employee.dateNaissance.includes(search)||
      employee.lieuNaissance.toLowerCase().includes(search.toLowerCase())||
      employee.niveauEtude.toLowerCase().includes(search.toLowerCase())||
      employee.diplome.toLowerCase().includes(search.toLowerCase())||
      employee.specialiteDipolme.toLowerCase().includes(search.toLowerCase())||
      employee.grade.toLowerCase().includes(search.toLowerCase())||
      employee.centreTravaille.toLowerCase().includes(search.toLowerCase())||
      employee.handicap.toLowerCase().includes(search.toLowerCase())||
      employee.etatFamiliale.toLowerCase().includes(search.toLowerCase())||
      employee.position.toLowerCase().includes(search.toLowerCase())||
      employee.etat.toLowerCase().includes(search.toLowerCase())||
      employee.filière.toLowerCase().includes(search.toLowerCase())||
      employee.specalite.toLowerCase().includes(search.toLowerCase())||
      employee.travailReel.toLowerCase().includes(search.toLowerCase())  
    );
  });
  // Rediriger vers la page des détails
  const handleViewDetails =async (cin) => {
      try {
        const response = await axios.get(`http://localhost:8081/api/employer/find/${cin}`);
        const employeeData = response.data;
        navigate('/Menu/DetailUser',{ state: { employee: employeeData } });
      } catch (err) {
        console.error(err.response?.data?.error || "Erreur lors de la recherche.");
      }
  };

  // Ajouter un nouvel employé (simulé pour l'instant)
  const handleAddEmployee = () => {
    navigate('/Menu/AjoutEmployer');
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
          placeholder="Rechercher un employé..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={handleAddEmployee}
          className="ml-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-800 transition"
        >
          <FaUserPlus />
          Ajouter un Employé
        </button>
      </div>

      {/* Tableau des employés */}
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
            {filteredEmployees.map((employee) => (
              <tr key={employee.cin} className="hover:bg-gray-100">
                <td className="px-4 py-2">{employee.cin}</td>
                <td className="px-4 py-2">{employee.nom}</td>
                <td className="px-4 py-2">{employee.prenom}</td>
                <td className="px-4 py-2">{employee.email}</td>
                <td className="px-4 py-2">{employee.telephone}</td>
                <td className="px-4 py-2 flex justify-center gap-4">
                  <button
                    onClick={() => handleViewDetails(employee.cin)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <FaUserPen size={20} />
                    Détails
                  </button>
                  <button
                    onClick={() => handleDelete(employee.cin)}
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
        {filteredEmployees.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Aucun employé trouvé.
          </div>
        )}
      </div>
    </div>
    </motion.div>
  );
};

export default AfficheEmployerSimple;
