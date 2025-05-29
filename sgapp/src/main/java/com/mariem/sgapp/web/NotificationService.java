package com.mariem.sgapp.web;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mariem.sgapp.dao.NotificationRepository;
import com.mariem.sgapp.entities.Administrateur;
import com.mariem.sgapp.entities.Notification;
import com.mariem.sgapp.dao.AdministrateurRepository;
import com.mariem.sgapp.dao.EmployerRepository;
import com.mariem.sgapp.dao.EnseignantRepository;

@Service
public class NotificationService {
	@Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private EmployerRepository employeRepository;
    @Autowired
    private EnseignantRepository enseignantRepository;
    @Autowired
    private AdministrateurRepository administrateurRepository;
    
    public List<Notification> rechercherNotifParCin(String cin){
    	return notificationRepository.rechercherNotificationParCin(cin);
    }
    
    public void supprimerNotifById(Long id) {
    	notificationRepository.deleteById(id);
    }
    
    public void supprimerToutNotifBycin(String cin) {
        notificationRepository.supprimerNotificationsParCin(cin);
    }
    
    public Notification creerNotification(LocalDate dateDepose, String description, String perCin) {
    	Notification notiv=new Notification(dateDepose,  description,  perCin);
    	return notificationRepository.save(notiv);
    }
    
    public void CreerNotificationPourToutAdmins(LocalDate dateDepose, String description) {
    	List<Administrateur> tousAdmin =administrateurRepository.findAll();
    	for(Administrateur admin:tousAdmin) {
    		notificationRepository.save(new Notification(dateDepose,description,admin.getCin()));
    	}   	
    }
}
