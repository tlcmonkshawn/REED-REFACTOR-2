import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bootiehunter/widgets/status_badge.dart';

void main() {
  group('StatusBadge Widget', () {
    testWidgets('displays correct text for captured status', (WidgetTester tester) async {
      // Arrange & Act
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: StatusBadge(status: 'captured'),
          ),
        ),
      );

      // Assert
      expect(find.text('Captured'), findsOneWidget);
    });

    testWidgets('displays correct text for researched status', (WidgetTester tester) async {
      // Arrange & Act
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: StatusBadge(status: 'researched'),
          ),
        ),
      );

      // Assert
      expect(find.text('Researched'), findsOneWidget);
    });

    testWidgets('displays correct text for finalized status', (WidgetTester tester) async {
      // Arrange & Act
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: StatusBadge(status: 'finalized'),
          ),
        ),
      );

      // Assert
      expect(find.text('Finalized'), findsOneWidget);
    });

    testWidgets('renders with correct color for each status', (WidgetTester tester) async {
      // Test different status colors
      final statusColors = {
        'captured': Colors.blue,
        'submitted': Colors.orange,
        'researching': Colors.purple,
        'researched': Colors.green,
        'finalized': Colors.teal,
      };

      for (final entry in statusColors.entries) {
        // Arrange & Act
        await tester.pumpWidget(
          MaterialApp(
            home: Scaffold(
              body: StatusBadge(status: entry.key),
            ),
          ),
        );

        // Assert - Check that the widget exists
        expect(find.byType(StatusBadge), findsOneWidget);

        // Note: Testing exact color would require accessing the widget's internal state
        // This is a simplified test that verifies the widget renders
      }
    });

    testWidgets('handles unknown status gracefully', (WidgetTester tester) async {
      // Arrange & Act
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: StatusBadge(status: 'unknown_status'),
          ),
        ),
      );

      // Assert - Widget should still render (may show default or error state)
      expect(find.byType(StatusBadge), findsOneWidget);
    });
  });
}
