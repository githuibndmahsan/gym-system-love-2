import { useState, useEffect, useRef, useCallback } from "react";

/* ─── FONTS & GLOBAL ─────────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:#080808;color:#f0f0f0;font-family:'DM Sans',sans-serif;}
input,select,button,textarea{font-family:inherit;outline:none;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:2px;}
a{text-decoration:none;color:inherit;}

.nav-link{position:relative;font-size:13px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:#aaa;cursor:pointer;padding:4px 0;transition:color .2s;}
.nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:#FF5A00;transition:width .25s;}
.nav-link:hover{color:#fff;}
.nav-link:hover::after,.nav-link.active::after{width:100%;}
.nav-link.active{color:#FF5A00;}

.class-card{position:relative;overflow:hidden;border-radius:14px;cursor:pointer;}
.class-card img{width:100%;height:100%;object-fit:cover;transition:transform .5s;}
.class-card:hover img{transform:scale(1.07);}
.class-card .overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(0,0,0,.85) 100%);transition:opacity .3s;}
.class-card:hover .overlay{opacity:.7;}

.trainer-card{background:#141414;border:1px solid #1f1f1f;border-radius:18px;overflow:hidden;transition:all .3s;cursor:pointer;}
.trainer-card:hover{border-color:#FF5A0044;transform:translateY(-4px);box-shadow:0 12px 40px rgba(255,90,0,.12);}

.plan-card{background:#141414;border-radius:20px;padding:30px 24px;border:1px solid #1f1f1f;transition:all .3s;position:relative;overflow:hidden;}
.plan-card.featured{border-color:#FF5A0055;background:#181818;}
.plan-card:hover{transform:translateY(-6px);}

.btn-primary{background:linear-gradient(135deg,#FF5A00,#FF8C00);color:#fff;border:none;border-radius:10px;padding:13px 28px;font-size:14px;font-weight:700;letter-spacing:.5px;cursor:pointer;transition:all .2s;font-family:inherit;}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(255,90,0,.4);}
.btn-outline{background:transparent;color:#fff;border:2px solid #fff;border-radius:10px;padding:11px 28px;font-size:14px;font-weight:700;letter-spacing:.5px;cursor:pointer;transition:all .2s;font-family:inherit;}
.btn-outline:hover{background:#fff;color:#080808;}

.stat-num{font-family:'Barlow Condensed',sans-serif;font-weight:900;letter-spacing:-1px;}
.section-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;letter-spacing:-0.5px;line-height:1;}

@keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes pulse-dot{0%,100%{transform:scale(1);}50%{transform:scale(1.4);}}
@keyframes ticker{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
@keyframes slideDown{from{opacity:0;transform:translateY(-10px);}to{opacity:1;transform:translateY(0);}}
@keyframes toastIn{from{transform:translateX(20px);opacity:0;}to{transform:none;opacity:1;}}
@keyframes spin{to{transform:rotate(360deg);}}

.fade-up{animation:fadeUp .6s ease both;}
.delay-1{animation-delay:.1s;}
.delay-2{animation-delay:.2s;}
.delay-3{animation-delay:.3s;}
.delay-4{animation-delay:.4s;}

/* Admin sidebar */
:root{--accent:#FF5A00;--bg:#080808;--surface:#0f0f0f;--card:#141414;--border:#1f1f1f;}
`;

/* ─── CONSTANTS ──────────────────────────────────────────────────────── */
const ORANGE = "#FF5A00";
const BG = "#080808";
const CARD = "#141414";
const BORDER = "#1f1f1f";
const SURFACE = "#0f0f0f";

const CLASSES = [
  { name:"Weight Lifting", tag:"STRENGTH", duration:"60 min", calories:"450 kcal", level:"Advanced", trainer:"Ali Hassan",   img:"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80" },
  { name:"HIIT & Cardio",  tag:"CARDIO",   duration:"45 min", calories:"600 kcal", level:"All Levels", trainer:"Omar Farooq", img:"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80" },
  { name:"Yoga & Recovery",tag:"WELLNESS", duration:"60 min", calories:"200 kcal", level:"Beginner",  trainer:"Sara Ahmed",  img:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80" },
  { name:"CrossFit",        tag:"HIIT",    duration:"50 min", calories:"700 kcal", level:"Advanced",  trainer:"Ali Hassan",  img:"https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80" },
  { name:"Functional Training",tag:"CORE", duration:"45 min", calories:"380 kcal", level:"Intermediate", trainer:"Sara Ahmed", img:"https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80" },
  { name:"Personal Training",  tag:"VIP",  duration:"60 min", calories:"500 kcal", level:"Custom",    trainer:"Your Choice", img:"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80" },
];

const TRAINERS_DATA = [
  { name:"Sara Khan",   role:"Yoga & Wellness",         exp:"5 yrs", rating:4.9, clients:18, cert:"ACE Certified", img:"https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&q=80" },
  { name:"Ali Raza",    role:"Strength & Powerlifting", exp:"7 yrs", rating:4.8, clients:22, cert:"NASM Certified", img:"https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&q=80" },
  { name:"Omar Farooq", role:"Cardio & HIIT",           exp:"4 yrs", rating:4.7, clients:14, cert:"CrossFit L2",    img:"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80" },
  { name:"Nadia Shaikh",role:"Nutrition & Wellness",    exp:"6 yrs", rating:4.9, clients:20, cert:"Precision Nutrition", img:"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80" },
];

const PLANS_DATA = [
  { name:"STARTER", price:2500,  period:"mo", tag:null,       color:"#3B82F6",
    features:["Gym Access (6AM–10PM)","Locker Room","Cardio Equipment","Free Parking","1 Guest Pass/Month"] },
  { name:"PRO",     price:5000,  period:"mo", tag:"POPULAR",  color:"#FF5A00",
    features:["Everything in Starter","All Group Classes","Personalized Diet Plan","Progress Tracking App","Sauna & Steam Room","2 Guest Passes/Month"] },
  { name:"ELITE",   price:9000,  period:"mo", tag:"BEST VALUE",color:"#8B5CF6",
    features:["Everything in Pro","Dedicated Personal Trainer","Custom Nutrition Plan","Priority Booking","Full Spa Access","Unlimited Guest Passes","Body Composition Analysis"] },
];

const TESTIMONIALS = [
  { name:"Ayesha Noor",  plan:"Pro Member",     text:"Iron Pulse completely transformed my life. The trainers are world-class and the equipment is top-notch. Lost 18kg in 6 months!", stars:5, img:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80" },
  { name:"Bilal Ahmad",  plan:"Elite Member",   text:"The personal training sessions here are incredible. My strength has doubled and I feel better than I ever have. Best investment!", stars:5, img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { name:"Sana Malik",   plan:"Elite Member",   text:"The atmosphere at Iron Pulse is electric. Everyone is motivated and the staff genuinely cares about your progress. Highly recommend!", stars:5, img:"https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=200&q=80" },
];

const SCHEDULE = [
  { time:"6:00 AM",  class:"Morning Yoga",     trainer:"Sara Khan",   batch:"Morning", spots:8  },
  { time:"7:30 AM",  class:"Weight Training",  trainer:"Ali Raza",    batch:"Morning", spots:12 },
  { time:"9:00 AM",  class:"HIIT Cardio",      trainer:"Omar Farooq", batch:"Morning", spots:15 },
  { time:"5:00 PM",  class:"Functional Fit",   trainer:"Sara Khan",   batch:"Evening", spots:10 },
  { time:"6:30 PM",  class:"CrossFit",         trainer:"Ali Raza",    batch:"Evening", spots:18 },
  { time:"8:00 PM",  class:"Yoga & Recovery",  trainer:"Nadia Shaikh",batch:"Evening", spots:12 },
];

/* ─── ADMIN DATA ─────────────────────────────────────────────────────── */
const MOCK_MEMBERS = [
  { id:"GM001", name:"Ahmed Raza",    phone:"+92 300 1234567", plan:"Elite",   fee:9000, status:"Active",  batch:"Morning", dueDate:"2026-06-01", paidAmount:9000, lastPayment:"2026-05-01", joinDate:"2024-01-15", goal:"Muscle Gain",    trainer:"Ali Raza",    streak:12, sessions:48 },
  { id:"GM002", name:"Fatima Khan",   phone:"+92 301 2345678", plan:"Pro",     fee:5000, status:"Active",  batch:"Evening", dueDate:"2026-05-20", paidAmount:5000, lastPayment:"2026-04-20", joinDate:"2024-03-10", goal:"Weight Loss",    trainer:"Sara Khan",   streak:7,  sessions:32 },
  { id:"GM003", name:"Usman Ali",     phone:"+92 302 3456789", plan:"Starter", fee:2500, status:"Active",  batch:"Morning", dueDate:"2026-05-15", paidAmount:0,    lastPayment:"2026-04-15", joinDate:"2024-06-01", goal:"Fitness",        trainer:"—",           streak:3,  sessions:15 },
  { id:"GM004", name:"Sana Malik",    phone:"+92 303 4567890", plan:"Elite",   fee:9000, status:"Active",  batch:"Evening", dueDate:"2026-06-10", paidAmount:9000, lastPayment:"2026-05-10", joinDate:"2023-11-20", goal:"Toning",         trainer:"Ali Raza",    streak:21, sessions:72 },
  { id:"GM005", name:"Hassan Sheikh", phone:"+92 304 5678901", plan:"Pro",     fee:5000, status:"Expired", batch:"Morning", dueDate:"2026-05-01", paidAmount:2500, lastPayment:"2026-04-01", joinDate:"2024-02-14", goal:"Strength",       trainer:"Omar Farooq", streak:0,  sessions:28 },
  { id:"GM006", name:"Ayesha Noor",   phone:"+92 305 6789012", plan:"Starter", fee:2500, status:"Active",  batch:"Evening", dueDate:"2026-06-05", paidAmount:2500, lastPayment:"2026-05-05", joinDate:"2024-04-22", goal:"Cardio",         trainer:"—",           streak:5,  sessions:20 },
  { id:"GM007", name:"Bilal Ahmad",   phone:"+92 306 7890123", plan:"Elite",   fee:9000, status:"Active",  batch:"Morning", dueDate:"2026-06-08", paidAmount:9000, lastPayment:"2026-05-08", joinDate:"2023-09-01", goal:"Performance",    trainer:"Ali Raza",    streak:30, sessions:96 },
  { id:"GM008", name:"Zara Hussain",  phone:"+92 307 8901234", plan:"Pro",     fee:5000, status:"Active",  batch:"Evening", dueDate:"2026-05-25", paidAmount:0,    lastPayment:"2026-04-25", joinDate:"2024-07-11", goal:"Flexibility",    trainer:"Sara Khan",   streak:4,  sessions:18 },
  { id:"GM009", name:"Kamran Iqbal",  phone:"+92 308 9012345", plan:"Pro",     fee:5000, status:"Active",  batch:"Morning", dueDate:"2026-06-15", paidAmount:5000, lastPayment:"2026-05-15", joinDate:"2024-08-01", goal:"Muscle Gain",    trainer:"Ali Raza",    streak:2,  sessions:10 },
  { id:"GM010", name:"Nadia Shaikh",  phone:"+92 309 0123456", plan:"Elite",   fee:9000, status:"Active",  batch:"Evening", dueDate:"2026-06-20", paidAmount:9000, lastPayment:"2026-05-20", joinDate:"2023-12-01", goal:"Overall Health", trainer:"Sara Khan",   streak:18, sessions:60 },
];

const WEEKLY_ATT = [{day:"Mon",v:42},{day:"Tue",v:38},{day:"Wed",v:55},{day:"Thu",v:60},{day:"Fri",v:48},{day:"Sat",v:52},{day:"Sun",v:30}];
const MONTHLY_REV = [{m:"Nov",v:92},{m:"Dec",v:110},{m:"Jan",v:128},{m:"Feb",v:115},{m:"Mar",v:142},{m:"Apr",v:158},{m:"May",v:147}];

/* ─── UTILS ──────────────────────────────────────────────────────────── */
const feeStatus = m => {
  if (m.paidAmount >= m.fee) return "Paid";
  if (m.paidAmount > 0) return "Partial";
  if (new Date(m.dueDate) < new Date()) return "Overdue";
  return "Unpaid";
};
const daysUntil = d => Math.round((new Date(d) - new Date()) / 86400000);

function useToast() {
  const [toasts, set] = useState([]);
  const show = useCallback((msg, type="success") => {
    const id = Date.now();
    set(t => [...t, {id, msg, type}]);
    setTimeout(() => set(t => t.filter(x => x.id !== id)), 3200);
  }, []);
  return [toasts, show];
}

/* ─── SHARED TINY COMPONENTS ─────────────────────────────────────────── */
function Badge({ label, color="#FF5A00" }) {
  return <span style={{background:color+"20",color,border:`1px solid ${color}33`,borderRadius:6,padding:"2px 9px",fontSize:10,fontWeight:700,letterSpacing:.4,whiteSpace:"nowrap"}}>{label}</span>;
}

function Avatar({ name, size=40 }) {
  const initials = name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  const palette = [ORANGE,"#8B5CF6","#3B82F6","#22C55E","#F59E0B","#EC4899"];
  const c = palette[name.charCodeAt(0) % palette.length];
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:c+"22",border:`1.5px solid ${c}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.38,fontWeight:700,color:c,flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1}}>
      {initials}
    </div>
  );
}

