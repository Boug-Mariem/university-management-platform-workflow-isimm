package com.mariem.sgapp.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Date;

public class JwtUtil {
    private static final String SECRET = "monsecretultralongpourjwtquifaitplusde32caracteresetestsuffisant"; // Une clé simple pour signer le token
    private static final long EXPIRATION = 1000 * 60 * 60; // 1 heure

    // Générer un token avec le nom d'utilisateur
    public static String generateToken(String username,String cin,String role,String email) {
        return Jwts.builder()
                .subject(username) // On met le nom d'utilisateur dans le token
                .claim("cin", cin)
                .claim("role", role)
                .claim("email", email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes()), Jwts.SIG.HS512) // Nouvelle syntaxe pour la signature
                .compact();
    }

    // Vérifier et récupérer le nom d'utilisateur depuis le token
    public static String getUsernameFromToken(String token) {
        try {
        	return Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(SECRET.getBytes())) // Nouvelle syntaxe pour la vérification
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();        
        } catch (Exception e) {
            return null; // Token invalide
        }
    }
    
 // Récupérer le CIN depuis le token
    public static String getCinFromToken(String token) {
        try {
        	return Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .get("cin", String.class);
        } catch (Exception e) {
            return null; // Token invalide
        }
    }

    // Récupérer le rôle depuis le token
    public static String getRoleFromToken(String token) {
        try {
        	return Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .get("role", String.class);
        } catch (Exception e) {
            return null; // Token invalide
        }
    }

    // Récupérer l'email depuis le token
    public static String getEmailFromToken(String token) {
        try {
        	return Jwts.parser()
                    .verifyWith(Keys.hmacShaKeyFor(SECRET.getBytes()))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .get("email", String.class);
        } catch (Exception e) {
            return null; // Token invalide
        }
    }
}