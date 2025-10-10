import 'package:flutter/material.dart';
import 'package:flutter_application_1/theme.dart' as app_theme;
import 'convention_form_page.dart';
import 'student_upload_age.dart';
import 'attestation_form_page.dart';
import 'convention_etude_form_page.dart';

class StudentDocumentRequestPage extends StatelessWidget {
  final String? authToken;
  final Map<String, dynamic>? userProfile;

  const StudentDocumentRequestPage({Key? key, this.authToken, this.userProfile}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // const Color primaryColor = Color(0xFF24B6AA); // Removed local definition

    final List<_DocumentOption> documentOptions = [
      _DocumentOption(
        title: 'Attestation de scolarité',
        icon: Icons.school,
        color: Colors.blueAccent,
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => AttestationForm(
                authToken: authToken, // Replaced currentUser with authToken
              ),
            ),
          );
        },
      ),
      _DocumentOption(
        title: 'Relevé de notes',
        icon: Icons.receipt_long,
        color: Colors.orangeAccent,
        onTap: () {
          // Ajouter la navigation vers le formulaire du relevé de notes
        },
      ),
      _DocumentOption(
        title: 'Convention de stage',
        icon: Icons.assignment,
        color: Colors.greenAccent,
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => ConventionFormPage()),
          );
        },
      ),
      _DocumentOption(
        title: 'Convention d\'étude',
        icon: Icons.book,
        color: Colors.blueGrey,
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => ConventionEtudeForm()),
          );
        },
      ),
      _DocumentOption(
        title: 'Autre document',
        icon: Icons.upload_file,
        color: Colors.purpleAccent,
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const StudentUploadPage()),
          );
        },
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: app_theme.primaryColor,
        title: const Text('Demande de document'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: GridView.builder(
          itemCount: documentOptions.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            mainAxisSpacing: 16,
            crossAxisSpacing: 16,
            childAspectRatio: 0.95,
          ),
          itemBuilder: (context, index) {
            final doc = documentOptions[index];
            return GestureDetector(
              onTap: doc.onTap,
              child: Container(
                decoration: BoxDecoration(
                  color: doc.color.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 6,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(doc.icon, size: 50, color: doc.color),
                    const SizedBox(height: 12),
                    Text(
                      doc.title,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

class _DocumentOption {
  final String title;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  _DocumentOption({
    required this.title,
    required this.icon,
    required this.color,
    required this.onTap,
  });
}
