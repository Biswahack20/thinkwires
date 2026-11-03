import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const ValuesCodeOfConductPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Helmet>
        <title>Our Values &amp; Code of Conduct | Thinkwires Technology</title>
        <meta
          name="description"
          content="At Thinkwires, we believe that strong values are the foundation of lasting success. Explore our core values: Trust, Excellence, Innovation, and Collaboration, and our Code of Conduct."
        />
      </Helmet>
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="bg-gradient-to-b from-navy-950 via-slate-900 to-navy-900 text-white py-20 px-4 relative overflow-hidden" style={{ backgroundColor: '#070f26' }}>
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ETHICS &amp; PRINCIPLES
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Our Values &amp; Code of Conduct
            </h1>
            <p className="text-xl md:text-2xl text-emerald-200 font-medium max-w-3xl mx-auto leading-relaxed">
              Strong Values. Meaningful Impact.
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center">
              The Foundation of Lasting Success
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg mb-6">
              At Thinkwires, we believe that strong values are the foundation of lasting success. Our core values shape our culture, guide our decisions, and define how we work with our employees, clients, and business partners.
            </p>
            <p className="text-slate-600 leading-relaxed text-base mb-6">
              Innovation, Excellence, Collaboration, and Trust are at the heart of everything we do. These principles inspire us to embrace new ideas, pursue outstanding results, support one another, and build relationships grounded in integrity.
            </p>
            <p className="text-slate-700 font-medium leading-relaxed text-base">
              We believe that when people share a common purpose and are guided by strong values, they can create innovative solutions, deliver meaningful outcomes, and build a better future together.
            </p>
          </div>
        </section>

        {/* The Four Core Values in Detail */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">
              CORE TENETS
            </span>
            <h2 className="text-3xl font-bold text-slate-900">
              Our Four Pillars in Action
            </h2>
          </div>

          <div className="space-y-8">
            {/* 1. Trust */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 hover:border-blue-400 transition-colors">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[30px]">verified_user</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                    Value 01 — Trust
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    We Build Trust Through Our Actions
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-base">
                    At Thinkwires, we believe trust is earned through honesty, consistency, and accountability. We honor our commitments, communicate transparently, and treat every relationship with respect. By demonstrating integrity in our actions and delivering on our promises, we build lasting partnerships with our employees, clients, and business associates.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Excellence */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 hover:border-blue-400 transition-colors">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[30px]">emoji_events</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                    Value 02 — Excellence
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Passion to Excel
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-base">
                    At Thinkwires, we approach every challenge with enthusiasm, determination, and a commitment to excellence. We strive to exceed expectations, embrace new opportunities, and deliver meaningful results for our clients and partners. Our passion for continuous improvement drives us to innovate, overcome challenges, and achieve shared success.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Innovation */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 hover:border-blue-400 transition-colors">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[30px]">lightbulb</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                    Value 03 — Innovation
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Innovation That Drives Progress
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-base">
                    At Thinkwires, innovation inspires us to challenge conventional thinking, explore new possibilities, and embrace emerging technologies. We encourage creative ideas and forward-thinking solutions that address evolving business needs. By continuously learning, adapting, and improving, we empower our people and clients to stay ahead in a rapidly changing world.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Collaboration */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 hover:border-blue-400 transition-colors">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[30px]">groups</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block mb-1">
                    Value 04 — Collaboration
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    For One Another
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-base">
                    At Thinkwires, we believe great achievements begin with working together. We foster a culture of teamwork, mutual respect, and shared responsibility, where diverse ideas and skills come together to create meaningful solutions. By supporting one another, sharing knowledge, and building strong partnerships, we achieve common goals and create lasting value for our employees, clients, and business partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Code of Conduct Section */}
        <section className="bg-white py-16 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-gradient-to-br from-slate-900 to-navy-950 text-white rounded-3xl p-8 md:p-12 shadow-xl" style={{ backgroundColor: '#070f26' }}>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-2">
                OUR CODE OF CONDUCT
              </span>
              <h2 className="text-3xl font-extrabold mb-6 text-white">
                Integrity in Every Action
              </h2>
              <p className="text-slate-200 text-lg leading-relaxed mb-6">
                At Thinkwires, our Code of Conduct reflects our core values of Innovation, Excellence, Collaboration, and Trust. It guides us to act with honesty, integrity, and accountability in every decision and interaction.
              </p>
              <p className="text-slate-300 leading-relaxed text-base mb-8">
                By adhering to ethical standards, applicable laws, and company policies, we foster a culture of transparency and mutual respect. Together, we turn our values into action, strengthen relationships, and create lasting value for a better tomorrow.
              </p>
              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800">
                <Link
                  to="/about/mission-vision"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-all text-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>View Our Mission &amp; Vision</span>
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-all text-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back to About Thinkwires</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ValuesCodeOfConductPage;

