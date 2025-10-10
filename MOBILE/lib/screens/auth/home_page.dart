import 'package:flutter/material.dart';
import 'package:flutter_application_1/screens/parent/parent_notifications_page.dart';
import 'package:flutter_application_1/screens/parent/parent_search_page.dart';
import 'package:flutter_application_1/screens/parent/parent_document_request_page.dart';
import 'package:flutter_application_1/screens/parent/parent_profile_page.dart';
import 'package:flutter_application_1/screens/parent/parent_documents_page.dart';
import 'package:flutter_application_1/theme.dart'; // Re-added theme import
// import 'package:flutter_application_1/widgets/home_button.dart'; // Removed HomeButton import

class HomePage extends StatelessWidget {
  final Map<String, dynamic>? userProfile;

  const HomePage({this.userProfile, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final String fullName = (userProfile?['firstName'] != null && userProfile?['lastName'] != null)
        ? '${userProfile?['firstName']} ${userProfile?['lastName']}'
        : userProfile?['email'] ?? 'Utilisateur';
    final String userRole = userProfile?['role'] ?? 'Non défini';
    final String userEmail = userProfile?['email'] ?? 'Non défini';

    return Scaffold(
      backgroundColor: primaryColor, // Reverted to primaryColor
      body: SafeArea(
        child: Column(
          children: [
            // --- Header avec photo, nom, email, rôle, notifications ---
            Container(
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: whiteColor, // Reverted to whiteColor
                borderRadius: BorderRadius.circular(28),
                boxShadow: [
                  BoxShadow(
                    color: blackColor.withOpacity(0.12), // Reverted to blackColor
                    blurRadius: 3,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 20),
                child: Column(
                  children: [
                    Row(
                      children: [
                        // Photo parent
                        const CircleAvatar(
                          radius: 30,
                          backgroundImage: AssetImage("assets/avatar.jpg"),
                        ),
                        const SizedBox(width: 16),
                        // Nom, email, rôle
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "$fullName",
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                    color: blackColor), // Reverted to blackColor
                              ),
                              Text(
                                userEmail,
                                style: const TextStyle(
                                    fontSize: 12,
                                    fontStyle: FontStyle.italic,
                                    color: blackColor), // Reverted to blackColor
                              ),
                              Text(
                                userRole,
                                style: const TextStyle(
                                    fontSize: 12,
                                    color: blackColor), // Reverted to blackColor
                              ),
                            ],
                          ),
                        ),
                        // Notifications
                        IconButton(
                          icon: const Icon(Icons.notifications,
                              color: primaryColor, size: 28), // Reverted to primaryColor
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    const ParentNotificationsPage(),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    // Barre de recherche stylée
                    GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const ParentSearchPage(),
                          ),
                        );
                      },
                      child: Container(
                        decoration: BoxDecoration(
                          color: whiteColor, // Reverted to whiteColor
                          border: Border.all(
                              color: lightGray,
                              width: 1.2), // Reverted to lightGray
                          borderRadius: BorderRadius.circular(22),
                        ),
                        padding:
                            const EdgeInsets.symmetric(horizontal: 14, vertical: 0),
                        child: Row(
                          children: [
                            Expanded(
                              child: Text(
                                "Rechercher un document",
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 1,
                                  fontSize: 15,
                                  color: mediumGray, // Reverted to mediumGray
                                ),
                              ),
                            ),
                            Icon(Icons.search,
                                color: primaryColor, size: 24), // Reverted to primaryColor
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // --- Grille 2x2 comme StudentHomePage ---
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 25),
                child: GridView.count(
                  crossAxisCount: 2,
                  mainAxisSpacing: 20,
                  crossAxisSpacing: 20,
                  childAspectRatio: 1.2,
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
                            builder: (context) => ParentDocumentRequestPage(userProfile: userProfile, authToken: userProfile?['authToken']),
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
                            builder: (context) => ParentProfilePage(userProfile: userProfile),
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

            Container(height: 30, color: primaryColor), // Reverted to primaryColor
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
