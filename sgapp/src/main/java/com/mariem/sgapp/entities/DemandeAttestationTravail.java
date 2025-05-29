package com.mariem.sgapp.entities;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.Month;

import com.mariem.sgapp.entities.DemandeConge.Etat;
import com.mariem.sgapp.entities.DemandeConge.TypeConge;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;

@Entity
public class DemandeAttestationTravail implements Serializable {
	public enum Etat{
		Attente,Rejeter,Accepter
	}
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	@Enumerated(EnumType.STRING)
	private Etat etatdAttestationTravail;
	@Column(length=100)
	private String cinpersonne;
	@Lob
    @Column(columnDefinition = "LONGBLOB") 
    private byte[] pdfFile;
	
	public DemandeAttestationTravail() {
		etatdAttestationTravail=Etat.Attente;
	}
	//
	public DemandeAttestationTravail(String cinpersonne) {
		super();
		this.cinpersonne = cinpersonne;
		etatdAttestationTravail=Etat.Attente;
	}
	//
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Etat getEtatdAttestationTravail() {
		return etatdAttestationTravail;
	}
	public void setEtatdAttestationTravail(Etat etatdAttestationTravail) {
		this.etatdAttestationTravail = etatdAttestationTravail;
	}
	public String getCinpersonne() {
		return cinpersonne;
	}
	public void setLocale(String cinpersonne) {
		this.cinpersonne = cinpersonne;
	}
	public byte[] getPdfFile() {
		return pdfFile;
	}
	public void setPdfFile(byte[] pdfFile) {
		this.pdfFile = pdfFile;
	}
	
	
}
