import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_application_1/screens/auth/student_login_page.dart';
import 'package:flutter_application_1/screens/auth/otp_verification_page.dart';

void main() {
  group('Authentication Tests', () {
    testWidgets('Login Page UI Test', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(home: StudentLoginPage()));

      // Verify presence of key UI elements
      expect(find.text('Connexion'), findsOneWidget);
      expect(find.byType(TextFormField), findsNWidgets(2)); // Email and Password fields
      expect(find.text('Se connecter'), findsOneWidget);
    });

    testWidgets('OTP Verification Page UI Test', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(
        home: OtpVerificationPage(
          email: 'test@example.com',
          otp: '123456',
          userRole: 'student',
          authToken: 'dummy_token',
        ),
      ));

      // Verify presence of key UI elements
      expect(find.text('Vérification OTP'), findsOneWidget);
      expect(find.byType(TextFormField), findsOneWidget); // OTP input field
      expect(find.text('Vérifier'), findsOneWidget);
    });

    // Additional tests can be added here for navigation, form validation, etc.
  });
}
