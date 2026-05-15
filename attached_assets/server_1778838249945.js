/**
 * Iron Pulse Gym Management System — Express Backend
 * ====================================================
 * Full REST API with JWT auth, in-memory store (swap for
 * PostgreSQL / MongoDB with minimal changes).
 *
 * Install:  npm install
 * Run:      node server.js   or   npm start
 */

const express     = require("express");
const cors        = require("cors");
const crypto      = require("crypto");

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: "*", methods: ["GET","POST","PUT","PATCH","DELETE"] }));
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Simple helpers (no external libs) ────────────────────────────────────────
const uid   = () => crypto.randomBytes(6).toString("hex").toUpperCase();
const hash  = (s) => crypto.createHash("sha256").update(s).digest("hex");
const sign  = (payload) => {
  const header  = Buffer.from(JSON.stringify({ alg:"HS256", typ:"JWT" })).toString("base64url");
  const body    = Buffer.from(JSON.stringify({ ...payload, iat: Date.now() })).toString("base64url");
  const sig     = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
};
const verify = (token) => {
  try {
    const [header, body, sig] = token.split(".");
    const expected = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
    if (sig !== expected) return null;
    return JSON.parse(Buffer.from(body, "base64url").toString());
  } catch { return null; }
};

const JWT_SECRET = process.env.JWT_SECRET || "ironpulse_secret_2026";

// ── Auth Middleware ───────────────────────────────────────────────────────────
const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  const payload = verify(auth.slice(7));
  if (!payload) return res.status(401).json({ error: "Invalid token" });
  req.admin = payload;
  next();
};

