package com.mariem.sgapp.web;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mariem.sgapp.config.JwtUtil;
//import com.mariem.sgapp.config.JwtUtil;
import com.mariem.sgapp.dao.EnseignantRepository;
import com.mariem.sgapp.entities.Administrateur;
import com.mariem.sgapp.entities.Employer;
import com.mariem.sgapp.entities.Enseignant;
import com.mariem.sgapp.entities.Personne;

//import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/login")
public class LoginController {
	@Autowired
    private LoginService loginservice;
	

	
	@PostMapping("/authentifier")
	public ResponseEntity<Map<String, Object>> authenticate(@RequestParam String email,@RequestParam String password){
		Map<String, Object> response = new HashMap<>();
		Administrateur p1=loginservice.authenticateAdmin(email, password);
		if(p1!=null) {
			if(p1.isSg()==1) {
				String token = JwtUtil.generateToken(p1.getNom()+" "+p1.getPrenom(), p1.getCin(), "Superadmin", email);
				response.put("personne", p1);
		        response.put("role", "Superadmin");
		        response.put("token", token); // Ajouter le token dans la réponse
				return ResponseEntity.ok(response);
			}
			String token = JwtUtil.generateToken(p1.getNom()+" "+p1.getPrenom(), p1.getCin(), "admin", email);
			response.put("personne", p1);
	        response.put("role", "admin");
	        response.put("token", token); // Ajouter le token dans la réponse
			return ResponseEntity.ok(response);
			
		}
		Enseignant p2=loginservice.authenticateEnseignant(email, password);
		if(p2!=null) {
			String token = JwtUtil.generateToken(p2.getNom()+" "+p2.getPrenom(), p2.getCin(), "Enseignant", email);
			response.put("personne", p2);
	        response.put("role", "Enseignant");
	        response.put("token", token);
			return ResponseEntity.ok(response);
			
		}
		Employer p3=loginservice.authenticateEmployer(email, password);
		if(p3!=null) {
			String token = JwtUtil.generateToken(p3.getNom()+" "+p3.getPrenom(), p3.getCin(), "Employer", email);
			response.put("personne", p3);
	        response.put("role", "Employer");
	        response.put("token", token);
			return ResponseEntity.ok(response);
			
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	}
	////Mot de passe oublier :
	// Étape 1 : Demander un code de réinitialisation
    @PostMapping("/forgot")
    public String forgotPassword(@RequestParam String email) {
    	loginservice.sendResetPasswordCode(email);
        return "Un code de réinitialisation a été envoyé à votre email.";
    }

    // Étape 2 : Réinitialiser le mot de passe avec le code
    @PostMapping("/reset")
    public String resetPassword(@RequestParam String email, @RequestParam String code, @RequestParam String newPassword) {
    	loginservice.resetPassword(email, code, newPassword);
        return "Votre mot de passe a été modifié avec succès.";
    }
}
