import { createFileRoute } from "@tanstack/react-router";
import React, { createContext, useContext, useState, useRef } from "react";
import { CameraCapture } from "@/components/CameraCapture";
import { Toaster, toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminApp,
  head: () => ({ meta: [{ title: "Admin · Iron Pulse" }] }),
});

const COLORS = {
  orange: "#0096FF",        /* main   — #0096FF */
  orangeLight: "#33AEFF",   /* light  — #33AEFF */
  orangeDark: "#0077CC",    /* dark   — #0077CC */
  dark: "#00060F",
  darker: "#000308",
  card: "#020D1E",
  cardHover: "#051728",
  border: "#0A2040",
  borderLight: "#0D2A52",
  text: "#F0F4FF",
  textMuted: "#7A87AA",
  textFaint: "#374060",
  green: "#22C55E",
  red: "#EF4444",
  blue: "#66C2FF",          /* lightest shade — #66C2FF */
  amber: "#F59E0B",
  purple: "#818CF8",
};

type MemberImagesCtxType = { images: Record<string, string>; set: (id: string, url: string) => void };
const MemberImagesCtx = createContext<MemberImagesCtxType>({ images: {}, set: () => {} });

const MOCK_MEMBERS = [
  { id: "GM001", name: "Ahmed Raza", phone: "+92 300 1234567", plan: "Elite", fee: 9000, status: "Active", batch: "Morning", image: null, dueDate: "2026-06-01", paidAmount: 9000, lastPayment: "2026-05-01", joinDate: "2024-01-15" },
  { id: "GM002", name: "Fatima Khan", phone: "+92 301 2345678", plan: "Pro", fee: 5000, status: "Active", batch: "Evening", image: null, dueDate: "2026-05-20", paidAmount: 5000, lastPayment: "2026-04-20", joinDate: "2024-03-10" },
  { id: "GM003", name: "Usman Ali", phone: "+92 302 3456789", plan: "Starter", fee: 2500, status: "Active", batch: "Morning", image: null, dueDate: "2026-05-15", paidAmount: 0, lastPayment: "2026-04-15", joinDate: "2024-06-01" },
  { id: "GM004", name: "Sana Malik", phone: "+92 303 4567890", plan: "Elite", fee: 9000, status: "Active", batch: "Evening", image: null, dueDate: "2026-06-10", paidAmount: 9000, lastPayment: "2026-05-10", joinDate: "2023-11-20" },
  { id: "GM005", name: "Hassan Sheikh", phone: "+92 304 5678901", plan: "Pro", fee: 5000, status: "Expired", batch: "Morning", image: null, dueDate: "2026-05-01", paidAmount: 2500, lastPayment: "2026-04-01", joinDate: "2024-02-14" },
  { id: "GM006", name: "Ayesha Noor", phone: "+92 305 6789012", plan: "Starter", fee: 2500, status: "Active", batch: "Evening", image: null, dueDate: "2026-06-05", paidAmount: 2500, lastPayment: "2026-05-05", joinDate: "2024-04-22" },
  { id: "GM007", name: "Bilal Ahmad", phone: "+92 306 7890123", plan: "Elite", fee: 9000, status: "Active", batch: "Morning", image: null, dueDate: "2026-06-08", paidAmount: 9000, lastPayment: "2026-05-08", joinDate: "2023-09-01" },
  { id: "GM008", name: "Zara Hussain", phone: "+92 307 8901234", plan: "Pro", fee: 5000, status: "Active", batch: "Evening", image: null, dueDate: "2026-05-25", paidAmount: 0, lastPayment: "2026-04-25", joinDate: "2024-07-11" },
];

const PLANS = [
  { name: "Starter", monthly: 2500, quarterly: 7000, halfYearly: 13000, yearly: 24000, features: ["Gym Access", "Locker", "Basic Equipment"], color: COLORS.blue },
  { name: "Pro", monthly: 5000, quarterly: 14000, halfYearly: 26000, yearly: 50000, features: ["All Starter", "Group Classes", "Diet Plan", "Progress Tracking"], color: COLORS.orange },
  { name: "Elite", monthly: 9000, quarterly: 25000, halfYearly: 47000, yearly: 90000, features: ["All Pro", "Personal Trainer", "Nutrition Plan", "Priority Access", "Spa Access"], color: COLORS.purple },
];

const WEEKLY_DATA = [
  { day: "Mon", present: 42, absent: 18 },
  { day: "Tue", present: 38, absent: 22 },
  { day: "Wed", present: 55, absent: 5 },
  { day: "Thu", present: 60, absent: 0 },
  { day: "Fri", present: 48, absent: 12 },
  { day: "Sat", present: 52, absent: 8 },
  { day: "Sun", present: 30, absent: 30 },
];

const PEAK_HOURS = [
  { hour: "6AM", count: 12 }, { hour: "7AM", count: 28 }, { hour: "8AM", count: 35 },
  { hour: "9AM", count: 22 }, { hour: "10AM", count: 15 }, { hour: "11AM", count: 10 },
  { hour: "12PM", count: 8 }, { hour: "1PM", count: 6 }, { hour: "4PM", count: 18 },
  { hour: "5PM", count: 38 }, { hour: "6PM", count: 55 }, { hour: "7PM", count: 48 },
  { hour: "8PM", count: 32 }, { hour: "9PM", count: 15 },
];

