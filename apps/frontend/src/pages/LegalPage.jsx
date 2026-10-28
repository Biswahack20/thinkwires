import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const LegalPage = () => {
  const location = useLocation();

  const getInitialTab = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('terms')) return 'terms';
    if (path.includes('security') || path.includes('compliance'))
      return 'security';
    if (path.includes('cookie')) return 'cookies';
    return 'privacy';
  };

  const [activeTab, setActiveTab] = useState(() => getInitialTab());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  /* ─── style helpers ─── */
  const sectionTitle = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '1rem',
  };

  const subHeading = {
    fontSize: '1.15rem',
    fontWeight: 600,
    color: '#0f172a',
    marginTop: '1.5rem',
    marginBottom: '0.5rem',
  };

  const paragraph = { marginBottom: '1rem' };

  const listStyle = { paddingLeft: '1.5rem', marginBottom: '1.25rem' };

  const tableWrapper = {
    overflowX: 'auto',
    marginBottom: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
    lineHeight: 1.5,
  };

  const thStyle = {
    textAlign: 'left',
    padding: '0.75rem 1rem',
    backgroundColor: '#f1f5f9',
    fontWeight: 600,
    color: '#0f172a',
    borderBottom: '2px solid #e2e8f0',
    whiteSpace: 'nowrap',
  };

  const tdStyle = {
    padding: '0.65rem 1rem',
    borderBottom: '1px solid #f1f5f9',
    verticalAlign: 'top',
  };

  const emailLink = {
    color: '#2563eb',
    textDecoration: 'underline',
  };

  return (
    <div
      className="LegalPage-wrapper"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-surface, #f8fafc)',
      }}
    >
      <Helmet>
        <title>Legal, Privacy & Compliance | Thinkwires</title>
        <meta
          name="description"
          content="Thinkwires privacy policies, terms of service, data security standards, GDPR compliance, and cookie management guidelines."
        />
        <meta
          property="og:title"
          content="Legal & Compliance | Thinkwires"
        />
        <meta
          property="og:description"
          content="Thinkwires privacy policies, terms of service, data security standards, GDPR compliance, and cookie management guidelines."
        />
        <meta property="og:image" content="https://thinkwires.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Legal & Compliance | Thinkwires"
        />
        <meta
          name="twitter:description"
          content="Thinkwires privacy policies, terms of service, data security standards, and GDPR compliance."
        />
        <meta name="twitter:image" content="https://thinkwires.com/og-image.jpg" />
      </Helmet>
      <Navbar />

      <main className="LegalPage-main">
        {/* Header Breadcrumb & Title */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(37, 99, 235, 0.08)',
              color: 'var(--color-primary, #2563eb)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '16px' }}
            >
              verified_user
            </span>
            <span>LEGAL &amp; COMPLIANCE FRAMEWORK</span>
          </div>
          <h1 className="LegalPage-heroTitle">
            Trust, Security &amp; Legal Governance
          </h1>
          <p className="LegalPage-heroDesc">
            Thinkwires Technology Pvt Ltd is committed to protecting your
            personal data and complying with Indian data protection laws,
            including the Information Technology Act, 2000 and the Digital
            Personal Data Protection Act, 2023.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="LegalPage-tabsContainer">
          {[
            { id: 'privacy', label: 'Privacy Policy', icon: 'shield' },
            { id: 'terms', label: 'Terms of Service', icon: 'gavel' },
            { id: 'security', label: 'Security & Compliance', icon: 'lock' },
            { id: 'cookies', label: 'Cookie Settings', icon: 'cookie' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className="LegalPage-tabBtn"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                backgroundColor:
                  activeTab === tab.id
                    ? 'var(--color-primary-container, #1d4ed8)'
                    : '#ffffff',
                color: activeTab === tab.id ? '#ffffff' : '#475569',
                boxShadow:
                  activeTab === tab.id
                    ? '0 4px 12px rgba(29, 78, 216, 0.2)'
                    : '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '18px' }}
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="LegalPage-contentCard">
          {/* ═══════════════════════════════════════════════════════════════
              TAB 1 – PRIVACY POLICY
              ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'privacy' && (
            <div>
              {/* ── Data Privacy Policy ── */}
              <h2 style={sectionTitle}>Data Privacy Policy</h2>

              <h3 style={subHeading}>Introduction</h3>
              <p style={paragraph}>
                <strong>Thinkwires Technology Pvt Ltd</strong> is a company
                incorporated under the laws of India, having its registered
                office at PLOT NO: 20, BLOCK- H-1/A, SECTOR - 63, NOIDA-201301,
                India (hereinafter referred to as{' '}
                <strong>
                  &ldquo;We&rdquo; or &ldquo;Us&rdquo; or &ldquo;Company&rdquo;
                  or &ldquo;THINKWIRES TECHNOLOGY PVT LTD&rdquo;
                </strong>
                ).
              </p>
              <p style={paragraph}>
                In accordance with all applicable laws, THINKWIRES has created
                this Privacy Policy in order to demonstrate THINKWIRES TECHNOLOGY
                PVT LTD&rsquo;s privacy commitment to any individual whose data
                THINKWIRES collects, stores or processes for providing or
                offering its services and products.
              </p>

              <h3 style={subHeading}>Definitions</h3>
              <ul style={listStyle}>
                <li>
                  <strong>Employs:</strong> Any individual or entity which has a
                  contractual relationship with THINKWIRES, where THINKWIRES is
                  the principal and the other individual or entity is the agent
                  &mdash; e.g. employees, vendors, contractors, etc.
                </li>
                <li>
                  <strong>Data Subject:</strong> All individuals whose personal
                  information is either collected, received, processed, stored,
                  dealt or handled by THINKWIRES.
                </li>
                <li>
                  <strong>Information:</strong> Personal Information of a Data
                  Subject collected by THINKWIRES under this Policy, including
                  Sensitive Personal Data or Information as defined under the
                  Indian Information Technology Act, 2000 and the IT Amendment
                  Act 2008.
                </li>
                <li>
                  <strong>Third-Party:</strong> Any individual or entity over
                  which THINKWIRES does not have any control or ownership, and
                  which operates independently on its own.
                </li>
              </ul>

              <h3 style={subHeading}>Governing Law</h3>
              <p style={paragraph}>
                Thinkwires is an organization based and existing in India and is
                thus bound by the laws of the Republic of India. This Privacy
                Policy has been prepared in accordance with applicable Indian
                laws, including the Indian Information Technology Act, 2000 and
                the IT Amendment Act 2008, which have specific data protection
                clauses.
              </p>
              <p style={paragraph}>
                <strong>Section 43A:</strong> Where a body corporate possessing,
                dealing or handling any sensitive personal data or information is
                negligent in implementing and maintaining reasonable security
                practices and procedures and thereby causes wrongful loss or
                wrongful gain to any person, such body corporate shall be liable
                to pay damages by way of compensation to the person so affected.
              </p>
              <p style={paragraph}>
                <strong>Section 72A:</strong> Any person including an
                intermediary who, while providing service under the terms of a
                lawful contract, has secured access to any material containing
                personal information about another person, and discloses it
                without consent or in breach of a lawful contract, shall be
                punished with imprisonment for a term which may extend to three
                years, or with fine which may extend to five lakh rupees, or with
                both.
              </p>

              <h3 style={subHeading}>Applicability</h3>
              <p style={paragraph}>
                This Policy applies to all individuals whose Information is
                either collected, received, processed, stored, dealt or handled
                by <strong>Thinkwires Technology Pvt Ltd.</strong>
              </p>

              <h3 style={subHeading}>How We Collect Data</h3>
              <p style={paragraph}>
                THINKWIRES collects Information about Data Subjects through the
                following means:
              </p>
              <ol style={listStyle}>
                <li>
                  Whenever a Data Subject shows interest or elects to use
                  Thinkwires&rsquo;s services or products, including information
                  about THINKWIRES schemes, irrespective of whether such
                  services/products are provided directly by THINKWIRES or by its
                  Agents on Thinkwires&rsquo;s behalf.
                </li>
                <li>
                  Through Thinkwires&rsquo;s network of Agents and Third Parties
                  which collect such Information and transfer it to THINKWIRES
                  for a business requirement.
                </li>
                <li>
                  When Data Subjects download Thinkwires&rsquo;s mobile
                  applications or visit any of the websites owned by THINKWIRES
                  and/or create an account on the mobile applications or the
                  websites.
                </li>
                <li>
                  When Data Subjects, including employees of THINKWIRES, directly
                  elect to share their Information with THINKWIRES.
                </li>
              </ol>

              <h3 style={subHeading}>
                Why We Collect Data (Purpose)
              </h3>
              <p style={paragraph}>
                THINKWIRES uses the Information to conduct its business and to
                provide Data Subjects with the best possible services/products.
                THINKWIRES will only use the Information based on this Privacy
                Policy, its understanding with the Data Subject, or as required
                by law. Most commonly, THINKWIRES will use the Information in the
                following circumstances:
              </p>
              <ol style={listStyle}>
                <li>
                  To perform the obligations it has promised the Data Subject
                  &mdash; such as providing a service or product, dealing with
                  enquiries and complaints, and improving and customising
                  services/products.
                </li>
                <li>
                  To comply with legal, accounting, business or reporting
                  obligations, including compliance with requests from the
                  Government of India or any Governmental Agency.
                </li>
                <li>
                  To send marketing as well as non-marketing commercial
                  communications to the Data Subject.
                </li>
                <li>
                  To send notifications, statements, invoices and payment
                  reminders, and to collect payments.
                </li>
                <li>
                  To provide Third Parties with statistical information about
                  customers (without identifying any individual from that
                  information).
                </li>
                <li>
                  To keep Thinkwires&rsquo;s website, mobile applications and
                  other systems secure and to prevent fraud.
                </li>
                <li>
                  To promote the mission and objectives of Skill Development in
                  India and/or to provide and disseminate information about
                  relevant programmes.
                </li>
                <li>
                  To manage the employment of the data subject with THINKWIRES.
                </li>
              </ol>

              <h3 style={subHeading}>Information Sharing &amp; Disclosure</h3>
              <p style={paragraph}>
                THINKWIRES may disclose Information to any of its Agents or Third
                Parties insofar as reasonably necessary for the purposes set out
                in this Policy and for the purpose of providing services/products
                to the Data Subject. Such Agents and Third Parties are expected
                to provide a similar level of protection to the Information as is
                adhered to by THINKWIRES.
              </p>
              <p style={paragraph}>
                In addition, THINKWIRES may disclose Information where it is
                required to do so by law or to Governmental Agencies.
              </p>

              <h3 style={subHeading}>
                Transfer of Information Outside India
              </h3>
              <p style={paragraph}>
                Unless stated otherwise, THINKWIRES stores and processes the
                Information in India. There may, however, be occasions when
                THINKWIRES needs to transfer the Information outside India for
                its business requirements. In such instances, THINKWIRES will
                exercise the same level of care in handling the Information as it
                does in India.
              </p>

              <h3 style={subHeading}>Data Security</h3>
              <p style={paragraph}>
                The Information is processed by THINKWIRES in strict accordance
                with the Indian Information Technology Act, 2000 and the IT
                Amendment Act 2008, and the rules notified thereunder.
              </p>

              <h3 style={subHeading}>Data Retention</h3>
              <p style={paragraph}>
                THINKWIRES will only retain the Information for as long as
                necessary to fulfil the purposes it was collected for, including
                for the purposes of satisfying any legal, business, accounting,
                or reporting requirements. In some circumstances, THINKWIRES may
                anonymize the Information so that it can no longer be associated
                with the Data Subject.
              </p>

              <h3 style={subHeading}>
                Who Handles &amp; Retains Your Information
              </h3>
              <p style={paragraph}>
                The primary entity which handles and retains the Information is:
              </p>
              <p style={{ ...paragraph, fontWeight: 600 }}>
                Thinkwires Technology Pvt Ltd
                <br />
                PLOT NO: 20, BLOCK: H-1/A, SECTOR: 63, NOIDA-201301, INDIA
              </p>

              <h3 style={subHeading}>Consent</h3>
              <p style={paragraph}>
                Data Subject agrees that THINKWIRES does not need any additional
                or further consent from him/her to use the Data Subject&rsquo;s
                Information in accordance with this Policy to carry out
                Thinkwires&rsquo;s legal obligations or exercise specific rights.
              </p>

              <h3 style={subHeading}>Withdrawal of Consent</h3>
              <p style={paragraph}>
                Data Subject may at any time revoke or withdraw consent to
                provide Information to THINKWIRES by contacting the Grievance
                Officer. However, such action may render it difficult for
                THINKWIRES to offer some of its services/products any further.
              </p>

              <h3 style={subHeading}>Review of Information</h3>
              <p style={paragraph}>
                Data Subject can contact THINKWIRES through the Grievance
                Officer, requesting access to their Information for reviewing or
                requesting amendment to certain information that the Data Subject
                considers to be incorrect. THINKWIRES shall process such
                requests in accordance with applicable law.
              </p>

              <h3 style={subHeading}>Changes to This Privacy Policy</h3>
              <p style={paragraph}>
                The Policy is subject to modifications from time to time. If
                THINKWIRES decides to change this Policy, THINKWIRES shall
                publish the modified Policy on its website.
              </p>

              {/* ── Divider ── */}
              <hr
                style={{
                  border: 'none',
                  borderTop: '1px solid #e2e8f0',
                  margin: '2.5rem 0',
                }}
              />

              {/* ── Your Personal Data ── */}
              <h2 style={sectionTitle}>Your Personal Data</h2>
              <p style={{ ...paragraph, fontWeight: 600 }}>
                The protection of your personal data is of great importance to
                THINKWIRES. THINKWIRES takes all necessary precautions to ensure
                that your personal data is treated securely and in accordance
                with the applicable regulations.
              </p>

              <h3 style={subHeading}>
                Who is the Data Controller of Your Personal Data?
              </h3>
              <p style={paragraph}>
                Your personal data is processed by THINKWIRES in its capacity as
                data controller. THINKWIRES is located at PLOT 20, BLOCK H-1/A,
                SECTOR 63, NOIDA - 201301.
              </p>
              <p style={paragraph}>
                The contact details of its personal data protection officer are:{' '}
                <a href="mailto:hr@thinkwires.com" style={emailLink}>
                  hr@thinkwires.com
                </a>
              </p>

              <h3 style={subHeading}>How Do We Use Your Data?</h3>
              <p style={paragraph}>
                Your data is used by THINKWIRES for the following purposes:
              </p>
              <ul style={listStyle}>
                <li>
                  Answer and process your messages for any questions or requests
                  for information.
                </li>
                <li>
                  Compile statistics relating to the requests received with a
                  view to optimizing website management and analyzing commercial
                  effectiveness.
                </li>
                <li>Guarantee the security of our website.</li>
                <li>
                  Manage the recruitment process when you submit your application
                  on our dedicated websites.
                </li>
              </ul>

              <h3 style={subHeading}>Who Has Access to Your Data?</h3>
              <p style={paragraph}>
                The information we collect is intended for use by the
                Communications Department, which is authorized to allocate
                requests sent via the contact form to the appropriate
                departments. Your applications will be forwarded and processed by
                our recruitment managers.
              </p>

              <h3 style={subHeading}>How Long Will the Data Be Kept?</h3>
              <ul style={listStyle}>
                <li>
                  <strong>Contact section:</strong> For the time it takes to
                  process the request; 2 years for statistics relating to
                  commercial solicitations.
                </li>
                <li>
                  <strong>Applications &amp; recruitment:</strong> 2 years after
                  our last contact with you and 5 years after the end of your
                  employment contract if you are hired.
                </li>
                <li>
                  <strong>Cookies:</strong> Please refer to the Cookie Settings
                  tab for cookie retention periods.
                </li>
              </ul>

              <h3 style={subHeading}>What Are Your Rights?</h3>
              <p style={paragraph}>
                You have the right to access, modify and delete data concerning
                you, the right to limit, to portability and to object for
                legitimate reasons, as well as the right to define directives
                relating to the fate of your data in the event of death. You can
                exercise these rights by sending an email to THINKWIRES&rsquo;s
                Data Protection Officer at:{' '}
                <a href="mailto:hr@thinkwires.com" style={emailLink}>
                  hr@thinkwires.com
                </a>
              </p>

              {/* ── Divider ── */}
              <hr
                style={{
                  border: 'none',
                  borderTop: '1px solid #e2e8f0',
                  margin: '2.5rem 0',
                }}
              />

              {/* ── Data Privacy Information (stakeholder notices) ── */}
              <h2 style={sectionTitle}>Data Privacy Information</h2>
              <p style={paragraph}>
                In accordance with the Data Controller provisions under the DPBI
                and the applicable India law known as the &ldquo;Digital Personal
                Data Protection Act, 2023&rdquo;, THINKWIRES implements the
                processing of personal data with respect to its stakeholders:
                candidates, employees, customers &amp; prospects, and suppliers
                &amp; service providers.
              </p>
              <p style={paragraph}>
                We remind you that you have the right to access, rectify, delete,
                limit, portability, and object to the use of your data, as well
                as the right to determine the fate of your data after your death.
                To exercise these rights or for any information on the processing
                of your personal data, please email{' '}
                <a href="mailto:hr@thinkwires.com" style={emailLink}>
                  hr@thinkwires.com
                </a>
                . You also have the right to file a complaint with the Central
                Information Commission.
              </p>

              <h3 style={subHeading}>
                Information Notice for Candidates
              </h3>
              <p style={paragraph}>
                THINKWIRES processes personal data as part of recruitment
                management &mdash; based on its legitimate interest to consult
                and analyse data you have made public (in particular on LinkedIn)
                in order to assess the possibility of offering you a job, and
                when you have applied directly for a position at THINKWIRES as a
                necessary pre-contractual measure.
              </p>
              <p style={paragraph}>
                Your data is processed by THINKWIRES and its subsidiaries&rsquo;
                recruitment officers and communicated to line managers. It is
                also accessible to our recruitment software publishers to ensure
                IT maintenance and security. The data collected will be kept for{' '}
                <strong>2 years</strong> from our last contact.
              </p>

              <h3 style={subHeading}>
                Information Notice for Employees
              </h3>
              <p style={paragraph}>
                THINKWIRES processes personal data for the purposes of personnel
                administration, payroll, careers, training, work organisation,
                the management of consultants&rsquo; assignments and projects,
                the supply of resources and the provision of IT tools, the
                management of internal and external communications and the
                security of goods and people. Data is kept for up to{' '}
                <strong>5 years</strong> after your departure, except in special
                cases requiring a shorter or longer storage period.
              </p>

              <h3 style={subHeading}>
                Information Notice for Customers &amp; Prospects
              </h3>
              <p style={paragraph}>
                THINKWIRES processes personal data for the purpose of managing
                commercial relations with its customers and prospective
                customers. Data is kept for up to <strong>3 years</strong> from
                our last contact or up to <strong>5 years</strong> from the end
                of our contractual relationship. Data necessary for the
                preparation of accounts are kept for <strong>10 years</strong> in
                accordance with the Commercial Code.
              </p>

              <h3 style={subHeading}>
                Information Notice for Suppliers &amp; Service Providers
              </h3>
              <p style={paragraph}>
                THINKWIRES processes personal data for the purpose of managing
                its suppliers and service providers. Data is kept for up to{' '}
                <strong>5 years</strong> from the end of our contractual
                relationship and <strong>10 years</strong> for accounting data.
              </p>

              {/* ── Grievance Officer ── */}
              <h3 style={subHeading}>Grievance Officer</h3>
              <p style={paragraph}>
                In accordance with the Indian Information Technology Act 2000 and
                the IT Amendment Act 2008, the contact details of the Grievance
                Officer are:
              </p>
              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: '8px',
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1rem',
                }}
              >
                <p style={{ margin: 0, fontWeight: 600, color: '#0f172a' }}>
                  Anju — Data Protection Officer
                </p>
                <p style={{ margin: '0.25rem 0 0 0', color: '#475569' }}>
                  Thinkwires Technology Pvt Ltd
                  <br />
                  PLOT NO: 20, BLOCK: H-1/A, SECTOR: 63, NOIDA-201301, INDIA
                  <br />
                  Email:{' '}
                  <a href="mailto:hr@thinkwires.com" style={emailLink}>
                    hr@thinkwires.com
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB 2 – TERMS OF SERVICE
              ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'terms' && (
            <div>
              <h2 style={sectionTitle}>
                Terms of Service &amp; Anti-Bribery and Anti-Corruption Policy
              </h2>

              <h3 style={subHeading}>1. Objective</h3>
              <p style={paragraph}>
                THINKWIRES TECHNOLOGY PVT LTD is committed to the prevention,
                deterrence and detection of fraud, bribery, and all other corrupt
                business practice. It is the policy of THINKWIRES to conduct all
                of its business activities with honesty, integrity, and the
                highest possible ethical standards and vigorously enforce its
                business practice, wherever it operates throughout the world, of
                not engaging in bribery or corruption.
              </p>

              <h3 style={subHeading}>2. Scope</h3>
              <p style={paragraph}>
                This policy applies to all individuals working for all associates
                and subsidiaries of Thinkwires at all levels and grades,
                including directors and all employees. It also applies to
                contractors/vendors who come into contact during work.
              </p>

              <h3 style={subHeading}>3. Definitions</h3>
              <p style={paragraph}>
                A <strong>bribe</strong> is an inducement, payment, reward or
                advantage offered, promised, or provided to any person in order
                to gain any commercial, contractual, regulatory or personal
                advantage. It is illegal to directly or indirectly offer a bribe
                or receive a bribe. It is also a separate offence to bribe a
                government/public official.
              </p>
              <p style={paragraph}>
                A &ldquo;bribe&rdquo; is defined as anything of value and
                includes, but is not limited to: cash, cash equivalents, gifts,
                inside information, sexual or other favors, corporate hospitality
                or entertainment, offering employment to a relative, payment or
                reimbursement of travel expenses, charitable donation or social
                contribution, political contributions, abuse of function, and can
                pass directly or through a third party.
              </p>
              <p style={paragraph}>
                A &ldquo;government/public official&rdquo; is defined as
                employees and officials, whether elected or appointed, who hold
                any governmental position, including legislative, administrative,
                or judicial positions; a candidate for any governmental position;
                any official or employee of a company wholly or partially
                controlled by a government; or an official in a political party.
              </p>

              <h3 style={subHeading}>4. Gifts &amp; Other Offers</h3>
              <p style={paragraph}>
                Gifts which are acceptable through corporate practices, such as
                hospitality, are acceptable under reasonable circumstances.
              </p>

              <h3 style={subHeading}>5. Not Tolerable</h3>
              <p style={paragraph}>
                Offering a Gift or Services by expecting something in return,
                which is in terms of business relations and other contract
                obligations, is not tolerable.
              </p>

              <h3 style={subHeading}>6. Acceleration Payments</h3>
              <p style={paragraph}>
                Giving payments to local/government authorities to expedite
                routine work is strictly prohibited.
              </p>

              <h3 style={subHeading}>7. Charitable Donations</h3>
              <p style={paragraph}>
                Donations which are authorized by the government authority by way
                of offering any social work.
              </p>

              <h3 style={subHeading}>8. What We Expect</h3>
              <p style={paragraph}>
                We expect all personnel to follow the process as per policy and
                share any information if found in relation to acceptable and
                non-acceptable practices. Please write to us at:{' '}
                <a href="mailto:info@thinkwires.com" style={emailLink}>
                  info@thinkwires.com
                </a>
              </p>
              <p style={paragraph}>
                Any employee who denies or does not follow the policy will be
                subject to fines and may lose their job in very unacceptable
                cases.
              </p>

              <h3 style={subHeading}>9. Protection</h3>
              <p style={paragraph}>
                Under this policy, those who do not accept any bribe or offer
                from anyone and support sharing information about wrongdoers are
                protected. We request you to drop an email and we will keep your
                information confidential. Please email:{' '}
                <a href="mailto:info@thinkwires.com" style={emailLink}>
                  info@thinkwires.com
                </a>
              </p>

              <h3 style={subHeading}>10. Training &amp; Communication</h3>
              <p style={paragraph}>
                This is part of the Induction Program to ensure awareness about
                this policy and understanding of Do&rsquo;s and Don&rsquo;ts.
              </p>

              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: '8px',
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #e2e8f0',
                  marginTop: '1.5rem',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    color: '#64748b',
                  }}
                >
                  <strong>Policy Version:</strong> 1.0 &nbsp;|&nbsp;{' '}
                  <strong>Effective:</strong> 01-01-2026 to 31-12-2026
                  &nbsp;|&nbsp; <strong>Author:</strong> Compliance Team
                  &nbsp;|&nbsp; <strong>Approved By:</strong> Compliance Team
                  Head
                </p>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB 3 – SECURITY & COMPLIANCE
              ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'security' && (
            <div>
              <h2 style={sectionTitle}>
                Information Security Policy
              </h2>

              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: '8px',
                  padding: '1rem 1.25rem',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                  color: '#475569',
                }}
              >
                <strong>Document Owner:</strong> Data Protection Officer
                &nbsp;|&nbsp; <strong>Audience:</strong> Management and
                Employees &nbsp;|&nbsp; <strong>Effective Date:</strong>{' '}
                14-Mar-2026 &nbsp;|&nbsp; <strong>Last Review:</strong>{' '}
                14-Mar-2026
              </div>

              <h3 style={subHeading}>Purpose &amp; Scope</h3>
              <p style={paragraph}>
                This policy establishes the framework for protecting and managing
                Thinkwires information systems as vital organizational assets.
                Its purpose is to ensure the confidentiality, integrity,
                availability, and resilience of information systems across the
                organization. The policy applies to all personnel and third
                parties who access, support, develop, or manage Thinkwires
                information systems.
              </p>
              <p style={paragraph}>
                The objectives of this policy are to:
              </p>
              <ul style={listStyle}>
                <li>
                  Maintain secure, reliable, and uninterrupted information system
                  operations
                </li>
                <li>
                  Preserve the integrity and validity of organizational data
                </li>
                <li>
                  Enable timely and effective recovery from system disruptions or
                  incidents
                </li>
                <li>
                  Protect Thinkwires information, software, and hardware assets
                  from unauthorized access, loss, or damage
                </li>
              </ul>

              <h3 style={subHeading}>
                Risk Assessment &amp; Cloud IT Controls
              </h3>
              <p style={paragraph}>
                Regular risk assessments of Thinkwires information systems
                demonstrate a systematic approach to identifying and addressing
                risks. Cloud IT services are externally provided services
                requiring formal risk assessment prior to procurement. Approval
                by the Data Protection Officer strengthens governance and
                supplier control. This policy demonstrates compliance with ISO
                9001 by applying risk-based thinking to information systems
                management.
              </p>

              <h3 style={subHeading}>
                Access Control &amp; User Management
              </h3>
              <p style={paragraph}>
                System Owners are formally designated and responsible for
                authorizing, reviewing, and managing access to information
                systems. Access control, authentication, authorization, and
                monitoring reduce risks related to unauthorized access, data
                loss, or system misuse. Key controls include:
              </p>
              <ul style={listStyle}>
                <li>
                  Unique user identification and controlled access protect
                  organizational knowledge
                </li>
                <li>
                  Privileged access control and periodic review address risks
                  associated with high-level system access
                </li>
                <li>
                  Third-party and contractor access is controlled, approved, and
                  sponsored by internal personnel
                </li>
                <li>
                  Temporary accounts with defined expiration dates ensure
                  external access is limited
                </li>
                <li>
                  Logging, audit trails, exception reports, and regular access
                  reviews provide evidence of monitoring
                </li>
              </ul>

              <h3 style={subHeading}>
                System Ownership, Backup &amp; Security Control
              </h3>
              <p style={paragraph}>
                Each major information system has a nominated System Owner with
                defined responsibility. Key control areas include:
              </p>
              <ul style={listStyle}>
                <li>
                  <strong>Server &amp; System Backup:</strong> Professionally
                  maintained network storage and backup systems with frequency
                  based on data criticality.
                </li>
                <li>
                  <strong>Recovery:</strong> Tested backups and documented restore
                  procedures ensure controlled recovery.
                </li>
                <li>
                  <strong>Off-Site Storage:</strong> Off-site storage providers
                  must meet defined security and environmental requirements with
                  SLAs and annual site visits.
                </li>
                <li>
                  <strong>Data Retention:</strong> Retention periods, legal
                  requirements, and responsibilities are documented and
                  controlled.
                </li>
                <li>
                  <strong>
                    Business Continuity &amp; Disaster Recovery:
                  </strong>{' '}
                  BC/DR planning addresses risks related to major disruptions
                  with tested plans.
                </li>
                <li>
                  <strong>Physical Security:</strong> Restricted access to secure
                  areas protects infrastructure critical to operations.
                </li>
                <li>
                  <strong>Software Security:</strong> Licensed, supported, and
                  maintained software with testing, change management, version
                  control, and environment segregation.
                </li>
              </ul>

              <h3 style={subHeading}>
                Information Classification, Labelling &amp; Handling
              </h3>
              <p style={paragraph}>
                Information assets are classified into four levels with
                proportional security controls:
              </p>
              <div style={tableWrapper}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Classification</th>
                      <th style={thStyle}>Description</th>
                      <th style={thStyle}>Key Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}>
                        <strong>Public</strong>
                      </td>
                      <td style={tdStyle}>
                        Information approved for public release
                      </td>
                      <td style={tdStyle}>
                        Copyright/trademark compliance, authorized release
                      </td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>
                        <strong>Internal</strong>
                      </td>
                      <td style={tdStyle}>
                        For internal use only, not for external disclosure
                      </td>
                      <td style={tdStyle}>
                        Protected from unintended external disclosure, controlled
                        storage &amp; disposal
                      </td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>
                        <strong>Confidential</strong>
                      </td>
                      <td style={tdStyle}>
                        Contracts, financial data, HR records, system credentials
                      </td>
                      <td style={tdStyle}>
                        Encryption, access approvals, device security, NDAs with
                        third parties
                      </td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>
                        <strong>Restricted</strong>
                      </td>
                      <td style={tdStyle}>
                        Highest risk &mdash; requires strictest controls
                      </td>
                      <td style={tdStyle}>
                        DPO approval &amp; oversight, tightly controlled handling
                        &amp; disposal, legislative compliance
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 style={subHeading}>Device Management</h3>
              <p style={paragraph}>
                End-user devices (workstations, laptops, tablets, smartphones)
                are secured with:
              </p>
              <ul style={listStyle}>
                <li>
                  Anti-virus protection, automated updates, and encryption
                </li>
                <li>
                  Restricted administrative access to minimize configuration and
                  security risks
                </li>
                <li>
                  Controlled software installation and configuration changes
                  through IT support
                </li>
              </ul>
              <p style={paragraph}>
                <strong>Personally Owned Devices (BYOD):</strong> Restrictions
                on storing Internal, Confidential, and Restricted information on
                personally owned devices. Encryption, automatic locking, and
                approval requirements are enforced. Restricted information is
                prohibited from storage on personally owned devices.
              </p>

              <h3 style={subHeading}>
                Security Incident Notification &amp; Reporting
              </h3>
              <p style={paragraph}>
                The Data Protection Officer is designated as the authority
                responsible for incident notification, escalation, and
                decision-making. Key provisions include:
              </p>
              <ul style={listStyle}>
                <li>
                  Immediate notification and containment actions to reduce impact
                </li>
                <li>
                  Authority to disable accounts without notice to protect
                  organizational assets
                </li>
                <li>
                  Incident reports capture data on system involvement, impact,
                  and root causes
                </li>
                <li>
                  Corrective actions and preventive measures aligned with
                  continual improvement requirements
                </li>
                <li>
                  Significant IT risks identified through incidents trigger
                  formal risk assessments
                </li>
              </ul>

              <h3 style={subHeading}>
                Information Security Responsibilities
              </h3>
              <div style={tableWrapper}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Role</th>
                      <th style={thStyle}>Key Responsibilities</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}>
                        <strong>Data Protection Officer (DPO)</strong>
                      </td>
                      <td style={tdStyle}>
                        IT security governance, incident response, external
                        liaison, disciplinary escalation
                      </td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>
                        <strong>Manager: Cyber Security</strong>
                      </td>
                      <td style={tdStyle}>
                        Developing policies/standards, selecting &amp;
                        administering security controls, promoting security
                        awareness
                      </td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>
                        <strong>System Owners</strong>
                      </td>
                      <td style={tdStyle}>
                        Access decisions, data classification, integrity, and
                        continuity planning
                      </td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>
                        <strong>System Administrators</strong>
                      </td>
                      <td style={tdStyle}>
                        Operational procedures, access control, audit trails, and
                        recovery plans
                      </td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>
                        <strong>Directors / Line Managers</strong>
                      </td>
                      <td style={tdStyle}>
                        Policy implementation within their areas, ensuring
                        employee awareness, access approval
                      </td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>
                        <strong>Internal Audit Office</strong>
                      </td>
                      <td style={tdStyle}>
                        Independent assessment of security controls and policy
                        compliance
                      </td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>
                        <strong>Users</strong>
                      </td>
                      <td style={tdStyle}>
                        Understanding and complying with security requirements,
                        password protection, incident reporting
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 style={subHeading}>
                Compliance &mdash; Security Breach Enforcement
              </h3>
              <p style={paragraph}>
                Security breaches are treated as serious offences. Thinkwires
                reserves the authority to examine files, monitor information, and
                take enforcement actions when security is at risk. Information
                Strategy and Technology Services are authorized to confiscate
                equipment, remove content, or disable accounts to protect system
                operations. Security breaches are treated as nonconformities and
                addressed through disciplinary procedures.
              </p>

              <h3 style={subHeading}>
                Information Security Awareness &amp; Induction
              </h3>
              <p style={paragraph}>
                Information security requirements are incorporated into formal
                staff induction. Staff are informed of their responsibilities
                regarding confidentiality, privacy, and acceptable system access
                at the commencement of employment. Regular communication ensures
                continued awareness of obligations. Awareness training reduces
                the risk of unauthorized access, data breaches, and
                non-compliance due to human error.
              </p>

              <div
                style={{
                  background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
                  borderRadius: '8px',
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #e2e8f0',
                  marginTop: '1.5rem',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    color: '#0f172a',
                    fontSize: '0.9375rem',
                  }}
                >
                  ✓ ISO 9001 Compliant
                </p>
                <p
                  style={{
                    margin: '0.35rem 0 0 0',
                    fontSize: '0.875rem',
                    color: '#475569',
                  }}
                >
                  This policy demonstrates conformity with ISO 9001 by applying
                  risk-based thinking, defined ownership and accountability,
                  controlled documented information, and continual improvement
                  mechanisms.
                </p>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB 4 – COOKIE SETTINGS
              ═══════════════════════════════════════════════════════════════ */}
          {activeTab === 'cookies' && (
            <div>
              <h2 style={sectionTitle}>Your Cookies</h2>
              <p style={paragraph}>
                For all processing related to the collection and deposit of
                cookies, THINKWIRES acts as Data Controller in accordance with
                the DPBI and the applicable India regulations on the protection
                of personal data, known as the &ldquo;Digital Personal Data
                Protection Act, 2023&rdquo; law.
              </p>
              <p style={paragraph}>
                This Policy details the different types of cookies, as well as
                their storage periods and purposes. This is in addition to the
                Data Protection Policy applicable to the www.thinkwires.com
                website.
              </p>

              <h3 style={subHeading}>What is a Cookie?</h3>
              <p style={paragraph}>
                Cookies are files sent to and stored on your computer when you
                visit certain web pages. These files make it possible to remember
                your preferences, facilitate your navigation and thus improve
                your experience as a user.
              </p>
              <p style={paragraph}>
                Some cookies require your consent, which you may withdraw at any
                time. Disabling certain cookies could have the effect of reducing
                accessibility to all or part of the Services offered by the
                THINKWIRES website.
              </p>

              <h3 style={subHeading}>How to Manage Cookies?</h3>
              <p style={paragraph}>
                When you log in for the first time, the cookie banner allows you
                to choose your cookie preferences. Several choices are available
                to you:
              </p>
              <ul style={listStyle}>
                <li>
                  You can <strong>accept</strong> the deposit of cookies using
                  the &ldquo;Accept&rdquo; box.
                </li>
                <li>
                  You can <strong>refuse</strong> the deposit of cookies using
                  the &ldquo;Refuse all&rdquo; box.
                </li>
                <li>
                  You can <strong>set your preferences</strong> at any time using
                  the &ldquo;Customize&rdquo; box.
                </li>
              </ul>
              <p style={paragraph}>
                The cookie manager is available at the bottom of every page of
                the THINKWIRES website. You can also configure your browser to
                delete the cookies deposited during your browsing or to limit
                their deposit globally.
              </p>

              <p style={paragraph}>
                For any questions concerning the management of personal data on
                the &ldquo;thinkwires.com&rdquo; website, contact the Data
                Protection Officer electronically:{' '}
                <a href="mailto:hr@thinkwires.com" style={emailLink}>
                  hr@thinkwires.com
                </a>
              </p>

              <h3 style={subHeading}>
                1. Essential Cookies (Necessary for Website Operation)
              </h3>
              <p style={paragraph}>
                These cookies allow you to use the main functionalities of the
                website, to ensure its operation and also to adapt the
                presentation to your terminal (language, operating system, etc.).
                These cookies <strong>do not require your consent</strong> as
                they are strictly necessary for the operation of the website.
              </p>
              <div style={tableWrapper}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Provider</th>
                      <th style={thStyle}>Cookie Name</th>
                      <th style={thStyle}>Category</th>
                      <th style={thStyle}>Function / Purpose</th>
                      <th style={thStyle}>Conservation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}>THINKWIRES</td>
                      <td style={tdStyle}>THINKWIRES</td>
                      <td style={tdStyle}>Functional</td>
                      <td style={tdStyle}>
                        Retain the choice expressed by users on the repository of
                        trackers
                      </td>
                      <td style={tdStyle}>365 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 style={subHeading}>
                2. Analytical &amp; Audience Measurement Cookies
              </h3>
              <p style={paragraph}>
                These cookies are used to evaluate visits to the website and
                analyse marketing statistics.
              </p>
              <div style={tableWrapper}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Provider</th>
                      <th style={thStyle}>Cookie Name</th>
                      <th style={thStyle}>Category</th>
                      <th style={thStyle}>Function / Purpose</th>
                      <th style={thStyle}>Conservation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}>Google Analytics</td>
                      <td style={tdStyle}>_ga</td>
                      <td style={tdStyle}>Measure</td>
                      <td style={tdStyle}>
                        Count the number of visitors to the Thinkwires.com page
                      </td>
                      <td style={tdStyle}>730 days</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>Google Analytics</td>
                      <td style={tdStyle}>_ga_*</td>
                      <td style={tdStyle}>Measure</td>
                      <td style={tdStyle}>
                        Count the number of visitors to the Thinkwires.com page
                      </td>
                      <td style={tdStyle}>730 days</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>Google Tag Manager</td>
                      <td style={tdStyle}>_gcl_au</td>
                      <td style={tdStyle}>Analytics</td>
                      <td style={tdStyle}>
                        Analyze the advertising effectiveness of the website
                      </td>
                      <td style={tdStyle}>3 months</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 style={subHeading}>3. Marketing Cookies</h3>
              <p style={paragraph}>
                To deploy advertising tailored to each user.
              </p>
              <div style={tableWrapper}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Provider</th>
                      <th style={thStyle}>Cookie Name</th>
                      <th style={thStyle}>Category</th>
                      <th style={thStyle}>Function / Purpose</th>
                      <th style={thStyle}>Conservation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}>Google Ads</td>
                      <td style={tdStyle}>Test_cookie*</td>
                      <td style={tdStyle}>Marketing</td>
                      <td style={tdStyle}>
                        Used to check if the user&rsquo;s browser accepts
                        cookies
                      </td>
                      <td style={tdStyle}>15 minutes</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>Google Ads</td>
                      <td style={tdStyle}>IDE</td>
                      <td style={tdStyle}>Marketing</td>
                      <td style={tdStyle}>
                        Google DoubleClick to record and report site user actions
                        after seeing or clicking advertiser ads to measure
                        effectiveness and present targeted ads
                      </td>
                      <td style={tdStyle}>Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 style={subHeading}>4. Third-Party Service Cookies</h3>
              <p style={paragraph}>
                These cookies are placed by third parties for the use of their
                services. In particular, they make it possible to remember the
                pages and sites you have visited.
              </p>
              <div style={tableWrapper}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Provider</th>
                      <th style={thStyle}>Cookie Name</th>
                      <th style={thStyle}>Category</th>
                      <th style={thStyle}>Function / Purpose</th>
                      <th style={thStyle}>Conservation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}>LinkedIn</td>
                      <td style={tdStyle}>bcookie</td>
                      <td style={tdStyle}>Marketing</td>
                      <td style={tdStyle}>Store browser details</td>
                      <td style={tdStyle}>Session</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>LinkedIn</td>
                      <td style={tdStyle}>lidc</td>
                      <td style={tdStyle}>Operation</td>
                      <td style={tdStyle}>
                        Distribute visitors across LinkedIn servers
                      </td>
                      <td style={tdStyle}>Session</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>LinkedIn</td>
                      <td style={tdStyle}>li_gc</td>
                      <td style={tdStyle}>Operation</td>
                      <td style={tdStyle}>
                        Store guest users&rsquo; consent to use cookies for
                        non-essential purposes
                      </td>
                      <td style={tdStyle}>Session</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>Vimeo</td>
                      <td style={tdStyle}>_cfuvid</td>
                      <td style={tdStyle}>Operation</td>
                      <td style={tdStyle}>
                        Allow Cloudflare to distinguish between individual users
                        sharing the same IP
                      </td>
                      <td style={tdStyle}>Session</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>Facebook</td>
                      <td style={tdStyle}>lastExternalReferrerTime</td>
                      <td style={tdStyle}>Operation</td>
                      <td style={tdStyle}>
                        Detects how the user reached the website by recording
                        last URL address
                      </td>
                      <td style={tdStyle}>Persistent</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>Facebook</td>
                      <td style={tdStyle}>_fbp</td>
                      <td style={tdStyle}>Marketing</td>
                      <td style={tdStyle}>
                        Used by Facebook for advertising products such as
                        real-time offers from third-party advertisers
                      </td>
                      <td style={tdStyle}>90 days</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>Tarteaucitron</td>
                      <td style={tdStyle}>PHPSESSID</td>
                      <td style={tdStyle}>Marketing</td>
                      <td style={tdStyle}>
                        Allows to distinguish the user&rsquo;s session
                      </td>
                      <td style={tdStyle}>Session</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}>CloudFlare</td>
                      <td style={tdStyle}>cf.turnstile.u</td>
                      <td style={tdStyle}>Marketing</td>
                      <td style={tdStyle}>
                        Bot and real user detection verification tool to enhance
                        security
                      </td>
                      <td style={tdStyle}>Persistent</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div
            className="LegalPage-footerRow"
            style={{
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '0.875rem',
              color: '#64748b',
            }}
          >
            <span>Last Updated: October 2026 • Effective Worldwide</span>
            <Link
              to="/contact"
              style={{
                color: '#2563eb',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Have questions? Contact Legal Advisory &rarr;
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
