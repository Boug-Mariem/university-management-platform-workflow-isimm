package com.mariem.sgapp.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mariem.sgapp.entities.Administrateur;
import com.mariem.sgapp.entities.Employer;
import com.mariem.sgapp.entities.Personne;

public interface EmployerRepository extends JpaRepository <Employer, String>{
	 @Modifying
	 @Query("delete from Employer e where e.cin = :x")
	 public void deleteByCin(@Param("x") String cin);	
	 
	 @Query("SELECT c FROM Employer c WHERE c.email = :x ")
	 public Optional<Employer> getAdminPourLogin(@Param("x") String email);

	 List<Employer> findBySexe(Personne.Sexe sexe);
	 List<Employer> findByCategorie(String categorie);
	 List<Employer> findBySpecalite(String specialite);
	 List<Employer> findBySexeAndCategorie(Personne.Sexe sexe, String categorie);
	 List<Employer> findBySexeAndSpecalite(Personne.Sexe sexe, String specialite);
	 List<Employer> findByCategorieAndSpecalite(String categorie, String specialite);
	 List<Employer> findBySexeAndCategorieAndSpecalite (Personne.Sexe sexe, String categorie, String specialite);
	 boolean existsByEmail(String email); 
	 Employer findByEmail(String email);
	 boolean existsByCin(String cin);
}
