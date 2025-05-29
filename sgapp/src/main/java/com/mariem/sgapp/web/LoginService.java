package com.mariem.sgapp.web;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;


import com.mariem.sgapp.dao.AdministrateurRepository;
import com.mariem.sgapp.dao.EmployerRepository;
import com.mariem.sgapp.dao.EnseignantRepository;
import com.mariem.sgapp.entities.Administrateur;
import com.mariem.sgapp.entities.Employer;
import com.mariem.sgapp.entities.Enseignant;
import com.mariem.sgapp.entities.Personne;

@Service
public class LoginService {
	private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	@Autowired
    private EmployerRepository employeRepository;
    @Autowired
    private EnseignantRepository enseignantRepository;
    @Autowired
    private AdministrateurRepository administrateurRepository;
    @Autowired
    private JavaMailSender mailSender;
    ////se connecter 
    public Administrateur authenticateAdmin(String email,String password) {
    	Optional<Administrateur> AdminOptional = administrateurRepository.getAdminPourLogin(email);
    	if(AdminOptional.isPresent() && passwordEncoder.matches(password, AdminOptional.get().getPassword()) ) {
    		return AdminOptional.get();
    	}
    	return null;
    }
    
    public Enseignant authenticateEnseignant(String email,String password) {
    	Optional<Enseignant> EnseignantOptional = enseignantRepository.getAdminPourLogin(email);
    	if(EnseignantOptional.isPresent() && passwordEncoder.matches(password, EnseignantOptional
    			.get().getPassword())) {
    		return EnseignantOptional.get();
    	}
    	return null;
    }
    
    public Employer authenticateEmployer(String email,String password) {
    	Optional<Employer> EmployerOptional = employeRepository.getAdminPourLogin(email);
    	if(EmployerOptional.isPresent() && passwordEncoder.matches(password, EmployerOptional.get().getPassword())) {
    		return EmployerOptional.get();
    	}
    	return null;
    }
    ////Mot de passe oublier 
    // Classe interne pour stocker le code et son expiration
    private static class CodeInfo {
        String code;
        LocalDateTime expirationTime;
        public CodeInfo(String code, LocalDateTime expirationTime) {
            this.code = code;
            this.expirationTime = expirationTime;
        }
    }
    
    private Map<String, CodeInfo> resetCodes = new HashMap<>();

    public void sendResetPasswordCode(String email) {
        if (!employeRepository.existsByEmail(email) && !enseignantRepository.existsByEmail(email) && !administrateurRepository.existsByEmail(email)) {
            throw new RuntimeException("Cet email n'existe pas !");
        }
        String code = String.valueOf(new Random().nextInt(90000) + 10000);
        resetCodes.put(email, new CodeInfo(code, LocalDateTime.now().plusMinutes(10)));
        sendEmail(email, "Code de réinitialisation", "Bonjour,\r\n"
        		+ "\r\n"
        		+ "Vous avez demandé la réinitialisation de votre mot de passe.\r\n"
        		+ "Veuillez utiliser le code suivant pour procéder à la modification de votre mot de passe :\r\n"
        		+ "\r\n"
        		+ "🔒 Votre code de réinitialisation : "+code+ "\r\n"
        		+ "\r\n"
        		+ "⚠️ Ce code est valide pendant 10 minutes. Ne le partagez avec personne pour des raisons de sécurité.\r\n"
        		+ "\r\n"
        		+ "Si vous n'avez pas fait cette demande, veuillez ignorer cet email.\r\n"
        		+ "\r\n"
        		+ "Cordialement,\r\n"
        		+ "L'équipe de support\r\n"
        		+ "ISIMM WorkFlow\r\n" );
    }
    
    public void resetPassword(String email, String code, String newPassword) {
        // Vérifier si le code existe en mémoire
        if (!resetCodes.containsKey(email)) {
            throw new RuntimeException("Aucun code de réinitialisation trouvé pour cet email !");
        }
        CodeInfo codeInfo = resetCodes.get(email);
        if (!codeInfo.code.equals(code)) {
            throw new RuntimeException("Code incorrect !");
        }
        if (codeInfo.expirationTime.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Le code a expiré !");
        }
        String encryptedPassword = passwordEncoder.encode(newPassword);
        if (employeRepository.existsByEmail(email)) {
        	Employer emp=employeRepository.findByEmail(email);
        	emp.setPassword(encryptedPassword);
        	employeRepository.save(emp);
        }else if(enseignantRepository.existsByEmail(email)) {
        	Enseignant emp=enseignantRepository.findByEmail(email);
        	emp.setPassword(encryptedPassword);
        	enseignantRepository.save(emp);
        }
        else if(administrateurRepository.existsByEmail(email)) {
        	Administrateur emp=administrateurRepository.findByEmail(email);
        	emp.setPassword(encryptedPassword);
        	administrateurRepository.save(emp);
        }
        else {
        	throw new RuntimeException("Utilisateur introuvable");
        }
        resetCodes.remove(email);
    }
    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
