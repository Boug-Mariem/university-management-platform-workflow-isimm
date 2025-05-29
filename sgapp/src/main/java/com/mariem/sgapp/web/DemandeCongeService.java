package com.mariem.sgapp.web;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.mariem.sgapp.dao.AdministrateurRepository;
import com.mariem.sgapp.dao.DemandeCongeRepository;
import com.mariem.sgapp.dao.EmployerRepository;
import com.mariem.sgapp.dao.EnseignantRepository;
import com.mariem.sgapp.entities.Administrateur;
import com.mariem.sgapp.entities.DemandeConge;
import com.mariem.sgapp.entities.DemandeConge.TypeConge;
import com.mariem.sgapp.entities.Employer;
import com.mariem.sgapp.entities.Enseignant;
import com.mariem.sgapp.entities.Personne;

@Service
public class DemandeCongeService {
	@Autowired
    private DemandeCongeRepository demandeCongeRepository;
    @Autowired
    private EmployerRepository employeRepository;
    @Autowired
    private EnseignantRepository enseignantRepository;
    @Autowired
    private AdministrateurRepository adminRepository;
    @Autowired
    private JavaMailSender mailSender;
    
    public DemandeConge creerDemandeCongeEmp(String cin, TypeConge typeConge,int nbJours, LocalDate dateDebut) {
    	Optional<Employer> optionalemployer = employeRepository.findById(cin);
		Employer employer = optionalemployer.get();
		Integer nbjoursutilise=demandeCongeRepository.nbreJoursUtilise(cin);
		if(nbjoursutilise==null) {
			nbjoursutilise=0;
		}
		if(employer.getNbCongeMax()-nbjoursutilise>=nbJours){
			DemandeConge demande = new DemandeConge(typeConge,nbJours, dateDebut,cin,"Employer");
			List<Administrateur> admins = adminRepository.findAll();
	        String subject = "[Demande de congé] Nouvelle demande soumise par un employé";
	        String text = "Bonjour,\n\n" +
	                      "Une nouvelle demande de congé a été soumise via le site web ISIMM WorkFlow :\n\n" +
	                      "🔹 Employé : " + employer.getNom() + " " + employer.getPrenom() + "\n" +
	                      "🔹 CIN : " + cin + "\n" +
	                      "🔹 Type de congé : " + typeConge + "\n" +
	                      "🔹 Durée : " + nbJours + " jours\n" +
	                      "🔹 Date de début : " + dateDebut + "\n\n" +
	                      "Veuillez traiter cette demande dans les plus brefs délais.\n" +
	                      "Merci.\n\n" +
	                      "Cordialement,\nL'équipe de support\r\n"
	                      + "ISIMM WorkFlow\r\n";

	        for (Administrateur admin : admins) {
	            sendEmail(admin.getEmail(), subject, text);
	        }
			return demandeCongeRepository.save(demande);
		}
		else {
			return null;
		}
    }
   
    public DemandeConge creerDemandeEnseignant(String cin, TypeConge typeConge,int nbJours, LocalDate dateDebut) {
		Optional<Enseignant> optionalenseignant = enseignantRepository.findById(cin);
		Enseignant enseignant = optionalenseignant.get();
		Integer nbjoursutilise=demandeCongeRepository.nbreJoursUtilise(cin);
		if(nbjoursutilise==null) {
			nbjoursutilise=0;
		}
		if(enseignant.getNbCongeMax()-nbjoursutilise>=nbJours){
			DemandeConge demande = new DemandeConge(typeConge,nbJours, dateDebut,cin,"Enseignant");
			List<Administrateur> admins = adminRepository.findAll();
	        String subject = "[Demande de congé] Nouvelle demande soumise par un enseignant";
	        String text = "Bonjour,\n\n" +
	                      "Une nouvelle demande de congé a été soumise via le site web ISIMM WorkFlow :\n\n" +
	                      "🔹 Enseignant : " + enseignant.getNom() + " " + enseignant.getPrenom() + "\n" +
	                      "🔹 CIN : " + cin + "\n" +
	                      "🔹 Type de congé : " + typeConge + "\n" +
	                      "🔹 Durée : " + nbJours + " jours\n" +
	                      "🔹 Date de début : " + dateDebut + "\n\n" +
	                      "Veuillez traiter cette demande dans les plus brefs délais.\n" +
	                      "Merci.\n\n" +
	                      "Cordialement,\nL'équipe de support\r\n"
	                      + "ISIMM WorkFlow\r\n";

	        for (Administrateur admin : admins) {
	            sendEmail(admin.getEmail(), subject, text);
	        }
			return demandeCongeRepository.save(demande);
		}
		else {
			return null;
		}
    }
    
