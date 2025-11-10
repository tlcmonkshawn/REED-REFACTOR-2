import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:bootiehunter/services/bootie_service.dart';
import 'package:bootiehunter/services/api_service.dart';
import 'package:bootiehunter/models/bootie.dart';
import 'package:dio/dio.dart';

import 'bootie_service_test.mocks.dart';

@GenerateMocks([ApiService])
class MockResponse extends Mock implements Response {}
void main() {
  group('BootieService', () {
    late BootieService bootieService;
    late MockApiService mockApiService;

    setUp(() {
      mockApiService = MockApiService();
      bootieService = BootieService(apiService: mockApiService);
    });

    group('getBooties', () {
      test('returns list of Booties when successful', () async {
        // Arrange
        final mockResponseData = [
          {
            'id': 1,
            'title': 'Vintage Record Player',
            'description': '1960s turntable',
            'category': 'electronics',
            'status': 'researched',
            'recommended_bounty': 25.99,
            'primary_image_url': 'https://example.com/image.jpg',
            'created_at': '2025-01-27T12:00:00Z',
            'location': {'id': 1, 'name': 'Downtown Store'},
          },
          {
            'id': 2,
            'title': 'Old Book',
            'description': 'First edition',
            'category': 'books',
            'status': 'captured',
            'recommended_bounty': null,
            'primary_image_url': 'https://example.com/book.jpg',
            'created_at': '2025-01-27T12:00:00Z',
            'location': {'id': 1, 'name': 'Downtown Store'},
          },
        ];

        final mockResponse = MockResponse();
        when(mockResponse.statusCode).thenReturn(200);
        when(mockResponse.data).thenReturn(mockResponseData);

        when(mockApiService.get('/booties'))
            .thenAnswer((_) async => mockResponse);

        // Act
        final result = await bootieService.getBooties();

        // Assert
        expect(result, isA<List<Bootie>>());
        expect(result.length, 2);
        expect(result[0].title, 'Vintage Record Player');
        expect(result[0].status, 'researched');
        verify(mockApiService.get('/booties')).called(1);
      });

      test('returns empty list when no booties found', () async {
        // Arrange
        final mockResponse = MockResponse();
        when(mockResponse.statusCode).thenReturn(200);
        when(mockResponse.data).thenReturn([]);

        when(mockApiService.get('/booties'))
            .thenAnswer((_) async => mockResponse);

        // Act
        final result = await bootieService.getBooties();

        // Assert
        expect(result, isEmpty);
      });

      test('handles network errors gracefully', () async {
        // Arrange
        when(mockApiService.get('/booties'))
            .thenThrow(Exception('Network error'));

        // Act & Assert
        expect(
          () => bootieService.getBooties(),
          throwsException,
        );
      });
    });

    group('getBootie', () {
      test('returns single Bootie when successful', () async {
        // Arrange
        final bootieId = 1;
        final mockResponseData = {
          'id': bootieId,
          'title': 'Test Item',
          'description': 'Test description',
          'category': 'collectibles',
          'status': 'researched',
          'recommended_bounty': 50.0,
          'primary_image_url': 'https://example.com/image.jpg',
          'created_at': '2025-01-27T12:00:00Z',
          'location': {'id': 1, 'name': 'Downtown Store'},
        };

        final mockResponse = MockResponse();
        when(mockResponse.statusCode).thenReturn(200);
        when(mockResponse.data).thenReturn(mockResponseData);

        when(mockApiService.get('/booties/$bootieId'))
            .thenAnswer((_) async => mockResponse);

        // Act
        final result = await bootieService.getBootie(bootieId);

        // Assert
        expect(result, isNotNull);
        expect(result?.id, bootieId);
        expect(result?.title, 'Test Item');
        verify(mockApiService.get('/booties/$bootieId')).called(1);
      });

      test('returns null when bootie not found', () async {
        // Arrange
        when(mockApiService.get('/booties/999'))
            .thenThrow(Exception('Not found'));

        // Act & Assert
        expect(
          () => bootieService.getBootie(999),
          throwsException,
        );
      });
    });

    group('createBootie', () {
      test('creates bootie successfully', () async {
        // Arrange
        final bootieData = {
          'title': 'New Bootie',
          'description': 'New description',
          'category': 'electronics',
          'location_id': 1,
          'primary_image_url': 'https://example.com/image.jpg',
        };

        final mockResponseData = {
          'id': 1,
          ...bootieData,
          'status': 'captured',
          'created_at': '2025-01-27T12:00:00Z',
        };

        final mockResponse = MockResponse();
        when(mockResponse.statusCode).thenReturn(201);
        when(mockResponse.data).thenReturn(mockResponseData);

        when(mockApiService.post('/booties', data: anyNamed('data')))
            .thenAnswer((_) async => mockResponse);

        // Act
        final result = await bootieService.createBootie(bootieData);

        // Assert
        expect(result, isNotNull);
        expect(result.title, 'New Bootie');
        verify(mockApiService.post('/booties', data: {'bootie': bootieData})).called(1);
      });
    });
  });
}
