import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:frontend/services/auth_service.dart';
import 'package:frontend/models/user.dart';

class AuthProvider with ChangeNotifier {
  AuthProvider({required this.authService}) {
    _loadUser();
  }

  AuthService authService;
  User? _user;
  String? _token;
  bool _isAuthenticated = false;

  User? get user => _user;
  String? get token => _token;
  bool get isAuthenticated => _isAuthenticated;

  void update(AuthService newAuthService) {
    authService = newAuthService;
  }

  Future<void> _loadUser() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
    if (_token != null) {
      authService.apiService.setAuthToken(_token!);
      try {
        final userMap = await authService.getCurrentUser();
        if (userMap != null) {
          _user = User.fromJson(userMap);
          _isAuthenticated = true;
        } else {
          _isAuthenticated = false;
        }
      } catch (e) {
        _isAuthenticated = false;
      }
    }
    notifyListeners();
  }

  Future<void> login(String username, String password) async {
    final result = await authService.login(username: username, password: password);
    _user = User.fromJson(result['user']);
    _token = result['token'];
    _isAuthenticated = true;
    notifyListeners();
  }

  Future<void> register(String username, String password, String role) async {
    await authService.register(username: username, password: password, role: role);
    await login(username, password);
  }

  Future<void> logout() async {
    await authService.logout();
    _user = null;
    _token = null;
    _isAuthenticated = false;
    notifyListeners();
  }
}
