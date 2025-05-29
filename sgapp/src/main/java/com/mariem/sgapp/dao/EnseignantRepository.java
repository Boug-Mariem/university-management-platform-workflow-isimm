package com.mariem.sgapp.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mariem.sgapp.entities.Administrateur;
import com.mariem.sgapp.entities.Employer;
import com.mariem.sgapp.entities.Enseignant;
import com.mariem.sgapp.entities.Personne;

public interface EnseignantRepository extends JpaRepository <Enseignant, String>{
	 @Modifying
	 @Query("delete from Enseignant e where e.cin = :x")
	 public void deleteByCin(@Param("x") String cin);
	 
	 @Query("SELECT c FROM Enseignant c WHERE c.email = :x ")
	 public Optional<Enseignant> getAdminPourLogin(@Param("x") String email);
	 
	 
	 List<Enseignant> findBySexe(Personne.Sexe sexe);
	 List<Enseignant> findByGrade(String grade);
	 List<Enseignant> findByDepartement(Enseignant.Departement departement);
	 List<Enseignant> findBySexeAndGrade(Personne.Sexe sexe, String grade);
	 List<Enseignant> findBySexeAndDepartement(Personne.Sexe sexe, Enseignant.Departement departement);
	 List<Enseignant> findByGradeAndDepartement(String grade, Enseignant.Departement departement);
	 List<Enseignant> findBySexeAndGradeAndDepartement(Personne.Sexe sexe, String grade, Enseignant.Departement departement);
	 boolean existsByEmail(String email); 
	 Enseignant findByEmail(String email);
	 boolean existsByCin(String cin);

}
