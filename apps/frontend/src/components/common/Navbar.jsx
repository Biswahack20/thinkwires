
import React, { useState } from 'react';
import logo from '../../assets/logo/logo.png';
import ApplyModal from './ApplyModal';
import { useTheme } from '../../useTheme';

const Navbar = () => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { toggleTheme } = useTheme();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
  };

  return (
    <>
      <header className="Navbar-navbarContainer">
        {/* Top Bar */}
        <div className="Navbar-topBar">
          <div className="Navbar-topBarLeft">
            <div className="Navbar-topBarItem">
              <span aria-hidden="true">🌐</span>
              India &amp; USA / Canada
            </div>

            <div className="Navbar-topBarItem">
              Talent is not bound by Borders
            </div>
          </div>

          <div className="Navbar-topBarRight">
            <a
              href="mailto:info@thinkwires.com"
              className="Navbar-topBarItem"
            >
              <span aria-hidden="true">✉️</span>
              info@thinkwires.com
            </a>

            <a
              href="tel:+918722555828"
              className="Navbar-topBarItem"
            >
              <span aria-hidden="true">📞</span>
              +91 87225 55828
            </a>

            <button
              type="button"
              onClick={toggleTheme}
              className="Navbar-topBarItem Navbar-themeToggle"
              aria-label="Toggle Theme"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path
                  d="M12 2a10 10 0 0 0 0 20V2z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="Navbar-mainNav" aria-label="Main navigation">
          <div className="Navbar-logoContainer">
            <a href="/" onClick={closeMobileMenu} aria-label="ThinkWires Home">
              <img
                src={logo}
                alt="ThinkWires Logo"
                className="Navbar-logo"
              />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="Navbar-mobileMenuToggle"
            aria-label={
              isMobileMenuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls="Navbar-navigationContent"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            )}
          </button>

          {/* Navigation Links and Actions */}
          <div
            id="Navbar-navigationContent"
            className={`Navbar-navigationContent ${
              isMobileMenuOpen ? 'Navbar-mobileMenuOpen' : ''
            }`}
          >
            <ul className="Navbar-navLinks">
              <li>
                <a
                  href="/"
                  className="Navbar-navLink Navbar-active"
                  onClick={closeMobileMenu}
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/about"
                  className="Navbar-navLink"
                  onClick={closeMobileMenu}
                >
                  About Us
                </a>
              </li>

              <li
                className={`Navbar-dropdownContainer ${
                  isServicesOpen ? 'Navbar-servicesOpen' : ''
                }`}
              >
                <div className="Navbar-servicesHeader">
                  <a
                    href="/services"
                    className="Navbar-navLink"
                    onClick={closeMobileMenu}
                  >
                    Services
                  </a>

                  <button
                    type="button"
                    className="Navbar-servicesToggle"
                    aria-label="Toggle services submenu"
                    aria-expanded={isServicesOpen}
                    onClick={() => setIsServicesOpen((open) => !open)}
                  >
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m1 1 5 5 5-5" />
                    </svg>
                  </button>
                </div>

                <div className="Navbar-dropdownMenu">
                  <a
                    href="/services/staff-augmentation"
                    className="Navbar-dropdownItem"
                    onClick={closeMobileMenu}
                  >
                    Staff Augmentation
                  </a>

                  <a
                    href="/services/eor"
                    className="Navbar-dropdownItem"
                    onClick={closeMobileMenu}
                  >
                    Employer of Record (EOR)
                  </a>

                  <a
                    href="/services/permanent-staffing"
                    className="Navbar-dropdownItem"
                    onClick={closeMobileMenu}
                  >
                    Permanent Staffing &amp; Executive Search
                  </a>

                  <a
                    href="/services/payroll"
                    className="Navbar-dropdownItem"
                    onClick={closeMobileMenu}
                  >
                    Payroll Outsourcing
                  </a>
                </div>
              </li>

              <li>
                <a
                  href="/industries"
                  className="Navbar-navLink"
                  onClick={closeMobileMenu}
                >
                  Industries
                </a>
              </li>

              <li>
                <a
                  href="/hot-jobs"
                  className="Navbar-navLink"
                  onClick={closeMobileMenu}
                >
                  Hot Jobs
                </a>
              </li>

              <li>
                <a
                  href="/talent-cloud"
                  className="Navbar-navLink"
                  onClick={closeMobileMenu}
                >
                  Talent Cloud
                </a>
              </li>

              <li>
                <a
                  href="/blog"
                  className="Navbar-navLink"
                  onClick={closeMobileMenu}
                >
                  Blog
                </a>
              </li>

              <li>
                <a
                  href="/contact"
                  className="Navbar-navLink"
                  onClick={closeMobileMenu}
                >
                  Contact Us
                </a>
              </li>
            </ul>

            <div className="Navbar-actionButtons">
              <a
                href="/find-talent"
                className="Navbar-btnPrimary"
                onClick={closeMobileMenu}
              >
                Find Talent
              </a>

              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  setIsApplyModalOpen(true);
                }}
                className="Navbar-btnOutline"
              >
                Quick Apply
              </button>

              <button
                type="button"
                className="Navbar-userIconBtn"
                aria-label="User Profile"
                onClick={closeMobileMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 1 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
              </button>
            </div>
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