function ProgressBar({ pct, color=ORANGE, h=5 }) {
  return (
    <div style={{height:h,background:BORDER,borderRadius:h/2,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:color,borderRadius:h/2,transition:"width .5s"}}/>
    </div>
  );
}

function MiniBarChart({ data, vKey, lKey, color }) {
  const max = Math.max(...data.map(d=>d[vKey]), 1);
  return (
    <div style={{display:"flex",gap:3,alignItems:"flex-end",height:70}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <div style={{width:"100%",background:color+"25",borderRadius:"3px 3px 0 0",height:(d[vKey]/max)*58,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",bottom:0,left:0,right:0,background:color,height:"55%"}}/>
          </div>
          <span style={{fontSize:8,color:"#555"}}>{d[lKey]}</span>
        </div>
      ))}
    </div>
  );
}

function KpiCard({ icon, label, value, sub, color=ORANGE, trend }) {
  return (
    <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:"16px 18px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-8,right:-8,width:60,height:60,background:color+"08",borderRadius:"50%"}}/>
      <div style={{fontSize:18,marginBottom:5}}>{icon}</div>
      <div className="stat-num" style={{fontSize:24,color:"#f0f0f0",letterSpacing:-1}}>{value}</div>
      <div style={{fontSize:11,color:"#555",marginTop:2,fontWeight:500}}>{label}</div>
      {sub && <div style={{fontSize:10,color:color,marginTop:4,fontWeight:600}}>{sub}</div>}
      {trend !== undefined && <div style={{fontSize:10,color:trend>0?"#22C55E":"#EF4444",marginTop:3,fontWeight:600}}>{trend>0?"▲":"▼"} {Math.abs(trend)}%</div>}
    </div>
  );
}

