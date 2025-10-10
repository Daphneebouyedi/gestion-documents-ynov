import 'package:flutter/material.dart';
import 'package:flutter_application_1/theme.dart';
import 'package:flutter_application_1/convex_js_interop.dart'; // Import the new interop file
import 'dart:math';
import 'package:flutter_application_1/screens/auth/otp_verification_page.dart'; // Import OTP verification page

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  String? errorMessage;
  bool _isPasswordVisible = false;

  // Function to generate a random 6-digit OTP
  String _generateOtp() {
    Random random = Random();
    return (100000 + random.nextInt(899999)).toString();
  }

  // Function to send OTP via Convex action
  Future<void> _sendOtpEmail(String recipientEmail, String otp) async {
    try {
      await callConvexSendOtpEmail(recipientEmail, otp);
      print('OTP email sent via Convex successfully!');
    } catch (e) {
      print('Error sending OTP email via Convex: $e');
      throw Exception('Failed to send OTP email.');
    }
  }

  void _login() async {
    if (_formKey.currentState!.validate()) {
      final enteredEmail = _emailController.text.trim();
      final enteredPassword = _passwordController.text.trim();

      try {
        final token = await callConvexLogin(enteredEmail, enteredPassword);

        if (token.isNotEmpty) {
          // TODO: Store the token securely (e.g., using shared_preferences)
          print('Received JWT Token: $token');

          // Determine user role (this is a placeholder, you'd get the actual role from your auth system)
          String userRole = enteredEmail.contains('student') ? 'student' : 'parent'; // Example role determination

          // Generate OTP
          String otp = _generateOtp();

          // Send OTP via email
          await _sendOtpEmail(enteredEmail, otp);

          // Navigate to OTP verification page
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => OtpVerificationPage(
                email: enteredEmail,
                otp: otp, // In a real app, you'd pass a reference or ID to retrieve OTP securely
                userRole: userRole,
                authToken: token, // Pass the auth token to OTP verification page
              ),
            ),
          );
        } else {
          setState(() {
            errorMessage = "Token d'authentification manquant";
          });
        }
      } catch (e) {
        setState(() {
          errorMessage = "Erreur de connexion: ${e.toString()}";
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {

    return Stack(
      children: [
        Positioned.fill(
          child: Image.asset(
            'assets/Etudiants.png', // Your background image
            fit: BoxFit.cover,
          ),
        ),
        Scaffold(
          backgroundColor: Colors.transparent, // Make Scaffold background transparent
          body: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24), // Moved padding here
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 100), // Added to push content down
                    Center(
                      child: Text(
                        "Connexion",
                        style: TextStyle(
                          color: whiteColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 32, // Increased font size for prominence
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                    const SizedBox(height: 40), // Spacing after title
                    Text(
                      "Adresse email",
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: whiteColor), // Changed text color
                    ),
                    const SizedBox(height: 6),
                    TextFormField(
                      controller: _emailController,
                      style: TextStyle(color: whiteColor), // Text color white
                      decoration: InputDecoration(
                        hintText: "Votre adresse email",
                        filled: true,
                        fillColor: blackColor.withOpacity(0.4), // Darkened transparent black
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding:
                            const EdgeInsets.symmetric(horizontal: 14, vertical: 16),
                      ),
                      validator: (value) => (value == null || value.isEmpty)
                          ? "Veuillez entrer votre adresse email"
                          : null,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      "Mot de passe",
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: whiteColor), // Changed text color
                    ),
                    const SizedBox(height: 6),
                    TextFormField(
                      controller: _passwordController,
                      obscureText: !_isPasswordVisible,
                      style: TextStyle(color: whiteColor), // Text color white
                      decoration: InputDecoration(
                        hintText: "Mot de Passe",
                        filled: true,
                        fillColor: blackColor.withOpacity(0.4), // Darkened transparent black
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding:
                            const EdgeInsets.symmetric(horizontal: 14, vertical: 16),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _isPasswordVisible ? Icons.visibility_off : Icons.visibility,
                            color: whiteColor,
                          ),
                          onPressed: () {
                            setState(() {
                              _isPasswordVisible = !_isPasswordVisible;
                            });
                          },
                        ),
                      ),
                      validator: (value) => (value == null || value.isEmpty)
                          ? "Veuillez entrer votre mot de passe"
                          : null,
                    ),
                    const SizedBox(height: 8),
                    Align(
                      alignment: Alignment.centerRight,
                      child: Text(
                        "Mot de passe oublié ?",
                        style: TextStyle(fontSize: 13, color: whiteColor), // Changed text color
                      ),
                    ),
                    if (errorMessage != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 12),
                        child: Text(
                          errorMessage!,
                          style: const TextStyle(color: errorColor),
                        ),
                      ),
                    const SizedBox(height: 22),
                    SizedBox(
                      width: double.infinity,
                      height: 44,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: whiteColor, // Changed to whiteColor
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        onPressed: _login,
                        child: const Text(
                          "Se connecter",
                          style: TextStyle(fontSize: 18, color: blackColor), // Changed to blackColor
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
