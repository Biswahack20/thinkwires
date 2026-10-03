import React from 'react';
import heroVideo from '../../assets/thinkwires-brand-film.mp4';

const Hero = () => {
  return (
    <section className={'Hero-heroSection'}>
      <video
        src={heroVideo}
        className={'Hero-heroVideo'}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
};

export default Hero;
