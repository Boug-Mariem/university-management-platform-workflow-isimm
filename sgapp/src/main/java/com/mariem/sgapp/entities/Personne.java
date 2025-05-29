package com.mariem.sgapp.entities;

import java.io.Serializable;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public class Personne implements Serializable{
	public enum Sexe {
        MASCULIN,
        FEMININ
    }
	@Column(length=8)
	private String matricule;
	@Column(length=20)
	private String nom;
	@Column(length=20)
	private String prenom;
	@Column(length=8)
	private String telephone;
	private LocalDate dateNaissance;
	@Column(length=20)
	private String lieuNaissance;
	@Enumerated(EnumType.STRING)
	private Sexe sexe;
	@Column(length = 100)
	private String email;
	@Column(length = 100)
	private String adresse;
	@Column(length=100)
	private String niveauEtude;
	@Column(length=100)
	private String diplome;
	@Column(length=100)
	private String specialiteDipolme;
	@Column(length=100)
	private String grade;
	private LocalDate dateEntreAdministrative;
	private LocalDate dateNommationGrade;
	private LocalDate dateInscriptionGrade;
	@Column(length=100)
	private String centreTravaille;
	@Column(length=100)
	private String Handicap;
	@Column(length=100)
	private String etatFamiliale;
	private int nbEnfant;
	@Column(length=100)
	private String notes;	
	private String password; 
	//
	public Personne() {
		
	}
	//
	public Personne(String matricule, String nom, String prenom, String telephone, LocalDate dateNaissance,
			String lieuNaissance, Sexe sexe, String email, String adresse, String niveauEtude, String diplome,
			String specialiteDipolme, String grade, LocalDate dateEntreAdministrative,
			LocalDate dateNommationGrade, LocalDate dateInscriptionGrade, String centreTravaille, String handicap,
			String etatFamiliale, int nbEnfant, String notes,String password) {
		super();
		this.matricule = matricule;
		this.nom = nom;
		this.prenom = prenom;
		this.telephone = telephone;
		this.dateNaissance = dateNaissance;
		this.lieuNaissance = lieuNaissance;
		this.sexe = sexe;
		this.email = email;
		this.adresse = adresse;
		this.niveauEtude = niveauEtude;
		this.diplome = diplome;
		this.specialiteDipolme = specialiteDipolme;
		this.grade = grade;
		this.dateEntreAdministrative = dateEntreAdministrative;
		this.dateNommationGrade = dateNommationGrade;
		this.dateInscriptionGrade = dateInscriptionGrade;
		this.centreTravaille = centreTravaille;
		Handicap = handicap;
		this.etatFamiliale = etatFamiliale;
		this.nbEnfant = nbEnfant;
		this.notes = notes;
		this.password = password;
	}
	//
	public String getMatricule() {
		return matricule;
	}
	public void setMatricule(String matricule) {
		this.matricule = matricule;
	}
	public String getNom() {
		return nom;
	}
	public void setNom(String nom) {
		this.nom = nom;
	}
	public String getPrenom() {
		return prenom;
	}
	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	public LocalDate getDateNaissance() {
		return dateNaissance;
	}
	public void setDateNaissance(LocalDate dateNaissance) {
		this.dateNaissance = dateNaissance;
	}
	public String getLieuNaissance() {
		return lieuNaissance;
	}
	public void setLieuNaissance(String lieuNaissance) {
		this.lieuNaissance = lieuNaissance;
	}
	public Sexe getSexe() {
		return sexe;
	}
	public void setSexe(Sexe sexe) {
		this.sexe = sexe;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getAdresse() {
		return adresse;
	}
	public void setAdresse(String adresse) {
		this.adresse = adresse;
	}
	public String getNiveauEtude() {
		return niveauEtude;
	}
	public void setNiveauEtude(String niveauEtude) {
		this.niveauEtude = niveauEtude;
	}
	public String getDiplome() {
		return diplome;
	}
	public void setDiplome(String diplome) {
		this.diplome = diplome;
	}
	public String getSpecialiteDipolme() {
		return specialiteDipolme;
	}
	public void setSpecialiteDipolme(String specialiteDipolme) {
		this.specialiteDipolme = specialiteDipolme;
	}
	public String getGrade() {
		return grade;
	}
	public void setGrade(String grade) {
		this.grade = grade;
	}
	public LocalDate getDateEntreAdministrative() {
		return dateEntreAdministrative;
	}
	public void setDateEntreAdministrative(LocalDate dateEntreAdministrative) {
		this.dateEntreAdministrative = dateEntreAdministrative;
	}
	public LocalDate getDateNommationGrade() {
		return dateNommationGrade;
	}
	public void setDateNommationGrade(LocalDate dateNommationGrade) {
		this.dateNommationGrade = dateNommationGrade;
	}
	public LocalDate getDateInscriptionGrade() {
		return dateInscriptionGrade;
	}
	public void setDateInscriptionGrade(LocalDate dateInscriptionGrade) {
		this.dateInscriptionGrade = dateInscriptionGrade;
	}
	public String getCentreTravaille() {
		return centreTravaille;
	}
	public void setCentreTravaille(String centreTravaille) {
		this.centreTravaille = centreTravaille;
	}
	public String getHandicap() {
		return Handicap;
	}
	public void setHandicap(String handicap) {
		Handicap = handicap;
	}
	public String getEtatFamiliale() {
		return etatFamiliale;
	}
	public void setEtatFamiliale(String etatFamiliale) {
		this.etatFamiliale = etatFamiliale;
	}
	public int getNbEnfant() {
		return nbEnfant;
	}
	public void setNbEnfant(int nbEnfant) {
		this.nbEnfant = nbEnfant;
	}
	public String getNotes() {
		return notes;
	}
	public void setNotes(String notes) {
		this.notes = notes;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	

}
