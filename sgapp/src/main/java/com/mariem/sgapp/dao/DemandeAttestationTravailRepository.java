package com.mariem.sgapp.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mariem.sgapp.entities.DemandeAttestationTravail;
import com.mariem.sgapp.entities.DemandeConge;

public interface DemandeAttestationTravailRepository extends JpaRepository <DemandeAttestationTravail, Long>{
	@Query("Select c from DemandeAttestationTravail c where c.etatdAttestationTravail='Attente'")
	public List<DemandeAttestationTravail> rechercherDeamndeAttesAttente();	
	
	@Query("Select c from DemandeAttestationTravail c where c.cinpersonne=:x and (c.etatdAttestationTravail='Attente' or c.etatdAttestationTravail='Rejeter')")
	public List<DemandeAttestationTravail> rechercherAttAttenteRejeterParCin(@Param("x") String cin);	
	
	@Query("Select c from DemandeAttestationTravail c where c.cinpersonne=:x AND c.etatdAttestationTravail='Accepter'")
	public List<DemandeAttestationTravail> rechercherAttesAccepter(@Param("x") String cin);	
	
	@Query("SELECT COUNT(*) FROM DemandeAttestationTravail c where c.etatdAttestationTravail='Attente' ")
	public Long countAttente();	
	@Query("SELECT COUNT(*) FROM DemandeAttestationTravail c where c.etatdAttestationTravail='Accepter' ")
	public Long countAccepte();	
	@Query("SELECT COUNT(*) FROM DemandeAttestationTravail c where c.etatdAttestationTravail='Rejeter' ")
	public Long countRejeter();	
	void deleteByCinpersonne(String cin);

		
}
