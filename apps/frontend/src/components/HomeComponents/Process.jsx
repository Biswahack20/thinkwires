const Process = () => {
  const steps = [
    {
      number: '01',
      numberColor: '#bfdbfe',
      title: 'Discovery & Scoping Call',
      description:
        'Share technical job descriptions and business constraints. Together we define tech stack nuances, seniorities, sprint cadences, and budget boundaries.',
      delivery: 'Delivery: Tailored Talent Blueprint',
      iconBg: '#eff6ff',
      iconColor: '#3b82f6',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
    },
    {
      number: '02',
      numberColor: '#cbd5e1',
      title: 'Precision Pre-Vetted Match',
      description:
        'In just 48 to 72 hours, we source from our active bench and verified candidate pipelines. You receive curated dossiers with coding evaluations and notice verification.',
      delivery: 'Delivery: Shortlist of Top 3 Contenders',
      iconBg: '#eff6ff',
      iconColor: '#3b82f6',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
    {
      number: '03',
      numberColor: '#bbf7d0',
      title: 'Seamless Onboarding & Scale',
      description:
        'Our talent integrates immediately into your Slack, Jira, and Git repositories. ThinkWires oversees performance continuity, payroll, and scaling adjustments.',
      delivery: 'Delivery: Instant Sprint Participation',
      iconBg: '#22c55e',
      iconColor: '#ffffff',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
        </svg>
      ),
    },
  ];

  return (
    <section className={'Process-section'}>
      <div className={'Process-container'}>
        <div className={'Process-header'}>
          <span className={'Process-subtitle'}>METHODOLOGY</span>
          <h2 className={'Process-title'}>Our Process &amp; Practices</h2>
          <p className={'Process-description'}>
            We follow an agile, transparent approach to identify, vet, and
            onboard premier engineering leaders without operational friction.
          </p>
        </div>

        <div className={'Process-grid'}>
          {steps.map((step, index) => (
            <div key={index} className={'Process-card'}>
              <div className={'Process-cardHeader'}>
                <span
                  className={'Process-stepNumber'}
                  style={{ color: step.numberColor }}
                >
                  {step.number}
                </span>
                <div
                  className={'Process-iconWrapper'}
                  style={{
                    backgroundColor: step.iconBg,
                    color: step.iconColor,
                  }}
                >
                  {step.icon}
                </div>
              </div>
              <h3 className={'Process-cardTitle'}>{step.title}</h3>
              <p className={'Process-cardDesc'}>{step.description}</p>
              <div className={'Process-deliveryTag'}>{step.delivery}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
