package com.mariem.sgapp.entities;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.Month;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class DemandeConge implements Serializable {
	public enum TypeConge {
		CongeAnnuel ,
		CongeMaladie,
		CongeMaternel,
		Autre
    }
	public enum Etat{
		Attente,Rejeter,Accepter
	}
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	@Enumerated(EnumType.STRING)
	private TypeConge type;
	private int nbJours;
	private LocalDate debutconge;
	private LocalDate finconge;
	@Enumerated(EnumType.STRING)
	private Etat etatconge;
	/*@ManyToOne
	@JoinColumn(name = "personne_id", nullable = false)
    private Personne personneConge;*/
	
	@Column(length = 8, nullable = false)  // Stocke CIN du demandeur
    private String demandeurCin;

    @Column(nullable = false)  // Indique si c'est un EMPLOYER ou un ENSEIGNANT
    private String demandeurType;
	
	
	//
	public DemandeConge() {
		etatconge=Etat.Attente;
	}
	//
	public DemandeConge(TypeConge type, int nbJours, LocalDate debutconge,String cin ,String demandeurtype) {
		super();
		this.type = type;
		this.nbJours = nbJours;
		this.debutconge = debutconge;
		this.finconge = debutconge.plusDays(nbJours-1);
		this.etatconge = Etat.Attente;
		this.demandeurCin = cin;
		this.demandeurType=demandeurtype;
	}
	//getters et setters
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public TypeConge getType() {
		return type;
	}
	public void setType(TypeConge type) {
		this.type = type;
	}
	public int getNbJours() {
		return nbJours;
	}
	public void setNbJours(int nbJours) {
		this.nbJours = nbJours;
	}
	public LocalDate getDebutconge() {
		return debutconge;
	}
	public void setDebutconge(LocalDate debutconge) {
		this.debutconge = debutconge;
	}
	public LocalDate getFinconge() {
		return finconge;
	}
	public void setFinconge(LocalDate finconge) {
		this.finconge = finconge;
	}
	public Etat getEtatconge() {
		return etatconge;
	}
	public void setEtatconge(Etat etatconge) {
		this.etatconge = etatconge;
	}
	public String getDemandeurCin() {
		return demandeurCin;
	}
	public void setDemandeurCin(String demandeurCin) {
		this.demandeurCin = demandeurCin;
	}
	public String getDemandeurType() {
		return demandeurType;
	}
	public void setDemandeurType(String demandeurType) {
		this.demandeurType = demandeurType;
	}
	
	
}
