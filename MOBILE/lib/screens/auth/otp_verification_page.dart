import 'package:flutter/material.dart';
import 'package:flutter_application_1/theme.dart';
import 'package:flutter_application_1/convex_js_interop.dart'; // Import convex interop
import 'package:flutter_application_1/screens/auth/student_home_page.dart';
import 'package:flutter_application_1/screens/auth/home_page.dart';

class OtpVerificationPage extends StatefulWidget {
  final String email;
  final String otp; // For demonstration, passing OTP directly. In real app, this would be handled securely.
  final String userRole; // To determine redirection after successful OTP verification
  final String authToken; // New: Auth token received after login

  const OtpVerificationPage({
    Key? key,
    required this.email,
    required this.otp,
    required this.userRole,
    required this.authToken,
  }) : super(key: key);

  @override
  State<OtpVerificationPage> createState() => _OtpVerificationPageState();
}

class _OtpVerificationPageState extends State<OtpVerificationPage> {
  final _otpController = TextEditingController();
  String? errorMessage;

  void _verifyOtp() async {
    if (_otpController.text == widget.otp) {
      try {
        final userProfile = await callConvexGetUserProfile(widget.authToken);
        // OTP is correct, navigate to appropriate home screen with user profile
        if (widget.userRole == 'student') {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => StudentHomePage(
                userProfile: userProfile,
              ),
            ),
          );
        } else if (widget.userRole == 'parent') {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => HomePage(
                userProfile: userProfile,
              ),
            ),
          );
        } else {
          // Handle unknown role or default to a generic home
          Navigator.pushReplacementNamed(context, '/');
        }
      } catch (e) {
        setState(() {
          errorMessage = "Erreur lors de la récupération du profil utilisateur: ${e.toString()}";
        });
      }
    } else {
      setState(() {
        errorMessage = "Code OTP incorrect. Veuillez réessayer.";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: Image.asset(
            'assets/Etudiants.png', // Background image
            fit: BoxFit.cover,
          ),
        ),
        Scaffold(
          backgroundColor: Colors.transparent, // Make Scaffold background transparent
          body: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Icon(
                    Icons.lock_outline,
                    size: 64,
                    color: whiteColor,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    "Vérification OTP",
                    style: TextStyle(
                      color: whiteColor,
                      fontWeight: FontWeight.bold,
                      fontSize: 28,
                      letterSpacing: 1,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    "Un code a été envoyé à votre adresse e-mail.",
                    style: TextStyle(
                      color: whiteColor.withOpacity(0.9),
                      fontSize: 16,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 32),
                  TextFormField(
                    controller: _otpController,
                    keyboardType: TextInputType.number,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: whiteColor, fontSize: 24),
                    decoration: InputDecoration(
                      hintText: "Code OTP",
                      hintStyle: TextStyle(color: whiteColor.withOpacity(0.5)),
                      filled: true,
                      fillColor: blackColor.withOpacity(0.4),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(vertical: 16),
                      prefixIcon: Icon(
                        Icons.lock,
                        color: whiteColor,
                      ),
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
                  const SizedBox(height: 32),
                  SizedBox(
                    width: double.infinity,
                    height: 44,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: whiteColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onPressed: _verifyOtp,
                      child: const Text(
                        "Vérifier",
                        style: TextStyle(fontSize: 18, color: blackColor),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextButton(
                    onPressed: () {
                      // TODO: Implement OTP resend logic
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Fonctionnalité de renvoi OTP non implémentée.")),
                      );
                    },
                    child: const Text(
                      "Renvoyer le code",
                      style: TextStyle(color: whiteColor, fontSize: 16),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
