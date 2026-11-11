import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchReports } from '../../store/slices/homeSlice';

const GAP_PX = 24;

const getInitialCardsPerView = () => {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
};

const Reports = () => {
  const dispatch = useDispatch();
  const { reports: reportsData, status } = useSelector((state) => state.home);

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

  const reports = reportsData || [];
  const totalReports = reports.length;
  const maxIndex = Math.max(0, totalReports - cardsPerView);

  // Fetch reports if needed
  useEffect(() => {
    if (status?.reports === 'idle') {
      dispatch(fetchReports());
    }
  }, [dispatch, status?.reports]);

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

  // Touch Swipe handlers
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

  // Exact card width and translation offset calculation
  const cardWidth =
    containerWidth > 0
      ? cardsPerView === 1
        ? containerWidth
        : (containerWidth - (cardsPerView - 1) * GAP_PX) / cardsPerView
      : 0;

  const translateX = -(currentIndex * (cardWidth + GAP_PX));

  // Determine report destination
  const getReportDestination = (report) => {
    if (report.link) return report.link;
    if (report.url) return report.url;
    if (report.slug) return `/blog?article=${report.slug}`;
    if (report.id === 1) return '/blog?article=featured-flagship-1';
    if (report.id === 2) return '/blog?article=card-1';
    if (report.id === 3) return '/blog?article=card-2';
    return `/blog?article=${report.id}`;
  };

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
              to="/blog?category=Talent+Strategy"
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
            {reports.map((report) => {
              const destination = getReportDestination(report);
              const isExternal =
                destination.startsWith('http://') ||
                destination.startsWith('https://');

              return (
                <div
                  key={report.id}
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
                      <div className="Reports-imageContainer relative w-full h-48 overflow-hidden bg-slate-100">
                        <img
                          src={report.image}
                          alt={report.title}
                          className="Reports-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <span className="Reports-tagBadge absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">
                          {report.tag}
                        </span>
                      </div>
                      <div className="Reports-content p-6 flex flex-col flex-1">
                        <time className="Reports-date text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                          {report.date}
                        </time>
                        <h3 className="Reports-cardTitle text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-3 leading-snug line-clamp-2 min-h-[3.5rem]">
                          {report.title}
                        </h3>
                        <p className="Reports-cardDesc text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4 min-h-[4.5rem]">
                          {report.desc}
                        </p>
                      </div>
                    </div>

                    <div className="Reports-footer px-6 pb-6 pt-3 border-t border-slate-100 mt-auto">
                      {isExternal ? (
                        <a
                          href={destination}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="Reports-readLink inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          <span>Read Analysis</span>
                          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                            open_in_new
                          </span>
                        </a>
                      ) : (
                        <Link
                          to={destination}
                          className="Reports-readLink inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          <span>Read Analysis</span>
                          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                            arrow_forward
                          </span>
                        </Link>
                      )}
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
