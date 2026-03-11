'use client';

import { useEffect, useRef, useState } from 'react';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Noto+Sans+Malayalam:wght@300;400;600&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --gold: #c9a84c;
  --gold-light: #e8c97a;
  --gold-dark: #8b6914;
  --cream: #fdf8f0;
  --deep: #1a0f00;
}

body {
  background: #0d0800;
  font-family: 'Cormorant Garamond', serif;
  overflow-x: hidden;
}

#envelope-screen {
  position: fixed; inset: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  background: radial-gradient(ellipse at center, #2a1505 0%, #0d0800 70%);
  overflow: hidden;
}

.env-particles { position: absolute; inset: 0; pointer-events: none; }

.particle {
  position: absolute; width: 3px; height: 3px;
  background: var(--gold); border-radius: 50%; opacity: 0;
  animation: floatUp 4s ease-in-out infinite;
}

@keyframes floatUp {
  0% { transform: translateY(100vh) scale(0); opacity: 0; }
  10% { opacity: 1; } 90% { opacity: 0.5; }
  100% { transform: translateY(-10vh) scale(1.5); opacity: 0; }
}

.envelope-wrapper {
  position: relative; width: 340px; height: 240px;
  cursor: pointer; perspective: 800px;
}

.envelope {
  position: relative; width: 100%; height: 100%;
  filter: drop-shadow(0 20px 60px rgba(201,168,76,0.3));
  transition: transform 0.3s;
}
.envelope:hover { transform: scale(1.03); }

.env-body {
  position: absolute; inset: 0;
  background: linear-gradient(160deg, #f5e6c8 0%, #e8d0a0 40%, #d4b870 100%);
  border-radius: 4px 4px 8px 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3);
  overflow: hidden;
}
.env-body::before {
  content: ''; position: absolute; inset: 0;
  background: repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(201,168,76,0.05) 20px, rgba(201,168,76,0.05) 21px);
}

.env-bottom { position: absolute; bottom: 0; left: 0; right: 0; height: 50%; overflow: hidden; }
.env-bottom::after {
  content: ''; position: absolute; bottom: 0; left: -10px; right: -10px; height: 0;
  border-left: 190px solid transparent; border-right: 190px solid transparent;
  border-bottom: 140px solid #c9a84c; opacity: 0.7;
}

.env-left, .env-right { position: absolute; top: 0; bottom: 0; width: 50%; overflow: hidden; }
.env-left { left: 0; }
.env-right { right: 0; }
.env-left::after {
  content: ''; position: absolute; top: -10px; bottom: -10px; left: -10px; width: 0;
  border-top: 140px solid transparent; border-bottom: 140px solid transparent;
  border-left: 185px solid #b8954a; opacity: 0.5;
}
.env-right::after {
  content: ''; position: absolute; top: -10px; bottom: -10px; right: -10px; width: 0;
  border-top: 140px solid transparent; border-bottom: 140px solid transparent;
  border-right: 185px solid #b8954a; opacity: 0.5;
}

.env-flap {
  position: absolute; top: -2px; left: -2px; right: -2px; height: 55%;
  transform-origin: top center; transform-style: preserve-3d;
  transition: transform 1.2s cubic-bezier(0.4,0,0.2,1); z-index: 10;
}
.env-flap-inner { position: absolute; inset: 0; overflow: hidden; }
.env-flap-inner::after {
  content: ''; position: absolute; top: -10px; left: -10px; right: -10px; height: 0;
  border-left: 190px solid transparent; border-right: 190px solid transparent;
  border-top: 155px solid #d4a84c;
}
.env-flap-back { position: absolute; inset: 0; overflow: hidden; transform: rotateX(180deg); backface-visibility: visible; }
.env-flap-back::after {
  content: ''; position: absolute; top: -10px; left: -10px; right: -10px; height: 0;
  border-left: 190px solid transparent; border-right: 190px solid transparent;
  border-top: 155px solid #c9a84c; opacity: 0.6;
}

.wax-seal {
  position: absolute; top: 45%; left: 50%; transform: translate(-50%,-50%);
  width: 56px; height: 56px; z-index: 20; transition: opacity 0.5s;
}
.wax-seal svg { width: 100%; height: 100%; filter: drop-shadow(0 4px 12px rgba(107,31,42,0.6)); }

