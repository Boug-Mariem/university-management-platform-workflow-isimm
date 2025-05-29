import { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { IoNotifications } from "react-icons/io5";
import axios from 'axios';


const NavbarAdmin = ({ role, admin }) => {
  const navigate = useNavigate();
  const [cin,setcin]=useState(admin.cin);
  const [userNotifications, setUserNotifications] = useState([]);
  useEffect(() => {
    const fetchNotifications = () => {
      axios.get(`http://localhost:8081/api/notifications/${cin}`)
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
  }, [cin]);
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
  const handleClose = () => {
    setIsNotificationOpen(false);
  };


  return (
    <div className=" flex justify-between items-center  relative p-4 bg-gradient-to-r from-blue-500 to-gray-800 rounded-lg ">
      {/* Navbar content */}
      <div className="text-2xl font-semibold text-white tracking-wide">{role}</div>

      <div className="text-lg text-white">{admin.nom} {admin.prenom}</div>
      <div className="flex justify-between items-center rounded-lg relative gap-8">
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
            className="absolute right-0 mt-7 bg-gray-800  p-2 rounded-xl shadow-lg border border-gray-300 z-50 w-80 h-80"
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

      

      {/* Click outside to close */}
      {isNotificationOpen && (
        <div
          className="fixed inset-0 bg-transparent z-40"
          onClick={handleClose}
        ></div>
      )}
    </div>
    </div>
  );
};

NavbarAdmin.propTypes = {
  role: PropTypes.string.isRequired,
  admin: PropTypes.object.isRequired,
};

export default NavbarAdmin;