    public List<DemandeConge> getHistoryEmployer(String cin) {
        try {
        	Optional<Employer> employerOptional = employeRepository.findById(cin);
    	    if (employerOptional.isPresent()) {
    	    	Employer employee=employerOptional.get();
	    	    List<DemandeConge> historiqueConge = demandeCongeRepository.rechercherCongeAccepterParCin(cin);
	    	    return historiqueConge;
    	    }else {
    	    	return null;
    	    }
    	    
        } catch (Exception e) {
            return null;
        }
	}
    
    public Integer getNbJoursRestantEmployer(String cin) {
        try {
        	Optional<Employer> employerOptional = employeRepository.findById(cin);
    	    if (employerOptional.isPresent()) {
    	    	Employer employee=employerOptional.get();
	    	    Integer nbjoursutilise=demandeCongeRepository.nbreJoursUtilise(cin);
	    	    if(nbjoursutilise==null)
	    	    	nbjoursutilise=0;
	    	    int joursRestants = employee.getNbCongeMax()-nbjoursutilise;
	    	    return joursRestants;
    	    }else {
    	    	return null;
    	    }
    	    
        } catch (Exception e) {
            return null;
        }
	}
    
    //
    public List<DemandeConge> getHistoryEnseignant(String cin) {
        try {
        	Optional<Enseignant> enseignantOptional = enseignantRepository.findById(cin);
    	    if (enseignantOptional.isPresent()) {
    	    	Enseignant enseignant=enseignantOptional.get();
	    	    List<DemandeConge> historiqueConge = demandeCongeRepository.rechercherCongeAccepterParCin(cin);
	    	    return historiqueConge;
    	    }else {
    	    	return null;
    	    }
    	    
        } catch (Exception e) {
            return null;
        }
	}
    
    public Integer getNbJoursRestantEnseignant(String cin) {
        try {
        	Optional<Enseignant> enseignantOptional = enseignantRepository.findById(cin);
    	    if (enseignantOptional.isPresent()) {
    	    	Enseignant enseignant=enseignantOptional.get();
	    	    Integer nbjoursutilise=demandeCongeRepository.nbreJoursUtilise(cin);
	    	    if(nbjoursutilise==null)
	    	    	nbjoursutilise=0;
	    	    int joursRestants = enseignant.getNbCongeMax()-nbjoursutilise;
	    	    return joursRestants;
    	    }else {
    	    	return null;
    	    }
    	    
        } catch (Exception e) {
            return null;
        }
	}
    
    public List<DemandeConge> gellAllAttente(){
		return demandeCongeRepository.rechercherCongeAttente();
	}
    
