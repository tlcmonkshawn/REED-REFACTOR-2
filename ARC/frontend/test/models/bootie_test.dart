import 'package:flutter_test/flutter_test.dart';
import 'package:bootiehunter/models/bootie.dart';

void main() {
  group('Bootie Model', () {
    test('fromJson creates Bootie instance correctly', () {
      // Arrange
      final json = {
        'id': 1,
        'title': 'Vintage Record Player',
        'description': '1960s turntable in good condition',
        'category': 'electronics',
        'status': 'researched',
        'recommended_bounty': 25.99,
        'final_bounty': null,
        'primary_image_url': 'https://example.com/image.jpg',
        'alternate_image_urls': [],
        'edited_image_urls': [],
        'location': {
          'id': 1,
          'name': 'Downtown Store',
        },
        'created_at': '2025-01-27T12:00:00Z',
        'finalized_at': null,
      };

      // Act
      final bootie = Bootie.fromJson(json);

      // Assert
      expect(bootie.id, 1);
      expect(bootie.title, 'Vintage Record Player');
      expect(bootie.description, '1960s turntable in good condition');
      expect(bootie.category, 'electronics');
      expect(bootie.status, 'researched');
      expect(bootie.recommendedBounty, 25.99);
      expect(bootie.finalBounty, isNull);
      expect(bootie.primaryImageUrl, 'https://example.com/image.jpg');
    });

    test('toJson converts Bootie to JSON correctly', () {
      // Arrange
      final bootie = Bootie(
        id: 1,
        title: 'Test Item',
        description: 'Test description',
        category: 'collectibles',
        status: 'captured',
        recommendedBounty: null,
        finalBounty: null,
        primaryImageUrl: 'https://example.com/image.jpg',
        alternateImageUrls: [],
        editedImageUrls: [],
        locationId: 1,
        userId: 1,
      );

      // Act
      final json = bootie.toJson();

      // Assert
      expect(json['id'], 1);
      expect(json['title'], 'Test Item');
      expect(json['category'], 'collectibles');
      expect(json['status'], 'captured');
    });

    test('handles null values correctly', () {
      // Arrange
      final json = {
        'id': 1,
        'title': 'Test Item',
        'description': null,
        'category': 'other',
        'status': 'captured',
        'recommended_bounty': null,
        'final_bounty': null,
        'primary_image_url': null,
        'alternate_image_urls': null,
        'edited_image_urls': null,
      };

      // Act
      final bootie = Bootie.fromJson(json);

      // Assert
      expect(bootie.description, isNull);
      expect(bootie.recommendedBounty, isNull);
      expect(bootie.primaryImageUrl, isNull);
    });

    test('handles status enum values correctly', () {
      // Arrange
      final statuses = ['captured', 'submitted', 'researching', 'researched', 'finalized'];

      for (final status in statuses) {
        final json = {
          'id': 1,
          'title': 'Test',
          'category': 'other',
          'status': status,
        };

        // Act
        final bootie = Bootie.fromJson(json);

        // Assert
        expect(bootie.status, status);
      }
    });
  });
}
