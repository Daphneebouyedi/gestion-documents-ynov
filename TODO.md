# TODO: Add "Date de Naissance" to Profile

## Database Changes
- [x] Add dateNaissance field to users table in STUDENT_PARENT_WEB/src/convex/schema.ts
- [x] Update getUserProfile to include dateNaissance in STUDENT_PARENT_WEB/convex/auth.ts
- [x] Add dateNaissance to updateUserProfile args in STUDENT_PARENT_WEB/src/convex/auth.ts
- [x] Add dateNaissance to updateUserProfile args in WEB/src/convex/auth.ts

## Frontend Changes
- [ ] Update Profil.jsx in STUDENT_PARENT_WEB: add state, input, save logic
- [ ] Update Details_utilisateurs.jsx in WEB: add display field

## Deployment and Testing
- [ ] Deploy Convex changes
- [ ] Test profile page in STUDENT_PARENT_WEB
- [ ] Test details page in WEB

# TODO: Add new attestation types

## Database Changes
- [x] Add type, moyenne, mention, semestre fields to attestations table in STUDENT_PARENT_WEB/src/convex/schema.ts
- [x] Update requestAttestation mutation to accept new fields in STUDENT_PARENT_WEB/src/convex/attestations.ts

## Frontend Changes
- [x] Add routes for new components in STUDENT_PARENT_WEB/src/App.js
- [x] Import new components in STUDENT_PARENT_WEB/src/App.js
- [x] Create Attestation_Inscription.jsx component
- [x] Create Attestation_Reussite.jsx component
- [x] Create Bulletin.jsx component
- [x] Update Attestation.jsx to pass type

## Deployment and Testing
- [ ] Deploy Convex changes
- [ ] Test new attestation forms
- [ ] Test PDF generation for new types

# TODO: Add notifications feature

## Database Changes
- [x] Add deleteAlert mutation in STUDENT_PARENT_WEB/src/convex/alerts.ts

## Frontend Changes
- [x] Add routes for /alerts and /alerts/:id in STUDENT_PARENT_WEB/src/App.js
- [x] Import Notifications and Details_Notifications components
- [x] Create Notifications.jsx component with table display
- [x] Create Details_Notifications.jsx component with modern layout

## Deployment and Testing
- [ ] Deploy Convex changes
- [ ] Test notifications list page
- [ ] Test details page with generated messages

# TODO: Modernize Documents disponibles page

## Frontend Changes
- [x] Update Documents_Dispo.jsx to use modern filter buttons above table
- [x] Add more columns: Nom du document, Date, Année, Statut, Type, Actions
- [x] Use consistent styling with other pages
- [x] Add authentication and Convex query integration

## Deployment and Testing
- [ ] Test modernized documents page with filters
