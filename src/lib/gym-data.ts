export const CLASSES = [
  { name: "Weight Lifting", tag: "STRENGTH", duration: "60 min", calories: "450 kcal", level: "Advanced", trainer: "Ali Hassan", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80" },
  { name: "HIIT & Cardio", tag: "CARDIO", duration: "45 min", calories: "600 kcal", level: "All Levels", trainer: "Omar Farooq", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=80" },
  { name: "Yoga & Recovery", tag: "WELLNESS", duration: "60 min", calories: "200 kcal", level: "Beginner", trainer: "Sara Ahmed", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=80" },
  { name: "CrossFit", tag: "HIIT", duration: "50 min", calories: "700 kcal", level: "Advanced", trainer: "Ali Hassan", img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&q=80" },
  { name: "Functional Training", tag: "CORE", duration: "45 min", calories: "380 kcal", level: "Intermediate", trainer: "Sara Ahmed", img: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&q=80" },
  { name: "Personal Training", tag: "VIP", duration: "60 min", calories: "500 kcal", level: "Custom", trainer: "Your Choice", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=80" },
];

export const TRAINERS = [
  { name: "Sara Khan", role: "Yoga & Wellness", exp: "5 yrs", rating: 4.9, clients: 18, cert: "ACE Certified", img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80" },
  { name: "Ali Raza", role: "Strength & Powerlifting", exp: "7 yrs", rating: 4.8, clients: 22, cert: "NASM Certified", img: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&q=80" },
  { name: "Omar Farooq", role: "Cardio & HIIT", exp: "4 yrs", rating: 4.7, clients: 14, cert: "CrossFit L2", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80" },
  { name: "Nadia Shaikh", role: "Nutrition & Wellness", exp: "6 yrs", rating: 4.9, clients: 20, cert: "Precision Nutrition", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80" },
];

export const PLANS = [
  { name: "STARTER", price: 2500, period: "mo", tag: null, features: ["Gym Access (6AM–10PM)", "Locker Room", "Cardio Equipment", "Free Parking", "1 Guest Pass / Month"] },
  { name: "PRO", price: 5000, period: "mo", tag: "POPULAR", features: ["Everything in Starter", "All Group Classes", "Personalized Diet Plan", "Progress Tracking App", "Sauna & Steam Room", "2 Guest Passes / Month"] },
  { name: "ELITE", price: 9000, period: "mo", tag: "BEST VALUE", features: ["Everything in Pro", "Dedicated Personal Trainer", "Custom Nutrition Plan", "Priority Booking", "Full Spa Access", "Unlimited Guest Passes", "Body Composition Analysis"] },
];

export const TESTIMONIALS = [
  { name: "Ayesha Noor", plan: "Pro Member", text: "Iron Pulse completely transformed my life. The trainers are world-class and the equipment is top-notch. Lost 18kg in 6 months.", stars: 5, img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80" },
  { name: "Bilal Ahmad", plan: "Elite Member", text: "The personal training sessions here are incredible. My strength has doubled and I feel better than I ever have. Best investment.", stars: 5, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { name: "Sana Malik", plan: "Elite Member", text: "The atmosphere at Iron Pulse is electric. Everyone is motivated and the staff genuinely cares about your progress.", stars: 5, img: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=200&q=80" },
];

export const SCHEDULE = [
  { time: "06:00", class: "Morning Yoga", trainer: "Sara Khan", batch: "Morning", spots: 8, level: "Beginner" },
  { time: "07:30", class: "Weight Training", trainer: "Ali Raza", batch: "Morning", spots: 12, level: "Advanced" },
  { time: "09:00", class: "HIIT Cardio", trainer: "Omar Farooq", batch: "Morning", spots: 15, level: "All Levels" },
  { time: "17:00", class: "Functional Fit", trainer: "Sara Khan", batch: "Evening", spots: 10, level: "Intermediate" },
  { time: "18:30", class: "CrossFit", trainer: "Ali Raza", batch: "Evening", spots: 18, level: "Advanced" },
  { time: "20:00", class: "Yoga & Recovery", trainer: "Nadia Shaikh", batch: "Evening", spots: 12, level: "Beginner" },
];

export type Member = {
  id: string; name: string; phone: string; plan: string; fee: number;
  status: "Active" | "Expired" | "Frozen"; batch: "Morning" | "Evening";
  dueDate: string; paidAmount: number; lastPayment: string; joinDate: string;
  goal: string; trainer: string; streak: number; sessions: number;
};

export const MEMBERS: Member[] = [
  { id: "GM001", name: "Ahmed Raza", phone: "+92 300 1234567", plan: "Elite", fee: 9000, status: "Active", batch: "Morning", dueDate: "2026-06-01", paidAmount: 9000, lastPayment: "2026-05-01", joinDate: "2024-01-15", goal: "Muscle Gain", trainer: "Ali Raza", streak: 12, sessions: 48 },
  { id: "GM002", name: "Fatima Khan", phone: "+92 301 2345678", plan: "Pro", fee: 5000, status: "Active", batch: "Evening", dueDate: "2026-05-20", paidAmount: 5000, lastPayment: "2026-04-20", joinDate: "2024-03-10", goal: "Weight Loss", trainer: "Sara Khan", streak: 7, sessions: 32 },
  { id: "GM003", name: "Usman Ali", phone: "+92 302 3456789", plan: "Starter", fee: 2500, status: "Active", batch: "Morning", dueDate: "2026-05-15", paidAmount: 0, lastPayment: "2026-04-15", joinDate: "2024-06-01", goal: "Fitness", trainer: "—", streak: 3, sessions: 15 },
  { id: "GM004", name: "Sana Malik", phone: "+92 303 4567890", plan: "Elite", fee: 9000, status: "Active", batch: "Evening", dueDate: "2026-06-10", paidAmount: 9000, lastPayment: "2026-05-10", joinDate: "2023-11-20", goal: "Toning", trainer: "Ali Raza", streak: 21, sessions: 72 },
  { id: "GM005", name: "Hassan Sheikh", phone: "+92 304 5678901", plan: "Pro", fee: 5000, status: "Expired", batch: "Morning", dueDate: "2026-05-01", paidAmount: 2500, lastPayment: "2026-04-01", joinDate: "2024-02-14", goal: "Strength", trainer: "Omar Farooq", streak: 0, sessions: 28 },
  { id: "GM006", name: "Ayesha Noor", phone: "+92 305 6789012", plan: "Starter", fee: 2500, status: "Active", batch: "Evening", dueDate: "2026-06-05", paidAmount: 2500, lastPayment: "2026-05-05", joinDate: "2024-04-22", goal: "Cardio", trainer: "—", streak: 5, sessions: 20 },
  { id: "GM007", name: "Bilal Ahmad", phone: "+92 306 7890123", plan: "Elite", fee: 9000, status: "Active", batch: "Morning", dueDate: "2026-06-08", paidAmount: 9000, lastPayment: "2026-05-08", joinDate: "2023-09-01", goal: "Performance", trainer: "Ali Raza", streak: 30, sessions: 96 },
  { id: "GM008", name: "Zara Hussain", phone: "+92 307 8901234", plan: "Pro", fee: 5000, status: "Active", batch: "Evening", dueDate: "2026-05-25", paidAmount: 0, lastPayment: "2026-04-25", joinDate: "2024-07-11", goal: "Flexibility", trainer: "Sara Khan", streak: 4, sessions: 18 },
  { id: "GM009", name: "Kamran Iqbal", phone: "+92 308 9012345", plan: "Pro", fee: 5000, status: "Active", batch: "Morning", dueDate: "2026-06-15", paidAmount: 5000, lastPayment: "2026-05-15", joinDate: "2024-08-01", goal: "Muscle Gain", trainer: "Ali Raza", streak: 2, sessions: 10 },
  { id: "GM010", name: "Nadia Shaikh", phone: "+92 309 0123456", plan: "Elite", fee: 9000, status: "Active", batch: "Evening", dueDate: "2026-06-20", paidAmount: 9000, lastPayment: "2026-05-20", joinDate: "2023-12-01", goal: "Overall Health", trainer: "Sara Khan", streak: 18, sessions: 60 },
];

export const WEEKLY_ATT = [{ day: "Mon", v: 42 }, { day: "Tue", v: 38 }, { day: "Wed", v: 55 }, { day: "Thu", v: 60 }, { day: "Fri", v: 48 }, { day: "Sat", v: 52 }, { day: "Sun", v: 30 }];
export const MONTHLY_REV = [{ m: "Nov", v: 92 }, { m: "Dec", v: 110 }, { m: "Jan", v: 128 }, { m: "Feb", v: 115 }, { m: "Mar", v: 142 }, { m: "Apr", v: 158 }, { m: "May", v: 147 }];

export const feeStatus = (m: Member) => {
  if (m.paidAmount >= m.fee) return "Paid";
  if (m.paidAmount > 0) return "Partial";
  if (new Date(m.dueDate) < new Date()) return "Overdue";
  return "Unpaid";
};