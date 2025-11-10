import 'package:frontend/services/api_service.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'dart:convert';

class GeminiLiveService {
  final String? authToken;
  final ApiService _apiService = ApiService();
  WebSocketChannel? _channel;

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

  void connect(Function(String) onMessageReceived) {
    // The Gemini Live API URL will be provided by Google
    // This is a placeholder URL
    final uri = Uri.parse('wss://your-gemini-live-api-endpoint.googleapis.com');
    _channel = WebSocketChannel.connect(uri);

    _channel!.stream.listen((message) {
      final decodedMessage = jsonDecode(message);
      // Assuming the transcription is in a 'text' field
      onMessageReceived(decodedMessage['text'] ?? '');
    });
  }

  void sendAudio(List<int> audioData) {
    _channel?.sink.add(audioData);
  }

  void close() {
    _channel?.sink.close();
  }
}