.card-peek {
  position: absolute; bottom: 5px; left: 20px; right: 20px; height: 0;
  background: var(--cream); border-radius: 4px 4px 0 0; z-index: 5; overflow: hidden;
  transition: height 0.8s 0.8s cubic-bezier(0.4,0,0.2,1);
}
.card-peek-content {
  padding: 16px; text-align: center; color: var(--gold-dark);
  font-family: 'Playfair Display', serif; font-size: 13px; letter-spacing: 2px;
  opacity: 0; transition: opacity 0.4s 1.4s;
}

.envelope-wrapper.opening .env-flap { transform: rotateX(-175deg); }
.envelope-wrapper.opening .wax-seal { opacity: 0; transition: opacity 0.3s; }
.envelope-wrapper.opening .card-peek { height: 180px; }
.envelope-wrapper.opening .card-peek-content { opacity: 1; }

.open-hint {
  position: absolute; bottom: -50px; left: 50%; transform: translateX(-50%);
  color: var(--gold); font-family: 'Cormorant Garamond', serif;
  font-size: 14px; letter-spacing: 3px; text-transform: uppercase;
  animation: pulse 2s ease-in-out infinite;
}
.open-arrow { display: block; text-align: center; margin-top: 6px; font-size: 18px; animation: bounce 1.5s ease-in-out infinite; }

@keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.9; } }
@keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(5px); } }

#envelope-screen.fade-out { animation: fadeOut 1.2s ease forwards; pointer-events: none; }
@keyframes fadeOut { 0% { opacity: 1; } 100% { opacity: 0; visibility: hidden; } }

#invitation { opacity: 0; min-height: 100vh; background: var(--deep); position: relative; overflow: hidden; }
#invitation.visible { animation: revealInvitation 1.5s ease forwards; }
@keyframes revealInvitation { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }

.bg-pattern {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 20% 100%, rgba(107,31,42,0.15) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 80% 100%, rgba(201,168,76,0.06) 0%, transparent 50%);
}

.invitation-card { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; padding: 20px; }

.inv-header { text-align: center; padding: 60px 30px 40px; }

.pre-title {
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  color: var(--gold); font-size: 13px; letter-spacing: 5px; text-transform: uppercase;
  margin-bottom: 10px; opacity: 0; animation: fadeUp 1s 0.2s ease forwards;
}

.inv-headline {
  font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 400;
  color: var(--cream); line-height: 1.15; letter-spacing: 1px;
  margin: 10px 0 6px; opacity: 0; animation: fadeUp 1s 0.5s ease forwards;
}
.inv-headline em { font-style: italic; color: var(--gold-light); font-size: 60px; }

.inv-subtitle {
  font-family: 'Cormorant Garamond', serif; font-style: italic;
  font-size: 15px; color: rgba(253,248,240,0.55); line-height: 1.8;
  margin-top: 8px; opacity: 0; animation: fadeUp 1s 0.8s ease forwards;
}

.ornament-line {
  display: flex; align-items: center; justify-content: center;
  gap: 12px; margin: 16px 0; opacity: 0; animation: fadeUp 1s 0.5s ease forwards;
}
.ornament-line::before,.ornament-line::after {
  content: ''; flex: 1; height: 1px; max-width: 120px;
  background: linear-gradient(to right, transparent, var(--gold), transparent);
}
.ornament-diamond { color: var(--gold); font-size: 10px; }

.names-section { text-align: center; padding: 30px 20px; opacity: 0; animation: fadeUp 1s 1s ease forwards; }
.bride-section, .groom-section { padding: 20px 10px; }

.name-label {
  font-family: 'Cormorant Garamond', serif; font-size: 12px; letter-spacing: 5px;
  text-transform: uppercase; color: var(--gold); opacity: 0.7; display: block; margin-bottom: 8px;
}
.main-name {
  font-family: 'Playfair Display', serif; font-size: 52px; color: var(--cream);
  line-height: 1.1; font-weight: 400; text-shadow: 0 0 40px rgba(201,168,76,0.2); display: block;
}
.name-highlight { color: var(--gold-light); }
.sub-name { display: block; font-size: 13px; color: rgba(253,248,240,0.6); letter-spacing: 1px; margin-top: 6px; font-style: italic; }
.parents-info { font-size: 13px; color: rgba(253,248,240,0.55); line-height: 1.8; margin-top: 10px; font-style: italic; }
.family-name { color: var(--gold); opacity: 0.8; }

