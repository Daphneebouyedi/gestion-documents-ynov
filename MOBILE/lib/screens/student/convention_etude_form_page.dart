import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_application_1/theme.dart';
import 'package:image_picker/image_picker.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

class ConventionEtudeForm extends StatefulWidget {
  const ConventionEtudeForm({Key? key}) : super(key: key);

  @override
  ConventionEtudeFormState createState() => ConventionEtudeFormState();
}

class ConventionEtudeFormState extends State<ConventionEtudeForm> {
  final _formKey = GlobalKey<FormState>();

  // Controllers are initialized with sample data as in the React example
  final _nomCandidatController = TextEditingController(text: "DUPONT");
  final _prenomCandidatController = TextEditingController(text: "Sophie");
  String _civiliteCandidat = "Mme";
  final _dateNaissanceCandidatController =
      TextEditingController(text: "2005-08-20");
  final _lieuNaissanceCandidatController =
      TextEditingController(text: "Marseille");
  final _paysCandidatController = TextEditingController(text: "France");
  final _nationaliteCandidatController =
      TextEditingController(text: "Française");
  final _adresseCandidatController =
      TextEditingController(text: "5 Allée des Palmiers");
  final _villeCandidatController = TextEditingController(text: "Nice");
  final _codePostalCandidatController = TextEditingController(text: "06000");
  final _telephoneCandidatController = TextEditingController(text: "0493000000");
  final _portableCandidatController = TextEditingController(text: "0600000000");
  final _emailCandidatController =
      TextEditingController(text: "sophie.dupont@mail.com");
  final _idCandidatController = TextEditingController(text: "ID12345678");
  XFile? _photoCandidat;

  String _civiliteRespLegal = "Mr";
  String _qualiteRespLegal = "Père";
  final _nomRespLegalController = TextEditingController(text: "DUPONT");
  final _prenomRespLegalController = TextEditingController(text: "Marc");
  final _dateNaissanceRespLegalController =
      TextEditingController(text: "1975-01-01");
  final _lieuNaissanceRespLegalController = TextEditingController(text: "Paris");
  final _paysRespLegalController = TextEditingController(text: "France");
  final _nationaliteRespLegalController =
      TextEditingController(text: "Française");
  final _adresseRespLegalController =
      TextEditingController(text: "5 Allée des Palmiers");
  final _villeRespLegalController = TextEditingController(text: "Nice");
  final _codePostalRespLegalController = TextEditingController(text: "06000");
  final _telephoneRespLegalController =
      TextEditingController(text: "0493111111");
  final _portableRespLegalController =
      TextEditingController(text: "0611111111");
  final _emailRespLegalController =
      TextEditingController(text: "marc.dupont@mail.com");
  final _idRespLegalController = TextEditingController(text: "ID87654321");

  String _civiliteRespFin = "Mr";
  String _qualiteRespFin = "Père";
  final _nomRespFinController = TextEditingController(text: "DUPONT");
  final _prenomRespFinController = TextEditingController(text: "Marc");
  final _dateNaissanceRespFinController =
      TextEditingController(text: "1975-01-01");
  final _lieuNaissanceRespFinController = TextEditingController(text: "Paris");
  final _paysRespFinController = TextEditingController(text: "France");
  final _nationaliteRespFinController =
      TextEditingController(text: "Française");
  final _adresseRespFinController =
      TextEditingController(text: "5 Allée des Palmiers");
  final _villeRespFinController = TextEditingController(text: "Nice");
  final _codePostalRespFinController = TextEditingController(text: "06000");
  final _telephoneRespFinController =
      TextEditingController(text: "0493111111");
  final _emailRespFinController =
      TextEditingController(text: "marc.dupont@mail.com");
  final _idRespFinController = TextEditingController(text: "ID87654321");

  final _commentaireController = TextEditingController(
      text: "Année de césure en 2020-2021 pour un voyage humanitaire au Pérou.");

  final List<Map<String, TextEditingController>> _etudes = [];

  @override
  void initState() {
    super.initState();
    _addEtude(); // Add one row for previous studies initially
  }

