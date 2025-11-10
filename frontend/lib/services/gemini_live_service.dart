import 'package:frontend/services/api_service.dart';

class GeminiLiveService {
  final String? authToken;
  final ApiService _apiService = ApiService();

  GeminiLiveService({this.authToken});

  Future<String?> getSessionToken() async {
    if (authToken == null) {
      throw Exception('Auth token not provided');
    }
    _apiService.setAuthToken(authToken!);
    final response = await _apiService.post('/gemini/session-token');

    if (response.statusCode == 200) {
      // Assuming the backend will eventually return a session token
      // return response.data['sessionToken'];
      print(response.data['msg']);
      return "simulated-token"; // Placeholder
    } else {
      throw Exception('Failed to get session token');
    }
  }

  // WebSocket connection logic will be added here
}
