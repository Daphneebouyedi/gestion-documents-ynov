import 'package:flutter/material.dart';
import 'package:flutter_application_1/convex_js_interop.dart'; // Import convex interop
import 'package:flutter_application_1/theme.dart' as app_theme;

class ParentProfileEditPage extends StatefulWidget {
  final Map<String, dynamic>? userProfile;

  const ParentProfileEditPage({this.userProfile, super.key});

  @override
  State<ParentProfileEditPage> createState() => _ParentProfileEditPageState();
}

class _ParentProfileEditPageState extends State<ParentProfileEditPage> {
  late TextEditingController firstNameController;
  late TextEditingController lastNameController;
  late TextEditingController emailController;
  late TextEditingController phoneController;
  late TextEditingController addressController;
  late TextEditingController countryController;
  late TextEditingController regionController;
  late TextEditingController yearController;

  @override
  void initState() {
    super.initState();
    firstNameController = TextEditingController(text: widget.userProfile?['firstName'] ?? '');
    lastNameController = TextEditingController(text: widget.userProfile?['lastName'] ?? '');
    emailController = TextEditingController(text: widget.userProfile?['email'] ?? '');
    phoneController = TextEditingController(text: widget.userProfile?['phone'] ?? '');
    addressController = TextEditingController(text: widget.userProfile?['address'] ?? '');
    countryController = TextEditingController(text: widget.userProfile?['country'] ?? '');
    regionController = TextEditingController(text: widget.userProfile?['ville'] ?? ''); // Assuming 'ville' for region
    yearController = TextEditingController(text: widget.userProfile?['promotion'] ?? ''); // Assuming 'promotion' for year
  }

  @override
  void dispose() {
    firstNameController.dispose();
    lastNameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    addressController.dispose();
    countryController.dispose();
    regionController.dispose();
    yearController.dispose();
    super.dispose();
  }

  void _saveProfile() async {
    if (widget.userProfile == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Erreur: Profil utilisateur manquant.")),
      );
      return;
    }

    final updatedData = <String, String>{
      'phone': phoneController.text,
      'address': addressController.text,
      'country': countryController.text,
      'ville': regionController.text,
    };

    try {
      await callConvexUpdateUserProfile(widget.userProfile!['_id'], updatedData);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Profil mis à jour avec succès !")),
      );
      Navigator.pop(context); // Go back after successful update
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Erreur lors de la mise à jour du profil: ${e.toString()}")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    const Color primaryColor = app_theme.primaryColor;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Modifier Profil"),
        backgroundColor: primaryColor,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white, size: 28),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: ListView(
          children: [
            _editField("Prénom", firstNameController, enabled: false), // Email and name usually not editable here
            const SizedBox(height: 10),
            _editField("Nom", lastNameController, enabled: false),
            const SizedBox(height: 10),
            _editField("Email", emailController, enabled: false),
            const SizedBox(height: 10),
            _editField("Téléphone", phoneController),
            const SizedBox(height: 10),
            _editField("Adresse", addressController),
            const SizedBox(height: 10),
            _editField("Pays", countryController),
            const SizedBox(height: 10),
            _editField("Région", regionController),
            const SizedBox(height: 10),
            _editField("Promotion", yearController, enabled: false),
            const SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: primaryColor,
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
              onPressed: _saveProfile,
              child: const Text("Enregistrer"),
            ),
          ],
        ),
      ),
    );
  }

  Widget _editField(String label, TextEditingController controller, {bool enabled = true}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        TextField(
          controller: controller,
          enabled: enabled,
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
          ),
        ),
      ],
    );
  }
}