function Modal({ title, onClose, children, wide=false }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.87)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:20,padding:26,width:"100%",maxWidth:wide?520:420,maxHeight:"92vh",overflowY:"auto",animation:"slideDown .2s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:16,fontWeight:700,color:"#f0f0f0",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5}}>{title}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#555",fontSize:22,cursor:"pointer",lineHeight:1}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Inp({ label, value, onChange, placeholder, type="text" }) {
  return (
    <div style={{marginBottom:13}}>
      {label && <div style={{fontSize:11,color:"#555",marginBottom:5,fontWeight:600,letterSpacing:.5,textTransform:"uppercase"}}>{label}</div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{width:"100%",background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 14px",color:"#f0f0f0",fontSize:13,boxSizing:"border-box"}}
        onFocus={e=>e.target.style.borderColor=ORANGE} onBlur={e=>e.target.style.borderColor=BORDER}/>
    </div>
  );
}

function Sel({ label, value, onChange, options }) {
  return (
    <div style={{marginBottom:13}}>
      {label && <div style={{fontSize:11,color:"#555",marginBottom:5,fontWeight:600,letterSpacing:.5,textTransform:"uppercase"}}>{label}</div>}
      <select value={value} onChange={onChange} style={{width:"100%",background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 14px",color:"#f0f0f0",fontSize:13,boxSizing:"border-box",cursor:"pointer"}}>
        {options.map(o=><option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant="primary", style={} }) {
  const base = {borderRadius:10,padding:"9px 18px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .15s",border:"none",...style};
  if (variant==="primary") return <button onClick={onClick} style={{...base,background:ORANGE,color:"#fff"}}>{children}</button>;
  if (variant==="secondary") return <button onClick={onClick} style={{...base,background:"transparent",color:"#aaa",border:`1px solid ${BORDER}`}}>{children}</button>;
  if (variant==="danger") return <button onClick={onClick} style={{...base,background:"#EF444418",color:"#EF4444",border:"1px solid #EF444430"}}>{children}</button>;
  return <button onClick={onClick} style={{...base,...style}}>{children}</button>;
}

function ToastStack({ toasts }) {
  return (
    <div style={{position:"fixed",top:16,right:16,zIndex:99999,display:"flex",flexDirection:"column",gap:7,pointerEvents:"none"}}>
      {toasts.map(t=>(
        <div key={t.id} style={{
          background:t.type==="error"?"#EF4444":t.type==="warn"?"#F59E0B":"#22C55E",
          color:"#fff",padding:"11px 18px",borderRadius:12,fontSize:13,fontWeight:600,
          boxShadow:"0 4px 24px rgba(0,0,0,.6)",animation:"toastIn .25s ease",maxWidth:300
        }}>{t.msg}</div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PUBLIC WEBSITE
═══════════════════════════════════════════════════════════════════════ */

/* ── Navbar ── */
function Navbar({ onAdminClick, activePage, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(()=>{
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  },[]);
  const links = ["Home","Classes","Trainers","Schedule","Pricing","Contact"];
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,background:scrolled?"rgba(8,8,8,.96)":"transparent",borderBottom:scrolled?`1px solid ${BORDER}`:"none",backdropFilter:scrolled?"blur(12px)":"none",transition:"all .3s",padding:"0 5%"}}>
      <div style={{maxWidth:1200,margin:"0 auto",height:68,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,letterSpacing:2,color:"#fff"}}>
          IRON <span style={{color:ORANGE}}>PULSE</span> <span style={{fontSize:13,fontWeight:400,color:"#555",letterSpacing:1}}>GYM</span>
        </div>
        {/* Desktop links */}
        <div style={{display:"flex",gap:28,alignItems:"center"}}>
          {links.map(l=>(
            <span key={l} className={`nav-link ${activePage===l.toLowerCase()?"active":""}`}
              onClick={()=>setPage(l.toLowerCase())}>{l}</span>
          ))}
          <button className="btn-primary" onClick={onAdminClick} style={{padding:"9px 20px",fontSize:12,letterSpacing:.5}}>
            ADMIN →
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ── Hero ── */
function Hero({ setPage }) {
  return (
    <section style={{position:"relative",height:"100vh",minHeight:600,display:"flex",alignItems:"center",overflow:"hidden"}}>
      {/* BG Image */}
      <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=85"
        style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}} alt="gym"/>
      {/* Overlays */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(105deg,rgba(8,8,8,.92) 45%,rgba(8,8,8,.4) 100%)"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:200,background:"linear-gradient(transparent,#080808)"}}/>
      {/* Orange accent line */}
      <div style={{position:"absolute",left:0,top:"20%",bottom:"20%",width:4,background:ORANGE,borderRadius:"0 4px 4px 0"}}/>

      <div style={{position:"relative",maxWidth:1200,margin:"0 auto",padding:"0 6%",width:"100%"}}>
        <div className="fade-up" style={{display:"inline-flex",alignItems:"center",gap:8,background:ORANGE+"18",border:`1px solid ${ORANGE}33`,borderRadius:30,padding:"5px 14px",marginBottom:22}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:ORANGE,animation:"pulse-dot 1.5s ease infinite"}}/>
          <span style={{fontSize:11,color:ORANGE,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase"}}>Lahore's #1 Premium Gym</span>
        </div>
        <h1 className="fade-up delay-1 section-title" style={{fontSize:"clamp(46px,7vw,88px)",color:"#fff",lineHeight:1.0,marginBottom:20}}>
          IGNITE YOUR<br/><span style={{color:ORANGE,fontStyle:"italic"}}>STRENGTH.</span><br/>
          <span style={{fontSize:"85%"}}>ACHIEVE YOUR</span><br/>
          <span style={{fontStyle:"italic"}}>PEAK FITNESS.</span>
        </h1>
        <p className="fade-up delay-2" style={{fontSize:16,color:"#aaa",maxWidth:420,lineHeight:1.7,marginBottom:36}}>
          Access elite coaching, state-of-the-art equipment, and a supportive community in Lahore's most advanced fitness club.
        </p>
        <div className="fade-up delay-3" style={{display:"flex",gap:14,flexWrap:"wrap"}}>
          <button className="btn-primary" onClick={()=>setPage("pricing")}>JOIN NOW</button>
          <button className="btn-outline" onClick={()=>setPage("classes")}>START FREE TRIAL</button>
        </div>
        {/* Stats */}
        <div className="fade-up delay-4" style={{display:"flex",gap:40,marginTop:52,flexWrap:"wrap"}}>
          {[["500+","Members"],["12+","Elite Trainers"],["25+","Classes / Week"],["6","Years Running"]].map(([n,l])=>(
            <div key={l}>
              <div className="stat-num" style={{fontSize:32,color:ORANGE}}>{n}</div>
              <div style={{fontSize:12,color:"#666",letterSpacing:.5}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Ticker ── */
function Ticker() {
  const items = ["💪 Weight Training","⚡ HIIT Cardio","🧘 Yoga & Recovery","🏋️ CrossFit","🔥 Personal Training","🥗 Nutrition Plans","🛁 Spa & Sauna","🎯 Goal Tracking"];
  const repeated = [...items,...items];
  return (
    <div style={{background:"#FF5A00",overflow:"hidden",padding:"11px 0",borderBottom:`1px solid ${ORANGE}`,borderTop:`1px solid ${ORANGE}`}}>
      <div style={{display:"flex",animation:"ticker 20s linear infinite",width:"max-content"}}>
        {repeated.map((item,i)=>(
          <span key={i} style={{whiteSpace:"nowrap",padding:"0 32px",fontSize:13,fontWeight:700,letterSpacing:1,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif"}}>
            {item} &nbsp;•
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Why Choose ── */
function WhyChoose() {
  const perks = [
    {icon:"🏋️",title:"Elite Trainers",desc:"Certified professionals with 4–8 years experience and proven transformation records."},
    {icon:"⚙️",title:"Modern Equipment",desc:"Over ₨2 crore invested in cutting-edge fitness machines from top global brands."},
    {icon:"🤸",title:"Diverse Classes",desc:"25+ weekly classes from powerlifting to yoga — something for every fitness goal."},
    {icon:"📊",title:"Progress Tracking",desc:"Advanced body composition analysis and monthly progress reports for all Pro+ members."},
    {icon:"🥗",title:"Nutrition Plans",desc:"Customized diet and nutrition plans designed by certified nutritionists."},
    {icon:"🧖",title:"Recovery Zone",desc:"Dedicated spa, sauna, and recovery area to help you rest and rebuild properly."},
  ];
  return (
    <section style={{background:BG,padding:"90px 6%"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:60}}>
          <div style={{fontSize:12,color:ORANGE,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Why Iron Pulse?</div>
          <h2 className="section-title" style={{fontSize:"clamp(36px,5vw,56px)",color:"#fff"}}>WHY CHOOSE IRON PULSE?</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18}}>
          {perks.map((p,i)=>(
            <div key={i} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:26,transition:"all .3s",cursor:"default"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=ORANGE+"44";e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 40px ${ORANGE}12`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
              <div style={{width:48,height:48,borderRadius:12,background:ORANGE+"15",border:`1px solid ${ORANGE}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:16}}>{p.icon}</div>
              <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#fff",marginBottom:8,letterSpacing:.5}}>{p.title}</h3>
              <p style={{fontSize:13.5,color:"#666",lineHeight:1.65}}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Classes ── */
function Classes({ setPage }) {
  const [booked, setBooked] = useState({});
  return (
    <section id="classes" style={{background:SURFACE,padding:"90px 6%"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:50,flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontSize:12,color:ORANGE,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>What We Offer</div>
            <h2 className="section-title" style={{fontSize:"clamp(34px,4.5vw,52px)",color:"#fff"}}>OUR FEATURED CLASSES</h2>
          </div>
          <button className="btn-outline" onClick={()=>setPage("classes")} style={{padding:"10px 22px",fontSize:13}}>View All Classes</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18}}>
          {CLASSES.map((c,i)=>(
            <div key={i} className="class-card" style={{height:300}}>
              <img src={c.img} alt={c.name}/>
              <div className="overlay"/>
              <div style={{position:"absolute",top:14,left:14}}>
                <Badge label={c.tag} color={ORANGE}/>
              </div>
              <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"20px 18px"}}>
                <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:800,color:"#fff",marginBottom:6}}>{c.name}</h3>
                <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
                  {[c.duration, c.calories, c.level].map(tag=>(
                    <span key={tag} style={{fontSize:10,color:"#ccc",background:"rgba(0,0,0,.5)",padding:"3px 9px",borderRadius:20,border:"1px solid rgba(255,255,255,.1)"}}>{tag}</span>
                  ))}
                </div>
                <button onClick={()=>setBooked(b=>({...b,[i]:!b[i]}))} style={{
                  background:booked[i]?"#22C55E":ORANGE,border:"none",borderRadius:8,padding:"8px 18px",
                  color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:.5,
                  transition:"all .2s"
                }}>{booked[i]?"✓ BOOKED":"BOOK NOW"}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Trainers ── */
function Trainers({ setPage }) {
  const [active, setActive] = useState(0);
  return (
    <section id="trainers" style={{background:BG,padding:"90px 6%"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:50}}>
          <div style={{fontSize:12,color:ORANGE,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>The Team</div>
          <h2 className="section-title" style={{fontSize:"clamp(34px,4.5vw,52px)",color:"#fff"}}>MEET OUR TRAINERS</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:18}}>
          {TRAINERS_DATA.map((t,i)=>(
            <div key={i} className="trainer-card" onClick={()=>setActive(active===i?-1:i)}>
              <div style={{position:"relative",height:260,overflow:"hidden"}}>
                <img src={t.img} alt={t.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top",transition:"transform .5s"}}
                  onMouseOver={e=>e.target.style.transform="scale(1.06)"} onMouseOut={e=>e.target.style.transform="none"}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 40%,rgba(0,0,0,.8))"}}/>
                <div style={{position:"absolute",bottom:14,left:14,right:14}}>
                  <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#fff",marginBottom:2}}>{t.name}</h3>
                  <div style={{fontSize:12,color:ORANGE,fontWeight:600}}>{t.role}</div>
                </div>
              </div>
              <div style={{padding:"16px 18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                  <div style={{textAlign:"center"}}>
                    <div className="stat-num" style={{fontSize:22,color:ORANGE}}>{t.clients}</div>
                    <div style={{fontSize:10,color:"#555"}}>Clients</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div className="stat-num" style={{fontSize:22,color:"#F59E0B"}}>⭐{t.rating}</div>
                    <div style={{fontSize:10,color:"#555"}}>Rating</div>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div className="stat-num" style={{fontSize:22,color:"#22C55E"}}>{t.exp}</div>
                    <div style={{fontSize:10,color:"#555"}}>Experience</div>
                  </div>
                </div>
                <div style={{fontSize:11,color:"#444",padding:"8px 10px",background:SURFACE,borderRadius:8,textAlign:"center"}}>🎓 {t.cert}</div>
                {active===i && (
                  <button className="btn-primary" style={{width:"100%",marginTop:12,padding:"9px",fontSize:12,letterSpacing:.5}}>Book Session</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Schedule ── */
function Schedule() {
  const [batch, setBatch] = useState("Morning");
  const filtered = SCHEDULE.filter(s=>s.batch===batch);
  return (
    <section style={{background:SURFACE,padding:"90px 6%"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:40,flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontSize:12,color:ORANGE,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Daily Schedule</div>
            <h2 className="section-title" style={{fontSize:"clamp(32px,4vw,48px)",color:"#fff"}}>CLASS SCHEDULE</h2>
          </div>
          <div style={{display:"flex",gap:8}}>
            {["Morning","Evening"].map(b=>(
              <button key={b} onClick={()=>setBatch(b)} style={{
                background:batch===b?ORANGE:"transparent", border:`1px solid ${batch===b?ORANGE:BORDER}`,
                borderRadius:10,padding:"9px 22px",color:batch===b?"#fff":"#666",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"
              }}>{b==="Morning"?"☀️ Morning":"🌙 Evening"}</button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {filtered.map((s,i)=>(
            <div key={i} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:"16px 20px",display:"flex",alignItems:"center",gap:20,flexWrap:"wrap",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=ORANGE+"44";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:ORANGE,minWidth:80}}>{s.time}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:16,fontWeight:700,color:"#f0f0f0",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5}}>{s.class}</div>
                <div style={{fontSize:12,color:"#555",marginTop:2}}>with {s.trainer}</div>
              </div>
              <Badge label={`${s.spots} spots`} color="#22C55E"/>
              <button style={{background:ORANGE+"18",border:`1px solid ${ORANGE}30`,borderRadius:8,padding:"7px 16px",color:ORANGE,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>Book</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ── */
function Pricing({ setPage }) {
  return (
    <section id="pricing" style={{background:BG,padding:"90px 6%"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:60}}>
          <div style={{fontSize:12,color:ORANGE,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Membership</div>
          <h2 className="section-title" style={{fontSize:"clamp(34px,5vw,56px)",color:"#fff"}}>FLEXIBLE MEMBERSHIPS</h2>
          <p style={{color:"#555",fontSize:14,marginTop:10}}>No hidden fees. Cancel anytime. Start strong.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:20,alignItems:"start"}}>
          {PLANS_DATA.map((p,i)=>(
            <div key={i} className={`plan-card ${p.tag==="POPULAR"?"featured":""}`}
              style={{background:p.tag==="POPULAR"?"#161616":CARD,border:p.tag==="POPULAR"?`1px solid ${ORANGE}44`:`1px solid ${BORDER}`,borderRadius:20,padding:28,position:"relative",overflow:"hidden",transition:"all .3s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="none";}}>
              {p.tag && (
                <div style={{position:"absolute",top:18,right:18,background:ORANGE,color:"#fff",fontSize:9,fontWeight:800,padding:"4px 10px",borderRadius:20,letterSpacing:1}}>{p.tag}</div>
              )}
              <div style={{position:"absolute",top:-30,right:-30,width:100,height:100,background:p.color+"0A",borderRadius:"50%"}}/>
              <div style={{fontSize:11,color:p.color,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>{p.name}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:20}}>
                <span style={{fontSize:11,color:"#555",fontWeight:600}}>Rs</span>
                <span className="stat-num" style={{fontSize:42,color:"#fff"}}>{p.price.toLocaleString()}</span>
                <span style={{fontSize:13,color:"#555"}}>/{p.period}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:24}}>
                {p.features.map(f=>(
                  <div key={f} style={{display:"flex",gap:9,alignItems:"flex-start",fontSize:13,color:"#888"}}>
                    <span style={{color:p.color,fontWeight:700,flexShrink:0,marginTop:1}}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button style={{
                width:"100%",padding:"13px",background:p.tag==="POPULAR"?ORANGE:"transparent",
                border:`2px solid ${p.tag==="POPULAR"?ORANGE:p.color}`,
                borderRadius:12,color:p.tag==="POPULAR"?"#fff":p.color,
                fontWeight:800,fontSize:14,cursor:"pointer",letterSpacing:.5,transition:"all .2s",fontFamily:"inherit"
              }}
                onMouseEnter={e=>{if(p.tag!=="POPULAR"){e.target.style.background=p.color;e.target.style.color="#fff";}}}
                onMouseLeave={e=>{if(p.tag!=="POPULAR"){e.target.style.background="transparent";e.target.style.color=p.color;}}}
                onClick={()=>setPage("contact")}>SELECT PLAN</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ── */
function Testimonials() {
  const [active, setActive] = useState(0);
  return (
    <section style={{background:SURFACE,padding:"90px 6%"}}>
      <div style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}>
        <div style={{fontSize:12,color:ORANGE,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Success Stories</div>
        <h2 className="section-title" style={{fontSize:"clamp(32px,4vw,48px)",color:"#fff",marginBottom:50}}>WHAT MEMBERS SAY</h2>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:24,padding:"40px 48px",marginBottom:20}}>
          <div style={{fontSize:36,color:ORANGE,marginBottom:12,fontFamily:"'Barlow Condensed',sans-serif"}}>❝</div>
          <p style={{fontSize:17,color:"#ccc",lineHeight:1.75,marginBottom:28,fontStyle:"italic"}}>{TESTIMONIALS[active].text}</p>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14}}>
            <img src={TESTIMONIALS[active].img} alt={TESTIMONIALS[active].name} style={{width:52,height:52,borderRadius:"50%",objectFit:"cover",border:`2px solid ${ORANGE}44`}}/>
            <div style={{textAlign:"left"}}>
              <div style={{fontSize:15,fontWeight:700,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif"}}>{TESTIMONIALS[active].name}</div>
              <div style={{fontSize:11,color:ORANGE}}>{TESTIMONIALS[active].plan}</div>
            </div>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:8}}>
          {TESTIMONIALS.map((_,i)=>(
            <button key={i} onClick={()=>setActive(i)} style={{
              width:active===i?24:8,height:8,borderRadius:4,background:active===i?ORANGE:BORDER,
              border:"none",cursor:"pointer",transition:"all .3s"
            }}/>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Contact ── */
function Contact({ showToast }) {
  const [form, setForm] = useState({name:"",phone:"",plan:"Pro",msg:""});
  return (
    <section id="contact" style={{background:BG,padding:"90px 6%"}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:50,alignItems:"center"}}>
        <div>
          <div style={{fontSize:12,color:ORANGE,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:12}}>Get In Touch</div>
          <h2 className="section-title" style={{fontSize:"clamp(34px,5vw,56px)",color:"#fff",marginBottom:20}}>START YOUR FITNESS JOURNEY TODAY</h2>
          <p style={{color:"#555",fontSize:14,lineHeight:1.7,marginBottom:32}}>Visit us, call us, or fill the form — our team will get back to you within 2 hours.</p>
          {[["📍","Location","123 Gym Street, DHA Phase 5, Lahore"],["📞","Phone","+92 42 111-GYM-001"],["🕐","Hours","Mon–Sat: 5AM–11PM · Sun: 6AM–10PM"],["📧","Email","info@ironpulsegym.com"]].map(([icon,l,v])=>(
            <div key={l} style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:18}}>
              <div style={{width:40,height:40,borderRadius:10,background:ORANGE+"15",border:`1px solid ${ORANGE}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{icon}</div>
              <div>
                <div style={{fontSize:11,color:"#555",fontWeight:600,letterSpacing:.5}}>{l}</div>
                <div style={{fontSize:13,color:"#ccc",marginTop:2}}>{v}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:20,padding:32}}>
          <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:800,color:"#fff",marginBottom:20}}>FREE TRIAL REGISTRATION</h3>
          <Inp label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ahmed Raza"/>
          <Inp label="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+92 300 1234567"/>
          <Sel label="Interested Plan" value={form.plan} onChange={e=>setForm({...form,plan:e.target.value})} options={["Starter","Pro","Elite"]}/>
          <div style={{marginBottom:13}}>
            <div style={{fontSize:11,color:"#555",marginBottom:5,fontWeight:600,letterSpacing:.5,textTransform:"uppercase"}}>Message</div>
            <textarea value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} placeholder="Tell us your fitness goal..." rows={3} style={{width:"100%",background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 14px",color:"#f0f0f0",fontSize:13,resize:"vertical",boxSizing:"border-box"}}/>
          </div>
          <button className="btn-primary" style={{width:"100%",padding:"13px",fontSize:14,letterSpacing:.5}}
            onClick={()=>{ if(form.name&&form.phone){showToast(`🎉 Thank you ${form.name}! We'll contact you soon.`);setForm({name:"",phone:"",plan:"Pro",msg:""});}else{showToast("Please fill name and phone","warn");}}}>
            REGISTER FREE TRIAL
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer({ setPage }) {
  return (
    <footer style={{background:SURFACE,borderTop:`1px solid ${BORDER}`,padding:"60px 6% 30px"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:40,marginBottom:50,flexWrap:"wrap"}}>
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:26,letterSpacing:2,color:"#fff",marginBottom:14}}>
              IRON <span style={{color:ORANGE}}>PULSE</span>
            </div>
            <p style={{fontSize:13,color:"#555",lineHeight:1.7,maxWidth:260,marginBottom:20}}>Lahore's premier fitness destination. Powering your transformation since 2020.</p>
            <div style={{display:"flex",gap:10}}>
              {["📘","📸","🐦","▶"].map((icon,i)=>(
                <div key={i} style={{width:36,height:36,borderRadius:"50%",background:CARD,border:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer",transition:"all .2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=ORANGE;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;}}>{icon}</div>
              ))}
            </div>
          </div>
          {[
            {title:"Navigation",links:["Home","Classes","Trainers","Schedule","Pricing","Contact"]},
            {title:"Facilities",links:["Free Weights","Cardio Zone","Group Classes","Sauna","Spa","Parking"]},
            {title:"Info",links:["Lahore, DHA Ph5","+92 42 111-496-001","Mon–Sun Open","Media Kit","Careers"]},
          ].map(col=>(
            <div key={col.title}>
              <div style={{fontSize:11,color:ORANGE,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>{col.title}</div>
              {col.links.map(l=>(
                <div key={l} style={{fontSize:13,color:"#555",marginBottom:10,cursor:"pointer",transition:"color .2s"}}
                  onMouseEnter={e=>e.target.style.color="#ccc"} onMouseLeave={e=>e.target.style.color="#555"}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{borderTop:`1px solid ${BORDER}`,paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div style={{fontSize:12,color:"#333"}}>© 2026 Iron Pulse Gym, Lahore. All rights reserved.</div>
          <div style={{fontSize:12,color:"#333"}}>Designed with 🔥 for champions</div>
        </div>
      </div>
    </footer>
  );
}

/* ── Public Website Main ── */
function PublicWebsite({ onAdminClick, showToast }) {
  const [activePage, setActivePage] = useState("home");
  return (
    <div style={{background:BG,minHeight:"100vh"}}>
      <Navbar onAdminClick={onAdminClick} activePage={activePage} setPage={setActivePage}/>
      <div style={{paddingTop:0}}>
        <Hero setPage={setActivePage}/>
        <Ticker/>
        <WhyChoose/>
        <Classes setPage={setActivePage}/>
        <Trainers setPage={setActivePage}/>
        <Schedule/>
        <Pricing setPage={setActivePage}/>
        <Testimonials/>
        <Contact showToast={showToast}/>
        <Footer setPage={setActivePage}/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
═══════════════════════════════════════════════════════════════════════ */

const ADMIN_NAV = [
  {id:"dashboard",icon:"◈",label:"Dashboard"},
  {id:"attendance",icon:"✓",label:"Attendance"},
  {id:"members",icon:"◉",label:"Members"},
  {id:"fees",icon:"₨",label:"Fee Management"},
  {id:"trainers",icon:"★",label:"Trainers"},
  {id:"plans",icon:"◎",label:"Plans"},
  {id:"analytics",icon:"◫",label:"Analytics"},
  {id:"settings",icon:"⚙",label:"Settings"},
];

function AdminSidebar({ page, setPage, collapsed, setCollapsed }) {
  const overdue = MOCK_MEMBERS.filter(m=>feeStatus(m)==="Overdue").length;
  return (
    <div style={{width:collapsed?64:220,background:SURFACE,borderRight:`1px solid ${BORDER}`,display:"flex",flexDirection:"column",transition:"width .25s",overflow:"hidden",flexShrink:0,height:"100vh",position:"sticky",top:0}}>
      <div style={{padding:collapsed?"16px 0":"16px 14px",borderBottom:`1px solid ${BORDER}`,display:"flex",alignItems:"center",justifyContent:collapsed?"center":"space-between",minHeight:62}}>
        {!collapsed && (
          <div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,letterSpacing:2,background:`linear-gradient(135deg,${ORANGE},#FF8C00)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",textTransform:"uppercase"}}>Iron Pulse</div>
            <div style={{fontSize:9,color:"#444",letterSpacing:1,textTransform:"uppercase",marginTop:1}}>Admin Panel</div>
          </div>
        )}
        <button onClick={()=>setCollapsed(!collapsed)} style={{background:BORDER,border:"none",borderRadius:8,width:28,height:28,color:"#555",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>
          {collapsed?"▶":"◀"}
        </button>
      </div>
      <nav style={{padding:"10px 6px",flex:1,overflowY:"auto"}}>
        {ADMIN_NAV.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)} style={{
            width:"100%",display:"flex",alignItems:"center",gap:10,
            padding:collapsed?"10px 0":"10px 12px",justifyContent:collapsed?"center":"flex-start",
            background:page===n.id?ORANGE+"1A":"transparent",
            border:page===n.id?`1px solid ${ORANGE}33`:"1px solid transparent",
            borderRadius:10,color:page===n.id?ORANGE:"#555",cursor:"pointer",marginBottom:2,
            transition:"all .15s",fontWeight:page===n.id?700:400,fontSize:13,fontFamily:"inherit"
          }}>
            <span style={{fontSize:15,lineHeight:1,flexShrink:0}}>{n.icon}</span>
            {!collapsed && (
              <span style={{whiteSpace:"nowrap",flex:1}}>{n.label}</span>
            )}
            {!collapsed && n.id==="fees" && overdue>0 && (
              <span style={{background:"#EF4444",color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{overdue}</span>
            )}
          </button>
        ))}
      </nav>
      {!collapsed && (
        <div style={{padding:12,borderTop:`1px solid ${BORDER}`}}>
          <div style={{background:CARD,borderRadius:10,padding:12,border:`1px solid ${BORDER}`}}>
            <div style={{fontSize:9,color:"#444",marginBottom:8,fontWeight:700,letterSpacing:.5,textTransform:"uppercase"}}>Quick Stats</div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:11,color:"#555"}}>Active Members</span>
              <span style={{fontSize:11,color:"#22C55E",fontWeight:700}}>{MOCK_MEMBERS.filter(m=>m.status==="Active").length}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:11,color:"#555"}}>Overdue Fees</span>
              <span style={{fontSize:11,color:"#EF4444",fontWeight:700}}>{overdue}</span>
            </div>
          </div>
        </div>
      )}
      <div style={{padding:collapsed?"12px 0":"12px",borderTop:`1px solid ${BORDER}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:collapsed?"center":"flex-start"}}>
          <Avatar name="Admin User" size={30}/>
          {!collapsed && <div><div style={{fontSize:12,fontWeight:700,color:"#f0f0f0"}}>Admin</div><div style={{fontSize:10,color:ORANGE}}>● Online</div></div>}
        </div>
      </div>
    </div>
  );
}

/* Admin Dashboard page */
function AdminDashboard({ showToast }) {
  const overdue = MOCK_MEMBERS.filter(m=>feeStatus(m)==="Overdue");
  const expiring = MOCK_MEMBERS.filter(m=>{ const d=daysUntil(m.dueDate); return d>=0&&d<=7; });
  const totalRev = MOCK_MEMBERS.reduce((s,m)=>s+m.paidAmount,0);
  return (
    <div>
      {/* Alert banners */}
      {(overdue.length>0||expiring.length>0) && (
        <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
          {overdue.length>0 && <div style={{background:"#EF444415",border:"1px solid #EF444430",borderRadius:12,padding:"10px 16px",fontSize:12,color:"#EF4444",flex:1,minWidth:220}}>🚨 <strong>{overdue.length} members</strong> have overdue payments — review fees tab</div>}
          {expiring.length>0 && <div style={{background:"#F59E0B15",border:"1px solid #F59E0B30",borderRadius:12,padding:"10px 16px",fontSize:12,color:"#F59E0B",flex:1,minWidth:220}}>⚠️ <strong>{expiring.length} memberships</strong> expiring in 7 days — send reminders</div>}
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:11,marginBottom:20}}>
        <KpiCard icon="👥" label="Total Members" value={MOCK_MEMBERS.length} sub="2 new this week" color="#3B82F6" trend={12}/>
        <KpiCard icon="✅" label="Present Today" value="42" sub="70% rate" color="#22C55E" trend={5}/>
        <KpiCard icon="💰" label="Today Revenue" value="₨26.5K" sub="3 payments" color={ORANGE} trend={18}/>
        <KpiCard icon="⏳" label="Pending Dues" value={`₨${(MOCK_MEMBERS.reduce((s,m)=>s+Math.max(0,m.fee-m.paidAmount),0)/1000).toFixed(0)}K`} sub={`${overdue.length} overdue`} color="#EF4444"/>
        <KpiCard icon="🏋️" label="Active Plans" value={MOCK_MEMBERS.filter(m=>m.status==="Active").length} sub="1 expired" color="#8B5CF6"/>
        <KpiCard icon="💸" label="Monthly Revenue" value={`₨${(totalRev/1000).toFixed(0)}K`} sub="collected" color="#22C55E" trend={8}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14,marginBottom:18}}>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:18}}>
          <div style={{fontSize:13,fontWeight:700,color:"#f0f0f0",marginBottom:14,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5}}>Weekly Attendance</div>
          <MiniBarChart data={WEEKLY_ATT} vKey="v" lKey="day" color={ORANGE}/>
        </div>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:18}}>
          <div style={{fontSize:13,fontWeight:700,color:"#f0f0f0",marginBottom:14,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5}}>Monthly Revenue (₨K)</div>
          <MiniBarChart data={MONTHLY_REV} vKey="v" lKey="m" color="#22C55E"/>
        </div>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:18}}>
          <div style={{fontSize:13,fontWeight:700,color:"#f0f0f0",marginBottom:14,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5}}>Plan Distribution</div>
          {[{n:"Starter",c:"#3B82F6"},{n:"Pro",c:ORANGE},{n:"Elite",c:"#8B5CF6"}].map(p=>{
            const cnt=MOCK_MEMBERS.filter(m=>m.plan===p.n).length;
            const pct=Math.round(cnt/MOCK_MEMBERS.length*100);
            return (
              <div key={p.n} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                  <span style={{color:"#555"}}>{p.n}</span>
                  <span style={{color:"#f0f0f0",fontWeight:700}}>{cnt} · {pct}%</span>
                </div>
                <ProgressBar pct={pct} color={p.c}/>
              </div>
            );
          })}
        </div>
      </div>
      {/* Expiring Soon */}
      <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:18}}>
        <div style={{fontSize:13,fontWeight:700,color:"#f0f0f0",marginBottom:14,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5}}>Expiring Memberships 🔔</div>
        {expiring.length===0
          ? <div style={{fontSize:13,color:"#555",textAlign:"center",padding:"20px 0"}}>All memberships are in good standing 🎉</div>
          : expiring.map(m=>{
              const d=daysUntil(m.dueDate);
              return (
                <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:BG,borderRadius:12,marginBottom:8,border:`1px solid #F59E0B22`}}>
                  <Avatar name={m.name} size={38}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#f0f0f0"}}>{m.name}</div>
                    <div style={{fontSize:11,color:"#555"}}>{m.plan} · {m.batch}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:13,fontWeight:700,color:d<=3?"#EF4444":"#F59E0B"}}>{d===0?"Today!":d===1?"Tomorrow":`${d} days`}</div>
                  </div>
                  <button onClick={()=>showToast(`📱 Reminder sent to ${m.name}`)} style={{background:ORANGE+"18",border:`1px solid ${ORANGE}30`,borderRadius:8,padding:"6px 12px",color:ORANGE,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>Remind</button>
                </div>
              );
            })
        }
      </div>
    </div>
  );
}

/* Admin Attendance */
function AdminAttendance({ showToast }) {
  const today = new Date();
  const [att, setAtt] = useState({});
  const [filter, setFilter] = useState("All");
  const [batch, setBatch] = useState("All");
  const [search, setSearch] = useState("");

  const toggle = (id, key) => {
    if (key==="checkOut" && !att[id]?.checkIn) { showToast("⚠ Check in first","warn"); return; }
    const time = new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
    setAtt(prev=>{
      const cur=prev[id]||{};
      return {...prev,[id]:{...cur,[key]:!cur[key],[key+"Time"]:!cur[key]?time:null}};
    });
    showToast(key==="checkIn"?"✅ Checked in":"✅ Checked out");
  };

  const getStatus = id => {
    const a=att[id]||{};
    if (a.checkIn && a.checkOut) return "Completed";
    if (a.checkIn) return "Checked In";
    return "Absent";
  };

  const filtered = MOCK_MEMBERS.filter(m=>{
    const s=getStatus(m.id);
    if (batch!=="All"&&m.batch!==batch) return false;
    if (filter==="Present"&&s==="Absent") return false;
    if (filter==="Absent"&&s!=="Absent") return false;
    if (search&&!m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const present=Object.values(att).filter(a=>a.checkIn).length;
  const out=Object.values(att).filter(a=>a.checkOut).length;

  return (
    <div>
      <div style={{marginBottom:16}}>
        <h2 style={{fontSize:20,fontWeight:900,color:"#f0f0f0",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5}}>
          Daily Attendance — <span style={{color:ORANGE}}>{today.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</span>
        </h2>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10,marginBottom:16}}>
        <KpiCard icon="👥" label="Total" value={MOCK_MEMBERS.length} color="#3B82F6"/>
        <KpiCard icon="✅" label="Present" value={present} color="#22C55E"/>
        <KpiCard icon="📤" label="Checked Out" value={out} color="#8B5CF6"/>
        <KpiCard icon="❌" label="Absent" value={MOCK_MEMBERS.length-present} color="#EF4444"/>
        <KpiCard icon="☀️" label="Morning" value={MOCK_MEMBERS.filter(m=>m.batch==="Morning").length} color="#F59E0B"/>
        <KpiCard icon="🌙" label="Evening" value={MOCK_MEMBERS.filter(m=>m.batch==="Evening").length} color={ORANGE}/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{flex:1,minWidth:160,background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:"8px 14px",color:"#f0f0f0",fontSize:13,fontFamily:"inherit"}}/>
        {["All","Present","Absent","Checked Out"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?ORANGE:CARD,border:`1px solid ${filter===f?ORANGE:BORDER}`,borderRadius:10,padding:"8px 14px",color:filter===f?"#fff":"#555",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>{f}</button>
        ))}
        {["All","Morning","Evening"].map(b=>(
          <button key={b} onClick={()=>setBatch(b)} style={{background:batch===b?"#3B82F622":"transparent",border:`1px solid ${batch===b?"#3B82F6":BORDER}`,borderRadius:10,padding:"8px 12px",color:batch===b?"#3B82F6":"#555",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>{b==="All"?"All Batches":b+" Batch"}</button>
        ))}
        <button onClick={()=>{const t=new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});const u={};MOCK_MEMBERS.filter(m=>m.status==="Active").forEach(m=>{u[m.id]={checkIn:true,checkInTime:t};});setAtt(p=>({...p,...u}));showToast(`✅ ${Object.keys(u).length} members marked present`);}} style={{background:"#22C55E22",border:"1px solid #22C55E44",borderRadius:10,padding:"8px 14px",color:"#22C55E",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",whiteSpace:"nowrap"}}>✅ Mark All Present</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map(m=>{
          const a=att[m.id]||{};
          const st=getStatus(m.id);
          const statusColor={"Checked In":"#3B82F6","Completed":"#8B5CF6","Absent":"#555"}[st];
          return (
            <div key={m.id} style={{background:CARD,border:`1px solid ${a.checkIn?"#22C55E30":BORDER}`,borderRadius:14,padding:"13px 16px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",transition:"border-color .2s"}}>
              <Avatar name={m.name} size={42}/>
              <div style={{flex:1,minWidth:130}}>
                <div style={{fontSize:14,fontWeight:700,color:"#f0f0f0"}}>{m.name}</div>
                <div style={{fontSize:11,color:"#555"}}>{m.id} · {m.phone}</div>
                <div style={{display:"flex",gap:5,marginTop:4,flexWrap:"wrap"}}>
                  <Badge label={m.status} color={m.status==="Active"?"#22C55E":"#EF4444"}/>
                  <Badge label={m.batch} color={m.batch==="Morning"?"#F59E0B":"#8B5CF6"}/>
                  <Badge label={m.plan} color={ORANGE}/>
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",padding:"8px 12px",background:a.checkIn?"#22C55E18":SURFACE,border:`1px solid ${a.checkIn?"#22C55E44":BORDER}`,borderRadius:10,transition:"all .2s"}}>
                  <input type="checkbox" checked={!!a.checkIn} onChange={()=>toggle(m.id,"checkIn")} style={{width:16,height:16,accentColor:"#22C55E",cursor:"pointer"}}/>
                  <div><div style={{fontSize:11,fontWeight:700,color:"#22C55E"}}>IN</div><div style={{fontSize:10,color:"#555",minWidth:38}}>{a.checkInTime||"—"}</div></div>
                </label>
                <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",padding:"8px 12px",background:a.checkOut?"#EF444418":SURFACE,border:`1px solid ${a.checkOut?"#EF444444":BORDER}`,borderRadius:10,transition:"all .2s"}}>
                  <input type="checkbox" checked={!!a.checkOut} onChange={()=>toggle(m.id,"checkOut")} style={{width:16,height:16,accentColor:"#EF4444",cursor:"pointer"}}/>
                  <div><div style={{fontSize:11,fontWeight:700,color:"#EF4444"}}>OUT</div><div style={{fontSize:10,color:"#555",minWidth:38}}>{a.checkOutTime||"—"}</div></div>
                </label>
              </div>
              <Badge label={st} color={statusColor}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Admin Members */
function AdminMembers({ showToast }) {
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [payModal, setPayModal] = useState(null);
  const [statusF, setStatusF] = useState("All");
  const [planF, setPlanF] = useState("All");
  const [form, setForm] = useState({name:"",phone:"",plan:"Starter",batch:"Morning",goal:"Fitness"});

  const filtered = MOCK_MEMBERS.filter(m=>{
    if (statusF!=="All"&&m.status!==statusF) return false;
    if (planF!=="All"&&m.plan!==planF) return false;
    if (search&&!m.name.toLowerCase().includes(search.toLowerCase())&&!m.id.includes(search)&&!m.phone.includes(search)) return false;
    return true;
  });

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:900,color:"#f0f0f0",fontFamily:"'Barlow Condensed',sans-serif",margin:0}}>Members</h2>
          <div style={{fontSize:11,color:"#555",marginTop:2}}>{MOCK_MEMBERS.length} total · {MOCK_MEMBERS.filter(m=>m.status==="Active").length} active</div>
        </div>
        <Btn onClick={()=>setAddOpen(true)}>+ Add Member</Btn>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, ID, phone..." style={{flex:1,minWidth:200,background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:"9px 14px",color:"#f0f0f0",fontSize:13,fontFamily:"inherit"}}/>
        {["All","Active","Expired"].map(f=>(
          <button key={f} onClick={()=>setStatusF(f)} style={{background:statusF===f?ORANGE:CARD,border:`1px solid ${statusF===f?ORANGE:BORDER}`,borderRadius:10,padding:"8px 14px",color:statusF===f?"#fff":"#555",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>{f}</button>
        ))}
        {["All","Starter","Pro","Elite"].map(f=>(
          <button key={f} onClick={()=>setPlanF(f)} style={{background:planF===f?"#8B5CF622":"transparent",border:`1px solid ${planF===f?"#8B5CF6":BORDER}`,borderRadius:10,padding:"8px 12px",color:planF===f?"#8B5CF6":"#555",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit"}}>{f==="All"?"All Plans":f}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:7}}>
        {filtered.map(m=>{
          const st=feeStatus(m); const due=Math.max(0,m.fee-m.paidAmount); const pct=Math.round(m.paidAmount/m.fee*100); const isOpen=sel===m.id;
          return (
            <div key={m.id} style={{background:CARD,border:`1px solid ${isOpen?ORANGE+"44":BORDER}`,borderRadius:14,overflow:"hidden",transition:"all .15s"}}>
              <div onClick={()=>setSel(isOpen?null:m.id)} style={{padding:"13px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
                <Avatar name={m.name} size={44}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#f0f0f0"}}>{m.name}</div>
                  <div style={{fontSize:11,color:"#555"}}>{m.id} · {m.phone}</div>
                  <div style={{display:"flex",gap:5,marginTop:4,flexWrap:"wrap"}}>
                    <Badge label={m.status} color={m.status==="Active"?"#22C55E":"#EF4444"}/>
                    <Badge label={m.plan} color={ORANGE}/>
                    <Badge label={m.batch} color="#3B82F6"/>
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:15,fontWeight:800,color:"#f0f0f0",fontFamily:"'Barlow Condensed',sans-serif"}}>₨{m.fee.toLocaleString()}<span style={{fontSize:11,fontWeight:400,color:"#555"}}>/mo</span></div>
                  <Badge label={st} color={st==="Paid"?"#22C55E":st==="Overdue"?"#EF4444":"#F59E0B"}/>
                </div>
                <span style={{color:"#444",fontSize:12}}>{isOpen?"▲":"▼"}</span>
              </div>
              {isOpen && (
                <div style={{borderTop:`1px solid ${BORDER}`,padding:16}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:9,marginBottom:14}}>
                    {[["Join Date",m.joinDate],["Due Date",m.dueDate],["Trainer",m.trainer],["Goal",m.goal],["Sessions",m.sessions],["Streak 🔥",`${m.streak} days`]].map(([l,v])=>(
                      <div key={l} style={{background:SURFACE,borderRadius:9,padding:"9px 11px"}}>
                        <div style={{fontSize:10,color:"#555",marginBottom:2}}>{l}</div>
                        <div style={{fontSize:13,fontWeight:700,color:"#f0f0f0"}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                      <span style={{color:"#555"}}>Payment Progress</span>
                      <span style={{color:"#f0f0f0",fontWeight:700}}>₨{m.paidAmount.toLocaleString()} / ₨{m.fee.toLocaleString()}</span>
                    </div>
                    <ProgressBar pct={pct} color={st==="Paid"?"#22C55E":st==="Overdue"?"#EF4444":"#F59E0B"} h={7}/>
                    {due>0 && <div style={{fontSize:11,color:"#EF4444",marginTop:3,fontWeight:600}}>Outstanding: ₨{due.toLocaleString()}</div>}
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <Btn onClick={()=>setPayModal(m)}>💰 Collect Fee</Btn>
                    <Btn variant="secondary" onClick={()=>showToast("✏ Edit coming soon")}>✏ Edit</Btn>
                    <Btn variant="secondary" onClick={()=>showToast(`📱 Reminder sent to ${m.name}`)}>📱 Remind</Btn>
                    {m.status==="Active"
                      ? <Btn variant="danger" onClick={()=>showToast("⏸ Membership frozen","warn")}>⏸ Freeze</Btn>
                      : <Btn onClick={()=>showToast("🔄 Membership renewed!")}>🔄 Renew</Btn>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {addOpen && (
        <Modal title="➕ Add New Member" onClose={()=>setAddOpen(false)}>
          <Inp label="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ahmed Raza"/>
          <Inp label="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+92 300 1234567"/>
          <Sel label="Plan" value={form.plan} onChange={e=>setForm({...form,plan:e.target.value})} options={["Starter","Pro","Elite"]}/>
          <Sel label="Batch" value={form.batch} onChange={e=>setForm({...form,batch:e.target.value})} options={["Morning","Evening"]}/>
          <Sel label="Goal" value={form.goal} onChange={e=>setForm({...form,goal:e.target.value})} options={["Muscle Gain","Weight Loss","Fitness","Toning","Strength","Cardio","Flexibility"]}/>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <Btn variant="secondary" onClick={()=>setAddOpen(false)} style={{flex:1}}>Cancel</Btn>
            <Btn onClick={()=>{showToast(`✅ ${form.name||"Member"} added!`);setAddOpen(false);setForm({name:"",phone:"",plan:"Starter",batch:"Morning",goal:"Fitness"});}} style={{flex:2}}>Add Member</Btn>
          </div>
        </Modal>
      )}
      {payModal && (
        <Modal title="💰 Collect Payment" onClose={()=>setPayModal(null)}>
          <div style={{background:SURFACE,borderRadius:12,padding:14,marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
            <Avatar name={payModal.name} size={42}/>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:"#f0f0f0"}}>{payModal.name}</div>
              <div style={{fontSize:11,color:"#555"}}>{payModal.plan} · Outstanding: <span style={{color:"#EF4444",fontWeight:700}}>₨{Math.max(0,payModal.fee-payModal.paidAmount).toLocaleString()}</span></div>
            </div>
          </div>
          <Inp label="Amount (₨)" placeholder={`₨${Math.max(0,payModal.fee-payModal.paidAmount).toLocaleString()}`}/>
          <Sel label="Payment Method" options={["Cash","Online Transfer","JazzCash","Easypaisa","Card"]}/>
          <div style={{display:"flex",gap:8}}>
            <Btn variant="secondary" onClick={()=>setPayModal(null)} style={{flex:1}}>Cancel</Btn>
            <Btn onClick={()=>{showToast(`✅ Payment collected from ${payModal.name}`);setPayModal(null);}} style={{flex:2}}>Confirm ✓</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* Admin Fees */
function AdminFees({ showToast }) {
  const [payModal, setPayModal] = useState(null);
  const totalRev=MOCK_MEMBERS.reduce((s,m)=>s+m.paidAmount,0);
  const pending=MOCK_MEMBERS.reduce((s,m)=>s+Math.max(0,m.fee-m.paidAmount),0);
  return (
    <div>
      <h2 style={{fontSize:20,fontWeight:900,color:"#f0f0f0",fontFamily:"'Barlow Condensed',sans-serif",margin:"0 0 16px"}}>Fee Management</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:18}}>
        <KpiCard icon="✅" label="Fully Paid" value={MOCK_MEMBERS.filter(m=>m.paidAmount>=m.fee).length} color="#22C55E"/>
        <KpiCard icon="💰" label="Collected" value={`₨${(totalRev/1000).toFixed(0)}K`} color={ORANGE}/>
        <KpiCard icon="⏳" label="Pending" value={`₨${(pending/1000).toFixed(0)}K`} color="#EF4444"/>
        <KpiCard icon="🚨" label="Overdue" value={MOCK_MEMBERS.filter(m=>feeStatus(m)==="Overdue").length} color="#F59E0B"/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {MOCK_MEMBERS.map(m=>{
          const st=feeStatus(m); const due=Math.max(0,m.fee-m.paidAmount); const pct=Math.round(m.paidAmount/m.fee*100); const dueIn=daysUntil(m.dueDate);
          return (
            <div key={m.id} style={{background:CARD,border:`1px solid ${st==="Overdue"?"#EF444430":BORDER}`,borderRadius:14,padding:"13px 16px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                <Avatar name={m.name} size={40}/>
                <div style={{flex:1,minWidth:130}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#f0f0f0"}}>{m.name}</div>
                  <div style={{fontSize:11,color:"#555"}}>
                    {m.id} · {m.plan} · Due: {m.dueDate}
                    {dueIn<0&&<span style={{color:"#EF4444",fontWeight:700}}> ({Math.abs(dueIn)}d overdue)</span>}
                    {dueIn>=0&&dueIn<=7&&<span style={{color:"#F59E0B",fontWeight:700}}> ({dueIn}d left)</span>}
                  </div>
                  <div style={{marginTop:6,maxWidth:200}}>
                    <ProgressBar pct={pct} color={st==="Paid"?"#22C55E":st==="Overdue"?"#EF4444":"#F59E0B"} h={4}/>
                    <div style={{fontSize:10,color:"#555",marginTop:2}}>₨{m.paidAmount.toLocaleString()} / ₨{m.fee.toLocaleString()}</div>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                  <Badge label={st} color={st==="Paid"?"#22C55E":st==="Overdue"?"#EF4444":"#F59E0B"}/>
                  {due>0&&<div style={{fontSize:12,color:"#EF4444",fontWeight:700}}>₨{due.toLocaleString()} due</div>}
                  <div style={{display:"flex",gap:6}}>
                    {due>0&&<Btn onClick={()=>setPayModal(m)} style={{padding:"5px 12px",fontSize:11}}>Collect</Btn>}
                    <Btn variant="secondary" onClick={()=>showToast(`📱 Sent to ${m.name}`)} style={{padding:"5px 12px",fontSize:11}}>Remind</Btn>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {payModal&&(
        <Modal title="💰 Collect Payment" onClose={()=>setPayModal(null)}>
          <div style={{background:SURFACE,borderRadius:12,padding:14,marginBottom:16,display:"flex",gap:12,alignItems:"center"}}>
            <Avatar name={payModal.name} size={40}/>
            <div><div style={{fontSize:14,fontWeight:700,color:"#f0f0f0"}}>{payModal.name}</div><div style={{fontSize:11,color:"#EF4444",fontWeight:700}}>Due: ₨{Math.max(0,payModal.fee-payModal.paidAmount).toLocaleString()}</div></div>
          </div>
          <Inp label="Amount" placeholder={`₨${Math.max(0,payModal.fee-payModal.paidAmount).toLocaleString()}`}/>
          <Sel label="Method" options={["Cash","Online","JazzCash","Easypaisa","Card"]}/>
          <div style={{display:"flex",gap:8}}>
            <Btn variant="secondary" onClick={()=>setPayModal(null)} style={{flex:1}}>Cancel</Btn>
            <Btn onClick={()=>{showToast(`✅ Payment collected!`);setPayModal(null);}} style={{flex:2}}>Confirm ✓</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* Admin Trainers */
function AdminTrainers({ showToast }) {
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <h2 style={{fontSize:20,fontWeight:900,color:"#f0f0f0",fontFamily:"'Barlow Condensed',sans-serif",margin:0}}>Trainers</h2>
        <Btn onClick={()=>showToast("➕ Add trainer coming soon")}>+ Add Trainer</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
        {TRAINERS_DATA.map((t,i)=>(
          <div key={i} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:18,overflow:"hidden",transition:"all .3s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=ORANGE+"44";e.currentTarget.style.transform="translateY(-3px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.transform="none";}}>
            <div style={{position:"relative",height:180,overflow:"hidden"}}>
              <img src={t.img} alt={t.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 40%,rgba(0,0,0,.8))"}}/>
              <div style={{position:"absolute",bottom:12,left:14}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#fff"}}>{t.name}</div>
                <div style={{fontSize:11,color:ORANGE}}>{t.role}</div>
              </div>
            </div>
            <div style={{padding:16}}>
              <div style={{display:"flex",justifyContent:"space-around",marginBottom:14}}>
                {[[t.clients,"Clients"],[`⭐${t.rating}`,"Rating"],[t.exp,"Exp"]].map(([v,l])=>(
                  <div key={l} style={{textAlign:"center"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:ORANGE}}>{v}</div>
                    <div style={{fontSize:10,color:"#555"}}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:11,color:"#555",textAlign:"center",padding:"7px",background:SURFACE,borderRadius:8,marginBottom:12}}>🎓 {t.cert}</div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,color:"#444",marginBottom:6,fontWeight:600}}>CLIENTS</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {MOCK_MEMBERS.filter(m=>m.trainer===t.name).map(m=>(
                    <Badge key={m.id} label={m.name.split(" ")[0]} color="#8B5CF6"/>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn onClick={()=>showToast(`📋 Schedule for ${t.name}`)} style={{flex:1,padding:"8px",fontSize:12}}>Schedule</Btn>
                <Btn variant="secondary" onClick={()=>showToast(`✏ Edit ${t.name}`)} style={{flex:1,padding:"8px",fontSize:12}}>Edit</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Admin Plans */
function AdminPlans({ showToast }) {
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:20,fontWeight:900,color:"#f0f0f0",fontFamily:"'Barlow Condensed',sans-serif",margin:0}}>Membership Plans</h2>
        <Btn onClick={()=>showToast("➕ New plan coming soon")}>+ New Plan</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
        {PLANS_DATA.map((p,i)=>{
          const cnt=MOCK_MEMBERS.filter(m=>m.plan===p.name.charAt(0)+p.name.slice(1).toLowerCase()).length||MOCK_MEMBERS.filter(m=>m.plan.toLowerCase()===p.name.toLowerCase()).length;
          const rev=MOCK_MEMBERS.filter(m=>m.plan.toLowerCase()===p.name.toLowerCase()).reduce((s,m)=>s+m.paidAmount,0);
          return (
            <div key={i} style={{background:CARD,border:`1px solid ${p.color}33`,borderRadius:20,padding:24,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,background:p.color+"0A",borderRadius:"50%"}}/>
              {p.tag&&<div style={{position:"absolute",top:14,right:14,background:ORANGE,color:"#fff",fontSize:9,fontWeight:800,padding:"3px 9px",borderRadius:20}}>{p.tag}</div>}
              <div style={{fontSize:10,color:p.color,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>{p.name}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:34,fontWeight:900,color:"#f0f0f0",letterSpacing:-1}}>₨{p.price.toLocaleString()}<span style={{fontSize:13,fontWeight:400,color:"#555"}}>/mo</span></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"14px 0",padding:10,background:SURFACE,borderRadius:10}}>
                <div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#555"}}>Members</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:p.color}}>{cnt}</div></div>
                <div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#555"}}>Revenue</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#22C55E"}}>₨{(rev/1000).toFixed(0)}K</div></div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:14}}>
                {p.features.slice(0,4).map(f=>(
                  <div key={f} style={{display:"flex",gap:7,fontSize:12,color:"#666"}}>
                    <span style={{color:p.color,fontWeight:700}}>✓</span>{f}
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn onClick={()=>showToast(`✏ Edit ${p.name}`)} style={{flex:1,padding:"8px",fontSize:12,background:p.color+"22",color:p.color,border:`1px solid ${p.color}44`}}>Edit</Btn>
                <Btn variant="danger" onClick={()=>showToast(`⚠ Delete ${p.name}?`,"warn")} style={{flex:1,padding:"8px",fontSize:12}}>Delete</Btn>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Admin Analytics */
function AdminAnalytics() {
  const totalRev=MOCK_MEMBERS.reduce((s,m)=>s+m.paidAmount,0);
  return (
    <div>
      <h2 style={{fontSize:20,fontWeight:900,color:"#f0f0f0",fontFamily:"'Barlow Condensed',sans-serif",margin:"0 0 18px"}}>Analytics & Reports</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:10,marginBottom:18}}>
        <KpiCard icon="📊" label="Daily Avg" value="47" sub="members/day" color={ORANGE}/>
        <KpiCard icon="💰" label="Monthly Rev" value="₨147K" sub="May 2026" color="#22C55E" trend={8}/>
        <KpiCard icon="🔄" label="Retention" value="87%" sub="vs 82% last mo" color="#3B82F6" trend={5}/>
        <KpiCard icon="🆕" label="New Members" value="5" sub="this month" color="#8B5CF6"/>
        <KpiCard icon="💸" label="Total Collected" value={`₨${(totalRev/1000).toFixed(0)}K`} color="#F59E0B"/>
        <KpiCard icon="📉" label="Churn Rate" value="3.2%" sub="improving" color="#EF4444"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14,marginBottom:14}}>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:18}}>
          <div style={{fontSize:13,fontWeight:700,color:"#f0f0f0",marginBottom:14,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5}}>Weekly Attendance</div>
          <MiniBarChart data={WEEKLY_ATT} vKey="v" lKey="day" color={ORANGE}/>
        </div>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:18}}>
          <div style={{fontSize:13,fontWeight:700,color:"#f0f0f0",marginBottom:14,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5}}>Revenue Trend (₨K)</div>
          <MiniBarChart data={MONTHLY_REV} vKey="v" lKey="m" color="#22C55E"/>
        </div>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:18}}>
          <div style={{fontSize:13,fontWeight:700,color:"#f0f0f0",marginBottom:14,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5}}>Revenue by Plan</div>
          {PLANS_DATA.map(p=>{
            const rev=MOCK_MEMBERS.filter(m=>m.plan.toLowerCase()===p.name.toLowerCase()).reduce((s,m)=>s+m.paidAmount,0);
            const pct=totalRev?Math.round(rev/totalRev*100):0;
            return (
              <div key={p.name} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                  <span style={{color:"#555"}}>{p.name}</span>
                  <span style={{color:"#f0f0f0",fontWeight:700}}>₨{(rev/1000).toFixed(0)}K · {pct}%</span>
                </div>
                <ProgressBar pct={pct} color={p.color}/>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* Admin Settings */
function AdminSettings({ showToast }) {
  const [notify, setNotify] = useState({sms:true,whatsapp:true,email:false});
  return (
    <div>
      <h2 style={{fontSize:20,fontWeight:900,color:"#f0f0f0",fontFamily:"'Barlow Condensed',sans-serif",margin:"0 0 20px"}}>Settings</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#f0f0f0",marginBottom:16}}>🏋️ Gym Information</div>
          <Inp label="Gym Name" value="Iron Pulse Gym" onChange={()=>{}}/>
          <Inp label="City" value="Lahore" onChange={()=>{}}/>
          <Inp label="Phone" value="+92 42 111-496-001" onChange={()=>{}}/>
          <Btn onClick={()=>showToast("✅ Settings saved")} style={{width:"100%"}}>Save Changes</Btn>
        </div>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#f0f0f0",marginBottom:16}}>🔔 Notifications</div>
          {[["sms","📱 SMS Alerts"],["whatsapp","💬 WhatsApp"],["email","📧 Email Alerts"]].map(([k,l])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,padding:"11px 13px",background:SURFACE,borderRadius:10}}>
              <span style={{fontSize:13,color:"#ccc"}}>{l}</span>
              <div onClick={()=>setNotify(n=>({...n,[k]:!n[k]}))} style={{width:42,height:22,borderRadius:11,cursor:"pointer",background:notify[k]?ORANGE:BORDER,transition:"background .2s",position:"relative"}}>
                <div style={{position:"absolute",top:3,left:notify[k]?21:3,width:16,height:16,background:"#fff",borderRadius:"50%",transition:"left .2s"}}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:16,padding:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#f0f0f0",marginBottom:16}}>⚡ Quick Actions</div>
          {[["📤 Export Members CSV",()=>showToast("📤 Exporting...")],["📊 Download Monthly Report",()=>showToast("📊 Generating...")],["🔔 Bulk Fee Reminders",()=>showToast("📱 Reminders sent!")],["💾 Backup Data",()=>showToast("💾 Backup created!")]].map(([l,a])=>(
            <button key={l} onClick={a} style={{width:"100%",background:SURFACE,border:`1px solid ${BORDER}`,borderRadius:10,padding:"12px 14px",color:"#ccc",cursor:"pointer",fontSize:13,textAlign:"left",marginBottom:8,fontFamily:"inherit",transition:"all .15s"}}
              onMouseEnter={e=>{e.target.style.borderColor=ORANGE+"44";}} onMouseLeave={e=>{e.target.style.borderColor=BORDER;}}>{l}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Full Admin Panel */
function AdminPanel({ onWebsiteClick, showToast }) {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [time, setTime] = useState(new Date());
  useEffect(()=>{ const id=setInterval(()=>setTime(new Date()),60000); return()=>clearInterval(id); },[]);
  const titles={dashboard:"Dashboard",attendance:"Attendance",members:"Members",fees:"Fee Management",trainers:"Trainers",plans:"Plans",analytics:"Analytics",settings:"Settings"};
  const overdue=MOCK_MEMBERS.filter(m=>feeStatus(m)==="Overdue");
  const expiring=MOCK_MEMBERS.filter(m=>{ const d=daysUntil(m.dueDate); return d>=0&&d<=7; });
  const notifCount=overdue.length+expiring.length;
  const [notifOpen, setNotifOpen] = useState(false);
  const pages={dashboard:<AdminDashboard showToast={showToast}/>,attendance:<AdminAttendance showToast={showToast}/>,members:<AdminMembers showToast={showToast}/>,fees:<AdminFees showToast={showToast}/>,trainers:<AdminTrainers showToast={showToast}/>,plans:<AdminPlans showToast={showToast}/>,analytics:<AdminAnalytics/>,settings:<AdminSettings showToast={showToast}/>};

  return (
    <div style={{display:"flex",background:BG,minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:"#f0f0f0"}}>
      <AdminSidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        {/* Topbar */}
        <div style={{background:SURFACE,borderBottom:`1px solid ${BORDER}`,padding:"0 20px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,gap:12}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:800,color:"#f0f0f0",letterSpacing:.5}}>{titles[page]}</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:11,color:"#555",background:CARD,border:`1px solid ${BORDER}`,borderRadius:8,padding:"4px 12px",whiteSpace:"nowrap"}}>
              {time.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})} · {time.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
            </div>
            <button onClick={()=>setNotifOpen(!notifOpen)} style={{background:"none",border:"none",cursor:"pointer",position:"relative",padding:4}}>
              <span style={{fontSize:18}}>🔔</span>
              {notifCount>0&&<span style={{position:"absolute",top:-2,right:-2,background:"#EF4444",color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{notifCount}</span>}
            </button>
            <button onClick={onWebsiteClick} style={{background:ORANGE+"18",border:`1px solid ${ORANGE}30`,borderRadius:8,padding:"6px 14px",color:ORANGE,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>← Website</button>
            <Avatar name="Admin User" size={30}/>
          </div>
        </div>
        {/* Notification drop */}
        {notifOpen && (
          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,margin:"0 20px",padding:16,zIndex:90,animation:"slideDown .2s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
              <span style={{fontSize:13,fontWeight:700,color:"#f0f0f0"}}>🔔 Notifications ({notifCount})</span>
              <button onClick={()=>setNotifOpen(false)} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:18}}>×</button>
            </div>
            {overdue.map(m=><div key={m.id} style={{padding:"9px 12px",background:"#EF444412",border:"1px solid #EF444422",borderRadius:9,fontSize:12,color:"#EF4444",marginBottom:6}}>🚨 {m.name} — fee overdue ({m.id})</div>)}
            {expiring.map(m=>{const d=daysUntil(m.dueDate);return<div key={m.id} style={{padding:"9px 12px",background:"#F59E0B12",border:"1px solid #F59E0B22",borderRadius:9,fontSize:12,color:"#F59E0B",marginBottom:6}}>⚠️ {m.name} — {d===0?"expires today":d===1?"expires tomorrow":`expires in ${d}d`}</div>;})}
            {notifCount===0&&<div style={{fontSize:12,color:"#555",textAlign:"center",padding:"10px 0"}}>No notifications 🎉</div>}
          </div>
        )}
        {/* Mobile nav */}
        <div style={{overflowX:"auto",background:SURFACE,borderBottom:`1px solid ${BORDER}`,padding:"8px 12px",display:"flex",gap:5}}>
          {ADMIN_NAV.map(n=>(
            <button key={n.id} onClick={()=>setPage(n.id)} style={{background:page===n.id?ORANGE+"22":"transparent",border:`1px solid ${page===n.id?ORANGE+"44":"transparent"}`,borderRadius:9,padding:"6px 12px",color:page===n.id?ORANGE:"#555",cursor:"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap",fontFamily:"inherit"}}>
              {n.icon} {n.label}
            </button>
          ))}
        </div>
        <div style={{flex:1,padding:"22px",overflowY:"auto",overflowX:"hidden"}}>
          {pages[page]}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState("website"); // "website" | "admin"
  const [toasts, showToast] = useToast();
  return (
    <>
      <style>{G}</style>
      <ToastStack toasts={toasts}/>
      {view==="website"
        ? <PublicWebsite onAdminClick={()=>setView("admin")} showToast={showToast}/>
        : <AdminPanel onWebsiteClick={()=>setView("website")} showToast={showToast}/>
      }
    </>
  );
}
