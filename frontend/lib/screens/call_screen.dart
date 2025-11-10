import 'dart:async';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:provider/provider.dart';
import 'package:frontend/services/gemini_live_service.dart';
import 'package:frontend/providers/auth_provider.dart';

class CallScreen extends StatefulWidget {
  const CallScreen({super.key});

  @override
  _CallScreenState createState() => _CallScreenState();
}

class _CallScreenState extends State<CallScreen> {
  CameraController? _cameraController;
  final FlutterSoundRecorder _recorder = FlutterSoundRecorder();
  late final GeminiLiveService _geminiLiveService;
  bool _isInitialized = false;
  bool _isRecording = false;
  String _transcription = '';
  StreamSubscription? _recorderSubscription;
  final StreamController<List<int>> _audioStreamController = StreamController<List<int>>();

  @override
  void initState() {
    super.initState();
    _geminiLiveService = GeminiLiveService(apiService: context.read<AuthProvider>().authService.apiService);
    _init();

    // Listen to the audio stream and send data to Gemini
    _recorderSubscription = _audioStreamController.stream.listen((buffer) {
      if (_isRecording) {
        _geminiLiveService.sendAudio(buffer);
      }
    });
  }

  Future<void> _init() async {
    await Permission.camera.request();
    await Permission.microphone.request();

    final cameras = await availableCameras();
    _cameraController = CameraController(cameras.first, ResolutionPreset.medium);
    await _cameraController!.initialize();
    await _recorder.openRecorder();
    
    setState(() => _isInitialized = true);
  }

  Future<void> _toggleRecording() async {
    if (_isRecording) {
      await _recorder.stopRecorder();
      _geminiLiveService.disconnect();
      setState(() => _isRecording = false);
    } else {
      final sessionData = await _geminiLiveService.createSession();
      await _geminiLiveService.connect(
        sessionToken: sessionData['session_token']!,
        sessionName: sessionData['session_name'],
        onTranscript: (transcript) {
          setState(() => _transcription += transcript);
        },
      );
      
      await _recorder.startRecorder(
        codec: Codec.pcm16,
        toStream: _audioStreamController.sink,
        sampleRate: 16000,
        numChannels: 1,
      );
      setState(() => _isRecording = true);
    }
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    _recorder.closeRecorder();
    _geminiLiveService.disconnect();
    _recorderSubscription?.cancel();
    _audioStreamController.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Live Scanner')),
      body: _isInitialized
          ? Column(
              children: [
                Expanded(child: CameraPreview(_cameraController!)),
                Text(_transcription, style: const TextStyle(color: Colors.white)),
              ],
            )
          : const Center(child: CircularProgressIndicator()),
      floatingActionButton: FloatingActionButton(
        onPressed: _toggleRecording,
        child: Icon(_isRecording ? Icons.mic_off : Icons.mic),
      ),
    );
  }
}
