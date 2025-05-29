import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { IoNotifications } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { FaCalendarDay, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';



//pour employer
const NavbarEmployer = ({ role, employee}) => {
  const navigate = useNavigate();
  const [userNotifications, setUserNotifications] = useState([]);
  /*
  useEffect(() => {
    axios.get(`http://localhost:8081/api/notifications/${employee.cin}`)
        .then((response) => {
          setUserNotifications(response.data); 
        })
        .catch((error) => {
            console.error("Il y a eu une erreur lors de la récupération des notification!", error);
        });
    }, [employee.cin]); */
    useEffect(() => {
      const fetchNotifications = () => {
        axios.get(`http://localhost:8081/api/notifications/${employee.cin}`)
          .then((response) => {
            setUserNotifications(response.data); 
          })
          .catch((error) => {
            console.error("Il y a eu une erreur lors de la récupération des notifications!", error);
          });
      };
    
      fetchNotifications(); // Récupération initiale des notifications
    
      const interval = setInterval(fetchNotifications, 5000); // Rafraîchit toutes les 5 secondes
    
      return () => clearInterval(interval); // Nettoyage de l'intervalle
    }, [employee.cin]);    

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleNotificationToggle = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleDeleteNotification = async(id) => {
      try {
        const response = await axios.post(`http://localhost:8081/api/notifications/supprimerUne/${id}`);
        console.log('supprimer avec succes:', response.data);
        const updatedNotifications = userNotifications.filter(
          (notification) => notification.id !== id
        );
        setUserNotifications(updatedNotifications);
      } catch (error) {
        console.error('Erreur lors de la suppression de la notification:', error);
      }
  };

  const handleProfileClick = () => {
    navigate('/profileEmployer' ,{ state: { User: employee } });
  };

  const handleClose = () => {
    setIsNotificationOpen(false);
  };

  const [isDemandeOpen, setIsDemandeOpen] = useState(false);

  const handleDemandeToggle = () => {
    setIsDemandeOpen(!isDemandeOpen);
  };
  const handleCloseDemande = () => {
    setIsDemandeOpen(false);
  };
  const handleCongeClick = () => {
    navigate('/employer/DemandeDeCongeEmployer',{ state: { User: employee } });  
  };
  const handleTacheClick = () => {
    navigate('/employer/TacheEmployer',{ state: { User: employee } });  
  };
  //notification de dememande d'atteestation 
  const today = new Date().toISOString().split('T')[0]; // Résultat : "2025-02-04"
    const creerNotif=async()=>{
      try{
        const response = await axios.post(`http://localhost:8081/api/notifications/creerPourAdmins`,  null,
          {
            params: {
              description: `${employee.nom} ${employee.prenom} a fait une demande d'Attestation de Travail`,
              dateDepose: today ,
            }
          });
        console.log('Notification créé:', response.data);
      } catch (error) {
        console.error('Erreur lors de la création du Notification:', error);
      }
    }
    const handleAttestationClick = async () => {
      try {
          const response = await axios.post('http://localhost:8081/api/attestation/creer/employer', employee);
          if (response.status === 200) {
              // Demande envoyée avec succès
              alert("Demande envoyée avec succès !");
              creerNotif();
          } else {
              alert("Échec de l'envoi de la demande.");
          }
      } catch (error) {
          console.error("Erreur lors de l'envoi de la demande:", error);
          alert("Une erreur est survenue.");
      }
    }
  return (
    <div className="bg-gradient-to-r from-blue-500 to-gray-800 p-3 shadow-lg flex justify-between items-center rounded-lg relative">
      {/* Navbar content */}
      <div className="text-2xl font-semibold text-white tracking-wide">{role}</div>

      <div className="text-lg text-white">{employee.nom} {employee.prenom}</div>
      <div className="flex justify-between items-center rounded-lg relative gap-8">
      <div className="relative">
        <button
          onClick={handleDemandeToggle}
          className={`p-2 rounded-full transition ${
            isDemandeOpen ? "bg-blue-800 text-white" : "text-white hover:bg-blue-800"
          } flex items-center`}
        >
          Créer Demande
          <IoIosArrowDown className="ml-1" />
        </button>

        {isDemandeOpen && (
          <div
            className="absolute right-0 mt-7 bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-300 z-50 w-60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <button
                onClick={handleCongeClick}
                className=" text-white text-lef py-2 px-4 bg-transparent hover:bg-gray-200 hover:text-gray-800 transition-all rounded-md flex items-center space-x-2"
              >
                <FaCalendarDay size={15} />
                <span className="text-sm">Demande de Congé</span>
              </button>
              <button
                 onClick={handleAttestationClick}
                className="text-left text-white py-2 px-4 bg-transparent hover:bg-gray-200 hover:text-gray-800 transition-all rounded-md flex items-center space-x-2"
              >
                <FaFileAlt size={15} />
                <span className="text-sm">Demande Attestation de Travail</span>
              </button>
              <button
                onClick={handleTacheClick}
                className="text-left text-white py-2 px-4 bg-transparent hover:bg-gray-200 hover:text-gray-800 transition-all rounded-md flex items-center space-x-2"
              >
                <FaFileAlt size={15} />
                <span className="text-sm">Liste des tâches</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
      <button
          onClick={handleNotificationToggle}
          className={`p-2 rounded-full transition ${
            isNotificationOpen ? "bg-blue-800 text-white" : "text-white hover:bg-blue-800"
          }`}
        >
          <IoNotifications size={24} />
        </button>

        {/* Notifications Panel */}
        {isNotificationOpen && (
          <div
            className="absolute right-0 mt-7 bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-300 z-50 w-80 h-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-white mb-4">Notifications</h2>
            <ul className="space-y-2 max-h-[260px] element-scroll">
              {userNotifications.slice().reverse().map((notification) => (
                <li
                  key={notification.id}
                  className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm hover:shadow-md"
                >
                  <span className="font-semibold text-gray-700">{notification.description}</span>
                  <span className="ml-4 text-sm text-gray-500">{notification.dateDepose}</span>
                  <button
                    className="ml-4 text-gray-500 p-1 rounded-full  transition"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div
        onClick={handleProfileClick}
        className="cursor-pointer p-3 bg-white text-blue-600 rounded-full shadow-lg hover:bg-blue-50 hover:text-blue-700 transition duration-300"
      >
        <div className="text-xl">👤</div>
      </div>
      </div>

      {/* Click outside to close */}
      {isNotificationOpen && (
        <div
          className="fixed inset-0 bg-transparent z-40"
          onClick={handleClose}
        ></div>
      )}

      {/* Click outside to close */}
      {isDemandeOpen && (
        <div
          className="fixed inset-0 bg-transparent z-40"
          onClick={handleCloseDemande}
        ></div>
      )}
    </div>
  );
};

NavbarEmployer.propTypes = {
  role: PropTypes.string.isRequired,
  employee: PropTypes.object.isRequired,
};

export default NavbarEmployer;
