package com.mariem.sgapp.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.mariem.sgapp.dao.AdministrateurRepository;
import com.mariem.sgapp.dao.DemandeAttestationTravailRepository;
import com.mariem.sgapp.dao.EmployerRepository;
import com.mariem.sgapp.dao.EnseignantRepository;
import com.mariem.sgapp.entities.Administrateur;
import com.mariem.sgapp.entities.DemandeAttestationTravail;
import com.mariem.sgapp.entities.DemandeConge;
import com.mariem.sgapp.entities.Employer;
import com.mariem.sgapp.entities.Enseignant;
import com.mariem.sgapp.entities.Personne;
import com.itextpdf.text.Document;
import com.itextpdf.text.pdf.PdfDocument;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import com.itextpdf.text.Paragraph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DemandeAttestationService {
	@Autowired
    private DemandeAttestationTravailRepository demandeattestationRepo;
	@Autowired
    private EmployerRepository employeRepository;
    @Autowired
    private EnseignantRepository enseignantRepository;
    @Autowired
    private AdministrateurRepository adminRepository;
    @Autowired
    private JavaMailSender mailSender;
    
	public DemandeAttestationTravail creerDemandeAttestationPourEmployer(Employer employer) {
		Optional<Administrateur> OPSG= adminRepository.getSG();
		 Administrateur SG=OPSG.get();
		 LocalDate dateActuelle = LocalDate.now();
		 DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		 String contenu = "Attestation de Travail\n\n" +
			        "Je soussigné(e), " + SG.getNom() + " " + SG.getPrenom() + 
			        ", agissant en qualité de secretaire generale " +
			        " de " + employer.getCentreTravaille() + 
			        ", atteste par la présente que " + employer.getNom() + " " + employer.getPrenom() + 
			        ", titulaire de la carte d’identité nationale numéro " + employer.getCin() + 
			        ", est employé(e) au sein de notre entreprise en tant que " + employer.getPosition() + 
			        " depuis le " + employer.getDateEntreAdministrative() + ".\n\n" +
			        "Durant son activité au sein de notre société, " + employer.getNom() + 
			        " a accompli ses missions avec sérieux et professionnalisme. " + 
			        "La présente attestation est délivrée à la demande de l’intéressé(e) pour servir et valoir ce que de droit.\n\n" +
			        "Fait à " + employer.getCentreTravaille() + ", le " + dateActuelle.format(formatter) + ".\n\n";
		try {
            // Génération du PDF
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter writer = PdfWriter.getInstance(document, baos);
            document.open();
            document.add(new Paragraph(contenu));
            document.close();

            // Création de la demande d'attestation
            DemandeAttestationTravail demande = new DemandeAttestationTravail(employer.getCin());
            demande.setPdfFile(baos.toByteArray()); // Stockage du PDF en base
            List<Administrateur> admins = adminRepository.findAll();
	        String subject = "[Nouvelle Demande] Attestation de travail";
	        String text = "Bonjour,\n\n" +
	                      "Une nouvelle demande d’attestation de travail a été soumise par " +employer.getNom()+" "+employer.getPrenom()+".\r\n"
	                      + "\r\n"
	                      + "🔹 CIN : "+employer.getCin()+"\r\n"
	                      + "🔹 Position : "+employer.getPosition()+"\r\n"	                      
	                      +"Veuillez traiter cette demande dans les plus brefs délais.\n" +
	                      "Merci.\n\n" +
	                      "Cordialement,\nL'équipe de support\r\n"
	                      + "ISIMM WorkFlow\r\n";

	        for (Administrateur admin : admins) {
	            sendEmail(admin.getEmail(), subject, text);
	        }
            return demandeattestationRepo.save(demande);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }
    }
	
	public DemandeAttestationTravail creerDemandeAttestationPourEnseignant(Enseignant enseignant) {
		 Optional<Administrateur> OPSG= adminRepository.getSG();
		 Administrateur SG=OPSG.get();
		 LocalDate dateActuelle = LocalDate.now();
		 DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		 String contenu = "Attestation de Travail\n\n" +
			        "Je soussigné(e), " + SG.getNom() + " " + SG.getPrenom() + 
			        ", agissant en qualité de secretaire generale " +
			        " de " + enseignant.getCentreTravaille() + 
			        ", atteste par la présente que " + enseignant.getNom() + " " + enseignant.getPrenom() + 
			        ", titulaire de la carte d’identité nationale numéro " + enseignant.getCin() + 
			        ", est employé(e) au sein de notre entreprise en tant que " + enseignant.getPosition() + 
			        " depuis le " + enseignant.getDateEntreAdministrative() + ".\n\n" +
			        "Durant son activité au sein de notre société, " + enseignant.getNom() + 
			        " a accompli ses missions avec sérieux et professionnalisme. " + 
			        "La présente attestation est délivrée à la demande de l’intéressé(e) pour servir et valoir ce que de droit.\n\n" +
			        "Fait à " + enseignant.getCentreTravaille() + ", le " + dateActuelle.format(formatter) + ".\n\n";
		try {
            // Génération du PDF
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter writer = PdfWriter.getInstance(document, baos);
            document.open();
            document.add(new Paragraph(contenu));
            document.close();

            // Création de la demande d'attestation
            DemandeAttestationTravail demande = new DemandeAttestationTravail(enseignant.getCin());
            demande.setPdfFile(baos.toByteArray()); // Stockage du PDF en base
            List<Administrateur> admins = adminRepository.findAll();
	        String subject = "[Nouvelle Demande] Attestation de travail";
	        String text = "Bonjour,\n\n" +
	                      "Une nouvelle demande d’attestation de travail a été soumise par " +enseignant.getNom()+" "+enseignant.getPrenom()+".\r\n"
	                      + "\r\n"
	                      + "🔹 CIN : "+enseignant.getCin()+"\r\n"
	                      + "🔹 Position : "+enseignant.getPosition()+"\r\n"	                      
	                      +"Veuillez traiter cette demande dans les plus brefs délais.\n" +
	                      "Merci.\n\n" +
	                      "Cordialement,\nL'équipe de support\r\n"
	                      + "ISIMM WorkFlow\r\n";

	        for (Administrateur admin : admins) {
	            sendEmail(admin.getEmail(), subject, text);
	        }
            return demandeattestationRepo.save(demande);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }
    }
	
	public DemandeAttestationTravail getAttestation(Long id) {
        DemandeAttestationTravail demande = demandeattestationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));
        return demande;
    }
	
	public List<DemandeAttestationTravail> getAttestations() {
		List<DemandeAttestationTravail> demande = demandeattestationRepo.findAll();
        return demande;
    }
	
	public Personne ownerAttes(String cin) {
    	Optional<Enseignant> enseignantOptional = enseignantRepository.findById(cin);
    	Optional<Employer> employerOptional = employeRepository.findById(cin);
    	if (employerOptional.isPresent()) {
	    	return employerOptional.get();
    	}
    	if (enseignantOptional.isPresent()) {
    		return enseignantOptional.get();
    	}
    	return null;
    }
	public List<DemandeAttestationTravail> getAttestationAttente() {
		List<DemandeAttestationTravail> demande = demandeattestationRepo.rechercherDeamndeAttesAttente();
        return demande;
    }
	
	public DemandeAttestationTravail accepterDemandeAttes(Long id) {
    	Optional<DemandeAttestationTravail> DemandeAttesOptional = demandeattestationRepo.findById(id);
    	if(DemandeAttesOptional.isPresent()) {
    		DemandeAttestationTravail att=DemandeAttesOptional.get();
    		Optional<Enseignant> ens=enseignantRepository.findById(att.getCinpersonne());
    		Optional<Employer> emp=employeRepository.findById(att.getCinpersonne());
    		att.setEtatdAttestationTravail(DemandeAttestationTravail.Etat.Accepter);
    		String subject = "[Mise à jour] Statut de votre demande d’attestation de travail";
    		if(ens.isPresent()) {
    			Enseignant e=ens.get();
    			String text = "Bonjour "+ e.getNom() +" "+e.getPrenom() +",\r\n"
    	        		+ "\r\n"
    	        		+ "Nous vous informons que votre demande d’attestation de travail a été ACCEPTÉE.\r\n"
    	        		+ "\r\n"
    	        		+ "📌 Votre attestation est désormais disponible. Vous pouvez la télécharger en vous connectant à votre espace personnel sur notre site web ISIMM WorkFlow :\r\n"
    	        		+ "\r\n"
    	        		+ "N’hésitez pas à nous contacter en cas de besoin." 
    	        		+"Merci.\n\n" + "Cordialement,\nL'équipe de support\r\n"
	                      + "ISIMM WorkFlow\r\n";
	                      sendEmail(e.getEmail(), subject, text);
	    		}else if(emp.isPresent()) {
	    			Employer e=emp.get();
	    			String text = "Bonjour "+ e.getNom() +" "+e.getPrenom() +",\r\n"
	    	        		+ "\r\n"
	    	        		+ "Nous vous informons que votre demande d’attestation de travail a été ACCEPTÉE.\r\n"
	    	        		+ "\r\n"
	    	        		+ "📌 Votre attestation est désormais disponible. Vous pouvez la télécharger en vous connectant à votre espace personnel sur notre site web ISIMM WorkFlow :\r\n"
	    	        		+ "\r\n"
	    	        		+ "N’hésitez pas à nous contacter en cas de besoin." 
	    	        		+"Merci.\n\n" + "Cordialement,\nL'équipe de support\r\n"
		                      + "ISIMM WorkFlow\r\n";
		                      sendEmail(e.getEmail(), subject, text);
    		}
    		return demandeattestationRepo.save(att);
    	}
    	return null;
    }
	
	public DemandeAttestationTravail rejeterDemandeAttes(Long id) {
    	Optional<DemandeAttestationTravail> DemandeAttesOptional = demandeattestationRepo.findById(id);
    	if(DemandeAttesOptional.isPresent()) {
    		DemandeAttestationTravail att=DemandeAttesOptional.get();
    		Optional<Enseignant> ens=enseignantRepository.findById(att.getCinpersonne());
    		Optional<Employer> emp=employeRepository.findById(att.getCinpersonne());
    		att.setEtatdAttestationTravail(DemandeAttestationTravail.Etat.Rejeter);
    		String subject = "[Mise à jour] Statut de votre demande d’attestation de travail";
    		if(ens.isPresent()) {
    			Enseignant e=ens.get();
    			String text = "Bonjour "+ e.getNom() +" "+e.getPrenom() +",\r\n"
    	        		+ "\r\n"
    	        		+ "Nous vous informons que votre demande d’attestation de travail a été REFUSÉE .\r\n"
    	        		+ "\r\n"
    	        		+ "N’hésitez pas à nous contacter en cas de besoin." 
    	        		+"Merci.\n\n" + "Cordialement,\nL'équipe de support\r\n"
	                      + "ISIMM WorkFlow\r\n";
	                      sendEmail(e.getEmail(), subject, text);
	    		}else if(emp.isPresent()) {
	    			Employer e=emp.get();
	    			String text = "Bonjour "+ e.getNom() +" "+e.getPrenom() +",\r\n"
	    	        		+ "\r\n"
	    	        		+ "Nous vous informons que votre demande d’attestation de travail a été ACCEPTÉE.\r\n"
	    	        		+ "\r\n"
	    	        		+ "N’hésitez pas à nous contacter en cas de besoin." 
	    	        		+"Merci.\n\n" + "Cordialement,\nL'équipe de support\r\n"
		                      + "ISIMM WorkFlow\r\n";
		                      sendEmail(e.getEmail(), subject, text);
    		}
    		return demandeattestationRepo.save(att);
    	}
    	return null;
    }
	
	public List<DemandeAttestationTravail> demandesRejeterAttente(String cin){
    	return demandeattestationRepo.rechercherAttAttenteRejeterParCin(cin);
    }
    
    public void SupprimerDemande(long id) {
    	demandeattestationRepo.deleteById(id);
    }
    
    public DemandeAttestationTravail chercheById(long id) {
    	Optional<DemandeAttestationTravail> demande = demandeattestationRepo.findById(id);
    	if(demande.isPresent())
    		return demande.get();
    	return null;
    }
    
    public List<DemandeAttestationTravail> getAttesAccepter(String cin){
    	return demandeattestationRepo.rechercherAttesAccepter(cin);
    }
    
    public long nbtotaleDemande() {
    	return demandeattestationRepo.count();
    }
    public long nbAcceptDemande() {
    	return demandeattestationRepo.countAccepte();
    }
    public long nbAttenteDemande() {
    	return demandeattestationRepo.countAttente();
    }
    public long nbRejeteDemande() {
    	return demandeattestationRepo.countRejeter();
    }
    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
