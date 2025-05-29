import React from "react";
import { useState ,useEffect} from "react";
import { HiUser, HiIdentification, HiTag, HiCalendar, HiClipboardCheck, HiDocumentText } from "react-icons/hi";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbHistoryToggle } from "react-icons/tb";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";



const DetailDemandeConge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { iddemande } = location.state;
  const [user,setuser]=useState(null);
  const [demandeConge,setdemandeConge]=useState(null);
  const [role,setrole]=useState("");
  useEffect(() => {
    axios.get(`http://localhost:8081/api/demandeConge/${iddemande}`)
        .then((response) => {
          setdemandeConge(response.data); 
          fetchUserDetails(response.data);
        })
        .catch((error) => {
            console.error("Il y a eu une erreur lors de la récupération des demandes!", error);
        });
    }, [iddemande]);
    const fetchUserDetails = async (demande) => {  
      try {
          const response = await axios.get(`http://localhost:8081/api/demandeConge/ownerConge/${demande.demandeurCin}`);
          setuser(response.data.personne);
          setrole(response.data.role)
        } catch (error) {
          console.error(`Erreur lors de la récupération des infos`, error);
        }
    }
    ///creation de notification d'acceptation:
  const today = new Date().toISOString().split('T')[0]; 
  ///creation de notification d'acceptation:
    const creerNotifAccept=async(cin)=>{
      try{
        const response = await axios.post(`http://localhost:8081/api/notifications/creer/${cin}`,  null,
          {
            params: {
              description: `Votre demande de congé a été acceptée.`,
              dateDepose: today ,
            }       
          });
        console.log('Notification créé:', response.data);
      } catch (error) {
        console.error('Erreur lors de la création du Notification:', error);
      }
    }
    ///creation de notification d'refut:
    const creerNotifRefus=async(cin)=>{
      try{
        const response = await axios.post(`http://localhost:8081/api/notifications/creer/${cin}`,  null,
          {
            params: {
              description: `Votre demande de congé a été refusée.`,
              dateDepose: today ,
            }
          });
        console.log('Notification créé:', response.data);
      } catch (error) {
        console.error('Erreur lors de la création du Notification:', error);
      }
    }


  const handleAccepter =async () => {
    try {
      const response = await axios.post(`http://localhost:8081/api/demandeConge/accepterDemande/${demandeConge.id}`);
      alert("Demande de congé acceptée !");
      creerNotifAccept(demandeConge.demandeurCin)
      console.log('Demande de congé acceptée');
      navigate('/Menu/DemandeRecu');
    } catch (error) {
      console.error('Erreur lors acceptation de la demande:', error);
    }
  };

  const handleRejeter = async() => {
    try {
      const response = await axios.post(`http://localhost:8081/api/demandeConge/rejeterDemande/${demandeConge.id}`);
      alert("Demande de congé rejetée !");
      creerNotifRefus(demandeConge.demandeurCin);
      console.log('Demande de congé rejetée');
      navigate('/Menu/DemandeRecu');
    } catch (error) {
      console.error('Erreur lors rejection de la demande:', error);
    }
  };
  const [leaveHistory,setLeaveHistory] = useState([]);
  const [remainingDays,setRemainingDays] = useState(null);
  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        if (user && role) {
        const response = await axios.get(`http://localhost:8081/api/demandeConge/his/${role}/${user.cin}`);
        setLeaveHistory(response.data.historiqueConge); 
        setRemainingDays(response.data.joursRestants); 
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique des congés:", error);
      }
    };
    fetchLeaveHistory();
  }, [user,role]);
  return (
    <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
    <div className="min-h-screen bg-gray-100 p-8">
      {user ? (
            <>
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-h-[540px]  element-scroll ">
        {/* detaille cdemande */}
        <div className="flex items-center gap-3 mb-4">
            {/* Avatar */}
            <IoDocumentTextOutline className="text-blue-500" size={30} />  
            {/* Titre */}
            <h2 className="text-xl font-bold text-blue-600">
                 Détails de la Demande de Congé
            </h2>
        </div>
        <div className="space-y-2  ">
          {/* Bloc pour chaque détail */}
          <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm  ">
            <HiUser className="text-xl text-blue-500 mr-4" />
            <p className="text-gray-700">
              <span className="font-semibold">Nom :</span> {user.nom}
            </p>
          </div>
          <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm  ">
            <HiUser className="text-xl text-blue-500 mr-4" />
            <p className="text-gray-700">
              <span className="font-semibold">Prenom :</span> {user.prenom}
            </p>
          </div>
          <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm">
            <HiIdentification className="text-xl text-blue-500 mr-4" />
            <p className="text-gray-700">
              <span className="font-semibold">CIN :</span> {user.cin}
            </p>
          </div>
          <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm">
            <HiTag className="text-xl text-blue-500 mr-4" />
            <p className="text-gray-700">
              <span className="font-semibold">Matricule :</span> {user.matricule}
            </p>
          </div>
          <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm">
            <HiClipboardCheck className="text-xl text-blue-500 mr-4" />
            <p className="text-gray-700">
              <span className="font-semibold">Type de Congé :</span> {demandeConge.type}
            </p>
          </div>
          <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm">
            <HiCalendar className="text-xl text-blue-500 mr-4" />
            <p className="text-gray-700">
              <span className="font-semibold">Date de Début :</span> {new Date(demandeConge.debutconge).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm">
            <HiCalendar className="text-xl text-blue-500 mr-4" />
            <p className="text-gray-700">
              <span className="font-semibold">Date de Fin :</span> {new Date(demandeConge.finconge).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm">
            <HiDocumentText className="text-xl text-blue-500 mr-4" />
            <p className="text-gray-700">
              <span className="font-semibold">Nombre de Jours :</span> {demandeConge.nbJours}
            </p>
          </div>
          
        </div>
        {/* Boutons */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={handleAccepter}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md"
          >
            <MdCheckCircle className="text-2xl mr-2" />
            Accepter
          </button>
          <button
            onClick={handleRejeter}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md"
          >
            <MdCancel className="text-2xl mr-2" />
            Rejeter
          </button>
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
      
                <ul className="space-y-2 mb-4 max-h-[350px] element-scroll mt-2">
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
    </>
          ) : (
            <div>Chargement des données de l employé...</div> // Message pendant le chargement
          )}
        </div>
        </motion.div>
  );
};

export default DetailDemandeConge;
