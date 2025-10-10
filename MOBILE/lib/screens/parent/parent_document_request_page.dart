import 'package:flutter/material.dart';
import 'package:flutter_application_1/theme.dart';

class ParentDocumentRequestPage extends StatelessWidget {
  final String? authToken;
  final Map<String, dynamic>? userProfile;

  const ParentDocumentRequestPage({super.key, this.authToken, this.userProfile});

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor: whiteColor,
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(60),
        child: AppBar(
          backgroundColor: primaryColor,
          elevation: 0,
          leading: IconButton(
            icon: Icon(Icons.arrow_back, color: whiteColor),
            onPressed: () {
              Navigator.of(context).pushReplacementNamed('/parent/home');
            },
          ),
          title: Text(
            "Demande de document",
            style: TextStyle(
              color: whiteColor,
              fontWeight: FontWeight.bold,
              fontSize: 19,
            ),
          ),
          centerTitle: true,
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Demande de document", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
            SizedBox(height: 9),
            // New section for document choices
            _DocumentChoiceSection(), // This will be a new StatefulWidget
            SizedBox(height: 16),
            Text("Elève", style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 7),
            TextField(
              decoration: InputDecoration(
                hintText: "Lucie Durund",
                filled: true,
                fillColor: lightGray,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 14),
              ),
            ),
            SizedBox(height: 14),
            Text("Détails supplémentaires", style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 7),
            TextField(
              maxLines: 3,
              decoration: InputDecoration(
                filled: true,
                fillColor: lightGray,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 14),
              ),
            ),
            SizedBox(height: 26),
            SizedBox(
              width: double.infinity,
              height: 44,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryColor,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {},
                child: Text("Envoyer", style: TextStyle(fontSize: 18, color: whiteColor)),
              ),
            ),
            Container(height: 30, color: primaryColor), // Reverted to primaryColor
          ],
        ),
      ),
    );
  }
}

class _DocumentChoiceSection extends StatefulWidget {
  const _DocumentChoiceSection({Key? key}) : super(key: key);

  @override
  State<_DocumentChoiceSection> createState() => _DocumentChoiceSectionState();
}

class _DocumentChoiceSectionState extends State<_DocumentChoiceSection> {
  String? _selectedDocument;
  final List<String> _documentTypes = [
    "Attestation de scolarité",
    "Bulletin de notes",
    "Diplôme",
    "Convention d'étude",
    "Autre document",
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Choisir un document",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
        ),
        SizedBox(height: 8),
        Wrap(
          spacing: 10,
          runSpacing: 10,
          children: _documentTypes.map((type) {
            final isSelected = _selectedDocument == type;
            return GestureDetector(
              onTap: () {
                setState(() {
                  _selectedDocument = type;
                });
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                curve: Curves.easeInOut,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: isSelected ? primaryColor : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isSelected ? primaryColor : lightGray,
                    width: 1.5,
                  ),
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: primaryColor.withOpacity(0.3),
                            blurRadius: 8,
                            offset: const Offset(0, 4),
                          ),
                        ]
                      : [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                ),
                child: Text(
                  type,
                  style: TextStyle(
                    color: isSelected ? whiteColor : blackColor,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}