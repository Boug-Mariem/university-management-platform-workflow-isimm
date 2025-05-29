package com.mariem.sgapp.web;
import java.time.LocalDate;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mariem.sgapp.dao.AdministrateurRepository;
import com.mariem.sgapp.dao.DemandeAttestationTravailRepository;
import com.mariem.sgapp.dao.DemandeCongeRepository;
import com.mariem.sgapp.dao.EmployerRepository;
import com.mariem.sgapp.dao.EnseignantRepository;
import com.mariem.sgapp.dao.NotificationRepository;
import com.mariem.sgapp.dao.TacheRepository;
import com.mariem.sgapp.entities.Administrateur;
import com.mariem.sgapp.entities.DemandeConge;
import com.mariem.sgapp.entities.Employer;
import com.mariem.sgapp.entities.Enseignant;
import com.mariem.sgapp.entities.Personne;
import com.mariem.sgapp.entities.DemandeConge.TypeConge;

import jakarta.transaction.Transactional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/employer")
public class EmployerController {
	@Autowired
    private EmployerRepository employerRepository;
	@Autowired
    private EnseignantRepository enseignantRepository;
	@Autowired
    private AdministrateurRepository adminRepository;
	@Autowired
    private NotificationRepository notificationRepository;
	@Autowired
    private DemandeCongeRepository demandeCongeRepository;
	@Autowired
    private DemandeAttestationTravailRepository demandeAttesRepository;
	@Autowired
    private TacheRepository tacheRepository;
	@Autowired
	private JavaMailSender mailSender;
	private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	@PostMapping("/create")
    public ResponseEntity<?> createEmployer(@RequestBody Employer employer) {
		if (enseignantRepository.existsByCin(employer.getCin())|| employerRepository.existsByCin(employer.getCin()) || adminRepository.existsByCin(employer.getCin()) ) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ce CIN est déjà utilisé.");
	    }

