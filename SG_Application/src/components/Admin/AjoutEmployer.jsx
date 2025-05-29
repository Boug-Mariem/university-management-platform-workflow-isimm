import React, { useState ,useEffect } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import { LuIdCard } from "react-icons/lu";
import { LiaUserCheckSolid } from "react-icons/lia";
import { PiUserList } from "react-icons/pi";
import { PiCityLight } from "react-icons/pi";
import { FaPersonHalfDress } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";
import { MdWorkOutline } from "react-icons/md";
import { GiDiploma } from "react-icons/gi";
import { PiBooks } from "react-icons/pi";
import { BsDiagram2 } from "react-icons/bs";
import { FaAccessibleIcon } from "react-icons/fa";
import { GiPositionMarker } from "react-icons/gi";
import { MdFamilyRestroom } from "react-icons/md";
import { CiTextAlignLeft } from "react-icons/ci";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { motion } from "framer-motion";


import axios from 'axios';


const AjoutEmployer = () => {
  const [formData, setFormData] = useState({
    cin:"",
    matricule:"",
    nom: "",
    prenom:"",
    telephone: "",
    email: "",
    dateNaissance:"",
    lieuNaissance:"",
    sexe:"",
    adresse:"",
    niveauEtude:"",
    diplome:"",
    specialiteDipolme:"",
    grade:"",
    dateEntreAdministrative:"",
    dateNommationGrade:"",
    dateInscriptionGrade:"",
    centreTravaille:"",
    handicap:"",
    etatFamiliale:"",
    nbEnfant:"",
    notes:"",
    password:"",
    position:"",
    etat:"",
    filière:"",
    specalite:"",
    dateInscriptionPosition:"",
    categorie:"",
    section:"",
    nbCongeMax:"",
    travailReel:""
  });
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      password: prevData.cin 
    }));
  }, [formData.cin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const today = new Date().toISOString().split('T')[0]; // Résultat : "2025-02-04"
  const creerNotif=async(cin)=>{
    try{
      const response = await axios.post(`http://localhost:8081/api/notifications/creer/${cin}`,  null,
        {
          params: {
            description: "Bienvenue",
            dateDepose: today ,
          }
        });
      console.log('Notification créé:', response.data);
    } catch (error) {
      console.error('Erreur lors de la création du Notification:', error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Employee Added:", formData);
    try {
      // Envoi de la requête POST à l'API backend
      const response = await axios.post('http://localhost:8081/api/employer/create', formData);
      console.log('Employé créé:', response.data);
      creerNotif(formData.cin);
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data); // Message d'erreur renvoyé par Spring
      } else {
          alert("Une erreur s'est produite. Veuillez réessayer."); // Message générique en cas d'autres erreurs
      }
    }
    // Clear the form after submission
    setFormData({ cin:"",
      matricule:"",
      nom: "",
      prenom:"",
      telephone: "",
      email: "",
      dateNaissance:"",
      lieuNaissance:"",
      sexe:"",
      adresse:"",
      niveauEtude:"",
      diplome:"",
      specialiteDipolme:"",
      grade:"",
      dateEntreAdministrative:"",
      dateNommationGrade:"",
      dateInscriptionGrade:"",
      centreTravaille:"",
      handicap:"",
      etatFamiliale:"",
      nbEnfant:"",
      notes:"",
      password:"",
      position:"",
      etat:"",
      filière:"",
      specalite:"",
      dateInscriptionPosition:"",
      categorie:"",
      section:"",
      nbCongeMax:"",
      travailReel:"" });
  };

  return (
    <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* Conteneur principal */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full max-h-[550px] element-scroll">
        {/* Titre */}
        <h2 className="text-2xl font-bold text-blue-600 flex items-center mb-6">
          <AiOutlineUserAdd className="text-blue-500 mr-3" size={50} />
          Ajouter un Employé
        </h2>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID Employé */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <LuIdCard  className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="cin"
              placeholder="CIN Employé"
              value={formData.cin}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>
          {/* matricule Employé */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <LuIdCard  className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="matricule"
              placeholder="Matricule Employé"
              value={formData.matricule}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>
          {/* Nom  */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <PiUserList className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="nom"
              placeholder="Nom Employé"
              value={formData.nom}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>
          {/* Prenom */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <PiUserList className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="prenom"
              placeholder="Prénom Employé"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>
          {/* Téléphone */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <MdOutlinePhone className="text-blue-500 mr-3" size={24} />
            <input
              type="tel"
              name="telephone"
              placeholder="Numéro de Téléphone"
              value={formData.telephone}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>
          {/* Email */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <MdOutlineEmail className="text-blue-500 mr-3" size={24} />
            <input
              type="email"
              name="email"
              placeholder="Adresse Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>
          {/* date naissance */}
           <div className=" bg-gray-50 relative border border-gray-50 rounded-lg px-3 py-2 focus-within:border-blue-500">     
           <span className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500">
              Date de Naissance
           </span>
            <input
              type="date"
              name="dateNaissance"
              placeholder="Date de Naissance"
              value={formData.dateNaissance}
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none text-blue-500"
            />
          </div>
          {/* lieu naissance */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <PiCityLight className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="lieuNaissance"
              placeholder="Lieu de Naissance"
              value={formData.lieuNaissance}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div> 
          {/* Sexe */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <FaPersonHalfDress className="text-blue-500 mr-3" size={24} />
            <select
              name="sexe"
              value={formData.sexe}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            >
              <option value="" disabled>Choisir le sexe</option>
              <option value="MASCULIN">Homme</option>
              <option value="FEMININ">Femme</option>
            </select>
          </div>
          {/* Adresse */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <FiHome className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="adresse"
              placeholder="Adresse"
              value={formData.adresse}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div> 
          {/* niveauEtude */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <PiBooks className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="niveauEtude"
              placeholder="Niveau d'Etude"
              value={formData.niveauEtude}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div> 
          {/* diplome */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <GiDiploma className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="diplome"
              placeholder="Diplome"
              value={formData.diplome}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div> 
          {/* specialiteDipolme */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <PiBooks className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="specialiteDipolme"
              placeholder="Spécialité du Diplome"
              value={formData.specialiteDipolme}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div> 
          {/* grade */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <BsDiagram2 className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="grade"
              placeholder="Grade"
              value={formData.grade}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div> 
          <div className=" bg-gray-50 relative border border-gray-50 rounded-lg px-3 py-2 focus-within:border-blue-500">     
              <span className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500">
              Date d´Entrée Administrative
              </span>
            <input
              type="date"
              name="dateEntreAdministrative"
              placeholder="Date d'Entrée Administrative"
              value={formData.dateEntreAdministrative}
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none text-blue-500"
            />
          </div>
          {/* dateNommationGrade */}
          <div className=" bg-gray-50 relative border border-gray-50 rounded-lg px-3 py-2 focus-within:border-blue-500">     
              <span className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500">
              Date Nommation au Grade
              </span>
            <input
              type="date"
              name="dateNommationGrade"
              placeholder="Date Nommation au Grade"
              value={formData.dateNommationGrade}
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none text-blue-500"
            />
          </div>
          {/* dateInscriptionGrade */}
          <div className=" bg-gray-50 relative border border-gray-50 rounded-lg px-3 py-2 focus-within:border-blue-500">     
              <span className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500">
              Date Inscription au Grade
              </span>
            <input
              type="date"
              name="dateInscriptionGrade"
              placeholder="Date Inscription au Grade"
              value={formData.dateInscriptionGrade}
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none text-blue-500"
            />
          </div>
          
          {/* centreTravaille */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <GiPositionMarker className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="centreTravaille"
              placeholder="Centre du Travaille"
              value={formData.centreTravaille}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div> 
          {/* handicap */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <FaAccessibleIcon className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="handicap"
              placeholder="Handicap"
              value={formData.handicap}
              onChange={handleChange}
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div> 
          {/* etatFamiliale */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <MdFamilyRestroom className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="etatFamiliale"
              placeholder="État Familiale"
              value={formData.etatFamiliale}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>
          {/* Nombre des Enfants */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <MdFamilyRestroom className="text-blue-500 mr-3" size={24} />
            <input
              type="number"
              name="nbEnfant"
              placeholder="Nombre d'enfants"
              value={formData.nbEnfant}
              onChange={handleChange}
              min="0" // Empêche les nombres négatifs
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>
          {/* position */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <MdWorkOutline className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="position"
              placeholder="Position"
              value={formData.position}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>
          {/* etat */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <CiTextAlignLeft className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="etat"
              placeholder="État"
              value={formData.etat}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>
          {/* filière */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <CiTextAlignLeft className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="filière"
              placeholder="Filière"
              value={formData.filière}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>
          {/* specalite */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <CiTextAlignLeft className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="specalite"
              placeholder="Spécialité"
              value={formData.specalite}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>
          {/* dateInscriptionPosition */}
          <div className=" bg-gray-50 relative border border-gray-50 rounded-lg px-3 py-2 focus-within:border-blue-500">     
              <span className="absolute -top-2 left-3 bg-gray-50 px-1 text-xs text-gray-500">
              Date d´inscription à la position
              </span>
            <input
              type="date"
              name="dateInscriptionPosition"
              placeholder="Date d'inscription à la position"
              value={formData.dateInscriptionPosition}
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none text-blue-500"
            />
          </div>
          {/* categorie */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <CiTextAlignLeft className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="categorie"
              placeholder="Catégorie"
              value={formData.categorie}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>
          {/* section */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <CiTextAlignLeft className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="section"
              placeholder="Section"
              value={formData.section}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>
          {/* nbCongeMax */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <AiOutlineFieldNumber className="text-blue-500 mr-3" size={24} />
            <input
              type="number"
              name="nbCongeMax"
              placeholder="Nombre de jours de congé"
              value={formData.nbCongeMax}
              onChange={handleChange}
              required
              min="0"
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>
          {/* travail  reel */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <CiTextAlignLeft className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="travailReel"
              placeholder="Travail réel"
              value={formData.travailReel}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>

          {/* notes */}
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3">
            <CiTextAlignLeft className="text-blue-500 mr-3" size={24} />
            <input
              type="text"
              name="notes"
              placeholder="Note"
              value={formData.notes}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent focus:outline-none text-gray-800"
            />
          </div>
          
          {/*----------------------------------------------------------- */}

          <div className="flex justify-center">
          {/* Bouton Soumettre */}
          <button
            type="submit"
            className="px-6 bg-blue-500 text-white py-3 rounded-lg shadow-lg hover:bg-blue-600 flex items-center justify-center"
          >
            <LiaUserCheckSolid className="mr-2" size={26} />
            Sauvegarder
          </button>
          </div>
        </form>
      </div>
    </div>
    </motion.div>
  );
};

export default AjoutEmployer;
