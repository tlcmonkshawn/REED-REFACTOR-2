import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:frontend/services/api_service.dart';

class GeminiLiveService {
  final ApiService apiService;
  WebSocketChannel? _channel;
  Function(String)? _onTranscript;

  GeminiLiveService({required this.apiService});

  Future<Map<String, dynamic>> createSession() async {
    final response = await apiService.post('/gemini/session');
    if (response.statusCode == 200) {
      return {
        'session_token': response.data['session_token'] as String?,
        'session_name': response.data['session_name'] as String?,
      };
    }
    throw Exception('Failed to create Gemini Live session');
  }

  Future<void> connect({
    required String sessionToken,
    String? sessionName,
    Function(String)? onTranscript,
  }) async {
    _onTranscript = onTranscript;
    String cleanSessionName = sessionName?.replaceFirst('sessions/', '') ?? '';
    final wsUrl = 'wss://generativelanguage.googleapis.com/ws/v1beta/sessions/$cleanSessionName/streamGenerateContent?key=${Uri.encodeComponent(sessionToken)}';
    final uri = Uri.parse(wsUrl);
    _channel = WebSocketChannel.connect(uri);

    _channel!.stream.listen((data) {
      _handleMessage(data);
    });
  }

  void _handleMessage(dynamic data) {
    final message = jsonDecode(data.toString()) as Map<String, dynamic>;
    if (message.containsKey('candidates')) {
      final candidates = message['candidates'] as List<dynamic>?;
      if (candidates != null && candidates.isNotEmpty) {
        final content = candidates[0]['content'] as Map<String, dynamic>;
        final parts = content['parts'] as List<dynamic>?;
        if (parts != null && parts.isNotEmpty) {
          final text = parts[0]['text'] as String?;
          if (text != null && _onTranscript != null) {
            _onTranscript!(text);
          }
        }
      }
    }
  }

  Future<void> sendAudio(List<int> audioData) async {
    if (_channel == null) return;
    final base64Audio = base64Encode(audioData);
    final message = {
      'audio': {'content': base64Audio}
    };
    _channel!.sink.add(jsonEncode(message));
  }

  void disconnect() {
    _channel?.sink.close();
  }
}
