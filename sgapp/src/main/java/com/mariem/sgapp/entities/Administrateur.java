package com.mariem.sgapp.entities;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Administrateur extends Personne {
	@Id @Column(length=8)
    private String cin;
	private int sg=0;
	/*@OneToMany(mappedBy="personneNotification")
	private List<Notification> mesNotification ;*/
	//
	public Administrateur() {
		super();
	}
	public Administrateur(String cin, String matricule, String nom, String prenom, String telephone, LocalDate dateNaissance,
			String lieuNaissance, Sexe sexe, String email, String codePostal, String niveauEtude, String diplome,
			String specialiteDipolme, String grade, LocalDate dateEntreAdministrative,
			LocalDate dateNommationGrade, LocalDate dateInscriptionGrade, String centreTravaille, String handicap,
			String etatFamiliale, int nbEnfant, String notes,String password) {
		
		super(matricule,nom,prenom,telephone,dateNaissance,lieuNaissance,sexe,email,codePostal, niveauEtude,diplome,
				specialiteDipolme,grade,dateEntreAdministrative,dateNommationGrade, dateInscriptionGrade, 
				centreTravaille,handicap,etatFamiliale,nbEnfant,notes,password);
		this.cin=cin;
		
	}
	//
	public int isSg() {
		return sg;
	}
	public void setSg(int i) {
		this.sg = i;
	}
	/*
	public List<Notification> getMesNotification() {
		return mesNotification;
	}
	public void setMesNotification(List<Notification> mesNotification) {
		this.mesNotification = mesNotification;
	}*/
	public String getCin() {
		return cin;
	}
	public void setCin(String cin) {
		this.cin = cin;
	}
	
	
}
