import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

// Mobile-specific service that uses HTTP calls instead of JS interop
class ConvexMobileService {
  static const String _backendUrl = 'https://your-backend-api.com/api'; // Replace with actual backend URL

  static Future<String> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$_backendUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['token'];
      } else {
        throw Exception('Login failed: ${response.statusCode}');
      }
    } catch (e) {
      print("Mobile login error: $e");
      rethrow;
    }
  }

  static Future<void> sendOtpEmail(String to, String code) async {
    try {
      final response = await http.post(
        Uri.parse('$_backendUrl/auth/send-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'to': to, 'code': code}),
      );

      if (response.statusCode != 200) {
        throw Exception('Send OTP failed: ${response.statusCode}');
      }
    } catch (e) {
      print("Mobile send OTP error: $e");
      rethrow;
    }
  }

  static Future<String> createAttestation(String authToken, Map<String, dynamic> formData) async {
    try {
      final response = await http.post(
        Uri.parse('$_backendUrl/attestations'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
        body: jsonEncode(formData),
      );

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        return data['id'];
      } else {
        throw Exception('Create attestation failed: ${response.statusCode}');
      }
    } catch (e) {
      print("Mobile create attestation error: $e");
      rethrow;
    }
  }

  static Future<Map<String, dynamic>> getUserProfile(String authToken) async {
    try {
      final response = await http.get(
        Uri.parse('$_backendUrl/auth/profile'),
        headers: {'Authorization': 'Bearer $authToken'},
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Get user profile failed: ${response.statusCode}');
      }
    } catch (e) {
      print("Mobile get user profile error: $e");
      rethrow;
    }
  }

  static Future<String> createConventionRequest(String authToken, Map<String, dynamic> formData) async {
    try {
      final response = await http.post(
        Uri.parse('$_backendUrl/conventions'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $authToken',
        },
        body: jsonEncode(formData),
      );

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        return data['id'];
      } else {
        throw Exception('Create convention failed: ${response.statusCode}');
      }
    } catch (e) {
      print("Mobile create convention error: $e");
      rethrow;
    }
  }

  static Future<void> updateUserProfile(String userId, Map<String, dynamic> updatedData) async {
    try {
      final response = await http.put(
        Uri.parse('$_backendUrl/users/$userId/profile'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(updatedData),
      );

      if (response.statusCode != 200) {
        throw Exception('Update user profile failed: ${response.statusCode}');
      }
    } catch (e) {
      print("Mobile update user profile error: $e");
      rethrow;
    }
  }
}
