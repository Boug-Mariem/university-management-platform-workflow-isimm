import { UNSAFE_DataRouterStateContext } from "react-router-dom";
import GeneralNavbar from "../GeneralNavbar";
import Menu from "./Menu";
import NavbarAdmin from "./NavbarAdmin";
import axios from 'axios';
import { useState ,useEffect} from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Tooltip, XAxis, YAxis, Legend, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";

const AdminDashboard = () => {
    const [nbCongetotale,setnbCongetotale]=useState(0);
    const [nbCongeAttente,setnbCongeAttente]=useState(0);
    const [nbCongeAccepter,setnbCongeAccepter]=useState(0);
    const [nbCongeRejeter,setnbCongeRejeter]=useState(0);
    const [nbAttestationtotale,setnbAttestationtotale]=useState(0);
    const [nbAttestationAttente,setnbAttestationAttente]=useState(0);
    const [nbAttestationAccepter,setnbAttestationAccepter]=useState(0);
    const [nbAttestationRejeter,setnbAttestationRejeter]=useState(0);

    const [repartitionDemandesConge,setrepartitionDemandesConge]=useState([]);  
    useEffect(() => {
      const nbredemandeCONGE = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/api/demandeConge/statistiques`);
          setnbCongetotale(response.data.total);
          setnbCongeAccepter(response.data.accepte);
          setnbCongeAttente(response.data.attente);
          setnbCongeRejeter(response.data.rejete);
          const valueAccept = Math.round((response.data.accepte * 100) / response.data.total * 100) / 100;
          const valueAttent=Math.round((response.data.attente*100)/response.data.total)/100;
          const valueRejet=Math.round((response.data.rejete*100)/response.data.total)/100;
          setrepartitionDemandesConge([
            { name: "Acceptées", value:  valueAccept, color: "#22c55e" },
            { name: "En attente", value: valueAttent, color: "#facc15" },
            { name: "Rejetées", value: valueRejet, color: "#ef4444" },
          ]);  
        } catch (error) {
          console.error(`Erreur lors de la récupération des nombre de demande de congé`, error);
        }
      };
    
      nbredemandeCONGE(); 
      const interval = setInterval(nbredemandeCONGE, 5000);
      return () => clearInterval(interval);
    }, [nbCongetotale,nbCongeAttente,nbCongeAccepter,nbCongeRejeter]);

    const [repartitionDemandesAttes,setrepartitionDemandesAttes]=useState([]);  
    useEffect(() => {
      const nbredemandeATTES = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/api/attestation/statistiques`);
          setnbAttestationtotale(response.data.total);
          setnbAttestationAccepter(response.data.accepte);
          setnbAttestationAttente(response.data.attente);
          setnbAttestationRejeter(response.data.rejete);
          const valueAccept=Math.round((response.data.accepte*100)/response.data.total)/100;
          const valueAttent=Math.round((response.data.attente*100)/response.data.total)/100;
          const valueRejet=Math.round((response.data.rejete*100)/response.data.total)/100;
          setrepartitionDemandesAttes([
            { name: "Acceptées", value:  valueAccept, color: "#22c55e" },
            { name: "En attente", value: valueAttent, color: "#facc15" },
            { name: "Rejetées", value: valueRejet, color: "#ef4444" },
          ]);  
        } catch (error) {
          console.error(`Erreur lors de la récupération des nombre de demande d'Attestation de travail`, error);
        }
      };
    
      nbredemandeATTES(); 
      const interval = setInterval(nbredemandeATTES, 5000);
      return () => clearInterval(interval);
    }, [nbAttestationtotale,nbAttestationAccepter,nbAttestationAttente,nbAttestationRejeter]);
      // 
      const [demandesParMois, setDemandesParMois] = useState({});

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get("http://localhost:8081/api/demandeConge/parMois");
            setDemandesParMois(response.data);
          } catch (error) {
            console.error("Erreur lors de la récupération des demandes par mois :", error);
          }
        };

        fetchData();
      }, []);

      // Transformer l'objet en tableau
      const dataChart = Object.entries(demandesParMois).map(([mois, demandes]) => ({
        mois,
        demandes,
      }));
  return (
    <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
<div className="   min-h-screen max-h-screen element-scroll bg-gray-100 p-8">
    <h1 className="text-2xl font-semibold text-blue-600">📊 Tableau de bord</h1>
    <div className="max-w-3xl mx-auto">
      {/* Statistiques en cartes */}
      <div className="grid grid-cols-4 gap-6 mt-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold">Total des demandes</h2>
          <p className="text-2xl font-bold text-blue-600">{nbCongetotale+nbAttestationtotale}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold">Demandes acceptées</h2>
          <p className="text-2xl font-bold text-green-500">{nbCongeAccepter+nbAttestationAccepter}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold">Demandes en attente</h2>
          <p className="text-2xl font-bold text-yellow-500">{nbAttestationAttente+nbCongeAttente}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold">Demandes Rejetées</h2>
          <p className="text-2xl font-bold text-red-500">{nbAttestationRejeter+nbCongeRejeter}</p>
        </div>
      </div>
        
      {/* Graphiques */}
      <div className="grid grid-cols-2 gap-6 mt-6">
      <div className="bg-white shadow-md rounded-lg p-2">
          <h2 className="text-lg font-semibold">Répartition des demandes d´attestation</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={repartitionDemandesAttes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {repartitionDemandesAttes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition des demandes */}
        <div className="bg-white shadow-md rounded-lg p-2">
          <h2 className="text-lg font-semibold">Répartition des demandes de conge</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={repartitionDemandesConge} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {repartitionDemandesConge.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 mt-6">
      {/* Évolution des demandes de conge*/}
      <div className="bg-white shadow-md rounded-lg p-2 ">
          <h2 className="text-lg font-semibold">📈 Évolution des demandes de conge</h2>
          <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dataChart}>
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="demandes" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
          </ResponsiveContainer>
        </div>
        </div>
    </div>
    </div>
    </motion.div>
  );
};

export default AdminDashboard;

