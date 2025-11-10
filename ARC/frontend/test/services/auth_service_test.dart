import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:bootiehunter/services/auth_service.dart';
import 'package:bootiehunter/services/api_service.dart';
import 'package:dio/dio.dart';

import 'auth_service_test.mocks.dart';

@GenerateMocks([ApiService])
class MockResponse extends Mock implements Response {}
void main() {
  group('AuthService', () {
    late AuthService authService;
    late MockApiService mockApiService;

    setUp(() {
      mockApiService = MockApiService();
      authService = AuthService(apiService: mockApiService);
    });

    group('login', () {
      test('returns success response when login succeeds', () async {
        // Arrange
        final email = 'test@example.com';
        final password = 'password123';
        final mockResponseData = {
          'user': {
            'id': 1,
            'email': email,
            'name': 'Test User',
            'role': 'agent',
            'total_points': 0,
            'total_items_scanned': 0,
          },
          'token': 'test_token_123'
        };

        final mockResponse = MockResponse();
        when(mockResponse.statusCode).thenReturn(200);
        when(mockResponse.data).thenReturn(mockResponseData);

        when(mockApiService.post('/auth/login', data: anyNamed('data')))
            .thenAnswer((_) async => mockResponse);

        // Act
        final result = await authService.login(email: email, password: password);

        // Assert
        expect(result, isNotNull);
        expect(result['success'], true);
        expect(result['user']['email'], email);
        verify(mockApiService.post('/auth/login', data: {'email': email, 'password': password})).called(1);
      });

      test('throws exception when login fails', () async {
        // Arrange
        final mockResponse = MockResponse();
        when(mockResponse.statusCode).thenReturn(401);
        when(mockResponse.data).thenReturn({'error': {'message': 'Invalid credentials'}});

        when(mockApiService.post('/auth/login', data: anyNamed('data')))
            .thenAnswer((_) async => mockResponse);

        // Act & Assert
        expect(
          () => authService.login(email: 'test@example.com', password: 'wrong'),
          throwsException,
        );
      });
    });

    group('register', () {
      test('returns success response when registration succeeds', () async {
        // Arrange
        final mockResponseData = {
          'user': {
            'id': 1,
            'email': 'new@example.com',
            'name': 'New User',
            'role': 'agent',
            'total_points': 0,
            'total_items_scanned': 0,
          },
          'token': 'test_token_123'
        };

        final mockResponse = MockResponse();
        when(mockResponse.statusCode).thenReturn(201);
        when(mockResponse.data).thenReturn(mockResponseData);

        when(mockApiService.post('/auth/register', data: anyNamed('data')))
            .thenAnswer((_) async => mockResponse);

        // Act
        final result = await authService.register(
          email: 'new@example.com',
          password: 'password123',
          name: 'New User',
        );

        // Assert
        expect(result, isNotNull);
        expect(result['success'], true);
        expect(result['user']['email'], 'new@example.com');
        verify(mockApiService.post('/auth/register', data: anyNamed('data'))).called(1);
      });

      test('throws exception when registration fails', () async {
        // Arrange
        final mockResponse = MockResponse();
        when(mockResponse.statusCode).thenReturn(422);
        when(mockResponse.data).thenReturn({'error': {'message': 'Email already taken'}});

        when(mockApiService.post('/auth/register', data: anyNamed('data')))
            .thenAnswer((_) async => mockResponse);

        // Act & Assert
        expect(
          () => authService.register(
            email: 'existing@example.com',
            password: 'password123',
            name: 'User',
          ),
          throwsException,
        );
      });
    });

    group('logout', () {
      test('clears authentication state', () async {
        // Arrange - assuming there's a way to set logged in state
        // This depends on how AuthService is implemented

        // Act
        await authService.logout();

        // Assert
        // Verify that authentication state is cleared
        // This will depend on implementation details
      });
    });
  });
}
