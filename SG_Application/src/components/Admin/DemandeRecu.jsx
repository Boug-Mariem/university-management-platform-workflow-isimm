import React from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { HiOutlineArrowRight } from "react-icons/hi"; 
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from "react";
import axios from 'axios';
import { motion } from "framer-motion";


const DemandeRecu = () => {
  const navigate = useNavigate();
  // Données simulées
  const [demandesConge,setdemandesConge]=useState([]);
  const [user,setuser]=useState([]);
  const [userAttes,setuserAttes]=useState([]);
  
    useEffect(() => {
      const fetchDemandes = () => {
        axios.get('http://localhost:8081/api/demandeConge/ToutsdemandesAttente')
          .then((response) => {
            setdemandesConge(response.data); 
            fetchUserDetails(response.data);
          })
          .catch((error) => {
            console.error("Il y a eu une erreur lors de la récupération des demandes !", error);
          });
      };
      // Appel initial au chargement de la page
      fetchDemandes();
      // Rafraîchir toutes les 5 secondes
      const interval = setInterval(fetchDemandes, 5000);
      // Nettoyage de l'intervalle lors du démontage du composant
      return () => clearInterval(interval);
    }, []);

    const fetchUserDetails = async (demandes) => {
      const userDetailsList = [];
  
      for (const demande of demandes) {
        try {
          const response = await axios.get(`http://localhost:8081/api/demandeConge/ownerConge/${demande.demandeurCin}`);
          const cin=response.data.personne.cin;
          const nom=response.data.personne.nom;
          const prenom=response.data.personne.prenom;
          const demandeur={ cin, nom, prenom } ;
          
          if (!userDetailsList.some(user => user.cin === cin)) {
            userDetailsList.push({ cin, nom, prenom });
          }
        } catch (error) {
          console.error(`Erreur lors de la récupération des infos pour le CIN ${demande.demandeurCin}`, error);
        }
      }
  
      setuser(userDetailsList); 
    };

    const fetchUserDetailsAttes = async (demandes) => {
      const userDetailsList = [];
    
      for (const demande of demandes) {
        try {
          const response = await axios.get(`http://localhost:8081/api/attestation/ownerAttes/${demande.cinpersonne}`);
          const cin = response.data.personne.cin;
          const nom = response.data.personne.nom;
          const prenom = response.data.personne.prenom;
          const demandeur = { cin, nom, prenom };
    
          // Ajouter les détails si ce CIN n'existe pas déjà dans la liste
          if (!userDetailsList.some(user => user.cin === cin)) {
            userDetailsList.push({ cin, nom, prenom });
          }
        } catch (error) {
          console.error(`Erreur lors de la récupération des infos pour le CIN ${demande.cinpersonne}`, error);
        }
      }
    
      setuserAttes(userDetailsList);
    };
    
    const [demandesAttestation, setdemandesAttestation] = useState([]);
    
    useEffect(() => {
      const fetchDemandesAttestation = () => {
        axios.get('http://localhost:8081/api/attestation/attestationsAttente')
          .then((response) => {
            setdemandesAttestation(response.data); 
            fetchUserDetailsAttes(response.data);
          })
          .catch((error) => {
            console.error("Il y a eu une erreur lors de la récupération des demandes d'attestation!", error);
          });
      };
    
      // Appel initial au chargement de la page
      fetchDemandesAttestation();
    
      // Correction ici, utiliser la bonne fonction dans setInterval
      const interval = setInterval(fetchDemandesAttestation, 5000);
    
      return () => clearInterval(interval);
    }, []);
    

  const allerDetailAttestation=(id) =>{
    navigate('/Menu/DetailAttestation',{ state: { iddemandeAttes: id } });
  }
  const allerDetailConge=(id) =>{
    navigate('/Menu/DetailDemandeConge',{ state: { iddemande: id } });
  }
  return (
    <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-6">
        {/* Bloc des demandes de congé */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            {/* Avatar */}
            <IoDocumentTextOutline className="text-blue-500" size={50} />  
            {/* Titre */}
                <h2 className="text-lg font-bold text-blue-600">
                    Demandes de Congé
                </h2>
          </div>

          <ul className="space-y-3 max-h-[428px] element-scroll">
          {demandesConge && demandesConge.length > 0 ? (
            demandesConge.map((demande) => (
              <li
                key={demande.id}
                className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm hover:shadow-md"
              >
                <div>
                  <p className="font-semibold text-gray-700">{user.find(u=>u.cin===demande.demandeurCin)?.nom||"Nom non trouvé"} {user.find(u=>u.cin===demande.demandeurCin)?.prenom||"Nom non trouvé"}</p>
                  <p className="text-sm text-gray-500">Type de congé : {demande.type}</p>
                </div>
                <button className="text-blue-500 hover:text-blue-600" onClick={()=>allerDetailConge(demande.id)}>
                  <HiOutlineArrowRight className="text-xl" />
                </button>
              </li>
            ))
          ) : (
            <li className="p-4 bg-gray-50 rounded-xl text-center text-gray-400">
              Aucune demande de congé disponible.
            </li>
          )}
        </ul>

        </div>

        {/* Bloc des demandes d'attestation de travail */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <IoDocumentTextOutline className="text-blue-500" size={50}  />
            <h2 className="text-lg font-bold text-blue-600">
            Demandes Attestation de Travail
            </h2>
          </div>

          <ul className="space-y-3 max-h-[428px] element-scroll">
          {demandesAttestation && demandesAttestation.length > 0 ? (
            demandesAttestation.map((demande) => (
              <li
                key={demande.id}
                className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm hover:shadow-md"
              >
                <div>
                  <p className="font-semibold text-gray-700">{userAttes.find(u=>u.cin===demande.cinpersonne)?.nom||"Nom non trouvé"} {userAttes.find(u=>u.cin===demande.cinpersonne)?.prenom||"Nom non trouvé"}</p>
                </div>
                <button className="text-blue-500 hover:text-blue-600" onClick={()=>allerDetailAttestation(demande.id)}>
                  <HiOutlineArrowRight className="text-xl" />
                </button>
              </li>
            ))
          ) : (
            <li className="p-4 bg-gray-50 rounded-xl text-center text-gray-400">
              Aucune demande de congé disponible.
            </li>
          )}
        </ul>
        </div>
      </div>
    </div>
    </motion.div>
  );
};

export default DemandeRecu;
