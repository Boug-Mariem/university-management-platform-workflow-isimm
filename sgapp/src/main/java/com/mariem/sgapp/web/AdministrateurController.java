package com.mariem.sgapp.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mariem.sgapp.dao.AdministrateurRepository;
import com.mariem.sgapp.dao.EmployerRepository;
import com.mariem.sgapp.dao.EnseignantRepository;
import com.mariem.sgapp.dao.NotificationRepository;
import com.mariem.sgapp.entities.DemandeConge;
import com.mariem.sgapp.entities.Enseignant;
import com.mariem.sgapp.entities.Administrateur;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/administrateur")
public class AdministrateurController {
	@Autowired
    private AdministrateurRepository administrateurRepository;
	@Autowired
    private EmployerRepository employerRepository;
	@Autowired
    private EnseignantRepository enseignantRepository;
	@Autowired
    private NotificationRepository notificationRepository;
	@Autowired
	private JavaMailSender mailSender;
	private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	@PostMapping("/create")
    public ResponseEntity<?> createEmployer(@RequestBody Administrateur administrateur) {
		if (enseignantRepository.existsByCin(administrateur.getCin())|| employerRepository.existsByCin(administrateur.getCin()) || administrateurRepository.existsByCin(administrateur.getCin()) ) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ce CIN est déjà utilisé.");
	    }

	    if (enseignantRepository.existsByEmail(administrateur.getEmail())||employerRepository.existsByEmail(administrateur.getEmail())||administrateurRepository.existsByEmail(administrateur.getEmail())) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cet email est déjà utilisé.");
	    }
        String encryptedPassword = passwordEncoder.encode(administrateur.getPassword());
        administrateur.setPassword(encryptedPassword);
        
        Administrateur savedEmployer = administrateurRepository.save(administrateur);
		String subject = "Bienvenue sur ISIMM WorkFlow – Activez votre compte !\r\n";
		String text = "Bonjour "+ administrateur.getNom() +" "+administrateur.getPrenom() +",\r\n"
        		+ "\r\n"
        		+ "Bienvenue sur ISIMM WorkFlow ! \r\n Un administrateur vous a créé un compte sur notre plateforme.\r\n"
        		+ "\r\n"
        		+ "Voici vos informations de connexion :.\r\n"
        		+ "\r\n"
        		+ "🔹 Email :"+administrateur.getEmail()+".\r\n"
        		+ "🔹 Mot de passe par défaut: " +administrateur.getCin()+".\r\n"
        		+"Veuillez vous connecter dès maintenant et modifier votre mot de passe pour sécuriser votre compte\n\n"
        		+ "Si vous avez des questions, n’hésitez pas à nous contacter..\n\n" + "Cordialement,\nL'équipe de support\r\n"
                  + "ISIMM WorkFlow\r\n";
                  sendEmail(administrateur.getEmail(), subject, text);
        return ResponseEntity.ok(savedEmployer);
    }
	
	@Transactional
	@DeleteMapping("/delete/{cin}")
	public ResponseEntity<String> deleteEmployer(@PathVariable String cin) {
		Optional<Administrateur> employerOptional = administrateurRepository.findById(cin);
	    if (employerOptional.isPresent()) {       
	        notificationRepository.deleteByPerCin(cin);
	    	administrateurRepository.deleteByCin(cin);
	        return ResponseEntity.ok("Administrateur supprimé avec succès");
	        
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Administrateur non trouvé");
	    }
	}
	
	@GetMapping("/")
    public List<Administrateur> getAllAdmin() {
        return administrateurRepository.findAll();
    }
	@GetMapping("/find/{cin}")
	public ResponseEntity<Administrateur> getEmployeById(@PathVariable String cin) {
		Administrateur employe = administrateurRepository.findById(cin)
	            .orElseThrow(() -> new RuntimeException("Administrateur avec l'ID " + cin + " n'existe pas."));
	    return ResponseEntity.ok(employe);
	}
	@PostMapping("/modifier")
    public ResponseEntity<String> modifyEmployee(@RequestBody Administrateur administrateur) {
		Optional<Administrateur> employerOptional = administrateurRepository.findById(administrateur.getCin());
	    if (employerOptional.isPresent()) {
	    	administrateurRepository.save(administrateur);
	        return ResponseEntity.ok("Administrateur modifier avec succès");
	        
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin non trouvé");
	    }
	}
	
	@PostMapping("/ModifierMotdePasse")
	public ResponseEntity<String> modifierMotDePasse(@RequestParam String cin ,@RequestParam String ancien,@RequestParam String m1,@RequestParam String m2  ) {
		Optional<Administrateur> adminOptional = administrateurRepository.findById(cin);
	    if (adminOptional.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Administrateur non trouvé.");
	    }
	    Administrateur existingAdmin = adminOptional.get();
	    if (!passwordEncoder.matches(ancien, existingAdmin.getPassword())) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ancien mot de passe incorrect.");
	    }
	    if (!m1.equals(m2)) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Les nouveaux mots de passe ne correspondent pas.");
	    }
	    String encryptedPassword = passwordEncoder.encode(m1);
	    existingAdmin.setPassword(encryptedPassword);
	    administrateurRepository.save(existingAdmin);
	    return ResponseEntity.ok("Mot de passe modifié avec succès !");
	} 
	private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
