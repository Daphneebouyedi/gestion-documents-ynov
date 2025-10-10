import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
// import 'dart:html' as html; // uniquement pour Flutter Web

class StudentUploadPage extends StatefulWidget {
  final Map<String, dynamic>? userProfile;
  final String? authToken;

  const StudentUploadPage({this.userProfile, this.authToken, super.key});

  @override
  State<StudentUploadPage> createState() => _StudentUploadPageState();
}

class _StudentUploadPageState extends State<StudentUploadPage> {
  final ImagePicker _picker = ImagePicker();
  XFile? _pickedFile; // pour mobile
  Uint8List? _webBytes; // pour web
  String? _fileName;

  // Fonction pour choisir une image ou un PDF depuis la galerie (mobile ou web)
  Future<void> _pickFileFromGallery() async {
    if (kIsWeb) {
      // Web
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("File picking not supported on web in this version.")),
      );
    } else {
      // Mobile
      final XFile? file = await _picker.pickImage(source: ImageSource.gallery);
      if (file != null) {
        setState(() {
          _pickedFile = file;
          _fileName = file.name;
        });
      }
    }
  }

  // Fonction pour scanner un document depuis la caméra (mobile uniquement)
  Future<void> _scanDocumentWithCamera() async {
    if (kIsWeb) {
      // Web → on peut juste utiliser la galerie pour web
      await _pickFileFromGallery();
    } else {
      final XFile? photo = await _picker.pickImage(source: ImageSource.camera);
      if (photo != null) {
        setState(() {
          _pickedFile = photo;
          _fileName = photo.name;
        });
      }
    }
  }

  void _uploadFile() {
    if ((_pickedFile == null && _webBytes == null) || _fileName == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Veuillez scanner ou sélectionner un document d'abord.")),
      );
      return;
    }

    // TODO: envoyer vers backend ou Firebase Storage
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Document $_fileName prêt à être envoyé !")),
    );
  }

  @override
  Widget build(BuildContext context) {
    const turquoise = Color(0xFF24B6AA);

    return Scaffold(
      appBar: AppBar(
        title: const Text("Numérisation / Téléversement"),
        backgroundColor: turquoise,
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Expanded(
              child: GestureDetector(
                onTap: () async {
                  // Affiche un menu pour choisir scanner ou téléverser
                  showModalBottomSheet(
                    context: context,
                    shape: const RoundedRectangleBorder(
                      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                    ),
                    builder: (context) => Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          ListTile(
                            leading: const Icon(Icons.camera_alt, color: Colors.blue),
                            title: const Text('Scanner depuis la caméra'),
                            onTap: () {
                              Navigator.pop(context);
                              _scanDocumentWithCamera();
                            },
                          ),
                          ListTile(
                            leading: const Icon(Icons.upload_file, color: Colors.green),
                            title: const Text('Téléverser depuis la galerie'),
                            onTap: () {
                              Navigator.pop(context);
                              _pickFileFromGallery();
                            },
                          ),
                        ],
                      ),
                    ),
                  );
                },
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: turquoise, width: 1.5),
                  ),
                  child: Center(
                    child: (_pickedFile == null && _webBytes == null)
                        ? Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              Icon(Icons.document_scanner, size: 60, color: turquoise),
                              SizedBox(height: 12),
                              Text(
                                "Cliquez pour scanner ou téléverser un document",
                                textAlign: TextAlign.center,
                                style: TextStyle(fontSize: 16),
                              ),
                            ],
                          )
                        : Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              _fileName != null && _fileName!.endsWith('.pdf')
                                  ? const Icon(Icons.picture_as_pdf, size: 100, color: Colors.red)
                                  : kIsWeb
                                      ? const Text("Web preview not available")
                                      : Image.file(File(_pickedFile!.path), height: 200),
                              const SizedBox(height: 12),
                              Text("Document sélectionné : $_fileName"),
                            ],
                          ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: turquoise,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: _uploadFile,
                child: const Text("Envoyer", style: TextStyle(fontSize: 16)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
