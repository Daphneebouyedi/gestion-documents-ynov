import 'package:flutter/material.dart';
import 'package:flutter_application_1/theme.dart';
import 'package:flutter_application_1/screens/student/student_document_request_page.dart';
import 'package:flutter_application_1/screens/student/student_documents_page.dart';
import 'package:flutter_application_1/screens/student/student_notifications_page.dart';
import 'package:flutter_application_1/screens/student/student_profile_page.dart';
import 'package:flutter_application_1/screens/student/student_search_page.dart';

class StudentHomePage extends StatelessWidget {
  final Map<String, dynamic>? userProfile;

  const StudentHomePage({this.userProfile, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final String fullName = (userProfile?['firstName'] != null && userProfile?['lastName'] != null)
        ? '${userProfile?['firstName']} ${userProfile?['lastName']}'
        : userProfile?['email'] ?? 'Utilisateur';
    final String userRole = userProfile?['role'] ?? 'Non défini';
    final String userEmail = userProfile?['email'] ?? 'Non défini';

    return Scaffold(
      backgroundColor: primaryColor,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // HEADER
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Row(
                children: [
                  const Icon(Icons.menu, color: whiteColor, size: 28),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      "Accueil $userRole",
                      style: const TextStyle(
                        color: whiteColor,
                        fontSize: 22,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.notifications_none,
                        color: whiteColor, size: 28),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              const StudentNotificationsPage(),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),

            // APERÇU / STATISTIQUES
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: whiteColor,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 12,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: primaryColor,
                    ),
                    child: const Icon(Icons.school,
                        color: whiteColor, size: 32),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Bonjour, $fullName",
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: blackColor,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          userEmail,
                          style: TextStyle(
                            fontSize: 14,
                            color: blackColor.withOpacity(0.6),
                          ),
                        ),
                        Text(
                          'Rôle: $userRole',
                          style: TextStyle(
                            fontSize: 14,
                            color: blackColor.withOpacity(0.6),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // BARRE DE RECHERCHE
            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const StudentSearchPage(),
                  ),
                );
              },
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 20),
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: whiteColor,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    const Icon(Icons.search, color: primaryColor, size: 24),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        "Rechercher un document",
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                          fontSize: 15,
                          color: blackColor.withOpacity(0.5),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // ACTIONS RAPIDES / CARTES
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
                decoration: const BoxDecoration(
                  color: whiteColor,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(32),
                    topRight: Radius.circular(32),
                  ),
                ),
                child: GridView.count(
                  crossAxisCount: 2,
                  mainAxisSpacing: 20,
                  crossAxisSpacing: 20,
                  childAspectRatio: 1.2, // Adjusted for better card appearance
                  physics: const BouncingScrollPhysics(),
                  children: [
                    _buildActionCard(
                      context,
                      title: "Documents reçus",
                      icon: Icons.folder_shared,
                      onTap: () {
                        // Navigate to Documents reçus page
                      },
                    ),
                    _buildActionCard(
                      context,
                      title: "Demande de documents",
                      icon: Icons.note_add,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                StudentDocumentRequestPage(authToken: userProfile?['authToken'], userProfile: userProfile),
                          ),
                        );
                      },
                    ),
                    _buildActionCard(
                      context,
                      title: "Profil",
                      icon: Icons.person,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                StudentProfilePage(userProfile: userProfile),
                          ),
                        );
                      },
                    ),
                    _buildActionCard(
                      context,
                      title: "Historique des demandes",
                      icon: Icons.history,
                      onTap: () {
                        // Navigate to Historique des demandes page
                      },
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Méthode pour construire une carte action rapide moderne
  Widget _buildActionCard(BuildContext context,
      {required String title,
      required IconData icon,
      required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        child: Container(
          decoration: BoxDecoration(
            color: whiteColor, // Or a subtle gradient
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 48, color: primaryColor),
              const SizedBox(height: 12),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8.0),
                child: Text(
                  title,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: blackColor,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
