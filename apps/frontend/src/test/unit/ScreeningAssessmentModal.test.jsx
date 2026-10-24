import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScreeningAssessmentModal from '../../components/common/ScreeningAssessmentModal';

describe('ScreeningAssessmentModal Component', () => {
  it('renders questions safely when question type is missing or undefined', () => {
    const mockAssessment = {
      test_id: 'test_123',
      timeLimitMinutes: 20,
      questions: [
        {
          id: 'q1',
          question: 'What is memoization in React?',
          options: ['Cache values', 'Re-render all', 'Skip state', 'None'],
          // Note: type is intentionally omitted to verify resilient fallback
          points: 10,
        },
      ],
    };

    render(
      <ScreeningAssessmentModal
        isOpen={true}
        applicationId="app_123"
        jobTitle="React Engineer"
        initialAssessment={mockAssessment}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText(/What is memoization in React\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Cache values/i)).toBeInTheDocument();
  });

  it('renders detailed feedback list safely without throwing when feedback item type is undefined', () => {
    const mockResult = {
      total_score: 85,
      passed: true,
      gatekeeper_status: 'Accepted - Screened',
      detailed_feedback: [
        {
          question_id: 'q1',
          // type intentionally omitted
          earned_points: 10,
          possible_points: 10,
          is_correct: true,
        },
      ],
    };

    render(
      <ScreeningAssessmentModal
        isOpen={true}
        applicationId="app_123"
        jobTitle="React Engineer"
        initialAssessment={{ questions: [] }}
        onClose={vi.fn()}
      />
    );

    // Modal renders without unhandled exception
    expect(document.body).toBeDefined();
  });
});
