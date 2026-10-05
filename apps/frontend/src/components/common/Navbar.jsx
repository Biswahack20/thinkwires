import React, { useState, useRef } from 'react';
import logo from '../../assets/logo/logo.png';
import ApplyModal from './ApplyModal';
import { useTheme } from '../../useTheme';

const Navbar = () => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const logoRef = useRef(null);

  return (
    <>
      <header className={'Navbar-navbarContainer'}>
        {/* Top Bar */}
        <div className={'Navbar-topBar'}>
          <div className={'Navbar-topBarLeft'}>
            <div className={'Navbar-topBarItem'}>
              <span>🌐</span> India & USA / Canada
            </div>
            <div className={'Navbar-topBarItem'}>
              Talent is not bound by Borders
            </div>
          </div>
          <div className={'Navbar-topBarRight'}>
            <div className={'Navbar-topBarItem'}>
              <span>✉️</span> info@thinkwires.com
            </div>
            <div className={'Navbar-topBarItem'}>
              <span>📞</span> +91 87225 55828
            </div>
            <button 
              onClick={toggleTheme}
              className={'Navbar-topBarItem'}
              aria-label="Toggle Theme"
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'inherit', 
                cursor: 'pointer', 
                padding: '0 0.5rem',
                borderLeft: '1px solid var(--color-outline-variant)',
                marginLeft: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a10 10 0 0 0 0 20V2z" fill="currentColor"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className={'Navbar-mainNav'}>
          <div className={'Navbar-leftNavGroup'}>
            <div className={'Navbar-logoContainer'} ref={logoRef}>
              <a href="/" style={{ display: 'block', position: 'relative' }}>
                <img
                  src={logo}
                  alt="ThinkWires Logo"
                  className={'Navbar-logo'}
                />
              </a>
            </div>

            <ul className={'Navbar-navLinks'}>
              <li>
                <a
                  href="/"
                  className={`${'Navbar-navLink'} ${'Navbar-active'}`}
                >
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className={'Navbar-navLink'}>
                  About Us
                </a>
              </li>
              <li className="Navbar-dropdownContainer">
                <a
                  href="/services"
                  className={'Navbar-navLink'}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Services
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <div className="Navbar-dropdownMenu">
                  <a
                    href="/services/staff-augmentation"
                    className="Navbar-dropdownItem"
                  >
                    Staff Augmentation
                  </a>
                  <a href="/services/eor" className="Navbar-dropdownItem">
                    Employer of Record (EOR)
                  </a>
                  <a
                    href="/services/permanent-staffing"
                    className="Navbar-dropdownItem"
                  >
                    Permanent Staffing &amp; Executive Search
                  </a>
                  <a href="/services/payroll" className="Navbar-dropdownItem">
                    Payroll Outsourcing
                  </a>
                </div>
              </li>
              <li>
                <a href="/industries" className={'Navbar-navLink'}>
                  Industries
                </a>
              </li>
              <li>
                <a href="/hot-jobs" className={'Navbar-navLink'}>
                  Hot Jobs
                </a>
              </li>
              <li>
                <a href="/talent-cloud" className={'Navbar-navLink'}>
                  Talent Cloud
                </a>
              </li>
              <li>
                <a href="/blog" className={'Navbar-navLink'}>
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact" className={'Navbar-navLink'}>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className={'Navbar-actionButtons'}>
            <a href="/find-talent" className={'Navbar-btnPrimary'}>
              Find Talent
            </a>
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className={'Navbar-btnOutline'}
            >
              Quick Apply
            </button>
            <button className={'Navbar-userIconBtn'} aria-label="User Profile">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              </svg>
            </button>
          </div>
        </nav>
      </header>
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        roleTitle="General Engineering Candidate Pool"
      />
    </>
  );
};

export default Navbar;
