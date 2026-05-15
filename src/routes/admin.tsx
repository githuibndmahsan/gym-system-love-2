import { createFileRoute } from "@tanstack/react-router";
import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { CameraCapture } from "@/components/CameraCapture";
import { Toaster, toast } from "sonner";
import { GYM } from "@/lib/gym-config";

export const Route = createFileRoute("/admin")({
  component: AdminApp,
  head: () => ({ meta: [{ title: `Admin · ${GYM.name}` }] }),
});

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  orange: "#0096FF", orangeLight: "#33AEFF", orangeDark: "#0077CC",
  dark: "#00060F", darker: "#000308", card: "#020D1E", cardHover: "#051728",
  border: "#0A2040", borderLight: "#0D2A52",
  text: "#F0F4FF", textMuted: "#7A87AA", textFaint: "#374060",
  green: "#22C55E", red: "#EF4444", blue: "#66C2FF", amber: "#F59E0B", purple: "#818CF8",
};

// ─── Translations ─────────────────────────────────────────────────────────────
type Lang = "en" | "ur";
const TR = {
  en: {
    dashboard:"Dashboard", attendance:"Attendance", register:"Monthly Register", members:"Members", trainers:"Trainers",
    fees:"Fee Management", plans:"Plans", analytics:"Analytics", ceo:"About Gym",
    dailyAttendance:"Daily Attendance", morningBatch:"Morning Batch", eveningBatch:"Evening Batch",
    arrived:"Arrived", left:"Left", noRecords:"No records",
    addMember:"Add Member", editMember:"Edit Member", deleteMember:"Delete",
    addTrainer:"Add Trainer", editTrainer:"Edit Trainer",
    fullName:"Full Name", phone:"Phone", plan:"Plan", batch:"Batch",
    joinDate:"Join Date", bloodGroup:"Blood Group", medicalConditions:"Medical Conditions",
    emergencyContact:"Emergency Contact Name", emergencyPhone:"Emergency Phone",
    allergiesNotes:"Allergies / Notes", specialty:"Specialty", experience:"Experience (yrs)",
    schedule:"Schedule", salary:"Salary (₨)", bio:"Short Bio",
    save:"Save", cancel:"Cancel", delete:"Delete", edit:"Edit",
    openCamera:"📷 Camera", uploadFile:"📁 Upload File", retakePhoto:"Retake",
    search:"Search...", active:"Active", expired:"Expired",
    paid:"Paid", unpaid:"Unpaid", partial:"Partial", overdue:"Overdue",
    present:"Present", absent:"Absent", collect:"Collect",
    totalMembers:"Total Members", presentToday:"Present Today",
    checkedIn:"Checked In", checkedOut:"Checked Out",
    absentToday:"Absent Today", todayRevenue:"Today's Revenue",
    totalCollected:"Total Collected", pendingDues:"Pending Dues",
    fullyPaid:"Fully Paid", morning:"Morning", evening:"Evening",
    photoCapture:"Profile Photo", confirmDelete:"Are you sure?",
    nameRequired:"Name is required", memberAdded:"Member added",
    memberUpdated:"Member updated", memberDeleted:"Member deleted",
    trainerAdded:"Trainer added", trainerUpdated:"Trainer updated", trainerDeleted:"Trainer deleted",
    photoUpdated:"Photo updated", feeCollected:"Fee collected",
    switchToUrdu:"اردو", switchToEn:"English",
    objective:"Gym Objective", ceoIntro:"CEO Introduction",
    contact:"Contact", address:"Address", timing:"Timings",
    monthlyFee:"Monthly Fee", dueDate:"Due Date", joinedOn:"Joined",
  },
  ur: {
    dashboard:"ڈیش بورڈ", attendance:"حاضری", register:"ماہانہ رجسٹر", members:"ممبران", trainers:"ٹرینرز",
    fees:"فیس مینجمنٹ", plans:"پلانز", analytics:"تجزیات", ceo:"جم کے بارے میں",
    dailyAttendance:"روزانہ حاضری", morningBatch:"صبح کا بیچ", eveningBatch:"شام کا بیچ",
    arrived:"آئے", left:"گئے", noRecords:"کوئی ریکارڈ نہیں",
    addMember:"ممبر شامل کریں", editMember:"ممبر ترمیم کریں", deleteMember:"حذف کریں",
    addTrainer:"ٹرینر شامل کریں", editTrainer:"ٹرینر ترمیم کریں",
    fullName:"مکمل نام", phone:"فون نمبر", plan:"پلان", batch:"بیچ",
    joinDate:"شمولیت کی تاریخ", bloodGroup:"بلڈ گروپ", medicalConditions:"طبی حالات",
    emergencyContact:"ہنگامی رابطہ نام", emergencyPhone:"ہنگامی فون",
    allergiesNotes:"الرجی / نوٹس", specialty:"خصوصیت", experience:"تجربہ (سال)",
    schedule:"شیڈول", salary:"تنخواہ (₨)", bio:"مختصر تعارف",
    save:"محفوظ کریں", cancel:"منسوخ", delete:"حذف", edit:"ترمیم",
    openCamera:"📷 کیمرہ", uploadFile:"📁 فائل", retakePhoto:"دوبارہ",
    search:"تلاش کریں...", active:"فعال", expired:"میعاد ختم",
    paid:"ادا شدہ", unpaid:"غیر ادا شدہ", partial:"جزوی", overdue:"تاخیر",
    present:"حاضر", absent:"غیر حاضر", collect:"وصول کریں",
    totalMembers:"کل ممبران", presentToday:"آج حاضر", checkedIn:"چیک ان",
    checkedOut:"چیک آؤٹ", absentToday:"آج غیر حاضر", todayRevenue:"آج کی آمدنی",
    totalCollected:"کل وصولی", pendingDues:"باقی واجبات",
    fullyPaid:"مکمل ادا", morning:"صبح", evening:"شام",
    photoCapture:"پروفائل فوٹو", confirmDelete:"کیا آپ یقینی ہیں؟",
    nameRequired:"نام لازمی ہے", memberAdded:"ممبر شامل ہو گیا",
    memberUpdated:"ممبر اپڈیٹ ہو گیا", memberDeleted:"ممبر حذف ہو گیا",
    trainerAdded:"ٹرینر شامل ہو گیا", trainerUpdated:"ٹرینر اپڈیٹ ہو گیا", trainerDeleted:"ٹرینر حذف ہو گیا",
    photoUpdated:"فوٹو اپڈیٹ ہو گئی", feeCollected:"فیس وصول ہو گئی",
    switchToUrdu:"اردو", switchToEn:"English",
    objective:"جم کا مقصد", ceoIntro:"سی ای او کا تعارف",
    contact:"رابطہ", address:"پتہ", timing:"اوقات",
    monthlyFee:"ماہانہ فیس", dueDate:"آخری تاریخ", joinedOn:"شمولیت",
  },
} as const;

// ─── Contexts ─────────────────────────────────────────────────────────────────
const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });
const ImagesCtx = createContext<{ imgs: Record<string, string>; setImg: (id: string, url: string) => void }>({ imgs: {}, setImg: () => {} });

