import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  fetchArticles,
  fetchFeaturedArticle,
} from '../../store/slices/blogSlice';

const GAP_PX = 24;

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

const getInitialCardsPerView = () => {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
};

const Reports = () => {
  const dispatch = useDispatch();
  const {
    articles: blogArticles,
    featuredArticle,
    status: blogStatus,
    error: blogError,
  } = useSelector((state) => state.blog);

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(getInitialCardsPerView);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const touchStartPos = useRef({ x: 0, y: 0 });
  const touchDeltaPos = useRef({ x: 0, y: 0 });
  const timerRef = useRef(null);

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
  const maxIndex = Math.max(0, totalReports - cardsPerView);

  // Fetch blog data if not already initiated
  useEffect(() => {
    if (blogStatus === 'idle') {
      dispatch(fetchArticles());
      dispatch(fetchFeaturedArticle());
    }
  }, [dispatch, blogStatus]);

  // Reduced motion preference listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Responsive layout measurement via ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let animId = null;
    const measure = () => {
      animId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        setContainerWidth(width);

        let perView = 3;
        if (window.innerWidth < 640) {
          perView = 1;
        } else if (window.innerWidth < 1024) {
          perView = 2;
        }
        setCardsPerView(perView);

        // Re-clamp index to valid bounds on resize
        const newMax = Math.max(0, totalReports - perView);
        setCurrentIndex((prev) => Math.min(prev, newMax));
      });
    };

    measure();

    const observer = new ResizeObserver(() => {
      measure();
    });
    observer.observe(el);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [totalReports]);

  // Navigation handlers with strict bounds
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  // Touch Swipe handlers for mobile
  const handleTouchStart = (e) => {
    if (!e.targetTouches || e.targetTouches.length === 0) return;
    touchStartPos.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
    touchDeltaPos.current = { x: 0, y: 0 };
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    if (!e.targetTouches || e.targetTouches.length === 0) return;
    touchDeltaPos.current = {
      x: e.targetTouches[0].clientX - touchStartPos.current.x,
      y: e.targetTouches[0].clientY - touchStartPos.current.y,
    };
  };

  const handleTouchEnd = () => {
    const { x: deltaX, y: deltaY } = touchDeltaPos.current;
    // Require at least 40px swipe and ensure gesture is predominantly horizontal
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartPos.current = { x: 0, y: 0 };
    touchDeltaPos.current = { x: 0, y: 0 };
    setIsPaused(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  };

  // Autoplay timer with pause on hover/touch
  useEffect(() => {
    if (isPaused || prefersReducedMotion || totalReports <= cardsPerView) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 7000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, prefersReducedMotion, totalReports, cardsPerView, maxIndex]);

  // Card width and translation offset calculation
  const cardWidth =
    containerWidth > 0
      ? cardsPerView === 1
        ? containerWidth
        : (containerWidth - (cardsPerView - 1) * GAP_PX) / cardsPerView
      : 0;

  const translateX = -(currentIndex * (cardWidth + GAP_PX));

  // Determine report deep-link destination for modal reader on Blog page
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
            <div className="flex items-center gap-1.5 mr-2">
              <button
                type="button"
                onClick={prevSlide}
                disabled={currentIndex <= 0}
                aria-label="Previous reports"
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all shadow-sm ${
                  currentIndex <= 0
                    ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed opacity-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_left
                </span>
              </button>
              <button
                type="button"
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                aria-label="Next reports"
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all shadow-sm ${
                  currentIndex >= maxIndex
                    ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed opacity-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </button>
            </div>

            <Link
              to="/blog"
              className="Reports-browseLink group"
            >
              <span>Browse All Reports</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>

        {/* Carousel Slider Viewport */}
        <div
          ref={containerRef}
          className="Reports-sliderWrapper overflow-hidden relative select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Talent Advisory Insights Carousel"
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            className="flex"
            style={{
              gap: `${GAP_PX}px`,
            }}
            animate={{
              x: containerWidth > 0 ? translateX : 0,
            }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    type: 'spring',
                    stiffness: 280,
                    damping: 32,
                    mass: 0.8,
                  }
            }
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
                typeof article.author === 'object'
                  ? article.author?.avatar
                  : null;
              const authorInitials = getAuthorInitials(article.author);

              return (
                <div
                  key={article.id || article.slug || article.title}
                  className="Reports-slide flex-shrink-0 flex"
                  style={{
                    width:
                      cardWidth > 0
                        ? `${cardWidth}px`
                        : cardsPerView === 1
                        ? '100%'
                        : cardsPerView === 2
                        ? 'calc((100% - 24px) / 2)'
                        : 'calc((100% - 48px) / 3)',
                  }}
                >
                  <article className="Reports-card group w-full h-full flex flex-col justify-between bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col flex-1">
                      {/* Standardized Card Image Header */}
                      <div className="Reports-imageContainer relative w-full h-48 sm:h-52 overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={imageSrc}
                          alt={article.title}
                          className="Reports-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <span
                          className="Reports-tagBadge absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm"
                          style={{
                            backgroundColor:
                              article.badgeBg || 'rgba(15, 23, 42, 0.85)',
                            color: article.badgeColor || '#ffffff',
                          }}
                        >
                          {badgeText}
                        </span>
                        {readTimeText && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/70 backdrop-blur-sm text-white shadow-sm flex items-center gap-1">
                            <span>⏱</span>
                            <span>{readTimeText}</span>
                          </span>
                        )}
                      </div>

                      {/* Content Area with aligned typography */}
                      <div className="Reports-content p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                          <time className="Reports-date mb-0">{publishDate}</time>
                          {subCategoryText && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-blue-600 font-medium normal-case tracking-normal truncate">
                                {subCategoryText}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="Reports-cardTitle text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-3 leading-snug line-clamp-2 min-h-[3.5rem]">
                          {article.title}
                        </h3>

                        <p className="Reports-cardDesc text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4 min-h-[4.5rem]">
                          {article.excerpt || article.summary || article.desc}
                        </p>
                      </div>
                    </div>

                    {/* Perfectly aligned footer with author and Read Analysis */}
                    <div className="Reports-footer px-6 pb-6 pt-3 border-t border-slate-100 mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {authorAvatar ? (
                          <img
                            src={authorAvatar}
                            alt={authorName}
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {authorInitials}
                          </div>
                        )}
                        <span className="text-xs font-medium text-slate-700 truncate">
                          {authorName}
                        </span>
                      </div>

                      <Link
                        to={destination}
                        className="Reports-readLink inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 flex-shrink-0 ml-auto"
                      >
                        <span>Read Analysis</span>
                        <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </article>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Pagination Dots */}
        {maxIndex > 0 && (
          <div
            className="flex items-center justify-center gap-2 mt-8"
            role="tablist"
            aria-label="Carousel pagination"
          >
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1} of ${maxIndex + 1}`}
                aria-current={currentIndex === dotIdx ? 'true' : undefined}
                className={`h-2 transition-all rounded-full ${
                  currentIndex === dotIdx
                    ? 'w-8 bg-blue-600'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
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
