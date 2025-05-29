import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem("token");

    // Si pas de token, redirige vers /login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role; // Récupère le rôle depuis le token
        const currentTime = Date.now() / 1000;

        // Vérifie si le token est expiré
        if (decodedToken.exp < currentTime) {
            localStorage.removeItem("token"); // Supprime le token expiré
            return <Navigate to="/login" replace />;
        }

        // Vérifie si le rôle de l'utilisateur est autorisé
        if (allowedRoles && !allowedRoles.includes(userRole)) {
            return <Navigate to="/login" replace />; // Ou une page "Accès refusé"
        }

        // Si tout est OK, rend les composants enfants
        return <Outlet />;
    } catch (error) {
        console.error("Erreur lors du décodage du token:", error);
        localStorage.removeItem("token"); // Supprime un token invalide
        return <Navigate to="/login" replace />;
    }
};

ProtectedRoute.propTypes = {
    allowedRoles: PropTypes.string.isRequired,
};
export default ProtectedRoute;