package com.mariem.sgapp.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mariem.sgapp.entities.Administrateur;
import com.mariem.sgapp.entities.Enseignant;
import com.mariem.sgapp.entities.Personne;

public interface AdministrateurRepository extends JpaRepository <Administrateur, String> {
	 @Modifying
	 @Query("delete from Administrateur e where e.cin = :x")
	 public void deleteByCin(@Param("x") String cin);	
	 
	 @Query("SELECT c FROM Administrateur c WHERE c.email = :x ")
	 public Optional<Administrateur> getAdminPourLogin(@Param("x") String email);
	 
	 @Query("SELECT c FROM Administrateur c WHERE c.sg = 1")
	 Optional<Administrateur> getSG();
	 boolean existsByEmail(String email); 
	 Administrateur findByEmail(String email);
	 boolean existsByCin(String cin);


}
