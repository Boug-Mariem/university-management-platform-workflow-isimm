import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { motion } from "framer-motion";
import axios from 'axios';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";  
import { useEffect } from 'react';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); 

    useEffect(() => {
        localStorage.removeItem("token"); // Supprime le token à l'accès à /home
      }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8081/api/login/authentifier', 
                new URLSearchParams({
                    email: username,
                    password: password,
                }), 
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );
            console.log('Connexion réussie:',response.data);
            localStorage.setItem("token", response.data.token);
            if (response.data.role === "Superadmin") {
                navigate('/Menu/');
            } else if (response.data.role === "admin") {
                navigate('/MenuAdmin/');
            } else if (response.data.role === "Enseignant") {
                navigate('/EnseignantDashboard');
            } else if (response.data.role === "Employer") {
                navigate('/EmployerDashboard');
            } else {
                alert('Email ou mot de passe incorrect.');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                alert('Email ou mot de passe incorrect.');
            } else {
                console.error('Erreur lors de la connexion:', error);
                alert('Une erreur est survenue. Veuillez réessayer.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <motion.div
                className="relative z-10 w-full max-w-lg" // Largeur augmentée ici
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <div className="bg-white p-8 rounded-lg shadow-lg w-full min-w-[350px]"> {/* Ajout min-w-[350px] */}
                    <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600 mt-2">Se connecter</h2>
                    
                    <input
                        type="email"
                        placeholder="Adresse Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    {/* Conteneur pour le champ de mot de passe avec icône */}
                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        onClick={handleLogin}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mt-4"
                    >
                        Se connecter
                    </button>

                    <div className="text-right">
                        <button 
                            onClick={() => navigate('/ForgotPassword')} 
                            className="text-sm text-blue-500 hover:underline mt-2"
                        >
                            Mot de passe oublié ?
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