.and-divider { display: flex; align-items: center; justify-content: center; gap: 20px; padding: 10px 0; }
.and-divider .line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent); }
.and-symbol {
  font-family: 'Playfair Display', serif; font-style: italic; font-size: 42px;
  color: var(--gold); line-height: 1; animation: glow 3s ease-in-out infinite;
}
@keyframes glow {
  0%,100% { filter: drop-shadow(0 0 10px rgba(201,168,76,0.3)); }
  50% { filter: drop-shadow(0 0 25px rgba(201,168,76,0.7)); }
}

.floral-divider { text-align: center; color: var(--gold); font-size: 22px; letter-spacing: 8px; margin: 10px 0; opacity: 0; animation: fadeUp 1s 1.3s ease forwards; }

.details-card {
  margin: 20px 10px; padding: 36px 30px; text-align: center; position: relative; overflow: hidden;
  background: linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(107,31,42,0.05) 100%);
  border: 1px solid rgba(201,168,76,0.2); border-radius: 2px;
  opacity: 0; animation: fadeUp 1s 1.5s ease forwards;
}
.details-card::before {
  content: ''; position: absolute; inset: 6px;
  border: 1px solid rgba(201,168,76,0.1); border-radius: 1px; pointer-events: none;
}
.corner { position: absolute; width: 24px; height: 24px; }
.corner.tl { top: 10px; left: 10px; border-top: 2px solid var(--gold); border-left: 2px solid var(--gold); }
.corner.tr { top: 10px; right: 10px; border-top: 2px solid var(--gold); border-right: 2px solid var(--gold); }
.corner.bl { bottom: 10px; left: 10px; border-bottom: 2px solid var(--gold); border-left: 2px solid var(--gold); }
.corner.br { bottom: 10px; right: 10px; border-bottom: 2px solid var(--gold); border-right: 2px solid var(--gold); }

.detail-label { font-size: 11px; letter-spacing: 5px; text-transform: uppercase; color: var(--gold); opacity: 0.7; display: block; margin-bottom: 10px; }
.detail-date { font-family: 'Playfair Display', serif; font-size: 36px; color: var(--cream); line-height: 1.1; }
.detail-day { font-family: 'Cormorant Garamond', serif; font-size: 14px; letter-spacing: 4px; color: var(--gold-light); text-transform: uppercase; margin-top: 4px; display: block; }
.detail-malayalam { font-family: 'Noto Sans Malayalam', sans-serif; font-size: 13px; color: rgba(201,168,76,0.6); margin-top: 4px; display: block; }
.divider-dot { color: var(--gold); opacity: 0.4; font-size: 8px; letter-spacing: 6px; margin: 16px 0; display: block; }
.detail-muhurtham { font-family: 'Playfair Display', serif; font-style: italic; font-size: 22px; color: var(--gold-light); margin-bottom: 4px; }
.detail-time { font-size: 13px; letter-spacing: 2px; color: rgba(253,248,240,0.6); }
.detail-venue-label { font-size: 11px; letter-spacing: 5px; text-transform: uppercase; color: var(--gold); opacity: 0.7; display: block; margin: 16px 0 8px; }
.detail-venue { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--cream); }
.detail-address { font-size: 13px; color: rgba(253,248,240,0.5); line-height: 1.8; margin-top: 6px; font-style: italic; }

.invite-message { margin: 20px 10px; text-align: center; padding: 30px; opacity: 0; animation: fadeUp 1s 1.8s ease forwards; }
.invite-message p { font-size: 15px; color: rgba(253,248,240,0.85); line-height: 2.2; }
.ml-text { font-family: 'Noto Sans Malayalam', sans-serif; }
.highlight-ml { color: var(--gold-light); font-weight: 600; }

.host-section { text-align: center; padding: 30px 20px 20px; border-top: 1px solid rgba(201,168,76,0.15); margin: 10px 10px 0; opacity: 0; animation: fadeUp 1s 2s ease forwards; }
.host-from { font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: var(--gold); opacity: 0.6; margin-bottom: 14px; display: block; }
.host-names { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--cream); line-height: 1.5; }
.host-address { font-size: 13px; color: rgba(253,248,240,0.45); margin-top: 8px; font-style: italic; }
.host-phones { font-size: 13px; color: var(--gold); opacity: 0.7; margin-top: 6px; letter-spacing: 1px; }

