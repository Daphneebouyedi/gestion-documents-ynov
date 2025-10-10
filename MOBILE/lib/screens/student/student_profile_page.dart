import 'package:flutter/material.dart';
import 'package:flutter_application_1/theme.dart' as app_theme;
// import 'package:image_picker/image_picker.dart'; // Removed image_picker
// import 'dart:io'; // Removed dart:io
import 'student_profile_edit_page.dart';

class StudentProfilePage extends StatelessWidget {
  final Map<String, dynamic>? userProfile;

  const StudentProfilePage({
    this.userProfile,
    Key? key,
  }) : super(key: key);

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
      backgroundColor: Colors.grey[100],
      body: SingleChildScrollView(
        child: Column(
          children: [
            // HEADER AVEC COURBE
            Stack(
              children: [
                Container(
                  height: 200,
                  decoration: BoxDecoration(
                    color: app_theme.primaryColor,
                    borderRadius: const BorderRadius.only(
                      bottomLeft: Radius.circular(40),
                      bottomRight: Radius.circular(40),
                    ),
                  ),
                ),
                Positioned(
                  top: 80,
                  left: 0,
                  right: 0,
                  child: Column(
                    children: [
                      // Photo de profil
                      GestureDetector(
                        onTap: () {
                          // No image picking functionality
                        },
                        child: const CircleAvatar(
                          radius: 55,
                          backgroundImage: AssetImage('assets/avatar.jpg'), // Always use avatar.jpg
                          backgroundColor: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 12),
                      // Nom
                      Text(
                        "$firstName $lastName",
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 22,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      // Email
                      Text(
                        email,
                        style: const TextStyle(
                          fontSize: 15,
                          color: Colors.white70,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 80),

            // INFOS PERSONNELLES
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18.0),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Informations personnelles",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 17,
                        color: Colors.black87,
                      ),
                    ),
                    const Divider(height: 20, thickness: 1),
                    InfoTile(icon: Icons.phone, label: "Téléphone", value: phone),
                    InfoTile(icon: Icons.location_on, label: "Adresse", value: address),
                    InfoTile(icon: Icons.flag, label: "Pays", value: country),
                    InfoTile(icon: Icons.map, label: "Ville", value: ville),
                    InfoTile(icon: Icons.school, label: "Promotion", value: promotion),
                    InfoTile(icon: Icons.bookmark, label: "Spécialité", value: specialite),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 30),

            // BOUTONS
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 40.0),
              child: Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: app_theme.primaryColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => StudentProfileEditPage(
                              userProfile: userProfile,
                            ),
                          ),
                        );
                      },
                      child: const Text(
                        "Modifier",
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 15),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: app_theme.buttonRed, width: 2),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onPressed: () {
                        Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
                      },
                      child: const Text(
                        "Déconnexion",
                        style: TextStyle(
                          color: app_theme.buttonRed,
                          fontSize: 17,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }
}

class InfoTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const InfoTile({
    Key? key,
    required this.icon,
    required this.label,
    required this.value,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(icon, color: app_theme.primaryColor, size: 22),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              "$label : $value",
              style: const TextStyle(fontSize: 15.5, color: Colors.black87),
            ),
          ),
        ],
      ),
    );
  }
}
