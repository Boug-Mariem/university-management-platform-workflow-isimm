package com.mariem.sgapp.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mariem.sgapp.entities.Tache;

public interface TacheRepository extends JpaRepository <Tache, Long>{
	@Query("Select t from Tache t where t.employerCin=:x ")
	public List<Tache> rechercherTacheParCin(@Param("x") String cin);	
	@Query("Select t from Tache t where t.employerCin=:x and t.etatTache= 'finie' ")
	public List<Tache> rechercherTacheFiniParCin(@Param("x") String cin);
	@Query("Select t from Tache t where t.employerCin=:x and t.etatTache= 'enCours' ")
	public List<Tache> rechercherTacheEnCoursParCin(@Param("x") String cin);
	
	@Query("Select t from Tache t where  t.etatTache= 'finie' ")
	public List<Tache> rechercherTacheFini();
	@Query("Select t from Tache t where t.etatTache= 'enCours' ")
	public List<Tache> rechercherTacheEnCours();
	void deleteByEmployerCin(String cin);

	
}
