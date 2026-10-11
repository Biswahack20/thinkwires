import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProcess } from '../../store/slices/homeSlice';
import SectionBadge from '../common/SectionBadge';

const getProcessMaterialIcon = (stepNumber) => {
  if (stepNumber === '01') return 'chat_bubble_outline';
  if (stepNumber === '02') return 'group';
  return 'rocket_launch';
};

const Process = () => {
  const dispatch = useDispatch();
  const { process: steps, status } = useSelector((state) => state.home);

  useEffect(() => {
    if (status.process === 'idle') {
      dispatch(fetchProcess());
    }
  }, [dispatch, status.process]);

  return (
    <section className="Process-section">
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
          {steps.map((step, index) => (
            <div key={index} className="Process-card group">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
