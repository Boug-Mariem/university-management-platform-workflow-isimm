package com.mariem.sgapp.web;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;


import com.mariem.sgapp.entities.DemandeAttestationTravail;
import com.mariem.sgapp.entities.DemandeConge;
import com.mariem.sgapp.entities.DemandeConge.TypeConge;
import com.mariem.sgapp.entities.Employer;
import com.mariem.sgapp.entities.Enseignant;
import com.mariem.sgapp.entities.Personne;

@RestController
@RequestMapping("/api/attestation")
public class DemandeAttestationController {
	@Autowired
    private DemandeAttestationService demandeAttestationService;
	
	@PostMapping("/creer/employer")
    public ResponseEntity<String> creerDemandeEmployer(@RequestBody Employer emp) {
		DemandeAttestationTravail d= demandeAttestationService.creerDemandeAttestationPourEmployer(emp);
		if(d!=null)
			return ResponseEntity.ok("demande accepeter");
		else
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("demande refuser");
    }
	
	@PostMapping("/creer/enseignant")
    public ResponseEntity<String> creerDemandeEnseignant(@RequestBody Enseignant e) {
		DemandeAttestationTravail d= demandeAttestationService.creerDemandeAttestationPourEnseignant(e);
		if(d!=null)
			return ResponseEntity.ok("demande accepeter");
		else
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("demande refuser");
    }
	
	@GetMapping("/get/{id}")
    public ResponseEntity<ByteArrayResource> getAttestation(@PathVariable Long id) {
        DemandeAttestationTravail demande =demandeAttestationService.getAttestation(id);
        byte[] pdfData = demande.getPdfFile();
        // Créer une ressource ByteArrayResource à partir du tableau d'octets
        ByteArrayResource resource = new ByteArrayResource(pdfData);
        // Retourner le PDF en tant que fichier à télécharger
        /*return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=AttestationDeTravail"+demande.getCinpersonne()+".pdf")
                .contentLength(pdfData.length)
                .body(resource);*/
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=AttestationDeTravail" + demande.getCinpersonne() + ".pdf")
                .header("Access-Control-Expose-Headers", HttpHeaders.CONTENT_DISPOSITION)  // Ajout de cet en-tête pour exposer Content-Disposition
                .contentLength(pdfData.length)
                .body(resource);
    }
	@GetMapping("/getdemande/{id}")
	public DemandeAttestationTravail chercheById(@PathVariable Long id) {
		return demandeAttestationService.chercheById(id);
	}
	
	@GetMapping("/attestations")
    public List<DemandeAttestationTravail> getAttestation() {
        List<DemandeAttestationTravail> demande =demandeAttestationService.getAttestations();
        return demande;
    }
	@GetMapping("/attestationsAttente")
    public List<DemandeAttestationTravail> getAttestationAttente() {
        List<DemandeAttestationTravail> demande =demandeAttestationService.getAttestationAttente();
        return demande;
    }
	
	@GetMapping("/ownerAttes/{cin}")
	public ResponseEntity<Map<String, Object>> ownerAttes(@PathVariable String cin){
		Personne p=demandeAttestationService.ownerAttes(cin);
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
	
	@PostMapping("/accepterDemandeAttes/{id}")
	public ResponseEntity<DemandeAttestationTravail> accepterDemandeAttes(@PathVariable Long id){
		DemandeAttestationTravail d=demandeAttestationService.accepterDemandeAttes(id);
		if (d!=null) {
			return ResponseEntity.ok(d);
		}
		 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
	}
	
	@PostMapping("/rejeterDemandeAttes/{id}")
	public ResponseEntity<DemandeAttestationTravail> rejeterDemandeAttes(@PathVariable Long id){
		DemandeAttestationTravail d=demandeAttestationService.rejeterDemandeAttes(id);
		if (d!=null) {
			return ResponseEntity.ok(d);
		}
		 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
	}
	
	@GetMapping("/demandesAttenteRejeter/{cin}")
	public List<DemandeAttestationTravail>  demandesRejeterAttente(@PathVariable String cin){
		return demandeAttestationService.demandesRejeterAttente(cin);
	}
	@PostMapping("/SupprimerDemande/{id}")
	public ResponseEntity<String> SupprimerDemande(@PathVariable Long id){
		demandeAttestationService.SupprimerDemande(id);
		return ResponseEntity.ok("supprimer avec succes");
	}
	
	@GetMapping("/getattesaccepter/{cin}")
	public ResponseEntity<List<Map<String, String>>>  getAttesAccepter(@PathVariable String cin){
		List<DemandeAttestationTravail> attestations = demandeAttestationService.getAttesAccepter(cin);
		List<Map<String, String>> response = attestations.stream().map(attestation -> {
	        Map<String, String> attestationInfo = new HashMap<>();
	        attestationInfo.put("id", attestation.getId().toString());
	        attestationInfo.put("name", "AttestationDeTravail"+attestation.getId()+"_" + attestation.getCinpersonne() + ".pdf");
	        attestationInfo.put("link", "http://localhost:8081/api/attestation/get/" + attestation.getId());
	        return attestationInfo;
	    }).collect(Collectors.toList());

	    return ResponseEntity.ok(response);
	}
	
	@GetMapping("/statistiques")
    public Map<String, Long> getStatistiquesDemandesConge() {
        Map<String, Long> statistiques = new HashMap<>();
        statistiques.put("total", demandeAttestationService.nbtotaleDemande());
        statistiques.put("accepte", demandeAttestationService.nbAcceptDemande());
        statistiques.put("attente", demandeAttestationService.nbAttenteDemande());
        statistiques.put("rejete", demandeAttestationService.nbRejeteDemande());
        return statistiques;
    }
}
