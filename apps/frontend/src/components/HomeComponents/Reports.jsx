import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchArticles,
  fetchFeaturedArticle,
} from '../../store/slices/blogSlice';

const FALLBACK_IMAGES = {
  'card-1':
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  'card-2':
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80',
  'card-3':
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
  'card-4':
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  'card-5':
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
  'card-6':
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
};

const getArticleImage = (art) => {
  if (art.imageUrl) return art.imageUrl;
  if (art.featuredImageUrl) return art.featuredImageUrl;
  if (art.image) return art.image;
  if (FALLBACK_IMAGES[art.id]) return FALLBACK_IMAGES[art.id];
  return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80';
};

const getAuthorInitials = (author) => {
  if (!author) return 'TW';
  if (author.initials) return author.initials;
  if (typeof author === 'string') {
    return author
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
  if (author.name) {
    return author.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
  return 'TW';
};

const Reports = () => {
  const dispatch = useDispatch();
  const {
    articles: blogArticles,
    featuredArticle,
    status: blogStatus,
    error: blogError,
  } = useSelector((state) => state.blog);

  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Combine featured flagship paper and all published blog articles without arbitrary slicing
  const allArticles = useMemo(() => {
    const list = [];
    if (featuredArticle && featuredArticle.id) {
      list.push(featuredArticle);
    }
    if (Array.isArray(blogArticles)) {
      blogArticles.forEach((art) => {
        if (
          !list.some(
            (item) => item.id === art.id || (item.slug && item.slug === art.slug)
          )
        ) {
          list.push(art);
        }
      });
    }
    return list;
  }, [featuredArticle, blogArticles]);

  const totalReports = allArticles.length;

  // Fetch blog data if idle
  useEffect(() => {
    if (blogStatus === 'idle') {
      dispatch(fetchArticles());
      dispatch(fetchFeaturedArticle());
    }
  }, [dispatch, blogStatus]);

  // Listen for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Update navigation button bounds based on scroll position
  const updateScrollBounds = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);

    const firstCard = el.querySelector('.Reports-slide');
    if (firstCard) {
      const cardStep = firstCard.offsetWidth + 24; // width + gap
      if (cardStep > 0) {
        const idx = Math.round(scrollLeft / cardStep);
        setActiveSlide(Math.max(0, Math.min(idx, totalReports - 1)));
      }
    }
  }, [totalReports]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    updateScrollBounds();
    el.addEventListener('scroll', updateScrollBounds, { passive: true });
    window.addEventListener('resize', updateScrollBounds);

    return () => {
      el.removeEventListener('scroll', updateScrollBounds);
      window.removeEventListener('resize', updateScrollBounds);
    };
  }, [updateScrollBounds, allArticles]);

  // Scroll controls using actual card dimensions and gap
  const getScrollStep = () => {
    const el = trackRef.current;
    if (!el) return 350;
    const firstCard = el.querySelector('.Reports-slide');
    return firstCard ? firstCard.offsetWidth + 24 : el.clientWidth;
  };

  const handlePrev = () => {
    const el = trackRef.current;
    if (!el) return;
    const step = getScrollStep();
    el.scrollBy({
      left: -step,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const handleNext = () => {
    const el = trackRef.current;
    if (!el) return;
    const step = getScrollStep();
    el.scrollBy({
      left: step,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const handleScrollToSlide = (idx) => {
    const el = trackRef.current;
    if (!el) return;
    const step = getScrollStep();
    el.scrollTo({
      left: idx * step,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  // Keyboard navigation on track focus
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Autoplay support with hover & touch pause
  useEffect(() => {
    if (isPaused || prefersReducedMotion || totalReports <= 1) {
      return;
    }
    const timer = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        el.scrollTo({
          left: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      } else {
        const step = getScrollStep();
        el.scrollBy({
          left: step,
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      }
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused, prefersReducedMotion, totalReports]);

  // Deep-link destination for modal reader on Blog page
  const getReportDestination = (article) => {
    if (article.slug) return `/blog?article=${encodeURIComponent(article.slug)}`;
    if (article.id) return `/blog?article=${encodeURIComponent(article.id)}`;
    return `/blog?article=${encodeURIComponent(article.title)}`;
  };

  // 1. Loading state
  if (blogStatus === 'loading' && allArticles.length === 0) {
    return (
      <section
        className="Reports-section"
        aria-labelledby="reports-section-heading"
      >
        <div className="Reports-container">
          <div className="Reports-header">
            <div className="Reports-headerLeft">
              <span className="Reports-tag">TALENT ADVISORY INSIGHTS</span>
              <h2 id="reports-section-heading" className="Reports-title">
                Our Latest Tech &amp; Market Reports
              </h2>
            </div>
          </div>
          <div className="Reports-grid">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="Reports-card animate-pulse">
                <div className="Reports-imageContainer bg-slate-200" />
                <div className="Reports-content space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 rounded w-4/5" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-8 bg-slate-200 rounded w-1/4 mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 2. Error state
  if (blogStatus === 'failed' && allArticles.length === 0) {
    return (
      <section
        className="Reports-section"
        aria-labelledby="reports-section-heading"
      >
        <div className="Reports-container">
          <div className="Reports-header">
            <div className="Reports-headerLeft">
              <span className="Reports-tag">TALENT ADVISORY INSIGHTS</span>
              <h2 id="reports-section-heading" className="Reports-title">
                Our Latest Tech &amp; Market Reports
              </h2>
            </div>
            <Link to="/blog" className="Reports-browseLink group">
              <span>Browse All Reports</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="p-8 text-center bg-white rounded-2xl border border-red-100 shadow-sm">
            <p className="text-sm text-red-600 mb-3">
              Unable to load blog reports: {blogError || 'Network error'}
            </p>
            <button
              type="button"
              onClick={() => {
                dispatch(fetchArticles());
                dispatch(fetchFeaturedArticle());
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 3. Empty state
  if (allArticles.length === 0) {
    return (
      <section
        className="Reports-section"
        aria-labelledby="reports-section-heading"
      >
        <div className="Reports-container">
          <div className="Reports-header">
            <div className="Reports-headerLeft">
              <span className="Reports-tag">TALENT ADVISORY INSIGHTS</span>
              <h2 id="reports-section-heading" className="Reports-title">
                Our Latest Tech &amp; Market Reports
              </h2>
            </div>
            <Link to="/blog" className="Reports-browseLink group">
              <span>Browse All Reports</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No Research Articles Found
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Check back soon for new tech insights and whitepapers.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Visit Blog Directory
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="Reports-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-labelledby="reports-section-heading"
    >
      <div className="Reports-container">
        <div className="Reports-header">
          <div className="Reports-headerLeft">
            <span className="Reports-tag">TALENT ADVISORY INSIGHTS</span>
            <h2 id="reports-section-heading" className="Reports-title">
              Our Latest Tech &amp; Market Reports
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Slider Navigation Arrows */}
            <div className="Reports-navControls">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!canScrollLeft}
                aria-label="Previous reports"
                className="Reports-navBtn"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_left
                </span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!canScrollRight}
                aria-label="Next reports"
                className="Reports-navBtn"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </button>
            </div>

            <Link to="/blog" className="Reports-browseLink group">
              <span>Browse All Reports</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>

        {/* Carousel Viewport with Native Horizontal Scroll & CSS Scroll-Snap */}
        <div
          ref={trackRef}
          className="Reports-carouselTrack"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Talent Advisory Insights Carousel"
          onKeyDown={handleKeyDown}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {allArticles.map((article) => {
            const destination = getReportDestination(article);
            const imageSrc = getArticleImage(article);
            const badgeText =
              article.badge || article.category || article.tag || 'Insights';
            const readTimeText = article.readTime || '8 min read';
            const publishDate =
              article.publishedAt || article.date || 'Aug 2026';
            const subCategoryText =
              article.subCategory || article.category;
            const authorName =
              typeof article.author === 'object'
                ? article.author?.name || 'Thinkwires Advisory Team'
                : article.author || 'Thinkwires Advisory Team';
            const authorAvatar =
              typeof article.author === 'object' ? article.author?.avatar : null;
            const authorInitials = getAuthorInitials(article.author);

            return (
              <div
                key={article.id || article.slug || article.title}
                className="Reports-slide"
              >
                <article className="Reports-card">
                  <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
                    {/* Standardized Card Image Header */}
                    <div className="Reports-imageContainer">
                      <img
                        src={imageSrc}
                        alt={article.title}
                        className="Reports-image"
                        loading="lazy"
                      />
                      <span
                        className="Reports-tagBadge"
                        style={{
                          backgroundColor:
                            article.badgeBg || 'rgba(15, 23, 42, 0.85)',
                          color: article.badgeColor || '#ffffff',
                        }}
                      >
                        {badgeText}
                      </span>
                      {readTimeText && (
                        <span className="Reports-readBadge">
                          <span>⏱</span>
                          <span>{readTimeText}</span>
                        </span>
                      )}
                    </div>

                    {/* Content Area with aligned typography */}
                    <div className="Reports-content">
                      <div className="Reports-metaRow">
                        <span className="Reports-metaDate">{publishDate}</span>
                        {subCategoryText && (
                          <>
                            <span className="Reports-metaDot">•</span>
                            <span className="Reports-metaCategory">
                              {subCategoryText}
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="Reports-cardTitle">
                        {article.title}
                      </h3>

                      <p className="Reports-cardDesc">
                        {article.excerpt || article.summary || article.desc}
                      </p>
                    </div>
                  </div>

                  {/* Aligned footer with author and Read Analysis */}
                  <div className="Reports-footer">
                    <div className="Reports-authorGroup">
                      {authorAvatar ? (
                        <img
                          src={authorAvatar}
                          alt={authorName}
                          className="Reports-authorAvatar"
                          style={{
                            width: 28,
                            height: 28,
                            minWidth: 28,
                            minHeight: 28,
                            maxWidth: 28,
                            maxHeight: 28,
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div className="Reports-authorBubble">
                          {authorInitials}
                        </div>
                      )}
                      <span className="Reports-authorName">
                        {authorName}
                      </span>
                    </div>

                    <Link
                      to={destination}
                      className="Reports-readLink"
                    >
                      <span>Read Analysis</span>
                      <span className="material-symbols-outlined text-[16px]">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        {/* Slide Indicator / Pagination Dots */}
        {totalReports > 1 && (
          <div
            className="Reports-dotsContainer"
            role="tablist"
            aria-label="Carousel pagination"
          >
            {allArticles.map((art, dotIdx) => (
              <button
                key={art.id || dotIdx}
                type="button"
                onClick={() => handleScrollToSlide(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1} of ${totalReports}`}
                aria-current={activeSlide === dotIdx ? 'true' : undefined}
                className={`Reports-dot ${
                  activeSlide === dotIdx ? 'active' : ''
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Reports;
