import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class GeminiLiveService {
  RTCPeerConnection? _peerConnection;
  MediaStream? _localStream;
  final Function(MediaStream) onAddStream;
  late IO.Socket _socket;

  GeminiLiveService({required this.onAddStream}) {
    _socket = IO.io('https://reed-refactor-2.onrender.com', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });
    _connectSocket();
  }

  void _connectSocket() {
    _socket.connect();
    _socket.on('connect', (_) {
      print('socket connected');
    });

    _socket.on('webrtc_offer', (data) async {
      await _peerConnection?.setRemoteDescription(RTCSessionDescription(data['sdp'], data['type']));
      RTCSessionDescription answer = await _peerConnection!.createAnswer();
      await _peerConnection!.setLocalDescription(answer);
      _socket.emit('webrtc_answer', {'sdp': answer.sdp, 'type': answer.type});
    });

    _socket.on('webrtc_answer', (data) {
      _peerConnection?.setRemoteDescription(RTCSessionDescription(data['sdp'], data['type']));
    });

    _socket.on('webrtc_ice_candidate', (data) {
      _peerConnection?.addCandidate(RTCIceCandidate(data['candidate'], data['sdpMid'], data['sdpMLineIndex']));
    });
  }

  Future<void> start() async {
    final Map<String, dynamic> configuration = {
      'iceServers': [
        {'url': 'stun:stun.l.google.com:19302'},
      ]
    };
    _peerConnection = await createPeerConnection(configuration);

    _localStream = await navigator.mediaDevices.getUserMedia({
      'audio': true,
      'video': true,
    });

    _localStream!.getTracks().forEach((track) {
      _peerConnection!.addTrack(track, _localStream!);
    });

    _peerConnection!.onIceCandidate = (RTCIceCandidate candidate) {
      _socket.emit('webrtc_ice_candidate', {
        'candidate': candidate.candidate,
        'sdpMid': candidate.sdpMid,
        'sdpMLineIndex': candidate.sdpMLineIndex,
      });
    };

    _peerConnection!.onTrack = (RTCTrackEvent event) {
      if (event.streams.isNotEmpty) {
        onAddStream(event.streams[0]);
      }
    };

    RTCSessionDescription offer = await _peerConnection!.createOffer();
    await _peerConnection!.setLocalDescription(offer);
    _socket.emit('webrtc_offer', {'sdp': offer.sdp, 'type': offer.type});
  }

  void dispose() {
    _socket.disconnect();
    _peerConnection?.close();
    _localStream?.dispose();
  }
}
