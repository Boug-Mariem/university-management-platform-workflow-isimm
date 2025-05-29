package com.mariem.sgapp;

import java.time.LocalDate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

import com.mariem.sgapp.dao.AdministrateurRepository;
import com.mariem.sgapp.dao.DemandeAttestationTravailRepository;
import com.mariem.sgapp.dao.DemandeCongeRepository;
import com.mariem.sgapp.dao.EmployerRepository;
import com.mariem.sgapp.dao.EnseignantRepository;
import com.mariem.sgapp.dao.NotificationRepository;
import com.mariem.sgapp.dao.TacheRepository;
import com.mariem.sgapp.entities.Administrateur;
import com.mariem.sgapp.entities.Personne;
import com.mariem.sgapp.entities.Personne.Sexe;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
@SpringBootApplication
public class SgappApplication {

	public static void main(String[] args) {
		ApplicationContext ctx = SpringApplication.run(SgappApplication.class, args);
		AdministrateurRepository AdministrateurDao = ctx.getBean(AdministrateurRepository.class);
		DemandeAttestationTravailRepository DemandeAttestationTravailDao = ctx.getBean(DemandeAttestationTravailRepository.class);
		DemandeCongeRepository DemandeCongeDao = ctx.getBean(DemandeCongeRepository.class);
		EmployerRepository EmployerDao = ctx.getBean(EmployerRepository.class);
		EnseignantRepository EnseignantDao = ctx.getBean(EnseignantRepository.class);	
		TacheRepository TacheDao = ctx.getBean(TacheRepository.class);	
		NotificationRepository NotificationDao = ctx.getBean(NotificationRepository.class);	
		
		
	}
}
