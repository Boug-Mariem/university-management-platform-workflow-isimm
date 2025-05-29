package com.mariem.sgapp.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mariem.sgapp.entities.DemandeConge;

public interface DemandeCongeRepository extends JpaRepository <DemandeConge, Long>{
	@Query("Select c from DemandeConge c where c.demandeurCin=:x and c.etatconge= 'Accepter' ")
	public List<DemandeConge> rechercherCongeAccepterParCin(@Param("x") String cin);	
	@Query("Select c from DemandeConge c where c.demandeurCin=:x and c.etatconge='Attente'")
	public List<DemandeConge> rechercherCongeAttenteParCin(@Param("x") String cin);	
	@Query("Select c from DemandeConge c where c.demandeurCin=:x and c.etatconge='Rejeter'")
	public List<DemandeConge> rechercherCongeRejeterParCin(@Param("x") String cin);	
	@Query("SELECT SUM(c.nbJours) from DemandeConge c where c.demandeurCin=:x and (c.etatconge= 'Accepter' or c.etatconge= 'Attente' )")
	public Integer nbreJoursUtilise(@Param("x") String cin);	
	@Query("SELECT SUM(c.nbJours) from DemandeConge c where c.demandeurCin=:x and c.etatconge= 'Accepter' ")
	public Integer nbreJoursAccepter(@Param("x") String cin);	
	@Query("Select c from DemandeConge c where c.etatconge='Attente'")
	public List<DemandeConge> rechercherCongeAttente();	
	@Query("Select c from DemandeConge c where c.demandeurCin=:x and (c.etatconge='Attente' or c.etatconge='Rejeter')")
	public List<DemandeConge> rechercherCongeAttenteRejeterParCin(@Param("x") String cin);	
	
	@Query("SELECT COUNT(*) FROM DemandeConge c where c.etatconge='Attente' ")
	public Long countAttente();	
	@Query("SELECT COUNT(*) FROM DemandeConge c where c.etatconge='Accepter' ")
	public Long countAccepte();	
	@Query("SELECT COUNT(*) FROM DemandeConge c where c.etatconge='Rejeter' ")
	public Long countRejeter();	
	
	@Query("SELECT EXTRACT(YEAR FROM d.debutconge) AS annee, EXTRACT(MONTH FROM d.debutconge) AS mois, COUNT(d) " +
		       "FROM DemandeConge d GROUP BY EXTRACT(YEAR FROM d.debutconge), EXTRACT(MONTH FROM d.debutconge) ORDER BY annee, mois")
	List<Object[]> countDemandesParMois();
	void deleteByDemandeurCin(String cin);

}
