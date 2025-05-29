import { IoDocumentTextOutline } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";
import moment from "moment";
import GeneralNavbar from "../GeneralNavbar";
import { useState ,useEffect} from "react";
import axios from 'axios';
import { motion } from "framer-motion";


const ToutesTaches = () => {
  const [tasks, setTasks] = useState([]);
  /////////////
  const [user,setuser]=useState([]);
  /*useEffect(() => {
    axios.get('http://localhost:8081/api/taches/toutes')
        .then((response) => {
            setTasks(response.data); 
          fetchUserDetails(response.data);
        })
        .catch((error) => {
            console.error("Il y a eu une erreur lors de la récupération des taches!", error);
        });
    }, []);*/
    useEffect(() => {
      const fetchTasks = () => {
        axios.get('http://localhost:8081/api/taches/toutes')
          .then((response) => {
            setTasks(response.data); 
            fetchUserDetails(response.data);
          })
          .catch((error) => {
            console.error("Il y a eu une erreur lors de la récupération des tâches !", error);
          });
      };
    
      // Appel initial au chargement de la page
      fetchTasks();
    
      // Rafraîchir toutes les 5 secondes
      const interval = setInterval(fetchTasks, 5000);
    
      // Nettoyage de l'intervalle lors du démontage du composant
      return () => clearInterval(interval);
    }, []);
    
    const fetchUserDetails = async (demandes) => {
      const userDetailsList = [];
  
      for (const demande of demandes) {
        try {
          const response = await axios.get(`http://localhost:8081/api/taches/ownerTache/${demande.employerCin}`);
          const cin=response.data.cin;
          const nom=response.data.nom;
          const prenom=response.data.prenom;
          const demandeur={ cin, nom, prenom } ;
          
          if (!userDetailsList.some(user => user.cin === cin)) {
            userDetailsList.push({ cin, nom, prenom });
          }
        } catch (error) {
          console.error(`Erreur lors de la récupération des infos pour le CIN ${demande.employerCin}`, error);
        }
      }
  
      setuser(userDetailsList); // Mettre à jour l'état avec la liste des utilisateurs
    };

  /////////
  const today2 = new Date().toISOString().split('T')[0]; // Résultat : "2025-02-04"
    const creerNotif=async(cin)=>{
      try{
        const response = await axios.post(`http://localhost:8081/api/notifications/creer/${cin}`,  null,
          {
            params: {
              description: `Une de vos tâches a été annulée.`,
              dateDepose: today2 ,
            }
          });
        console.log('Notification créé:', response.data);
      } catch (error) {
        console.error('Erreur lors de la création du Notification:', error);
      }
    }
  const handleDelete = async (id,task) => {
    const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?");
    if (confirmation) {
        try {
          const response = await axios.post(`http://localhost:8081/api/taches/supprimer/${id}`);
          console.log('supprimer avec succes:', response.data);
          creerNotif(task.employerCin);
          window.location.reload();
        } catch (error) {
          console.error('Erreur lors de la suppression de la tache:', error);
        }
      }
  };

  return (
    <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
    <div className="min-h-screen bg-gray-100 p-8 ">
      <div className="flex gap-6 mt-10 justify-center">
        {["Terminées", "En Cours"].map((etat, index) => {
          const filteredTasks = tasks.filter(task =>
            etat === "Terminées" ? task.etatTache === "finie" : task.etatTache === "enCours"
          );
          
          return (
            <div key={index} className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-[400px] h-[500px] element-scroll">
              <div className="flex items-center gap-3 mb-4">
                <IoDocumentTextOutline className="text-blue-500" size={30} />
                <h2 className="text-2xl font-bold text-blue-600">Tâches {etat}</h2>
              </div>
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div key={task.id} className={`${task.isNearDeadline ? "bg-red-200" : "bg-gray-100"} p-4 rounded-md shadow-md transition-all`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-semibold text-gray-700">{task.description}</p>
                        <p className="text-sm text-gray-500">Créée le: {moment(task.dateDepose).format("YYYY-MM-DD")}</p>
                        <p className="text-sm text-gray-500">Date limite: {moment(task.dateLimite).format("YYYY-MM-DD")}</p>
                        <p className="text-sm text-gray-500">Responsable: {user.find(u=>u.cin===task.employerCin)?.nom||"Nom non trouvé"} {user.find(u=>u.cin===task.employerCin)?.prenom||"Nom non trouvé"}</p>
                      </div>
                      {task.etatTache === "enCours" && (
                        <button onClick={() => handleDelete(task.id,task)} className="text-gray-600 hover:text-red-800">
                          X
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </motion.div>
  );
};

export default ToutesTaches;
