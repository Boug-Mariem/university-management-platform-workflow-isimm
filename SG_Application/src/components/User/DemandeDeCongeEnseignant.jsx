import { useState } from "react";
import { FiSend } from "react-icons/fi";
import GeneralNavbar from "../GeneralNavbar";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";


//pour ensiegnant 
const DemandeDeCongeEnseignant = () => {
  const location = useLocation();
  const { User } = location.state || {};
  const [date, setDate] = useState("");
  const [nbJours, setNbJours] = useState("");
  const [typeConge, setTypeConge] = useState("");
  /////////////
  ////////////
  const today = new Date().toISOString().split('T')[0]; // Résultat : "2025-02-04"
    const creerNotif=async()=>{
      try{
        const response = await axios.post(`http://localhost:8081/api/notifications/creerPourAdmins`,  null,
          {
            params: {
              description: `${User.nom} ${User.prenom} a fait une demande de congé `,
              dateDepose: today ,
            }
          });
        console.log('Notification créé:', response.data);
      } catch (error) {
        console.error('Erreur lors de la création du Notification:', error);
      }
    }
  /////////
  ////////////
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post( `http://localhost:8081/api/demandeConge/creer/enseignant/${User.cin}`, null,
        {
          params: {
            type: typeConge,
            nbJours: nbJours,
            debutconge: date
          }
        }
      );
      if (response.data === "demande accepeter") {
        alert("Demande envoyée avec succès !");
        creerNotif();
        setDate("");
        setNbJours("");
        setTypeConge("");
      } else {
        alert("Erreur lors de l'envoi de la demande");
      }
    } catch (error) {
      if (error.response.data === "demande refuser") {
        alert("Vous avez dépassé le nombre de jours de congé restants.");
      }
      else {
        console.error("Erreur :", error);
        alert("Erreur lors de l'envoi de la demande de conge");
      }
    }
  };

  return (
    <div>
      <GeneralNavbar/>
      <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-blue-500 text-center mb-6">Demande de Congé</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Sélecteur de Date */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Date de début</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Nombre de Jours */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Nombre de jours</label>
          <input
            type="number"
            value={nbJours}
            onChange={(e) => setNbJours(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Type de Congé */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Type de Congé</label>
          <select
            value={typeConge}
            onChange={(e) => setTypeConge(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Sélectionner un type</option>
            <option value="CongeAnnuel">Congé annuel</option>
            <option value="CongeMaladie">Congé maladie</option>
            <option value="CongeMaternel">Congé maternel</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        {/* Bouton Envoyer */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="flex items-center bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            <FiSend className="mr-2" size={20} />
            Envoyer
          </button>
        </div>
      </form>
    </div>
    </motion.div>
    </div>
  );
};

export default DemandeDeCongeEnseignant;