function useLang() {
  const { lang } = useContext(LangCtx);
  return (k: keyof typeof TR.en) => (TR[lang] as Record<string, string>)[k] ?? TR.en[k];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const MEDICAL_CONDITIONS = ["Asthma","Blood Pressure","Heart Disease","Diabetes","Epilepsy","Arthritis","Kidney Disease","Thyroid","Other"];
const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-","Unknown"];

const PLANS = [
  { name:"Starter", monthly:2500, quarterly:7000, halfYearly:13000, yearly:24000,
    features:["Gym Access","Locker","Basic Equipment"], color:C.blue },
  { name:"Pro", monthly:5000, quarterly:14000, halfYearly:26000, yearly:50000,
    features:["All Starter","Group Classes","Diet Plan","Progress Tracking"], color:C.orange },
  { name:"Elite", monthly:9000, quarterly:25000, halfYearly:47000, yearly:90000,
    features:["All Pro","Personal Trainer","Nutrition Plan","Priority Access","Spa Access"], color:C.purple },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type Medical = { bloodGroup:string; conditions:string[]; emergencyName:string; emergencyPhone:string; allergies:string };
type Member = { id:string; name:string; phone:string; plan:string; fee:number; status:string; batch:string; dueDate:string; paidAmount:number; lastPayment:string; joinDate:string; medical:Medical };
type Trainer = { id:string; name:string; phone:string; specialty:string; experience:number; schedule:string; salary:number; status:string; bio:string };
type AttRecord = { arrived:boolean; arrivedTime:string; left:boolean; leftTime:string };

// ─── Initial Data ─────────────────────────────────────────────────────────────
const INIT_MEMBERS: Member[] = [
  { id:"GM001", name:"Ahmed Raza", phone:"+92 300 1234567", plan:"Elite", fee:9000, status:"Active", batch:"Morning", dueDate:"2026-06-01", paidAmount:9000, lastPayment:"2026-05-01", joinDate:"2024-01-15", medical:{ bloodGroup:"B+", conditions:["Blood Pressure"], emergencyName:"Hassan Raza", emergencyPhone:"+92 300 1111111", allergies:"None" } },
  { id:"GM002", name:"Fatima Khan", phone:"+92 301 2345678", plan:"Pro", fee:5000, status:"Active", batch:"Evening", dueDate:"2026-05-20", paidAmount:5000, lastPayment:"2026-04-20", joinDate:"2024-03-10", medical:{ bloodGroup:"O+", conditions:[], emergencyName:"Zara Khan", emergencyPhone:"+92 301 2222222", allergies:"Penicillin" } },
  { id:"GM003", name:"Usman Ali", phone:"+92 302 3456789", plan:"Starter", fee:2500, status:"Active", batch:"Morning", dueDate:"2026-05-15", paidAmount:0, lastPayment:"2026-04-15", joinDate:"2024-06-01", medical:{ bloodGroup:"A+", conditions:["Asthma"], emergencyName:"Bilal Ali", emergencyPhone:"+92 302 3333333", allergies:"None" } },
  { id:"GM004", name:"Sana Malik", phone:"+92 303 4567890", plan:"Elite", fee:9000, status:"Active", batch:"Evening", dueDate:"2026-06-10", paidAmount:9000, lastPayment:"2026-05-10", joinDate:"2023-11-20", medical:{ bloodGroup:"AB+", conditions:["Diabetes"], emergencyName:"Kamran Malik", emergencyPhone:"+92 303 4444444", allergies:"None" } },
  { id:"GM005", name:"Hassan Sheikh", phone:"+92 304 5678901", plan:"Pro", fee:5000, status:"Expired", batch:"Morning", dueDate:"2026-05-01", paidAmount:2500, lastPayment:"2026-04-01", joinDate:"2024-02-14", medical:{ bloodGroup:"B-", conditions:["Heart Disease"], emergencyName:"Ahmed Sheikh", emergencyPhone:"+92 304 5555555", allergies:"Aspirin" } },
  { id:"GM006", name:"Ayesha Noor", phone:"+92 305 6789012", plan:"Starter", fee:2500, status:"Active", batch:"Evening", dueDate:"2026-06-05", paidAmount:2500, lastPayment:"2026-05-05", joinDate:"2024-04-22", medical:{ bloodGroup:"O-", conditions:[], emergencyName:"Nadia Noor", emergencyPhone:"+92 305 6666666", allergies:"None" } },
  { id:"GM007", name:"Bilal Ahmad", phone:"+92 306 7890123", plan:"Elite", fee:9000, status:"Active", batch:"Morning", dueDate:"2026-06-08", paidAmount:9000, lastPayment:"2026-05-08", joinDate:"2023-09-01", medical:{ bloodGroup:"A-", conditions:["Blood Pressure","Diabetes"], emergencyName:"Tariq Ahmad", emergencyPhone:"+92 306 7777777", allergies:"None" } },
  { id:"GM008", name:"Zara Hussain", phone:"+92 307 8901234", plan:"Pro", fee:5000, status:"Active", batch:"Evening", dueDate:"2026-05-25", paidAmount:0, lastPayment:"2026-04-25", joinDate:"2024-07-11", medical:{ bloodGroup:"B+", conditions:["Thyroid"], emergencyName:"Imran Hussain", emergencyPhone:"+92 307 8888888", allergies:"Sulfa drugs" } },
];

const INIT_TRAINERS: Trainer[] = [
  { id:"TR001", name:"Coach Tariq", phone:"+92 321 1000001", specialty:"Weight Training & Powerlifting", experience:8, schedule:"Mon–Sat, 6AM–2PM", salary:45000, status:"Active", bio:"Expert in powerlifting and muscle-building. National-level competitor." },
  { id:"TR002", name:"Coach Maria", phone:"+92 321 1000002", specialty:"Yoga, Zumba & Women Fitness", experience:5, schedule:"Mon–Fri, 5PM–10PM", salary:35000, status:"Active", bio:"Certified yoga instructor specializing in women's fitness and flexibility." },
  { id:"TR003", name:"Coach Farhan", phone:"+92 321 1000003", specialty:"Cardio, HIIT & Weight Loss", experience:6, schedule:"Mon–Sat, 6AM–12PM", salary:40000, status:"Active", bio:"High-intensity training specialist. Helped 200+ clients achieve weight loss goals." },
];

const WEEKLY_DATA = [
  { day:"Mon", present:42, absent:18 }, { day:"Tue", present:38, absent:22 },
  { day:"Wed", present:55, absent:5 }, { day:"Thu", present:60, absent:0 },
  { day:"Fri", present:48, absent:12 }, { day:"Sat", present:52, absent:8 }, { day:"Sun", present:30, absent:30 },
];
const PEAK_HOURS = [
  { hour:"6AM", count:12 }, { hour:"7AM", count:28 }, { hour:"8AM", count:35 },
  { hour:"9AM", count:22 }, { hour:"10AM", count:15 }, { hour:"11AM", count:10 },
  { hour:"12PM", count:8 }, { hour:"1PM", count:6 }, { hour:"4PM", count:18 },
  { hour:"5PM", count:38 }, { hour:"6PM", count:55 }, { hour:"7PM", count:48 },
  { hour:"8PM", count:32 }, { hour:"9PM", count:15 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const nowTime = () => new Date().toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
const todayKey = () => new Date().toISOString().slice(0, 10);
const genId = (prefix: string, arr: { id: string }[]) =>
  `${prefix}${String(arr.length + 1).padStart(3, "0")}`;
const feeStatus = (m: Member) => {
  if (m.paidAmount >= m.fee) return "Paid";
  if (m.paidAmount > 0) return "Partial";
  if (new Date(m.dueDate) < new Date()) return "Overdue";
  return "Unpaid";
};

// ─── Small Components ─────────────────────────────────────────────────────────
function Avatar({ name, size = 40, id }: { name: string; size?: number; id?: string }) {
  const { imgs } = useContext(ImagesCtx);
  const img = id ? imgs[id] : undefined;
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const palette = [C.orange, C.purple, C.blue, C.green, C.amber, "#EC4899"];
  const col = palette[name.charCodeAt(0) % palette.length];
  if (img) return <img src={img} alt={name} style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover", flexShrink:0, border:`2px solid ${C.orange}55`, display:"block" }} />;
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:col+"22", border:`2px solid ${col}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.35, fontWeight:700, color:col, flexShrink:0 }}>
      {initials}
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    Active:["#22C55E22","#22C55E"], Expired:["#EF444422","#EF4444"],
    Paid:["#22C55E22","#22C55E"], Unpaid:["#EF444422","#EF4444"],
    Partial:["#F59E0B22","#F59E0B"], Overdue:["#EF444422","#EF4444"],
    Present:["#22C55E22","#22C55E"], Absent:["#EF444422","#EF4444"],
    "Checked In":["#0096FF22","#0096FF"], Completed:["#818CF822","#818CF8"],
    Online:["#0096FF22","#0096FF"], Cash:["#22C55E22","#22C55E"],
    Card:["#818CF822","#818CF8"], Morning:["#F59E0B22","#F59E0B"],
    Evening:["#818CF822","#818CF8"],
  };
  const [bg, col] = map[status] ?? ["#88888822","#888888"];
  return <span style={{ background:bg, color:col, border:`1px solid ${col}44`, borderRadius:6, padding:"2px 10px", fontSize:11, fontWeight:600, letterSpacing:0.3, whiteSpace:"nowrap" as const }}>{status}</span>;
}

function Stat({ icon, label, value, sub, color=C.orange, trend }: { icon:string; label:string; value:string|number; sub?:string; color?:string; trend?:number }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"16px", position:"relative", overflow:"hidden", transition:"transform 0.2s" }}>
      <div style={{ position:"absolute", top:0, right:0, width:60, height:60, background:color+"0A", borderRadius:"0 16px 0 60px" }} />
      <div style={{ fontSize:20, marginBottom:6 }}>{icon}</div>
      <div style={{ fontSize:22, fontWeight:800, color:C.text, letterSpacing:-0.5 }}>{value}</div>
      <div style={{ fontSize:11, color:C.textMuted, marginTop:2, fontWeight:500 }}>{label}</div>
      {sub && <div style={{ fontSize:10, color, marginTop:4, fontWeight:600 }}>{sub}</div>}
      {trend !== undefined && <div style={{ fontSize:10, color:trend>0?C.green:C.red, marginTop:4 }}>{trend>0?"↑":"↓"} {Math.abs(trend)}%</div>}
    </div>
  );
}

function MiniBar({ data, vk, lk, color }: { data: Record<string,number>[]; vk:string; lk:string; color:string }) {
  const max = Math.max(...data.map((d) => d[vk]));
  return (
    <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:72 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
          <div style={{ width:"100%", height:(d[vk]/max)*58, background:color+"44", borderRadius:"3px 3px 0 0", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"65%", background:color, opacity:0.85 }} />
          </div>
          <span style={{ fontSize:8, color:C.textMuted }}>{d[lk]}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Field helpers ────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = { width:"100%", background:C.darker, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 14px", color:C.text, fontSize:13, boxSizing:"border-box", fontFamily:"inherit", outline:"none", transition:"border-color 0.2s" };
const labelStyle: React.CSSProperties = { fontSize:11, color:C.textMuted, display:"block", marginBottom:5, fontWeight:500 };

// ─── Photo Picker ─────────────────────────────────────────────────────────────
function PhotoPicker({ preview, onPreview, targetId, t }: {
  preview: string | null; onPreview: (url: string) => void;
  targetId: string; t: (k: keyof typeof TR.en) => string;
}) {
  const [camOpen, setCamOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:11, color:C.textMuted, marginBottom:8, fontWeight:500 }}>{t("photoCapture")}</div>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ position:"relative", flexShrink:0 }}>
          {preview
            ? <img src={preview} alt="" style={{ width:76, height:76, borderRadius:"50%", objectFit:"cover", border:`2px solid ${C.orange}` }} />
            : <div style={{ width:76, height:76, borderRadius:"50%", background:C.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, border:`2px dashed ${C.borderLight}` }}>👤</div>
          }
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8, flex:1 }}>
          <button type="button" onClick={() => setCamOpen(true)} style={{ background:C.orange+"22", border:`1px solid ${C.orange}55`, borderRadius:10, padding:"10px 16px", color:C.orange, cursor:"pointer", fontWeight:700, fontSize:13, minHeight:44, textAlign:"left" as const }}>
            {t("openCamera")}
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 16px", color:C.textMuted, cursor:"pointer", fontSize:13, minHeight:44, textAlign:"left" as const }}>
            {t("uploadFile")}
          </button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" style={{ display:"none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) { onPreview(URL.createObjectURL(f)); e.target.value = ""; } }} />
        </div>
      </div>
      <CameraCapture open={camOpen} onOpenChange={setCamOpen} title={t("photoCapture")}
        onCapture={(_blob, url) => { onPreview(url); }} />
    </div>
  );
}

// ─── Member Form ──────────────────────────────────────────────────────────────
const BLANK_MEMBER = (): Omit<Member, "id"> & { id?: string } => ({
  name:"", phone:"", plan:"Starter", fee:2500, status:"Active", batch:"Morning",
  dueDate:"", paidAmount:0, lastPayment:"", joinDate:new Date().toISOString().slice(0,10),
  medical:{ bloodGroup:"Unknown", conditions:[], emergencyName:"", emergencyPhone:"", allergies:"" },
});

function MemberForm({ initial, existingId, onSave, onClose, members, t }: {
  initial?: Partial<Member>; existingId?: string;
  onSave: (m: Member, preview: string | null) => void;
  onClose: () => void; members: Member[];
  t: (k: keyof typeof TR.en) => string;
}) {
  const [form, setForm] = useState<ReturnType<typeof BLANK_MEMBER>>({ ...BLANK_MEMBER(), ...initial });
  const [preview, setPreview] = useState<string | null>(null);
  const { imgs } = useContext(ImagesCtx);
  const existingPhoto = existingId ? imgs[existingId] ?? null : null;

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));
  const setMed = (k: string, v: unknown) => setForm((p) => ({ ...p, medical: { ...p.medical, [k]: v } }));
  const toggleCondition = (c: string) => setMed("conditions", form.medical.conditions.includes(c) ? form.medical.conditions.filter((x) => x !== c) : [...form.medical.conditions, c]);

  const handleSave = () => {
    if (!form.name.trim()) { toast.error(t("nameRequired")); return; }
    const id = existingId ?? genId("GM", members);
    const plan = PLANS.find((p) => p.name === form.plan);
    onSave({ ...(form as Member), id, fee: plan?.monthly ?? form.fee }, preview);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,2,10,0.92)", zIndex:2000, overflowY:"auto", WebkitOverflowScrolling:"touch" as unknown as undefined }}>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:22, padding:"24px 20px", width:"100%", maxWidth:480, margin:"20px auto", boxSizing:"border-box" }}>
        <div style={{ fontSize:17, fontWeight:800, color:C.text, marginBottom:4 }}>{existingId ? t("editMember") : t("addMember")}</div>
        <div style={{ fontSize:12, color:C.textMuted, marginBottom:20 }}>{GYM.name}</div>

        <PhotoPicker preview={preview ?? existingPhoto} onPreview={setPreview} targetId={existingId ?? "new"} t={t} />

        {/* Basic info */}
        <div style={{ display:"grid", gap:12, marginBottom:12 }}>
          <div>
            <label style={labelStyle}>{t("fullName")} *</label>
            <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Ahmed Raza" />
          </div>
          <div>
            <label style={labelStyle}>{t("phone")}</label>
            <input style={inputStyle} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+92 300 0000000" type="tel" />
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
          <div>
            <label style={labelStyle}>{t("plan")}</label>
            <select style={{ ...inputStyle }} value={form.plan} onChange={(e) => { const p = PLANS.find((x) => x.name === e.target.value); set("plan", e.target.value); if (p) set("fee", p.monthly); }}>
              {PLANS.map((p) => <option key={p.name} value={p.name}>{p.name} — ₨{p.monthly.toLocaleString()}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>{t("batch")}</label>
            <select style={{ ...inputStyle }} value={form.batch} onChange={(e) => set("batch", e.target.value)}>
              <option>Morning</option><option>Evening</option>
            </select>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
          <div>
            <label style={labelStyle}>{t("joinDate")}</label>
            <input style={inputStyle} type="date" value={form.joinDate} onChange={(e) => set("joinDate", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>{t("dueDate")}</label>
            <input style={inputStyle} type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
          </div>
        </div>

        {/* Medical section */}
        <div style={{ background:C.darker, borderRadius:14, padding:16, marginBottom:20, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.orange, marginBottom:12, letterSpacing:0.5, textTransform:"uppercase" as const }}>🩺 Medical Info</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            <div>
              <label style={labelStyle}>{t("bloodGroup")}</label>
              <select style={{ ...inputStyle }} value={form.medical.bloodGroup} onChange={(e) => setMed("bloodGroup", e.target.value)}>
                {BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t("emergencyPhone")}</label>
              <input style={inputStyle} value={form.medical.emergencyPhone} onChange={(e) => setMed("emergencyPhone", e.target.value)} placeholder="+92 300 0000000" type="tel" />
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={labelStyle}>{t("emergencyContact")}</label>
            <input style={inputStyle} value={form.medical.emergencyName} onChange={(e) => setMed("emergencyName", e.target.value)} placeholder="Contact person name" />
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={labelStyle}>{t("medicalConditions")}</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {MEDICAL_CONDITIONS.map((c) => {
                const on = form.medical.conditions.includes(c);
                return (
                  <button key={c} type="button" onClick={() => toggleCondition(c)} style={{ padding:"6px 12px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer", border:`1px solid ${on ? C.red : C.border}`, background:on ? C.red+"22" : "transparent", color:on ? C.red : C.textMuted, transition:"all 0.15s", minHeight:36 }}>
                    {on ? "✓ " : ""}{c}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label style={labelStyle}>{t("allergiesNotes")}</label>
            <textarea style={{ ...inputStyle, height:60, resize:"vertical" }} value={form.medical.allergies} onChange={(e) => setMed("allergies", e.target.value)} placeholder="Any allergies or important notes..." />
          </div>
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, padding:14, color:C.textMuted, cursor:"pointer", fontWeight:600, fontSize:14, minHeight:48 }}>{t("cancel")}</button>
          <button onClick={handleSave} style={{ flex:2, background:C.orange, border:"none", borderRadius:12, padding:14, color:"#fff", cursor:"pointer", fontWeight:800, fontSize:14, minHeight:48 }}>{t("save")}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Trainer Form ─────────────────────────────────────────────────────────────
const BLANK_TRAINER = (): Omit<Trainer,"id"> => ({ name:"", phone:"", specialty:"", experience:1, schedule:"", salary:30000, status:"Active", bio:"" });

function TrainerForm({ initial, existingId, onSave, onClose, trainers, t }: {
  initial?: Partial<Trainer>; existingId?: string;
  onSave: (tr: Trainer, preview: string | null) => void;
  onClose: () => void; trainers: Trainer[];
  t: (k: keyof typeof TR.en) => string;
}) {
  const [form, setForm] = useState<ReturnType<typeof BLANK_TRAINER>>({ ...BLANK_TRAINER(), ...initial });
  const [preview, setPreview] = useState<string | null>(null);
  const { imgs } = useContext(ImagesCtx);
  const existingPhoto = existingId ? imgs[existingId] ?? null : null;
  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) { toast.error(t("nameRequired")); return; }
    const id = existingId ?? genId("TR", trainers);
    onSave({ ...(form as Trainer), id }, preview);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,2,10,0.92)", zIndex:2000, overflowY:"auto", WebkitOverflowScrolling:"touch" as unknown as undefined }}>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:22, padding:"24px 20px", width:"100%", maxWidth:460, margin:"20px auto", boxSizing:"border-box" }}>
        <div style={{ fontSize:17, fontWeight:800, color:C.text, marginBottom:4 }}>{existingId ? t("editTrainer") : t("addTrainer")}</div>
        <div style={{ fontSize:12, color:C.textMuted, marginBottom:20 }}>{GYM.name}</div>

        <PhotoPicker preview={preview ?? existingPhoto} onPreview={setPreview} targetId={existingId ?? "new-trainer"} t={t} />

        <div style={{ display:"grid", gap:12, marginBottom:12 }}>
          <div>
            <label style={labelStyle}>{t("fullName")} *</label>
            <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Coach Name" />
          </div>
          <div>
            <label style={labelStyle}>{t("phone")}</label>
            <input style={inputStyle} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+92 321 0000000" type="tel" />
          </div>
          <div>
            <label style={labelStyle}>{t("specialty")}</label>
            <input style={inputStyle} value={form.specialty} onChange={(e) => set("specialty", e.target.value)} placeholder="e.g. Weight Training & Powerlifting" />
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
          <div>
            <label style={labelStyle}>{t("experience")}</label>
            <input style={inputStyle} type="number" min="0" value={form.experience} onChange={(e) => set("experience", Number(e.target.value))} />
          </div>
          <div>
            <label style={labelStyle}>{t("salary")}</label>
            <input style={inputStyle} type="number" value={form.salary} onChange={(e) => set("salary", Number(e.target.value))} />
          </div>
        </div>
        <div style={{ marginBottom:12 }}>
          <label style={labelStyle}>{t("schedule")}</label>
          <input style={inputStyle} value={form.schedule} onChange={(e) => set("schedule", e.target.value)} placeholder="e.g. Mon–Sat, 6AM–2PM" />
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={labelStyle}>{t("bio")}</label>
          <textarea style={{ ...inputStyle, height:72, resize:"vertical" }} value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Short professional bio..." />
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, background:"transparent", border:`1px solid ${C.border}`, borderRadius:12, padding:14, color:C.textMuted, cursor:"pointer", fontWeight:600, fontSize:14, minHeight:48 }}>{t("cancel")}</button>
          <button onClick={handleSave} style={{ flex:2, background:C.orange, border:"none", borderRadius:12, padding:14, color:"#fff", cursor:"pointer", fontWeight:800, fontSize:14, minHeight:48 }}>{t("save")}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, collapsed, setCollapsed, t }: {
  page:string; setPage:(p:string)=>void; collapsed:boolean; setCollapsed:(c:boolean)=>void; t:(k:keyof typeof TR.en)=>string;
}) {
  const nav = [
    { id:"dashboard",  icon:"⬡",  tk:"dashboard" },
    { id:"attendance", icon:"✓",  tk:"attendance" },
    { id:"register",   icon:"📋", tk:"register" },
    { id:"members",    icon:"◉",  tk:"members" },
    { id:"trainers",   icon:"🏋", tk:"trainers" },
    { id:"fees",       icon:"₨",  tk:"fees" },
    { id:"plans",      icon:"◈",  tk:"plans" },
    { id:"analytics",  icon:"◫",  tk:"analytics" },
    { id:"ceo",        icon:"🏛", tk:"ceo" },
  ] as const;
  return (
    <div style={{ width:collapsed?60:220, background:C.darker, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", transition:"width 0.25s cubic-bezier(.4,0,.2,1)", overflow:"hidden", flexShrink:0, height:"100vh", position:"sticky", top:0 }}>
      <div style={{ padding:collapsed?"18px 0":"18px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:8, justifyContent:collapsed?"center":"space-between" }}>
        {!collapsed && (
          <div>
            <div style={{ fontSize:12, fontWeight:900, color:C.orange, letterSpacing:1.5, textTransform:"uppercase" }}>{GYM.name}</div>
            <div style={{ fontSize:9, color:C.textMuted, letterSpacing:0.3 }}>{GYM.city} · Est. {GYM.established}</div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background:C.border, border:"none", borderRadius:8, width:28, height:28, color:C.textMuted, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, flexShrink:0 }}>
          {collapsed ? "▶" : "◀"}
        </button>
      </div>
      <nav style={{ padding:"10px 6px", flex:1, overflowY:"auto" }}>
        {nav.map((n) => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:collapsed?"10px 0":"10px 12px", justifyContent:collapsed?"center":"flex-start", background:page===n.id ? C.orange+"1A" : "transparent", border:`1px solid ${page===n.id ? C.orange+"44" : "transparent"}`, borderRadius:10, color:page===n.id ? C.orange : C.textMuted, cursor:"pointer", marginBottom:2, transition:"all 0.15s", fontWeight:page===n.id?700:400, fontSize:13, minHeight:44 }}>
            <span style={{ fontSize:16 }}>{n.icon}</span>
            {!collapsed && <span style={{ whiteSpace:"nowrap" }}>{t(n.tk as keyof typeof TR.en)}</span>}
          </button>
        ))}
      </nav>
      <div style={{ padding:collapsed?"14px 0":"14px", borderTop:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:collapsed?"center":"flex-start" }}>
          <Avatar name="Admin User" size={30} />
          {!collapsed && (
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:C.text }}>Admin</div>
              <div style={{ fontSize:9, color:C.textMuted }}>{GYM.name}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DashboardPage({ members, t }: { members: Member[]; t:(k:keyof typeof TR.en)=>string }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  const totalRevenue = members.reduce((s, m) => s + m.paidAmount, 0);
  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:21, fontWeight:800, color:C.text, margin:0 }}>Dashboard Overview</h1>
        <p style={{ color:C.textMuted, margin:"4px 0 0", fontSize:12 }}>{dateStr} · {GYM.name}, {GYM.city}</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px,1fr))", gap:10, marginBottom:20 }}>
        <Stat icon="◉" label={t("totalMembers")} value={members.length} sub={`${members.filter(m=>m.status==="Active").length} active`} color={C.blue} trend={12} />
        <Stat icon="✓" label={t("presentToday")} value={42} sub="70% attendance" color={C.green} trend={5} />
        <Stat icon="↑" label={t("checkedIn")} value={38} sub="Morning + Evening" color={C.orange} />
        <Stat icon="↓" label={t("checkedOut")} value={31} sub="Session completed" color={C.purple} />
        <Stat icon="✗" label={t("absentToday")} value={18} sub="Notified via SMS" color={C.red} trend={-8} />
        <Stat icon="₨" label={t("todayRevenue")} value="₨26,500" sub="3 payments" color={C.amber} trend={18} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px,1fr))", gap:14, marginBottom:20 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:18 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <span style={{ fontSize:13, fontWeight:700, color:C.text }}>Weekly Attendance</span>
            <Badge status="Present" />
          </div>
          <MiniBar data={WEEKLY_DATA as unknown as Record<string,number>[]} vk="present" lk="day" color={C.orange} />
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:18 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <span style={{ fontSize:13, fontWeight:700, color:C.text }}>Peak Hours</span>
            <Badge status="Checked In" />
          </div>
          <MiniBar data={PEAK_HOURS.slice(3,11) as unknown as Record<string,number>[]} vk="count" lk="hour" color={C.blue} />
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:18 }}>
          <div style={{ marginBottom:14 }}>
            <span style={{ fontSize:13, fontWeight:700, color:C.text }}>Membership Split</span>
          </div>
          {PLANS.map((p) => {
            const count = members.filter((m) => m.plan === p.name).length;
            const pct = members.length ? Math.round((count/members.length)*100) : 0;
            return (
              <div key={p.name} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:3 }}>
                  <span style={{ color:C.textMuted }}>{p.name}</span>
                  <span style={{ color:C.text, fontWeight:600 }}>{count} · {pct}%</span>
                </div>
                <div style={{ height:5, background:C.border, borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:p.color, borderRadius:3, transition:"width 0.6s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:18 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:13, fontWeight:700, color:C.text }}>Recent Members</span>
          <span style={{ fontSize:11, color:C.orange }}>Total Revenue: ₨{totalRevenue.toLocaleString()}</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {members.slice(0,5).map((m) => (
            <div key={m.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:C.darker, borderRadius:10 }}>
              <Avatar name={m.name} size={36} id={m.id} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.name}</div>
                <div style={{ fontSize:10, color:C.textMuted }}>{m.id} · {m.plan}</div>
              </div>
              <Badge status={m.status} />
              <div style={{ fontSize:13, fontWeight:700, color:C.green }}>₨{m.paidAmount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Attendance Page ──────────────────────────────────────────────────────────
function AttendancePage({ members, t }: { members: Member[]; t:(k:keyof typeof TR.en)=>string }) {
  const dateKey = todayKey();
  const now = new Date();
  const dayTitle = now.toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  const dayTitleUrdu = now.toLocaleDateString("ur-PK", { weekday:"long", year:"numeric", month:"long", day:"numeric" });

  const loadRec = () => {
    try { return JSON.parse(localStorage.getItem(`ip-att-${dateKey}`) ?? "{}") as Record<string, Record<string, AttRecord>>; }
    catch { return {}; }
  };
  const [rec, setRec] = useState<Record<string, Record<string, AttRecord>>>(loadRec);
  const [search, setSearch] = useState("");

  const saveRec = (next: typeof rec) => {
    localStorage.setItem(`ip-att-${dateKey}`, JSON.stringify(next));
    setRec(next);
  };

  const mark = (id: string, batch: string, field: "arrived" | "left") => {
    const prev = rec[id]?.[batch] ?? { arrived:false, arrivedTime:"", left:false, leftTime:"" };
    if (field === "left" && !prev.arrived) { toast.warning("Mark arrival first"); return; }
    const newVal = !prev[field];
    const time = newVal ? nowTime() : "";
    const next = { ...rec, [id]: { ...rec[id], [batch]: { ...prev, [field]:newVal, [`${field}Time`]:time } } };
    saveRec(next);
    toast.success(newVal ? `${field==="arrived"?"✓ Arrived":"✓ Left"} — ${members.find(m=>m.id===id)?.name}` : "Unmarked");
  };

  const batches = ["Morning", "Evening"] as const;
  const filtered = members.filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.id.includes(search));

  const totalPresent = members.filter((m) => {
    const r = rec[m.id];
    return r && (r["Morning"]?.arrived || r["Evening"]?.arrived);
  }).length;

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:20, fontWeight:800, color:C.text, margin:0 }}>
          {t("dailyAttendance")} — <span style={{ color:C.orange }}>{dayTitle}</span>
        </h1>
        <p style={{ color:C.textMuted, margin:"3px 0 0", fontSize:11 }}>{GYM.name} · {GYM.timingMorning} · {GYM.timingEvening}</p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))", gap:8, marginBottom:18 }}>
        <Stat icon="◉" label="Total" value={members.length} color={C.blue} />
        <Stat icon="✓" label={t("present")} value={totalPresent} color={C.green} />
        <Stat icon="✗" label={t("absent")} value={members.length - totalPresent} color={C.red} />
        <Stat icon="☀" label={t("morning")} value={members.filter(m=>m.batch==="Morning").length} color={C.amber} />
        <Stat icon="🌙" label={t("evening")} value={members.filter(m=>m.batch==="Evening").length} color={C.purple} />
      </div>

      {/* Search */}
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`🔍 ${t("search")}`} style={{ ...inputStyle, marginBottom:16 }} />

      {/* Morning + Evening on same page */}
      {batches.map((batch) => {
        const batchMembers = filtered.filter((m) => m.batch === batch);
        const batchPresent = batchMembers.filter((m) => rec[m.id]?.[batch]?.arrived).length;
        return (
          <div key={batch} style={{ marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <span style={{ fontSize:18 }}>{batch === "Morning" ? "☀️" : "🌙"}</span>
              <div>
                <div style={{ fontSize:14, fontWeight:800, color:C.text }}>
                  {batch === "Morning" ? t("morningBatch") : t("eveningBatch")}
                </div>
                <div style={{ fontSize:10, color:C.textMuted }}>{batch === "Morning" ? GYM.timingMorning : GYM.timingEvening} · {batchPresent}/{batchMembers.length} {t("present")}</div>
              </div>
              <div style={{ marginLeft:"auto", height:6, width:80, background:C.border, borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:batchMembers.length ? `${(batchPresent/batchMembers.length)*100}%` : "0%", background:batch==="Morning"?C.amber:C.purple, borderRadius:3, transition:"width 0.4s" }} />
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {batchMembers.length === 0 && (
                <div style={{ padding:"20px", textAlign:"center", color:C.textMuted, fontSize:13 }}>{t("noRecords")}</div>
              )}
              {batchMembers.map((m) => {
                const a = rec[m.id]?.[batch] ?? { arrived:false, arrivedTime:"", left:false, leftTime:"" };
                const isPresent = a.arrived;
                return (
                  <div key={m.id} style={{ background:isPresent ? C.green+"0A" : C.card, border:`1px solid ${isPresent ? C.green+"33" : C.border}`, borderRadius:14, padding:"12px 14px", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", transition:"all 0.2s" }}>
                    <Avatar name={m.name} size={42} id={m.id} />
                    <div style={{ flex:1, minWidth:120 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{m.name}</div>
                      <div style={{ fontSize:10, color:C.textMuted }}>{m.id} · {m.phone}</div>
                      <div style={{ display:"flex", gap:5, marginTop:4, flexWrap:"wrap" }}>
                        <Badge status={m.plan} />
                        {m.medical.conditions.length > 0 && (
                          <span style={{ fontSize:9, background:C.red+"15", color:C.red, padding:"2px 7px", borderRadius:5, border:`1px solid ${C.red}30` }}>
                            🩺 {m.medical.conditions.join(", ")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrived checkbox */}
                    <label style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", minWidth:58, minHeight:44, justifyContent:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <input type="checkbox" checked={a.arrived} onChange={() => mark(m.id, batch, "arrived")} style={{ width:20, height:20, accentColor:C.green, cursor:"pointer" }} />
                        <span style={{ fontSize:11, fontWeight:700, color:C.green }}>{t("arrived")}</span>
                      </div>
                      <span style={{ fontSize:10, color:C.textMuted, minHeight:14 }}>{a.arrivedTime || "—"}</span>
                    </label>

                    {/* Left checkbox */}
                    <label style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", minWidth:58, minHeight:44, justifyContent:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <input type="checkbox" checked={a.left} onChange={() => mark(m.id, batch, "left")} style={{ width:20, height:20, accentColor:C.red, cursor:"pointer" }} />
                        <span style={{ fontSize:11, fontWeight:700, color:C.red }}>{t("left")}</span>
                      </div>
                      <span style={{ fontSize:10, color:C.textMuted, minHeight:14 }}>{a.leftTime || "—"}</span>
                    </label>

                    {/* Status */}
                    <Badge status={!a.arrived ? "Absent" : a.left ? "Completed" : "Checked In"} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Members Page ─────────────────────────────────────────────────────────────
function MembersPage({ members, setMembers, t }: {
  members: Member[]; setMembers: React.Dispatch<React.SetStateAction<Member[]>>; t:(k:keyof typeof TR.en)=>string;
}) {
  const { setImg } = useContext(ImagesCtx);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Member | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [reportMember, setReportMember] = useState<Member | null>(null);

  const filtered = members.filter((m) =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.id.includes(search) || m.phone.includes(search)
  );

  const handleSave = (m: Member, preview: string | null) => {
    if (preview) setImg(m.id, preview);
    setMembers((prev) => {
      const exists = prev.find((x) => x.id === m.id);
      if (exists) { toast.success(t("memberUpdated")); return prev.map((x) => x.id===m.id ? m : x); }
      toast.success(t("memberAdded")); return [...prev, m];
    });
    setFormMode(null); setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success(t("memberDeleted"));
    setDeleteId(null); setSelected(null);
  };

  return (
    <div>
      {reportMember && (
        <MonthlyReport member={reportMember} onClose={() => setReportMember(null)} t={t} />
      )}
      {formMode && (
        <MemberForm
          initial={editTarget ?? undefined}
          existingId={editTarget?.id}
          onSave={handleSave}
          onClose={() => { setFormMode(null); setEditTarget(null); }}
          members={members} t={t}
        />
      )}
      {deleteId && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,2,10,0.92)", zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:C.card, border:`1px solid ${C.red}44`, borderRadius:18, padding:28, maxWidth:340, width:"100%", textAlign:"center" as const }}>
            <div style={{ fontSize:32, marginBottom:8 }}>⚠️</div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:6 }}>{t("confirmDelete")}</div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:22 }}>This will permanently remove the member.</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex:1, background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:12, color:C.textMuted, cursor:"pointer", fontWeight:600, minHeight:44 }}>{t("cancel")}</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex:1, background:C.red, border:"none", borderRadius:10, padding:12, color:"#fff", cursor:"pointer", fontWeight:700, minHeight:44 }}>{t("delete")}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:C.text, margin:0 }}>{t("members")}</h1>
          <p style={{ color:C.textMuted, margin:"3px 0 0", fontSize:11 }}>{members.length} registered · {members.filter(m=>m.status==="Active").length} active</p>
        </div>
        <button onClick={() => { setEditTarget(null); setFormMode("add"); }} style={{ background:C.orange, border:"none", borderRadius:12, padding:"12px 20px", color:"#fff", fontWeight:800, cursor:"pointer", fontSize:13, minHeight:44 }}>+ {t("addMember")}</button>
      </div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`🔍 ${t("search")}`} style={{ ...inputStyle, marginBottom:14 }} />

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.map((m) => {
          const isOpen = selected === m.id;
          const hasConditions = m.medical.conditions.length > 0;
          return (
            <div key={m.id} style={{ background:C.card, border:`1px solid ${isOpen ? C.orange+"55" : C.border}`, borderRadius:16, padding:"14px 16px", cursor:"pointer", transition:"all 0.2s" }} onClick={() => setSelected(isOpen ? null : m.id)}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <Avatar name={m.name} size={48} id={m.id} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.name}</div>
                  <div style={{ fontSize:11, color:C.textMuted }}>{m.id} · {m.phone}</div>
                  <div style={{ display:"flex", gap:5, marginTop:5, flexWrap:"wrap" }}>
                    <Badge status={m.status} />
                    <Badge status={m.plan} />
                    <Badge status={m.batch} />
                    {hasConditions && <span style={{ fontSize:9, background:C.red+"15", color:C.red, padding:"2px 7px", borderRadius:5 }}>🩺 Medical</span>}
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:C.text }}>₨{m.fee.toLocaleString()}</div>
                  <div style={{ fontSize:10, color:C.textMuted }}>/month</div>
                </div>
              </div>

              {isOpen && (
                <div style={{ marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
                  {/* Details grid */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:8, marginBottom:14 }}>
                    {[
                      { label:t("joinedOn"), val:m.joinDate },
                      { label:t("dueDate"), val:m.dueDate },
                      { label:"Last Payment", val:m.lastPayment },
                      { label:"Paid", val:`₨${m.paidAmount.toLocaleString()}` },
                      { label:t("bloodGroup"), val:m.medical.bloodGroup },
                      { label:"Fee Status", val:feeStatus(m) },
                    ].map((f) => (
                      <div key={f.label} style={{ background:C.darker, borderRadius:10, padding:"10px 12px" }}>
                        <div style={{ fontSize:9, color:C.textMuted, marginBottom:2 }}>{f.label}</div>
                        <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{f.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Medical section */}
                  {(hasConditions || m.medical.emergencyName) && (
                    <div style={{ background:C.red+"08", border:`1px solid ${C.red}22`, borderRadius:12, padding:"12px 14px", marginBottom:14 }}>
                      <div style={{ fontSize:11, fontWeight:700, color:C.red, marginBottom:8 }}>🩺 Medical Information</div>
                      {hasConditions && <div style={{ fontSize:11, color:C.textMuted, marginBottom:4 }}>Conditions: <span style={{ color:C.text }}>{m.medical.conditions.join(", ")}</span></div>}
                      {m.medical.allergies && m.medical.allergies !== "None" && <div style={{ fontSize:11, color:C.textMuted, marginBottom:4 }}>Allergies: <span style={{ color:C.text }}>{m.medical.allergies}</span></div>}
                      {m.medical.emergencyName && <div style={{ fontSize:11, color:C.textMuted }}>Emergency: <span style={{ color:C.text }}>{m.medical.emergencyName}</span> · {m.medical.emergencyPhone}</div>}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <button onClick={(e) => { e.stopPropagation(); setReportMember(m); }} style={{ flex:1, minWidth:100, background:C.blue+"18", border:`1px solid ${C.blue}44`, borderRadius:10, padding:"10px", color:C.blue, cursor:"pointer", fontWeight:700, fontSize:12, minHeight:44 }}>📊 Report</button>
                    <button onClick={(e) => { e.stopPropagation(); setEditTarget(m); setFormMode("edit"); }} style={{ flex:1, minWidth:100, background:C.orange+"22", border:`1px solid ${C.orange}44`, borderRadius:10, padding:"10px", color:C.orange, cursor:"pointer", fontWeight:700, fontSize:12, minHeight:44 }}>✏️ {t("edit")}</button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteId(m.id); }} style={{ flex:1, minWidth:100, background:C.red+"15", border:`1px solid ${C.red}33`, borderRadius:10, padding:"10px", color:C.red, cursor:"pointer", fontWeight:700, fontSize:12, minHeight:44 }}>🗑 {t("delete")}</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Trainers Page ────────────────────────────────────────────────────────────
function TrainersPage({ trainers, setTrainers, t }: {
  trainers: Trainer[]; setTrainers: React.Dispatch<React.SetStateAction<Trainer[]>>; t:(k:keyof typeof TR.en)=>string;
}) {
  const { setImg } = useContext(ImagesCtx);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Trainer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = (tr: Trainer, preview: string | null) => {
    if (preview) setImg(tr.id, preview);
    setTrainers((prev) => {
      const exists = prev.find((x) => x.id === tr.id);
      if (exists) { toast.success(t("trainerUpdated")); return prev.map((x) => x.id===tr.id ? tr : x); }
      toast.success(t("trainerAdded")); return [...prev, tr];
    });
    setFormMode(null); setEditTarget(null);
  };

  return (
    <div>
      {formMode && (
        <TrainerForm
          initial={editTarget ?? undefined}
          existingId={editTarget?.id}
          onSave={handleSave}
          onClose={() => { setFormMode(null); setEditTarget(null); }}
          trainers={trainers} t={t}
        />
      )}
      {deleteId && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,2,10,0.92)", zIndex:3000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:C.card, border:`1px solid ${C.red}44`, borderRadius:18, padding:28, maxWidth:340, width:"100%", textAlign:"center" as const }}>
            <div style={{ fontSize:32, marginBottom:8 }}>⚠️</div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:20 }}>{t("confirmDelete")}</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex:1, background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:12, color:C.textMuted, cursor:"pointer", fontWeight:600, minHeight:44 }}>{t("cancel")}</button>
              <button onClick={() => { setTrainers((p) => p.filter((x) => x.id !== deleteId)); toast.success(t("trainerDeleted")); setDeleteId(null); }} style={{ flex:1, background:C.red, border:"none", borderRadius:10, padding:12, color:"#fff", cursor:"pointer", fontWeight:700, minHeight:44 }}>{t("delete")}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:C.text, margin:0 }}>{t("trainers")}</h1>
          <p style={{ color:C.textMuted, margin:"3px 0 0", fontSize:11 }}>{trainers.filter(x=>x.status==="Active").length} active trainers</p>
        </div>
        <button onClick={() => { setEditTarget(null); setFormMode("add"); }} style={{ background:C.orange, border:"none", borderRadius:12, padding:"12px 20px", color:"#fff", fontWeight:800, cursor:"pointer", fontSize:13, minHeight:44 }}>+ {t("addTrainer")}</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
        {trainers.map((tr) => (
          <div key={tr.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:20, transition:"transform 0.2s, box-shadow 0.2s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
              <Avatar name={tr.name} size={56} id={tr.id} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:15, fontWeight:800, color:C.text }}>{tr.name}</div>
                <div style={{ fontSize:11, color:C.orange, fontWeight:600 }}>{tr.specialty}</div>
                <div style={{ fontSize:10, color:C.textMuted, marginTop:2 }}>{tr.id} · {tr.phone}</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
              {[
                { label:"Experience", val:`${tr.experience} years` },
                { label:"Salary", val:`₨${tr.salary.toLocaleString()}` },
              ].map((f) => (
                <div key={f.label} style={{ background:C.darker, borderRadius:8, padding:"8px 10px" }}>
                  <div style={{ fontSize:9, color:C.textMuted }}>{f.label}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{f.val}</div>
                </div>
              ))}
            </div>
            <div style={{ background:C.darker, borderRadius:8, padding:"8px 10px", marginBottom:12 }}>
              <div style={{ fontSize:9, color:C.textMuted, marginBottom:2 }}>Schedule</div>
              <div style={{ fontSize:11, color:C.text }}>{tr.schedule}</div>
            </div>
            {tr.bio && <div style={{ fontSize:11, color:C.textMuted, lineHeight:1.5, marginBottom:14 }}>{tr.bio}</div>}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => { setEditTarget(tr); setFormMode("edit"); }} style={{ flex:1, background:C.orange+"22", border:`1px solid ${C.orange}44`, borderRadius:10, padding:"10px", color:C.orange, cursor:"pointer", fontWeight:700, fontSize:12, minHeight:44 }}>✏️ {t("edit")}</button>
              <button onClick={() => setDeleteId(tr.id)} style={{ flex:1, background:C.red+"15", border:`1px solid ${C.red}33`, borderRadius:10, padding:"10px", color:C.red, cursor:"pointer", fontWeight:700, fontSize:12, minHeight:44 }}>🗑 {t("delete")}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared attendance helpers ─────────────────────────────────────────────────
const prand = (seed: number) => ((seed * 9301 + 49297) % 233280) / 233280;
const strHash = (s: string) => s.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

function genMemberDays(member: Member, selMonth: string) {
  const [yr, mn] = selMonth.split("-").map(Number);
  const total = new Date(yr, mn, 0).getDate();
  const rows: { d:number; dateKey:string; dayName:string; isSunday:boolean; isFuture:boolean; status:string; checkIn:string; checkOut:string; duration:string }[] = [];
  for (let d = 1; d <= total; d++) {
    const dateKey = `${selMonth}-${String(d).padStart(2, "0")}`;
    const dayDate = new Date(yr, mn - 1, d);
    const dayName = dayDate.toLocaleDateString("en-US", { weekday: "short" });
    const isSunday = dayDate.getDay() === 0;
    const isFuture = dayDate > new Date();
    const batch = member.batch;
    let attRec: AttRecord | null = null;
    try {
      const stored = JSON.parse(localStorage.getItem(`ip-att-${dateKey}`) ?? "{}") as Record<string, Record<string, AttRecord>>;
      attRec = stored[member.id]?.[batch] ?? null;
    } catch { /* no-op */ }
    let status = "—", checkIn = "", checkOut = "", duration = "";
    if (isFuture) {
      status = "—";
    } else if (isSunday) {
      status = "Off";
    } else if (attRec) {
      status = attRec.arrived ? (attRec.left ? "Present" : "Checked In") : "Absent";
      checkIn = attRec.arrivedTime ?? ""; checkOut = attRec.leftTime ?? "";
    } else {
      const seed = strHash(member.id + dateKey);
      const present = prand(seed) > 0.18;
      if (present) {
        status = "Present";
        if (batch === "Morning") {
          const hh = 6, mm = Math.floor(prand(seed + 1) * 55);
          const lhh = 8, lmm = Math.floor(prand(seed + 2) * 55);
          checkIn = `${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")} AM`;
          checkOut = `${String(lhh).padStart(2,"0")}:${String(lmm).padStart(2,"0")} AM`;
          const tm = (lhh * 60 + lmm) - (hh * 60 + mm);
          duration = `${Math.floor(tm / 60)}h ${tm % 60}m`;
        } else {
          const hh = 17, mm = Math.floor(prand(seed + 1) * 55);
          const lhh = 18, lmm = Math.floor(prand(seed + 2) * 55);
          checkIn = `${String(hh % 12 || 12).padStart(2,"0")}:${String(mm).padStart(2,"0")} PM`;
          checkOut = `${String(lhh % 12 || 12).padStart(2,"0")}:${String(lmm).padStart(2,"0")} PM`;
          const tm = (lhh * 60 + lmm) - (hh * 60 + mm);
          duration = `${Math.floor(tm / 60)}h ${tm % 60}m`;
        }
      } else {
        status = "Absent";
      }
    }
    rows.push({ d, dateKey, dayName, isSunday, isFuture, status, checkIn, checkOut, duration });
  }
  return rows;
}

// ─── Monthly Report ────────────────────────────────────────────────────────────
function MonthlyReport({ member, onClose, t }: {
  member: Member; onClose: () => void; t:(k:keyof typeof TR.en)=>string;
}) {
  const { imgs } = useContext(ImagesCtx);
  const photo = imgs[member.id];
  const [selMonth, setSelMonth] = useState(() => new Date().toISOString().slice(0, 7));

  const days = React.useMemo(() => genMemberDays(member, selMonth), [selMonth, member]);

  const presentDays = days.filter(r => r.status === "Present").length;
  const absentDays  = days.filter(r => r.status === "Absent").length;
  const offDays     = days.filter(r => r.status === "Off").length;
  const workDays    = days.filter(r => !r.isSunday && !r.isFuture).length;
  const pct         = workDays ? Math.round((presentDays / workDays) * 100) : 0;
  const due         = Math.max(0, member.fee - member.paidAmount);
  const fs          = feeStatus(member);

  const [yr, mn] = selMonth.split("-");
  const monthLabel = new Date(Number(yr), Number(mn) - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handlePrint = () => window.print();
  const handleShare = () => {
    const text = [
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📊 *MONTHLY REPORT — ${monthLabel.toUpperCase()}*`,
      `🏋 *${GYM.name}* | ${GYM.city}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `👤 *${member.name}* (${member.id})`,
      `📞 ${member.phone}`,
      `🎯 Plan: ${member.plan} · Batch: ${member.batch}`,
      `🩺 Blood Group: ${member.medical.bloodGroup}`,
      ``,
      `📅 *ATTENDANCE*`,
      `✅ Present : ${presentDays} days`,
      `❌ Absent  : ${absentDays} days`,
      `🔴 Off Days: ${offDays} Sundays`,
      `📈 Rate    : ${pct}%`,
      ``,
      `💰 *FEE DETAILS*`,
      `Plan Fee : ₨${member.fee.toLocaleString()}/month`,
      `Paid     : ₨${member.paidAmount.toLocaleString()}`,
      `Balance  : ₨${due.toLocaleString()}`,
      `Status   : ${fs}`,
      `Due Date : ${member.dueDate}`,
      ``,
      `📞 ${GYM.phone} | ${GYM.phone2}`,
      `📍 ${GYM.address}`,
    ].join("\n");
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  const statusColor = (s: string) =>
    s === "Present" ? C.green : s === "Absent" ? C.red : s === "Off" ? C.textFaint : s === "—" ? C.textFaint : C.amber;

  return (
    <div id="monthly-report-overlay" style={{ position:"fixed", inset:0, background:"rgba(0,3,12,0.97)", zIndex:5000, overflowY:"auto", WebkitOverflowScrolling:"touch" as any }}>
      <style>{`
        @media print {
          #monthly-report-overlay { position: static !important; background: #fff !important; color: #000 !important; }
          .no-print { display: none !important; }
          .print-page { background: #fff !important; color: #000 !important; padding: 20px !important; }
          .print-table th, .print-table td { color: #000 !important; border-color: #ccc !important; }
          .print-card { background: #f9f9f9 !important; border-color: #ddd !important; }
          body > *:not(#monthly-report-overlay) { display: none !important; }
        }
      `}</style>

      <div className="print-page" style={{ maxWidth:780, margin:"0 auto", padding:"20px 16px", minHeight:"100vh" }}>
        {/* Controls */}
        <div className="no-print" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
          <button onClick={onClose} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 18px", color:C.textMuted, cursor:"pointer", fontWeight:700, fontSize:13, minHeight:44 }}>← Back</button>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <input type="month" value={selMonth} onChange={e => setSelMonth(e.target.value)} style={{ ...inputStyle, width:"auto", padding:"10px 14px", minHeight:44 }} />
            <button onClick={handleShare} style={{ background:"#25D366"+"22", border:`1px solid #25D366`+"55", borderRadius:10, padding:"10px 16px", color:"#25D366", cursor:"pointer", fontWeight:700, fontSize:13, minHeight:44 }}>📲 WhatsApp</button>
            <button onClick={handlePrint} style={{ background:C.orange+"22", border:`1px solid ${C.orange}55`, borderRadius:10, padding:"10px 16px", color:C.orange, cursor:"pointer", fontWeight:700, fontSize:13, minHeight:44 }}>🖨 Print</button>
          </div>
        </div>

        {/* Report Header */}
        <div className="print-card" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:"20px", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
            {photo
              ? <img src={photo} alt="" style={{ width:68, height:68, borderRadius:"50%", objectFit:"cover", border:`2px solid ${C.orange}`, flexShrink:0 }} />
              : <div style={{ width:68, height:68, borderRadius:"50%", background:C.orange+"22", border:`2px solid ${C.orange}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>
                  {member.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                </div>
            }
            <div style={{ flex:1 }}>
              <div style={{ fontSize:20, fontWeight:900, color:C.text }}>{member.name}</div>
              <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{member.id} · {member.phone}</div>
              <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                <Badge status={member.plan} />
                <Badge status={member.batch} />
                <Badge status={member.status} />
              </div>
            </div>
            <div style={{ textAlign:"right" as const, flexShrink:0 }}>
              <div style={{ fontSize:12, fontWeight:900, color:C.orange }}>{GYM.name}</div>
              <div style={{ fontSize:10, color:C.textMuted }}>{GYM.city}</div>
              <div style={{ fontSize:10, color:C.textMuted, marginTop:2 }}>{monthLabel}</div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:10, marginBottom:16 }}>
          {[
            { icon:"✅", label:"Present", val:presentDays, color:C.green },
            { icon:"❌", label:"Absent",  val:absentDays,  color:C.red   },
            { icon:"📅", label:"Working", val:workDays,    color:C.blue  },
            { icon:"📈", label:"Rate",    val:`${pct}%`,   color:C.orange },
          ].map(s => (
            <div key={s.label} className="print-card" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 12px", textAlign:"center" as const }}>
              <div style={{ fontSize:22 }}>{s.icon}</div>
              <div style={{ fontSize:22, fontWeight:900, color:s.color, marginTop:4 }}>{s.val}</div>
              <div style={{ fontSize:10, color:C.textMuted }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Fee Summary */}
        <div className="print-card" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:"16px", marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:800, color:C.orange, marginBottom:12, letterSpacing:0.5 }}>💰 FEE DETAILS — {monthLabel}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10 }}>
            {[
              { label:"Monthly Fee",   val:`₨${member.fee.toLocaleString()}` },
              { label:"Paid Amount",   val:`₨${member.paidAmount.toLocaleString()}`, color: member.paidAmount >= member.fee ? C.green : C.amber },
              { label:"Balance Due",   val:`₨${due.toLocaleString()}`,               color: due > 0 ? C.red : C.green },
              { label:"Fee Status",    val: fs,                                       color: fs==="Paid"?C.green:fs==="Overdue"?C.red:C.amber },
              { label:"Due Date",      val: member.dueDate },
              { label:"Last Payment",  val: member.lastPayment },
              { label:"Joined On",     val: member.joinDate },
              { label:"Plan",          val: member.plan },
            ].map(f => (
              <div key={f.label} style={{ background:C.darker, borderRadius:10, padding:"10px 12px" }}>
                <div style={{ fontSize:9, color:C.textMuted, marginBottom:3 }}>{f.label}</div>
                <div style={{ fontSize:13, fontWeight:700, color:(f as any).color ?? C.text }}>{f.val}</div>
              </div>
            ))}
          </div>
          {/* Fee bar */}
          <div style={{ marginTop:12 }}>
            <div style={{ height:6, background:C.border, borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${Math.min(100,(member.paidAmount/member.fee)*100)}%`, background: due===0?C.green:C.amber, borderRadius:3, transition:"width 0.5s" }} />
            </div>
            <div style={{ fontSize:10, color:C.textMuted, marginTop:4 }}>{Math.round((member.paidAmount/member.fee)*100)}% paid · ₨{member.paidAmount.toLocaleString()} of ₨{member.fee.toLocaleString()}</div>
          </div>
        </div>

        {/* Medical Info */}
        {(member.medical.conditions.length > 0 || member.medical.emergencyName) && (
          <div className="print-card" style={{ background:C.red+"08", border:`1px solid ${C.red}22`, borderRadius:14, padding:"14px 16px", marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:800, color:C.red, marginBottom:8 }}>🩺 MEDICAL INFORMATION</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:8 }}>
              <div><span style={{ color:C.textMuted, fontSize:10 }}>Blood Group: </span><span style={{ color:C.text, fontWeight:700 }}>{member.medical.bloodGroup}</span></div>
              {member.medical.conditions.length > 0 && <div><span style={{ color:C.textMuted, fontSize:10 }}>Conditions: </span><span style={{ color:C.text, fontWeight:700 }}>{member.medical.conditions.join(", ")}</span></div>}
              {member.medical.emergencyName && <div><span style={{ color:C.textMuted, fontSize:10 }}>Emergency Contact: </span><span style={{ color:C.text, fontWeight:700 }}>{member.medical.emergencyName} · {member.medical.emergencyPhone}</span></div>}
              {member.medical.allergies && member.medical.allergies !== "None" && <div><span style={{ color:C.textMuted, fontSize:10 }}>Allergies: </span><span style={{ color:C.text, fontWeight:700 }}>{member.medical.allergies}</span></div>}
            </div>
          </div>
        )}

        {/* Day-wise Table */}
        <div className="print-card" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden", marginBottom:20 }}>
          <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:12, fontWeight:800, color:C.text }}>📅 DAY-WISE ATTENDANCE — {monthLabel}</div>
            <div style={{ fontSize:10, color:C.textMuted }}>{member.batch} Batch · {member.batch === "Morning" ? GYM.timingMorning : GYM.timingEvening}</div>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table className="print-table" style={{ width:"100%", borderCollapse:"collapse" as const, fontSize:12 }}>
              <thead>
                <tr style={{ background:C.darker }}>
                  {["#","Date","Day","Status","Check-In","Check-Out","Duration"].map(h => (
                    <th key={h} style={{ padding:"10px 12px", textAlign:"left" as const, color:C.textMuted, fontWeight:600, fontSize:10, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" as const }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((row, i) => (
                  <tr key={row.d} style={{ background: i%2===0 ? "transparent" : C.darker+"55", borderBottom:`1px solid ${C.border}22` }}>
                    <td style={{ padding:"9px 12px", color:C.textFaint, fontSize:10 }}>{row.d}</td>
                    <td style={{ padding:"9px 12px", color:C.textMuted, whiteSpace:"nowrap" as const }}>{row.dateKey.slice(5)}</td>
                    <td style={{ padding:"9px 12px", color:C.textMuted }}>{row.dayName}</td>
                    <td style={{ padding:"9px 12px" }}>
                      <span style={{ color: statusColor(row.status), fontWeight:700, fontSize:11 }}>
                        {row.status === "Present" ? "✅" : row.status === "Absent" ? "❌" : row.status === "Off" ? "🔵" : "—"} {row.status}
                      </span>
                    </td>
                    <td style={{ padding:"9px 12px", color:C.text, fontWeight:600, whiteSpace:"nowrap" as const }}>{row.checkIn || "—"}</td>
                    <td style={{ padding:"9px 12px", color:C.text, fontWeight:600, whiteSpace:"nowrap" as const }}>{row.checkOut || "—"}</td>
                    <td style={{ padding:"9px 12px", color:C.blue, fontWeight:600 }}>{row.duration || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Table footer summary */}
          <div style={{ padding:"10px 16px", background:C.darker, borderTop:`1px solid ${C.border}`, display:"flex", gap:20, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, color:C.green }}>✅ Present: <b>{presentDays}</b></span>
            <span style={{ fontSize:11, color:C.red }}>❌ Absent: <b>{absentDays}</b></span>
            <span style={{ fontSize:11, color:C.textMuted }}>🔵 Sundays: <b>{offDays}</b></span>
            <span style={{ fontSize:11, color:C.orange }}>📈 Rate: <b>{pct}%</b></span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign:"center" as const, padding:"14px", borderTop:`1px solid ${C.border}`, color:C.textMuted, fontSize:10 }}>
          {GYM.name} · {GYM.address} · {GYM.phone} · {GYM.phone2}<br/>
          Generated on {new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
        </div>
      </div>
    </div>
  );
}

// ─── Fees Page ────────────────────────────────────────────────────────────────
function FeesPage({ members, t }: { members: Member[]; t:(k:keyof typeof TR.en)=>string }) {
  const [payModal, setPayModal] = useState<Member | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("Cash");

  const totalRevenue = members.reduce((s, m) => s + m.paidAmount, 0);
  const pending = members.reduce((s, m) => s + Math.max(0, m.fee - m.paidAmount), 0);

  return (
    <div>
      {payModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,2,10,0.88)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:26, width:"100%", maxWidth:380 }}>
            <div style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:4 }}>Collect Payment</div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:20 }}>{payModal.name} · {payModal.id}</div>
            <div style={{ marginBottom:14 }}>
              <label style={labelStyle}>Amount (₨)</label>
              <input value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder={`Due: ₨${Math.max(0,payModal.fee-payModal.paidAmount).toLocaleString()}`} style={inputStyle} type="number" />
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={labelStyle}>Payment Method</label>
              <div style={{ display:"flex", gap:8 }}>
                {["Cash","Online","Card"].map((m) => (
                  <button key={m} onClick={() => setPayMethod(m)} style={{ flex:1, background:payMethod===m?C.orange:C.darker, border:`1px solid ${payMethod===m?C.orange:C.border}`, borderRadius:8, padding:"10px", color:payMethod===m?"#fff":C.textMuted, cursor:"pointer", fontWeight:700, fontSize:12, minHeight:44 }}>{m}</button>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setPayModal(null)} style={{ flex:1, background:"transparent", border:`1px solid ${C.border}`, borderRadius:10, padding:12, color:C.textMuted, cursor:"pointer", fontWeight:600, minHeight:44 }}>{t("cancel")}</button>
              <button onClick={() => { toast.success(`₨${payAmount||"0"} collected from ${payModal.name}`); setPayModal(null); setPayAmount(""); }} style={{ flex:2, background:C.orange, border:"none", borderRadius:10, padding:12, color:"#fff", cursor:"pointer", fontWeight:800, minHeight:44 }}>{t("collect")}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom:18 }}>
        <h1 style={{ fontSize:20, fontWeight:800, color:C.text, margin:0 }}>{t("fees")}</h1>
        <p style={{ color:C.textMuted, margin:"3px 0 0", fontSize:11 }}>Track payments, dues and revenue</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10, marginBottom:18 }}>
        <Stat icon="₨" label={t("totalCollected")} value={`₨${(totalRevenue/1000).toFixed(0)}K`} color={C.green} />
        <Stat icon="⚠" label={t("pendingDues")} value={`₨${(pending/1000).toFixed(0)}K`} color={C.red} />
        <Stat icon="✓" label={t("fullyPaid")} value={members.filter(m=>m.paidAmount>=m.fee).length} color={C.blue} />
        <Stat icon="⏱" label="Overdue" value={members.filter(m=>{ const d=new Date(m.dueDate); return m.paidAmount<m.fee&&d<new Date(); }).length} color={C.amber} />
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {members.map((m) => {
          const status = feeStatus(m);
          const due = Math.max(0, m.fee - m.paidAmount);
          const pct = Math.round((m.paidAmount/m.fee)*100);
          return (
            <div key={m.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                <Avatar name={m.name} size={44} id={m.id} />
                <div style={{ flex:1, minWidth:140 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{m.name}</div>
                  <div style={{ fontSize:10, color:C.textMuted }}>{m.id} · {m.plan} · Due: {m.dueDate}</div>
                  <div style={{ marginTop:6, height:4, background:C.border, borderRadius:2, overflow:"hidden", maxWidth:200 }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:status==="Paid"?C.green:status==="Overdue"?C.red:C.amber, borderRadius:2, transition:"width 0.5s" }} />
                  </div>
                  <div style={{ fontSize:9, color:C.textMuted, marginTop:2 }}>₨{m.paidAmount.toLocaleString()} of ₨{m.fee.toLocaleString()}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, flexShrink:0 }}>
                  <Badge status={status} />
                  {due > 0 && <div style={{ fontSize:11, color:C.red, fontWeight:700 }}>Due: ₨{due.toLocaleString()}</div>}
                  <button onClick={() => setPayModal(m)} style={{ background:C.orange, border:"none", borderRadius:8, padding:"8px 14px", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:11, minHeight:36 }}>{t("collect")}</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Plans Page ───────────────────────────────────────────────────────────────
function PlansPage({ t }: { t:(k:keyof typeof TR.en)=>string }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:C.text, margin:0 }}>{t("plans")}</h1>
          <p style={{ color:C.textMuted, margin:"3px 0 0", fontSize:11 }}>{GYM.name} membership tiers</p>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:16 }}>
        {PLANS.map((p) => (
          <div key={p.name} style={{ background:C.card, border:`1px solid ${p.color}44`, borderRadius:22, padding:24, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, background:p.color+"0D", borderRadius:"50%" }} />
            <div style={{ fontSize:10, color:p.color, fontWeight:800, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>{p.name}</div>
            <div style={{ fontSize:28, fontWeight:900, color:C.text, letterSpacing:-1 }}>₨{p.monthly.toLocaleString()}<span style={{ fontSize:12, fontWeight:400, color:C.textMuted }}>/mo</span></div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, margin:"14px 0", padding:12, background:C.darker, borderRadius:10 }}>
              {[["Quarterly","₨"+p.quarterly.toLocaleString()],["Half-Yr","₨"+p.halfYearly.toLocaleString()],["Yearly","₨"+p.yearly.toLocaleString()]].map(([l,v]) => (
                <div key={l}><div style={{ fontSize:9, color:C.textMuted }}>{l}</div><div style={{ fontSize:12, fontWeight:700, color:C.text }}>{v}</div></div>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:16 }}>
              {p.features.map((f) => <div key={f} style={{ fontSize:12, color:C.textMuted, display:"flex", gap:6 }}><span style={{ color:p.color, fontWeight:700 }}>✓</span>{f}</div>)}
            </div>
            <button style={{ width:"100%", background:p.color+"22", border:`1px solid ${p.color}44`, borderRadius:10, padding:"10px", color:p.color, cursor:"pointer", fontWeight:700, fontSize:12, minHeight:44 }}>Edit Plan</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Analytics Page ───────────────────────────────────────────────────────────
function AnalyticsPage({ members, t }: { members: Member[]; t:(k:keyof typeof TR.en)=>string }) {
  const totalRevenue = members.reduce((s, m) => s + m.paidAmount, 0);
  return (
    <div>
      <div style={{ marginBottom:22 }}>
        <h1 style={{ fontSize:20, fontWeight:800, color:C.text, margin:0 }}>{t("analytics")}</h1>
        <p style={{ color:C.textMuted, margin:"3px 0 0", fontSize:11 }}>Performance insights · {GYM.name}</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:10, marginBottom:18 }}>
        {[
          { l:"Avg Daily Attendance", v:"47", u:"members/day", c:C.orange },
          { l:"Monthly Revenue", v:`₨${(totalRevenue/1000).toFixed(0)}K`, u:"this month", c:C.green },
          { l:"Retention Rate", v:"87%", u:"active members", c:C.blue },
          { l:"New This Month", v:"5", u:"new joinings", c:C.purple },
        ].map((s) => (
          <div key={s.l} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
            <div style={{ fontSize:24, fontWeight:900, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:12, fontWeight:700, color:C.text, marginTop:2 }}>{s.l}</div>
            <div style={{ fontSize:10, color:C.textMuted }}>{s.u}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:18 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:3 }}>Weekly Attendance Trend</div>
          <div style={{ fontSize:10, color:C.textMuted, marginBottom:14 }}>Present vs Absent per day</div>
          <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:100 }}>
            {WEEKLY_DATA.map((d, i) => {
              const max = 60;
              return (
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                  <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:2, height:90, justifyContent:"flex-end" }}>
                    <div style={{ height:(d.absent/max)*90, background:C.red+"55", borderRadius:"2px 2px 0 0" }} />
                    <div style={{ height:(d.present/max)*90, background:C.orange, borderRadius:"2px 2px 0 0" }} />
                  </div>
                  <span style={{ fontSize:8, color:C.textMuted }}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:18 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:3 }}>Revenue by Plan</div>
          <div style={{ fontSize:10, color:C.textMuted, marginBottom:14 }}>Total: ₨{totalRevenue.toLocaleString()}</div>
          {PLANS.map((p) => {
            const rev = members.filter((m) => m.plan===p.name).reduce((s,m) => s+m.paidAmount, 0);
            const pct = totalRevenue ? Math.round((rev/totalRevenue)*100) : 0;
            return (
              <div key={p.name} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
                  <span style={{ color:C.textMuted }}>{p.name}</span>
                  <span style={{ color:C.text, fontWeight:700 }}>₨{rev.toLocaleString()} · {pct}%</span>
                </div>
                <div style={{ height:6, background:C.border, borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:p.color, borderRadius:3, transition:"width 0.6s" }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:18 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:3 }}>Peak Hours</div>
          <div style={{ fontSize:10, color:C.textMuted, marginBottom:14 }}>Member activity by hour</div>
          <div style={{ display:"flex", gap:2, alignItems:"flex-end", height:90 }}>
            {PEAK_HOURS.map((h, i) => {
              const max = 55;
              return (
                <div key={i} title={`${h.hour}: ${h.count}`} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                  <div style={{ width:"100%", height:(h.count/max)*80, background:h.count>=35?C.orange:C.blue+"55", borderRadius:"2px 2px 0 0" }} />
                  <span style={{ fontSize:6, color:C.textFaint, transform:"rotate(-45deg)", transformOrigin:"center" }}>{h.hour}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CEO / About Page ─────────────────────────────────────────────────────────
function CeoPage({ t }: { t:(k:keyof typeof TR.en)=>string }) {
  const { lang } = useContext(LangCtx);
  const isUr = lang === "ur";
  return (
    <div>
      <div style={{ marginBottom:22 }}>
        <h1 style={{ fontSize:20, fontWeight:800, color:C.text, margin:0 }}>{t("ceo")}</h1>
        <p style={{ color:C.textMuted, margin:"3px 0 0", fontSize:11 }}>{GYM.name} · Est. {GYM.established}</p>
      </div>

      {/* CEO card */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:24, marginBottom:16, display:"flex", alignItems:"flex-start", gap:20, flexWrap:"wrap" }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:C.orange+"22", border:`3px solid ${C.orange}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, flexShrink:0 }}>👤</div>
        <div style={{ flex:1, minWidth:200 }}>
          <div style={{ fontSize:18, fontWeight:900, color:C.text }}>{isUr ? GYM.ceoNameUrdu : GYM.ceoName}</div>
          <div style={{ fontSize:12, color:C.orange, fontWeight:700, marginBottom:12 }}>{isUr ? GYM.ceoTitleUrdu : GYM.ceoTitle}</div>
          <div style={{ fontSize:12, color:C.textMuted, lineHeight:1.7 }}>{isUr ? GYM.ceoBioUrdu : GYM.ceoBio}</div>
          <div style={{ display:"flex", gap:8, marginTop:14, flexWrap:"wrap" }}>
            <a href={`tel:${GYM.ceoPhone}`} style={{ background:C.orange+"22", border:`1px solid ${C.orange}44`, borderRadius:8, padding:"8px 14px", color:C.orange, textDecoration:"none", fontSize:12, fontWeight:700 }}>📞 {GYM.ceoPhone}</a>
            <a href={`mailto:${GYM.ceoEmail}`} style={{ background:C.border, border:"none", borderRadius:8, padding:"8px 14px", color:C.textMuted, textDecoration:"none", fontSize:12 }}>✉️ {GYM.ceoEmail}</a>
          </div>
        </div>
      </div>

      {/* Objective */}
      <div style={{ background:C.card, border:`1px solid ${C.orange}22`, borderRadius:18, padding:22, marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:800, color:C.orange, marginBottom:10 }}>🎯 {t("objective")}</div>
        <div style={{ fontSize:13, color:C.textMuted, lineHeight:1.8 }}>{isUr ? GYM.ceoObjectiveUrdu : GYM.ceoObjective}</div>
      </div>

      {/* Gym Contact */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18, padding:22 }}>
        <div style={{ fontSize:13, fontWeight:800, color:C.text, marginBottom:16 }}>📍 {t("contact")}</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
          {[
            { icon:"📍", label:t("address"), val:isUr?GYM.addressUrdu:GYM.address },
            { icon:"📞", label:t("contact"), val:`${GYM.phone} · ${GYM.phone2}` },
            { icon:"✉️", label:"Email", val:GYM.email },
            { icon:"🌐", label:"Website", val:GYM.website },
            { icon:"☀️", label:t("morning"), val:isUr?GYM.timingMorningUrdu:GYM.timingMorning },
            { icon:"🌙", label:t("evening"), val:isUr?GYM.timingEveningUrdu:GYM.timingEvening },
          ].map((f) => (
            <div key={f.label} style={{ background:C.darker, borderRadius:10, padding:"12px 14px" }}>
              <div style={{ fontSize:10, color:C.textMuted, marginBottom:3 }}>{f.icon} {f.label}</div>
              <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{f.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Monthly Register (All Members) ──────────────────────────────────────────
function MonthlyRegisterPage({ members, t }: { members: Member[]; t:(k:keyof typeof TR.en)=>string }) {
  const { imgs } = useContext(ImagesCtx);
  const [selMonth, setSelMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [viewMode, setViewMode] = useState<"matrix"|"detail">("matrix");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const [yr, mn] = selMonth.split("-").map(Number);
  const daysInMonth = new Date(yr, mn, 0).getDate();
  const dayNums = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthLabel = new Date(yr, mn - 1, 1).toLocaleDateString("en-US", { month:"long", year:"numeric" });

  const allData = React.useMemo(() =>
    members.map(m => ({ member:m, days:genMemberDays(m, selMonth) })),
    [selMonth, members]
  );

  const totalPresent = allData.reduce((s, { days }) => s + days.filter(d => d.status==="Present").length, 0);
  const totalAbsent  = allData.reduce((s, { days }) => s + days.filter(d => d.status==="Absent").length, 0);
  const avgRate = allData.length ? Math.round(allData.reduce((s, { days }) => {
    const w = days.filter(d => !d.isSunday && !d.isFuture).length;
    const p = days.filter(d => d.status==="Present").length;
    return s + (w ? (p/w)*100 : 0);
  }, 0) / allData.length) : 0;

  const handlePrint = () => window.print();
  const handleShare = () => {
    const lines = allData.map(({ member, days }) => {
      const p = days.filter(d => d.status==="Present").length;
      const a = days.filter(d => d.status==="Absent").length;
      const w = days.filter(d => !d.isSunday && !d.isFuture).length;
      const pct = w ? Math.round((p/w)*100) : 0;
      return `${member.name} (${member.id}): ✅${p} ❌${a} 📈${pct}% | ${feeStatus(member)}`;
    });
    const text = [`📊 *MONTHLY REGISTER — ${monthLabel.toUpperCase()}*`,`🏋 *${GYM.name}*, ${GYM.city}`,`━━━━━━━━━━━━━━━━━━━━━━━━`,...lines,`━━━━━━━━━━━━━━━━━━━━━━━━`,`📞 ${GYM.phone}  |  ${GYM.phone2}`].join("\n");
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const cellColor = (s: string) =>
    s==="Present" ? C.green : s==="Absent" ? C.red : s==="Off" ? C.textFaint+"55" : "transparent";

  const thS: React.CSSProperties = { padding:"7px 5px", textAlign:"center", color:C.textMuted, fontWeight:600, fontSize:9, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" };
  const tdS: React.CSSProperties = { padding:"6px 5px", textAlign:"center", borderBottom:`1px solid ${C.border}22`, fontSize:11 };

  const toggleExpand = (id: string) => setExpanded(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  return (
    <div>
      <style>{`
        @media print {
          .no-print { display:none!important; }
          .print-break { page-break-before: always; }
          .rpt-table th, .rpt-table td { color:#000!important; border-color:#ccc!important; }
          body { background:#fff!important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:C.text, margin:0 }}>Monthly Register</h1>
          <p style={{ color:C.textMuted, margin:"4px 0 0", fontSize:11 }}>{monthLabel} · {members.length} members · {GYM.name}, {GYM.city}</p>
        </div>
        <div className="no-print" style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          <input type="month" value={selMonth} onChange={e => setSelMonth(e.target.value)} style={{ ...inputStyle, width:"auto", padding:"10px 14px", minHeight:44 }} />
          <button onClick={() => setViewMode(v => v==="matrix"?"detail":"matrix")} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", color:C.textMuted, cursor:"pointer", fontWeight:700, fontSize:12, minHeight:44 }}>
            {viewMode==="matrix" ? "📋 Detail View" : "⊞ Matrix View"}
          </button>
          <button onClick={handleShare} style={{ background:"#25D36622", border:`1px solid #25D36655`, borderRadius:10, padding:"10px 14px", color:"#25D366", cursor:"pointer", fontWeight:700, fontSize:12, minHeight:44 }}>📲 WhatsApp</button>
          <button onClick={handlePrint} style={{ background:C.orange+"22", border:`1px solid ${C.orange}55`, borderRadius:10, padding:"10px 14px", color:C.orange, cursor:"pointer", fontWeight:700, fontSize:12, minHeight:44 }}>🖨 Print</button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:10, marginBottom:18 }}>
        <Stat icon="◉" label="Members" value={members.length} color={C.blue} />
        <Stat icon="✅" label="Total Present" value={totalPresent} color={C.green} />
        <Stat icon="❌" label="Total Absent" value={totalAbsent} color={C.red} />
        <Stat icon="📈" label="Avg Rate" value={`${avgRate}%`} color={C.orange} />
        <Stat icon="₨" label="Revenue" value={`₨${(members.reduce((s,m)=>s+m.paidAmount,0)/1000).toFixed(0)}K`} color={C.amber} />
        <Stat icon="⚠" label="Pending" value={`₨${(members.reduce((s,m)=>s+Math.max(0,m.fee-m.paidAmount),0)/1000).toFixed(0)}K`} color={C.red} />
      </div>

      {viewMode === "matrix" ? (
        /* ── MATRIX VIEW ────────────────────────────────────────────────── */
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
          <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" as any }}>
            <table className="rpt-table" style={{ borderCollapse:"collapse", width:"100%", fontSize:11 }}>
              <thead>
                <tr style={{ background:C.darker }}>
                  <th style={{ ...thS, textAlign:"left", minWidth:170, position:"sticky", left:0, background:C.darker, zIndex:2, padding:"8px 12px" }}>Member</th>
                  {dayNums.map(d => {
                    const dt = new Date(yr, mn-1, d);
                    const isSun = dt.getDay()===0;
                    const isToday = dt.toISOString().slice(0,10) === new Date().toISOString().slice(0,10);
                    return (
                      <th key={d} style={{ ...thS, width:26, minWidth:26, color:isSun?C.textFaint:isToday?C.orange:C.textMuted, background:isToday?C.orange+"11":"transparent" }}>
                        <div style={{ fontWeight:isToday?800:600 }}>{d}</div>
                        <div style={{ fontSize:7, marginTop:1 }}>{dt.toLocaleDateString("en-US",{weekday:"narrow"})}</div>
                      </th>
                    );
                  })}
                  <th style={{ ...thS, minWidth:32, color:C.green }}>P</th>
                  <th style={{ ...thS, minWidth:32, color:C.red }}>A</th>
                  <th style={{ ...thS, minWidth:38, color:C.orange }}>Rate</th>
                  <th style={{ ...thS, minWidth:60 }}>Fee</th>
                </tr>
              </thead>
              <tbody>
                {allData.map(({ member, days }, ri) => {
                  const present = days.filter(d => d.status==="Present").length;
                  const absent  = days.filter(d => d.status==="Absent").length;
                  const work    = days.filter(d => !d.isSunday && !d.isFuture).length;
                  const pct     = work ? Math.round((present/work)*100) : 0;
                  const photo   = imgs[member.id];
                  return (
                    <tr key={member.id} style={{ background:ri%2===0?"transparent":C.darker+"55" }}>
                      <td style={{ ...tdS, textAlign:"left", position:"sticky", left:0, background:ri%2===0?C.card:C.darker, borderRight:`1px solid ${C.border}`, padding:"8px 12px", minWidth:170 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <Avatar name={member.name} size={28} id={member.id} />
                          <div style={{ minWidth:0 }}>
                            <div style={{ fontWeight:700, color:C.text, fontSize:11, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:110 }}>{member.name}</div>
                            <div style={{ fontSize:9, color:C.textMuted }}>{member.id} · {member.batch}</div>
                          </div>
                        </div>
                      </td>
                      {days.map(row => {
                        const bg = cellColor(row.status);
                        const tip = row.status==="Present" ? `✅ ${row.checkIn} → ${row.checkOut} (${row.duration})` : row.status;
                        return (
                          <td key={row.d} title={tip} style={{ ...tdS, padding:"4px 2px" }}>
                            <div title={tip} style={{ width:18, height:18, borderRadius:3, background:bg, border:`1px solid ${bg==="transparent"?C.border+"22":bg+"66"}`, margin:"0 auto", transition:"transform 0.1s", cursor:"default" }} />
                          </td>
                        );
                      })}
                      <td style={{ ...tdS, color:C.green, fontWeight:800 }}>{present}</td>
                      <td style={{ ...tdS, color:C.red, fontWeight:800 }}>{absent}</td>
                      <td style={{ ...tdS, color:pct>=80?C.green:pct>=60?C.amber:C.red, fontWeight:800 }}>{pct}%</td>
                      <td style={{ ...tdS }}><Badge status={feeStatus(member)} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Legend */}
          <div style={{ padding:"10px 16px", background:C.darker, borderTop:`1px solid ${C.border}`, display:"flex", gap:14, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontSize:10, color:C.textMuted, fontWeight:700 }}>Legend:</span>
            {[[C.green,"Present"],[C.red,"Absent"],[C.textFaint+"55","Sunday/Off"],["transparent","Future/N/A"]].map(([bg,lbl]) => (
              <div key={lbl as string} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:C.textMuted }}>
                <div style={{ width:12, height:12, borderRadius:3, background:bg as string, border:`1px solid ${C.border}` }} /> {lbl}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── DETAIL VIEW ─────────────────────────────────────────────────── */
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {allData.map(({ member, days }, mi) => {
            const present = days.filter(d => d.status==="Present").length;
            const absent  = days.filter(d => d.status==="Absent").length;
            const work    = days.filter(d => !d.isSunday && !d.isFuture).length;
            const pct     = work ? Math.round((present/work)*100) : 0;
            const due     = Math.max(0, member.fee - member.paidAmount);
            const isExp   = expanded.has(member.id);
            return (
              <div key={member.id} className={mi>0?"print-break":""} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
                {/* Member header row — click to expand */}
                <div onClick={() => toggleExpand(member.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", cursor:"pointer", background:isExp?C.orange+"0A":"transparent", flexWrap:"wrap" }}>
                  <Avatar name={member.name} size={44} id={member.id} />
                  <div style={{ flex:1, minWidth:120 }}>
                    <div style={{ fontSize:14, fontWeight:800, color:C.text }}>{member.name}</div>
                    <div style={{ fontSize:10, color:C.textMuted }}>{member.id} · {member.phone} · {member.plan} · {member.batch}</div>
                    <div style={{ display:"flex", gap:6, marginTop:5, flexWrap:"wrap" }}>
                      <Badge status={member.status} />
                      <Badge status={feeStatus(member)} />
                      {member.medical.conditions.length>0 && <span style={{ fontSize:9, background:C.red+"15", color:C.red, padding:"2px 7px", borderRadius:5 }}>🩺 {member.medical.conditions.join(", ")}</span>}
                    </div>
                  </div>
                  {/* Mini summary */}
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, flexShrink:0 }}>
                    {[["✅",present,C.green],[`❌`,absent,C.red],[`${pct}%`,"Rate",C.orange],[`₨${(due/1000).toFixed(1)}K`,"Due",due>0?C.red:C.green]].map(([v,l,col],i) => (
                      <div key={i} style={{ textAlign:"center", background:C.darker, borderRadius:8, padding:"8px 10px", minWidth:52 }}>
                        <div style={{ fontSize:14, fontWeight:900, color:col as string }}>{v}</div>
                        <div style={{ fontSize:9, color:C.textMuted }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize:16, color:C.textMuted, marginLeft:"auto", flexShrink:0 }}>{isExp?"▲":"▼"}</div>
                </div>

                {/* Expanded: full day table */}
                {isExp && (
                  <div>
                    {/* Fee strip */}
                    <div style={{ padding:"10px 16px", background:C.darker, borderTop:`1px solid ${C.border}`, display:"flex", gap:16, flexWrap:"wrap", fontSize:11 }}>
                      <span style={{ color:C.textMuted }}>Plan: <b style={{ color:C.text }}>{member.plan}</b></span>
                      <span style={{ color:C.textMuted }}>Monthly Fee: <b style={{ color:C.text }}>₨{member.fee.toLocaleString()}</b></span>
                      <span style={{ color:C.textMuted }}>Paid: <b style={{ color:C.green }}>₨{member.paidAmount.toLocaleString()}</b></span>
                      <span style={{ color:C.textMuted }}>Due: <b style={{ color:due>0?C.red:C.green }}>₨{due.toLocaleString()}</b></span>
                      <span style={{ color:C.textMuted }}>Due Date: <b style={{ color:C.text }}>{member.dueDate}</b></span>
                      <span style={{ color:C.textMuted }}>Blood Group: <b style={{ color:C.text }}>{member.medical.bloodGroup}</b></span>
                    </div>
                    {/* Day table */}
                    <div style={{ overflowX:"auto" }}>
                      <table className="rpt-table" style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                        <thead>
                          <tr style={{ background:C.darker }}>
                            {["#","Date","Day","Status","Check-In","Check-Out","Duration"].map(h => (
                              <th key={h} style={{ padding:"9px 12px", textAlign:"left", color:C.textMuted, fontWeight:600, fontSize:10, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {days.map((row, i) => (
                            <tr key={row.d} style={{ background:i%2===0?"transparent":C.darker+"55", borderBottom:`1px solid ${C.border}22` }}>
                              <td style={{ padding:"8px 12px", color:C.textFaint, fontSize:10 }}>{row.d}</td>
                              <td style={{ padding:"8px 12px", color:C.textMuted, whiteSpace:"nowrap" }}>{row.dateKey.slice(5)}</td>
                              <td style={{ padding:"8px 12px", color:C.textMuted }}>{row.dayName}</td>
                              <td style={{ padding:"8px 12px" }}>
                                <span style={{ color:row.status==="Present"?C.green:row.status==="Absent"?C.red:C.textFaint, fontWeight:700, fontSize:11 }}>
                                  {row.status==="Present"?"✅":row.status==="Absent"?"❌":row.status==="Off"?"🔵":"—"} {row.status}
                                </span>
                              </td>
                              <td style={{ padding:"8px 12px", color:C.text, fontWeight:600, whiteSpace:"nowrap" }}>{row.checkIn||"—"}</td>
                              <td style={{ padding:"8px 12px", color:C.text, fontWeight:600, whiteSpace:"nowrap" }}>{row.checkOut||"—"}</td>
                              <td style={{ padding:"8px 12px", color:C.blue, fontWeight:600 }}>{row.duration||"—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Row summary */}
                    <div style={{ padding:"10px 16px", background:C.darker, borderTop:`1px solid ${C.border}`, display:"flex", gap:16, flexWrap:"wrap", fontSize:11 }}>
                      <span style={{ color:C.green }}>✅ Present: <b>{present}</b></span>
                      <span style={{ color:C.red }}>❌ Absent: <b>{absent}</b></span>
                      <span style={{ color:C.textMuted }}>🔵 Sundays: <b>{days.filter(d=>d.status==="Off").length}</b></span>
                      <span style={{ color:C.orange }}>📈 Attendance Rate: <b>{pct}%</b></span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign:"center", padding:"18px", color:C.textMuted, fontSize:10, marginTop:16 }}>
        {GYM.name} · {GYM.address} · {GYM.phone} · Generated {new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}
      </div>
    </div>
  );
}

// ─── Admin App ────────────────────────────────────────────────────────────────
function AdminApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [page, setPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>(INIT_MEMBERS);
  const [trainers, setTrainers] = useState<Trainer[]>(INIT_TRAINERS);
  const [imgs, setImgsState] = useState<Record<string, string>>({});
  const setImg = (id: string, url: string) => setImgsState((p) => ({ ...p, [id]: url }));

  const t = (k: keyof typeof TR.en) => (TR[lang] as Record<string, string>)[k] ?? TR.en[k];

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
  const dateShort = now.toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" });

  const NAV = [
    { id:"dashboard",  icon:"⬡",  tk:"dashboard" },
    { id:"attendance", icon:"✓",  tk:"attendance" },
    { id:"register",   icon:"📋", tk:"register" },
    { id:"members",    icon:"◉",  tk:"members" },
    { id:"trainers",   icon:"🏋", tk:"trainers" },
    { id:"fees",       icon:"₨",  tk:"fees" },
    { id:"plans",      icon:"◈",  tk:"plans" },
    { id:"analytics",  icon:"◫",  tk:"analytics" },
    { id:"ceo",        icon:"🏛", tk:"ceo" },
  ] as const;

  const pages: Record<string, React.ReactNode> = {
    dashboard:  <DashboardPage members={members} t={t} />,
    attendance: <AttendancePage members={members} t={t} />,
    register:   <MonthlyRegisterPage members={members} t={t} />,
    members:    <MembersPage members={members} setMembers={setMembers} t={t} />,
    trainers:   <TrainersPage trainers={trainers} setTrainers={setTrainers} t={t} />,
    fees:       <FeesPage members={members} t={t} />,
    plans:      <PlansPage t={t} />,
    analytics:  <AnalyticsPage members={members} t={t} />,
    ceo:        <CeoPage t={t} />,
  };

  const dir = lang === "ur" ? "rtl" : "ltr";
  const urduFont = lang === "ur" ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif" : "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  return (
    <LangCtx.Provider value={{ lang, setLang }}>
    <ImagesCtx.Provider value={{ imgs, setImg }}>
    <Toaster position="top-right" richColors />
    <div dir={dir} style={{ display:"flex", background:C.dark, minHeight:"100vh", fontFamily:urduFont, color:C.text }}>
      <style>{`
        * { box-sizing: border-box; }
        input, select, textarea { outline: none; font-family: inherit; }
        button { outline: none; font-family: inherit; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #0A2040; border-radius: 2px; }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: none; opacity: 1; } }
        @media (max-width: 768px) {
          .adm-sidebar { display: none !important; }
          .adm-mob-nav { display: flex !important; }
          .adm-content { padding: 14px !important; }
        }
        @media (min-width: 769px) {
          .adm-mob-nav { display: none !important; }
        }
      `}</style>

      {/* Desktop Sidebar */}
      <div className="adm-sidebar">
        <Sidebar page={page} setPage={(p) => { setPage(p); setMobileMenuOpen(false); }} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} t={t} />
      </div>

      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* Top Bar */}
        <div style={{ background:C.darker, borderBottom:`1px solid ${C.border}`, padding:"0 16px", height:54, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button className="adm-mob-nav" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background:"none", border:"none", color:C.text, fontSize:22, cursor:"pointer", display:"none", minWidth:44, minHeight:44, alignItems:"center", justifyContent:"center" }}>☰</button>
            <div style={{ fontSize:13, fontWeight:900, color:C.orange, letterSpacing:1 }}>{lang==="ur" ? GYM.nameUrdu : GYM.name}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {/* Language toggle */}
            <button onClick={() => setLang(lang==="en"?"ur":"en")} style={{ background:C.border, border:`1px solid ${C.borderLight}`, borderRadius:8, padding:"6px 12px", color:C.textMuted, cursor:"pointer", fontSize:11, fontWeight:700, minHeight:36 }}>
              {lang==="en" ? t("switchToUrdu") : t("switchToEn")}
            </button>
            <div style={{ fontSize:10, color:C.textMuted, background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"4px 10px", display:"none" }} className="adm-date">{dateShort} · {timeStr}</div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:C.green }} />
              <Avatar name="Admin" size={28} />
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="adm-mob-nav" style={{ background:C.darker, borderBottom:`1px solid ${C.border}`, flexDirection:"column", padding:10, gap:4, display:"none" }}>
            {NAV.map((n) => (
              <button key={n.id} onClick={() => { setPage(n.id); setMobileMenuOpen(false); }} style={{ background:page===n.id?C.orange+"18":"transparent", border:`1px solid ${page===n.id?C.orange+"33":"transparent"}`, borderRadius:10, padding:"12px 16px", color:page===n.id?C.orange:C.textMuted, cursor:"pointer", textAlign:"left", fontWeight:600, fontSize:13, display:"flex", gap:10, alignItems:"center", minHeight:48 }}>
                <span>{n.icon}</span>{t(n.tk as keyof typeof TR.en)}
              </button>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="adm-content" style={{ flex:1, padding:"22px 20px", overflowY:"auto", overflowX:"hidden" }}>
          {pages[page]}
        </div>
      </div>
    </div>
    </ImagesCtx.Provider>
    </LangCtx.Provider>
  );
}
