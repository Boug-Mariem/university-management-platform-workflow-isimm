import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";  // Assurez-vous d'avoir installé react-icons

export default function ResetPassword() {
  const location = useLocation();
  const { emailFromState } = location.state || {};

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post("http://localhost:8081/api/login/reset", null, {
      params: {
        email: emailFromState,
        code: code,
        newPassword: newPassword,
      },
    })
      .then((response) => {
        setMessage(response.data);
        alert("Mot de passe modifié avec succès !");
        navigate("/login");
      })
      .catch((error) => {
        if (error.response) {
          setMessage(error.response.data.message || "Une erreur s'est produite.");
        } else {
          setMessage("Erreur de connexion au serveur.");
        }
      })
      .finally(() => setLoading(false));
  };

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setCode(newOtp.join(""));
    if (value && index < 4) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
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
          <h2 className="text-2xl font-semibold text-center text-blue-600">Réinitialiser le mot de passe</h2>
          <p className="text-gray-600 text-center mt-2">Entrez le code reçu et votre nouveau mot de passe</p>
          <form onSubmit={handleResetPassword} className="mt-4">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            <div className="relative mt-3">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 pr-10"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg hover:bg-blue-600 transition duration-200"
              disabled={loading}
            >
              {loading ? "Modification..." : "Réinitialiser"}
            </button>
          </form>
          {message && <p className="mt-3 text-center text-gray-700">{message}</p>}
        </div>
      </motion.div>
    </div>
  );
}
