package com.mariem.sgapp.web;

import java.io.ByteArrayOutputStream;
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

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.mariem.sgapp.dao.AdministrateurRepository;
import com.mariem.sgapp.dao.DemandeAttestationTravailRepository;
import com.mariem.sgapp.dao.DemandeCongeRepository;
import com.mariem.sgapp.dao.EmployerRepository;
import com.mariem.sgapp.dao.EnseignantRepository;
import com.mariem.sgapp.dao.NotificationRepository;
import com.mariem.sgapp.entities.DemandeConge;
import com.mariem.sgapp.entities.Employer;
import com.mariem.sgapp.entities.Enseignant;
import com.mariem.sgapp.entities.Personne;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/enseignant")
public class EnseignantController {
	@Autowired
    private EnseignantRepository enseignantRepository;
	@Autowired
    private EmployerRepository employerRepository;
	@Autowired
    private AdministrateurRepository adminRepository;
	@Autowired
    private NotificationRepository notificationRepository;
	@Autowired
    private DemandeCongeRepository demandeCongeRepository;
	@Autowired
    private DemandeAttestationTravailRepository demandeAttesRepository;
	@Autowired
	private JavaMailSender mailSender;
	private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
/*
	@PostMapping("/create")
    public ResponseEntity<Enseignant> createEnseignant(@RequestBody Enseignant enseignant) {
		System.out.print(enseignant);
        // Crypter le mot de passe avant de le sauvegarder
        String encryptedPassword = passwordEncoder.encode(enseignant.getPassword());
        enseignant.setPassword(encryptedPassword);
        
        Enseignant savedEnseignant = enseignantRepository.save(enseignant);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEnseignant);
    }*/
    
	@PostMapping("/create")
	public ResponseEntity<?> createEnseignant(@RequestBody Enseignant enseignant) {
	    if (enseignantRepository.existsByCin(enseignant.getCin())|| employerRepository.existsByCin(enseignant.getCin()) || adminRepository.existsByCin(enseignant.getCin()) ) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ce CIN est déjà utilisé.");
	    }

