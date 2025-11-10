import 'package:flutter/material.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'package:frontend/services/gemini_live_service.dart';

class CallScreen extends StatefulWidget {
  const CallScreen({super.key});

  @override
  _CallScreenState createState() => _CallScreenState();
}

class _CallScreenState extends State<CallScreen> {
  late final GeminiLiveService _geminiLiveService;
  final RTCVideoRenderer _localRenderer = RTCVideoRenderer();
  final RTCVideoRenderer _remoteRenderer = RTCVideoRenderer();
  bool _inCall = false;

  @override
  void initState() {
    super.initState();
    _geminiLiveService = GeminiLiveService(onAddStream: _onAddStream);
    _initRenderers();
  }

  void _initRenderers() async {
    await _localRenderer.initialize();
    await _remoteRenderer.initialize();
  }

  void _onAddStream(MediaStream stream) {
    _remoteRenderer.srcObject = stream;
    setState(() {});
  }

  void _toggleCall() {
    if (_inCall) {
      _geminiLiveService.dispose();
      _localRenderer.srcObject = null;
      _remoteRenderer.srcObject = null;
    } else {
      _geminiLiveService.start().then((_) {
        _localRenderer.srcObject = _geminiLiveService._localStream;
      });
    }
    setState(() {
      _inCall = !_inCall;
    });
  }

  @override
  void dispose() {
    _localRenderer.dispose();
    _remoteRenderer.dispose();
    _geminiLiveService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Live Scanner')),
      body: Column(
        children: [
          Expanded(
            child: Stack(
              children: [
                RTCVideoView(_localRenderer, mirror: true),
                Positioned(
                  right: 20,
                  top: 20,
                  child: SizedBox(
                    width: 120,
                    height: 160,
                    child: RTCVideoView(_remoteRenderer),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: FloatingActionButton(
              onPressed: _toggleCall,
              child: Icon(_inCall ? Icons.call_end : Icons.call),
            ),
          ),
        ],
      ),
    );
  }
}
