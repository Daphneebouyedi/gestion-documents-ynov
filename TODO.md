# TODO: Add Demandes Section with Mobile Submissions

## Completed Tasks
- [x] Update schema.ts to add demandes table
- [x] Create WEB/src/convex/demandes.ts with queries and mutations
- [x] Update Demandes.jsx to include mobile demandes in the list
- [x] Create Details_demandes.jsx for details page
- [x] Add route for /details-demandes/:id in App.js
- [x] Update navigation in Demandes.jsx for mobile demandes
- [x] Make attachmentId optional in schema
- [x] Update queries to handle optional attachmentId
- [x] Populate mock data with populateMockDemandes mutation

## Remaining Tasks
- [ ] Test the integration: Navigate to /demandes, see new entries, click details for mobile ones
- [ ] Handle status updates for mobile demandes (update mutation needed)
- [ ] Add user info to Details_demandes.jsx (fetch user details)
- [ ] Generate real PDF attachments: Create client-side functions to generate PDFs using the forms' generatePdf logic, populate with user data, upload to Convex, update demandes with attachmentId

## Notes
- Mock data requires uploading files first, as attachmentId is required.
- For dummy PDFs, create simple PDF files or use placeholders.
- Ensure types are "attestation", "convention_stage", "convention_etude"
- Timestamps from Monday to today.
