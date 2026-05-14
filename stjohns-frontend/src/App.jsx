import { useState, useEffect, useRef } from "react";
import logo from "./assets/logo.png";
import front from "./assets/front.jpeg";

/* ─── DATA ──────────────────────────────────────────────────────────── */
const NAV = ["Home","Pages","Events","Sermons","Gallery","Blog","Shop","Causes"];

const NAV_DROPDOWNS = {
  Home:      [{ label:"Welcome",        href:"/" },
              { label:"Our Story",      href:"/our-story" },
              { label:"Vision",         href:"/vision" }],
  Pages:     [{ label:"About Us",       href:"/about" },
              { label:"Our Team",       href:"/team" },
              { label:"Contact",        href:"/contact" }],
  Events:    [{ label:"Upcoming Events",href:"/events" },
              { label:"Past Events",    href:"/events/past" },
              { label:"Calendar",       href:"/calendar" }],
  Sermons:   [{ label:"Sermon Archive", href:"/sermons" },
              { label:"Series",         href:"/sermons/series" },
              { label:"Speakers",       href:"/sermons/speakers" }],
  Gallery:   [{ label:"Photos",         href:"/gallery/photos" },
              { label:"Videos",         href:"/gallery/videos" }],
  Blog:      [{ label:"Latest Posts",   href:"/blog" },
              { label:"Categories",     href:"/blog/categories" }],
  Shop:      [{ label:"Store",          href:"/shop" },
              { label:"Cart",           href:"/cart" }],
  Causes:    [{ label:"Current Causes", href:"/causes" },
              { label:"Donate",         href:"/donate" }],
};

const EVENTS = [
  { day:"30", month:"JUN", name:"Summer fest",     day_label:"Tuesday", time:"June 30, 2020, 6:30 pm",  href:"/events/summer-fest"     },
  { day:"01", month:"JUL", name:"Monday Prayer",   day_label:"Monday",  time:"July 1, 2020, 9:00 am",   href:"/events/monday-prayer"   },
  { day:"07", month:"JUL", name:"Youth Gathering", day_label:"Sunday",  time:"July 7, 2020, 11:00 am",  href:"/events/youth-gathering" },
  { day:"14", month:"JUL", name:"Community Feast", day_label:"Sunday",  time:"July 14, 2020, 12:00 pm", href:"/events/community-feast" },
];

const SERMONS = [
  { date:"MARCH 7, 2020",     title:"How to Recover the Cutting Edge",  excerpt:"A powerful message about renewing your spiritual strength and reclaiming what was lost in the journey.", tag:"Faith",    href:"/sermons/cutting-edge"    },
  { date:"FEBRUARY 23, 2020", title:"Walking in the Light",             excerpt:"Understanding the path of righteousness and how to stay anchored in truth every single day.",              tag:"Guidance", href:"/sermons/walking-in-light" },
  { date:"FEBRUARY 9, 2020",  title:"The Power of Persistent Prayer",   excerpt:"Discover why persistence in prayer moves mountains and transforms the hearts of those who believe.",        tag:"Prayer",   href:"/sermons/persistent-prayer"},
];

const CARDS = [
  { label:"Our Pastors",     href:"/our-pastors"     },
  { label:"New Here",        href:"/new-here"        },
  { label:"Sermons Archive", href:"/sermons/archive" },
];

const COUNTDOWN_TARGET = new Date(Date.now() + 2*86400000 + 5*3600000 + 31*60000 + 35000);

/* ─── HOOKS ─────────────────────────────────────────────────────────── */
function useCountdown(target) {
  const calc = () => {
    const d = Math.max(0, target - Date.now());
    return { days:Math.floor(d/86400000), hrs:Math.floor((d%86400000)/3600000), mins:Math.floor((d%3600000)/60000), secs:Math.floor((d%60000)/1000) };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);
  return t;
}
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