.location-section { margin: 20px 10px; opacity: 0; animation: fadeUp 1s 2.1s ease forwards; }
.location-header { text-align: center; margin-bottom: 16px; }
.location-title { font-size: 11px; letter-spacing: 5px; text-transform: uppercase; color: var(--gold); opacity: 0.7; display: block; margin-bottom: 6px; }
.location-name { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--cream); }
.map-container { position: relative; border-radius: 4px; overflow: hidden; border: 1px solid rgba(201,168,76,0.25); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
.map-container iframe { width: 100%; height: 220px; display: block; filter: sepia(30%) saturate(80%) hue-rotate(10deg) brightness(0.85); }
.map-overlay-btn {
  display: block; margin-top: 10px; text-align: center; text-decoration: none;
  background: linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.08));
  border: 1px solid rgba(201,168,76,0.3); border-radius: 2px; padding: 12px 20px;
  color: var(--gold-light); font-family: 'Cormorant Garamond', serif;
  font-size: 14px; letter-spacing: 3px; text-transform: uppercase; transition: all 0.3s;
}
.map-overlay-btn:hover { background: rgba(201,168,76,0.2); border-color: var(--gold); color: var(--gold); }

.inv-footer { text-align: center; padding: 30px 20px 50px; opacity: 0; animation: fadeUp 1s 2.2s ease forwards; }
.footer-ornament { font-size: 24px; color: var(--gold); opacity: 0.4; letter-spacing: 12px; margin-bottom: 16px; }
.footer-family { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 13px; color: rgba(253,248,240,0.4); letter-spacing: 2px; }

.petal { position: fixed; font-size: 14px; pointer-events: none; z-index: 999; opacity: 0; animation: petalFall linear forwards; }
@keyframes petalFall { 0% { transform: translateY(-20px) rotate(0deg); opacity: 0.8; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.brand-footer { text-align: center; padding: 14px 20px 28px; margin: 0 10px; }
.brand-divider { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 20px; }
.brand-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent); max-width: 100px; }
.brand-icon { color: var(--gold); font-size: 10px; opacity: 0.5; }
.brand-made { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 10px; color: rgba(253,248,240,0.25); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 1px; }
.brand-heart { color: #c9a84c; font-size: 13px; margin: 2px 0; animation: heartbeat 2s ease-in-out infinite; opacity: 0.7; }
@keyframes heartbeat { 0%,100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.2); opacity: 1; } }
.brand-name { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--gold-light); letter-spacing: 2px; margin: 3px 0 1px; filter: drop-shadow(0 0 8px rgba(201,168,76,0.3)); }
.brand-name span { font-style: italic; font-size: 16px; color: var(--gold); opacity: 0.85; }
.brand-tagline { font-family: 'Cormorant Garamond', serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(253,248,240,0.25); margin: 3px 0 8px; }

