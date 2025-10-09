import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.string(), // In a real app, store hashed passwords!
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.optional(v.string()),
    promotion: v.optional(v.string()),
    specialite: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    isOnline: v.optional(v.boolean()),
    photoUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    country: v.optional(v.string()),
    ville: v.optional(v.string()),
    profileComplete: v.optional(v.boolean()),
    stats: v.optional(v.object({
      totalDocuments: v.number(),
      processedDocuments: v.number(),
      rejectedDocuments: v.number(),
      pendingDocuments: v.number(),
      totalRequests: v.number(),
      processedRequests: v.number(),
      pendingRequests: v.number(),
    })),
    firstLogin: v.optional(v.boolean()),
    termsAcceptedVersion: v.optional(v.string()),
  }),
  documents: defineTable({
    name: v.string(),
    storageId: v.id("_storage"), // Reference to Convex storage
    url: v.string(), // Public URL of the file
    date: v.string(), // e.g., "13/08/2025"
    student: v.string(),
    year: v.string(), // e.g., "2025-2026"
    status: v.string(), // e.g., "Validé", "En cours", "Rejeté"
    statusType: v.string(), // e.g., "success", "pending", "rejected"
    docType: v.string(), // e.g., "Certificat", "Bulletin"
    condition: v.string(), // e.g., "Traité", "En cours"
    extension: v.string(), // e.g., "PDF"
    // Optional: reason for rejection
    reason: v.optional(v.string()),
  }),
  conventions: defineTable({
    // État civil du candidat
    civiliteCandidat: v.string(),
    nomCandidat: v.string(),
    prenomCandidat: v.string(),
    dateNaissanceCandidat: v.string(),
    lieuNaissanceCandidat: v.string(),
    paysCandidat: v.string(),
    nationaliteCandidat: v.string(),
    adresseCandidat: v.string(),
    villeCandidat: v.string(),
    codePostalCandidat: v.string(),
    telephoneCandidat: v.string(),
    portableCandidat: v.optional(v.string()),
    emailCandidat: v.string(),
    idCandidat: v.string(),
    photoCandidatStorageId: v.optional(v.id("_storage")),

    // Responsables légal
    civiliteRespLegal: v.string(),
    qualiteRespLegal: v.string(),
    nomRespLegal: v.string(),
    prenomRespLegal: v.string(),
    dateNaissanceRespLegal: v.string(),
    lieuNaissanceRespLegal: v.string(),
    paysRespLegal: v.string(),
    nationaliteRespLegal: v.string(),
    adresseRespLegal: v.string(),
    villeRespLegal: v.string(),
    codePostalRespLegal: v.string(),
    telephoneRespLegal: v.string(),
    portableRespLegal: v.optional(v.string()),
    emailRespLegal: v.string(),
    idRespLegal: v.string(),

    // Responsables financier
    civiliteRespFin: v.string(),
    qualiteRespFin: v.string(),
    nomRespFin: v.string(),
    prenomRespFin: v.string(),
    dateNaissanceRespFin: v.string(),
    lieuNaissanceRespFin: v.string(),
    paysRespFin: v.string(),
    nationaliteRespFin: v.string(),
    adresseRespFin: v.string(),
    villeRespFin: v.string(),
    codePostalRespFin: v.string(),
    telephoneRespFin: v.string(),
    emailRespFin: v.string(),
    idRespFin: v.string(),

    // Études antérieures
    etudes: v.array(v.object({
      annee: v.string(),
      etudeSuivie: v.string(),
      etablissement: v.string(),
      diplome: v.string(),
      dateObtention: v.string(),
    })),
    commentaire: v.optional(v.string()),
    createdAt: v.number(), // Add createdAt timestamp
  }),
  attestations: defineTable({
    nom: v.string(),
    prenom: v.string(),
    dateNaissance: v.string(),
    promotion: v.string(),
    specialite: v.string(),
    anneeScolaire: v.string(),
    modalitePaiement: v.string(),
    fraisPreinscription: v.number(),
    fraisScolarite: v.number(),
    totalPaye: v.number(),
    modePaiement: v.string(),
    date: v.string(),
    userId: v.optional(v.string()),
    createdAt: v.number(),
  }),
  internshipConventions: defineTable({
    // Période
    dateDebut: v.string(),
    dateFin: v.string(),
    // Stagiaire
    stagiaireNom: v.string(),
    stagiairePrenom: v.string(),
    stagiaireCivilite: v.string(),
    stagiaireAdresse: v.string(),
    stagiaireCodePostal: v.string(),
    stagiaireVille: v.string(),
    stagiaireTelephone: v.string(),
    stagiaireEmail: v.string(),
    // Entreprise
    entrepriseType: v.optional(v.string()),
    entrepriseNom: v.string(),
    entrepriseAdresse: v.string(),
    entrepriseCodePostal: v.string(),
    entrepriseVille: v.string(),
    entreprisePays: v.optional(v.string()),
    entrepriseTelephone: v.optional(v.string()),
    entrepriseFax: v.optional(v.string()),
    entrepriseSiteWeb: v.optional(v.string()),
    entrepriseNbEmployes: v.optional(v.string()),
    // Représentant
    representantNom: v.string(),
    representantPrenom: v.string(),
    representantCivilite: v.string(),
    representantFonction: v.optional(v.string()),
    representantTelephone: v.optional(v.string()),
    representantEmail: v.optional(v.string()),
    // Descriptif
    taches: v.optional(v.string()),
    environnementTechno: v.optional(v.string()),
    formations: v.optional(v.string()),
    objectifs: v.optional(v.string()),
    nbCollaborateurs: v.optional(v.string()),
    commentaires: v.optional(v.string()),
    // Indemnité
    indemniteMontant: v.optional(v.string()),
    indemniteMonnaie: v.optional(v.string()),
    indemniteCommentaire: v.optional(v.string()),
    // Meta
    createdAt: v.number(),
  }),
  user_actions: defineTable({
    userId: v.id("users"),
    action: v.string(),
    timestamp: v.number(),
  }),
});