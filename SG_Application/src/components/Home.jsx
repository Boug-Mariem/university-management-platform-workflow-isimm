import { useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, MapPin, Phone, Mail } from "lucide-react";
import { FaFax } from "react-icons/fa";
import { Printer } from "lucide-react";
import logo from '../assets/images/logoisimm.png';
import logo2 from '../assets/images/iconeISIMM WorkFlow.png';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    localStorage.removeItem("token"); // Supprime le token à l'accès à /home
  }, []);
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
                    src={logo2}
                    alt="Logo de l'application"
                    className=" h-16 rounded-md"
                  />
          <h1 className="text-2xl font-bold text-blue-600">ISIMM WorkFlow</h1>
        </div>
        <nav className="hidden md:flex gap-6 text-gray-600 font-medium">
          <a href="#about" className="hover:text-blue-600">À propos</a>
          <a href="#strengths" className="hover:text-blue-600">Nos Atouts</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
          <a href="/Login" className="hover:text-blue-600">Login</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-gray-900 text-white text-center">
        <video autoPlay loop muted
            src="/video/video1.mp4" 
            className="w-full rounded-lg shadow-lg absolute inset-0  h-full object-cover opacity-50" 
            />
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl font-extrabold">Bienvenue à ISIM Monastir</h2>
          <p className="mt-4 text-lg">institut supérieur d´informatique et de mathématiques de monastir</p>
          <p className="mt-4 text-lg">Un lieu d´excellence académique et d´innovation.</p>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-8 text-center bg-white">
        <h3 className="text-3xl font-bold text-blue-600">À propos de notre université</h3>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
        L’Institut Supérieur d’Informatique et de Mathématique de Monastir (ISIMM) est un établissement universitaire qui propose une formation diversifiée dans les domaines de l’informatique, des mathématiques appliquées, de l’électronique et des technologies avancées. Il offre un cycle préparatoire intégré ainsi que des programmes de licence en Informatique, en Technologies de l’Information et de la Communication (TIC), et en Électronique, Automatique et Automatisme (EAA). L’ISIMM propose également des formations d’ingénieur en Informatique et en Microélectronique, ainsi que des masters spécialisés. Grâce à un enseignement de qualité et un encadrement académique rigoureux, l’ISIMM prépare ses étudiants aux défis du marché du travail et aux avancées technologiques de demain
        </p>
      </section>

      {/* Strengths Section */}
      <section id="strengths" className="py-20 px-8 bg-gray-100">
        <h3 className="text-3xl font-bold text-blue-600 text-center">Nos Atouts</h3>
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm">
            <h4 className="text-xl font-semibold text-blue-600">Excellence Académique</h4>
            <p className="text-gray-600 mt-2">Un enseignement de qualité reconnu à l´échelle internationale.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm">
            <h4 className="text-xl font-semibold text-blue-600">Innovation & Recherche</h4>
            <p className="text-gray-600 mt-2">Des laboratoires modernes et des projets de recherche ambitieux.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm">
            <h4 className="text-xl font-semibold text-blue-600">Clubs & Vie Étudiante</h4>
            <p className="text-gray-600 mt-2">Un environnement dynamique avec de nombreuses associations étudiantes.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className=" bg-gray-900 text-white py-5 text-center">
        <div className="mt-6 flex flex-wrap justify-center gap-10">
          <div className="flex items-center gap-3 text-gray-400">
            <MapPin size={20} /> <span>Avenue de la Corniche, Monastir 5000 Tunisie</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <Phone size={20} /> <span>+216 70 011 920</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
          <Printer size={20} /> <span>FaFax : +216 70 011 959</span>
          </div>    
        </div>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="https://www.facebook.com/profile.php?id=100063489403806" className="hover:text-blue-400">Facebook</a>
          <a href="https://www.linkedin.com/school/isimm/posts/?feedView=all" className="hover:text-blue-400">LinkedIn</a>
        </div>
        <p className="text-sm">© 2025 Notre Université. Tous droits réservés.</p>
      </section>
    </div>
  );
}
