import 'package:flutter/material.dart';
import 'package:flutter_application_1/theme.dart' as app_theme;
import 'package:flutter_application_1/screens/parent/parent_profile_edit_page.dart';

class ParentProfilePage extends StatelessWidget {
  final Map<String, dynamic>? userProfile;

  const ParentProfilePage({this.userProfile, super.key});

  @override
  Widget build(BuildContext context) {
    final String firstName = userProfile?['firstName'] ?? "Utilisateur";
    final String lastName = userProfile?['lastName'] ?? "";
    final String email = userProfile?['email'] ?? "utilisateur@example.com";
    final String phone = userProfile?['phone'] ?? "Non défini";
    final String address = userProfile?['address'] ?? "Non défini";
    final String country = userProfile?['country'] ?? "Non défini";
    final String ville = userProfile?['ville'] ?? "Non défini"; // Assuming 'ville' for region
    final String promotion = userProfile?['promotion'] ?? "Non défini";
    final String specialite = userProfile?['specialite'] ?? "Non défini";

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: app_theme.primaryColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white, size: 28),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          "Profil",
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 22,
            letterSpacing: 1.2,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              children: [
                const SizedBox(height: 20),
                // Photo profil ronde
                const CircleAvatar(
                  radius: 54,
                  backgroundImage: AssetImage('assets/avatar.jpg'),
                  backgroundColor: Colors.grey,
                ),
                const SizedBox(height: 16),
                // Nom complet
                Text(
                  "$firstName $lastName",
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 22,
                    color: app_theme.blackColor,
                  ),
                ),
                const SizedBox(height: 4),
                // Email
                Text(
                  email,
                  style: const TextStyle(
                    fontSize: 16,
                    color: app_theme.blackColor,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                // Classe / Année
                Text(
                  promotion, // Display promotion instead of year
                  style: const TextStyle(
                    fontSize: 16,
                    color: app_theme.blackColor,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 18),
                // Titre Informations personnelles
                const Text(
                  "Informations personnelles",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: app_theme.blackColor,
                  ),
                ),
                const SizedBox(height: 12),
                // Carte info
                Container(
                  width: 320,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey.shade400, width: 1.5),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      InfoRow(label: "Nom: $lastName"),
                      InfoRow(label: "Prénom: $firstName"),
                      InfoRow(label: "Email: $email"),
                      InfoRow(label: "Téléphone: $phone"),
                      InfoRow(label: "Adresse: $address"),
                      InfoRow(label: "Pays: $country"),
                      InfoRow(label: "Ville: $ville"),
                      InfoRow(label: "Promotion: $promotion"),
                      InfoRow(label: "Spécialité: $specialite"),
                    ],
                  ),
                ),
                const SizedBox(height: 28),
                // Bouton Modifier
                SizedBox(
                  width: 280,
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: app_theme.primaryColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ParentProfileEditPage(
                            userProfile: userProfile,
                          ),
                        ),
                      );
                    },
                    child: const Text(
                      "Modifier",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.1,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                // Bouton Déconnexion
                SizedBox(
                  width: 280,
                  height: 48,
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: app_theme.buttonRed, width: 2),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    onPressed: () {
                      Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
                    },
                    child: const Text(
                      "Déconnexion",
                      style: TextStyle(
                        color: app_theme.buttonRed,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.1,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 18),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class InfoRow extends StatelessWidget {
  final String label;
  const InfoRow({super.key, required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Text(
        label,
        style: const TextStyle(color: Colors.black87, fontSize: 15.5),
      ),
    );
  }
}