/* ─── NAV ITEM with dropdown ─────────────────────────────────────────── */
function NavItem({ label, items }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="nc-nav-item"
      style={{ position:"relative" }}
      onMouseEnter={() => { if (items.length > 0) setOpen(true); }}
      onMouseLeave={() => setOpen(false)}
    >
      <span style={{ display:"flex", alignItems:"center", gap:"4px" }}>
        {label} <Chev />
      </span>
      {open && items.length > 0 && (
        <div style={{
          position:"absolute", top:"100%", left:0,
          background:"#fff", border:"1px solid #e4e4e0",
          borderRadius:"3px", minWidth:"200px",
          boxShadow:"0 8px 28px rgba(0,0,0,0.11)",
          zIndex:400, overflow:"hidden",
        }}>
          {items.map(item => (
            <a
              key={item.label}
              href={item.href}
              style={{
                display:"block", padding:"11px 20px",
                fontSize:"12px", fontWeight:700,
                letterSpacing:"0.8px", color:"#1c1c1c",
                textDecoration:"none", borderBottom:"1px solid #f0f0ec",
                transition:"background 0.15s, color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background="#f5f5f3"; e.currentTarget.style.color="#2a9d8f"; }}
              onMouseLeave={e => { e.currentTarget.style.background=""; e.currentTarget.style.color="#1c1c1c"; }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MOBILE NAV ITEM with accordion dropdown ──────────────────────── */
function MobileNavItem({ label, items, onClose }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:"1px solid #e4e4e0" }}>
      <div
        className="nc-nav-item"
        style={{ justifyContent:"space-between", padding:"14px 32px", fontSize:"12px" }}
        onClick={() => items.length > 0 ? setOpen(o => !o) : onClose()}
      >
        <span>{label}</span>
        {items.length > 0 && (
          <span style={{ fontSize:"10px", transform:open?"rotate(180deg)":"none", transition:"transform .2s", display:"inline-block" }}>▾</span>
        )}
      </div>
      {open && items.length > 0 && (
        <div style={{ background:"#f9f9f7" }}>
          {items.map(item => (
            <a
              key={item.label}
              href={item.href}
              style={{
                display:"block", padding:"11px 48px",
                fontSize:"11.5px", fontWeight:700,
                letterSpacing:"0.8px", color:"#2a9d8f",
                textDecoration:"none", borderBottom:"1px solid #f0f0ec",
              }}
              onClick={onClose}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── STYLES ─────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700;900&family=Nunito+Sans:wght@300;400;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Nunito Sans',sans-serif;color:#1c1c1c;background:#fff;overflow-x:hidden}
:root{
  --teal:#2a9d8f;--teal-d:#1e7a6e;--teal-l:#3dbdad;--teal-faint:rgba(42,157,143,.08);
  --dark:#1c1c1c;--light:#f5f5f3;--border:#e4e4e0;
  --serif:'Cormorant Garamond',Georgia,serif;
  --sans:'Nunito Sans',sans-serif;
  --max:1160px;--shadow:0 6px 32px rgba(0,0,0,.09);
}

/* TOPBAR */
.nc-topbar{
  background:#f2f2f0;border-bottom:1px solid #e0e0dc;
  display:flex;justify-content:flex-end;align-items:center;padding:7px 56px;
}
.nc-topbar a{
  font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;
  color:#666;text-decoration:none;padding:0 18px;border-right:1px solid #ccc;
  transition:color .2s;line-height:1;
}
.nc-topbar a:last-child{border-right:none;padding-right:0}
.nc-topbar a:hover{color:var(--teal)}

/* HEADER */
.nc-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:18px 56px;background:#fff;border-bottom:1px solid var(--border);
  position:sticky;top:0;z-index:200;
  transition:padding .3s,box-shadow .3s;
}
.nc-header.scrolled{padding:11px 56px;box-shadow:0 4px 28px rgba(0,0,0,.10)}

/* LOGO */
.nc-logo{display:flex;align-items:center;gap:13px;text-decoration:none;flex-shrink:0}
.nc-logo-mark{width:48px;height:48px;background:var(--dark);border-radius:50%;display:flex;align-items:center;justify-content:center;}
.nc-logo-mark svg{width:26px;height:26px;fill:#fff}
.nc-logo-mark img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.nc-logo-text .brand{font-family:var(--serif);font-size:23px;font-weight:900;color:var(--dark);letter-spacing:.5px;line-height:1}
.nc-logo-text .brand em{font-style:normal;font-weight:400}
.nc-logo-text .sub{font-size:9px;letter-spacing:3.5px;text-transform:uppercase;color:#aaa;font-weight:700;margin-top:3px}

/* NAV */
.nc-nav{display:flex;align-items:center}
.nc-nav-item{
  display:flex;align-items:center;gap:4px;padding:10px 13px;
  font-size:11px;font-weight:800;letter-spacing:1.1px;text-transform:uppercase;
  color:var(--dark);cursor:pointer;position:relative;
  transition:color .2s;white-space:nowrap;user-select:none;
}
.nc-nav-item svg{width:7px;height:7px;fill:currentColor;opacity:.4;flex-shrink:0}
.nc-nav-item::after{
  content:'';position:absolute;bottom:4px;left:13px;right:13px;height:2px;
  background:var(--teal);border-radius:2px;
  transform:scaleX(0);transform-origin:left;transition:transform .22s;
}
.nc-nav-item:hover{color:var(--teal)}
.nc-nav-item:hover::after{transform:scaleX(1)}

/* HAMBURGER */
.nc-burger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:5px;margin-left:10px}
.nc-burger span{display:block;width:26px;height:2px;background:var(--dark);border-radius:2px;transition:all .3s}
.nc-burger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}
.nc-burger.open span:nth-child(2){opacity:0}
.nc-burger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}
.nc-mnav{
  display:none;flex-direction:column;position:absolute;top:100%;left:0;right:0;
  background:#fff;border-top:1px solid var(--border);
  box-shadow:0 12px 40px rgba(0,0,0,.12);z-index:199;
  animation:slideD .3s ease;
}
.nc-mnav.open{display:flex}
@keyframes slideD{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}

/* HERO */
.nc-hero{position:relative;height:500px;overflow:hidden;display:flex;align-items:center;justify-content:center;}
.nc-hero-canvas{position:absolute;inset:0;width:100%;height:120%}
.nc-hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(20,8,0,.14) 0%,rgba(0,0,0,.04) 50%,rgba(0,0,0,.26) 100%);}
.nc-hero-text{position:relative;z-index:2;text-align:center;animation:heroIn 1.4s cubic-bezier(.22,1,.36,1) both; margin-top: 350px;}
.nc-hero-text h1{
  font-family:var(--serif);font-size:clamp(30px,4vw,58px);font-weight:900;
  color:rgba(255,255,255,.93);letter-spacing:clamp(10px,2.2vw,26px);text-transform:uppercase;
  text-shadow:0 2px 30px rgba(0,0,0,.28),0 0 90px rgba(180,100,30,.22);line-height:1;
}
.nc-hero-btn{
  display:inline-block;margin-top:28px;padding:14px 36px;
  background:var(--teal);color:#fff;text-decoration:none;
  font-size:11px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;
  border-radius:2px;border:2px solid transparent;
  transition:background .2s,border-color .2s,transform .15s;
}
.nc-hero-btn:hover{background:var(--teal-d);transform:translateY(-2px)}
@keyframes heroIn{from{opacity:0;transform:translateY(26px) scale(.97)}to{opacity:1;transform:none}}

/* COUNTDOWN BAR */
.nc-cbar{
  background:#fff;border-bottom:1px solid var(--border);
  display:flex;align-items:center;padding:0 56px;min-height:80px;gap:28px;
  box-shadow:0 2px 10px rgba(0,0,0,.04);
}
.nc-cbar-left{display:flex;align-items:center;gap:14px;flex-shrink:0}
.nc-cbar-left svg{width:40px;height:40px;fill:#b8b8b0}
.nc-next-badge{display:inline-block;background:var(--teal);color:#fff;font-size:8.5px;font-weight:800;letter-spacing:2px;padding:3px 8px;border-radius:2px;text-transform:uppercase;margin-bottom:3px;}
.nc-upcoming-lbl{font-size:10px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:#aaa}
.nc-cbar-event{flex:1;min-width:0}
.nc-cbar-event .ename{font-family:var(--serif);font-size:21px;font-weight:700;color:var(--dark)}
.nc-cbar-event .ename a{color:var(--dark);text-decoration:none;transition:color .2s}
.nc-cbar-event .ename a:hover{color:var(--teal)}
.nc-cbar-event .edate{font-size:12px;color:#aaa;margin-top:2px}
.nc-cd-nums{display:flex;align-items:flex-start;gap:12px;flex-shrink:0}
.nc-cd-unit{text-align:center}
.nc-cd-num{font-family:var(--serif);font-size:30px;font-weight:700;color:var(--dark);background:var(--light);border:1px solid var(--border);border-radius:3px;padding:5px 16px;min-width:68px;display:block;}
.nc-cd-unit:first-child .nc-cd-num{color:var(--teal);background:var(--teal-faint);border-color:var(--teal-l);animation:cdPulse 1s ease infinite;}
@keyframes cdPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
.nc-cd-lbl{font-size:9.5px;letter-spacing:1.8px;text-transform:uppercase;color:#bbb;font-weight:700;margin-top:5px}
.nc-all-btn{
  background:var(--teal);color:#fff;border:none;
  padding:17px 34px;font-size:10.5px;font-weight:800;letter-spacing:2px;text-transform:uppercase;
  cursor:pointer;border-radius:2px;white-space:nowrap;flex-shrink:0;
  box-shadow:0 4px 18px rgba(42,157,143,.26);
  transition:background .2s,transform .15s,box-shadow .2s;
  text-decoration:none;display:inline-flex;align-items:center;
}
.nc-all-btn:hover{background:var(--teal-d);transform:translateY(-2px);box-shadow:0 8px 28px rgba(42,157,143,.36)}
.nc-all-btn:active{transform:none}

/* CARDS */
.nc-cards{padding:56px 56px 44px;background:#fff}
.nc-cards-inner{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;max-width:var(--max);margin:0 auto;}
.nc-card{
  position:relative;height:215px;overflow:hidden;border-radius:2px;cursor:pointer;
  opacity:0;transform:translateY(34px);
  transition:opacity .55s ease,transform .55s ease,box-shadow .3s;
  text-decoration:none;display:block;
}
.nc-card.vis{opacity:1;transform:none}
.nc-card:nth-child(1){transition-delay:.00s}
.nc-card:nth-child(2){transition-delay:.11s}
.nc-card:nth-child(3){transition-delay:.22s}
.nc-card:hover{box-shadow:0 14px 44px rgba(0,0,0,.20)}
.nc-card-img{position:absolute;inset:0;width:100%;height:100%;filter:grayscale(100%);transition:transform .55s cubic-bezier(.22,1,.36,1),filter .4s;display:block;}
.nc-card:hover .nc-card-img{transform:scale(1.06);filter:grayscale(50%)}
.nc-card-lbl{
  position:absolute;bottom:0;left:0;
  background:var(--teal);color:#fff;
  font-size:13.5px;font-weight:700;letter-spacing:.4px;
  padding:12px 26px;border-radius:0 3px 0 0;
  transition:background .2s,padding-left .2s;
}
.nc-card:hover .nc-card-lbl{background:var(--teal-d);padding-left:32px}

/* BODY */
.nc-body{max-width:var(--max);margin:0 auto;padding:20px 56px 72px;display:grid;grid-template-columns:1fr 1fr;gap:60px}

/* SECTION TITLE */
.nc-sec-title{font-family:var(--serif);font-size:28px;font-weight:700;color:var(--dark);padding-bottom:14px;margin-bottom:26px;position:relative;}
.nc-sec-title::after{content:'';position:absolute;bottom:0;left:0;width:42px;height:3px;background:var(--teal);border-radius:2px}
.nc-sec-title a{color:var(--dark);text-decoration:none;transition:color .2s}
.nc-sec-title a:hover{color:var(--teal)}

/* EVENT ITEMS */
.nc-ev{
  display:flex;align-items:center;gap:22px;
  padding:20px 0;border-bottom:1px solid var(--border);cursor:pointer;
  opacity:0;transform:translateX(-20px);transition:opacity .5s,transform .5s;
}
.nc-ev.vis{opacity:1;transform:none}
.nc-ev:nth-child(1){transition-delay:.00s}
.nc-ev:nth-child(2){transition-delay:.10s}
.nc-ev:nth-child(3){transition-delay:.20s}
.nc-ev:nth-child(4){transition-delay:.30s}
.nc-ev-date{text-align:center;min-width:50px;flex-shrink:0}
.nc-ev-day{font-family:var(--serif);font-size:36px;font-weight:900;color:var(--dark);line-height:1}
.nc-ev-month{font-size:9.5px;letter-spacing:2px;text-transform:uppercase;color:#bbb;font-weight:800;margin-top:1px}
.nc-ev-info{flex:1;min-width:0}
.nc-ev-name{font-family:var(--serif);font-size:17px;font-weight:700;color:var(--teal);text-decoration:none;display:flex;align-items:center;gap:7px;transition:color .2s;}
.nc-ev-name svg{width:12px;height:12px;fill:currentColor;opacity:.5}
.nc-ev-name:hover{color:var(--teal-d)}
.nc-ev-meta{font-size:11.5px;color:#b0b0a8;margin-top:3px}
.nc-ev-meta strong{color:#888}
.nc-det-btn{
  border:1px solid var(--border);background:transparent;
  font-size:9.5px;font-weight:800;letter-spacing:1.8px;text-transform:uppercase;
  padding:8px 16px;cursor:pointer;color:#999;border-radius:2px;
  flex-shrink:0;white-space:nowrap;transition:all .2s;
  text-decoration:none;display:inline-block;
}
.nc-det-btn:hover{background:var(--teal);color:#fff;border-color:var(--teal)}

/* SERMON CARDS */
.nc-sermon{
  background:var(--light);border:1px solid var(--border);border-radius:3px;
  padding:22px 26px;margin-bottom:18px;cursor:pointer;
  opacity:0;transform:translateX(20px);
  transition:opacity .5s,transform .5s,box-shadow .25s,border-color .25s;
  text-decoration:none;display:block;color:inherit;
}
.nc-sermon.vis{opacity:1;transform:none}
.nc-sermon:nth-child(1){transition-delay:.05s}
.nc-sermon:nth-child(2){transition-delay:.18s}
.nc-sermon:nth-child(3){transition-delay:.31s}
.nc-sermon:hover{box-shadow:var(--shadow);border-color:var(--teal-l)}
.nc-sermon-date{font-size:9.5px;letter-spacing:2px;text-transform:uppercase;color:#c0c0b8;font-weight:800;margin-bottom:8px}
.nc-sermon-title{font-family:var(--serif);font-size:18px;font-weight:700;color:var(--teal);letter-spacing:.3px;text-transform:uppercase;line-height:1.25;transition:color .2s;}
.nc-sermon:hover .nc-sermon-title{color:var(--teal-d)}
.nc-sermon-excerpt{font-size:13px;color:#888;margin-top:9px;line-height:1.65}
.nc-sermon-tag{display:inline-block;background:var(--teal-faint);color:var(--teal);font-size:9.5px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;padding:4px 10px;border-radius:2px;margin-top:12px;}

/* VIEW ALL LINK */
.nc-view-all{
  display:inline-flex;align-items:center;gap:6px;margin-top:20px;
  font-size:11px;font-weight:800;letter-spacing:1.8px;text-transform:uppercase;
  color:var(--teal);text-decoration:none;
  transition:gap .2s,color .2s;
}
.nc-view-all:hover{color:var(--teal-d);gap:10px}

/* FOOTER */
.nc-footer{background:#1a1a18;}
.nc-footer-top{
  max-width:var(--max);margin:0 auto;
  display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;
  padding:56px 56px 40px;
}
.nc-footer-brand .brand{font-family:var(--serif);font-size:22px;font-weight:900;color:#fff;letter-spacing:.5px}
.nc-footer-brand .brand em{font-style:normal;font-weight:400}
.nc-footer-brand p{font-size:13px;color:rgba(255,255,255,.45);margin-top:12px;line-height:1.7;max-width:260px}
.nc-footer-col h4{font-size:10px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:16px}
.nc-footer-col a{display:block;font-size:13px;color:rgba(255,255,255,.55);text-decoration:none;margin-bottom:10px;transition:color .2s}
.nc-footer-col a:hover{color:var(--teal)}
.nc-footer-bottom{
  border-top:1px solid rgba(255,255,255,.08);
  display:flex;align-items:center;justify-content:center;gap:14px;
  padding:20px 56px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;
  color:rgba(255,255,255,.28);
}
.nc-footer-bottom span{color:var(--teal)}
.nc-footer-dot{color:#333}

/* SCROLL TOP */
.nc-top{
  position:fixed;bottom:32px;right:32px;
  width:46px;height:46px;background:var(--teal);color:#fff;border:none;
  border-radius:50%;cursor:pointer;font-size:18px;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 18px rgba(42,157,143,.4);
  opacity:0;pointer-events:none;
  transition:opacity .3s,transform .3s,background .2s;z-index:999;
}
.nc-top.show{opacity:1;pointer-events:all}
.nc-top:hover{background:var(--teal-d);transform:translateY(-3px) scale(1.08)}

/* RESPONSIVE */
@media(max-width:1100px){
  .nc-topbar,.nc-header,.nc-cbar,.nc-cards,.nc-body,.nc-footer-top,.nc-footer-bottom{padding-left:32px;padding-right:32px}
  .nc-header.scrolled{padding-left:32px;padding-right:32px}
  .nc-footer-top{grid-template-columns:1fr 1fr;gap:32px}
}
@media(max-width:860px){
  .nc-nav{display:none}.nc-burger{display:flex}
  .nc-cards-inner{grid-template-columns:repeat(2,1fr)}
  .nc-body{grid-template-columns:1fr;gap:36px;padding-top:12px}
  .nc-hero{height:400px}
}
@media(max-width:600px){
  .nc-topbar{display:none}
  .nc-cards-inner{grid-template-columns:1fr}
  .nc-cbar{flex-wrap:wrap;padding:16px 20px;gap:14px;min-height:auto}
  .nc-all-btn{width:100%;text-align:center;justify-content:center}
  .nc-cd-nums{gap:8px}
  .nc-cd-num{font-size:22px;min-width:52px;padding:4px 10px}
  .nc-hero{height:270px}
  .nc-topbar,.nc-header,.nc-cards,.nc-body,.nc-footer-top,.nc-footer-bottom{padding-left:20px;padding-right:20px}
  .nc-footer-top{grid-template-columns:1fr}
}
`;

/* ─── SVG CARD SCENES ─────────────────────────────────────────────── */
const Scene1 = () => (
  <svg viewBox="0 0 700 215" xmlns="http://www.w3.org/2000/svg"
    className="nc-card-img" style={{display:'block',background:'#d4cfca'}}>
    <defs><radialGradient id="s1bg" cx="38%" cy="28%" r="72%"><stop offset="0%" stopColor="#eae4dc"/><stop offset="100%" stopColor="#c4bcb4"/></radialGradient></defs>
    <rect width="700" height="215" fill="url(#s1bg)"/>
    <ellipse cx="350" cy="230" rx="420" ry="90" fill="#b4acaa"/>
    <circle cx="140" cy="80" r="72" fill="#ddd8d0" opacity=".4"/>
    <circle cx="265" cy="82" r="23" fill="#5a5450"/><rect x="242" y="105" width="46" height="65" rx="10" fill="#5a5450"/>
    <line x1="242" y1="122" x2="218" y2="160" stroke="#5a5450" strokeWidth="15" strokeLinecap="round"/>
    <line x1="288" y1="122" x2="312" y2="158" stroke="#5a5450" strokeWidth="15" strokeLinecap="round"/>
    <line x1="252" y1="170" x2="246" y2="205" stroke="#5a5450" strokeWidth="14" strokeLinecap="round"/>
    <line x1="278" y1="170" x2="284" y2="205" stroke="#5a5450" strokeWidth="14" strokeLinecap="round"/>
    <circle cx="370" cy="88" r="21" fill="#6a6260"/><rect x="349" y="109" width="42" height="58" rx="9" fill="#6a6260"/>
    <line x1="349" y1="124" x2="327" y2="156" stroke="#6a6260" strokeWidth="14" strokeLinecap="round"/>
    <line x1="391" y1="124" x2="411" y2="154" stroke="#6a6260" strokeWidth="14" strokeLinecap="round"/>
    <line x1="359" y1="167" x2="353" y2="198" stroke="#6a6260" strokeWidth="13" strokeLinecap="round"/>
    <line x1="381" y1="167" x2="387" y2="198" stroke="#6a6260" strokeWidth="13" strokeLinecap="round"/>
    <circle cx="318" cy="138" r="14" fill="#4a4440"/><rect x="304" y="152" width="28" height="38" rx="7" fill="#4a4440"/>
    <line x1="304" y1="162" x2="288" y2="184" stroke="#4a4440" strokeWidth="11" strokeLinecap="round"/>
    <line x1="332" y1="162" x2="346" y2="182" stroke="#4a4440" strokeWidth="11" strokeLinecap="round"/>
    <line x1="310" y1="190" x2="305" y2="210" stroke="#4a4440" strokeWidth="10" strokeLinecap="round"/>
    <line x1="326" y1="190" x2="331" y2="210" stroke="#4a4440" strokeWidth="10" strokeLinecap="round"/>
  </svg>
);
const Scene2 = () => (
  <svg viewBox="0 0 700 215" xmlns="http://www.w3.org/2000/svg"
    className="nc-card-img" style={{display:'block',background:'#cac7c0'}}>
    <defs><radialGradient id="s2bg" cx="50%" cy="18%" r="62%"><stop offset="0%" stopColor="#ddd8d2"/><stop offset="100%" stopColor="#b8b4ac"/></radialGradient></defs>
    <rect width="700" height="215" fill="url(#s2bg)"/>
    <circle cx="190" cy="58" r="58" fill="#e0dcd4" opacity=".32"/>
    <circle cx="350" cy="70" r="27" fill="#5c5856"/>
    <rect x="323" y="97" width="54" height="70" rx="12" fill="#5c5856"/>
    <line x1="323" y1="116" x2="288" y2="147" stroke="#5c5856" strokeWidth="17" strokeLinecap="round"/>
    <line x1="377" y1="116" x2="412" y2="147" stroke="#5c5856" strokeWidth="17" strokeLinecap="round"/>
    <ellipse cx="346" cy="150" rx="19" ry="13" fill="#4a4644" transform="rotate(-16 346 150)"/>
    <ellipse cx="366" cy="146" rx="19" ry="13" fill="#525050" transform="rotate(16 366 146)"/>
    <line x1="336" y1="167" x2="328" y2="204" stroke="#5c5856" strokeWidth="16" strokeLinecap="round"/>
    <line x1="364" y1="167" x2="372" y2="204" stroke="#5c5856" strokeWidth="16" strokeLinecap="round"/>
  </svg>
);
const Scene3 = () => (
  <svg viewBox="0 0 700 215" xmlns="http://www.w3.org/2000/svg"
    className="nc-card-img" style={{display:'block',background:'#0e0e0e'}}>
    <defs>
      <radialGradient id="sp1" cx="18%" cy="0%" r="48%"><stop offset="0%" stopColor="#fff" stopOpacity=".18"/><stop offset="100%" stopColor="transparent"/></radialGradient>
      <radialGradient id="sp2" cx="50%" cy="0%" r="55%"><stop offset="0%" stopColor="#fff" stopOpacity=".23"/><stop offset="100%" stopColor="transparent"/></radialGradient>
      <radialGradient id="sp3" cx="82%" cy="0%" r="48%"><stop offset="0%" stopColor="#fff" stopOpacity=".17"/><stop offset="100%" stopColor="transparent"/></radialGradient>
    </defs>
    <rect width="700" height="215" fill="#0e0e0e"/>
    <rect width="700" height="215" fill="url(#sp1)"/>
    <rect width="700" height="215" fill="url(#sp2)"/>
    <rect width="700" height="215" fill="url(#sp3)"/>
    <rect x="0" y="150" width="700" height="65" fill="#080808"/>
    {[42,86,128,168,208,248,290,332,374,416,458,500,542,586,630].map((x,i)=>(
      <g key={i} transform={`translate(${x},${150+(i%3)*4})`}>
        <ellipse cx="0" cy="12" rx="15" ry="18" fill={i%2?'#2a2a2a':'#222'}/>
        <circle cx="0" cy="-2" r="10" fill={i%2?'#1e1e1e':'#252525'}/>
        <line x1="-11" y1="2" x2={-21-(i%2)*3} y2={-20-(i%3)*7} stroke="#2e2e2e" strokeWidth="7" strokeLinecap="round"/>
        <line x1="11" y1="2" x2={21+(i%2)*3} y2={-20-(i%3)*7} stroke="#303030" strokeWidth="7" strokeLinecap="round"/>
      </g>
    ))}
  </svg>
);

const Chev = () => (
  <svg viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0l5 6 5-6H0z"/>
  </svg>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
export default function NativeChurch() {
  const [scrolled,  setScrolled]  = useState(false);
  const [showTop,   setShowTop]   = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  const [cardsRef, cardsVis] = useReveal(.1);
  const [evRef,    evVis]    = useReveal(.1);
  const [serRef,   serVis]   = useReveal(.1);

  const { days, hrs, mins, secs } = useCountdown(COUNTDOWN_TARGET);
  const pad = n => String(n).padStart(2,"0");

  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 50); setShowTop(window.scrollY > 320); };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style>{CSS}</style>

      {/* ── TOP BAR ── */}
      <div className="nc-topbar">
        <a href="/calendar">Calendar</a>
        <a href="/donate">Donate Now</a>
      </div>

      {/* ── HEADER ── */}
      <header className={`nc-header${scrolled?" scrolled":""}`} style={{position:"sticky",top:0}}>
        <a href="/" className="nc-logo">
          <div className="nc-logo-mark">
            <img src={logo} alt="logo"/>
          </div>
          <div className="nc-logo-text">
            <div className="brand">NATIVE <em>CHURCH</em></div>
            <div className="sub">Live the Love</div>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="nc-nav">
          {NAV.map(n => (
            <NavItem key={n} label={n} items={NAV_DROPDOWNS[n] || []} />
          ))}
        </nav>

        {/* Hamburger */}
        <div className={`nc-burger${menuOpen?" open":""}`} onClick={() => setMenuOpen(o => !o)}>
          <span/><span/><span/>
        </div>

        {/* Mobile nav with accordion dropdowns */}
        <nav className={`nc-mnav${menuOpen?" open":""}`}>
          {NAV.map(n => (
            <MobileNavItem
              key={n}
              label={n}
              items={NAV_DROPDOWNS[n] || []}
              onClose={() => setMenuOpen(false)}
            />
          ))}
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="nc-hero">
        <img src={front} alt="hero" className="nc-hero-canvas"/>
        <div className="nc-hero-overlay"/>
        <div className="nc-hero-text">
          <h1>Find Your Way Back Home</h1>
        </div>
      </section>

      {/* ── COUNTDOWN BAR ── */}
      <div className="nc-cbar">
        <div className="nc-cbar-left">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
          <div>
            <div><span className="nc-next-badge">NEXT</span></div>
            <div className="nc-upcoming-lbl">Upcoming Event</div>
          </div>
        </div>
        <div className="nc-cbar-event">
          <div className="ename">
            <a href="/events/summer-fest">Summer fest</a>
          </div>
          <div className="edate">June 30, 2020</div>
        </div>
        <div className="nc-cd-nums">
          {[{v:days,l:"days"},{v:hrs,l:"hrs"},{v:mins,l:"mins"},{v:secs,l:"secs"}].map(({v,l})=>(
            <div className="nc-cd-unit" key={l}>
              <span className="nc-cd-num">{pad(v)}</span>
              <div className="nc-cd-lbl">{l}</div>
            </div>
          ))}
        </div>
        <a href="/events" className="nc-all-btn">All Events</a>
      </div>

      {/* ── CARDS ── */}
      <section className="nc-cards">
        <div className="nc-cards-inner" ref={cardsRef}>
          {[{s:<Scene1/>,l:"Our Pastors",href:"/our-pastors"},
            {s:<Scene2/>,l:"New Here",href:"/new-here"},
            {s:<Scene3/>,l:"Sermons Archive",href:"/sermons/archive"}
          ].map(({s,l,href})=>(
            <a key={l} href={href} className={`nc-card${cardsVis?" vis":""}`}>
              {s}
              <div className="nc-card-lbl">{l}</div>
            </a>
          ))}
        </div>
      </section>

      {/* ── EVENTS + SERMONS ── */}
      <div className="nc-body">

        {/* Events */}
        <div>
          <h2 className="nc-sec-title">
            <a href="/events">More Coming Events</a>
          </h2>
          <div ref={evRef}>
            {EVENTS.map((ev,i)=>(
              <div key={i} className={`nc-ev${evVis?" vis":""}`}>
                <div className="nc-ev-date">
                  <div className="nc-ev-day">{ev.day}</div>
                  <div className="nc-ev-month">{ev.month}</div>
                </div>
                <div className="nc-ev-info">
                  <a href={ev.href} className="nc-ev-name">
                    {ev.name}
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm.5 12H11V11h1.5v5zm0-6H11V8.5h1.5V10z"/>
                    </svg>
                  </a>
                  <div className="nc-ev-meta"><strong>{ev.day_label}</strong> | {ev.time}</div>
                </div>
                <a href={ev.href} className="nc-det-btn">Details</a>
              </div>
            ))}
          </div>
          <a href="/events" className="nc-view-all">View all events →</a>
        </div>

        {/* Sermons */}
        <div>
          <h2 className="nc-sec-title">
            <a href="/sermons">Recent Sermons</a>
          </h2>
          <div ref={serRef}>
            {SERMONS.map((s,i)=>(
              <a key={i} href={s.href} className={`nc-sermon${serVis?" vis":""}`}>
                <div className="nc-sermon-date">{s.date}</div>
                <div className="nc-sermon-title">{s.title}</div>
                <div className="nc-sermon-excerpt">{s.excerpt}</div>
                <span className="nc-sermon-tag">{s.tag}</span>
              </a>
            ))}
          </div>
          <a href="/sermons" className="nc-view-all">View all sermons →</a>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="nc-footer">
        <div className="nc-footer-top">
          <div className="nc-footer-brand">
            <div className="brand">NATIVE <em>CHURCH</em></div>
            <p>A community built on love. Everyone is welcome — no matter where you've been or where you're going.</p>
          </div>
          <div className="nc-footer-col">
            <h4>Visit</h4>
            <a href="/our-story">Our Story</a>
            <a href="/our-pastors">Our Pastors</a>
            <a href="/team">Our Team</a>
            <a href="/contact">Contact</a>
          </div>
          <div className="nc-footer-col">
            <h4>Connect</h4>
            <a href="/events">Events</a>
            <a href="/calendar">Calendar</a>
            <a href="/sermons">Sermons</a>
            <a href="/blog">Blog</a>
            <a href="/gallery/photos">Gallery</a>
          </div>
          <div className="nc-footer-col">
            <h4>Give</h4>
            <a href="/donate">Donate Now</a>
            <a href="/causes">Current Causes</a>
            <a href="/shop">Shop</a>
          </div>
        </div>
        <div className="nc-footer-bottom">
          © 2024 <span>Native Church</span>
          <span className="nc-footer-dot">·</span>
          Live the Love
        </div>
      </footer>

      {/* ── SCROLL TO TOP ── */}
      <button
        className={`nc-top${showTop?" show":""}`}
        onClick={() => window.scrollTo({top:0,behavior:"smooth"})}
        aria-label="Back to top"
      >↑</button>
    </>
  );
}