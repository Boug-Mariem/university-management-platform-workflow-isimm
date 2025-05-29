import GeneralNavbar from "../GeneralNavbar";
import { useNavigate } from 'react-router-dom';
import React, { useState,useEffect } from 'react';
import { TbHistoryToggle } from "react-icons/tb";
import { IoDownloadOutline } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import NavbarEmployer from "./NavbarEmployer";
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { jwtDecode } from 'jwt-decode';



const EmployerDashboard = () => {
    const navigate = useNavigate();
    const [CinUser, setCinUser] = useState(null);
    const [cin,setcin]=useState(CinUser)
    const [employee,setemployee]=useState(null);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            try {
                const decodedToken = jwtDecode(token);
                setCinUser(decodedToken.cin);
                setcin(decodedToken.cin);
            } catch (error) {
                console.error("Erreur lors du décodage du token:", error);
                navigate("/login"); // Redirige si token invalide
            }
        }
    }, [navigate]);  
    
    useEffect(() => {
      if (cin) {
        const chercherEmp = async () => {
          try {
            const response = await axios.get(`http://localhost:8081/api/employer/find/${cin}`);
            setemployee(response.data); 
          } catch (error) {
            console.error("Erreur lors de la récupération de l'emplyer:", error);
          }
        };
        chercherEmp();
      }
      }, [cin]);

      const [leaveHistory,setLeaveHistory] = useState([]);
      const [remainingDays,setRemainingDays] = useState(null);
      // Récupérer l'historique des congés et les jours restants
      useEffect(() => {
        const fetchLeaveHistory = async () => {
          try {
            if (employee) {
            const response = await axios.get(`http://localhost:8081/api/demandeConge/his/employer/${employee.cin}`);
            setLeaveHistory(response.data.historiqueConge); 
            setRemainingDays(response.data.joursRestants); 
            }
          } catch (error) {
            console.error("Erreur lors de la récupération de l'historique des congés:", error);
          }
        };
        fetchLeaveHistory();    
        const interval = setInterval(fetchLeaveHistory, 5000); // Rafraîchit toutes les 5 secondes
        return () => clearInterval(interval);
      }, [employee]);

      const [userRequests, setUserRequests] = useState([]);
      useEffect(() => {
        const apporterRequests = async () => {
          try {
            if (employee) {
            const response = await axios.get(`http://localhost:8081/api/demandeConge/demandesAttenteRejeter/${employee.cin}`);
            const demandesConge = response.data.map((demande) => ({
              typedemande: "conge",
              contenu: demande
            }));  
            // Fusionne avec les demandes existantes
            setUserRequests((prevRequests) => [
              ...prevRequests.filter(req => req.typedemande !== "conge"), // Supprime les anciennes demandes de congé
              ...demandesConge
            ]); 
            }
          } catch (error) {
            console.error("Erreur lors de la récupération des request:", error);
          }
        };
        apporterRequests();
        const interval = setInterval(apporterRequests, 5000); // Rafraîchit toutes les 5 secondes
      return () => clearInterval(interval);
      }, [employee]);

      useEffect(() => {
        const apporterRequestsAttes = async () => {
          try {
            if (employee) {
              const response = await axios.get(`http://localhost:8081/api/attestation/demandesAttenteRejeter/${employee.cin}`);
              const demandesAttestation = response.data.map((demande) => ({
                typedemande: "attestation",
                contenu: demande
              }));
      
              // Fusionne avec les demandes existantes
              setUserRequests((prevRequests) => [
                ...prevRequests.filter(req => req.typedemande !== "attestation"), // Supprime les anciennes demandes d'attestation
                ...demandesAttestation
              ]);
            }
          } catch (error) {
            console.error("Erreur lors de la récupération des demandes d'attestation:", error);
          }
        };
      
        apporterRequestsAttes();
        const interval = setInterval(apporterRequestsAttes, 5000); // Rafraîchit toutes les 5 secondes
        return () => clearInterval(interval);
      }, [employee]);

      const [documents, setdocuments] = useState([]);
      useEffect(() => {
        const apporterAttes = async () => {
          try {
            if (employee) {
              const response = await axios.get(`http://localhost:8081/api/attestation/getattesaccepter/${employee.cin}`);
              setdocuments(response.data);
            }
          } catch (error) {
            console.error("Erreur lors de la récupération des attestations:", error);
          }
        };
      
        apporterAttes();
        const interval = setInterval(apporterAttes, 5000); // Rafraîchit toutes les 5 secondes
        return () => clearInterval(interval);
      }, [employee]);

    const handleDeleteRequestConge = async(id) => {
      const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette demande ?");
      if (confirmation) {
      try {
        const response = await axios.post(`http://localhost:8081/api/demandeConge/SupprimerDemande/${id}`);
        console.log('supprimer avec succes:', response.data);
        window.location.reload();
      } catch (error) {
        console.error('Erreur lors de la suppression de la demande:', error);
      }
    }
    };
    const handleDeleteRequestAttestation = async(id) => {
      const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette demande ?");
      if (confirmation) {
      try {
        const response = await axios.post(`http://localhost:8081/api/attestation/SupprimerDemande/${id}`);
        console.log('supprimer avec succes:', response.data);
        window.location.reload();
      } catch (error) {
        console.error('Erreur lors de de la suppression de la demande:', error);
      }
    }
    };
    const handleDeleteDocument = async(id) => {
      const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette attestation ?");
      if (confirmation) {
        try {
          const response = await axios.post(`http://localhost:8081/api/attestation/SupprimerDemande/${id}`);
          console.log('supprimer avec succes:', response.data);
          window.location.reload();
        } catch (error) {
          console.error('Erreur lors de la suppression de la demande:', error);
        }
    }
    };
    if (!cin) {
      return <div>Chargement...</div>;
  }
    return (
        <div className="min-h-screen">
          <GeneralNavbar />
          <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {employee ? (
            <>
              <NavbarEmployer role="Employé" employee={employee} />
              <h1 className="text-2xl font-bold text-blue-600 mb-6"></h1>
      
              {/* Grille pour les 2 premières boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20 mt-20" style={{ marginTop: '60px' }}>
                {/* Box 1: Historique des congés */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-400 " style={{ marginRight: '20px' }}>
                  <div className="flex items-center justify-center space-x-4">
                    <h2 className="text-lg font-bold text-blue-500 mb-4 flex items-center"> <TbHistoryToggle size={30} className="mr-3" />
                      Historique des Congés</h2>
                  </div>
                  <ul className="space-y-2 mb-4 max-h-[240px] element-scroll">
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
                  <div className="flex justify-center items-center">
                    <div className="w-28 h-28 bg-gradient-to-r from-blue-500 to-gray-800 text-white flex items-center justify-center rounded-full shadow-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{remainingDays}</div>
                        <div className="text-sm">jours restants</div>
                      </div>
                    </div>
                  </div>
                </div>
      
                {/* Box 2: Demandes effectuées */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-400" style={{ marginRight: '20px' }}>
                  <div className="flex items-center justify-center space-x-4">
                    <h2 className="text-lg font-bold text-blue-500 mb-4 flex items-center"> <IoDocumentTextOutline size={30} className="mr-3" />Demandes Effectuées</h2>
                  </div>
                  <ul className="space-y-2 max-h-[360px] element-scroll">
                {userRequests.map((request, index) => (
                <li
                    key={index}
                    className="p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md space-y-2"  >
                    {request.typedemande === "conge" ? (
                      <>
                      <div className="flex justify-between items-center">
                      <div>
                          <span className="font-bold text-blue-500">{request.contenu.type}</span>
                          <span className="ml-2 text-sm text-gray-500">
                            ({request.contenu.nbJours} jours)
                          </span>
                      </div>
                      <div
                      className={`text-center text-sm font-semibold ${
                        request.contenu.etatconge === "Accepter"
                          ? "text-green-500"
                          : request.contenu.etatconge === "Rejeter"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {request.contenu.etatconge}
                    </div>
                      <button
                        style={{ display: request.contenu.etatconge === "Rejeter" ? "none" : "inline-block" }}
                        className="ml-4  text-gray-500 p-1 rounded-full  transition"
                        onClick={() => handleDeleteRequestConge(request.contenu.id)}
                      >
                        X
                      </button>
                      
                      </div>
                      
                    <div className="flex justify-between text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Début :</span>{" "}
                        {new Date(request.contenu.debutconge).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Fin :</span>{" "}
                        {new Date(request.contenu.finconge).toLocaleDateString()}
                      </div>
                    </div>
                    </>
                    ) : request.typedemande === "attestation" ? (
                      <>
                       <div className="flex justify-between items-center">
                          <div>
                              <span className="font-bold text-blue-500">Demande attestation de Travail</span>
                            </div>
                            <div
                            className={`text-center text-sm font-semibold ${
                              request.contenu.etatdAttestationTravail === "Accepter"
                                ? "text-green-500"
                                : request.contenu.etatdAttestationTravail === "Rejeter"
                                ? "text-red-500"
                                : "text-yellow-500"
                            }`}
                          >
                            {request.contenu.etatdAttestationTravail}
                        </div>
                          <button
                            style={{ display: request.contenu.etatdAttestationTravail === "Rejeter" ? "none" : "inline-block" }}
                            className="ml-4  text-gray-500 p-1 rounded-full  transition"
                            onClick={() => handleDeleteRequestAttestation(request.contenu.id)}
                          >
                            X
                          </button>
                          
                          </div>
                          </>
                        ) : (
                      <span className="text-gray-500">Type de demande inconnu</span>
                    )}
                </li>
                ))}
            </ul>
                </div>
      
              </div>
      
              {/* Box des Documents Reçus */}
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-400">
                <div className="flex items-center justify-center space-x-4">
                  <h2 className="text-lg font-bold text-blue-500 mb-4 flex items-center"><IoDownloadOutline size={30} className="mr-3" />Documents Disponibles</h2>
                </div>
                <ul className="space-y-2 max-h-48 element-scroll">
                  {documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm hover:shadow-md"
                    >
                      {/* Nom du document */}
                      <span className="text-gray-700">{doc.name}</span>
                      <div className="flex justify-between items-center rounded-lg relative gap-8">
                        {/* Lien de téléchargement */}
                        <a
                          href={doc.link}
                          download={doc.name}
                          className="text-blue-500 underline hover:text-blue-700"
                        >
                          Télécharger
                        </a>
                        <button
                          className="ml-4  text-gray-500 p-1 rounded-full transition"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          X
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div>Chargement des données de l employé...</div> // Message pendant le chargement
          )}
          </motion.div>
        </div>
      );
};

export default EmployerDashboard;
