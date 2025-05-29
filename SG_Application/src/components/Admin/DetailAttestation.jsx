import React, { useState,useEffect } from "react";
import { saveAs } from "file-saver";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";



const DetailAttestation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { iddemandeAttes } = location.state || {};
  const [pdfUrl, setPdfUrl] = useState(null);
  const [fileName, setFileName] = useState(null); 
  const [personne,setpersonne]=useState(null);
  const [demande, setDemande] = useState(null); 

  const newPlugin = defaultLayoutPlugin();
  useEffect(() => {
    axios.get(`http://localhost:8081/api/attestation/getdemande/${iddemandeAttes}`)
        .then((response) => {
          setDemande(response.data); 
        })
        .catch((error) => {
            console.error("Il y a eu une erreur lors de la récupération des demandes!", error);
        });
    }, [iddemandeAttes]);


  useEffect(() => {
    // Fonction pour récupérer le PDF depuis l'API Spring
    const fetchAttestation = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/attestation/get/${iddemandeAttes}`, {
          responseType: 'arraybuffer', // Demande une réponse binaire
        });
        console.log("Headers reçus :", response.headers);

      // Vérifier Content-Disposition
      const contentDisposition = response.headers['content-disposition'];
      console.log("Content-Disposition:", contentDisposition); 

      // Extraction du nom du fichier
      let extractedFileName = "Attestation.pdf"; // Valeur par défaut
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (fileNameMatch && fileNameMatch[1]) {
          extractedFileName = fileNameMatch[1];
        }
      }
      setFileName(extractedFileName);
      console.log("Nom du fichier extrait :", extractedFileName);

      // Création du Blob et affichage du PDF
      const file = new Blob([response.data], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(file));
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'attestation:', error);
      }
    };

    fetchAttestation();
    }, [iddemandeAttes]);

  const onDocumentLoadError = (error) => {
    console.error('Erreur de chargement du PDF:', error);
    alert("Une erreur est survenue lors du chargement du PDF.");
  };
  const handleDownload = () => {
    console.log('Nom du fichier:', fileName); 
    saveAs(pdfUrl, fileName);
  };
  const today = new Date().toISOString().split('T')[0]; 
  const creerNotifAccept=async(cin)=>{
    try{
      const response = await axios.post(`http://localhost:8081/api/notifications/creer/${cin}`,  null,
        {
          params: {
            description: `Votre attestation de travail est prête.`,
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
            description: `Votre demande d'attestation de travail a été refusée.`,
            dateDepose: today ,
          }
        });
      console.log('Notification créé:', response.data);
    } catch (error) {
      console.error('Erreur lors de la création du Notification:', error);
    }
  }


  const handleAccept = async() => {
    try {
      const response = await axios.post(`http://localhost:8081/api/attestation/accepterDemandeAttes/${iddemandeAttes}`);
      alert("Vous avez accepté !");
      creerNotifAccept(demande.cinpersonne)
      console.log('Demande de congé acceptée');
      navigate('/Menu/DemandeRecu');
    } catch (error) {
      console.error('Erreur lors acceptation de la demande:', error);
    }
  };

  const handleReject = async() => {
    try {
      const response = await axios.post(`http://localhost:8081/api/attestation/rejeterDemandeAttes/${iddemandeAttes}`);
      alert("Vous avez refusé !");
      creerNotifRefus(demande.cinpersonne)
      console.log('Demande de congé acceptée');
      navigate('/Menu/DemandeRecu');
    } catch (error) {
      console.error('Erreur lors acceptation de la demande:', error);
    }
  };


  return (
    <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-4">Attestation de Travail</h1>
      {pdfUrl ? (
        <div>
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="Attestation PDF"
            className="h-[450px] element-scroll"
          ></iframe>
          <div className="mt-2">
            {/* Boutons Accepter, Refuser et Télécharger */}
        <div className="flex justify-between mt-0">
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <MdCheckCircle className="text-2xl mr-2" />
            Accepter
          </button>
          <button
            onClick={handleReject}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <MdCancel className="text-2xl mr-2" />
            Refuser
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Télécharger
          </button>
        </div>
        </div>
        </div>
      ) : (
        <p>Chargement de l attestation...</p>
      )}
    </div>
    </motion.div>
  );
};

export default DetailAttestation;