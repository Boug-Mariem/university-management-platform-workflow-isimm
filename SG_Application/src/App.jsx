import './App.css'
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DemandeDeCongeEnseignant from './components/User/DemandeDeCongeEnseignant';
import Menu from './components/Admin/Menu';
import DemandeDeCongeEmployer from './components/User/DemandeDeCongeEmployer';
import EnseignantDashboard from './components/User/EnseignantDashboard';
import EmployerDashboard from './components/User/EmployerDashboard';
import ProfileEmployer from './components/User/ProfileEmployer';
import ProfileEnseignant from './components/User/ProfileEnseignant';
import TacheEmployer from './components/User/TacheEmployer';
import MenuAdmin from './components/Admin/MenuAdmin';
import ChangePasswordEmo from './components/User/ChangePasswordEmo';
import ChangePasswordEns from './components/User/ChangePasswordEns';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/Login" element={<Login />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} /> 
      <Route path="/ResetPassword" element={<ResetPassword />} /> 
      <Route element={<ProtectedRoute allowedRoles={["Superadmin"]} />}>
          <Route path="/Menu/*" element={<Menu />} /> 
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/MenuAdmin/*" element={<MenuAdmin />} /> 
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Enseignant"]} />}>
          <Route path="/EnseignantDashboard" element={<EnseignantDashboard />} />
          <Route path="/ProfileEnseignant" element={<ProfileEnseignant />} />
          <Route path="/enseignant/DemandeDeCongeEnseignant" element={<DemandeDeCongeEnseignant />} />
          <Route path="/ChangePasswordEns" element={<ChangePasswordEns />} /> 
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["Employer"]} />}>
          <Route path="/EmployerDashboard" element={<EmployerDashboard />} />
          <Route path="/ProfileEmployer" element={<ProfileEmployer />} />
          <Route path="/employer/DemandeDeCongeEmployer" element={<DemandeDeCongeEmployer />} />
          <Route path="/employer/TacheEmployer" element={<TacheEmployer />} />
          <Route path="/ChangePasswordEmo" element={<ChangePasswordEmo />} /> 
      </Route>
      </Routes>
    </Router>
  )
}

export default App
