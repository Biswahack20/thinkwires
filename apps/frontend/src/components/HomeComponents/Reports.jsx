import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchReports } from '../../store/slices/homeSlice';

const Reports = () => {
  const dispatch = useDispatch();
  const { reports: reportsData, status } = useSelector((state) => state.home);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (status.reports === 'idle') {
      dispatch(fetchReports());
    }
  }, [dispatch, status.reports]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalReports = reportsData?.length || 0;
  const maxIndex = Math.max(0, totalReports - cardsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  useEffect(() => {
    if (isPaused || totalReports <= cardsPerView) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, totalReports, cardsPerView, maxIndex]);

  return (
    <section
      className="Reports-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="Reports-container">
        <div className="Reports-header">
          <div className="Reports-headerLeft">
            <span className="Reports-tag">TALENT ADVISORY INSIGHTS</span>
            <h2 className="Reports-title">
              Our Latest Tech &amp; Market Reports
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-1.5 mr-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous report"
                className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_left
                </span>
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next report"
                className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </button>
            </div>

            <Link to="/blog" className="Reports-browseLink group">
              <span>Browse All Articles</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>

        {/* Carousel Slider Viewport */}
        <div
          className="Reports-sliderWrapper overflow-hidden relative select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            className="flex gap-6"
            animate={{
              x: `calc(-${currentIndex} * (100% / ${cardsPerView} + ${24 / cardsPerView}px - 24px / ${cardsPerView}))`,
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 30,
            }}
            style={{ display: 'flex' }}
          >
            {reportsData.map((report) => (
              <div
                key={report.id}
                className="Reports-slide flex-shrink-0 flex"
                style={{
                  width:
                    cardsPerView === 1
                      ? '100%'
                      : cardsPerView === 2
                      ? 'calc((100% - 24px) / 2)'
                      : 'calc((100% - 48px) / 3)',
                }}
              >
                <div className="Reports-card group w-full h-full flex flex-col justify-between bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col flex-1">
                    <div className="Reports-imageContainer relative w-full h-48 overflow-hidden bg-slate-100">
                      <img
                        src={report.image}
                        alt={report.title}
                        className="Reports-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="Reports-tagBadge absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">
                        {report.tag}
                      </span>
                    </div>
                    <div className="Reports-content p-6 flex flex-col flex-1">
                      <span className="Reports-date text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                        {report.date}
                      </span>
                      <h3 className="Reports-cardTitle text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-3 leading-snug line-clamp-2 min-h-[3.5rem]">
                        {report.title}
                      </h3>
                      <p className="Reports-cardDesc text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4 min-h-[4.5rem]">
                        {report.desc}
                      </p>
                    </div>
                  </div>

                  <div className="Reports-footer px-6 pb-6 pt-3 border-t border-slate-100 mt-auto">
                    <Link to="/blog" className="Reports-readLink inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
                      <span>Read Analysis</span>
                      <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pagination Dots */}
        {maxIndex > 0 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Go to reports group ${dotIdx + 1}`}
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