// ── In-Memory Database ────────────────────────────────────────────────────────
const DB = {
  admins: [
    { id: "ADM001", name: "Admin User", email: "admin@ironpulse.com",
      passwordHash: hash("admin123"), role: "superadmin", createdAt: "2024-01-01" }
  ],

  members: [
    { id:"GM001", name:"Ahmed Raza",     phone:"+92 300 1234567", email:"ahmed@email.com",   plan:"Elite",   fee:9000,  status:"Active",  batch:"Morning", dueDate:"2026-06-01", paidAmount:9000, lastPayment:"2026-05-01", joinDate:"2024-01-15", weight:"78kg", height:"5'10\"", goal:"Muscle Gain",    trainer:"Ali Raza",    sessions:48, streak:12, createdAt:"2024-01-15" },
    { id:"GM002", name:"Fatima Khan",    phone:"+92 301 2345678", email:"fatima@email.com",  plan:"Pro",     fee:5000,  status:"Active",  batch:"Evening", dueDate:"2026-05-20", paidAmount:5000, lastPayment:"2026-04-20", joinDate:"2024-03-10", weight:"58kg", height:"5'4\"",  goal:"Weight Loss",    trainer:"Sara Khan",   sessions:32, streak:7,  createdAt:"2024-03-10" },
    { id:"GM003", name:"Usman Ali",      phone:"+92 302 3456789", email:"usman@email.com",   plan:"Starter", fee:2500,  status:"Active",  batch:"Morning", dueDate:"2026-05-15", paidAmount:0,    lastPayment:"2026-04-15", joinDate:"2024-06-01", weight:"82kg", height:"5'11\"", goal:"Fitness",        trainer:"—",           sessions:15, streak:3,  createdAt:"2024-06-01" },
    { id:"GM004", name:"Sana Malik",     phone:"+92 303 4567890", email:"sana@email.com",    plan:"Elite",   fee:9000,  status:"Active",  batch:"Evening", dueDate:"2026-06-10", paidAmount:9000, lastPayment:"2026-05-10", joinDate:"2023-11-20", weight:"54kg", height:"5'5\"",  goal:"Toning",         trainer:"Ali Raza",    sessions:72, streak:21, createdAt:"2023-11-20" },
    { id:"GM005", name:"Hassan Sheikh",  phone:"+92 304 5678901", email:"hassan@email.com",  plan:"Pro",     fee:5000,  status:"Expired", batch:"Morning", dueDate:"2026-05-01", paidAmount:2500, lastPayment:"2026-04-01", joinDate:"2024-02-14", weight:"90kg", height:"6'0\"",  goal:"Strength",       trainer:"Omar Farooq", sessions:28, streak:0,  createdAt:"2024-02-14" },
    { id:"GM006", name:"Ayesha Noor",    phone:"+92 305 6789012", email:"ayesha@email.com",  plan:"Starter", fee:2500,  status:"Active",  batch:"Evening", dueDate:"2026-06-05", paidAmount:2500, lastPayment:"2026-05-05", joinDate:"2024-04-22", weight:"60kg", height:"5'3\"",  goal:"Cardio",         trainer:"—",           sessions:20, streak:5,  createdAt:"2024-04-22" },
    { id:"GM007", name:"Bilal Ahmad",    phone:"+92 306 7890123", email:"bilal@email.com",   plan:"Elite",   fee:9000,  status:"Active",  batch:"Morning", dueDate:"2026-06-08", paidAmount:9000, lastPayment:"2026-05-08", joinDate:"2023-09-01", weight:"75kg", height:"5'9\"",  goal:"Performance",    trainer:"Ali Raza",    sessions:96, streak:30, createdAt:"2023-09-01" },
    { id:"GM008", name:"Zara Hussain",   phone:"+92 307 8901234", email:"zara@email.com",    plan:"Pro",     fee:5000,  status:"Active",  batch:"Evening", dueDate:"2026-05-25", paidAmount:0,    lastPayment:"2026-04-25", joinDate:"2024-07-11", weight:"55kg", height:"5'4\"",  goal:"Flexibility",    trainer:"Sara Khan",   sessions:18, streak:4,  createdAt:"2024-07-11" },
    { id:"GM009", name:"Kamran Iqbal",   phone:"+92 308 9012345", email:"kamran@email.com",  plan:"Pro",     fee:5000,  status:"Active",  batch:"Morning", dueDate:"2026-06-15", paidAmount:5000, lastPayment:"2026-05-15", joinDate:"2024-08-01", weight:"85kg", height:"6'1\"",  goal:"Muscle Gain",    trainer:"Ali Raza",    sessions:10, streak:2,  createdAt:"2024-08-01" },
    { id:"GM010", name:"Nadia Shaikh",   phone:"+92 309 0123456", email:"nadia@email.com",   plan:"Elite",   fee:9000,  status:"Active",  batch:"Evening", dueDate:"2026-06-20", paidAmount:9000, lastPayment:"2026-05-20", joinDate:"2023-12-01", weight:"52kg", height:"5'2\"",  goal:"Overall Health", trainer:"Sara Khan",   sessions:60, streak:18, createdAt:"2023-12-01" },
  ],

  trainers: [
    { id:"T001", name:"Ali Raza",    email:"ali@ironpulse.com",   phone:"+92 310 1111111", spec:"Strength & Powerlifting", exp:"7 yrs", rating:4.9, cert:"NASM Certified",       clients:12, sessions:142, status:"Active", joinDate:"2020-03-01" },
    { id:"T002", name:"Sara Khan",   email:"sara@ironpulse.com",  phone:"+92 310 2222222", spec:"Yoga & Functional Fitness", exp:"5 yrs", rating:4.8, cert:"ACE Certified",       clients:10, sessions:118, status:"Active", joinDate:"2021-01-15" },
    { id:"T003", name:"Omar Farooq", email:"omar@ironpulse.com",  phone:"+92 310 3333333", spec:"Cardio & Weight Loss",    exp:"4 yrs", rating:4.7, cert:"CrossFit L2",          clients:8,  sessions:89,  status:"Active", joinDate:"2022-06-01" },
    { id:"T004", name:"Nadia Sheikh",email:"nadia@ironpulse.com", phone:"+92 310 4444444", spec:"Nutrition & Wellness",    exp:"6 yrs", rating:4.9, cert:"Precision Nutrition",  clients:10, sessions:103, status:"Active", joinDate:"2021-09-01" },
  ],

  plans: [
    { id:"P001", name:"Starter", monthly:2500,  quarterly:7000,  halfYearly:13000, yearly:24000, color:"#3B82F6", features:["Gym Access (6AM–10PM)","Locker Room","Cardio Equipment","Free Parking","1 Guest Pass/Month"], active:true },
    { id:"P002", name:"Pro",     monthly:5000,  quarterly:14000, halfYearly:26000, yearly:50000, color:"#FF5A00", features:["Everything in Starter","All Group Classes","Diet Plan","Progress Tracking","Sauna & Steam Room","2 Guest Passes/Month"], active:true },
    { id:"P003", name:"Elite",   monthly:9000,  quarterly:25000, halfYearly:47000, yearly:90000, color:"#8B5CF6", features:["Everything in Pro","Dedicated Personal Trainer","Custom Nutrition Plan","Priority Booking","Full Spa Access","Unlimited Guest Passes","Body Composition Analysis"], active:true },
  ],

  attendance: [],   // { id, memberId, memberName, date, checkIn, checkInTime, checkOut, checkOutTime, batch }
  payments:   [],   // { id, memberId, memberName, amount, method, note, date, plan, collectedBy }
  leads:      [],   // { id, name, phone, plan, message, status, createdAt }
  settings: {
    gymName: "Iron Pulse Gym",
    city: "Lahore",
    address: "123 Gym Street, DHA Phase 5, Lahore",
    phone: "+92 42 111-496-001",
    email: "info@ironpulsegym.com",
    hours: "Mon–Sat: 5AM–11PM · Sun: 6AM–10PM",
    notifications: { sms: true, whatsapp: true, email: false }
  }
};

