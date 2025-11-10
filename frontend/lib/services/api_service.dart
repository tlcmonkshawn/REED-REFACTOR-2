import 'package:dio/dio.dart';

class ApiService {
  final Dio _dio = Dio();
  String? _authToken;

  ApiService() {
    _dio.options.baseUrl = 'https://reed-refactor-2.onrender.com/api/v1';
    _dio.options.connectTimeout = const Duration(seconds: 5);
    _dio.options.receiveTimeout = const Duration(seconds: 3);
  }

  void setAuthToken(String token) {
    _authToken = token;
    _dio.options.headers['x-auth-token'] = _authToken;
  }

  void clearAuthToken() {
    _authToken = null;
    _dio.options.headers.remove('x-auth-token');
  }

  Future<Response> get(String path) async {
    return _dio.get(path);
  }

  Future<Response> post(String path, {Map<String, dynamic>? data}) async {
    return _dio.post(path, data: data);
  }
}
