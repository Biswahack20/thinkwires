import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplyModal from '../common/ApplyModal';

const HERO_SLIDES = [
  {
    id: 'sap-core',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA5nGnSn6TrjHRXk6Yrr1hngBL_Ptdje8dtE8juA2qY036lQqvHvN6avSAYmFKXi3Ws1s1GOGxDg1UJxSBPj1bormKO3GX6ikbORRKq0xiEnRjFfHJo92S4rMz1pkRIj6a5ttei2dUbSMuy8XDy119wvMZL2XWo1xcVcwOq7iaR0aXLZuhNnMM_WFqdq-qjIFA2YtN4dBM2z7SYgEFLd9VAlLdP7jvkhrd0JGOiVZuUwZkeI7SvLyKJQA',
    alt: 'Dynamic corporate tech recruiter and female software engineer collaborating in modern illuminated office',
    tag: 'Active Talent Dispatch',
    liveBadgeText: '130+ Hot Roles Active',
    badgeTheme: 'emerald',
    icon: 'terminal',
    title: 'SAP ABAP, AEM & Ledger Architects',
    subtitle: 'Ready for deployment • US & India Timezones',
    metrics: ['98% Match Accuracy', '48h Deployment SLA'],
    deployRole: 'SAP ABAP, AEM & Ledger Architects',
  },
  {
    id: 'cloud-sre',
    image:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
    alt: 'High-performance cloud engineering team and SRE architects managing cloud infrastructure clusters',
    tag: 'Dedicated Engineering Pods',
    liveBadgeText: '64+ Cloud Architects Ready',
    badgeTheme: 'cobalt',
    icon: 'cloud_sync',
    title: 'Principal AWS / Azure & Kubernetes SREs',
    subtitle: 'Multi-Region High Availability • FinTech Tier',
    metrics: ['SOC2 Compliant', 'Top 2% Vetted Talent'],
    deployRole: 'Principal AWS / Azure & Kubernetes SREs',
  },
  {
    id: 'ai-ml',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    alt: 'AI software researchers and machine learning engineers collaborating on production neural architectures',
    tag: 'Next-Gen AI Engineering',
    liveBadgeText: '42+ AI Leads Active',
    badgeTheme: 'emerald',
    icon: 'smart_toy',
    title: 'Generative AI, PyTorch & LLM Engineers',
    subtitle: 'RAG Pipelines & Agentic AI • Rapid Onboarding',
    metrics: ['Production-Proven', 'Silicon Valley & Bangalore Hubs'],
    deployRole: 'Generative AI, PyTorch & LLM Engineers',
  },
  {
    id: 'plm-embedded',
    image:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    alt: 'Enterprise engineering leaders and technical architects planning product lifecycle management roadmap',
    tag: 'Specialized Domain Staffing',
    liveBadgeText: '28+ PLM Leads Vetted',
    badgeTheme: 'cyan',
    icon: 'precision_manufacturing',
    title: 'Siemens Teamcenter & PLM Specialists',
    subtitle: 'Global Automotive & Aerospace CAD Infrastructure',
    metrics: ['12+ Yrs Domain Mastery', 'Turnkey Cross-Border EOR'],
    deployRole: 'Siemens Teamcenter & PLM Specialists',
  },
];

const SLIDE_DURATION = 5000; // 5 seconds

