package com.mariem.sgapp.web;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.mariem.sgapp.dao.TacheRepository;
import com.mariem.sgapp.entities.Administrateur;
import com.mariem.sgapp.entities.Employer;
import com.mariem.sgapp.entities.Enseignant;
import com.mariem.sgapp.entities.Personne;
import com.mariem.sgapp.entities.Tache;
import com.mariem.sgapp.dao.AdministrateurRepository;
import com.mariem.sgapp.dao.EmployerRepository;

@Service
public class TacheService {
	@Autowired
    private TacheRepository tacheRepository;
    @Autowired
    private EmployerRepository employeRepository;
    @Autowired
    private AdministrateurRepository AdminRepository;
    @Autowired
    private JavaMailSender mailSender;
    
    public Tache creerTache(Tache t) {
    	Tache savedTache = tacheRepository.save(t);
		Optional<Employer> emp=employeRepository.findById(t.getEmployerCin());
		String subject = "[Nouvelle tâche] Une nouvelle mission vous a été attribuée\r\n";
		if(emp.isPresent()) {
			Employer e=emp.get();
			String text = "Bonjour "+ e.getNom() +" "+e.getPrenom() +",\r\n"
	        		+ "\r\n"
	        		+ "Une nouvelle tâche vous a été attribuée..\r\n"
	        		+ "\r\n"
	        		+ "🔹 Tâche :"+t.getDescription()+".\r\n"
	        		+ "🔹 Date limite: " +t.getDateLimite()+".\r\n"
	        		+"Merci.\n\n" + "Cordialement,\nL'équipe de support\r\n"
                      + "ISIMM WorkFlow\r\n";
                      sendEmail(e.getEmail(), subject, text);
		}

        return savedTache; 	
    }
    
    public List<Tache> chercherTachesEmployerfini(String cin) {
    	List<Administrateur> admins = AdminRepository.findAll();
    	Optional<Employer> emp=employeRepository.findById(cin);
    	if(emp.isPresent()) {
    		Employer e=emp.get();
    		String subject = "[Nouvelle Demande] Attestation de travail";
            String text = "Bonjour,\n\n" +
                          "Nous vous informons qu’une tâche a été terminée avec succès..\r\n"
                          + "\r\n"
                          + "🔹 Employé concerné : "+e.getNom()+" "+e.getPrenom()+"\r\n"
                          + "🔹 Cin : "+e.getCin()+"\r\n"	                      
                          +"Veuillez traiter cette demande dans les plus brefs délais.\n" +
                          "Merci.\n\n" +
                          "Cordialement,\nL'équipe de support\r\n"
                          + "ISIMM WorkFlow\r\n";

            for (Administrateur admin : admins) {
                sendEmail(admin.getEmail(), subject, text);
            }
    	}
        
    	return tacheRepository.rechercherTacheFiniParCin(cin);
    }
    
    public List<Tache> chercherTachesEmployerenCours(String cin) {
    	return tacheRepository.rechercherTacheEnCoursParCin(cin);
    }
    public List<Tache> chercherTaches(String cin) {
    	return tacheRepository.rechercherTacheParCin(cin);
    }
    
    public Tache modifierEtatFini(Long id) {
    	Optional<Tache> Otache = tacheRepository.findById(id);
    	Tache tache=Otache.get();
    	tache.setEtatTache(Tache.Etat.finie);
    	return tacheRepository.save(tache);
    }
    
    public Tache modifierEtatEnCours(Long id) {
    	Optional<Tache> Otache = tacheRepository.findById(id);
    	Tache tache=Otache.get();
    	tache.setEtatTache(Tache.Etat.enCours);
    	return tacheRepository.save(tache);
    }
    
    public List<Tache> chercherToutesTaches() {
    	return tacheRepository.findAll() ;
    }
    
    public void supprimerTache(Long id ) {
    	tacheRepository.deleteById(id);
    }
    
    public Employer ownerConge(String cin) {
    	Optional<Employer> employerOptional = employeRepository.findById(cin);
    	if (employerOptional.isPresent()) {
	    	return employerOptional.get();
    	}
    	return null;
    }
    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
