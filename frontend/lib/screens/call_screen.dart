import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:frontend/services/gemini_live_service.dart';
import 'package:provider/provider.dart';
import 'package:frontend/providers/auth_provider.dart';

class CallScreen extends StatefulWidget {
  const CallScreen({super.key});

  @override
  _CallScreenState createState() => _CallScreenState();
}

class _CallScreenState extends State<CallScreen> {
  CameraController? _cameraController;
  late GeminiLiveService _geminiLiveService;
  bool _isCameraInitialized = false;

  @override
  void initState() {
    super.initState();
    _initializeCamera();
    final authToken = context.read<AuthProvider>().token;
    _geminiLiveService = GeminiLiveService(authToken: authToken);
  }

  Future<void> _initializeCamera() async {
    final cameras = await availableCameras();
    final firstCamera = cameras.first;
    _cameraController = CameraController(firstCamera, ResolutionPreset.medium);
    await _cameraController!.initialize();
    if (!mounted) return;
    setState(() {
      _isCameraInitialized = true;
    });
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_isCameraInitialized) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    return Scaffold(
      appBar: AppBar(title: const Text('Live Scanner')),
      body: Column(
        children: [
          Expanded(
            child: CameraPreview(_cameraController!),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: ElevatedButton(
              onPressed: () {
                // Start/Stop logic for Gemini Live connection
              },
              child: const Text('Start Session'),
            ),
          ),
        ],
      ),
    );
  }
}
