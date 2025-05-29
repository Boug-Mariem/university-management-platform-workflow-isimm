package com.mariem.sgapp.entities;

import java.io.Serializable;
import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

@Entity
public class Tache implements Serializable {
	public enum Etat {
        finie,
        enCours
    }
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	@Column(length=100)
	private String description;
	private LocalDate dateLimite;
	private LocalDate dateDepose;
	/*@JoinColumn(name = "employer_id", nullable = false)
    private Employer employerTache;*/
	@Column(length = 8, nullable = false)  // Stocke CIN du demandeur
    private String employerCin;
	@Enumerated(EnumType.STRING)
	private Etat etatTache;
	
	//
	public Tache() {
		super();
	}
	//

	public Tache(String description, LocalDate dateLimite, LocalDate dateDepose, String employerCin) {
		super();
		this.description = description;
		this.dateLimite = dateLimite;
		this.dateDepose = dateDepose;
		this.employerCin = employerCin;
		this.etatTache = Etat.enCours;
	}
	//

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDate getDateLimite() {
		return dateLimite;
	}

	public void setDateLimite(LocalDate dateLimite) {
		this.dateLimite = dateLimite;
	}

	public LocalDate getDateDepose() {
		return dateDepose;
	}

	public void setDateDepose(LocalDate dateDepose) {
		this.dateDepose = dateDepose;
	}

	public String getEmployerCin() {
		return employerCin;
	}

	public void setEmployerTache(String employerCin) {
		this.employerCin = employerCin;
	}

	public Etat getEtatTache() {
		return etatTache;
	}

	public void setEtatTache(Etat etatTache) {
		this.etatTache = etatTache;
	}

	public Long getId() {
		return id;
	}

	public void setEmployerCin(String employerCin) {
		this.employerCin = employerCin;
	}
	
	
}
