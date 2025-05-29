import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";  // Assurez-vous d'avoir installé react-icons
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function ChangePasswordEmo() {
  const location = useLocation();
  const { User } = location.state;
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handlePasswordToggle = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axios.post('http://localhost:8081/api/employer/ModifierMotdePasse', null, {
        params: {
          cin: User.cin,  // 🔹 Utiliser 'cin' au lieu de 'admin'
          ancien: formData.oldPassword,
          m1: formData.newPassword,
          m2: formData.confirmPassword
        }
      });
    
      setSuccess("Mot de passe modifié avec succès !");
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      setError("Échec du changement de mot de passe !");
    }
    setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-semibold text-blue-800 mb-4 text-center">
        Modifier le mot de passe
      </h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-3">{success}</p>}
      <form onSubmit={handleSubmit}>
        
        {/* Ancien mot de passe */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-blue-700">
            Ancien mot de passe
          </label>
          <div className="relative">
            <input
              type={showPasswords.old ? "text" : "password"}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => handlePasswordToggle("old")}
            >
              {showPasswords.old ? < MdVisibility/> : < MdVisibilityOff/>}
            </button>
          </div>
        </div>

        {/* Nouveau mot de passe */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-blue-700">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => handlePasswordToggle("new")}
            >
              {showPasswords.new ? < MdVisibility/> : < MdVisibilityOff/>}
            </button>
          </div>
        </div>

        {/* Confirmer le nouveau mot de passe */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-blue-700">
            Confirmer le nouveau mot de passe
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => handlePasswordToggle("confirm")}
            >
              {showPasswords.confirm ? < MdVisibility/> : < MdVisibilityOff/>}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Changer le mot de passe
        </button>
      </form>
    </div>
  );
}
