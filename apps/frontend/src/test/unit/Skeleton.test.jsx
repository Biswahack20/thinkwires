import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Skeleton,
  BlogCardSkeleton,
  FeaturedArticleSkeleton,
  JobCardSkeleton,
  BenchTalentSkeleton,
  TableSkeleton,
} from '../../components/common/Skeleton';
import BlogGrid from '../../components/BlogComponents/BlogGrid';
import BenchCandidateGrid from '../../components/BenchComponents/BenchCandidateGrid';
import { renderWithProviders } from '../test-utils';

describe('Thinkwires Custom Skeleton Loading Suite', () => {
  describe('Skeleton Primitive', () => {
    it('renders with default props (variant="text", animation="wave")', () => {
      const { container } = render(<Skeleton />);
      const skeletonEl = container.querySelector('.tw-skeleton');

      expect(skeletonEl).toBeInTheDocument();
      expect(skeletonEl).toHaveClass('tw-skeleton-text');
      expect(skeletonEl).toHaveClass('tw-skeleton-wave');
      expect(skeletonEl).toHaveAttribute('role', 'status');
      expect(skeletonEl).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders different variants correctly', () => {
      const { rerender, container } = render(<Skeleton variant="circular" />);
      expect(container.querySelector('.tw-skeleton')).toHaveClass('tw-skeleton-circular');

      rerender(<Skeleton variant="rounded" />);
      expect(container.querySelector('.tw-skeleton')).toHaveClass('tw-skeleton-rounded');

      rerender(<Skeleton variant="rectangular" />);
      expect(container.querySelector('.tw-skeleton')).toHaveClass('tw-skeleton-rectangular');
    });

    it('applies custom animations and animation="none"', () => {
      const { rerender, container } = render(<Skeleton animation="pulse" />);
      expect(container.querySelector('.tw-skeleton')).toHaveClass('tw-skeleton-pulse');

      rerender(<Skeleton animation="none" />);
      expect(container.querySelector('.tw-skeleton')).toHaveClass('tw-skeleton-none');
    });

    it('formats numeric and string dimensions properly', () => {
      const { container, rerender } = render(<Skeleton width={120} height={36} />);
      let skeletonEl = container.querySelector('.tw-skeleton');
      expect(skeletonEl).toHaveStyle({ width: '120px', height: '36px' });

      rerender(<Skeleton width="80%" height="2.5rem" />);
      skeletonEl = container.querySelector('.tw-skeleton');
      expect(skeletonEl).toHaveStyle({ width: '80%', height: '2.5rem' });
    });

    it('renders multiple elements when count > 1', () => {
      const { container } = render(<Skeleton count={4} />);
      const skeletons = container.querySelectorAll('.tw-skeleton');
      expect(skeletons).toHaveLength(4);
    });

    it('renders custom HTML element when "as" prop is provided', () => {
      const { container } = render(<Skeleton as="h2" ariaLabel="Loading title..." />);
      const heading = container.querySelector('h2.tw-skeleton');
      expect(heading).toBeInTheDocument();
      expect(screen.getByText('Loading title...')).toBeInTheDocument();
    });
  });

  describe('Preset Layout Skeletons', () => {
    it('renders BlogCardSkeleton with accessible attributes and count', () => {
      const { container, rerender } = render(<BlogCardSkeleton />);
      let articles = container.querySelectorAll('.tw-skeleton-blog-card');
      expect(articles).toHaveLength(1);
      expect(articles[0]).toHaveAttribute('role', 'status');
      expect(articles[0]).toHaveAttribute('aria-busy', 'true');

      rerender(<BlogCardSkeleton count={3} />);
      articles = container.querySelectorAll('.tw-skeleton-blog-card');
      expect(articles).toHaveLength(3);
    });

    it('renders FeaturedArticleSkeleton layout matching flagship paper', () => {
      const { container } = render(<FeaturedArticleSkeleton />);
      const featuredCard = container.querySelector('.tw-skeleton-featured-card');
      expect(featuredCard).toBeInTheDocument();
      expect(featuredCard).toHaveAttribute('role', 'status');
      expect(featuredCard).toHaveAttribute('aria-busy', 'true');
    });

    it('renders JobCardSkeleton matching job mandate layout', () => {
      const { container, rerender } = render(<JobCardSkeleton />);
      let jobCards = container.querySelectorAll('.tw-skeleton-job-card');
      expect(jobCards).toHaveLength(1);
      expect(jobCards[0]).toHaveAttribute('role', 'status');
      expect(jobCards[0]).toHaveAttribute('aria-busy', 'true');

      rerender(<JobCardSkeleton count={2} />);
      jobCards = container.querySelectorAll('.tw-skeleton-job-card');
      expect(jobCards).toHaveLength(2);
    });

    it('renders BenchTalentSkeleton matching candidate card layout', () => {
      const { container, rerender } = render(<BenchTalentSkeleton />);
      let benchCards = container.querySelectorAll('.tw-skeleton-bench-card');
      expect(benchCards).toHaveLength(1);
      expect(benchCards[0]).toHaveAttribute('role', 'status');
      expect(benchCards[0]).toHaveAttribute('aria-busy', 'true');

      rerender(<BenchTalentSkeleton count={4} />);
      benchCards = container.querySelectorAll('.tw-skeleton-bench-card');
      expect(benchCards).toHaveLength(4);
    });

    it('renders TableSkeleton with configurable rows and columns', () => {
      const { container, rerender } = render(
        <TableSkeleton rows={4} columns={3} showHeader={true} />
      );
      expect(container.querySelectorAll('thead th')).toHaveLength(3);
      expect(container.querySelectorAll('tbody tr')).toHaveLength(4);
      expect(container.querySelectorAll('tbody td')).toHaveLength(12);

      rerender(<TableSkeleton rows={2} columns={5} showHeader={false} />);
      expect(container.querySelector('thead')).toBeNull();
      expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
      expect(container.querySelectorAll('tbody td')).toHaveLength(10);
    });
  });

  describe('Integration in Grid Components', () => {
    it('renders BlogCardSkeleton in BlogGrid when isLoading is true', () => {
      const { container } = render(
        <BlogGrid articles={[]} isLoading={true} />
      );
      const skeletons = container.querySelectorAll('.tw-skeleton-blog-card');
      expect(skeletons).toHaveLength(6);
    });

    it('renders BenchTalentSkeleton in BenchCandidateGrid when isLoading is true', () => {
      const { container } = renderWithProviders(
        <BenchCandidateGrid talents={[]} totalCount={0} isLoading={true} />
      );
      const skeletons = container.querySelectorAll('.tw-skeleton-bench-card');
      expect(skeletons).toHaveLength(6);
    });
  });
});

