import React, { useState } from "react";
import axios from "axios";
import { Button, FormControlLabel, Radio, RadioGroup, TextField, Snackbar, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { FaUserPen } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { saveAs } from "file-saver";
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { motion } from "framer-motion";



const RapportPDF = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState("");
    const [department, setDepartment] = useState("");
    const [grade, setGrade] = useState("");
    const [category, setCategory] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [sex, setSex] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [result, setResults] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [showpdf, setShowpdf] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [fileName, setFileName] = useState(null); 

  const handleRoleChange = (event) => {
    
    setRole(event.target.value);
    setOpenAlert(false);
    setShowTable(false);
    setShowpdf(false);
  };

    const handleSearch = async () => {
        setPdfUrl(null);
        setShowTable(false);  // Cacher le tableau avant de lancer la recherche
        setShowpdf(false);
        setResults([]);       // Vider les anciens résultats
    
        const filters = {};
        if (role) filters.role = role;
        if (sex) filters.sexe = sex;
        if (role === "enseignant") {
            if (grade) filters.grade = grade;
            if (department) filters.department = department;
        } else if (role === "employe") {
            if (category) filters.categorie = category;
            if (specialty) filters.specialite = specialty;
        }
    
        try {
            let response;
            if (role === "enseignant") {
                response = await axios.post("http://localhost:8081/api/enseignant/recherchePourPDF", filters);
            } else if (role === "employe") {
                response = await axios.post("http://localhost:8081/api/employer/recherchePourPDF", filters);
            }
    
            if (response) {
                setResults(response.data);
                setShowTable(response.data.length > 0);
            }
        } catch (error) {
            console.error("Erreur lors de la recherche :", error);
        }
    };    

  const handleGeneratePDF = async() => {
    if( role=== "enseignant"){
        try {
            setOpenAlert(true);
            const response = await axios.post("http://localhost:8081/api/enseignant/generatePDF", result, {
                responseType: "blob", // On attend un fichier PDF
            });
    
            // Création d'une URL pour afficher le PDF
            const pdfBlob = new Blob([response.data], { type: "application/pdf" });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setPdfUrl(pdfUrl);
        } catch (error) {
            console.error("Erreur lors de la génération du PDF:", error);
        }
    }
    else{
        try {
            setOpenAlert(true);
            const response = await axios.post("http://localhost:8081/api/employer/generatePDF", result, {
                responseType: "blob", // On attend un fichier PDF
            });
    
            // Création d'une URL pour afficher le PDF
            const pdfBlob = new Blob([response.data], { type: "application/pdf" });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setPdfUrl(pdfUrl);
        } catch (error) {
            console.error("Erreur lors de la génération du PDF:", error);
        }
    }
    setShowpdf(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenSnackbar(true);
    }, 2000);
  };
  const handleDownload = () => {
      console.log('Nom du fichier:', fileName); 
      saveAs(pdfUrl, fileName);
    };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
    <div className="   min-h-screen max-h-screen element-scroll bg-white p-8 rounded-lg shadow-lg">
      <Typography variant="h4" className="text-center font-semibold mb-4 text-blue-600" sx={{ marginBottom: 5 }}>Générateur de Rapports PDF</Typography>

      {/* Sélection du rôle */}
      <div className="mb-6">
      <Typography variant="h6" className="mb-2 text-blue-700" sx={{ textAlign: "left", fontSize: "1rem" }}>Sélectionnez un rôle :</Typography>
        <RadioGroup value={role} onChange={handleRoleChange} row>
          <FormControlLabel value="employe" control={<Radio />} label="Employé" className="mr-8" />
          <FormControlLabel value="enseignant" control={<Radio />} label="Enseignant" />
        </RadioGroup>
      </div>

      {/* Champs spécifiques */}
      {role === "enseignant" && (
        <div className="mb-6">
        <div className="flex items-center bg-gray-50 rounded-lg shadow-sm p-3 mb-2">
          <select 
                  name="departement"
                  value={department}
                  onChange={(e)=>{setDepartment(e.target.value); setShowTable(false);setShowpdf(false);}}
                  className="flex-1 bg-transparent focus:outline-none text-gray-800 " 
                >
                  <option value="" disabled>Choisir un departement</option>
                  <option value="DepartementMathematique">Departement Mathematique</option>
                  <option value="DepartementInformatique">Departement Informatique</option>
                  <option value="DepartementElectronique">Departement Electronique</option>        
                </select>
        </div>
          <TextField label="Grade" variant="outlined" fullWidth value={grade} onChange={(e) => {setGrade(e.target.value); setShowpdf(false);}} className="mb-4" sx={{ marginBottom: 2 }}/>
        </div>
      )}

      {role === "employe" && (
        <div className="mb-6">
          <TextField label="Catégorie" variant="outlined" fullWidth value={category} onChange={(e) => {setCategory(e.target.value); setShowTable(false);setShowpdf(false);}} className="mb-4" sx={{ marginBottom: 2 }}/>
          <TextField label="Spécialité" variant="outlined" fullWidth value={specialty} onChange={(e) => {setSpecialty(e.target.value); setShowTable(false);setShowpdf(false);}} className="mb-4" />
        </div>
      )}

      {/* Sélection du sexe */}
      <div className="mb-6">
      <Typography variant="h6" className="mb-2 text-blue-700" sx={{ textAlign: "left", fontSize: "1rem" }}>Sélectionnez le sexe :</Typography>
        <RadioGroup value={sex} onChange={(e) => {setSex(e.target.value); setShowTable(false);setShowpdf(false);}} row>
          <FormControlLabel value="MASCULIN" control={<Radio />} label="Homme" className="mr-8" />
          <FormControlLabel value="FEMININ" control={<Radio />} label="Femme" />
          <FormControlLabel
            value=""
            control={<Radio />}
            label="Aucun"
            />

        </RadioGroup>
      </div>

      {/* Bouton de recherche */}
      <div className="flex justify-center mb-6">
        <Button variant="contained" color="primary" onClick={handleSearch} className="px-6 py-2 rounded-full">
          Chercher
        </Button>
      </div>

      {/* Affichage du tableau si des résultats existent */}
      {showTable && result.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2 text-center">CIN</th>
                <th className="px-4 py-2 text-center">Nom</th>
                <th className="px-4 py-2 text-center">Prénom</th>
                <th className="px-4 py-2 text-center">Email</th>
                <th className="px-4 py-2 text-center">Téléphone</th>
              </tr>
            </thead>
            <tbody>
              {result.map((employee) => (
                <tr key={employee.cin} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{employee.cin}</td>
                  <td className="px-4 py-2">{employee.nom}</td>
                  <td className="px-4 py-2">{employee.prenom}</td>
                  <td className="px-4 py-2">{employee.email}</td>
                  <td className="px-4 py-2">{employee.telephone}</td>
            
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      { result.length === 0 && (
        <Typography className="text-center text-red-600 font-semibold mt-4">
            Aucune personne trouvée.
        </Typography>
        )}

      {/* Bouton pour générer le rapport PDF */}
      {showTable && result.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button variant="contained" color="primary" onClick={handleGeneratePDF} className="px-6 py-2 rounded-full">
            {loading ? "Génération en cours..." : "Générer le PDF"}
          </Button>
        </div>
      )}
        {showpdf && pdfUrl ? (
        <div>
            <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="Rapport PDF"
            className="h-[450px] element-scroll mt-2"
            ></iframe>
            <div className="mt-2">
            <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 "
            >
                Télécharger
            </button>
            </div>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                Rapport PDF généré avec succès!
                </MuiAlert>
            </Snackbar>
        </div>
        

        ) : (
        showpdf && <p>Chargement de l’attestation...</p>
        )}
      
      
    </div>
    </motion.div>
  );
};

export default RapportPDF;