const NewHero = ({ onOpenModal }) => {
  const navigate = useNavigate();
  const [roleInput, setRoleInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [experienceInput, setExperienceInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Hire Top Tech Talent');

  // Slideshow State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlideIndex(index);
  };

  // Auto-play slideshow timer
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const handleOpenModal = (roleTitle) => {
    setSelectedRole(roleTitle || 'Hire Top Tech Talent');
    if (onOpenModal) {
      onOpenModal(roleTitle || 'Hire Top Tech Talent');
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (roleInput.trim()) params.append('search', roleInput.trim());
    if (locationInput) params.append('location', locationInput);
    if (experienceInput) params.append('experience', experienceInput);

    const openingsSection = document.getElementById('openings') || document.getElementById('hot-jobs');
    if (openingsSection) {
      openingsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate({
        pathname: '/jobs',
        search: params.toString() ? `?${params.toString()}` : '',
      });
    }
  };

  const handleExploreJobs = (e) => {
    e.preventDefault();
    const openingsSection = document.getElementById('openings') || document.getElementById('hot-jobs');
    if (openingsSection) {
      openingsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/jobs');
    }
  };

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <>
      <section className="NewHero-heroSection">
        {/* Ambient Glows */}
        <div className="NewHero-glowOrb NewHero-glowPrimary" aria-hidden="true" />
        <div className="NewHero-glowOrb NewHero-glowTeal" aria-hidden="true" />

        <div className="NewHero-container">
          {/* Top Trust Micro-Badge */}
          <div className="NewHero-trustBadge">
            <span className="NewHero-pingWrapper">
              <span className="NewHero-pingCircle" />
              <span className="NewHero-pingDot" />
            </span>
            <span className="NewHero-badgeTitle">BORDERLESS TALENT ENGINE</span>
            <span className="NewHero-badgeDivider">•</span>
            <span className="NewHero-badgeSubtitle">India • USA • Canada Tech Corridors</span>
          </div>

          {/* Main 2-Column Hero Grid */}
          <div className="NewHero-mainGrid">
            {/* Left Content Column */}
            <div className="NewHero-contentCol">
              <h1 className="NewHero-headline">
                Your Trusted Partner For{' '}
                <span className="NewHero-gradientText">High-Quality IT Recruitment</span> &amp; Talent
                Augmentation
              </h1>

              <p className="NewHero-description">
                Connecting enterprise engineering leaders with high-caliber technical specialists, SAP
                functional consultants, Cloud architects, and mission-critical tech leads within 48 to 72
                hours.
              </p>

              {/* Dual Action CTAs */}
              <div className="NewHero-actionGroup">
                <button
                  type="button"
                  className="NewHero-btnPrimary"
                  onClick={() => handleOpenModal('Hire Top Tech Talent - Enterprise Inquiry')}
                >
                  <span className="material-symbols-outlined NewHero-btnIcon">person_add</span>
                  <span>Hire Top Tech Talent</span>
                </button>

                <a
                  href="#hot-jobs"
                  className="NewHero-btnSecondary"
                  onClick={handleExploreJobs}
                >
                  <span>Explore Hot Jobs</span>
                  <span className="material-symbols-outlined NewHero-btnIcon">arrow_downward</span>
                </a>
              </div>

              {/* Trust Metrics Bar */}
              <div className="NewHero-trustBar">
                <div className="NewHero-trustItem">
                  <span className="material-symbols-outlined NewHero-trustIcon NewHero-trustIconEmerald">
                    verified
                  </span>
                  <span className="NewHero-trustText">3+ Years Industry Excellence</span>
                </div>

                <div className="NewHero-trustItem">
                  <span className="material-symbols-outlined NewHero-trustIcon NewHero-trustIconCobalt">
                    bolt
                  </span>
                  <span className="NewHero-trustText">48-Hr Fast Match SLA</span>
                </div>

                <div className="NewHero-trustItem">
                  <span className="material-symbols-outlined NewHero-trustIcon NewHero-trustIconPrimary">
                    star
                  </span>
                  <span className="NewHero-trustText">93% Enterprise Retention</span>
                </div>
              </div>
            </div>

            {/* Right Graphic & Telemetry Column (Slideshow Showcase) */}
            <div className="NewHero-visualCol">
              <div
                className="NewHero-imageWrapper"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Slideshow Background Image Layer */}
                <div className="NewHero-slideshowContainer">
                  {HERO_SLIDES.map((slide, idx) => (
                    <div
                      key={slide.id}
                      className={`NewHero-slideItem ${idx === currentSlideIndex ? 'active' : ''}`}
                    >
                      <img
                        className="NewHero-heroImage"
                        src={slide.image}
                        alt={slide.alt}
                      />
                    </div>
                  ))}
                </div>

                <div className="NewHero-imageGradientOverlay" />

                {/* Slideshow Top Navigation Bar */}
                <div className="NewHero-slideshowControls">
                  <div className="NewHero-slideCounter">
                    <span className="NewHero-currentNum">{`0${currentSlideIndex + 1}`}</span>
                    <span className="NewHero-counterSep">/</span>
                    <span className="NewHero-totalNum">{`0${HERO_SLIDES.length}`}</span>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="NewHero-arrowGroup">
                    <button
                      type="button"
                      className="NewHero-navArrowBtn"
                      onClick={prevSlide}
                      title="Previous Slide"
                      aria-label="Previous Slide"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button
                      type="button"
                      className="NewHero-navArrowBtn"
                      onClick={nextSlide}
                      title="Next Slide"
                      aria-label="Next Slide"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Floating Live Dispatch Card with Dynamic Slide Content */}
                <div key={currentSlide.id} className="NewHero-floatingCard NewHero-cardAnimate">
                  <div className="NewHero-floatingHeader">
                    <span className="NewHero-floatingTag">{currentSlide.tag}</span>
                    <span className={`NewHero-floatingLiveBadge NewHero-badge-${currentSlide.badgeTheme}`}>
                      <span className="NewHero-floatingPulseDot" />
                      {currentSlide.liveBadgeText}
                    </span>
                  </div>

                  <div className="NewHero-floatingBody">
                    <div className="NewHero-floatingIconSquircle">
                      <span className="material-symbols-outlined">{currentSlide.icon}</span>
                    </div>
                    <div className="NewHero-floatingText">
                      <p className="NewHero-floatingTitle">{currentSlide.title}</p>
                      <p className="NewHero-floatingSubtitle">{currentSlide.subtitle}</p>
                      <div className="NewHero-floatingPillRow">
                        {currentSlide.metrics.map((m, mIdx) => (
                          <span key={mIdx} className="NewHero-floatingPill">{m}</span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="NewHero-deployBtn"
                      onClick={() => handleOpenModal(currentSlide.deployRole)}
                    >
                      Deploy
                    </button>
                  </div>

                  {/* Slide Indicators & Auto-Timer Progress Bar */}
                  <div className="NewHero-indicatorsContainer">
                    <div className="NewHero-indicatorDots">
                      {HERO_SLIDES.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          className={`NewHero-indicatorDot ${dotIdx === currentSlideIndex ? 'active' : ''}`}
                          onClick={() => goToSlide(dotIdx)}
                          aria-label={`Go to slide ${dotIdx + 1}`}
                        />
                      ))}
                    </div>
                    {!isPaused && (
                      <div className="NewHero-progressBarWrapper">
                        <div key={currentSlideIndex} className="NewHero-progressBarFill" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Integrated Floating Talent Search Bar */}
          <div className="NewHero-searchContainer">
            <form className="NewHero-searchForm" onSubmit={handleSearchSubmit}>
              {/* Keyword / Role Field */}
              <div className="NewHero-searchField NewHero-searchFieldRole">
                <span className="material-symbols-outlined NewHero-searchIcon">search</span>
                <div className="NewHero-inputBlock">
                  <label htmlFor="hero-role-input" className="NewHero-fieldLabel">
                    Role or Skill
                  </label>
                  <input
                    id="hero-role-input"
                    type="text"
                    className="NewHero-fieldInput"
                    placeholder="e.g. SAP ABAP, AEM, Ledger..."
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                  />
                </div>
              </div>

              {/* Location Selector */}
              <div className="NewHero-searchField NewHero-searchFieldLocation">
                <span className="material-symbols-outlined NewHero-searchIcon">location_on</span>
                <div className="NewHero-inputBlock">
                  <label htmlFor="hero-location-select" className="NewHero-fieldLabel">
                    Location
                  </label>
                  <select
                    id="hero-location-select"
                    className="NewHero-fieldSelect"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                  >
                    <option value="">All Locations (India / US / Remote)</option>
                    <option value="bangalore">Bangalore Hub</option>
                    <option value="remote">Remote / Borderless</option>
                    <option value="hyderabad">Hyderabad</option>
                    <option value="chennai">Chennai / Pune</option>
                    <option value="noida">Noida (HQ)</option>
                  </select>
                </div>
              </div>

              {/* Experience Selector */}
              <div className="NewHero-searchField NewHero-searchFieldExp">
                <span className="material-symbols-outlined NewHero-searchIcon">layers</span>
                <div className="NewHero-inputBlock">
                  <label htmlFor="hero-experience-select" className="NewHero-fieldLabel">
                    Experience
                  </label>
                  <select
                    id="hero-experience-select"
                    className="NewHero-fieldSelect"
                    value={experienceInput}
                    onChange={(e) => setExperienceInput(e.target.value)}
                  >
                    <option value="">Any Seniority</option>
                    <option value="3-5">Mid-Senior (3 - 5 Years)</option>
                    <option value="8-12">Lead / Specialist (8 - 12 Years)</option>
                    <option value="15">Staff / Principal Architect (15+ Years)</option>
                  </select>
                </div>
              </div>

              {/* Search Submit Button */}
              <div className="NewHero-searchAction">
                <button type="submit" className="NewHero-searchBtn">
                  <span className="material-symbols-outlined">search</span>
                  <span>Find Matches</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Embedded Apply Modal for direct responsiveness */}
      <ApplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roleTitle={selectedRole}
      />
    </>
  );
};

export default NewHero;