	    if (enseignantRepository.existsByEmail(employer.getEmail())||employerRepository.existsByEmail(employer.getEmail())||adminRepository.existsByEmail(employer.getEmail())) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cet email est déjà utilisé.");
	    }
        String encryptedPassword = passwordEncoder.encode(employer.getPassword());
        employer.setPassword(encryptedPassword);
        
        Employer savedEmployer = employerRepository.save(employer);
        String subject = "Bienvenue sur ISIMM WorkFlow – Activez votre compte !\r\n";
		String text = "Bonjour "+ employer.getNom() +" "+employer.getPrenom() +",\r\n"
        		+ "\r\n"
        		+ "Bienvenue sur ISIMM WorkFlow ! \r\n Un administrateur vous a créé un compte sur notre plateforme.\r\n"
        		+ "\r\n"
        		+ "Voici vos informations de connexion :.\r\n"
        		+ "\r\n"
        		+ "🔹 Email :"+employer.getEmail()+".\r\n"
        		+ "🔹 Mot de passe par défaut: " +employer.getCin()+".\r\n"
        		+"Veuillez vous connecter dès maintenant et modifier votre mot de passe pour sécuriser votre compte\n\n"
        		+ "Si vous avez des questions, n’hésitez pas à nous contacter..\n\n" + "Cordialement,\nL'équipe de support\r\n"
                  + "ISIMM WorkFlow\r\n";
                  sendEmail(employer.getEmail(), subject, text);
        return ResponseEntity.ok(savedEmployer);
    }
	
	@Transactional
	@DeleteMapping("/delete/{cin}")
	public ResponseEntity<String> deleteEmployer(@PathVariable String cin) {
		Optional<Employer> employerOptional = employerRepository.findById(cin);
	    if (employerOptional.isPresent()) {
	    	demandeCongeRepository.deleteByDemandeurCin(cin);
	    	demandeAttesRepository.deleteByCinpersonne(cin);	        
	        tacheRepository.deleteByEmployerCin(cin);	        
	        notificationRepository.deleteByPerCin(cin);
	        employerRepository.deleteByCin(cin);
	        return ResponseEntity.ok("Employé supprimé avec succès");
	        
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employé non trouvé");
	    }
	}
	
	@GetMapping("/")
    public List<Employer> getAllEmployers() {
        return employerRepository.findAll();
    }
	@GetMapping("/find/{cin}")
	public ResponseEntity<Employer> getEmployeById(@PathVariable String cin) {
		System.out.println(cin);
	    Employer employe = employerRepository.findById(cin)
	            .orElseThrow(() -> new RuntimeException("Employé avec l'ID " + cin + " n'existe pas."));
	    return ResponseEntity.ok(employe);
	}
	@PostMapping("/modifier")
    public ResponseEntity<String> modifyEmployee(@RequestBody Employer employee) {
		Optional<Employer> employerOptional = employerRepository.findById(employee.getCin());
	    if (employerOptional.isPresent()) {
	    	employerRepository.save(employee);
	        return ResponseEntity.ok("Employé modifier avec succès");
	        
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employé non trouvé");
	    }
	}
	
	@GetMapping("/rechercheparSexe")
	public List<Employer> searchBySexe(@RequestParam String sexe) {
		Personne.Sexe sexe1;
		if(sexe=="FEMININ") {
	    	sexe1=Personne.Sexe.FEMININ;
	    }
	    else if(sexe=="MASCULIN"){
	    	sexe1=Personne.Sexe.MASCULIN;
	    }
	    else {
	    	sexe1=null;
	    }
		return employerRepository.findBySexe(sexe1);
    }
	@GetMapping("/rechercheparCategorie")
    public List<Employer> searchByGrade(@RequestParam String Categorie) {
        return employerRepository.findByCategorie(Categorie);
    }
	@GetMapping("/rechercheparSpecialite")
    public List<Employer> searchByDepartement(@RequestParam String Specialite) {
        return employerRepository.findBySpecalite(Specialite);
    }
	@GetMapping("/rechercheparSexeEtCategorie")
    public List<Employer> searchBySexeAndGrade(@RequestParam String sexe,@RequestParam  String Categorie) {
		Personne.Sexe sexe1;
		if(sexe==null) {
			sexe1=null;
		}
		else if(sexe.equals("FEMININ")) {
	    	sexe1=Personne.Sexe.FEMININ;
	    }
	    else {
	    	sexe1=Personne.Sexe.MASCULIN;
	    }
		return employerRepository.findBySexeAndCategorie(sexe1, Categorie);
    }
	@GetMapping("/rechercheparSexEetSpecialite")
    public List<Employer> searchBySexeAndDepartement(@RequestParam String sexe,@RequestParam String Specialite) {
		Personne.Sexe sexe1;
		if(sexe==null) {
			sexe1=null;
		}
		else if(sexe.equals("FEMININ")) {
	    	sexe1=Personne.Sexe.FEMININ;
	    }
	    else {
	    	sexe1=Personne.Sexe.MASCULIN;
	    }
		return employerRepository.findBySexeAndSpecalite(sexe1, Specialite);
    }
	@GetMapping("/rechercheparGradeEetSpecialite")
    public List<Employer> searchByGradeAndDepartement(@RequestParam String grade,@RequestParam String Specialite) {
        return employerRepository.findByCategorieAndSpecalite(grade, Specialite);
    }
	@GetMapping("/rechercheparAll")
    public List<Employer> searchAllFilters(@RequestParam String sexe,@RequestParam  String Categorie,@RequestParam String Specialite) {
		Personne.Sexe sexe1;
		if(sexe==null) {
			sexe1=null;
		}
		else if(sexe.equals("FEMININ")) {
	    	sexe1=Personne.Sexe.FEMININ;
	    }
	    else {
	    	sexe1=Personne.Sexe.MASCULIN;
	    }
		return employerRepository.findBySexeAndCategorieAndSpecalite(sexe1, Categorie, Specialite);
    }
	
	@PostMapping("/recherchePourPDF")
	public List<Employer> searchEmployes(@RequestBody Map<String, String> filters) {
	    String sexeStr = filters.get("sexe");
	    Personne.Sexe sexe;
	    if (sexeStr==null) {
	    	sexe=null;
	    }
	    else if(sexeStr.equals("FEMININ")) {
	    	sexe=Personne.Sexe.FEMININ;
	    }
	    else  {
	    	sexe=Personne.Sexe.MASCULIN;
	    }
	    String categorie = filters.get("categorie");
	    String specialite = filters.get("specialite");	    
	    if (sexe != null && categorie == null && specialite == null) {
	        return employerRepository.findBySexe(sexe);
	    } else if (sexe == null && categorie != null && specialite == null) {
	        return employerRepository.findByCategorie(categorie);
	    } else if (sexe == null && categorie == null && specialite != null) {
		    return employerRepository.findBySpecalite(specialite);
		}else if (sexe != null && categorie != null && specialite == null) {
	        return employerRepository.findBySexeAndCategorie(sexe,categorie);
	    }else if (sexe != null && categorie == null && specialite != null) {
	        return employerRepository.findBySexeAndSpecalite(sexe,specialite);
	    }else if (sexe == null && categorie != null && specialite != null) {
	        return employerRepository.findByCategorieAndSpecalite(categorie,specialite);
	    }else if (sexe != null && categorie != null && specialite != null) {
	        return employerRepository.findBySexeAndCategorieAndSpecalite(sexe, categorie, specialite);
	    }
	    return employerRepository.findAll();
	}
	@PostMapping("/generatePDF")
	public ResponseEntity<byte[]> recevoirListe(@RequestBody List<Employer> liste) {
		 try {
	            Document document = new Document();
	            ByteArrayOutputStream out = new ByteArrayOutputStream();
	            PdfWriter.getInstance(document, out);
	            document.open();

	            // Ajouter un titre centré
	            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
	            Paragraph title = new Paragraph("Rapport des Employés", titleFont);
	            title.setAlignment(Element.ALIGN_CENTER);
	            document.add(title);
	            document.add(new Paragraph("\n"));

	            // Ajouter le contenu de la liste des employés
	            Font normalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
	            for (Employer emp : liste) {
	                document.add(new Paragraph("CIN: " + emp.getCin(), normalFont));
	                document.add(new Paragraph("Nom: " + emp.getNom(), normalFont));
	                document.add(new Paragraph("Prénom: " + emp.getPrenom(), normalFont));
	                document.add(new Paragraph("Email: " + emp.getEmail(), normalFont));
	                document.add(new Paragraph("Téléphone: " + emp.getTelephone(), normalFont));
	                document.add(new Paragraph("--------------------------------------------", normalFont)); // Séparateur
	                document.add(new Paragraph("\n"));
	            }

	            document.close();

	            // Récupérer les bytes du PDF généré
	            byte[] pdfBytes = out.toByteArray();

	            // Configurer la réponse HTTP
	            HttpHeaders headers = new HttpHeaders();
	            headers.setContentType(MediaType.APPLICATION_PDF);
	            headers.setContentDispositionFormData("attachment", "rapport.pdf");

	            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
	        } catch (DocumentException e) {
	            e.printStackTrace();
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
	        }
	    }        
	@PostMapping("/ModifierMotdePasse")
	public ResponseEntity<String> modifierMotDePasse(@RequestParam String cin ,@RequestParam String ancien,@RequestParam String m1,@RequestParam String m2  ) {
		Optional<Employer> adminOptional = employerRepository.findById(cin);
	    if (adminOptional.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employe non trouvé.");
	    }
	    Employer existingAdmin = adminOptional.get();
	    if (!passwordEncoder.matches(ancien, existingAdmin.getPassword())) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ancien mot de passe incorrect.");
	    }
	    if (!m1.equals(m2)) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Les nouveaux mots de passe ne correspondent pas.");
	    }
	    String encryptedPassword = passwordEncoder.encode(m1);
	    existingAdmin.setPassword(encryptedPassword);
	    employerRepository.save(existingAdmin);
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
