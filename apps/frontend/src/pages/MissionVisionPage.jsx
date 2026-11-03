import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const MissionVisionPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Helmet>
        <title>Mission &amp; Vision | Thinkwires Technology</title>
        <meta
          name="description"
          content="Our Vision and Mission define our purpose and guide everything we do at Thinkwires. With a clear strategy and a commitment to excellence, we transform our goals into meaningful outcomes."
        />
      </Helmet>
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="bg-gradient-to-b from-navy-950 via-slate-900 to-navy-900 text-white py-20 px-4 relative overflow-hidden" style={{ backgroundColor: '#070f26' }}>
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              OUR PURPOSE &amp; DIRECTION
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Our Vision &amp; Mission
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 font-medium max-w-3xl mx-auto leading-relaxed">
              Thinkwires — People. Technology. Progress.
            </p>
          </div>
        </section>

        {/* Vision & Mission Presentation Cards */}
        <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-sm">
                  <span className="material-symbols-outlined text-[32px]">visibility</span>
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-blue-600 block mb-2">
                  OUR COMMON VISION
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  Creating Value for a Better Tomorrow
                </h2>
                <p className="text-slate-600 leading-relaxed text-base mb-4">
                  Our Inspiration / Our Aspiration / Our Emotional Connection
                </p>
                <p className="text-slate-700 leading-relaxed text-base font-medium">
                  We envision a future where people, technology and opportunities come together to create sustainable growth and a lasting positive impact.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-sm font-semibold text-blue-600">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Inspiration • Aspiration • Connection</span>
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-sm">
                  <span className="material-symbols-outlined text-[32px]">track_changes</span>
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 block mb-2">
                  OUR COMMON MISSION
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  Our Technologies. Your Solutions. Powered by the Passion of Our People.
                </h2>
                <p className="text-slate-600 leading-relaxed text-base mb-4">
                  Our Passion / Our Connection
                </p>
                <p className="text-slate-700 leading-relaxed text-base font-medium">
                  We deliver innovative solutions and build strong partnerships by connecting the right talent with the right opportunities, helping businesses grow and succeed.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Passion • Solutions • Talent</span>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative & Purpose Section */}
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            Transforming Goals into Meaningful Outcomes
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            Our Vision and Mission define our purpose and guide everything we do at Thinkwires. With a clear strategy and a commitment to excellence, we transform our goals into meaningful outcomes for our clients, partners, employees, and communities.
          </p>
          <p className="text-base text-slate-600 leading-relaxed">
            Our values shape how we work, lead, collaborate, and make decisions. They reflect our commitment to innovation, shared success, accountability, and lasting relationships.
          </p>
        </section>

        {/* Core Values Section */}
        <section className="bg-white py-16 border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">
                FOUNDATIONAL PRINCIPLES
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Our Four Core Values
              </h2>
              <p className="text-slate-600">
                Our values shape the way we collaborate, lead, and make decisions. They reflect our strengths, define our priorities, and keep us focused on what truly matters to our people, our clients, and our shared success.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Freedom to Innovate */}
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[26px]">lightbulb</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Freedom to Innovate</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    We empower our people to think creatively, take initiative, and explore new possibilities that drive continuous improvement.
                  </p>
                </div>
              </div>

              {/* Passion to Excel / Achieve */}
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[26px]">trending_up</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Passion to Excel</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    We bring energy, dedication, and a results-driven mindset to every challenge, striving to exceed expectations and deliver lasting value.
                  </p>
                </div>
              </div>

              {/* Success Through Collaboration */}
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[26px]">groups</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Success Through Collaboration</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    We foster teamwork, mutual respect, and shared responsibility, recognizing that collective effort and shared knowledge lead to greater success.
                  </p>
                </div>
              </div>

              {/* Trust Through Integrity */}
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[26px]">verified_user</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Trust Through Integrity</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    We build strong, lasting partnerships through transparency, accountability, ethical practices, and consistent delivery.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/about/values"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md transition-all active:scale-95"
              >
                <span>Read Detailed Values &amp; Code of Conduct</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MissionVisionPage;

