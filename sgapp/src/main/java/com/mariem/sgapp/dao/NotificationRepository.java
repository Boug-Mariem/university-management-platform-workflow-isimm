package com.mariem.sgapp.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mariem.sgapp.entities.Notification;

import jakarta.transaction.Transactional;

public interface NotificationRepository extends JpaRepository <Notification, Long>{
	@Query("Select n from Notification n where n.perCin=:x ")
	public List<Notification> rechercherNotificationParCin(@Param("x") String cin);
	
	@Modifying
	@Transactional
	@Query("DELETE FROM Notification n WHERE n.perCin = :cin")
	void supprimerNotificationsParCin(@Param("cin") String cin);
	void deleteByPerCin(String cin);


}