// ── Helper: fee status ────────────────────────────────────────────────────────
const feeStatus = (m) => {
  if (m.paidAmount >= m.fee)          return "Paid";
  if (m.paidAmount > 0)               return "Partial";
  if (new Date(m.dueDate) < new Date()) return "Overdue";
  return "Unpaid";
};

// ═════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ═════════════════════════════════════════════════════════════════════════════

// POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });
  const admin = DB.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
  if (!admin || admin.passwordHash !== hash(password))
    return res.status(401).json({ error: "Invalid credentials" });
  const token = sign({ id: admin.id, name: admin.name, email: admin.email, role: admin.role });
  res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
});

// POST /api/auth/change-password
app.post("/api/auth/change-password", requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = DB.admins.find(a => a.id === req.admin.id);
  if (!admin || admin.passwordHash !== hash(currentPassword))
    return res.status(400).json({ error: "Current password incorrect" });
  admin.passwordHash = hash(newPassword);
  res.json({ message: "Password updated" });
});

// GET /api/auth/me
app.get("/api/auth/me", requireAuth, (req, res) => {
  const admin = DB.admins.find(a => a.id === req.admin.id);
  if (!admin) return res.status(404).json({ error: "Not found" });
  const { passwordHash: _, ...safe } = admin;
  res.json(safe);
});

// ═════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════

