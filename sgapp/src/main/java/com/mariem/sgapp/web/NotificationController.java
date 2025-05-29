package com.mariem.sgapp.web;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mariem.sgapp.entities.Notification;
import com.mariem.sgapp.entities.Tache;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
	@Autowired
    private NotificationService notificationService;
	
	@PostMapping("/creer/{cin}")
    public ResponseEntity<String> creerDemandeEmployer(@PathVariable String cin,@RequestParam String description, @RequestParam LocalDate dateDepose ) {
		Notification Notifsaved= notificationService.creerNotification(dateDepose, description, cin);
		return ResponseEntity.ok("Notification creer");
    }
	
	@GetMapping("/{cin}")
    public List<Notification> rechercherNotifParCin(@PathVariable String cin ) {	
		return notificationService.rechercherNotifParCin(cin);
    }
	
	@PostMapping("/supprimerUne/{id}")
	public void supprimerNotifById(@PathVariable Long id) {
		notificationService.supprimerNotifById(id);
    }
	
	@DeleteMapping("/supprimerTout/{cin}")
	public void supprimerNotifById(@PathVariable String cin) {
		notificationService.supprimerToutNotifBycin(cin);
		//dans react await axios.delete(`http://localhost:8081/api/notifications/supprimerTout/${cin}`);
    }
	
	@PostMapping("/creerPourAdmins")
	public ResponseEntity<String> CreerNotificationPourToutAdmins(LocalDate dateDepose, String description){
		notificationService.CreerNotificationPourToutAdmins(dateDepose, description);
		return ResponseEntity.ok("Notification envoye pour tout les admins");
	}
}
