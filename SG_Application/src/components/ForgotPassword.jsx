import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
      axios.post("http://localhost:8081/api/login/forgot", null, {
        params: { email: email }
    })
    .then(response => {
        alert("Succès : " + response.data);
        navigate('/ResetPassword/',{ state: { emailFromState:  email}});
    })
    .catch(error => {
        if (error.response) {
            alert("Erreur : " + (error.response.data.message || "Une erreur s'est produite"));
            setLoading(false)
        } else {
            alert("Erreur de connexion !");
        }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
          className="relative z-10"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center text-blue-600">Mot de passe oublié</h2>
        <p className="text-gray-600 text-center mt-2">Entrez votre email pour recevoir un code</p>
        <form onSubmit={handleSendCode} className="mt-4">
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg hover:bg-blue-600 transition duration-200"
            disabled={loading}
          >
            {loading ? "Envoi..." : "Envoyer le code"}
          </button>
        </form>
        {message && <p className="mt-3 text-center text-gray-700">{message}</p>}
      </div>
      </motion.div>
    </div>
  );
}
