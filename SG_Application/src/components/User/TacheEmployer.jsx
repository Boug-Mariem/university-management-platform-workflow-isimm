import React, { useState, useEffect } from "react";
import moment from "moment";
import GeneralNavbar from "../GeneralNavbar";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";


const TacheEmployer = () => {
  const location = useLocation();
  const { User } = location.state || {};
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const apportertaches = async () => {
      try {
        if (User) {
        const response = await axios.get(`http://localhost:8081/api/taches/taches/${User.cin}`);
        setTasks(response.data); 
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des taches:", error);
      }
    };
    apportertaches();
  }, [User]);

  useEffect(() => {
    const today = moment();
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        const dateLimite = moment(task.dateLimite);
        const isNearDeadline = dateLimite.diff(today, "days") <= 2 && !(task.etatTache==='finie');
        return { ...task, isNearDeadline };
      })
    );
  }, []);
  
    ////////////////////////////////////////////////
    const today = new Date().toISOString().split('T')[0]; // Résultat : "2025-02-04"
    const creerNotif=async()=>{
      try{
        const response = await axios.post(`http://localhost:8081/api/notifications/creerPourAdmins`,  null,
          {
            params: {
              description: `${User.nom} ${User.prenom} a terminé une tâche`,
              dateDepose: today ,
            }
          });
        console.log('Notification créé:', response.data);
      } catch (error) {
        console.error('Erreur lors de la création du Notification:', error);
      }
    }
  const handleCheckboxChange = async (id, currentEtat) => {
    try {
      if (currentEtat === "finie") {
        // Si la tâche est "finie", la repasser à "enCours"
        await axios.post(`http://localhost:8081/api/taches/modifierEtatVersEnCours/${id}`);
      } else {
        // Sinon, la marquer comme "finie"
        await axios.post(`http://localhost:8081/api/taches/modifierEtatVersfinie/${id}`);4
        creerNotif();
      }
  
      // Mise à jour de l'état local après la modification côté serveur
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? { ...task, etatTache: currentEtat === "finie" ? "enCours" : "finie" }
            : task
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'état de la tâche:", error);
    }
  };
  

  const completedTasks = tasks.filter((task) => (task.etatTache==='finie'));
  const pendingTasks = tasks.filter((task) => !(task.etatTache==='finie'));

  return (
    <div className="container mx-auto p-6">
      <GeneralNavbar />
      <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
      <div style={{ marginTop: '75px' }} className="flex gap-6  justify-center">
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-[500px] h-[500px] element-scroll">
          <div className="flex items-center gap-3 mb-4">
            {/* Avatar */}
            <IoDocumentTextOutline className="text-blue-500" size={30} />  
            {/* Titre */}
            <h2 className="text-2xl font-bold text-blue-600">Tâches Terminées</h2>
          </div>
          <div className="space-y-4">
            {completedTasks.map((task) => (
              <div key={task.id} className="bg-gray-300 p-4 rounded-md shadow-md">
                <div className="flex justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-700">{task.description}</p>
                    <p className="text-sm text-gray-500">Créée le: {moment(task.dateDepose).format("YYYY-MM-DD")}</p>
                    <p className="text-sm text-gray-500">Date limite: {moment(task.dateLimite).format("YYYY-MM-DD")}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(task.etatTache==='finie')}
                    onChange={() => handleCheckboxChange(task.id, task.etatTache)}
                    className="w-5 h-5"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-[500px] h-[500px] element-scroll">
          <div className="flex items-center gap-3 mb-4">
            {/* Avatar */}
            <IoDocumentTextOutline className="text-blue-500" size={30} />  
            {/* Titre */}
            <h2 className="text-2xl font-bold text-blue-600">Tâches En Cours</h2>
          </div>
          <div className="space-y-4">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className={`${
                  task.isNearDeadline ? "bg-red-200" : "bg-gray-100"
                } p-4 rounded-md shadow-md transition-all`}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-700">{task.description}</p>
                    <p className="text-sm text-gray-500">Créée le: {moment(task.dateDepose).format("YYYY-MM-DD")}</p>
                    <p className="text-sm text-gray-500">Date limite: {moment(task.dateLimite).format("YYYY-MM-DD")}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(task.etatTache==='finie')}
                    onChange={() => handleCheckboxChange(task.id, task.etatTache)}
                    className="w-5 h-5"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  );
};

export default TacheEmployer;
