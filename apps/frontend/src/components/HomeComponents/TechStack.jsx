import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTechStack } from '../../store/slices/homeSlice';

const TechStack = () => {
  const dispatch = useDispatch();
  const { techStack: technologies, status } = useSelector(
    (state) => state.home
  );

  useEffect(() => {
    if (status.techStack === 'idle') {
      dispatch(fetchTechStack());
    }
  }, [dispatch, status.techStack]);

  // For the infinite carousel effect, we duplicate the array so it scrolls seamlessly
  const carouselItems = [...technologies, ...technologies];

  return (
    <section className={'TechStack-techStackSection'}>
      <div className={'TechStack-techStackContainer'}>
        <div className={'TechStack-techStackHeader'}>
          <div className={'TechStack-headerLeft'}>
            <div className={'TechStack-label'}>
              ENTERPRISE TECH STACK ECOSYSTEM
            </div>
            <div className={'TechStack-subtext'}>
              Engineered talent pools rigorously validated for leading
              enterprise platforms
            </div>
          </div>
          <div className={'TechStack-headerRight'}>
            <span>✓</span> Pre-screened Bench Available
          </div>
        </div>

        <div className={'TechStack-carouselWrapper'}>
          {status.techStack !== 'loading' && (
            <div className={'TechStack-pillTrack'}>
              {carouselItems.map((tech, index) => (
                <div key={index} className={'TechStack-pill'}>
                  {tech}
                </div>
              ))}
            </div>
          )}
          {status.techStack === 'loading' && <div>Loading ecosystem...</div>}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
