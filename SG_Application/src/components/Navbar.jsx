import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { IoNotifications } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { FaCalendarDay, FaFileAlt } from 'react-icons/fa';
//pour enseignant
const Navbar = ({ role, nom, prenom ,cin}) => {
  const navigate = useNavigate();
  const [userNotifications, setUserNotifications] = useState([
    { id: 1, message: 'Nouvelle demande acceptée.', date: '20 Janvier' },
    { id: 2, message: 'Vous avez un document à télécharger.', date: '21 Janvier' },
    { id: 3, message: 'Congé en attente de validation.', date: '22 Janvier' },
    { id: 4, message: 'Congé en attente de validation.', date: '22 Janvier' },
    { id: 5, message: 'Congé en attente de validation.', date: '22 Janvier' },
    { id: 6, message: 'Congé en attente de validation.', date: '22 Janvier' },
  ]);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleNotificationToggle = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleDeleteNotification = (id) => {
    const updatedNotifications = userNotifications.filter(
      (notification) => notification.id !== id
    );
    setUserNotifications(updatedNotifications);
  };

  const handleProfileClick = () => {
    navigate('/profile' ,{ state: { cinUser: cin } });
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
    navigate('/user/DemandeDeConge');  
};

  return (
    <div className="bg-gradient-to-r from-blue-500 to-gray-800 p-3 shadow-lg flex justify-between items-center rounded-lg relative">
      {/* Navbar content */}
      <div className="text-2xl font-semibold text-white tracking-wide">{role}</div>

      <div className="text-lg text-white">{nom} {prenom}</div>
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
                className="text-left text-white py-2 px-4 bg-transparent hover:bg-gray-200 hover:text-gray-800 transition-all rounded-md flex items-center space-x-2"
              >
                <FaFileAlt size={15} />
                <span className="text-sm">Demande Attestation de Travail</span>
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
              {userNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm hover:shadow-md"
                >
                  <span className="font-semibold text-gray-700">{notification.message}</span>
                  <span className="ml-4 text-sm text-gray-500">{notification.date}</span>
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

Navbar.propTypes = {
  role: PropTypes.string.isRequired,
  nom: PropTypes.string.isRequired,
  prenom: PropTypes.string.isRequired,
  cin: PropTypes.string.isRequired,
};

export default Navbar;
