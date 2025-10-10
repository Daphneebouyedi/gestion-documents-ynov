import 'package:flutter/material.dart';
import 'student_upload_age.dart'; // page pour scanner/téléverser
import 'convention_form_page.dart'; // page existante pour Convention de stage

class StudentDocumentsPage extends StatelessWidget {
  final Map<String, dynamic>? userProfile;

  const StudentDocumentsPage({this.userProfile, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    const Color primaryColor = Color(0xFF4ECDC4);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mes Documents'),
        backgroundColor: primaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // --- Bouton + pour ajouter un document ---
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                ElevatedButton.icon(
                  onPressed: () {
                    showModalBottomSheet(
                      context: context,
                      shape: const RoundedRectangleBorder(
                        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                      ),
                      backgroundColor: Colors.white,
                      builder: (context) => Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'Ajouter un document',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: primaryColor,
                              ),
                            ),
                            const SizedBox(height: 12),
                            // Scanner un document
                            ListTile(
                              leading: const Icon(Icons.camera_alt, color: Colors.blue),
                              title: const Text('Scanner depuis la caméra'),
                              onTap: () {
                                Navigator.pop(context);
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => StudentUploadPage(
                                      userProfile: userProfile,
                                      authToken: userProfile?['authToken'],
                                    ),
                                  ),
                                );
                              },
                            ),
                            // Téléverser un document
                            ListTile(
                              leading: const Icon(Icons.upload_file, color: Colors.green),
                              title: const Text('Téléverser depuis la galerie'),
                              onTap: () {
                                Navigator.pop(context);
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => StudentUploadPage(
                                      userProfile: userProfile,
                                      authToken: userProfile?['authToken'],
                                    ),
                                  ),
                                );
                              },
                            ),
                            // Convention de stage
                            ListTile(
                              leading: const Icon(Icons.file_upload, color: Colors.orange),
                              title: const Text('Convention de stage'),
                              onTap: () {
                                Navigator.pop(context);
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => ConventionFormPage(
                                      userProfile: userProfile,
                                      authToken: userProfile?['authToken'],
                                    ),
                                  ),
                                );
                              },
                            ),
                            // Autre document
                            ListTile(
                              leading: const Icon(Icons.file_copy, color: Colors.purple),
                              title: const Text('Autre document'),
                              onTap: () {
                                Navigator.pop(context);
                                // TODO: Logique pour ajouter un autre document
                              },
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                  icon: const Icon(Icons.add),
                  label: const Text('Ajouter un document'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: primaryColor,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // --- Liste des documents disponibles ---
            Expanded(
              child: ListView(
                children: [
                  _buildDocumentTile(context, 'Convention de stage 2025', primaryColor),
                  _buildDocumentTile(context, 'Bulletin de notes', primaryColor),
                  _buildDocumentTile(context, 'Attestation de scolarité', primaryColor),
                  // Ajouter d'autres documents ici
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDocumentTile(BuildContext context, String title, Color primaryColor) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 2,
      child: ListTile(
        leading: const Icon(Icons.picture_as_pdf, color: Color(0xFF4ECDC4)),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: const Icon(Icons.download, color: Colors.black54),
              onPressed: () {
                // TODO: Télécharger le document
              },
            ),
            IconButton(
              icon: const Icon(Icons.visibility, color: Colors.black54),
              onPressed: () {
                // TODO: Visualiser le document
              },
            ),
          ],
        ),
        onTap: () {
          // TODO: Optionnel, ouvrir un détail du document
        },
      ),
    );
  }
}
