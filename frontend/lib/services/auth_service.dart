import 'package:shared_preferences/shared_preferences.dart';
import 'package:frontend/services/api_service.dart';

class AuthService {
  final ApiService apiService;

  AuthService({required this.apiService});

  Future<Map<String, dynamic>> register({
    required String username,
    required String password,
    required String role,
  }) async {
    final response = await apiService.post(
      '/auth/register',
      data: {
        'username': username,
        'password': password,
        'role': role,
      },
    );

    if (response.statusCode == 201) {
      return {'success': true};
    }

    throw Exception(response.data['msg'] ?? 'Registration failed');
  }

  Future<Map<String, dynamic>> login({
    required String username,
    required String password,
  }) async {
    final response = await apiService.post(
      '/auth/login',
      data: {
        'username': username,
        'password': password,
      },
    );

    if (response.statusCode == 200) {
      final token = response.data['token'];
      final user = response.data['user'];

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', token);
      apiService.setAuthToken(token);

      return {'success': true, 'user': user, 'token': token};
    }

    throw Exception(response.data['msg'] ?? 'Login failed');
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    apiService.clearAuthToken();
  }

  Future<Map<String, dynamic>?> getCurrentUser() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      if (token == null) return null;

      apiService.setAuthToken(token);
      final response = await apiService.get('/users/me');

      if (response.statusCode == 200) {
        return response.data;
      }

      return null;
    } catch (e) {
      return null;
    }
  }
}
