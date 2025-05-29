package com.mariem.sgapp.web;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mariem.sgapp.entities.Employer;
import com.mariem.sgapp.entities.Personne;
import com.mariem.sgapp.entities.Tache;

@RestController
@RequestMapping("/api/taches")
public class TacheController {
	@Autowired
    private TacheService tacheServiceService;
	@PostMapping("/creer/{cin}")
    public ResponseEntity<String> creerDemandeEmployer(@PathVariable String cin,@RequestParam String description, @RequestParam LocalDate dateLimite, @RequestParam LocalDate dateDepose ) {
		Tache t=new Tache(description,dateLimite,dateDepose,cin);
		Tache tachesaved= tacheServiceService.creerTache(t);
		return ResponseEntity.ok("Tache creer");
    }
	
	@GetMapping("/tachesFinis/{cin}")
    public List<Tache> chercherTachesEmployerfini(@PathVariable String cin ) {	
		return tacheServiceService.chercherTachesEmployerfini(cin);
    }
	
	@GetMapping("/tachesEnCours/{cin}")
    public List<Tache> chercherTachesEmployerenCours(@PathVariable String cin ) {	
		return tacheServiceService.chercherTachesEmployerenCours(cin);
    }
	@GetMapping("/taches/{cin}")
    public List<Tache> chercherTaches(@PathVariable String cin ) {	
		return tacheServiceService.chercherTaches(cin);
    }
	@PostMapping("/modifierEtatVersfinie/{id}")
    public ResponseEntity<String> modifierEtatFini(@PathVariable Long id) {
		Tache tachesaved= tacheServiceService.modifierEtatFini(id);
		return ResponseEntity.ok("Tache modifier vers etat finie");
    }
	@PostMapping("/modifierEtatVersEnCours/{id}")
    public ResponseEntity<String> modifierEtatEnCours(@PathVariable Long id) {
		Tache tachesaved= tacheServiceService.modifierEtatEnCours(id);
		return ResponseEntity.ok("Tache modifier vers etat finie");
    }
	@GetMapping("/toutes")
    public List<Tache> chercherToutesTaches() {	
		return tacheServiceService.chercherToutesTaches();
    }
	@PostMapping("/supprimer/{id}")
    public ResponseEntity<String> supprimerTache(@PathVariable Long id) {	
		tacheServiceService.supprimerTache(id);
		return ResponseEntity.ok("Tache supprimé");
    }
	
	@GetMapping("/ownerTache/{cin}")
	public ResponseEntity<Employer> ownerconge(@PathVariable String cin){
		Employer p=tacheServiceService.ownerConge(cin);
		if (p!=null) {
			return ResponseEntity.ok(p);
		}
		 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
	}
	
}
