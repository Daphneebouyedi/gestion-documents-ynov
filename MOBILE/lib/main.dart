import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_application_1/theme.dart';
import 'screens/auth/student_login_page.dart'; // Added import for StudentLoginPage

// Pages Étudiant
import 'screens/auth/login_page.dart';
import 'screens/student/student_main_screen.dart';
import 'screens/student/student_pd_view.dart';
import 'screens/student/student_upload_age.dart';
import 'screens/student/student_search_page.dart';
import 'screens/student/student_profile_edit_page.dart';
import 'screens/student/student_notifications_page.dart';
import 'screens/student/student_documents_page.dart';
import 'screens/student/convention_form_page.dart';
import 'screens/student/attestation_form_page.dart';

// Pages Parent
import 'screens/parent/parent_documents_page.dart'; // <-- import corrigé
import 'screens/parent/parent_profile_page.dart';
import 'screens/parent/parent_notifications_page.dart';
import 'screens/parent/parent_document_request_page.dart';
import 'screens/parent/parent_document_view_page.dart';
import 'screens/parent/parent_profile_edit_page.dart';
import 'screens/parent/parent_profile_edit_success_page.dart';
import 'screens/auth/home_page.dart';
import 'screens/auth/otp_verification_page.dart'; // Import OTP verification page

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized(); // Required for async main

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'App Scolaire',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: primaryColor,
        scaffoldBackgroundColor: Theme.of(context).scaffoldBackgroundColor,
        textTheme: GoogleFonts.montserratTextTheme(
          Theme.of(context).textTheme,
        ).copyWith(
          bodyMedium: GoogleFonts.robotoTextTheme(Theme.of(context).textTheme).bodyMedium,
        ),
      ),
      initialRoute: '/login',
      routes: {
        // Page de connexion
        '/login': (context) => StudentLoginPage(),

        // Pages secondaires Étudiant
        '/student/pdf_view': (context) => StudentPdfViewPage(),
        '/student/search': (context) => const StudentSearchPage(),
        '/student/notifications': (context) => const StudentNotificationsPage(),

        // Partie Parent
        '/parent/home': (context) => HomePage(),
        '/parent/documents': (context) => ParentDocumentsPage(), // <-- mis à jour
        '/parent/profile': (context) => ParentProfilePage(),
        '/parent/notifications': (context) => ParentNotificationsPage(),
        '/parent/document_request': (context) => ParentDocumentRequestPage(),
        '/parent/document_view': (context) => ParentDocumentViewPage(),
        '/parent/profile_edit': (context) => ParentProfileEditPage(),
        '/parent/profile_edit_success': (context) => ParentProfileEditSuccessPage(),
      },
    );
  }
}
