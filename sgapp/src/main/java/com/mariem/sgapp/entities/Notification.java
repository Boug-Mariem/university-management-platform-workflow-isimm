package com.mariem.sgapp.entities;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;


@Entity
public class Notification implements Serializable {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	private LocalDate dateDepose;
	@Column(length=100)
	private String description;
	/*
	@JoinColumn(name = "personne_id", nullable = false)
    private Personne personneNotification;*/
	@Column(length = 8, nullable = false)  // Stocke CIN du demandeur
    private String perCin;
	//
	public Notification() {
		super();
	}
	public Notification(LocalDate dateDepose, String description, String perCin) {
		super();
		this.dateDepose = dateDepose;
		this.description = description;
		this.perCin = perCin;
	}
	
	public LocalDate getDateDepose() {
		return dateDepose;
	}
	public void setDateDepose(LocalDate dateDepose) {
		this.dateDepose = dateDepose;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	/*
	public Personne getPersonneNotification() {
		return personneNotification;
	}
	public void setPersonneNotification(Personne personneNotification) {
		this.personneNotification = personneNotification;
	}*/
	public Long getId() {
		return id;
	}
	public String getPerCin() {
		return perCin;
	}
	public void setPerCin(String perCin) {
		this.perCin = perCin;
	}
	
}