  void _addEtude() {
    setState(() {
      _etudes.add({
        "annee": TextEditingController(),
        "etudeSuivie": TextEditingController(),
        "etablissement": TextEditingController(),
        "diplome": TextEditingController(),
        "dateObtention": TextEditingController(),
      });
    });
  }

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      setState(() {
        _photoCandidat = image;
      });
    }
  }

  Future<void> _selectDate(
      BuildContext context, TextEditingController controller) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime(2101),
    );
    if (picked != null) {
      setState(() {
        controller.text = "${picked.toLocal()}".split(' ')[0];
      });
    }
  }

  void _generatePdf() async {
    if (_formKey.currentState!.validate()) {
      final pdf = pw.Document();
      final ynovBlue = PdfColor.fromHex("#003366");
      final grayDark = PdfColor.fromHex("#323232");

      Uint8List? photoBytes;
      if (_photoCandidat != null) {
        photoBytes = await _photoCandidat!.readAsBytes();
      }

      pdf.addPage(
        pw.MultiPage(
          pageFormat: PdfPageFormat.a4,
          margin: const pw.EdgeInsets.all(15),
          build: (context) => [
            // Header
            pw.Row(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                // pw.Image(pw.MemoryImage(ynovLogoBytes)), // Assuming you have Ynov logo in assets
                pw.Expanded(
                  child: pw.Container(
                    height: 50,
                    child: pw.FittedBox(
                      child: pw.Text(
                        "CONVENTION D'ÉTUDE",
                        style: pw.TextStyle(
                          fontWeight: pw.FontWeight.bold,
                          fontSize: 22,
                          color: ynovBlue,
                        ),
                      ),
                      alignment: pw.Alignment.center,
                    ),
                  ),
                ),
                pw.Container(
                  width: 30,
                  height: 40,
                  decoration: pw.BoxDecoration(
                    border: pw.Border.all(color: ynovBlue, width: 1),
                  ),
                  child: photoBytes != null
                      ? pw.Image(pw.MemoryImage(photoBytes), fit: pw.BoxFit.cover)
                      : pw.Center(
                          child: pw.Text("Photo",
                              style: pw.TextStyle(
                                  fontSize: 8, color: grayDark))),
                ),
              ],
            ),
            pw.Divider(thickness: 2, color: ynovBlue),
            pw.SizedBox(height: 15),

            // Sections
            _buildPdfSection("ÉTAT CIVIL DU CANDIDAT", [
              {"label": "Nom & Prénom", "value": '${_nomCandidatController.text} ${_prenomCandidatController.text}'},
              {"label": "Né(e) le", "value": _dateNaissanceCandidatController.text},
              {"label": "à / Pays", "value": '${_lieuNaissanceCandidatController.text} (${_paysCandidatController.text})'},
              {"label": "Nationalité", "value": _nationaliteCandidatController.text},
              {"label": "ID/Passeport N°", "value": _idCandidatController.text},
              {"label": "Civilité", "value": _civiliteCandidat},
              {"label": "Adresse", "value": '${_adresseCandidatController.text}, ${_codePostalCandidatController.text} ${_villeCandidatController.text}'},
              {"label": "Email", "value": _emailCandidatController.text},
              {"label": "Tél/Port.", "value": '${_telephoneCandidatController.text} / ${_portableCandidatController.text}'},
            ], ynovBlue, grayDark),

            _buildPdfSection("ÉTAT CIVIL DU RESPONSABLE LÉGAL", [
              {"label": "Nom & Prénom", "value": '${_nomRespLegalController.text} ${_prenomRespLegalController.text}'},
              {"label": "Qualité", "value": _qualiteRespLegal},
               {"label": "Né(e) le", "value": _dateNaissanceRespLegalController.text},
              {"label": "à / Pays", "value": '${_lieuNaissanceRespLegalController.text} (${_paysRespLegalController.text})'},
              {"label": "Nationalité", "value": _nationaliteRespLegalController.text},
              {"label": "ID/Passeport N°", "value": _idRespLegalController.text},
              {"label": "Adresse", "value": '${_adresseRespLegalController.text}, ${_codePostalRespLegalController.text} ${_villeRespLegalController.text}'},
              {"label": "Email", "value": _emailRespLegalController.text},
              {"label": "Tél/Port.", "value": '${_telephoneRespLegalController.text} / ${_portableRespLegalController.text}'},
            ], ynovBlue, grayDark),
            
            _buildPdfSection("ÉTAT CIVIL DU RESPONSABLE FINANCIER", [
               {"label": "Nom & Prénom", "value": '${_nomRespFinController.text} ${_prenomRespFinController.text}'},
              {"label": "Qualité", "value": _qualiteRespFin},
               {"label": "Né(e) le", "value": _dateNaissanceRespFinController.text},
              {"label": "à / Pays", "value": '${_lieuNaissanceRespFinController.text} (${_paysRespFinController.text})'},
              {"label": "Nationalité", "value": _nationaliteRespFinController.text},
              {"label": "ID/Passeport N°", "value": _idRespFinController.text},
              {"label": "Adresse", "value": '${_adresseRespFinController.text}, ${_codePostalRespFinController.text} ${_villeRespFinController.text}'},
              {"label": "Email", "value": _emailRespFinController.text},
              {"label": "Téléphone", "value": _telephoneRespFinController.text},
            ], ynovBlue, grayDark),

            // Previous Studies Table
            _buildPdfEtudesTable(ynovBlue, grayDark),

            // Comment
            pw.SizedBox(height: 10),
            _buildPdfSectionHeader("COMMENTAIRES", ynovBlue),
            pw.Container(
              padding: pw.EdgeInsets.all(8),
              decoration: pw.BoxDecoration(
                border: pw.Border.all(color: ynovBlue, width: 0.5),
              ),
              child: pw.Text(_commentaireController.text, style: pw.TextStyle(color: grayDark, fontSize: 9)),
            ),

            // Signatures
            pw.SizedBox(height: 40),
            pw.Text("Fait à __________________________________, le ____ / ____ / ______"),
            pw.SizedBox(height: 30),
            pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                pw.Column(children: [
                  pw.Container(width: 150, height: 1, color: grayDark),
                  pw.SizedBox(height: 4),
                  pw.Text("Signature du Candidat", style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
                ]),
                pw.Column(children: [
                  pw.Container(width: 150, height: 1, color: grayDark),
                  pw.SizedBox(height: 4),
                  pw.Text("Signature du Responsable Légal", style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
                ]),
              ]
            )
          ],
        ),
      );

      await Printing.layoutPdf(
          onLayout: (PdfPageFormat format) async => pdf.save());
    }
  }

  pw.Widget _buildPdfSection(String title, List<Map<String, String>> data, PdfColor headerColor, PdfColor textColor) {
    return pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.start,
      children: [
        _buildPdfSectionHeader(title, headerColor),
        pw.SizedBox(height: 5),
        pw.Wrap(
          spacing: 10,
          runSpacing: 5,
          children: data.map((item) => pw.Row(
            mainAxisSize: pw.MainAxisSize.min,
            children: [
              pw.Text('${item["label"]}: ', style: pw.TextStyle(fontWeight: pw.FontWeight.bold, color: textColor, fontSize: 9)),
              pw.Text(item["value"]!, style: pw.TextStyle(color: textColor, fontSize: 9)),
            ]
          )).toList(),
        ),
        pw.SizedBox(height: 10),
      ]
    );
  }

  pw.Widget _buildPdfSectionHeader(String title, PdfColor color) {
    return pw.Container(
      width: double.infinity,
      padding: const pw.EdgeInsets.all(4),
      decoration: pw.BoxDecoration(color: color),
      child: pw.Text(
        title,
        style: pw.TextStyle(
            fontWeight: pw.FontWeight.bold, color: PdfColors.white, fontSize: 10),
      ),
    );
  }

  pw.Widget _buildPdfEtudesTable(PdfColor headerColor, PdfColor textColor) {
    final headers = ['Année Scolaire', 'Étude Suivie', 'Établissement', 'Diplôme', "Date d'obtention"];
    final data = _etudes.map((etude) => [
      etude['annee']!.text,
      etude['etudeSuivie']!.text,
      etude['etablissement']!.text,
      etude['diplome']!.text,
      etude['dateObtention']!.text,
    ]).toList();

    return pw.Table.fromTextArray(
      headers: headers,
      data: data,
      headerStyle: pw.TextStyle(fontWeight: pw.FontWeight.bold, color: PdfColors.white, fontSize: 8),
      headerDecoration: pw.BoxDecoration(color: headerColor),
      cellStyle: pw.TextStyle(color: textColor, fontSize: 8),
      cellAlignments: {
        0: pw.Alignment.centerLeft,
        1: pw.Alignment.centerLeft,
        2: pw.Alignment.centerLeft,
        3: pw.Alignment.centerLeft,
        4: pw.Alignment.center,
      },
    );
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text(
          'Demander une convention d\'étude',
          style: TextStyle(color: secondaryColor, fontWeight: FontWeight.w600, fontSize: 22),
        ),
        backgroundColor: Colors.white,
        elevation: 1,
        shadowColor: mediumGray,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: secondaryColor),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: Icon(Icons.school, color: primaryColor, size: 40),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildSectionTitle("ÉTAT CIVIL DU CANDIDAT"),
              _buildCandidatSection(),
              const SizedBox(height: 20),
              _buildSectionTitle("ÉTAT CIVIL DU RESPONSABLE LÉGAL"),
              _buildResponsableSection(_civiliteRespLegal, _qualiteRespLegal, _nomRespLegalController, _prenomRespLegalController, _dateNaissanceRespLegalController, _lieuNaissanceRespLegalController, _paysRespLegalController, _nationaliteRespLegalController, _adresseRespLegalController, _codePostalRespLegalController, _villeRespLegalController, _telephoneRespLegalController, _portableRespLegalController, _emailRespLegalController, _idRespLegalController, (val) => setState(() => _civiliteRespLegal = val!), (val) => setState(() => _qualiteRespLegal = val!)),
              const SizedBox(height: 20),
              _buildSectionTitle("ÉTAT CIVIL DU RESPONSABLE FINANCIER"),
               _buildResponsableSection(_civiliteRespFin, _qualiteRespFin, _nomRespFinController, _prenomRespFinController, _dateNaissanceRespFinController, _lieuNaissanceRespFinController, _paysRespFinController, _nationaliteRespFinController, _adresseRespFinController, _codePostalRespFinController, _villeRespFinController, _telephoneRespFinController, TextEditingController(), _emailRespFinController, _idRespFinController, (val) => setState(() => _civiliteRespFin = val!), (val) => setState(() => _qualiteRespFin = val!)),
              const SizedBox(height: 20),
              _buildSectionTitle("ÉTUDES ANTÉRIEURES"),
              _buildEtudesSection(),
              const SizedBox(height: 20),
              _buildSectionTitle("COMMENTAIRES"),
              _buildCommentaireSection(),
              const SizedBox(height: 30),
              ElevatedButton.icon(
                icon: const Icon(Icons.check),
                label: const Text("Demander la convention"),
                onPressed: _generatePdf,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10.0),
      child: Text(
        title,
        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: primaryColor),
      ),
    );
  }

  Widget _buildCandidatSection() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Wrap(
          spacing: 16,
          runSpacing: 16,
          children: [
            _buildRadioGroup("Civilité", _civiliteCandidat, ["Mr", "Mme"], (val) => setState(() => _civiliteCandidat = val!)),
            _buildTextField("Nom", _nomCandidatController),
            _buildTextField("Prénom", _prenomCandidatController),
            _buildDateField("Date de naissance", _dateNaissanceCandidatController),
            _buildTextField("Lieu de naissance", _lieuNaissanceCandidatController),
            _buildTextField("Pays", _paysCandidatController),
            _buildTextField("Nationalité", _nationaliteCandidatController),
            _buildTextField("Adresse", _adresseCandidatController, isFullWidth: true),
            _buildTextField("Code Postal", _codePostalCandidatController),
            _buildTextField("Ville", _villeCandidatController),
            _buildTextField("Téléphone", _telephoneCandidatController),
            _buildTextField("Portable", _portableCandidatController),
            _buildTextField("Email", _emailCandidatController),
            _buildTextField("ID/Passeport", _idCandidatController, isFullWidth: true),
            ElevatedButton.icon(onPressed: _pickImage, icon: Icon(Icons.photo_camera), label: Text("Photo d'identité")),
            if (_photoCandidat != null) Text(_photoCandidat!.name),
          ],
        ),
      ),
    );
  }

  Widget _buildResponsableSection(
    String civilite, String qualite,
    TextEditingController nom, TextEditingController prenom, TextEditingController dateNaissance,
    TextEditingController lieuNaissance, TextEditingController pays, TextEditingController nationalite,
    TextEditingController adresse, TextEditingController codePostal, TextEditingController ville,
    TextEditingController telephone, TextEditingController portable, TextEditingController email,
    TextEditingController id,
    Function(String?) onCiviliteChanged, Function(String?) onQualiteChanged,
  ) {
     return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Wrap(
          spacing: 16,
          runSpacing: 16,
          children: [
            _buildRadioGroup("Civilité", civilite, ["Mr", "Mme"], onCiviliteChanged),
            _buildRadioGroup("Qualité", qualite, ["Père", "Mère", "Tuteur"], onQualiteChanged),
            _buildTextField("Nom", nom),
            _buildTextField("Prénom", prenom),
            _buildDateField("Date de naissance", dateNaissance),
            _buildTextField("Lieu de naissance", lieuNaissance),
            _buildTextField("Pays", pays),
            _buildTextField("Nationalité", nationalite),
            _buildTextField("Adresse", adresse, isFullWidth: true),
            _buildTextField("Code Postal", codePostal),
            _buildTextField("Ville", ville),
            _buildTextField("Téléphone", telephone),
            _buildTextField("Portable", portable),
            _buildTextField("Email", email),
            _buildTextField("ID/Passeport", id, isFullWidth: true),
          ],
        ),
      ),
    );
  }

  Widget _buildEtudesSection() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            ..._etudes.asMap().entries.map((entry) {
              int idx = entry.key;
              Map<String, TextEditingController> etude = entry.value;
              return Column(
                children: [
                  Wrap(
                    spacing: 16,
                    runSpacing: 16,
                    children: [
                      _buildTextField("Année", etude['annee']!),
                      _buildTextField("Étude Suivie", etude['etudeSuivie']!),
                      _buildTextField("Établissement", etude['etablissement']!),
                      _buildTextField("Diplôme", etude['diplome']!),
                      _buildDateField("Date d'obtention", etude['dateObtention']!),
                    ],
                  ),
                  if(idx < _etudes.length - 1) const Divider(height: 30),
                ],
              );
            }).toList(),
            const SizedBox(height: 10),
            TextButton.icon(
              icon: const Icon(Icons.add),
              label: const Text("Ajouter une ligne"),
              onPressed: _addEtude,
            )
          ],
        ),
      ),
    );
  }

  Widget _buildCommentaireSection() {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: _buildTextField(
            "Si vous avez interrompu vos études, veuillez indiquer durée + raison",
            _commentaireController,
            isFullWidth: true,
            maxLines: 4),
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller,
      {bool isFullWidth = false, int maxLines = 1}) {
    Widget textField = TextFormField(
      controller: controller,
      maxLines: maxLines,
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(),
      ),
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Ce champ est obligatoire';
        }
        return null;
      },
    );
    return isFullWidth ? textField : Flexible(child: textField);
  }

  Widget _buildDateField(String label, TextEditingController controller) {
    return Flexible(
      child: TextFormField(
        controller: controller,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(),
          suffixIcon: Icon(Icons.calendar_today),
        ),
        readOnly: true,
        onTap: () => _selectDate(context, controller),
         validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Ce champ est obligatoire';
          }
          return null;
        },
      ),
    );
  }

  Widget _buildRadioGroup(
      String label, String groupValue, List<String> items, Function(String?) onChanged) {
    return Flexible(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(fontWeight: FontWeight.bold)),
          Row(
            children: items
                .map((item) => Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Radio<String>(
                          value: item,
                          groupValue: groupValue,
                          onChanged: onChanged,
                        ),
                        Text(item),
                      ],
                    ))
                .toList(),
          ),
        ],
      ),
    );
  }
}
