import React from 'react';

const About = () => {
  return (
    <section className={'About-aboutSection'}>
      <div className={'About-aboutContainer'}>
        {/* Left Content */}
        <div className={'About-aboutContent'}>
          <div className={'About-tagBadge'}>
            <span>🏢</span> About ThinkWires
          </div>

          <h2 className={'About-title'}>
            Bridging Human Ingenuity With Borderless Tech Precision
          </h2>

          <p className={'About-description'}>
            Established in 2022 and operating as a premier Private Limited
            workforce advisory, ThinkWires provides equal access to high-impact
            career opportunities while transforming enterprise talent deployment
            across India, the United States, and Canada.
          </p>

          <p className={'About-description'}>
            Beyond engineering staff augmentation, we provide turnkey payroll
            administration and multilingual talent sourcing across BFSI, Life
            Sciences, Cloud infrastructure, and advanced manufacturing sectors.
          </p>

          <div className={'About-statsGrid'}>
            <div className={'About-statBox'}>
              <div className={'About-statValue'}>2022</div>
              <div className={'About-statText'}>
                Incorporated & rapidly scaled to bilateral enterprise corridors
              </div>
            </div>
            <div className={'About-statBox'}>
              <div className={'About-statValue'}>100%</div>
              <div className={'About-statText'}>
                Compliant cross-border hiring, EOR & payroll assurance
              </div>
            </div>
          </div>

          <button className={'About-readMoreBtn'}>
            Read Full Executive Story <span>→</span>
          </button>
        </div>

        {/* Right Grid */}
        <div className={'About-featuresGrid'}>
          {/* Feature 1 */}
          <div className={'About-featureCard'}>
            <div className={`${'About-iconWrapper'} ${'About-blue'}`}>💡</div>
            <h3 className={'About-featureTitle'}>Innovation First</h3>
            <p className={'About-featureDesc'}>
              We constantly integrate AI matching algorithms and data-driven
              pipelines to connect tech leaders with future-ready engineers.
            </p>
          </div>

          {/* Feature 2 */}
          <div className={'About-featureCard'}>
            <div className={`${'About-iconWrapper'} ${'About-gray'}`}>⚙️</div>
            <h3 className={'About-featureTitle'}>Agile Adaptability</h3>
            <p className={'About-featureDesc'}>
              Rapidly structuring dedicated pods for greenfield software builds,
              legacy migrations, or peak seasonal sprints.
            </p>
          </div>

          {/* Feature 3 */}
          <div className={'About-featureCard'}>
            <div className={`${'About-iconWrapper'} ${'About-green'}`}>🌍</div>
            <h3 className={'About-featureTitle'}>Global Reach</h3>
            <p className={'About-featureDesc'}>
              Borders are no barrier to top engineering talent. Coordinated
              hiring spanning North America and Indian technology hubs.
            </p>
          </div>

          {/* Feature 4 */}
          <div className={'About-featureCard'}>
            <div className={`${'About-iconWrapper'} ${'About-indigo'}`}>🛡️</div>
            <h3 className={'About-featureTitle'}>Zero-Compromise Vetting</h3>
            <p className={'About-featureDesc'}>
              Multi-tiered technical interviews, code evaluations, and
              architectural assessments before candidate profiles reach your
              inbox.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