.wa-btn {
  display: inline-flex; align-items: center; gap: 7px; margin-top: 10px;
  padding: 9px 20px; border-radius: 50px; text-decoration: none; transition: all 0.3s;
  background: linear-gradient(135deg, rgba(37,211,102,0.15), rgba(37,211,102,0.08));
  border: 1px solid rgba(37,211,102,0.3); color: #4ddb85;
  font-family: 'Cormorant Garamond', serif; font-size: 13px; letter-spacing: 2px;
}
.wa-btn:hover { background: rgba(37,211,102,0.2); border-color: rgba(37,211,102,0.6); box-shadow: 0 0 16px rgba(37,211,102,0.2); }
.wa-icon { width: 15px; height: 15px; color: #4ddb85; flex-shrink: 0; }

@media (max-width: 480px) {
  .main-name { font-size: 40px; }
  .detail-date { font-size: 28px; }
  .and-symbol { font-size: 34px; }
  .inv-headline { font-size: 38px; }
  .inv-headline em { font-size: 46px; }
}
`;

export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const particleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject styles
    const styleTag = document.createElement('style');
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);
    return () => { document.head.removeChild(styleTag); };
  }, []);

  useEffect(() => {
    const container = particleRef.current;
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 4 + 's';
      p.style.animationDuration = (3 + Math.random() * 4) + 's';
      p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
      container.appendChild(p);
    }
  }, []);

  const openEnvelope = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(() => {
      const petals = ['🌸', '🌺', '✿', '❀', '🌹'];
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const petal = document.createElement('div');
          petal.className = 'petal';
          petal.textContent = petals[Math.floor(Math.random() * petals.length)];
          petal.style.left = Math.random() * 100 + 'vw';
          petal.style.top = '-30px';
          petal.style.fontSize = (12 + Math.random() * 12) + 'px';
          petal.style.animationDuration = (4 + Math.random() * 4) + 's';
          petal.style.animationDelay = '0s';
          document.body.appendChild(petal);
          setTimeout(() => petal.remove(), 8000);
        }, i * 200);
      }
    }, 2500);
  };

  return (
    <>
      {/* Envelope Screen */}
      <div id="envelope-screen" className={opened ? 'fade-out' : ''}>
        <div className="env-particles" ref={particleRef} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", color: 'var(--gold)', fontSize: '13px', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '40px', opacity: 0.7 }}>
            You are cordially invited
          </p>
          <div className={`envelope-wrapper${opened ? ' opening' : ''}`} onClick={openEnvelope}>
            <div className="envelope">
              <div className="env-body">
                <div className="env-left" />
                <div className="env-right" />
                <div className="env-bottom" />
                <div className="card-peek">
                  <div className="card-peek-content">
                    ✦ WEDDING INVITATION ✦<br />
                    <span style={{ fontSize: '16px', color: 'var(--gold-dark)' }}>Vandana &amp; Gokulnath</span><br />
                    <span style={{ fontSize: '11px', opacity: 0.7 }}>April 20, 2026</span>
                  </div>
                </div>
              </div>
              <div className="env-flap">
                <div className="env-flap-inner" />
                <div className="env-flap-back" />
              </div>
              <div className="wax-seal">
                <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="40" r="36" fill="#8b1a27" stroke="#c9a84c" strokeWidth="2" />
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#c9a84c" strokeWidth="1" opacity="0.6" />
                  <text x="40" y="36" textAnchor="middle" fill="#e8c97a" fontFamily="Playfair Display,serif" fontStyle="italic" fontSize="12">V</text>
                  <text x="40" y="50" textAnchor="middle" fill="#e8c97a" fontFamily="Playfair Display,serif" fontStyle="italic" fontSize="12">&amp;</text>
                  <text x="40" y="62" textAnchor="middle" fill="#e8c97a" fontFamily="Playfair Display,serif" fontStyle="italic" fontSize="10">G</text>
                </svg>
              </div>
            </div>
            <div className="open-hint">
              Tap to open
              <span className="open-arrow">↓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Invitation */}
      <div id="invitation" className={opened ? 'visible' : ''}>
        <div className="bg-pattern" />
        <div className="invitation-card">

          {/* Header */}
          <div className="inv-header">
            <p className="pre-title">— A Wedding Celebration —</p>
            <div className="ornament-line"><span className="ornament-diamond">❧</span></div>
            <h1 className="inv-headline">We&apos;re Getting<br /><em>Married</em></h1>
            <div className="ornament-line" style={{ marginTop: '14px' }}><span className="ornament-diamond">❧</span></div>
            <p className="inv-subtitle">
              Together with our families, we joyfully invite you<br />
              to share in the celebration of our union
            </p>
          </div>

          {/* Names */}
          <div className="names-section">
            <div className="bride-section">
              <span className="name-label">The Bride</span>
              <span className="main-name"><span className="name-highlight">Vandana</span></span>
              <span className="sub-name ml-text">വന്ദന</span>
              <p className="parents-info">
                Daughter of<br />
                <span className="family-name">Venu Melath</span> (Asst. Branch Postmaster, Kottapally P.O.)<br />
                &amp; <span className="family-name">Anandavalli T.P.</span><br />
                <span style={{ fontSize: '11px', opacity: 0.6 }}>&apos;Melath&apos;, Kannambathkara, Kottapally</span>
              </p>
            </div>

            <div className="and-divider">
              <div className="line" />
              <span className="and-symbol">&amp;</span>
              <div className="line" />
            </div>

            <div className="groom-section">
              <span className="name-label">The Groom</span>
              <span className="main-name"><span className="name-highlight">Gokulnath</span></span>
              <span className="sub-name ml-text">ഗോകുൽനാഥ്</span>
              <p className="parents-info">
                Son of<br />
                <span className="family-name">Vinod T.</span> &amp; <span className="family-name">Bindu P.</span><br />
                <span style={{ fontSize: '11px', opacity: 0.6 }}>Thekkeyil, Mullambath, Kakkitil</span>
              </p>
            </div>
          </div>

          <div className="floral-divider">✦ ❧ ✦</div>

          {/* Date & Venue */}
          <div className="details-card">
            <div className="corner tl" /><div className="corner tr" />
            <div className="corner bl" /><div className="corner br" />
            <span className="detail-label">Wedding Day</span>
            <div className="detail-date">April 20, 2026</div>
            <span className="detail-day">Monday</span>
            <span className="detail-malayalam ml-text">2026 ഏപ്രിൽ 20 തിങ്കളാഴ്ച · 1201 മേടം 6</span>
            <span className="divider-dot">• • • • •</span>
            <div className="detail-muhurtham">Muhurtham</div>
            <div className="detail-time">11:20 AM &nbsp;·&nbsp; 12:00 Noon</div>
            <span className="detail-venue-label">Venue</span>
            <div className="detail-venue ml-text">വധുഗൃഹം</div>
            <div className="detail-address">
              Bride&apos;s Residence<br />
              &apos;Melath&apos;, Kannambathkara<br />
              Kottapally
            </div>
          </div>

          {/* Invite Message */}
          <div className="invite-message">
            <p className="ml-text">
              വിവാഹത്തിലും തലേദിവസം ഒരുക്കുന്ന<br />
              <span className="highlight-ml">സൗഹൃദവിരുന്നിലും</span> പങ്കെടുക്കുവാൻ<br />
              താങ്കളെ കുടുംബസമേതം ഞങ്ങളുടെ<br />
              ഭവനത്തിലേക്ക് ക്ഷണിക്കുന്നു.
            </p>
            <p style={{ marginTop: '14px', fontSize: '13px', color: 'rgba(253,248,240,0.4)', fontStyle: 'italic' }}>
              We warmly invite you and your family to join us<br />
              for the wedding celebrations and the day-prior gathering.
            </p>
          </div>

          {/* Hosts */}
          <div className="host-section">
            <span className="host-from">With Blessings From</span>
            <div className="host-names">
              Venu Melath<br />
              <span style={{ fontSize: '18px' }}>Anandavalli T.P.</span>
            </div>
            <p className="host-address">&apos;Melath&apos;, Kannambathkara, Kottapally</p>
            <p className="host-phones">📞 8547204196 &nbsp;·&nbsp; 9207433103</p>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
              <span style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.5, display: 'block', marginBottom: '10px' }}>On Behalf of</span>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', color: 'rgba(253,248,240,0.55)', fontSize: '15px', lineHeight: '1.8' }}>
                Vinayak Melath<br />Melath Family &amp; T.P. Family
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="location-section">
            <div className="location-header">
              <span className="location-title">📍 Venue Location</span>
              <div className="location-name">&apos;Melath&apos;, Kannambathkara, Kottapally</div>
            </div>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.0!2d75.6680319!3d11.6024647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba687ef86813b1%3A0x81b27f6368f6a999!2sKannambathkara%20library!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a className="map-overlay-btn" href="https://www.google.com/maps/search/Kannambathkara+Kottapally+Kerala/@11.6025,75.6680,16z" target="_blank" rel="noopener noreferrer">
              <span>🗺️</span> Open in Google Maps
            </a>
          </div>

          {/* Footer */}
          <div className="inv-footer">
            <div className="footer-ornament">✦ ✦ ✦</div>
            <p className="footer-family">Together is a wonderful place to be</p>
          </div>

          {/* Brand Footer */}
          <div className="brand-footer">
            <div className="brand-divider">
              <span className="brand-line" /><span className="brand-icon">✦</span><span className="brand-line" />
            </div>
            <p className="brand-made">Crafted with</p>
            <div className="brand-heart">♥</div>
            <div className="brand-name">Invite<span>ly</span></div>
            <p className="brand-tagline">Premium Digital Invitations</p>
            <a href="https://wa.me/919846932069?text=Hi%2C%20I%27d%20like%20to%20create%20a%20premium%20digital%20invitation%20for%20my%20event%20%F0%9F%8C%B8" target="_blank" rel="noopener noreferrer" className="wa-btn">
              <svg viewBox="0 0 24 24" className="wa-icon" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Create Your Invitation
            </a>
          </div>

        </div>
      </div>
    </>
  );
}