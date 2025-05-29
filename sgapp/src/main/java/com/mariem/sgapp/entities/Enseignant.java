package com.mariem.sgapp.entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.mariem.sgapp.entities.Personne.Sexe;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Enseignant extends Personne {
	public enum Departement {
        DepartementMathematique,
        DepartementInformatique,
        DepartementElectronique
    }
	@Id @Column(length=8)
    private String cin;
	@Enumerated(EnumType.STRING)
	private Departement departement;
	@Column(length=100)
	private String Position;
	@Column(length=100)
	private String etat;  //7ala
	@Column(length=100)
	private String filière; //silk
	@Column(length=100)
	private String specalite;   /////////////////////////////////////////
	private LocalDate dateInscriptionPosition;
	@Column(length=100)
	private String categorie;
	@Column(length=100)
	private String section;	
	private int nbCongeMax;
	/*
	@OneToMany(mappedBy="personneConge")
	private List<DemandeConge> demadesConges;*/
	/*@OneToMany(mappedBy="personneAttestationTravail")
	private List<DemandeAttestationTravail> demadesAttestationTravail ;*/
	/*@OneToMany(mappedBy="personneNotification")
	private List<Notification> mesNotification ;*/
	//
	public Enseignant() {
		
	}
	public Enseignant(String cin, String matricule, String nom, String prenom, String telephone, LocalDate dateNaissance,
			String lieuNaissance, Sexe sexe, String email, String codePostal, String niveauEtude, String diplome,
			String specialiteDipolme, String grade, LocalDate dateEntreAdministrative,
			LocalDate dateNommationGrade, LocalDate dateInscriptionGrade, String centreTravaille, String handicap,
			String etatFamiliale, int nbEnfant, String notes,Departement departement, String position, String etat, String filière, String specalite,
			LocalDate dateInscriptionPosition, String categorie, String section, int nbCongeMax,String password) {
		
		super(matricule,nom,prenom,telephone,dateNaissance,lieuNaissance,sexe,email,codePostal, niveauEtude,diplome,
				specialiteDipolme,grade,dateEntreAdministrative,dateNommationGrade, dateInscriptionGrade, 
				centreTravaille,handicap,etatFamiliale,nbEnfant,notes,password);
		this.cin=cin;
		this.departement = departement;
		Position = position;
		this.etat = etat;
		this.filière = filière;
		this.specalite = specalite;
		this.dateInscriptionPosition = dateInscriptionPosition;
		this.categorie = categorie;
		this.section = section;
		this.nbCongeMax = nbCongeMax;
	}
	//
	public Departement getDepartement() {
		return departement;
	}
	public void setDepartement(Departement departement) {
		this.departement = departement;
	}
	public String getPosition() {
		return Position;
	}
	public void setPosition(String position) {
		Position = position;
	}
	public String getEtat() {
		return etat;
	}
	public void setEtat(String etat) {
		this.etat = etat;
	}
	public String getFilière() {
		return filière;
	}
	public void setFilière(String filière) {
		this.filière = filière;
	}
	public String getSpecalite() {
		return specalite;
	}
	public void setSpecalite(String specalite) {
		this.specalite = specalite;
	}
	public LocalDate getDateInscriptionPosition() {
		return dateInscriptionPosition;
	}
	public void setDateInscriptionPosition(LocalDate dateInscriptionPosition) {
		this.dateInscriptionPosition = dateInscriptionPosition;
	}
	public String getCategorie() {
		return categorie;
	}
	public void setCategorie(String categorie) {
		this.categorie = categorie;
	}
	public String getSection() {
		return section;
	}
	public void setSection(String section) {
		this.section = section;
	}
	public int getNbCongeMax() {
		return nbCongeMax;
	}
	public void setNbCongeMax(int nbCongeMax) {
		this.nbCongeMax = nbCongeMax;
	}
	/*
	public List<DemandeConge> getDemadesConges() {
		return demadesConges;
	}
	public void setDemadesConges(List<DemandeConge> demadesConges) {
		this.demadesConges = demadesConges;
	}*/
	/*
	public List<DemandeAttestationTravail> getDemadesAttestationTravail() {
		return demadesAttestationTravail;
	}
	public void setDemadesAttestationTravail(List<DemandeAttestationTravail> demadesAttestationTravail) {
		this.demadesAttestationTravail = demadesAttestationTravail;
	}*/
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
	/*
	public List<DemandeConge> historiqueConge() {
	    List<DemandeConge> historique = new ArrayList<>(); 
	    for (DemandeConge d : demadesConges) {  
	        if (d.getEtatconge() == DemandeConge.Etat.Accepter) { 
	            historique.add(d); 
	        }
	    }
	    return historique; 
	}
	public int getNbJoursCongeRestant() {
		List<DemandeConge> historique =historiqueConge();
		return nbCongeMax-historique.size();
	}
	public List<DemandeConge> CongeAttente() {
	    List<DemandeConge> historique = new ArrayList<>(); 
	    for (DemandeConge d : demadesConges) {  
	        if (d.getEtatconge() == DemandeConge.Etat.Attente) { 
	            historique.add(d); 
	        }
	    }
	    return historique; 
	}
	public List<DemandeConge> CongeRejeter() {
	    List<DemandeConge> historique = new ArrayList<>(); 
	    for (DemandeConge d : demadesConges) {  
	        if (d.getEtatconge() == DemandeConge.Etat.Rejeter) { 
	            historique.add(d); 
	        }
	    }
	    return historique; 
	}
	public List<DemandeAttestationTravail> AttestationTravailRejeter() {
	    List<DemandeAttestationTravail> historique = new ArrayList<>(); 
	    for (DemandeAttestationTravail d : demadesAttestationTravail) {  
	        if (d.getEtatdAttestationTravail() == DemandeAttestationTravail.Etat.Rejeter) { 
	            historique.add(d); 
	        }
	    }
	    return historique; 
	}
	public List<DemandeAttestationTravail> AttestationTravailAccepter() {
	    List<DemandeAttestationTravail> historique = new ArrayList<>(); 
	    for (DemandeAttestationTravail d : demadesAttestationTravail) {  
	        if (d.getEtatdAttestationTravail() == DemandeAttestationTravail.Etat.Accepter) { 
	            historique.add(d); 
	        }
	    }
	    return historique; 
	}
	public List<DemandeAttestationTravail> AttestationTravailAttente() {
	    List<DemandeAttestationTravail> historique = new ArrayList<>(); 
	    for (DemandeAttestationTravail d : demadesAttestationTravail) {  
	        if (d.getEtatdAttestationTravail() == DemandeAttestationTravail.Etat.Attente) { 
	            historique.add(d); 
	        }
	    }
	    return historique; 
	}
	*/
}
