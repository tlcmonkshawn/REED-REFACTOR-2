import 'dart:async';
import 'dart:typed_data'; // Import dart:typed_data
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
  final StreamController<Uint8List> _audioStreamController = StreamController<Uint8List>(); // Use Uint8List
  Timer? _uiUpdateTimer;
  String _bufferedTranscript = '';
  bool _isProcessingAudio = false;

  @override
  void initState() {
    super.initState();
    _geminiLiveService = GeminiLiveService(apiService: context.read<AuthProvider>().authService.apiService);
    _init();

    // Listen to the audio stream and send data to Gemini
    _recorderSubscription = _audioStreamController.stream.listen((buffer) {
      if (_isRecording) {
        _geminiLiveService.sendAudio(buffer);
        if (!_isProcessingAudio) {
          setState(() => _isProcessingAudio = true);
        }
      }
    });

    _uiUpdateTimer = Timer.periodic(const Duration(milliseconds: 500), (timer) {
      if (_bufferedTranscript.isNotEmpty) {
        setState(() {
          _transcription += _bufferedTranscript;
          _bufferedTranscript = '';
          _isProcessingAudio = false;
        });
      } else if (_isProcessingAudio && _isRecording) {
        // If still recording but no new transcript, keep processing indicator
      } else {
        setState(() => _isProcessingAudio = false);
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
          _bufferedTranscript += transcript;
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
    _uiUpdateTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Live Scanner')),
      body: _isInitialized
          ? Column(
              children: [
                Expanded(
                  child: Stack(
                    children: [
                      CameraPreview(_cameraController!),
                      if (_isProcessingAudio)
                        const Positioned.fill(
                          child: Center(
                            child: CircularProgressIndicator(),
                          ),
                        ),
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
