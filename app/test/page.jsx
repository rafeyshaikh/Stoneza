'use client';

import React, { useState, useEffect, useRef } from 'react';

function SpecSelect({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="spec-item" ref={dropdownRef}>
      <span className="spec-label">{label}</span>
      <div className="spec-trigger-wrap">
        <button
          type="button"
          className={`spec-trigger ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span className="spec-val">{value}</span>
          <span className="spec-arw"></span>
        </button>

        {isOpen && (
          <div className="spec-menu">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`spec-option ${opt === value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                <span>{opt}</span>
                {opt === value && <span className="spec-check">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TestPage() {
  const [activeThumb, setActiveThumb] = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const heroRef = useRef(null);
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);
  const [t1PrevDisabled, setT1PrevDisabled] = useState(true);
  const [t1NextDisabled, setT1NextDisabled] = useState(false);
  const [t2PrevDisabled, setT2PrevDisabled] = useState(true);
  const [t2NextDisabled, setT2NextDisabled] = useState(false);

  const [specs, setSpecs] = useState({
    size: '4″–18″ random',
    thickness: '18–28 mm, calibrated back',
    surface: 'Natural + tumbled top',
    edges: 'Hand-cut sides',
    packaging: 'Crate pack — 220 sq ft, or loose',
    corners: 'Corner units on request'
  });

  const specOptions = [
    {
      key: 'size',
      label: 'Size',
      options: [
        '4″–18″ random',
        '6″–12″ medium random',
        '8″–20″ large random',
        'Custom sizing (On Request)'
      ]
    },
    {
      key: 'thickness',
      label: 'Thickness',
      options: [
        '18–28 mm, calibrated back',
        '20 mm fixed calibrated',
        '25–35 mm heavy duty',
        'Custom thickness'
      ]
    },
    {
      key: 'surface',
      label: 'Surface finish',
      options: [
        'Natural + tumbled top',
        'Natural split face',
        'Tumbled & aged finish',
        'Honed surface'
      ]
    },
    {
      key: 'edges',
      label: 'Edges',
      options: [
        'Hand-cut sides',
        'Sawn edges',
        'Chiseled edges'
      ]
    },
    {
      key: 'packaging',
      label: 'Packaging',
      options: [
        'Crate pack — 220 sq ft, or loose',
        'Crate pack — 110 sq ft',
        'Loose bulk load'
      ]
    },
    {
      key: 'corners',
      label: 'Corners',
      options: [
        'Corner units on request',
        'L-shaped Corner Units (Include)',
        'No Corners required'
      ]
    }
  ];

  const handleSpecChange = (key, value) => {
    setSpecs(prev => ({ ...prev, [key]: value }));
  };

  const slides = [
    {
      bg: "radial-gradient(130% 100% at 32% 22%,#565450 0%,transparent 62%),conic-gradient(from 25deg at 34% 40%,#38352F,#565450,#232120,#38352F,#565450),#38352F",
      fn: "cosmic-black-fieldstone-elevation.webp",
      cap: "Full elevation — Cosmic Black laid with a recessed joint"
    },
    {
      bg: "repeating-linear-gradient(38deg,#565450 0 14px,#38352F 14px 28px,#232120 28px 42px)",
      fn: "cosmic-black-fieldstone-detail.webp",
      cap: "Close detail — the mineral shimmer at arm's length"
    },
    {
      bg: "repeating-linear-gradient(90deg,#38352F 0 20px,#232120 20px 40px,#565450 40px 58px)",
      fn: "cosmic-black-fieldstone-crate.webp",
      cap: "As supplied — 220 sq ft crate, pre-blended to a fixed ratio"
    },
    {
      bg: "radial-gradient(120% 100% at 40% 30%,#232120 0%,#38352F 55%,#565450 100%)",
      fn: "cosmic-black-fieldstone-wet.webp",
      cap: "Wet — deepens to near-black, and the shimmer intensifies"
    },
    {
      bg: "radial-gradient(circle at 30% 34%,#565450 0 30px,transparent 32px),radial-gradient(circle at 68% 60%,#232120 0 34px,transparent 36px),#38352F",
      fn: "cosmic-black-fieldstone-corner.webp",
      cap: "Corner unit — courses wrapping an external return"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setShowSticky(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateTrackState = (track, setPrev, setNext) => {
    if (!track) return;
    setPrev(track.scrollLeft < 6);
    setNext(track.scrollLeft + track.clientWidth >= track.scrollWidth - 6);
  };

  useEffect(() => {
    const t1 = track1Ref.current;
    const t2 = track2Ref.current;

    const onScroll1 = () => updateTrackState(t1, setT1PrevDisabled, setT1NextDisabled);
    const onScroll2 = () => updateTrackState(t2, setT2PrevDisabled, setT2NextDisabled);

    if (t1) {
      t1.addEventListener('scroll', onScroll1, { passive: true });
      updateTrackState(t1, setT1PrevDisabled, setT1NextDisabled);
    }
    if (t2) {
      t2.addEventListener('scroll', onScroll2, { passive: true });
      updateTrackState(t2, setT2PrevDisabled, setT2NextDisabled);
    }

    const onResize = () => {
      updateTrackState(t1, setT1PrevDisabled, setT1NextDisabled);
      updateTrackState(t2, setT2PrevDisabled, setT2NextDisabled);
    };

    window.addEventListener('resize', onResize);

    return () => {
      if (t1) t1.removeEventListener('scroll', onScroll1);
      if (t2) t2.removeEventListener('scroll', onScroll2);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const scrollTrack = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.75;
      ref.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="product-page-container">
      {/* Embedded Page Styles matching Stoneza theme & design system */}
      <style>{`
        :root {
          --bg-page: #EAE8E2;
          --paper: #FAF8F5;
          --paper-white: #FFFFFF;
          --shell: #F2EDE4;
          --ink: #1C1714;
          --ink-2: #3A322C;
          --stone: #78716C;
          --line: #E2DFD7;
          --line-2: #CBC9C4;
          --brass: #C8A980;
          --rust: #9A4A2E;
          --whatsapp: #25D366;
          --whatsapp-hover: #20BA5A;
          --hair: rgba(28,23,20,.12);
          --ui: var(--font-nunito), "Nunito Sans", system-ui, sans-serif;
          --heading: var(--font-montserrat), "Montserrat", sans-serif;
          --serif: var(--font-libre), "Libre Baskerville", Georgia, serif;
          --mono: var(--font-montserrat), "Montserrat", monospace;
          --pad: clamp(18px,4.5vw,64px);
          --measure: 66ch;
        }
        * { box-sizing: border-box; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
        body { margin: 0; background: var(--bg-page); color: var(--ink); font-family: var(--ui); font-size: 15px; line-height: 1.7; -webkit-font-smoothing: antialiased; }
        img { max-width: 100%; display: block; }
        .wrap { max-width: 1320px; margin: 0 auto; padding: 0 var(--pad); }

        /* breadcrumb */
        .crumb { border-bottom: 1px solid var(--line-2); background: var(--bg-page); }
        .crumb .wrap { padding-top: 16px; padding-bottom: 16px; font-family: var(--heading); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--stone); font-weight: 500; }
        .crumb a { color: var(--stone); text-decoration: none; transition: color .15s ease; }
        .crumb a:hover { color: var(--ink); }
        .crumb span { color: var(--ink); font-weight: 600; }

        /* HERO */
        .hero { padding: clamp(24px,3.4vw,46px) 0 clamp(34px,4.6vw,62px); background: var(--bg-page); }
        .hgrid { display: grid; grid-template-columns: minmax(320px,1.12fr) minmax(320px,1fr); gap: clamp(28px,4.4vw,72px); align-items: start; }

        /* square gallery */
        .gal { display: grid; grid-template-columns: 76px 1fr; gap: 12px; }
        .thumbs { display: flex; flex-direction: column; gap: 10px; }
        .thumbs button { padding: 0; border: 1px solid var(--line-2); background: none; cursor: pointer; aspect-ratio: 1; position: relative; display: block; transition: border-color .15s; }
        .thumbs button.on { border-color: var(--ink); outline: 2px solid var(--ink); outline-offset: -1px; }
        .thumbs button:hover { border-color: var(--stone); }
        .thumbs i { position: absolute; inset: 0; display: block; }
        .gmain { position: relative; aspect-ratio: 1; border: 1px solid var(--line-2); overflow: hidden; background: var(--paper-white); }
        .gmain i { position: absolute; inset: 0; display: block; }
        .gmain .fn { position: absolute; left: 12px; bottom: 12px; font-family: var(--heading); font-size: 10px; letter-spacing: 0.08em; color: rgba(255,255,255,.9); background: rgba(28,23,20,.6); padding: 5px 9px; }
        .gcap { font-family: var(--heading); font-size: 11px; color: var(--stone); margin: 11px 0 0; letter-spacing: .03em; }

        /* right column */
        .pk { font-family: var(--heading); font-size: 11px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--rust); margin: 0 0 13px; }
        h1 { font-family: var(--serif); font-weight: 400; font-size: clamp(32px,4.3vw,52px); line-height: 1.05; margin: 0 0 10px; letter-spacing: -.015em; color: var(--ink); }
        .psub { font-family: var(--heading); font-size: 11.5px; letter-spacing: .06em; color: var(--stone); margin: 0 0 18px; text-transform: uppercase; }
        .ptag { font-family: var(--serif); font-style: italic; font-size: 18px; line-height: 1.55; margin: 0 0 24px; padding-left: 15px; border-left: 2px solid var(--rust); color: var(--ink-2); }

        /* Custom Floating Specs Selector */
        .keyspec {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 clamp(16px,2.6vw,34px);
          margin: 0 0 24px;
          border-top: 1px solid var(--ink);
        }
        .keyspec .spec-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 10px 0;
          border-bottom: 1px solid var(--line-2);
          position: relative;
        }
        .keyspec .spec-item:nth-child(even) {
          padding-left: clamp(16px,2.6vw,34px);
          border-left: 1px solid var(--line-2);
        }
        .keyspec .spec-label {
          font-family: var(--heading);
          font-size: 9px;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--rust);
          font-weight: 700;
        }
        .spec-trigger-wrap {
          position: relative;
          width: 100%;
        }
        .spec-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: transparent;
          border: none;
          border-bottom: 1px solid transparent;
          padding: 2px 0;
          font-family: var(--ui);
          font-size: 14px;
          font-weight: 600;
          color: var(--ink);
          cursor: pointer;
          text-align: left;
          transition: color 0.15s, border-color 0.15s;
        }
        .spec-trigger:hover, .spec-trigger.open {
          color: var(--rust);
          border-bottom-color: var(--rust);
        }
        .spec-arw {
          width: 6px;
          height: 6px;
          border-right: 1.5px solid var(--rust);
          border-bottom: 1.5px solid var(--rust);
          transform: rotate(45deg);
          transition: transform 0.2s ease, opacity 0.15s;
          margin-left: 8px;
          flex-shrink: 0;
          opacity: 0.7;
        }
        .spec-trigger:hover .spec-arw, .spec-trigger.open .spec-arw {
          opacity: 1;
        }
        .spec-trigger.open .spec-arw {
          transform: rotate(-135deg);
        }

        /* Floating Custom Options Menu */
        .spec-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          min-width: 100%;
          width: max-content;
          max-width: 320px;
          background: var(--paper-white);
          border: 1px solid var(--line-2);
          box-shadow: 0 14px 32px -8px rgba(28,23,20,0.18);
          z-index: 100;
          padding: 6px 0;
          border-radius: 4px;
          animation: specFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes specFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .spec-option {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 9px 14px;
          background: transparent;
          border: none;
          font-family: var(--ui);
          font-size: 13.5px;
          color: var(--ink-2);
          cursor: pointer;
          text-align: left;
          transition: background-color 0.12s, color 0.12s;
        }
        .spec-option:hover {
          background: var(--shell);
          color: var(--ink);
        }
        .spec-option.selected {
          background: var(--shell);
          color: var(--ink);
          font-weight: 600;
        }
        .spec-check {
          color: var(--rust);
          font-size: 12px;
          font-weight: 700;
        }

        .acts { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
        .acts a { font-family: var(--heading); font-size: 11px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; text-decoration: none; padding: 15px 24px; display: inline-flex; align-items: center; gap: 9px; flex: 1 1 auto; justify-content: center; border-radius: 4px; transition: all 0.2s ease; }
        .acts .wa { background: var(--ink); color: #FAF8F5; }
        .acts .wa:hover { background: var(--whatsapp); color: #FFFFFF; }
        .acts .sm { border: 1px solid var(--line-2); color: var(--ink); background: var(--paper-white); }
        .acts .sm:hover { border-color: var(--ink); background: var(--shell); }

        .trust { display: grid; grid-template-columns: repeat(3,1fr); border-top: 1px solid var(--line-2); border-bottom: 1px solid var(--line-2); }
        .trust div { padding: 13px 8px; text-align: center; border-right: 1px solid var(--line-2); }
        .trust div:last-child { border-right: 0; }
        .trust b { display: block; font-family: var(--serif); font-size: 13.5px; font-weight: 600; color: var(--ink); margin-bottom: 2px; }
        .trust span { font-family: var(--heading); font-size: 8.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--stone); font-weight: 600; }

        /* ACCORDIONS */
        .acc { border-top: 2px solid var(--ink); background: var(--bg-page); }
        .acc details { border-bottom: 1px solid var(--line-2); }
        .acc summary { list-style: none; cursor: pointer; padding: 22px 0; display: flex; align-items: center; gap: 18px; user-select: none; -webkit-user-select: none; }
        .acc summary::-webkit-details-marker { display: none; }
        .acc summary h3 { margin: 0; font-family: var(--serif); font-weight: 400; font-size: clamp(20px,2.4vw,26px); flex: 1 1 auto; color: var(--ink); }
        .acc summary .hint { font-family: var(--heading); font-size: 10px; letter-spacing: .12em; font-weight: 600; color: var(--stone); text-transform: uppercase; flex: 0 0 auto; user-select: none; -webkit-user-select: none; }
        .acc summary .arw { flex: 0 0 auto; width: 11px; height: 11px; border-right: 1.5px solid var(--ink); border-bottom: 1.5px solid var(--ink); transform: rotate(45deg); margin-top: -4px; transition: transform .2s; user-select: none; -webkit-user-select: none; pointer-events: none; }
        .acc details[open] summary .arw { transform: rotate(225deg); margin-top: 3px; }
        .acc details[open] summary h3 { font-weight: 600; }
        .accbody { padding: 0 0 30px; max-width: var(--measure); }
        .accbody p { margin: 0 0 14px; font-family: var(--ui); font-size: 15px; line-height: 1.75; color: var(--ink-2); }
        .accbody p:last-child { margin-bottom: 0; }
        .accbody h4 { font-family: var(--heading); font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--rust); margin: 24px 0 10px; }
        .accbody.wide { max-width: none; }

        /* tech table */
        .tech { display: grid; grid-template-columns: 1fr 1fr; gap: 0 clamp(20px,4vw,60px); }
        .tech table { width: 100%; border-collapse: collapse; }
        .tech td { padding: 11px 2px; border-bottom: 1px solid var(--line-2); font-family: var(--ui); font-size: 14px; color: var(--ink); vertical-align: top; }
        .tech td:first-child { font-family: var(--heading); font-size: 10px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--stone); width: 46%; padding-right: 12px; }
        .tech td:last-child { text-align: right; }
        .tech tr:first-child td { border-top: 1px solid var(--ink); }

        /* reads / rows inside accordions */
        .rows { border-top: 1px solid var(--line-2); }
        .rows > div { display: flex; gap: 18px; padding: 14px 0; border-bottom: 1px solid var(--line-2); align-items: baseline; }
        .rows b { flex: 0 0 118px; font-family: var(--serif); font-size: 14px; font-weight: 600; color: var(--ink); }
        .rows p { margin: 0; font-family: var(--ui); font-size: 14px; line-height: 1.65; color: var(--ink-2); }
        .reads4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 0 clamp(16px,2.4vw,32px); border-top: 1px solid var(--ink); margin: 6px 0 0; }
        .reads4 > div { padding: 14px 0 16px; border-bottom: 1px solid var(--line-2); }
        .reads4 > div + div { padding-left: clamp(16px,2.4vw,32px); border-left: 1px solid var(--line-2); }
        .reads4 h5 { margin: 0 0 6px; font-family: var(--heading); font-size: 9px; letter-spacing: .16em; text-transform: uppercase; color: var(--rust); font-weight: 700; }
        .reads4 p { margin: 0; font-family: var(--ui); font-size: 13.5px; line-height: 1.6; color: var(--ink-2); }
        .ovtop { display: grid; grid-template-columns: 1.15fr 1fr; gap: 0 clamp(20px,4vw,52px); align-items: start; }
        .ovtop > div + div { padding-left: clamp(20px,4vw,52px); border-left: 1px solid var(--line-2); }
        .ovtop p { margin: 0 0 12px; }
        .two { display: grid; grid-template-columns: 1fr 1fr; gap: 0 clamp(20px,4vw,50px); border-top: 1px solid var(--ink); margin-top: 6px; }
        .two > div { padding: 18px 0; border-bottom: 1px solid var(--line-2); }
        .two > div:last-child { padding-left: clamp(20px,4vw,50px); border-left: 1px solid var(--line-2); }
        .two h4 { margin: 0 0 9px; font-family: var(--heading); font-size: 9.5px; letter-spacing: .16em; text-transform: uppercase; color: var(--rust); font-weight: 700; }
        .two p { margin: 0; font-family: var(--ui); font-size: 14px; line-height: 1.68; color: var(--ink-2); }

        /* FAQ inside accordion */
        .faqs details { border-bottom: 1px solid var(--line-2); }
        .faqs summary { list-style: none; cursor: pointer; padding: 15px 0; display: flex; gap: 14px; font-family: var(--ui); font-size: 15px; font-weight: 600; color: var(--ink); align-items: baseline; user-select: none; -webkit-user-select: none; }
        .faqs summary::-webkit-details-marker { display: none; }
        .faqs summary::after { content: "+"; margin-left: auto; font-family: var(--heading); color: var(--stone); font-weight: 600; user-select: none; -webkit-user-select: none; }
        .faqs details[open] summary::after { content: "\\2013"; }
        .faqs .a { padding: 0 0 18px; max-width: var(--measure); }
        .faqs .a p { margin: 0 0 11px; font-family: var(--ui); font-size: 14.5px; line-height: 1.75; color: var(--ink-2); }

        /* BROWSE ROWS */
        .browse { padding: clamp(34px,4.4vw,58px) 0; border-top: 1px solid var(--line-2); background: var(--bg-page); }
        .bhead { display: flex; align-items: baseline; gap: 16px; margin-bottom: 20px; }
        .bhead h2 { margin: 0; font-family: var(--serif); font-weight: 400; font-size: clamp(21px,2.6vw,29px); color: var(--ink); }
        .bhead .n { font-family: var(--heading); font-size: 10px; letter-spacing: .14em; font-weight: 600; color: var(--stone); text-transform: uppercase; }
        .bhead .nav { margin-left: auto; display: flex; gap: 8px; }
        .bhead button { width: 38px; height: 38px; border: 1px solid var(--line-2); background: var(--paper-white); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; border-radius: 3px; transition: border-color 0.15s, background-color 0.15s; }
        .bhead button:hover { border-color: var(--ink); background: var(--shell); }
        .bhead button:disabled { opacity: .3; cursor: default; }
        .bhead button i { width: 8px; height: 8px; border-top: 1.5px solid var(--ink); border-right: 1.5px solid var(--ink); display: block; }
        .bhead button.prev i { transform: rotate(-135deg); margin-left: 3px; }
        .bhead button.next i { transform: rotate(45deg); margin-right: 3px; }
        .track { display: flex; gap: 14px; overflow-x: auto; scroll-behavior: smooth; scroll-snap-type: x mandatory; -ms-overflow-style: none; scrollbar-width: none; padding-bottom: 4px; }
        .track::-webkit-scrollbar { display: none; }
        .bcard { flex: 0 0 clamp(160px,20vw,214px); scroll-snap-align: start; text-decoration: none; color: inherit; }
        .bcard .im { aspect-ratio: 1; border: 1px solid var(--line-2); border-radius: 2px; }
        .bcard h3 { font-family: var(--serif); font-size: 16px; font-weight: 400; color: var(--ink); margin: 11px 0 3px; }
        .bcard span { font-family: var(--heading); font-size: 9px; letter-spacing: .12em; font-weight: 600; color: var(--stone); text-transform: uppercase; }
        .bcard:hover h3 { text-decoration: underline; text-underline-offset: 4px; }
        .bcard.cur .im { outline: 2px solid var(--ink); outline-offset: -2px; }

        /* CTA */
        .cta {
          background: var(--ink);
          padding: clamp(48px, 6vw, 80px) clamp(20px, 4vw, 48px);
          text-align: center;
          max-width: 1320px;
          width: calc(100% - (var(--pad) * 2));
          margin: clamp(32px, 5vw, 64px) auto clamp(48px, 7vw, 96px);
          border-radius: 4px;
        }
        .cta h2 { font-family: var(--serif); font-weight: 400; font-size: clamp(24px,3.4vw,38px); margin: 0 0 14px; color: #FAF8F5; }
        .cta p { font-family: var(--ui); max-width: 56ch; margin: 0 auto 26px; color: #D6D3D1; line-height: 1.7; }
        .cta .acts { justify-content: center; max-width: 430px; margin: 0 auto; }
        .cta .acts .wa { background: var(--brass); color: var(--ink); }
        .cta .acts .wa:hover { background: var(--paper-white); color: var(--ink); }
        .cta .acts .sm { border-color: rgba(255,255,255,0.3); color: #FAF8F5; background: transparent; }
        .cta .acts .sm:hover { border-color: #FFFFFF; background: rgba(255,255,255,0.1); }

        /* sticky */
        .sbar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 800; background: var(--ink); color: #FAF8F5; display: none; align-items: center; justify-content: space-between; gap: 14px; padding: 11px var(--pad); border-top: 1px solid rgba(255,255,255,0.15); box-shadow: 0 -10px 26px -18px rgba(0,0,0,0.5); }
        .sbar.on { display: flex; }
        .sbar b { display: block; font-family: var(--serif); font-size: 15px; font-weight: 400; color: #FAF8F5; }
        .sbar span { font-family: var(--heading); font-size: 9px; letter-spacing: .14em; text-transform: uppercase; color: var(--brass); font-weight: 600; }
        .sbar a { font-family: var(--heading); font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; background: var(--brass); color: var(--ink); text-decoration: none; padding: 12px 22px; border-radius: 3px; white-space: nowrap; transition: background 0.2s ease; }
        .sbar a:hover { background: var(--paper-white); }


        @media(max-width:900px){
          .hgrid { grid-template-columns: 1fr; }
          .tech, .two { grid-template-columns: 1fr; }
          .two > div:last-child { padding-left: 0; border-left: 0; }
          .reads4 { grid-template-columns: 1fr 1fr; }
          .reads4 > div:nth-child(odd) { padding-left: 0; border-left: 0; }
          .ovtop { grid-template-columns: 1fr; }
          .ovtop > div + div { padding-left: 0; border-left: 0; padding-top: 16px; }
        }
        @media(max-width:560px){
          .gal { grid-template-columns: 1fr; }
          .thumbs { flex-direction: row; }
          .thumbs button { flex: 1; }
          .rows > div { flex-direction: column; gap: 5px; }
          .rows b { flex: none; }
          .reads4 { grid-template-columns: 1fr; }
          .reads4 > div { padding-left: 0 !important; border-left: 0 !important; }
        }
        @media(max-width:420px){
          .keyspec { grid-template-columns: 1fr; }
          .keyspec div:nth-child(even) { padding-left: 0; border-left: 0; }
        }
      `}</style>

      {/* Breadcrumb Navigation */}
      <nav className="crumb">
        <div className="wrap">
          <a href="#">Home</a> / <a href="#">Wall Cladding</a> /{' '}
          <a href="#">Fieldstone Cladding</a> / <span>Cosmic Black</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="wrap">
          <div className="hgrid">
            {/* Gallery Column */}
            <div>
              <div className="gal">
                <div className="thumbs">
                  {slides.map((slide, idx) => (
                    <button
                      key={idx}
                      className={activeThumb === idx ? 'on' : ''}
                      onClick={() => setActiveThumb(idx)}
                      aria-label={slide.fn}
                    >
                      <i style={{ background: slide.bg }}></i>
                    </button>
                  ))}
                </div>
                <div>
                  <div className="gmain">
                    <i style={{ background: slides[activeThumb].bg }}></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div>
              <p className="pk">Stonefield Collection • Fieldstone Cladding</p>
              <h1>Cosmic Black</h1>
              <p className="psub">Natural sandstone  •  Trade name: Monsoon Black  •  STZ-SF-COBL</p>
              <p className="ptag">The shade for an elevation that should command.</p>

              <div className="keyspec">
                {specOptions.map((item) => (
                  <SpecSelect
                    key={item.key}
                    label={item.label}
                    value={specs[item.key]}
                    options={item.options}
                    onChange={(val) => handleSpecChange(item.key, val)}
                  />
                ))}
              </div>

              <div className="acts">
                <a className="wa" href="https://wa.me/917877108154?text=Hi%20Stoneza%2C%20I%27d%20like%20a%20quote%20for%20Cosmic%20Black%20Fieldstone" target="_blank" rel="noopener noreferrer">
                  Enquire on WhatsApp
                </a>
                <a className="sm" href="mailto:sales@stoneza.in?subject=Cosmic%20Black%20%E2%80%94%20sample%20request">
                  Request a sample
                </a>
              </div>

              <div className="trust">
                <div><b>Quarry-direct</b><span>No middlemen</span></div>
                <div><b>Pan-India</b><span>Insured delivery</span></div>
                <div><b>Custom</b><span>Sizes &amp; finishes</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accordions Section */}
      <div className="wrap">
        <div className="acc">
          {/* Product Overview Accordion */}
          <details defaultOpen>
            <summary>
              <h3>Product overview</h3>
              <span className="hint">Read</span>
              <i className="arw"></i>
            </summary>
            <div className="accbody wide">
              <div className="ovtop">
                <div>
                  <p>Deep charcoal with a quiet mineral shimmer that only shows when light crosses it at an angle. The colour to reach for when an elevation has to command rather than decorate — it makes a building read heavier and more deliberate than a pale stone does at the same cost.</p>
                  <p>Random 4″–18″ pieces, natural face with a tumbled top, calibrated on the back so the wall lays flat. Crates are pre-blended to a fixed ratio, which is what lets a phase-two extension match a wall built a year earlier.</p>
                </div>
                <div className="two" style={{ borderTop: 0, margin: 0, display: 'block' }}>
                  <div style={{ borderBottom: '1px solid var(--hair)', paddingTop: 0 }}>
                    <h4>Specify it for</h4>
                    <p>Entrance elevations, feature walls, boundary walls facing a street, and anywhere the building should read as substantial. Also the best of the seven behind landscape lighting, because it holds the light rather than bouncing it.</p>
                  </div>
                  <div style={{ paddingLeft: 0, borderLeft: 0, borderBottom: 0 }}>
                    <h4>We would steer you elsewhere for</h4>
                    <p>Enclosed courtyards and narrow spaces with little natural light, where it can close a space in. And full-sun west elevations in very hot regions, where dark stone gets genuinely hot to touch.</p>
                  </div>
                </div>
              </div>
              <h4>How it reads</h4>
              <div className="reads4">
                <div>
                  <h5>At a distance</h5>
                  <p>A single solid dark mass. Almost no visible variation from across a street, which is why it works on a large facade.</p>
                </div>
                <div>
                  <h5>Close up</h5>
                  <p>The mineral shimmer appears — fine lighter flecks catching light across the tumbled face.</p>
                </div>
                <div>
                  <h5>Through the day</h5>
                  <p>The most dramatic of the seven. Flat light reads almost black; raking light picks out every edge.</p>
                </div>
                <div>
                  <h5>When wet</h5>
                  <p>Deepens to near-black and the shimmer intensifies. Usually looks better wet than dry.</p>
                </div>
              </div>
            </div>
          </details>

          {/* Technical Data Sheet Accordion */}
          <details>
            <summary>
              <h3>Technical data sheet</h3>
              <span className="hint">18 values</span>
              <i className="arw"></i>
            </summary>
            <div className="accbody wide">
              <div className="tech">
                <table>
                  <tbody>
                    <tr><td>Product</td><td>Cosmic Black — Stonefield</td></tr>
                    <tr><td>Spec code</td><td><strong>STZ-SF-COBL</strong></td></tr>
                    <tr><td>Trade name</td><td>Monsoon Black</td></tr>
                    <tr><td>Stone type</td><td>Natural sandstone</td></tr>
                    <tr><td>Piece size</td><td>4″ – 18″ random</td></tr>
                    <tr><td>Calibrated thickness</td><td>18–28 mm</td></tr>
                    <tr><td>Face texture</td><td>Natural + tumbled top</td></tr>
                    <tr><td>Edges</td><td>Hand-cut sides</td></tr>
                    <tr><td>Product form</td><td>Crate pack — 220 sq ft</td></tr>
                  </tbody>
                </table>
                <table>
                  <tbody>
                    <tr><td>Weight</td><td>~54 kg/m² • 5 kg/sq ft</td></tr>
                    <tr><td>Water absorption</td><td>1.5–2.5% (moderate)</td></tr>
                    <tr><td>Density</td><td>2300 kg/m³</td></tr>
                    <tr><td>Weather resistance</td><td>Yes — exterior grade</td></tr>
                    <tr><td>Blend</td><td>Pre-blended, fixed ratio</td></tr>
                    <tr><td>Joint</td><td>Dry-stacked or recessed</td></tr>
                    <tr><td>Corner pieces</td><td>On request</td></tr>
                    <tr><td>Sealing</td><td>Impregnating sealer, exteriors</td></tr>
                    <tr><td>Lead time</td><td>In stock / 2–6 weeks</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </details>

          {/* FAQ Accordion */}
          <details>
            <summary>
              <h3>Questions</h3>
              <span className="hint">10 answers</span>
              <i className="arw"></i>
            </summary>
            <div className="accbody wide">
              <div className="faqs">
                <details>
                  <summary>Who supplies Cosmic Black fieldstone in India?</summary>
                  <div className="a">
                    <p>Stoneza — Anantay Exports Pvt. Ltd. — is a quarry-direct manufacturer, supplier and exporter of natural sandstone, operating from Bhilwara, Rajasthan since 1992.</p>
                    <p>We own our mines at Bijolia, Kota and Asind and cut, calibrate and finish at our own works, so the stone reaches you without a trader in the middle. We supply pan-India and export worldwide, direct to architects, PMC firms, contractors and developers.</p>
                  </div>
                </details>
                <details>
                  <summary>What is the price of Cosmic Black per square foot?</summary>
                  <div className="a">
                    <p>We quote ex-factory on request rather than publishing a rate, because the honest number depends on quantity, corner runs and delivery location. Transportation and GST are charged extra, as applicable.</p>
                    <p>Send the wall areas and you will get a firm quarry-direct figure with lead time, not an indicative range.</p>
                  </div>
                </details>
                <details>
                  <summary>What is Cosmic Black called in the trade?</summary>
                  <div className="a">
                    <p>Monsoon Black. Cosmic Black is our name for it, and the spec code is <strong>STZ-SF-COBL</strong>.</p>
                    <p>Quote the spec code on a BOQ rather than either name. The same stone is sold under several names across India, which is exactly how substitution happens on site after a specification has been approved.</p>
                  </div>
                </details>
                <details>
                  <summary>Does dark stone cladding get hot?</summary>
                  <div className="a">
                    <p>Yes, noticeably, on a full-sun elevation. It is rarely a problem on a wall — nobody stands against a facade — but it matters on a boundary wall people brush past, or where the wall wraps into a seating area.</p>
                    <p>In those places specify a lighter tone for the section people touch and keep Cosmic Black for the mass above.</p>
                  </div>
                </details>
                <details>
                  <summary>What does “pre-blended to a fixed ratio” mean?</summary>
                  <div className="a">
                    <p>Every crate contains the same proportion of each tone in the blend. The mix is set at our works rather than left to whoever loads the crate.</p>
                    <p>Hand-selected fieldstone is picked piece by piece, so a second delivery months later is a different wall — which is why phase-two extensions on hand-laid stone so often fail to match. A fixed ratio means the elevation you approve is the one you can still get next year.</p>
                  </div>
                </details>
                <details>
                  <summary>Do I need corner pieces, and how do I measure them?</summary>
                  <div className="a">
                    <p>On every external corner, yes. Corner units are available on request and should be ordered with the main material so they come from the same blend — ordered months later they come from a different lot and will not match.</p>
                    <p><strong>Measure corners in running feet, separately from the wall area.</strong> Do not take them out of the square-foot figure; they are a different unit and a different rate. Without corner units you see the calibrated back edge of the stone from one direction at every corner, which on a random-format wall is particularly obvious because nothing else on the wall is straight.</p>
                  </div>
                </details>
                <details>
                  <summary>How should the joint be finished?</summary>
                  <div className="a">
                    <p>Dry-stacked tight, or pointed with a <strong>recessed</strong> joint. Never flush.</p>
                    <p>A flush joint on a textured random-format stone reads as grout and flattens the whole wall — and once it is pointed, it cannot be undone without taking the cladding down. Match the mortar colour closely to the stone so the joint reads as shadow rather than as a line. Say this on the drawing and again to whoever is pointing the wall, because it is not what most masons expect.</p>
                  </div>
                </details>
                <details>
                  <summary>How much should I order, and how is it laid?</summary>
                  <div className="a">
                    <p>Measure the net wall area, deduct openings over about 1 m², and <strong>add 10%</strong> for cutting and breakage. On a random-format stone that allowance is real rather than nominal. Supply is crated at 220 sq ft and part crates cannot be blended correctly, so quantities round up to whole crates.</p>
                    <p>When laying, open several crates and work across all of them rather than down one. The blend ratio is fixed crate to crate, but within a crate the pieces vary by design — working off the top of a single stack will band the wall.</p>
                  </div>
                </details>
                <details>
                  <summary>How is it fixed, and how high can it go?</summary>
                  <div className="a">
                    <p>Adhesive on a prepared substrate carries it to about three metres. Above that a mechanical support system should be specified.</p>
                    <p>At ~54 kg per square metre the load is modest by cladding standards, but height is a structural question rather than a weight one — raise it with your consultant at design stage rather than at the scaffold. For exteriors use a breathable impregnating sealer, never a film-forming one, which traps moisture in the stone and eventually lifts.</p>
                  </div>
                </details>
                <details>
                  <summary>Do you export Cosmic Black, and what is the minimum order?</summary>
                  <div className="a">
                    <p>Yes. We export worldwide from Bhilwara, with container loading, export packing and documentation handled in-house.</p>
                    <p>Minimum order is project-based rather than a fixed crate count. For bulk and wholesale enquiries, container quantities and repeat programmes, send the schedule and we will quote FOB or CIF against it.</p>
                  </div>
                </details>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Browse Track 1 */}
      <section className="browse">
        <div className="wrap">
          <div className="bhead">
            <h2>Browse more in Fieldstone Cladding</h2>
            <span className="n">7 colours</span>
            <div className="nav">
              <button
                className="prev"
                onClick={() => scrollTrack(track1Ref, 'prev')}
                disabled={t1PrevDisabled}
                aria-label="Previous"
              >
                <i></i>
              </button>
              <button
                className="next"
                onClick={() => scrollTrack(track1Ref, 'next')}
                disabled={t1NextDisabled}
                aria-label="Next"
              >
                <i></i>
              </button>
            </div>
          </div>
          <div className="track" ref={track1Ref}>
            <a className="bcard" href="#">
              <div className="im" style={{ background: 'repeating-linear-gradient(38deg,#B08268 0 14px,#8A5840 14px 28px,#6E4634 28px 42px)' }}></div>
              <h3>Cosmic Rust</h3><span>Monsoon Multi</span>
            </a>
            <a className="bcard cur" href="#">
              <div className="im" style={{ background: 'repeating-linear-gradient(38deg,#565450 0 14px,#38352F 14px 28px,#232120 28px 42px)' }}></div>
              <h3>Cosmic Black</h3><span>Monsoon Black</span>
            </a>
            <a className="bcard" href="#">
              <div className="im" style={{ background: 'repeating-linear-gradient(38deg,#CBD1BC 0 14px,#AEB69C 14px 28px,#949C82 28px 42px)' }}></div>
              <h3>Mint Frost</h3><span>Gwalior Mint</span>
            </a>
            <a className="bcard" href="#">
              <div className="im" style={{ background: 'repeating-linear-gradient(38deg,#54524E 0 14px,#3A3835 14px 28px,#2A2826 28px 42px)' }}></div>
              <h3>Linea Black</h3><span>Sagar Black</span>
            </a>
            <a className="bcard" href="#">
              <div className="im" style={{ background: 'repeating-linear-gradient(38deg,#D8C7A8 0 14px,#B9A587 14px 28px,#9C8A6E 28px 42px)' }}></div>
              <h3>Rustic Blend</h3><span>Creamy Beige</span>
            </a>
            <a className="bcard" href="#">
              <div className="im" style={{ background: 'repeating-linear-gradient(38deg,#A2865F 0 14px,#836A48 14px 28px,#665238 28px 42px)' }}></div>
              <h3>Rustic Brown</h3><span>Rustic Mint</span>
            </a>
            <a className="bcard" href="#">
              <div className="im" style={{ background: 'repeating-linear-gradient(38deg,#E4E6DA 0 14px,#C6CABA 14px 28px,#ACB29E 28px 42px)' }}></div>
              <h3>White Mint</h3><span>Stonefield</span>
            </a>
          </div>
        </div>
      </section>

      {/* Browse Track 2 */}
      <section className="browse">
        <div className="wrap">
          <div className="bhead">
            <h2>More in Wall Cladding</h2>
            <span className="n">12 categories</span>
            <div className="nav">
              <button
                className="prev"
                onClick={() => scrollTrack(track2Ref, 'prev')}
                disabled={t2PrevDisabled}
                aria-label="Previous"
              >
                <i></i>
              </button>
              <button
                className="next"
                onClick={() => scrollTrack(track2Ref, 'next')}
                disabled={t2NextDisabled}
                aria-label="Next"
              >
                <i></i>
              </button>
            </div>
          </div>
          <div className="track" ref={track2Ref}>
            <a className="bcard" href="#">
              <div className="im" style={{ background: 'radial-gradient(130% 100% at 58% 14%,#C4B79E 0%,transparent 58%),repeating-linear-gradient(90deg,#A79A84 0 92px,#948873 92px 97px),#A0937E' }}></div>
              <h3>Facade Slabs</h3><span>23 stones</span>
            </a>
            <a className="bcard" href="#">
              <div className="im" style={{ background: 'radial-gradient(130% 100% at 58% 14%,#C4B79E 0%,transparent 58%),repeating-linear-gradient(0deg,#A79A84 0 42px,#8E8270 42px 47px),#A0937E' }}></div>
              <h3>EarthSkin</h3><span>8 tones</span>
            </a>
            <a className="bcard" href="#">
              <div className="im" style={{ background: 'radial-gradient(130% 100% at 62% 14%,#9A9086 0%,transparent 58%),repeating-linear-gradient(0deg,#7E7669 0 18px,#5E5850 18px 23px,#8A8175 23px 44px,#66605A 44px 49px),#6E675C' }}></div>
              <h3>Rockface &amp; Raw</h3><span>10 products</span>
            </a>
            <a className="bcard" href="#">
              <div className="im" style={{ background: 'radial-gradient(130% 100% at 50% 18%,#9C9184 0%,transparent 60%),repeating-linear-gradient(0deg,#847A6C 0 12px,#6E6558 12px 15px,#8E8476 15px 27px,#766D60 27px 30px),#7C7365' }}></div>
              <h3>Ledge Stone</h3><span>6 tones</span>
            </a>
            <a className="bcard" href="#">
              <div className="im" style={{ background: 'repeating-linear-gradient(0deg,#B09272 0 26px,#8E7458 26px 31px),repeating-linear-gradient(90deg,transparent 0 96px,#8E7458 96px 101px),#A88A6A' }}></div>
              <h3>Stone Bricks</h3><span>Brick format</span>
            </a>
            <a className="bcard" href="#">
              <div className="im" style={{ background: 'repeating-linear-gradient(90deg,#B4A894 0 14px,#8E8270 14px 18px,#C0B4A0 18px 32px,#968A78 32px 36px)' }}></div>
              <h3>Stone Flutes</h3><span>Machined</span>
            </a>
            <a className="bcard" href="#">
              <div className="im" style={{ background: 'repeating-linear-gradient(0deg,#4A4844 0 10px,#2E2C2A 10px 14px,#565450 14px 24px,#3A3835 24px 28px)' }}></div>
              <h3>Cascade</h3><span>2 stones</span>
            </a>
            <a className="bcard" href="#">
              <div className="im" style={{ background: 'radial-gradient(circle at 30% 32%,#EDE7DE 0 18px,transparent 20px),radial-gradient(circle at 70% 32%,#EDE7DE 0 18px,transparent 20px),radial-gradient(circle at 30% 70%,#EDE7DE 0 18px,transparent 20px),radial-gradient(circle at 70% 70%,#EDE7DE 0 18px,transparent 20px),#A2988A' }}></div>
              <h3>Carved Jaali</h3><span>Cut to drawing</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-8 py-8 divide-y divide-stone-300/40">
      <section className="py-12 ">
        <div className="bg-gradient-to-br from-[#2a231e] to-[#1c1714] text-[#e9e0d2] rounded-lg p-10 md:p-14 text-center shadow-xl">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#c8a980]">
            Start your project
          </span>
          <h2 className="font-serif font-light text-3xl md:text-5xl text-white mt-4 mb-4">
            Get Cosmic Black priced for <em className="italic text-[#c8a980]">your</em> project.
          </h2>
          <p className="text-sm text-stone-300 max-w-xl mx-auto leading-relaxed mb-8">
            Tell us your expected quantity and delivery site. A Stoneza consultant will calculate quarry-direct pricing, custom lead times, and arrange physical samples.
          </p>
          <button
            className="h-12 px-8 bg-[#c8a980] hover:bg-white text-[#1c1714] text-xs tracking-[3px] font-bold uppercase transition-all duration-300 rounded shadow-md cursor-pointer"
          >
            Request a Quote
          </button>
        </div>
      </section>
      </div>

      {/* Sticky Bottom Bar */}
      <div className={`sbar ${showSticky ? 'on' : ''}`}>
        <div>
          <b>Cosmic Black</b>
          <span>Price on request • ex-factory</span>
        </div>
        <a href="https://wa.me/917877108154?text=Hi%20Stoneza%2C%20I%27d%20like%20a%20quote%20for%20Cosmic%20Black%20Fieldstone" target="_blank" rel="noopener noreferrer">
          Enquire
        </a>
      </div>

    </div>
  );
}