const RECENT_PAYMENTS = [
  { member: "Ahmed Raza", id: "GM001", amount: 9000, method: "Cash", date: "Today 10:30 AM", status: "Paid" },
  { member: "Sana Malik", id: "GM004", amount: 9000, method: "Online", date: "Today 09:15 AM", status: "Paid" },
  { member: "Ayesha Noor", id: "GM006", amount: 2500, method: "Cash", date: "Yesterday 06:45 PM", status: "Paid" },
  { member: "Hassan Sheikh", id: "GM005", amount: 2500, method: "Partial", date: "Yesterday 05:20 PM", status: "Partial" },
];

function Avatar({ name, size = 40, memberId }: { name: string; size?: number; memberId?: string }) {
  const { images } = useContext(MemberImagesCtx);
  const img = memberId ? images[memberId] : undefined;
  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#0096FF", "#818CF8", "#66C2FF", "#22C55E", "#F59E0B", "#EC4899"];
  const colorIdx = name.charCodeAt(0) % colors.length;
  if (img) return (
    <img src={img} alt={name} style={{
      width: size, height: size, borderRadius: "50%", objectFit: "cover",
      flexShrink: 0, border: `2px solid ${COLORS.orange}44`, display: "block"
    }} />
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: colors[colorIdx] + "22",
      border: `2px solid ${colors[colorIdx]}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 600, color: colors[colorIdx],
      flexShrink: 0, fontFamily: "monospace"
    }}>{initials}</div>
  );
}

function Badge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    "Active": { bg: "#22C55E15", color: "#22C55E", border: "#22C55E30" },
    "Expired": { bg: "#EF444415", color: "#EF4444", border: "#EF444430" },
    "Paid": { bg: "#22C55E15", color: "#22C55E", border: "#22C55E30" },
    "Unpaid": { bg: "#EF444415", color: "#EF4444", border: "#EF444430" },
    "Partial": { bg: "#F59E0B15", color: "#F59E0B", border: "#F59E0B30" },
    "Overdue": { bg: "#EF444415", color: "#EF4444", border: "#EF444430" },
    "Present": { bg: "#22C55E15", color: "#22C55E", border: "#22C55E30" },
    "Absent": { bg: "#EF444415", color: "#EF4444", border: "#EF444430" },
    "Checked In": { bg: "#3B82F615", color: "#3B82F6", border: "#3B82F630" },
    "Completed": { bg: "#8B5CF615", color: "#8B5CF6", border: "#8B5CF630" },
    "Online": { bg: "#3B82F615", color: "#3B82F6", border: "#3B82F630" },
    "Cash": { bg: "#22C55E15", color: "#22C55E", border: "#22C55E30" },
  };
  const s = map[status] || { bg: "#88888815", color: "#888888", border: "#88888830" };
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 600, letterSpacing: 0.3
    }}>{status}</span>
  );
}

function StatCard({ icon, label, value, sub, color = COLORS.orange, trend }: {
  icon: string; label: string; value: string | number; sub?: string; color?: string; trend?: number;
}) {
  return (
    <div style={{
      background: COLORS.card, border: `1px solid ${COLORS.border}`,
      borderRadius: 16, padding: "20px", position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0, width: 80, height: 80,
        background: color + "08", borderRadius: "0 16px 0 80px"
      }} />
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.text, letterSpacing: -0.5 }}>{value}</div>
      <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: color, marginTop: 6, fontWeight: 600 }}>{sub}</div>}
      {trend !== undefined && (
        <div style={{ fontSize: 11, color: trend > 0 ? COLORS.green : COLORS.red, marginTop: 6 }}>
          {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% vs last week
        </div>
      )}
    </div>
  );
}

function MiniBar({ data, valueKey, labelKey, color }: {
  data: Record<string, any>[]; valueKey: string; labelKey: string; color: string;
}) {
  const max = Math.max(...data.map((d) => d[valueKey]));
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 80 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: "100%", background: color + "33", borderRadius: "4px 4px 0 0",
            height: (d[valueKey] / max) * 64,
            position: "relative", overflow: "hidden"
          }}>
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: color, height: "60%", opacity: 0.7
            }} />
          </div>
          <span style={{ fontSize: 9, color: COLORS.textMuted }}>{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

function Sidebar({ page, setPage, collapsed, setCollapsed }: {
  page: string; setPage: (p: string) => void; collapsed: boolean; setCollapsed: (c: boolean) => void;
}) {
  const nav = [
    { id: "dashboard", icon: "⬡", label: "Dashboard" },
    { id: "attendance", icon: "✓", label: "Attendance" },
    { id: "members", icon: "◉", label: "Members" },
    { id: "fees", icon: "₨", label: "Fee Management" },
    { id: "plans", icon: "◈", label: "Plans" },
    { id: "analytics", icon: "◫", label: "Analytics" },
  ];
  return (
    <div style={{
      width: collapsed ? 64 : 220, background: COLORS.darker,
      borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column",
      transition: "width 0.25s cubic-bezier(.4,0,.2,1)", overflow: "hidden", flexShrink: 0,
      height: "100vh", position: "sticky", top: 0
    }}>
      <div style={{
        padding: collapsed ? "20px 0" : "20px 16px",
        borderBottom: `1px solid ${COLORS.border}`,
        display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "space-between"
      }}>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.orange, letterSpacing: 1.5, textTransform: "uppercase" }}>Iron Pulse</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 0.5 }}>Gym Management</div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          background: COLORS.border, border: "none", borderRadius: 8, width: 28, height: 28,
          color: COLORS.textMuted, cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 12, flexShrink: 0
        }}>{collapsed ? "▶" : "◀"}</button>
      </div>
      <nav style={{ padding: "12px 8px", flex: 1 }}>
        {nav.map((n) => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: collapsed ? "10px 0" : "10px 12px", justifyContent: collapsed ? "center" : "flex-start",
            background: page === n.id ? COLORS.orange + "18" : "transparent",
            border: page === n.id ? `1px solid ${COLORS.orange}33` : "1px solid transparent",
            borderRadius: 10, color: page === n.id ? COLORS.orange : COLORS.textMuted,
            cursor: "pointer", marginBottom: 2, transition: "all 0.15s", fontWeight: page === n.id ? 600 : 400,
            fontSize: 13
          }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>{n.icon}</span>
            {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{n.label}</span>}
          </button>
        ))}
      </nav>
      <div style={{ padding: collapsed ? "16px 0" : "16px", borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start" }}>
          <Avatar name="Admin User" size={32} />
          {!collapsed && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>Admin</div>
              <div style={{ fontSize: 10, color: COLORS.textMuted }}>Super Admin</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0 }}>Dashboard Overview</h1>
        <p style={{ color: COLORS.textMuted, margin: "4px 0 0", fontSize: 13 }}>{dateStr} · Iron Pulse Gym, Lahore</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 24 }}>
        <StatCard icon="◉" label="Total Members" value="60" sub="8 shown in demo" color={COLORS.blue} trend={12} />
        <StatCard icon="✓" label="Present Today" value="42" sub="70% attendance" color={COLORS.green} trend={5} />
        <StatCard icon="↑" label="Checked In" value="38" sub="Morning + Evening" color={COLORS.orange} />
        <StatCard icon="↓" label="Checked Out" value="31" sub="Session completed" color={COLORS.purple} />
        <StatCard icon="✗" label="Absent Today" value="18" sub="Notified via SMS" color={COLORS.red} trend={-8} />
        <StatCard icon="₨" label="Today's Revenue" value="₨26,500" sub="3 payments" color={COLORS.amber} trend={18} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>Weekly Attendance</span>
            <Badge status="Present" />
          </div>
          <MiniBar data={WEEKLY_DATA} valueKey="present" labelKey="day" color={COLORS.orange} />
        </div>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>Peak Hours</span>
            <Badge status="Checked In" />
          </div>
          <MiniBar data={PEAK_HOURS.slice(3, 11)} valueKey="count" labelKey="hour" color={COLORS.blue} />
        </div>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>Membership Split</span>
          </div>
          {PLANS.map((p) => {
            const count = MOCK_MEMBERS.filter((m) => m.plan === p.name).length;
            const pct = Math.round((count / MOCK_MEMBERS.length) * 100);
            return (
              <div key={p.name} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: COLORS.textMuted }}>{p.name}</span>
                  <span style={{ color: COLORS.text, fontWeight: 600 }}>{count} members · {pct}%</span>
                </div>
                <div style={{ height: 6, background: COLORS.border, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: p.color, borderRadius: 3 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>Recent Payments</span>
          <span style={{ fontSize: 11, color: COLORS.orange, cursor: "pointer" }}>View All →</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {RECENT_PAYMENTS.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: COLORS.darker, borderRadius: 10 }}>
              <Avatar name={p.member} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{p.member}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{p.id} · {p.date}</div>
              </div>
              <Badge status={p.method} />
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.green }}>₨{p.amount.toLocaleString()}</div>
                <Badge status={p.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AttendancePage() {
  const now = new Date();
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const [attendance, setAttendance] = useState<Record<string, { checkedIn?: boolean; checkedOut?: boolean; checkInTime?: string | null; checkOutTime?: string | null }>>({});
  const [filter, setFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCheckIn = (memberId: string) => {
    const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setAttendance((prev) => ({
      ...prev,
      [memberId]: { ...prev[memberId], checkedIn: !prev[memberId]?.checkedIn, checkInTime: !prev[memberId]?.checkedIn ? time : null }
    }));
    showToast("✓ Check-in saved successfully");
  };

  const handleCheckOut = (memberId: string) => {
    const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    if (!attendance[memberId]?.checkedIn) { showToast("⚠ Check-in first before check-out", "warn"); return; }
    setAttendance((prev) => ({
      ...prev,
      [memberId]: { ...prev[memberId], checkedOut: !prev[memberId]?.checkedOut, checkOutTime: !prev[memberId]?.checkedOut ? time : null }
    }));
    showToast("✓ Check-out saved successfully");
  };

  const getStatus = (id: string) => {
    const a = attendance[id];
    if (!a?.checkedIn) return "Absent";
    if (a.checkedIn && a.checkedOut) return "Completed";
    return "Checked In";
  };

  const filtered = MOCK_MEMBERS.filter((m) => {
    if (batchFilter !== "All" && m.batch !== batchFilter) return false;
    if (filter === "Present" && !attendance[m.id]?.checkedIn) return false;
    if (filter === "Absent" && attendance[m.id]?.checkedIn) return false;
    if (filter === "Checked Out" && !attendance[m.id]?.checkedOut) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.id.includes(search)) return false;
    return true;
  });

  const stats = {
    total: MOCK_MEMBERS.length,
    present: Object.values(attendance).filter((a) => a.checkedIn).length,
    checkedOut: Object.values(attendance).filter((a) => a.checkedOut).length,
    morning: MOCK_MEMBERS.filter((m) => m.batch === "Morning").length,
    evening: MOCK_MEMBERS.filter((m) => m.batch === "Evening").length,
  };

  return (
    <div>
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 999,
          background: toast.type === "warn" ? COLORS.amber : COLORS.green,
          color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)", animation: "slideIn 0.2s ease"
        }}>{toast.msg}</div>
      )}
      <style>{`@keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:none;opacity:1}}`}</style>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>
          Daily Attendance — <span style={{ color: COLORS.orange }}>{dayName}, {dateStr}</span>
        </h1>
        <p style={{ color: COLORS.textMuted, margin: "4px 0 0", fontSize: 12 }}>Click checkboxes to record arrivals and departures</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10, marginBottom: 20 }}>
        <StatCard icon="◉" label="Total" value={stats.total} color={COLORS.blue} />
        <StatCard icon="✓" label="Present" value={stats.present} color={COLORS.green} />
        <StatCard icon="↓" label="Checked Out" value={stats.checkedOut} color={COLORS.purple} />
        <StatCard icon="☀" label="Morning" value={stats.morning} color={COLORS.amber} />
        <StatCard icon="☽" label="Evening" value={stats.evening} color={COLORS.orange} />
        <StatCard icon="✗" label="Absent" value={stats.total - stats.present} color={COLORS.red} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search member..." style={{
          flex: 1, minWidth: 180, background: COLORS.card, border: `1px solid ${COLORS.border}`,
          borderRadius: 10, padding: "8px 14px", color: COLORS.text, fontSize: 13
        }} />
        {["All", "Present", "Absent", "Checked Out"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            background: filter === f ? COLORS.orange : COLORS.card,
            border: `1px solid ${filter === f ? COLORS.orange : COLORS.border}`,
            borderRadius: 10, padding: "8px 14px", color: filter === f ? "#fff" : COLORS.textMuted,
            cursor: "pointer", fontSize: 12, fontWeight: 600
          }}>{f}</button>
        ))}
        {["All", "Morning", "Evening"].map((b) => (
          <button key={b} onClick={() => setBatchFilter(b)} style={{
            background: batchFilter === b ? COLORS.blue + "22" : "transparent",
            border: `1px solid ${batchFilter === b ? COLORS.blue : COLORS.border}`,
            borderRadius: 10, padding: "8px 14px", color: batchFilter === b ? COLORS.blue : COLORS.textMuted,
            cursor: "pointer", fontSize: 12, fontWeight: 600
          }}>{b === "All" ? "All Batches" : `${b} Batch`}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((member) => {
          const a = attendance[member.id] || {};
          const status = getStatus(member.id);
          return (
            <div key={member.id} style={{
              background: COLORS.card, border: `1px solid ${a.checkedIn ? COLORS.green + "30" : COLORS.border}`,
              borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center",
              gap: 12, flexWrap: "wrap" as const, transition: "border-color 0.2s"
            }}>
              <Avatar name={member.name} size={44} memberId={member.id} />
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{member.name}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{member.id} · {member.phone}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" as const }}>
                  <Badge status={member.status} />
                  <span style={{ fontSize: 10, color: COLORS.orange, background: COLORS.orange + "15", padding: "2px 8px", borderRadius: 5 }}>{member.batch}</span>
                  <span style={{ fontSize: 10, color: COLORS.purple, background: COLORS.purple + "15", padding: "2px 8px", borderRadius: 5 }}>{member.plan}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" as const }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={!!a.checkedIn} onChange={() => handleCheckIn(member.id)} style={{ width: 18, height: 18, accentColor: COLORS.green }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.green }}>Check In</div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted }}>{a.checkInTime || "—"}</div>
                  </div>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={!!a.checkedOut} onChange={() => handleCheckOut(member.id)} style={{ width: 18, height: 18, accentColor: COLORS.red }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.red }}>Check Out</div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted }}>{a.checkOutTime || "—"}</div>
                  </div>
                </label>
              </div>
              <Badge status={status === "Completed" ? "Completed" : status === "Checked In" ? "Checked In" : "Absent"} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const EMPTY_MEMBER = { name: "", phone: "", plan: "Starter", batch: "Morning", fee: 2500, status: "Active", joinDate: new Date().toISOString().slice(0, 10) };

function MembersPage() {
  const { images, set: setImage } = useContext(MemberImagesCtx);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<string | null>(null); // memberId or "new"
  const [addOpen, setAddOpen] = useState(false);
  const [newMember, setNewMember] = useState({ ...EMPTY_MEMBER });
  const [newMemberPreview, setNewMemberPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = MOCK_MEMBERS.filter((m) =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.id.includes(search) || m.phone.includes(search)
  );

  const openCamera = (targetId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCameraTarget(targetId);
    setCameraOpen(true);
  };

  const handleCapture = (_blob: Blob, url: string) => {
    if (!cameraTarget) return;
    if (cameraTarget === "new") {
      setNewMemberPreview(url);
    } else {
      setImage(cameraTarget, url);
      toast.success("Profile photo updated");
    }
  };

  const handleAddSubmit = () => {
    if (!newMember.name.trim()) { toast.error("Name is required"); return; }
    const id = `GM${String(MOCK_MEMBERS.length + 1).padStart(3, "0")}`;
    MOCK_MEMBERS.push({
      id, name: newMember.name, phone: newMember.phone,
      plan: newMember.plan, fee: newMember.fee,
      status: newMember.status, batch: newMember.batch,
      image: null, dueDate: "", paidAmount: 0,
      lastPayment: "", joinDate: newMember.joinDate,
    });
    if (newMemberPreview) setImage(id, newMemberPreview);
    setAddOpen(false);
    setNewMember({ ...EMPTY_MEMBER });
    setNewMemberPreview(null);
    toast.success(`Member ${newMember.name} added (${id})`);
  };

  return (
    <div>
      <CameraCapture
        open={cameraOpen}
        onOpenChange={setCameraOpen}
        onCapture={handleCapture}
        title={cameraTarget === "new" ? "Member Photo" : "Update Profile Photo"}
      />

      {/* Add Member Modal */}
      {addOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,3,8,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setAddOpen(false)}>
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 22, padding: 28, width: "100%", maxWidth: 440, maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Add New Member</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 24 }}>Fill in member details and capture a profile photo</div>

            {/* Photo capture area */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                {newMemberPreview ? (
                  <img src={newMemberPreview} alt="Preview" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `2px solid ${COLORS.orange}` }} />
                ) : (
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: COLORS.darker, border: `2px dashed ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>📷</div>
                )}
                <button onClick={() => openCamera("new")} style={{
                  position: "absolute", bottom: -2, right: -2, width: 24, height: 24,
                  background: COLORS.orange, border: "none", borderRadius: "50%",
                  color: "#fff", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center"
                }}>+</button>
              </div>
              <div>
                <button onClick={() => openCamera("new")} style={{
                  background: COLORS.orange + "18", border: `1px solid ${COLORS.orange}44`,
                  borderRadius: 8, padding: "8px 14px", color: COLORS.orange,
                  cursor: "pointer", fontSize: 12, fontWeight: 600, marginBottom: 6, display: "block"
                }}>📷 Open Camera</button>
                <button onClick={() => fileInputRef.current?.click()} style={{
                  background: "transparent", border: `1px solid ${COLORS.border}`,
                  borderRadius: 8, padding: "8px 14px", color: COLORS.textMuted,
                  cursor: "pointer", fontSize: 12
                }}>⬆ Upload Photo</button>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" style={{ display: "none" }} onChange={(e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  const url = URL.createObjectURL(f); setNewMemberPreview(url);
                }} />
              </div>
            </div>

            {/* Form fields */}
            {[
              { label: "Full Name *", key: "name", placeholder: "e.g. Ahmed Raza", type: "text" },
              { label: "Phone", key: "phone", placeholder: "+92 300 0000000", type: "text" },
              { label: "Join Date", key: "joinDate", placeholder: "", type: "date" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: COLORS.textMuted, display: "block", marginBottom: 5 }}>{f.label}</label>
                <input
                  type={f.type}
                  value={(newMember as any)[f.key]}
                  onChange={(e) => setNewMember((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{ width: "100%", background: COLORS.darker, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px", color: COLORS.text, fontSize: 13, boxSizing: "border-box" as const }}
                />
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: COLORS.textMuted, display: "block", marginBottom: 5 }}>Plan</label>
                <select value={newMember.plan} onChange={(e) => { const p = PLANS.find((x) => x.name === e.target.value); setNewMember((prev) => ({ ...prev, plan: e.target.value, fee: p?.monthly ?? prev.fee })); }}
                  style={{ width: "100%", background: COLORS.darker, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 12px", color: COLORS.text, fontSize: 13 }}>
                  {PLANS.map((p) => <option key={p.name} value={p.name}>{p.name} — ₨{p.monthly.toLocaleString()}/mo</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: COLORS.textMuted, display: "block", marginBottom: 5 }}>Batch</label>
                <select value={newMember.batch} onChange={(e) => setNewMember((p) => ({ ...p, batch: e.target.value }))}
                  style={{ width: "100%", background: COLORS.darker, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 12px", color: COLORS.text, fontSize: 13 }}>
                  <option>Morning</option><option>Evening</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={() => { setAddOpen(false); setNewMemberPreview(null); setNewMember({ ...EMPTY_MEMBER }); }}
                style={{ flex: 1, background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 12, color: COLORS.textMuted, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={handleAddSubmit}
                style={{ flex: 2, background: COLORS.orange, border: "none", borderRadius: 10, padding: 12, color: "#fff", cursor: "pointer", fontWeight: 700 }}>+ Add Member</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap" as const, gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>Members</h1>
          <p style={{ color: COLORS.textMuted, margin: "4px 0 0", fontSize: 12 }}>{MOCK_MEMBERS.length} registered members</p>
        </div>
        <button onClick={() => setAddOpen(true)} style={{
          background: COLORS.orange, border: "none", borderRadius: 10, padding: "10px 20px",
          color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13
        }}>+ Add Member</button>
      </div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, ID, or phone..." style={{
        width: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`,
        borderRadius: 10, padding: "10px 14px", color: COLORS.text, fontSize: 13, marginBottom: 16, boxSizing: "border-box" as const
      }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((m) => (
          <div key={m.id} onClick={() => setSelected(selected === m.id ? null : m.id)} style={{
            background: COLORS.card, border: `1px solid ${selected === m.id ? COLORS.orange + "44" : COLORS.border}`,
            borderRadius: 14, padding: "14px 16px", cursor: "pointer", transition: "all 0.15s"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Avatar with camera overlay */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <Avatar name={m.name} size={46} memberId={m.id} />
                <button onClick={(e) => openCamera(m.id, e)} title="Change photo" style={{
                  position: "absolute", bottom: -2, right: -2, width: 20, height: 20,
                  background: images[m.id] ? COLORS.orange : COLORS.border,
                  border: "none", borderRadius: "50%", color: "#fff",
                  cursor: "pointer", fontSize: 10, display: "flex",
                  alignItems: "center", justifyContent: "center", lineHeight: 1
                }}>📷</button>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{m.name}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{m.id} · {m.phone}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" as const }}>
                  <Badge status={m.status} />
                  <span style={{ fontSize: 10, color: COLORS.orange, background: COLORS.orange + "15", padding: "2px 8px", borderRadius: 5 }}>{m.plan}</span>
                  <span style={{ fontSize: 10, color: COLORS.blue, background: COLORS.blue + "15", padding: "2px 8px", borderRadius: 5 }}>{m.batch}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" as const }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>₨{m.fee.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: COLORS.textMuted }}>/ month</div>
              </div>
            </div>
            {selected === m.id && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${COLORS.border}`, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
                {[
                  { label: "Join Date", value: m.joinDate },
                  { label: "Due Date", value: m.dueDate },
                  { label: "Last Payment", value: m.lastPayment },
                  { label: "Paid Amount", value: `₨${m.paidAmount.toLocaleString()}` },
                ].map((f) => (
                  <div key={f.label} style={{ background: COLORS.darker, borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{f.value}</div>
                  </div>
                ))}
                <button onClick={(e) => { e.stopPropagation(); toast.info("Fee collection — go to Fee Management tab"); }}
                  style={{ background: COLORS.orange, border: "none", borderRadius: 8, padding: "10px 16px", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>Collect Fee</button>
                <button onClick={(e) => openCamera(m.id, e)}
                  style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 16px", color: COLORS.text, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>📷 Update Photo</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeesPage() {
  const [payModal, setPayModal] = useState<typeof MOCK_MEMBERS[0] | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("Cash");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const feeStatus = (m: typeof MOCK_MEMBERS[0]) => {
    if (m.paidAmount >= m.fee) return "Paid";
    if (m.paidAmount > 0) return "Partial";
    const due = new Date(m.dueDate);
    if (due < new Date()) return "Overdue";
    return "Unpaid";
  };

  const totalRevenue = MOCK_MEMBERS.reduce((s, m) => s + m.paidAmount, 0);
  const pending = MOCK_MEMBERS.reduce((s, m) => s + Math.max(0, m.fee - m.paidAmount), 0);

  return (
    <div>
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 999, background: COLORS.green, color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600 }}>{toast}</div>
      )}
      {payModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: 28, width: "100%", maxWidth: 380 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Collect Payment</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 20 }}>{payModal.name} · {payModal.id}</div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Amount (₨)</label>
              <input value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder={`Due: ₨${Math.max(0, payModal.fee - payModal.paidAmount).toLocaleString()}`} style={{
                width: "100%", background: COLORS.darker, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px", color: COLORS.text, fontSize: 14, boxSizing: "border-box" as const
              }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Payment Method</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["Cash", "Online", "Card"].map((m) => (
                  <button key={m} onClick={() => setPayMethod(m)} style={{
                    flex: 1, background: payMethod === m ? COLORS.orange : COLORS.darker,
                    border: `1px solid ${payMethod === m ? COLORS.orange : COLORS.border}`,
                    borderRadius: 8, padding: "8px", color: payMethod === m ? "#fff" : COLORS.textMuted,
                    cursor: "pointer", fontSize: 12, fontWeight: 600
                  }}>{m}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setPayModal(null)} style={{ flex: 1, background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 12, color: COLORS.textMuted, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={() => { showToast(`✓ ₨${payAmount || "0"} collected from ${payModal.name}`); setPayModal(null); setPayAmount(""); }} style={{ flex: 2, background: COLORS.orange, border: "none", borderRadius: 10, padding: 12, color: "#fff", cursor: "pointer", fontWeight: 700 }}>Collect Payment</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>Fee Management</h1>
        <p style={{ color: COLORS.textMuted, margin: "4px 0 0", fontSize: 12 }}>Track payments, dues, and revenue</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 20 }}>
        <StatCard icon="₨" label="Total Collected" value={`₨${(totalRevenue / 1000).toFixed(0)}K`} color={COLORS.green} />
        <StatCard icon="⚠" label="Pending Dues" value={`₨${(pending / 1000).toFixed(0)}K`} color={COLORS.red} />
        <StatCard icon="✓" label="Fully Paid" value={MOCK_MEMBERS.filter((m) => m.paidAmount >= m.fee).length} color={COLORS.blue} />
        <StatCard icon="⏱" label="Overdue" value={MOCK_MEMBERS.filter((m) => { const d = new Date(m.dueDate); return m.paidAmount < m.fee && d < new Date(); }).length} color={COLORS.amber} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {MOCK_MEMBERS.map((m) => {
          const status = feeStatus(m);
          const due = Math.max(0, m.fee - m.paidAmount);
          const pct = Math.round((m.paidAmount / m.fee) * 100);
          return (
            <div key={m.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" as const }}>
                <Avatar name={m.name} size={42} memberId={m.id} />
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{m.id} · {m.plan} Plan · Due: {m.dueDate}</div>
                  <div style={{ marginTop: 6, height: 4, background: COLORS.border, borderRadius: 2, overflow: "hidden", maxWidth: 200 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: status === "Paid" ? COLORS.green : status === "Overdue" ? COLORS.red : COLORS.amber, borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2 }}>₨{m.paidAmount.toLocaleString()} of ₨{m.fee.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: "right" as const, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <Badge status={status} />
                  {due > 0 && <div style={{ fontSize: 12, color: COLORS.red, fontWeight: 600 }}>Due: ₨{due.toLocaleString()}</div>}
                  <button onClick={() => setPayModal(m)} style={{
                    background: COLORS.orange, border: "none", borderRadius: 8, padding: "6px 14px",
                    color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 11
                  }}>Collect</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlansPage() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>Membership Plans</h1>
          <p style={{ color: COLORS.textMuted, margin: "4px 0 0", fontSize: 12 }}>Configure and manage gym membership tiers</p>
        </div>
        <button style={{ background: COLORS.orange, border: "none", borderRadius: 10, padding: "10px 20px", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+ New Plan</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {PLANS.map((p) => (
          <div key={p.name} style={{
            background: COLORS.card, border: `1px solid ${p.color}33`,
            borderRadius: 20, padding: 24, position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: p.color + "10", borderRadius: "50%" }} />
            <div style={{ fontSize: 11, color: p.color, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" as const, marginBottom: 8 }}>{p.name}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.text, letterSpacing: -1 }}>
              ₨{p.monthly.toLocaleString()}
              <span style={{ fontSize: 13, fontWeight: 400, color: COLORS.textMuted }}>/mo</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "16px 0", padding: 12, background: COLORS.darker, borderRadius: 10 }}>
              {[["Quarterly", p.quarterly], ["Half-Yearly", p.halfYearly], ["Yearly", p.yearly]].map(([label, val]) => (
                <div key={String(label)}>
                  <div style={{ fontSize: 9, color: COLORS.textMuted }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>₨{Number(val).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
              {p.features.map((f) => (
                <div key={f} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: COLORS.textMuted }}>
                  <span style={{ color: p.color, fontWeight: 700 }}>✓</span> {f}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ flex: 1, background: p.color + "22", border: `1px solid ${p.color}44`, borderRadius: 8, padding: "8px", color: p.color, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>Edit</button>
              <button style={{ flex: 1, background: COLORS.darker, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px", color: COLORS.textMuted, cursor: "pointer", fontSize: 12 }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>Analytics</h1>
        <p style={{ color: COLORS.textMuted, margin: "4px 0 0", fontSize: 12 }}>Gym performance insights and trends</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 16 }}>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>Weekly Attendance Trend</div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 16 }}>This week vs last week</div>
          <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 120 }}>
            {WEEKLY_DATA.map((d, i) => {
              const maxP = 60;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 2, height: 100, justifyContent: "flex-end" }}>
                    <div style={{ width: "100%", height: (d.absent / maxP) * 100, background: COLORS.red + "44", borderRadius: "3px 3px 0 0" }} />
                    <div style={{ width: "100%", height: (d.present / maxP) * 100, background: COLORS.orange, borderRadius: "3px 3px 0 0" }} />
                  </div>
                  <span style={{ fontSize: 9, color: COLORS.textMuted }}>{d.day}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <div style={{ display: "flex", gap: 4, alignItems: "center", fontSize: 11, color: COLORS.textMuted }}>
              <div style={{ width: 8, height: 8, background: COLORS.orange, borderRadius: 2 }} /> Present
            </div>
            <div style={{ display: "flex", gap: 4, alignItems: "center", fontSize: 11, color: COLORS.textMuted }}>
              <div style={{ width: 8, height: 8, background: COLORS.red + "44", borderRadius: 2 }} /> Absent
            </div>
          </div>
        </div>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>Peak Hours</div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 16 }}>Member activity by hour</div>
          <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 100 }}>
            {PEAK_HOURS.map((h, i) => {
              const max = 55;
              const isPeak = h.count >= 35;
              return (
                <div key={i} title={`${h.hour}: ${h.count} members`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{ width: "100%", height: (h.count / max) * 90, background: isPeak ? COLORS.orange : COLORS.blue + "55", borderRadius: "2px 2px 0 0" }} />
                  <span style={{ fontSize: 7, color: COLORS.textFaint, transform: "rotate(-45deg)", transformOrigin: "center" }}>{h.hour}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>Revenue Breakdown</div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 16 }}>By membership plan</div>
          {PLANS.map((p) => {
            const members = MOCK_MEMBERS.filter((m) => m.plan === p.name);
            const rev = members.reduce((s, m) => s + m.paidAmount, 0);
            const total = MOCK_MEMBERS.reduce((s, m) => s + m.paidAmount, 0);
            const pct = total ? Math.round((rev / total) * 100) : 0;
            return (
              <div key={p.name} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: COLORS.textMuted }}>{p.name} ({members.length})</span>
                  <span style={{ color: COLORS.text, fontWeight: 600 }}>₨{rev.toLocaleString()} · {pct}%</span>
                </div>
                <div style={{ height: 8, background: COLORS.border, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: p.color, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
          <div style={{ paddingTop: 12, borderTop: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: COLORS.textMuted }}>Total Revenue</span>
              <span style={{ color: COLORS.green, fontWeight: 700 }}>₨{MOCK_MEMBERS.reduce((s, m) => s + m.paidAmount, 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        {[
          { label: "Avg Daily Attendance", value: "47", unit: "members/day", color: COLORS.orange },
          { label: "Monthly Revenue", value: "₨147K", unit: "this month", color: COLORS.green },
          { label: "Retention Rate", value: "87%", unit: "active members", color: COLORS.blue },
          { label: "New This Month", value: "5", unit: "new joinings", color: COLORS.purple },
        ].map((s) => (
          <div key={s.label} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted }}>{s.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminApp() {
  const [page, setPage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [memberImages, setMemberImages] = useState<Record<string, string>>({});
  const setImage = (id: string, url: string) => setMemberImages((p) => ({ ...p, [id]: url }));

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateShort = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const pageMap: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    attendance: <AttendancePage />,
    members: <MembersPage />,
    fees: <FeesPage />,
    plans: <PlansPage />,
    analytics: <AnalyticsPage />,
  };

  const NAV_ITEMS = [
    { id: "dashboard", icon: "⬡", label: "Dashboard" },
    { id: "attendance", icon: "✓", label: "Attendance" },
    { id: "members", icon: "◉", label: "Members" },
    { id: "fees", icon: "₨", label: "Fees" },
    { id: "plans", icon: "◈", label: "Plans" },
    { id: "analytics", icon: "◫", label: "Analytics" },
  ];

  return (
    <MemberImagesCtx.Provider value={{ images: memberImages, set: setImage }}>
    <div style={{ display: "flex", background: COLORS.dark, minHeight: "100vh", fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: COLORS.text }}>
      <Toaster position="top-right" richColors />
      <style>{`
        * { box-sizing: border-box; }
        input { outline: none; }
        button { outline: none; font-family: inherit; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        @media (max-width: 768px) {
          .admin-desktop-sidebar { display: none !important; }
          .admin-mobile-nav { display: flex !important; }
          .admin-main-content { padding: 12px !important; }
        }
        @media (min-width: 769px) {
          .admin-mobile-nav { display: none !important; }
        }
      `}</style>
      <div className="admin-desktop-sidebar">
        <Sidebar page={page} setPage={setPage} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{
          background: COLORS.darker, borderBottom: `1px solid ${COLORS.border}`,
          padding: "0 20px", height: 56, display: "flex", alignItems: "center",
          justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="admin-mobile-nav"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: "none", border: "none", color: COLORS.text, fontSize: 20, cursor: "pointer", display: "none" }}
            >☰</button>
            <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.orange, letterSpacing: 1 }}>IRON PULSE</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 11, color: COLORS.textMuted, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "4px 12px" }}>
              {dateShort} · {timeStr}
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.green }} />
            <Avatar name="Admin User" size={30} />
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="admin-mobile-nav" style={{ background: COLORS.darker, borderBottom: `1px solid ${COLORS.border}`, flexDirection: "column", padding: 12, gap: 4, display: "none" }}>
            {NAV_ITEMS.map((n) => (
              <button key={n.id} onClick={() => { setPage(n.id); setMobileMenuOpen(false); }} style={{
                background: page === n.id ? COLORS.orange + "18" : "transparent",
                border: `1px solid ${page === n.id ? COLORS.orange + "33" : "transparent"}`,
                borderRadius: 10, padding: "10px 16px", color: page === n.id ? COLORS.orange : COLORS.textMuted,
                cursor: "pointer", textAlign: "left", fontWeight: 600, fontSize: 13,
                display: "flex", gap: 10, alignItems: "center"
              }}><span>{n.icon}</span>{n.label}</button>
            ))}
          </div>
        )}
        <div className="admin-main-content" style={{ flex: 1, padding: "24px", overflowY: "auto", overflowX: "hidden" }}>
          {pageMap[page]}
        </div>
      </div>
    </div>
    </MemberImagesCtx.Provider>
  );
}