	    if (enseignantRepository.existsByEmail(enseignant.getEmail())||employerRepository.existsByEmail(enseignant.getEmail())||adminRepository.existsByEmail(enseignant.getEmail())) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cet email est déjà utilisé.");
	    }

	    String encryptedPassword = passwordEncoder.encode(enseignant.getPassword());
	    enseignant.setPassword(encryptedPassword);

	    Enseignant savedEnseignant = enseignantRepository.save(enseignant);
	    String subject = "Bienvenue sur ISIMM WorkFlow – Activez votre compte !\r\n";
		String text = "Bonjour "+ enseignant.getNom() +" "+enseignant.getPrenom() +",\r\n"
        		+ "\r\n"
        		+ "Bienvenue sur ISIMM WorkFlow ! \r\n Un administrateur vous a créé un compte sur notre plateforme.\r\n"
        		+ "\r\n"
        		+ "Voici vos informations de connexion :.\r\n"
        		+ "\r\n"
        		+ "🔹 Email :"+enseignant.getEmail()+".\r\n"
        		+ "🔹 Mot de passe par défaut: " +enseignant.getCin()+".\r\n"
        		+"Veuillez vous connecter dès maintenant et modifier votre mot de passe pour sécuriser votre compte\n\n"
        		+ "Si vous avez des questions, n’hésitez pas à nous contacter..\n\n" + "Cordialement,\nL'équipe de support\r\n"
                  + "ISIMM WorkFlow\r\n";
                  sendEmail(enseignant.getEmail(), subject, text);
	    return ResponseEntity.status(HttpStatus.CREATED).body(savedEnseignant);
	}

	@Transactional
	@DeleteMapping("/delete/{cin}")
	public ResponseEntity<String> deleteEnseignant(@PathVariable String cin) {
		Optional<Enseignant> enseignantOptional = enseignantRepository.findById(cin);
	    if (enseignantOptional.isPresent()) {
	    	enseignantRepository.deleteByCin(cin);
	    	demandeCongeRepository.deleteByDemandeurCin(cin);
	    	demandeAttesRepository.deleteByCinpersonne(cin);	        
	        notificationRepository.deleteByPerCin(cin);
	        return ResponseEntity.ok("Enseignant supprimé avec succès");
	        
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Enseignant non trouvé");
	    }
	}
	@GetMapping("/")
    public List<Enseignant> getAllEnseignants() {
        return enseignantRepository.findAll();
    }
	@GetMapping("/find/{cin}")
	public ResponseEntity<Enseignant> getEnseignantById(@PathVariable String cin) {
		Enseignant enseignant = enseignantRepository.findById(cin)
	            .orElseThrow(() -> new RuntimeException("Enseignant avec l'ID " + cin + " n'existe pas."));
	    return ResponseEntity.ok(enseignant);
	}
	@PostMapping("/modifier")
    public ResponseEntity<String> modifyEnseignant(@RequestBody Enseignant enseignant) {
		Optional<Enseignant> enseignantOptional = enseignantRepository.findById(enseignant.getCin());
	    if (enseignantOptional.isPresent()) {
	    	enseignantRepository.save(enseignant);
	        return ResponseEntity.ok("Enseignant modifier avec succès");
	        
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Enseignant non trouvé");
	    }
	}
	// les recherches 
	public List<Enseignant> searchBySexe(@RequestParam String sexe) {
		Personne.Sexe sexe1;
	    if(sexe=="FEMININ") {
	    	sexe1=Personne.Sexe.FEMININ;
	    }
	    else {
	    	sexe1=Personne.Sexe.MASCULIN;
	    }
		return enseignantRepository.findBySexe(sexe1);
    }
    public List<Enseignant> searchByGrade(@RequestParam String grade) {
        return enseignantRepository.findByGrade(grade);
    }
    public List<Enseignant> searchByDepartement(@RequestParam Enseignant.Departement departement) {
        
    	return enseignantRepository.findByDepartement(departement);
    }
    public List<Enseignant> searchBySexeAndGrade(@RequestParam String sexe,@RequestParam String grade) {
    	Personne.Sexe sexe1;
	    if(sexe=="FEMININ") {
	    	sexe1=Personne.Sexe.FEMININ;
	    }
	    else {
	    	sexe1=Personne.Sexe.MASCULIN;
	    }
    	return enseignantRepository.findBySexeAndGrade(sexe1, grade);
    }
    /*
    public List<Enseignant> searchBySexeAndDepartement(@RequestParam String sexe,@RequestParam String dep) {
    	Personne.Sexe sexe1;
	    if(sexe=="FEMININ") {
	    	sexe1=Personne.Sexe.FEMININ;
	    }
	    else {
	    	sexe1=Personne.Sexe.MASCULIN;
	    }
    	return enseignantRepository.findBySexeAndDepartement(sexe1, dep);
    }
    public List<Enseignant> searchByGradeAndDepartement(@RequestParam String grade,@RequestParam String dep) {
        return enseignantRepository.findByGradeAndDepartement(grade, dep);
    }
    public List<Enseignant> searchAllFilters(@RequestParam String sexe,@RequestParam String grade,@RequestParam String departement) {
    	Personne.Sexe sexe1;
	    if(sexe=="FEMININ") {
	    	sexe1=Personne.Sexe.FEMININ;
	    }
	    else {
	    	sexe1=Personne.Sexe.MASCULIN;
	    }
    	return enseignantRepository.findBySexeAndGradeAndDepartement(sexe1, grade, departement);
    }*/
	@PostMapping("/recherchePourPDF")
	public List<Enseignant> searchEmployes(@RequestBody Map<String, String> filters) {
	    String sexeStr = filters.get("sexe");
	    Personne.Sexe sexe;
	    if(sexeStr==null) {
	    	sexe=null;
	    }
	    else if(sexeStr.equals("FEMININ")) {
	    	sexe=Personne.Sexe.FEMININ;
	    }
	    else {
	    	sexe=Personne.Sexe.MASCULIN;
	    }    
	    String grade = filters.get("grade");
	    String departementStr = filters.get("department");	 
	    Enseignant.Departement departement;
	    if(departementStr==null) {
	    	departement = null;
	    }
	    else if (departementStr.equals("DepartementMathematique")) {
	        departement = Enseignant.Departement.DepartementMathematique;
	    } else if (departementStr.equals("DepartementElectronique")) {
	        departement = Enseignant.Departement.DepartementElectronique;
	    } else  {
	        departement = Enseignant.Departement.DepartementInformatique;
	    }	    
	    if (sexe != null && grade == null && departement == null) {
	        return enseignantRepository.findBySexe(sexe);
	    } else if (sexe == null && grade != null && departement == null) {
	        return enseignantRepository.findByGrade(grade);
	    } else if (sexe == null && grade == null && departement != null) {
		    return enseignantRepository.findByDepartement(departement);
		}else if (sexe != null && grade != null && departement == null) {
	        return enseignantRepository.findBySexeAndGrade(sexe,grade);
	    }else if (sexe != null && grade == null && departement != null) {
	        return enseignantRepository.findBySexeAndDepartement(sexe,departement);
	    }else if (sexe == null && grade != null && departement != null) {
	        return enseignantRepository.findByGradeAndDepartement(grade,departement);
	    }else if (sexe != null && grade != null && departement != null) {
	        return enseignantRepository.findBySexeAndGradeAndDepartement(sexe, grade, departement);
	    }
	    return enseignantRepository.findAll();
	}
	
	@PostMapping("/generatePDF")
	public ResponseEntity<byte[]> recevoirListe(@RequestBody List<Enseignant> liste) {
		 try {
	            Document document = new Document();
	            ByteArrayOutputStream out = new ByteArrayOutputStream();
	            PdfWriter.getInstance(document, out);
	            document.open();

	            // Ajouter un titre centré
	            Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
	            Paragraph title = new Paragraph("Rapport des Enseignants", titleFont);
	            title.setAlignment(Element.ALIGN_CENTER);
	            document.add(title);
	            document.add(new Paragraph("\n"));

	            // Ajouter le contenu de la liste des employés
	            Font normalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);
	            for (Enseignant emp : liste) {
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
		Optional<Enseignant> adminOptional = enseignantRepository.findById(cin);
	    if (adminOptional.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Enseignant non trouvé.");
	    }
	    Enseignant existingAdmin = adminOptional.get();
	    if (!passwordEncoder.matches(ancien, existingAdmin.getPassword())) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ancien mot de passe incorrect.");
	    }
	    if (!m1.equals(m2)) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Les nouveaux mots de passe ne correspondent pas.");
	    }
	    String encryptedPassword = passwordEncoder.encode(m1);
	    existingAdmin.setPassword(encryptedPassword);
	    enseignantRepository.save(existingAdmin);
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