// GET /api/dashboard
app.get("/api/dashboard", requireAuth, (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const todayAtt = DB.attendance.filter(a => a.date === today);
  const totalRev  = DB.members.reduce((s, m) => s + m.paidAmount, 0);
  const pending   = DB.members.reduce((s, m) => s + Math.max(0, m.fee - m.paidAmount), 0);
  const overdue   = DB.members.filter(m => feeStatus(m) === "Overdue");
  const expiring  = DB.members.filter(m => {
    const d = Math.round((new Date(m.dueDate) - new Date()) / 86400000);
    return d >= 0 && d <= 7;
  });
  const todayPayments = DB.payments.filter(p => p.date === today);
  const todayRevenue  = todayPayments.reduce((s, p) => s + p.amount, 0);

  res.json({
    totalMembers:   DB.members.length,
    activeMembers:  DB.members.filter(m => m.status === "Active").length,
    expiredMembers: DB.members.filter(m => m.status === "Expired").length,
    presentToday:   todayAtt.filter(a => a.checkIn).length,
    checkedOutToday: todayAtt.filter(a => a.checkOut).length,
    totalRevenue:   totalRev,
    pendingDues:    pending,
    todayRevenue,
    overdueCount:   overdue.length,
    overdueMembers: overdue.map(m => ({ id: m.id, name: m.name, plan: m.plan, due: m.fee - m.paidAmount })),
    expiringCount:  expiring.length,
    expiringMembers: expiring.map(m => ({
      id: m.id, name: m.name, plan: m.plan, batch: m.batch, dueDate: m.dueDate,
      daysLeft: Math.round((new Date(m.dueDate) - new Date()) / 86400000)
    })),
    planDistribution: ["Starter","Pro","Elite"].map(p => ({
      plan: p,
      count: DB.members.filter(m => m.plan === p).length,
      revenue: DB.members.filter(m => m.plan === p).reduce((s,m) => s+m.paidAmount, 0)
    })),
    recentPayments: DB.payments.slice(-6).reverse()
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// MEMBERS
// ═════════════════════════════════════════════════════════════════════════════

// GET /api/members  ?status=&plan=&batch=&search=
app.get("/api/members", requireAuth, (req, res) => {
  let list = [...DB.members];
  const { status, plan, batch, search } = req.query;
  if (status && status !== "All") list = list.filter(m => m.status === status);
  if (plan   && plan   !== "All") list = list.filter(m => m.plan   === plan);
  if (batch  && batch  !== "All") list = list.filter(m => m.batch  === batch);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q)   ||
      m.phone.includes(q) ||
      (m.email || "").toLowerCase().includes(q)
    );
  }
  res.json(list.map(m => ({ ...m, feeStatus: feeStatus(m) })));
});

// GET /api/members/:id
app.get("/api/members/:id", requireAuth, (req, res) => {
  const m = DB.members.find(m => m.id === req.params.id);
  if (!m) return res.status(404).json({ error: "Member not found" });
  res.json({ ...m, feeStatus: feeStatus(m) });
});

// POST /api/members
app.post("/api/members", requireAuth, (req, res) => {
  const { name, phone, email, plan, batch, goal, trainer, weight, height } = req.body;
  if (!name || !phone || !plan) return res.status(400).json({ error: "name, phone, plan required" });
  const planData = DB.plans.find(p => p.name === plan);
  if (!planData) return res.status(400).json({ error: "Invalid plan" });
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setMonth(dueDate.getMonth() + 1);
  const member = {
    id: "GM" + String(DB.members.length + 1).padStart(3,"0"),
    name, phone, email: email || "",
    plan, fee: planData.monthly, status: "Active",
    batch: batch || "Morning",
    dueDate: dueDate.toISOString().split("T")[0],
    paidAmount: 0, lastPayment: null,
    joinDate: today.toISOString().split("T")[0],
    weight: weight || "", height: height || "",
    goal: goal || "Fitness",
    trainer: trainer || "—",
    sessions: 0, streak: 0,
    createdAt: today.toISOString()
  };
  DB.members.push(member);
  res.status(201).json({ ...member, feeStatus: feeStatus(member) });
});

// PUT /api/members/:id
app.put("/api/members/:id", requireAuth, (req, res) => {
  const idx = DB.members.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Member not found" });
  const allowed = ["name","phone","email","plan","batch","goal","trainer","weight","height","status"];
  allowed.forEach(k => { if (req.body[k] !== undefined) DB.members[idx][k] = req.body[k]; });
  // Update fee if plan changed
  if (req.body.plan) {
    const planData = DB.plans.find(p => p.name === req.body.plan);
    if (planData) DB.members[idx].fee = planData.monthly;
  }
  const m = DB.members[idx];
  res.json({ ...m, feeStatus: feeStatus(m) });
});

// PATCH /api/members/:id/freeze
app.patch("/api/members/:id/freeze", requireAuth, (req, res) => {
  const m = DB.members.find(m => m.id === req.params.id);
  if (!m) return res.status(404).json({ error: "Not found" });
  m.status = m.status === "Active" ? "Frozen" : "Active";
  res.json({ id: m.id, status: m.status });
});

// PATCH /api/members/:id/renew
app.patch("/api/members/:id/renew", requireAuth, (req, res) => {
  const m = DB.members.find(m => m.id === req.params.id);
  if (!m) return res.status(404).json({ error: "Not found" });
  const due = new Date();
  due.setMonth(due.getMonth() + 1);
  m.status  = "Active";
  m.dueDate = due.toISOString().split("T")[0];
  res.json({ id: m.id, status: m.status, dueDate: m.dueDate });
});

// DELETE /api/members/:id
app.delete("/api/members/:id", requireAuth, (req, res) => {
  const idx = DB.members.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  DB.members.splice(idx, 1);
  res.json({ message: "Member deleted" });
});

// ═════════════════════════════════════════════════════════════════════════════
// ATTENDANCE
// ═════════════════════════════════════════════════════════════════════════════

// GET /api/attendance?date=YYYY-MM-DD
app.get("/api/attendance", requireAuth, (req, res) => {
  const date = req.query.date || new Date().toISOString().split("T")[0];
  const records = DB.attendance.filter(a => a.date === date);
  // Merge with all members
  const result = DB.members.map(m => {
    const rec = records.find(r => r.memberId === m.id) || null;
    return {
      memberId:    m.id,
      memberName:  m.name,
      plan:        m.plan,
      batch:       m.batch,
      status:      m.status,
      date,
      checkIn:     rec?.checkIn     || false,
      checkInTime: rec?.checkInTime || null,
      checkOut:    rec?.checkOut    || false,
      checkOutTime: rec?.checkOutTime || null,
      attendanceStatus: rec?.checkIn && rec?.checkOut ? "Completed"
                       : rec?.checkIn ? "Checked In"
                       : "Absent"
    };
  });
  res.json(result);
});

// POST /api/attendance/checkin
app.post("/api/attendance/checkin", requireAuth, (req, res) => {
  const { memberId } = req.body;
  if (!memberId) return res.status(400).json({ error: "memberId required" });
  const member = DB.members.find(m => m.id === memberId);
  if (!member) return res.status(404).json({ error: "Member not found" });
  const date = new Date().toISOString().split("T")[0];
  const time = new Date().toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
  let rec = DB.attendance.find(a => a.memberId === memberId && a.date === date);
  if (!rec) {
    rec = { id: uid(), memberId, memberName: member.name, batch: member.batch, date, checkIn: false, checkInTime: null, checkOut: false, checkOutTime: null };
    DB.attendance.push(rec);
  }
  rec.checkIn     = true;
  rec.checkInTime = time;
  member.sessions = (member.sessions || 0) + 1;
  res.json(rec);
});

// POST /api/attendance/checkout
app.post("/api/attendance/checkout", requireAuth, (req, res) => {
  const { memberId } = req.body;
  const date = new Date().toISOString().split("T")[0];
  const time = new Date().toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
  const rec  = DB.attendance.find(a => a.memberId === memberId && a.date === date);
  if (!rec || !rec.checkIn) return res.status(400).json({ error: "Must check in first" });
  rec.checkOut     = true;
  rec.checkOutTime = time;
  res.json(rec);
});

// POST /api/attendance/mark-all  — mark all active members present
app.post("/api/attendance/mark-all", requireAuth, (req, res) => {
  const date = new Date().toISOString().split("T")[0];
  const time = new Date().toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
  let count = 0;
  DB.members.filter(m => m.status === "Active").forEach(m => {
    let rec = DB.attendance.find(a => a.memberId === m.id && a.date === date);
    if (!rec) {
      rec = { id: uid(), memberId: m.id, memberName: m.name, batch: m.batch, date, checkIn: false, checkInTime: null, checkOut: false, checkOutTime: null };
      DB.attendance.push(rec);
    }
    if (!rec.checkIn) {
      rec.checkIn     = true;
      rec.checkInTime = time;
      m.sessions = (m.sessions || 0) + 1;
      count++;
    }
  });
  res.json({ message: `${count} members marked present`, count });
});

// GET /api/attendance/stats?days=7
app.get("/api/attendance/stats", requireAuth, (req, res) => {
  const days  = parseInt(req.query.days) || 7;
  const stats = [];
  for (let i = days - 1; i >= 0; i--) {
    const d    = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().split("T")[0];
    const dayRecs = DB.attendance.filter(a => a.date === date);
    stats.push({
      date,
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      present: dayRecs.filter(a => a.checkIn).length,
      absent:  DB.members.length - dayRecs.filter(a => a.checkIn).length
    });
  }
  res.json(stats);
});

// ═════════════════════════════════════════════════════════════════════════════
// PAYMENTS / FEES
// ═════════════════════════════════════════════════════════════════════════════

// GET /api/payments?memberId=&status=
app.get("/api/payments", requireAuth, (req, res) => {
  let list = [...DB.payments];
  if (req.query.memberId) list = list.filter(p => p.memberId === req.query.memberId);
  res.json(list.sort((a,b) => new Date(b.date) - new Date(a.date)));
});

// POST /api/payments
app.post("/api/payments", requireAuth, (req, res) => {
  const { memberId, amount, method, note } = req.body;
  if (!memberId || !amount) return res.status(400).json({ error: "memberId and amount required" });
  const member = DB.members.find(m => m.id === memberId);
  if (!member) return res.status(404).json({ error: "Member not found" });
  const parsed = parseFloat(amount);
  if (isNaN(parsed) || parsed <= 0) return res.status(400).json({ error: "Invalid amount" });
  member.paidAmount  = (member.paidAmount || 0) + parsed;
  member.lastPayment = new Date().toISOString().split("T")[0];
  // Extend due date if fully paid
  if (member.paidAmount >= member.fee) {
    const due = new Date();
    due.setMonth(due.getMonth() + 1);
    member.dueDate = due.toISOString().split("T")[0];
    member.status  = "Active";
  }
  const payment = {
    id: "PAY" + uid(), memberId, memberName: member.name,
    amount: parsed, method: method || "Cash",
    note: note || "", plan: member.plan,
    date: new Date().toISOString().split("T")[0],
    collectedBy: req.admin.name
  };
  DB.payments.push(payment);
  res.status(201).json({ payment, member: { ...member, feeStatus: feeStatus(member) } });
});

// GET /api/fees/summary
app.get("/api/fees/summary", requireAuth, (req, res) => {
  const totalCollected = DB.members.reduce((s, m) => s + m.paidAmount, 0);
  const totalPending   = DB.members.reduce((s, m) => s + Math.max(0, m.fee - m.paidAmount), 0);
  res.json({
    totalCollected, totalPending,
    fullyPaid:   DB.members.filter(m => feeStatus(m) === "Paid").length,
    partial:     DB.members.filter(m => feeStatus(m) === "Partial").length,
    unpaid:      DB.members.filter(m => feeStatus(m) === "Unpaid").length,
    overdue:     DB.members.filter(m => feeStatus(m) === "Overdue").length,
    members: DB.members.map(m => ({
      id: m.id, name: m.name, plan: m.plan, batch: m.batch,
      fee: m.fee, paidAmount: m.paidAmount, dueDate: m.dueDate,
      lastPayment: m.lastPayment, feeStatus: feeStatus(m),
      outstanding: Math.max(0, m.fee - m.paidAmount)
    }))
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// TRAINERS
// ═════════════════════════════════════════════════════════════════════════════

// GET /api/trainers
app.get("/api/trainers", requireAuth, (req, res) => {
  res.json(DB.trainers.map(t => ({
    ...t,
    assignedMembers: DB.members
      .filter(m => m.trainer === t.name)
      .map(m => ({ id: m.id, name: m.name, plan: m.plan, goal: m.goal }))
  })));
});

// POST /api/trainers
app.post("/api/trainers", requireAuth, (req, res) => {
  const { name, email, phone, spec, exp, cert } = req.body;
  if (!name || !spec) return res.status(400).json({ error: "name and spec required" });
  const trainer = {
    id: "T" + String(DB.trainers.length + 1).padStart(3,"0"),
    name, email: email||"", phone: phone||"", spec,
    exp: exp||"1 yr", rating: 4.5, cert: cert||"",
    clients: 0, sessions: 0, status: "Active",
    joinDate: new Date().toISOString().split("T")[0]
  };
  DB.trainers.push(trainer);
  res.status(201).json(trainer);
});

// PUT /api/trainers/:id
app.put("/api/trainers/:id", requireAuth, (req, res) => {
  const idx = DB.trainers.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const allowed = ["name","email","phone","spec","exp","cert","rating","status"];
  allowed.forEach(k => { if (req.body[k] !== undefined) DB.trainers[idx][k] = req.body[k]; });
  res.json(DB.trainers[idx]);
});

// DELETE /api/trainers/:id
app.delete("/api/trainers/:id", requireAuth, (req, res) => {
  const idx = DB.trainers.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  DB.trainers.splice(idx, 1);
  res.json({ message: "Trainer deleted" });
});

// ═════════════════════════════════════════════════════════════════════════════
// PLANS
// ═════════════════════════════════════════════════════════════════════════════

app.get("/api/plans", (_req, res) => res.json(DB.plans));  // public

app.post("/api/plans", requireAuth, (req, res) => {
  const { name, monthly, quarterly, halfYearly, yearly, features, color } = req.body;
  if (!name || !monthly) return res.status(400).json({ error: "name and monthly required" });
  const plan = {
    id: "P" + String(DB.plans.length + 1).padStart(3,"0"),
    name, monthly: +monthly, quarterly: +(quarterly||0),
    halfYearly: +(halfYearly||0), yearly: +(yearly||0),
    color: color||"#3B82F6", features: features||[], active: true
  };
  DB.plans.push(plan);
  res.status(201).json(plan);
});

app.put("/api/plans/:id", requireAuth, (req, res) => {
  const idx = DB.plans.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  Object.assign(DB.plans[idx], req.body);
  res.json(DB.plans[idx]);
});

app.delete("/api/plans/:id", requireAuth, (req, res) => {
  const idx = DB.plans.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  DB.plans.splice(idx, 1);
  res.json({ message: "Plan deleted" });
});

// ═════════════════════════════════════════════════════════════════════════════
// ANALYTICS
// ═════════════════════════════════════════════════════════════════════════════

app.get("/api/analytics", requireAuth, (_req, res) => {
  const totalRev = DB.members.reduce((s, m) => s + m.paidAmount, 0);
  // Monthly revenue (last 7 months simulated)
  const months = ["Nov","Dec","Jan","Feb","Mar","Apr","May"];
  const revValues = [92000,110000,128000,115000,142000,158000, totalRev];
  const monthlyRevenue = months.map((m, i) => ({ month: m, revenue: revValues[i] }));
  // Peak hours
  const peakHours = [
    {hour:"6AM",count:12},{hour:"7AM",count:28},{hour:"8AM",count:35},
    {hour:"9AM",count:22},{hour:"10AM",count:15},{hour:"11AM",count:10},
    {hour:"12PM",count:8},{hour:"1PM",count:6},{hour:"4PM",count:18},
    {hour:"5PM",count:38},{hour:"6PM",count:55},{hour:"7PM",count:48},
    {hour:"8PM",count:32},{hour:"9PM",count:15},
  ];
  res.json({
    totalRevenue: totalRev,
    avgDailyAttendance: 47,
    retentionRate: "87%",
    churnRate: "3.2%",
    newMembersThisMonth: 5,
    monthlyRevenue,
    peakHours,
    planRevenue: DB.plans.map(p => ({
      plan: p.name, color: p.color,
      members: DB.members.filter(m => m.plan === p.name).length,
      revenue: DB.members.filter(m => m.plan === p.name).reduce((s,m)=>s+m.paidAmount,0)
    })),
    trainerPerformance: DB.trainers.map(t => ({
      id: t.id, name: t.name, spec: t.spec,
      rating: t.rating, clients: t.clients, sessions: t.sessions
    }))
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// LEADS (Contact form / Free trial registrations)
// ═════════════════════════════════════════════════════════════════════════════

// POST /api/leads  — public (no auth)
app.post("/api/leads", (req, res) => {
  const { name, phone, plan, message } = req.body;
  if (!name || !phone) return res.status(400).json({ error: "name and phone required" });
  const lead = {
    id: "LEAD" + uid(), name, phone, plan: plan||"Pro",
    message: message||"", status: "New",
    createdAt: new Date().toISOString()
  };
  DB.leads.push(lead);
  res.status(201).json({ message: "Registration received! We'll contact you within 2 hours.", lead });
});

// GET /api/leads  — admin only
app.get("/api/leads", requireAuth, (_req, res) => {
  res.json(DB.leads.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// PATCH /api/leads/:id/status
app.patch("/api/leads/:id/status", requireAuth, (req, res) => {
  const lead = DB.leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: "Not found" });
  lead.status = req.body.status || lead.status;
  res.json(lead);
});

// ═════════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═════════════════════════════════════════════════════════════════════════════

app.get("/api/settings", requireAuth, (_req, res) => res.json(DB.settings));

app.put("/api/settings", requireAuth, (req, res) => {
  Object.assign(DB.settings, req.body);
  res.json(DB.settings);
});

// ═════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═════════════════════════════════════════════════════════════════════════════

// POST /api/notify/remind/:memberId
app.post("/api/notify/remind/:memberId", requireAuth, (req, res) => {
  const m = DB.members.find(m => m.id === req.params.memberId);
  if (!m) return res.status(404).json({ error: "Not found" });
  // In production: send SMS/WhatsApp via Twilio, etc.
  res.json({ message: `Reminder queued for ${m.name} (${m.phone})`, memberId: m.id });
});

// POST /api/notify/remind-all-overdue
app.post("/api/notify/remind-all-overdue", requireAuth, (req, res) => {
  const overdue = DB.members.filter(m => feeStatus(m) === "Overdue");
  // In production: bulk SMS
  res.json({ message: `Reminders sent to ${overdue.length} overdue members`, count: overdue.length });
});

// ═════════════════════════════════════════════════════════════════════════════
// REPORTS / EXPORT
// ═════════════════════════════════════════════════════════════════════════════

// GET /api/reports/members-csv
app.get("/api/reports/members-csv", requireAuth, (_req, res) => {
  const header = "ID,Name,Phone,Email,Plan,Status,Batch,Fee,Paid,Outstanding,Due Date,Join Date,Goal,Trainer,Sessions,Streak\n";
  const rows = DB.members.map(m =>
    [m.id, m.name, m.phone, m.email||"", m.plan, m.status, m.batch,
     m.fee, m.paidAmount, Math.max(0,m.fee-m.paidAmount),
     m.dueDate, m.joinDate, m.goal, m.trainer, m.sessions, m.streak].join(",")
  ).join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=members.csv");
  res.send(header + rows);
});

// GET /api/reports/payments-csv
app.get("/api/reports/payments-csv", requireAuth, (_req, res) => {
  const header = "ID,Member ID,Member Name,Amount,Method,Plan,Date,Note,Collected By\n";
  const rows = DB.payments.map(p =>
    [p.id, p.memberId, p.memberName, p.amount, p.method,
     p.plan, p.date, p.note, p.collectedBy].join(",")
  ).join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=payments.csv");
  res.send(header + rows);
});

// ─── Health ───────────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status:"ok", uptime: process.uptime() }));

// 404
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

// Start
app.listen(PORT, () => {
  console.log(`\n🔥 Iron Pulse API running at http://localhost:${PORT}`);
  console.log(`📖 Default login: admin@ironpulse.com / admin123\n`);
});
