import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:frontend/services/gemini_live_service.dart';
import 'package:provider/provider.dart';
import 'package:frontend/providers/auth_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:flutter_sound/flutter_sound.dart';

class CallScreen extends StatefulWidget {
  const CallScreen({super.key});

  @override
  _CallScreenState createState() => _CallScreenState();
}

class _CallScreenState extends State<CallScreen> {
  CameraController? _cameraController;
  late GeminiLiveService _geminiLiveService;
  bool _isCameraInitialized = false;
  bool _isRecording = false;
  final FlutterSoundRecorder _recorder = FlutterSoundRecorder();
  String _transcription = '';

  @override
  void initState() {
    super.initState();
    _initialize();
  }

  Future<void> _initialize() async {
    await _initializeCamera();
    await _initializeAudio();
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

  Future<void> _initializeAudio() async {
    await _recorder.openRecorder();
  }

  void _toggleRecording() {
    if (_isRecording) {
      _stopRecording();
    } else {
      _startRecording();
    }
  }

  Future<void> _startRecording() async {
    await Permission.microphone.request();
    _geminiLiveService.connect((transcription) {
      setState(() {
        _transcription = transcription;
      });
    });

    await _recorder.startRecorder(
      toStream: _geminiLiveService.sendAudio, // This is conceptual and needs a stream adapter
      codec: Codec.pcm16,
    );

    setState(() {
      _isRecording = true;
    });
  }

  Future<void> _stopRecording() async {
    await _recorder.stopRecorder();
    _geminiLiveService.close();
    setState(() {
      _isRecording = false;
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
            child: Stack(
              children: [
                CameraPreview(_cameraController!),
                Positioned(
                  bottom: 0,
                  left: 0,
                  right: 0,
                  child: Container(
                    padding: const EdgeInsets.all(12.0),
                    color: Colors.black.withOpacity(0.5),
                    child: Text(
                      _transcription,
                      style: const TextStyle(color: Colors.white, fontSize: 16),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: FloatingActionButton(
              onPressed: _toggleRecording,
              child: Icon(_isRecording ? Icons.mic_off : Icons.mic),
            ),
          ),
        ],
      ),
    );
  }
}
