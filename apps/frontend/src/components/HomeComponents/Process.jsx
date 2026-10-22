import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchProcess } from '../../store/slices/homeSlice';

const DEFAULT_STEPS = [
  {
    number: '01',
    numberColor: '#008FD3',
    title: 'Discovery & Scoping Call',
    description:
      'Share technical job descriptions and business constraints. Together we define tech stack nuances, seniorities, sprint cadences, and budget boundaries.',
    delivery: 'Delivery: Tailored Talent Blueprint',
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
  },
  {
    number: '02',
    numberColor: '#004B87',
    title: 'Precision Pre-Vetted Match',
    description:
      'In just 48 to 72 hours, we source from our active bench and verified candidate pipelines. You receive curated dossiers with coding evaluations and notice verification.',
    delivery: 'Delivery: Shortlist of Top 3 Contenders',
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
  },
  {
    number: '03',
    numberColor: '#22c55e',
    title: 'Seamless Onboarding & Scale',
    description:
      'Our talent integrates immediately into your Slack, Jira, and Git repositories. ThinkWires oversees performance continuity, payroll, and scaling adjustments.',
    delivery: 'Delivery: Instant Sprint Participation',
    iconBg: '#22c55e',
    iconColor: '#ffffff',
  },
];

const getProcessMaterialIcon = (stepNumber) => {
  if (stepNumber === '01') return 'chat_bubble_outline';
  if (stepNumber === '02') return 'group';
  return 'rocket_launch';
};

// Motion variants: cards fly in from alternating sides (left and right)
const cardVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction === 'left' ? -120 : 120,
    scale: 0.95,
  }),
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const Process = () => {
  const dispatch = useDispatch();
  const { process: reduxSteps, status } = useSelector((state) => state.home);

  useEffect(() => {
    if (status.process === 'idle') {
      dispatch(fetchProcess());
    }
  }, [dispatch, status.process]);

  const steps =
    reduxSteps && reduxSteps.length > 0 ? reduxSteps : DEFAULT_STEPS;

  return (
    <section
      className="Process-section"
      id="process"
      style={{ overflow: 'hidden' }}
    >
      <div className="Process-container">
        <div className="Process-header">
          <span className="Process-tag">METHODOLOGY</span>
          <h2 className="Process-title">Our Process &amp; Practices</h2>
          <p className="Process-description">
            We follow an agile, transparent approach to identify, vet, and
            onboard premier engineering leaders without operational friction.
          </p>
        </div>

        <div className="Process-grid">
          {steps.map((step, index) => {
            const direction = index % 2 === 0 ? 'left' : 'right';

            return (
              <motion.div
                key={step.number || index}
                className="Process-card group"
                custom={direction}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="Process-cardHeader">
                  <span
                    className="Process-stepNumber"
                    style={{ color: step.numberColor }}
                  >
                    {step.number}
                  </span>
                  <div
                    className="Process-iconWrapper"
                    style={{
                      backgroundColor: step.iconBg,
                      color: step.iconColor,
                    }}
                  >
                    <span className="material-symbols-outlined text-[26px]">
                      {getProcessMaterialIcon(step.number)}
                    </span>
                  </div>
                </div>
                <h3 className="Process-cardTitle">{step.title}</h3>
                <p className="Process-cardDesc">{step.description}</p>
                <div className="Process-deliveryTag">{step.delivery}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