    public Personne ownerConge(String cin) {
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
    
    public DemandeConge getcongeById(Long id) {
    	Optional<DemandeConge> DemandeCongeOptional = demandeCongeRepository.findById(id);
    	if(DemandeCongeOptional.isPresent())
    		return DemandeCongeOptional.get();
    	return null;
    }
    
    public DemandeConge accepterConger(Long id) {
    	Optional<DemandeConge> DemandeCongeOptional = demandeCongeRepository.findById(id);
    	if(DemandeCongeOptional.isPresent()) {
    		DemandeConge conge=DemandeCongeOptional.get();
    		//
    		Optional<Enseignant> ens=enseignantRepository.findById(conge.getDemandeurCin());
    		Optional<Employer> emp=employeRepository.findById(conge.getDemandeurCin());
    		conge.setEtatconge(DemandeConge.Etat.Accepter);
    		String subject = "[Demande de congé] Mise à jour de votre demande";
    		if(ens.isPresent()) {
    			Enseignant e=ens.get();
    			String text = "Bonjour "+ e.getNom() +" "+e.getPrenom() +",\r\n"
    	        		+ "\r\n"
    	        		+ "Nous vous informons que votre demande de congé a été Acceptée.\r\n"
    	        		+ "\r\n"
    	        		+ "🔹 Type de congé : "+conge.getType()+"\r\n"
    	        		+ "🔹 Durée :  "+conge.getNbJours()+" jours\r\n"
    	        		+ "🔹 Date de début : "+conge.getDebutconge()+" \r\n"
    	        		+ "\r\n"
    	        		+ "\r\n"
    	        		+ "Si vous avez des questions, n’hésitez pas à nous contacter." 
    	        		+"Merci.\n\n" + "Cordialement,\nL'équipe de support\r\n"
	                      + "ISIMM WorkFlow\r\n";; 
    	          sendEmail(e.getEmail(), subject, text);
    		}else if(emp.isPresent()) {
    			Employer e=emp.get();
    			String text = "Bonjour "+ e.getNom() +" "+e.getPrenom() +",\r\n"
    	        		+ "\r\n"
    	        		+ "Nous vous informons que votre demande de congé a été Acceptée.\r\n"
    	        		+ "\r\n"
    	        		+ "🔹 Type de congé : "+conge.getType()+"\r\n"
    	        		+ "🔹 Durée :  "+conge.getNbJours()+" jours\r\n"
    	        		+ "🔹 Date de début : "+conge.getDebutconge()+" \r\n"
    	        		+ "\r\n"
    	        		+ "\r\n"
    	        		+ "Si vous avez des questions, n’hésitez pas à nous contacter." 
    	        		+"Merci.\n\n" + "Cordialement,\nL'équipe de support\r\n"
	                      + "ISIMM WorkFlow\r\n";; 
    	          sendEmail(e.getEmail(), subject, text);
    		}
    		return demandeCongeRepository.save(conge);
    	}
    	return null;
    }
    
    public DemandeConge refuserConger(Long id) {
    	Optional<DemandeConge> DemandeCongeOptional = demandeCongeRepository.findById(id);
    	if(DemandeCongeOptional.isPresent()) {
    		DemandeConge conge=DemandeCongeOptional.get();
    		//
    		Optional<Enseignant> ens=enseignantRepository.findById(conge.getDemandeurCin());
    		Optional<Employer> emp=employeRepository.findById(conge.getDemandeurCin());
    		conge.setEtatconge(DemandeConge.Etat.Rejeter);
    		String subject = "[Demande de congé] Mise à jour de votre demande";
    		if(ens.isPresent()) {
    			Enseignant e=ens.get();
    			String text = "Bonjour "+ e.getNom() +" "+e.getPrenom() +",\r\n"
    	        		+ "\r\n"
    	        		+ "Nous vous informons que votre demande de congé a été Refusée .\r\n"
    	        		+ "\r\n"
    	        		+ "🔹 Type de congé : "+conge.getType()+"\r\n"
    	        		+ "🔹 Durée :  "+conge.getNbJours()+" jours\r\n"
    	        		+ "🔹 Date de début : "+conge.getDebutconge()+" \r\n"
    	        		+ "\r\n"
    	        		+ "\r\n"
    	        		+ "Si vous avez des questions, n’hésitez pas à nous contacter." 
    	        		+"Merci.\n\n" + "Cordialement,\nL'équipe de support\r\n"
	                      + "ISIMM WorkFlow\r\n";; 
	                      sendEmail(e.getEmail(), subject, text);
	    		}else if(emp.isPresent()) {
	    			Employer e=emp.get();
	    			String text = "Bonjour "+ e.getNom() +" "+e.getPrenom() +",\r\n"
	    	        		+ "\r\n"
	    	        		+ "Nous vous informons que votre demande de congé a été Acceptée.\r\n"
	    	        		+ "\r\n"
	    	        		+ "🔹 Type de congé : "+conge.getType()+"\r\n"
	    	        		+ "🔹 Durée :  "+conge.getNbJours()+" jours\r\n"
	    	        		+ "🔹 Date de début : "+conge.getDebutconge()+" \r\n"
	    	        		+ "\r\n"
	    	        		+ "\r\n"
	    	        		+ "Si vous avez des questions, n’hésitez pas à nous contacter." 
	    	        		+"Merci.\n\n" + "Cordialement,\nL'équipe de support\r\n"
		                      + "ISIMM WorkFlow\r\n";; 
		                      sendEmail(e.getEmail(), subject, text);
    		}
    		return demandeCongeRepository.save(conge);
    	}
    	return null;
    }
    
    public List<DemandeConge> demandesRejeterAttente(String cin){
    	return demandeCongeRepository.rechercherCongeAttenteRejeterParCin(cin);
    }
    
    public void SupprimerDemande(long id) {
    	demandeCongeRepository.deleteById(id);
    }
    
    public long nbtotaleDemande() {
    	return demandeCongeRepository.count();
    }
    public long nbAcceptDemande() {
    	return demandeCongeRepository.countAccepte();
    }
    public long nbAttenteDemande() {
    	return demandeCongeRepository.countAttente();
    }
    public long nbRejeteDemande() {
    	return demandeCongeRepository.countRejeter();
    }
    
    public Map<String, Long> getDemandesParMois() {
        List<Object[]> result = demandeCongeRepository.countDemandesParMois();
        Map<String, Long> demandesParMois = new LinkedHashMap<>();
        String[] moisNoms = {
                "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
            };
            for (Object[] obj : result) {
                int annee = ((Number) obj[0]).intValue(); 
                int moisNumero = ((Number) obj[1]).intValue();  
                String mois = moisNoms[moisNumero - 1];  
                Long count = (Long) obj[2];  
                String moisAnnee = mois + " " + annee;  
                demandesParMois.put(moisAnnee, count);
            }
            return demandesParMois;
    }
    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
