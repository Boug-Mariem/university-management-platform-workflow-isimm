package com.mariem.sgapp.web;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mariem.sgapp.entities.DemandeConge;
import com.mariem.sgapp.entities.DemandeConge.TypeConge;
import com.mariem.sgapp.entities.Employer;
import com.mariem.sgapp.entities.Personne;

@RestController
@RequestMapping("/api/demandeConge")
public class DemandeCongeController {
	@Autowired
    private DemandeCongeService demandeCongeService;
	
	
	@PostMapping("/creer/employer/{cin}")
    public ResponseEntity<String> creerDemandeEmployer(@PathVariable String cin,@RequestParam  TypeConge type,@RequestParam int nbJours,@RequestParam LocalDate debutconge) {
		DemandeConge d= demandeCongeService.creerDemandeCongeEmp(cin,type,nbJours,debutconge);
		if(d!=null)
			return ResponseEntity.ok("demande accepeter");
		else
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("demande refuser");
    }
	
	@PostMapping("/creer/enseignant/{cin}")
    public ResponseEntity<String> creerDemandeEnseignant(@PathVariable String cin,@RequestParam  TypeConge type,@RequestParam int nbJours,@RequestParam LocalDate debutconge) {
		DemandeConge d= demandeCongeService.creerDemandeEnseignant(cin,type,nbJours,debutconge);
		if(d!=null)
			return ResponseEntity.ok("demande accepeter");
		else
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("demande refuser");
	}
    
	
	@GetMapping("/his/employer/{cin}")
    public ResponseEntity<Map<String, Object>> getLeaveHistoryEmployer(@PathVariable String cin) {
        try {
        	List<DemandeConge> historiqueConge=demandeCongeService.getHistoryEmployer(cin);
        	Integer joursRestants= demandeCongeService.getNbJoursRestantEmployer(cin);
        	Map<String, Object> response = new HashMap<>();
            response.put("historiqueConge", historiqueConge);
            response.put("joursRestants", joursRestants);
            return ResponseEntity.ok(response);  
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
	}
	
	@GetMapping("/his/enseignant/{cin}")
    public ResponseEntity<Map<String, Object>> getLeaveHistoryEnseignant(@PathVariable String cin) {
        try {
        	List<DemandeConge> historiqueConge=demandeCongeService.getHistoryEnseignant(cin);
        	Integer joursRestants= demandeCongeService.getNbJoursRestantEnseignant(cin);
        	Map<String, Object> response = new HashMap<>();
            response.put("historiqueConge", historiqueConge);
            response.put("joursRestants", joursRestants);
            return ResponseEntity.ok(response);  
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
	}
	
	@GetMapping("/ToutsdemandesAttente")
	public List<DemandeConge> gellAllAttente(){
		return demandeCongeService.gellAllAttente();
	}
	
	@GetMapping("/ownerConge/{cin}")
	public ResponseEntity<Map<String, Object>> ownerconge(@PathVariable String cin){
		Personne p=demandeCongeService.ownerConge(cin);
		if (p!=null) {
			Map<String, Object> response = new HashMap<>();
			response.put("personne", p);
			if( p instanceof Employer) {
	            response.put("role", "employer");
			}
			else {
	            response.put("role", "enseignant");
			}
			return ResponseEntity.ok(response);
		}
		 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
	}
	@GetMapping("/{id}")
	public ResponseEntity<DemandeConge> getcongeById(@PathVariable Long id){
		DemandeConge d=demandeCongeService.getcongeById(id);
		if (d!=null) {
			return ResponseEntity.ok(d);
		}
		 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
	}
	
	@PostMapping("/accepterDemande/{id}")
	public ResponseEntity<DemandeConge> accepterDemande(@PathVariable Long id){
		DemandeConge d=demandeCongeService.accepterConger(id);
		if (d!=null) {
			return ResponseEntity.ok(d);
		}
		 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
	}
	@PostMapping("/rejeterDemande/{id}")
	public ResponseEntity<DemandeConge> refuserDemande(@PathVariable Long id){
		DemandeConge d=demandeCongeService.refuserConger(id);
		if (d!=null) {
			return ResponseEntity.ok(d);
		}
		 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
	}
	
	@GetMapping("/demandesAttenteRejeter/{cin}")
	public List<DemandeConge>  demandesRejeterAttente(@PathVariable String cin){
		return demandeCongeService.demandesRejeterAttente(cin);
	}
	@PostMapping("/SupprimerDemande/{id}")
	public ResponseEntity<String> SupprimerDemande(@PathVariable Long id){
		demandeCongeService.SupprimerDemande(id);
		return ResponseEntity.ok("supprimer avec succes");
	}
	
	@GetMapping("/statistiques")
    public Map<String, Long> getStatistiquesDemandesConge() {
        Map<String, Long> statistiques = new HashMap<>();
        statistiques.put("total", demandeCongeService.nbtotaleDemande());
        statistiques.put("accepte", demandeCongeService.nbAcceptDemande());
        statistiques.put("attente", demandeCongeService.nbAttenteDemande());
        statistiques.put("rejete", demandeCongeService.nbRejeteDemande());
        return statistiques;
    }
	
	@GetMapping("/parMois")
    public Map<String, Long> getDemandesParMois() {
        return demandeCongeService.getDemandesParMois();
    }
	
	
}
