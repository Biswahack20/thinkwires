import React from 'react';
import { Link } from 'react-router-dom';

const IconUpload = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const IconShare = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const IconMail = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const IconPhone = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

import logoImg from '../../assets/logo/logo.png';

const Footer = () => {
  return (
    <footer className={'Footer-footer'}>
      <div className={'Footer-container'}>
        <div className={'Footer-topSection'}>
          <div className={'Footer-brandCol'}>
            <div className={'Footer-logo'}>
              <img
                src={logoImg}
                alt="ThinkWires"
                className={'Footer-logoImg'}
              />
            </div>
            <p className={'Footer-brandDesc'}>
              Architecting elite workforce solutions, borderless global
              engineering teams, and hyper-scalable enterprise talent ecosystems
              across North America, India, and emerging tech corridors.
            </p>
            <div className={'Footer-socialLinks'}>
              <a href="#" className={'Footer-socialIcon'}>
                <IconUpload />
              </a>
              <a href="#" className={'Footer-socialIcon'}>
                <IconShare />
              </a>
              <a href="#" className={'Footer-socialIcon'}>
                <IconMail />
              </a>
            </div>
          </div>

          <div>
            <h4 className={'Footer-colTitle'}>CORE SERVICES</h4>
            <ul className={'Footer-linkList'}>
              <li>
                <a href="#" className={'Footer-linkItem'}>
                  Staff Augmentation
                </a>
              </li>
              <li>
                <Link to="/services/eor" className={'Footer-linkItem'}>
                  Employer of Record (EOR)
                </Link>
              </li>
              <li>
                <a href="#" className={'Footer-linkItem'}>
                  Executive Search
                </a>
              </li>
              <li>
                <a href="#" className={'Footer-linkItem'}>
                  Permanent Placement
                </a>
              </li>
              <li>
                <Link to="/services/payroll" className={'Footer-linkItem'}>
                  Payroll Outsourcing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={'Footer-colTitle'}>INDUSTRIES</h4>
            <ul className={'Footer-linkList'}>
              <li>
                <a href="#" className={'Footer-linkItem'}>
                  Information Technology
                </a>
              </li>
              <li>
                <a href="#" className={'Footer-linkItem'}>
                  BFSI &amp; Fintech
                </a>
              </li>
              <li>
                <a href="#" className={'Footer-linkItem'}>
                  Healthcare &amp; Life Sciences
                </a>
              </li>
              <li>
                <a href="#" className={'Footer-linkItem'}>
                  Engineering &amp; Telecom
                </a>
              </li>
              <li>
                <a href="#" className={'Footer-linkItem'}>
                  E-Commerce &amp; Retail
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={'Footer-colTitle'}>CORPORATE OFFICE</h4>
            <div className={'Footer-address'}>
              ThinkWires Global Corp
              <br />
              Plot No 20, Block H-1/A,
              <br />
              Sector 63, Noida, Uttar
              <br />
              Pradesh 201301
            </div>
            <div className={'Footer-contactInfo'}>
              <a href="tel:+918920555826" className={'Footer-contactLink'}>
                <IconPhone /> +91 89205 55826
              </a>
              <a
                href="mailto:info@thinkwires.com"
                className={'Footer-contactLink'}
              >
                <IconMail width="14" height="14" /> info@thinkwires.com
              </a>
            </div>

            <h4 className={'Footer-newsletterTitle'}>
              Talent Advisory Newsletter
            </h4>
            <form className={'Footer-newsletterForm'}>
              <input
                type="email"
                placeholder="Your work email"
                className={'Footer-newsletterInput'}
              />
              <button type="submit" className={'Footer-newsletterBtn'}>
                Join
              </button>
            </form>
          </div>
        </div>

        <div className={'Footer-bottomSection'}>
          <div className={'Footer-copyright'}>
            &copy; 2026 ThinkWires. All rights reserved. Precision Staffing
            &amp; Global Talent Architecture
          </div>
          <div className={'Footer-bottomLinks'}>
            <a href="#" className={'Footer-bottomLink'}>
              Privacy Policy
            </a>
            <a href="#" className={'Footer-bottomLink'}>
              Terms of Service
            </a>
            <a href="#" className={'Footer-bottomLink'}>
              Security &amp; Compliance
            </a>
            <a href="#" className={'Footer-bottomLink'}>
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
