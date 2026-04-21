import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Flame, Drumstick, Wheat, Droplet, Target, TrendingUp,
  Mic, Camera, Barcode, Star, Clock, ChevronRight, ChevronLeft, X,
  Check, Settings, Trophy, Flag, Sparkles, Activity, Moon, Sun,
  Calendar, BarChart3, Heart, Zap, Award, Edit3, Trash2, Copy,
  Home, BookOpen, User, ChevronDown, Minus
} from 'lucide-react';

// ============ FOOD DATABASE ============
const FOOD_DB = [
  // Proteins
  { id: 1, name: 'Chicken Breast', brand: 'Generic', per: 100, unit: 'g', kcal: 165, p: 31, c: 0, f: 3.6, fiber: 0, sugar: 0, sodium: 74, emoji: '🍗' },
  { id: 2, name: 'Greek Yogurt', brand: 'Fage 0%', per: 170, unit: 'g', kcal: 100, p: 17, c: 6, f: 0, fiber: 0, sugar: 6, sodium: 65, emoji: '🥛' },
  { id: 3, name: 'Whole Eggs', brand: 'Large', per: 50, unit: 'g', kcal: 72, p: 6.3, c: 0.4, f: 4.8, fiber: 0, sugar: 0.2, sodium: 71, emoji: '🥚' },
  { id: 4, name: 'Salmon Fillet', brand: 'Atlantic', per: 100, unit: 'g', kcal: 208, p: 20, c: 0, f: 13, fiber: 0, sugar: 0, sodium: 59, emoji: '🐟' },
  { id: 5, name: 'Tuna', brand: 'Canned in water', per: 100, unit: 'g', kcal: 116, p: 26, c: 0, f: 1, fiber: 0, sugar: 0, sodium: 247, emoji: '🐟' },
  { id: 6, name: 'Ground Beef 93/7', brand: 'Lean', per: 100, unit: 'g', kcal: 152, p: 21, c: 0, f: 7, fiber: 0, sugar: 0, sodium: 66, emoji: '🥩' },
  { id: 7, name: 'Tofu Firm', brand: 'Generic', per: 100, unit: 'g', kcal: 144, p: 17, c: 3, f: 9, fiber: 2, sugar: 0.6, sodium: 14, emoji: '🟫' },
  { id: 8, name: 'Whey Protein', brand: 'Optimum', per: 30, unit: 'g', kcal: 120, p: 24, c: 3, f: 1.5, fiber: 1, sugar: 1, sodium: 50, emoji: '🥤' },
  // Carbs
  { id: 9, name: 'White Rice Cooked', brand: 'Generic', per: 100, unit: 'g', kcal: 130, p: 2.7, c: 28, f: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1, emoji: '🍚' },
  { id: 10, name: 'Brown Rice Cooked', brand: 'Generic', per: 100, unit: 'g', kcal: 123, p: 2.7, c: 26, f: 1, fiber: 1.8, sugar: 0.4, sodium: 4, emoji: '🍚' },
  { id: 11, name: 'Oatmeal', brand: 'Rolled oats', per: 40, unit: 'g', kcal: 150, p: 5, c: 27, f: 3, fiber: 4, sugar: 1, sodium: 0, emoji: '🥣' },
  { id: 12, name: 'Sourdough Bread', brand: 'Generic', per: 50, unit: 'g', kcal: 130, p: 5, c: 25, f: 1, fiber: 2, sugar: 1, sodium: 290, emoji: '🍞' },
  { id: 13, name: 'Sweet Potato', brand: 'Baked', per: 100, unit: 'g', kcal: 90, p: 2, c: 21, f: 0.1, fiber: 3.3, sugar: 6.8, sodium: 36, emoji: '🍠' },
  { id: 14, name: 'Pasta Cooked', brand: 'Durum wheat', per: 100, unit: 'g', kcal: 158, p: 5.8, c: 31, f: 0.9, fiber: 1.8, sugar: 0.6, sodium: 1, emoji: '🍝' },
  { id: 15, name: 'Banana', brand: 'Medium', per: 118, unit: 'g', kcal: 105, p: 1.3, c: 27, f: 0.4, fiber: 3.1, sugar: 14, sodium: 1, emoji: '🍌' },
  { id: 16, name: 'Apple', brand: 'Medium', per: 182, unit: 'g', kcal: 95, p: 0.5, c: 25, f: 0.3, fiber: 4.4, sugar: 19, sodium: 2, emoji: '🍎' },
  { id: 17, name: 'Blueberries', brand: 'Fresh', per: 100, unit: 'g', kcal: 57, p: 0.7, c: 14, f: 0.3, fiber: 2.4, sugar: 10, sodium: 1, emoji: '🫐' },
  // Fats
  { id: 18, name: 'Avocado', brand: 'Medium', per: 150, unit: 'g', kcal: 240, p: 3, c: 13, f: 22, fiber: 10, sugar: 1, sodium: 11, emoji: '🥑' },
  { id: 19, name: 'Almonds', brand: 'Raw', per: 28, unit: 'g', kcal: 164, p: 6, c: 6, f: 14, fiber: 3.5, sugar: 1.2, sodium: 0, emoji: '🌰' },
  { id: 20, name: 'Olive Oil', brand: 'Extra virgin', per: 14, unit: 'g', kcal: 120, p: 0, c: 0, f: 14, fiber: 0, sugar: 0, sodium: 0, emoji: '🫒' },
  { id: 21, name: 'Peanut Butter', brand: 'Natural', per: 32, unit: 'g', kcal: 190, p: 7, c: 7, f: 16, fiber: 2, sugar: 3, sodium: 140, emoji: '🥜' },
  // Veg
  { id: 22, name: 'Broccoli', brand: 'Steamed', per: 100, unit: 'g', kcal: 35, p: 2.4, c: 7, f: 0.4, fiber: 3.3, sugar: 1.7, sodium: 41, emoji: '🥦' },
  { id: 23, name: 'Spinach', brand: 'Fresh', per: 100, unit: 'g', kcal: 23, p: 2.9, c: 3.6, f: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79, emoji: '🥬' },
  { id: 24, name: 'Mixed Salad', brand: 'Greens', per: 100, unit: 'g', kcal: 20, p: 1.5, c: 3.5, f: 0.2, fiber: 2, sugar: 1.5, sodium: 25, emoji: '🥗' },
  // Restaurant / common
  { id: 25, name: 'Big Mac', brand: "McDonald's", per: 1, unit: 'item', kcal: 563, p: 26, c: 45, f: 33, fiber: 3, sugar: 9, sodium: 1010, emoji: '🍔' },
  { id: 26, name: 'Caesar Salad w/ Chicken', brand: 'Restaurant', per: 1, unit: 'bowl', kcal: 470, p: 35, c: 12, f: 30, fiber: 3, sugar: 3, sodium: 920, emoji: '🥗' },
  { id: 27, name: 'Margherita Pizza Slice', brand: 'Restaurant', per: 1, unit: 'slice', kcal: 285, p: 12, c: 36, f: 10, fiber: 2, sugar: 4, sodium: 640, emoji: '🍕' },
  { id: 28, name: 'Sushi Roll (6 pc)', brand: 'Salmon avocado', per: 1, unit: 'roll', kcal: 304, p: 9, c: 42, f: 11, fiber: 4, sugar: 3, sodium: 430, emoji: '🍣' },
  { id: 29, name: 'Latte', brand: 'Whole milk', per: 350, unit: 'ml', kcal: 190, p: 10, c: 18, f: 9, fiber: 0, sugar: 17, sodium: 130, emoji: '☕' },
  { id: 30, name: 'Dark Chocolate 85%', brand: 'Square', per: 10, unit: 'g', kcal: 60, p: 1, c: 3, f: 4.5, fiber: 1.2, sugar: 1.5, sodium: 2, emoji: '🍫' },
];

// ============ SAMPLE MEAL PLANS ============
const MEAL_PLANS = [
  {
    id: 1, name: 'Lean & Strong', tag: 'Muscle gain', kcal: 2400, emoji: '💪',
    desc: 'High-protein plan for building muscle while staying lean',
    meals: [{ name: 'Oats + Whey + Banana', kcal: 520 }, { name: 'Chicken + Rice + Broccoli', kcal: 680 }, { name: 'Salmon + Sweet Potato', kcal: 620 }, { name: 'Greek Yogurt + Almonds', kcal: 380 }]
  },
  {
    id: 2, name: 'Shred Mode', tag: 'Fat loss', kcal: 1700, emoji: '🔥',
    desc: 'Protein-forward cutting plan that keeps you full',
    meals: [{ name: 'Eggs + Spinach + Toast', kcal: 380 }, { name: 'Tuna Salad Bowl', kcal: 420 }, { name: 'Chicken + Veg Stir-fry', kcal: 520 }, { name: 'Cottage Cheese + Berries', kcal: 280 }]
  },
  {
    id: 3, name: 'Plant Power', tag: 'Plant-based', kcal: 2000, emoji: '🌱',
    desc: 'Balanced plant-based meals with complete proteins',
    meals: [{ name: 'Tofu Scramble + Avocado', kcal: 460 }, { name: 'Lentil Buddha Bowl', kcal: 580 }, { name: 'Chickpea Curry + Rice', kcal: 540 }, { name: 'PB + Banana + Oats', kcal: 420 }]
  },
];

// ============ STORAGE ============
const useStorage = (key, initial) => {
  const [val, setVal] = useState(() => {
    try {
      const s = window.localStorage?.getItem(key);
      return s ? JSON.parse(s) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { window.localStorage?.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal];
};

// ============ HELPERS ============
const todayKey = () => new Date().toISOString().slice(0, 10);
const fmtDate = (k) => new Date(k + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
const scale = (food, amount) => {
  const r = amount / food.per;
  return {
    kcal: Math.round(food.kcal * r),
    p: +(food.p * r).toFixed(1),
    c: +(food.c * r).toFixed(1),
    f: +(food.f * r).toFixed(1),
    fiber: +(food.fiber * r).toFixed(1),
    sugar: +(food.sugar * r).toFixed(1),
    sodium: Math.round(food.sodium * r),
  };
};

// ============ MAIN APP ============
export default function FoodTracker() {
  const [dark, setDark] = useStorage('ft_dark', false);
  const [tab, setTab] = useState('today');
  const [date, setDate] = useState(todayKey());
  const [logs, setLogs] = useStorage('ft_logs', {});
  const [favorites, setFavorites] = useStorage('ft_favs', [1, 2, 9, 22]);
  const [recent, setRecent] = useStorage('ft_recent', [1, 9, 22, 3]);
  const [goals, setGoals] = useStorage('ft_goals', { kcal: 2200, p: 150, c: 230, f: 75, type: 'maintenance' });
  const [weight, setWeight] = useStorage('ft_weight', [
    { date: todayKey(), kg: 75.2 },
  ]);
  const [streak, setStreak] = useStorage('ft_streak', 0);
  const [showSearch, setShowSearch] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [showGoals, setShowGoals] = useState(false);
  const [toast, setToast] = useState(null);

  const dayLog = logs[date] || [];

  // Toast helper
  const showToast = (msg, emoji = '✓') => {
    setToast({ msg, emoji, id: Date.now() });
    setTimeout(() => setToast(null), 2000);
  };

  // Totals for current day
  const totals = useMemo(() => {
    return dayLog.reduce((a, e) => ({
      kcal: a.kcal + e.kcal, p: a.p + e.p, c: a.c + e.c, f: a.f + e.f,
      fiber: a.fiber + e.fiber, sugar: a.sugar + e.sugar, sodium: a.sodium + e.sodium,
    }), { kcal: 0, p: 0, c: 0, f: 0, fiber: 0, sugar: 0, sodium: 0 });
  }, [dayLog]);

  // Streak calc (days with >=1 log, consecutive from today backwards)
  useEffect(() => {
    let s = 0;
    const d = new Date();
    for (let i = 0; i < 365; i++) {
      const k = d.toISOString().slice(0, 10);
      if ((logs[k] || []).length > 0) s++;
      else if (i > 0) break;
      else if (i === 0) { d.setDate(d.getDate() - 1); continue; }
      d.setDate(d.getDate() - 1);
    }
    setStreak(s);
  }, [logs]);

  const addEntry = (food, amount, meal) => {
    const sc = scale(food, amount);
    const entry = {
      id: Date.now() + Math.random(),
      foodId: food.id,
      name: food.name,
      brand: food.brand,
      emoji: food.emoji,
      amount,
      unit: food.unit,
      meal: meal || guessMeal(),
      ...sc,
    };
    setLogs({ ...logs, [date]: [...(logs[date] || []), entry] });
    setRecent([food.id, ...recent.filter(id => id !== food.id)].slice(0, 10));
    showToast(`${food.name} logged`, food.emoji);
  };

  const removeEntry = (id) => {
    setLogs({ ...logs, [date]: dayLog.filter(e => e.id !== id) });
  };

  const updateEntry = (id, newAmount) => {
    const entry = dayLog.find(e => e.id === id);
    if (!entry) return;
    const food = FOOD_DB.find(f => f.id === entry.foodId);
    if (!food) return;
    const sc = scale(food, newAmount);
    setLogs({
      ...logs,
      [date]: dayLog.map(e => e.id === id ? { ...e, amount: newAmount, ...sc } : e)
    });
  };

  const toggleFav = (id) => {
    setFavorites(favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id]);
  };

  const theme = dark ? darkTheme : lightTheme;

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      color: theme.text,
      fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      transition: 'background 0.3s ease, color 0.3s ease',
      paddingBottom: '100px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
        input, textarea { font-family: inherit; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }
        .serif { font-family: 'Instrument Serif', serif; font-weight: 400; letter-spacing: -0.01em; }
        .tabular { font-variant-numeric: tabular-nums; }
      `}</style>

      {/* Top Bar */}
      <Header theme={theme} dark={dark} setDark={setDark} streak={streak} date={date} setDate={setDate} />

      {/* Main content */}
      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '0 20px' }}>
        <AnimatePresence mode="wait">
          {tab === 'today' && (
            <motion.div key="today" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <TodayView
                theme={theme} totals={totals} goals={goals} dayLog={dayLog} date={date}
                onOpenSearch={() => setShowSearch(true)} onEditEntry={setEditEntry}
                onEditGoals={() => setShowGoals(true)} onRemove={removeEntry}
              />
            </motion.div>
          )}
          {tab === 'progress' && (
            <motion.div key="progress" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <ProgressView theme={theme} logs={logs} weight={weight} setWeight={setWeight} goals={goals} streak={streak} />
            </motion.div>
          )}
          {tab === 'plans' && (
            <motion.div key="plans" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <PlansView theme={theme} onPick={(p) => showToast(`${p.name} activated`, p.emoji)} />
            </motion.div>
          )}
          {tab === 'me' && (
            <motion.div key="me" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <MeView
                theme={theme} goals={goals} setGoals={setGoals} streak={streak}
                dark={dark} setDark={setDark} logs={logs}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FAB */}
      {tab === 'today' && (
        <motion.button
          onClick={() => setShowSearch(true)}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          style={{
            position: 'fixed', bottom: '92px', right: '20px', zIndex: 50,
            width: '60px', height: '60px', borderRadius: '20px',
            background: theme.accent, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: dark ? '0 10px 30px rgba(10, 132, 255, 0.4)' : '0 10px 30px rgba(0, 122, 255, 0.35)',
          }}
        >
          <Plus size={28} strokeWidth={2.5} />
        </motion.button>
      )}

      {/* Bottom Tab Bar */}
      <TabBar theme={theme} tab={tab} setTab={setTab} />

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <SearchModal
            theme={theme} onClose={() => setShowSearch(false)}
            favorites={favorites} recent={recent}
            onToggleFav={toggleFav} onAdd={addEntry}
          />
        )}
      </AnimatePresence>

      {/* Edit Entry Modal */}
      <AnimatePresence>
        {editEntry && (
          <EditModal
            theme={theme} entry={editEntry} onClose={() => setEditEntry(null)}
            onUpdate={(amt) => { updateEntry(editEntry.id, amt); setEditEntry(null); }}
            onRemove={() => { removeEntry(editEntry.id); setEditEntry(null); }}
          />
        )}
      </AnimatePresence>

      {/* Goals Modal */}
      <AnimatePresence>
        {showGoals && (
          <GoalsModal theme={theme} goals={goals} setGoals={setGoals} onClose={() => setShowGoals(false)} />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            style={{
              position: 'fixed', bottom: '170px', left: '50%', transform: 'translateX(-50%)',
              background: theme.toast, color: theme.toastText,
              padding: '12px 20px', borderRadius: '100px',
              display: 'flex', alignItems: 'center', gap: '10px',
              fontSize: '14px', fontWeight: 600, zIndex: 60,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
          >
            <span style={{ fontSize: '18px' }}>{toast.emoji}</span>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ THEMES ============
const lightTheme = {
  bg: '#F5F5F7',
  surface: '#FFFFFF',
  surfaceAlt: '#FAFAFC',
  text: '#1D1D1F',
  textSub: '#6E6E73',
  textMuted: '#A1A1A6',
  border: '#E8E8ED',
  accent: '#007AFF',
  accentSoft: 'rgba(0, 122, 255, 0.1)',
  green: '#34C759',
  orange: '#FF9500',
  red: '#FF3B30',
  purple: '#AF52DE',
  pink: '#FF2D55',
  toast: '#1D1D1F',
  toastText: '#fff',
};

const darkTheme = {
  bg: '#000000',
  surface: '#1C1C1E',
  surfaceAlt: '#2C2C2E',
  text: '#FFFFFF',
  textSub: '#98989D',
  textMuted: '#6D6D72',
  border: '#2C2C2E',
  accent: '#0A84FF',
  accentSoft: 'rgba(10, 132, 255, 0.15)',
  green: '#30D158',
  orange: '#FF9F0A',
  red: '#FF453A',
  purple: '#BF5AF2',
  pink: '#FF375F',
  toast: '#FFFFFF',
  toastText: '#000',
};

// ============ HEADER ============
function Header({ theme, dark, setDark, streak, date, setDate }) {
  const isToday = date === todayKey();
  const changeDate = (offset) => {
    const d = new Date(date + 'T00:00:00');
    d.setDate(d.getDate() + offset);
    setDate(d.toISOString().slice(0, 10));
  };

  return (
    <header style={{
      maxWidth: '480px', margin: '0 auto', padding: '20px 20px 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => changeDate(-1)}
          style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: theme.surface, display: 'grid', placeItems: 'center',
            border: `1px solid ${theme.border}`,
          }}>
          <ChevronLeft size={16} />
        </button>
        <div style={{ textAlign: 'center', minWidth: '140px' }}>
          <div style={{ fontSize: '11px', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            {isToday ? 'Today' : fmtDate(date)}
          </div>
          <div className="serif" style={{ fontSize: '22px', lineHeight: 1.1, marginTop: '2px' }}>
            {new Date(date + 'T00:00:00').toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
          </div>
        </div>
        <button
          onClick={() => changeDate(1)}
          disabled={isToday}
          style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: theme.surface, display: 'grid', placeItems: 'center',
            border: `1px solid ${theme.border}`,
            opacity: isToday ? 0.3 : 1,
          }}>
          <ChevronRight size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {streak > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '6px 10px', borderRadius: '100px',
            background: 'linear-gradient(135deg, #FF6B35, #FF9500)',
            color: '#fff', fontSize: '13px', fontWeight: 700,
          }}>
            🔥 {streak}
          </div>
        )}
        <button onClick={() => setDark(!dark)} style={{
          width: '38px', height: '38px', borderRadius: '12px',
          background: theme.surface, display: 'grid', placeItems: 'center',
          border: `1px solid ${theme.border}`,
        }}>
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}

// ============ TODAY VIEW ============
function TodayView({ theme, totals, goals, dayLog, date, onOpenSearch, onEditEntry, onEditGoals, onRemove }) {
  const pct = Math.min(100, (totals.kcal / goals.kcal) * 100);
  const remaining = Math.max(0, goals.kcal - totals.kcal);

  // Group by meal
  const meals = useMemo(() => {
    const m = { breakfast: [], lunch: [], dinner: [], snack: [] };
    dayLog.forEach(e => { (m[e.meal] || m.snack).push(e); });
    return m;
  }, [dayLog]);

  const mealInfo = [
    { key: 'breakfast', label: 'Breakfast', emoji: '🌅', time: '7–10am' },
    { key: 'lunch', label: 'Lunch', emoji: '☀️', time: '12–2pm' },
    { key: 'dinner', label: 'Dinner', emoji: '🌙', time: '6–9pm' },
    { key: 'snack', label: 'Snacks', emoji: '🍎', time: 'Anytime' },
  ];

  // Coaching feedback
  const coaching = useMemo(() => getCoaching(totals, goals, dayLog), [totals, goals, dayLog]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Calorie Ring */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={onEditGoals}
        style={{
          background: theme.surface, borderRadius: '28px', padding: '28px 24px',
          border: `1px solid ${theme.border}`, cursor: 'pointer',
          display: 'flex', gap: '24px', alignItems: 'center',
        }}>
        <CalorieRing theme={theme} pct={pct} totals={totals} goals={goals} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Remaining
          </div>
          <div className="tabular serif" style={{ fontSize: '42px', lineHeight: 1, marginTop: '4px' }}>
            {remaining.toLocaleString()}
          </div>
          <div style={{ fontSize: '13px', color: theme.textSub, marginTop: '4px' }}>
            of {goals.kcal.toLocaleString()} kcal
          </div>
          <div style={{ marginTop: '14px', display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px', color: theme.textSub }}>
            <Target size={12} /> {goals.type === 'loss' ? 'Fat loss' : goals.type === 'gain' ? 'Muscle gain' : 'Maintenance'}
          </div>
        </div>
      </motion.div>

      {/* Macros */}
      <div style={{
        background: theme.surface, borderRadius: '24px', padding: '20px',
        border: `1px solid ${theme.border}`,
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px',
      }}>
        <MacroBar theme={theme} label="Protein" value={totals.p} goal={goals.p} color={theme.red} icon={<Drumstick size={13} />} />
        <MacroBar theme={theme} label="Carbs" value={totals.c} goal={goals.c} color={theme.orange} icon={<Wheat size={13} />} />
        <MacroBar theme={theme} label="Fat" value={totals.f} goal={goals.f} color={theme.purple} icon={<Droplet size={13} />} />
      </div>

      {/* Coaching card */}
      {dayLog.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: `linear-gradient(135deg, ${theme.accentSoft}, transparent)`,
            border: `1px solid ${theme.accentSoft}`,
            borderRadius: '20px', padding: '16px',
            display: 'flex', gap: '12px', alignItems: 'flex-start',
          }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: theme.accent, display: 'grid', placeItems: 'center',
            flexShrink: 0, color: '#fff',
          }}>
            <Sparkles size={16} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px' }}>Coach</div>
            <div style={{ fontSize: '13px', color: theme.textSub, lineHeight: 1.45 }}>{coaching}</div>
          </div>
        </motion.div>
      )}

      {/* Quick Log */}
      <div style={{
        background: theme.surface, borderRadius: '24px', padding: '18px 16px',
        border: `1px solid ${theme.border}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
          <div style={{ fontSize: '11px', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
            Quick Log
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <QuickBtn theme={theme} icon={<Search size={18} />} label="Search" onClick={onOpenSearch} />
          <QuickBtn theme={theme} icon={<Barcode size={18} />} label="Scan" onClick={onOpenSearch} />
          <QuickBtn theme={theme} icon={<Mic size={18} />} label="Voice" onClick={onOpenSearch} />
        </div>
      </div>

      {/* Meals */}
      {mealInfo.map(m => (
        <MealSection
          key={m.key} theme={theme} info={m} entries={meals[m.key] || []}
          onAdd={onOpenSearch} onEdit={onEditEntry} onRemove={onRemove}
        />
      ))}

      {dayLog.length === 0 && (
        <div style={{
          padding: '40px 20px', textAlign: 'center', color: theme.textSub,
        }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🍽️</div>
          <div className="serif" style={{ fontSize: '22px', color: theme.text, marginBottom: '4px' }}>Nothing logged yet</div>
          <div style={{ fontSize: '14px' }}>Tap the + to log your first meal in seconds.</div>
        </div>
      )}
    </div>
  );
}

// ============ CALORIE RING ============
function CalorieRing({ theme, pct, totals, goals }) {
  const R = 56, C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;
  const over = totals.kcal > goals.kcal;

  return (
    <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={R} fill="none" stroke={theme.border} strokeWidth="12" />
        <motion.circle
          cx="70" cy="70" r={R} fill="none"
          stroke={over ? theme.red : theme.accent}
          strokeWidth="12" strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C - dash }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div className="tabular" style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1 }}>
          {totals.kcal}
        </div>
        <div style={{ fontSize: '10px', color: theme.textMuted, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px' }}>
          kcal
        </div>
      </div>
    </div>
  );
}

// ============ MACRO BAR ============
function MacroBar({ theme, label, value, goal, color, icon }) {
  const pct = Math.min(100, (value / goal) * 100);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px', color: theme.textSub }}>
        {icon}
        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.02em' }}>{label}</div>
      </div>
      <div className="tabular" style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1 }}>
        {Math.round(value)}<span style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 500 }}>/{goal}g</span>
      </div>
      <div style={{ marginTop: '8px', height: '5px', background: theme.border, borderRadius: '100px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: '100px' }}
        />
      </div>
    </div>
  );
}

// ============ QUICK BUTTON ============
function QuickBtn({ theme, icon, label, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        padding: '14px 8px', borderRadius: '14px',
        background: theme.surfaceAlt,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        color: theme.text, fontWeight: 600, fontSize: '12px',
      }}>
      <div style={{ color: theme.accent }}>{icon}</div>
      {label}
    </motion.button>
  );
}

// ============ MEAL SECTION ============
function MealSection({ theme, info, entries, onAdd, onEdit, onRemove }) {
  const sum = entries.reduce((a, e) => a + e.kcal, 0);
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{
      background: theme.surface, borderRadius: '24px',
      border: `1px solid ${theme.border}`, overflow: 'hidden',
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px',
          cursor: 'pointer',
        }}>
        <div style={{ fontSize: '22px' }}>{info.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: 700 }}>{info.label}</div>
          <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '1px' }}>{info.time}</div>
        </div>
        <div className="tabular" style={{ fontSize: '14px', color: theme.textSub, fontWeight: 600 }}>
          {sum} kcal
        </div>
        <motion.div animate={{ rotate: expanded ? 0 : -90 }}>
          <ChevronDown size={16} color={theme.textMuted} />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 18px 16px' }}>
              {entries.map(e => (
                <EntryRow key={e.id} theme={theme} entry={e} onEdit={() => onEdit(e)} onRemove={() => onRemove(e.id)} />
              ))}
              <button onClick={onAdd} style={{
                width: '100%', padding: '12px', marginTop: entries.length ? '8px' : '4px',
                border: `1.5px dashed ${theme.border}`, borderRadius: '14px',
                color: theme.textSub, fontSize: '13px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}>
                <Plus size={14} /> Add food
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EntryRow({ theme, entry, onEdit, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      style={{
        padding: '10px 12px', borderRadius: '14px',
        display: 'flex', alignItems: 'center', gap: '10px',
        marginTop: '6px',
      }}
      onClick={onEdit}
    >
      <div style={{ fontSize: '20px' }}>{entry.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {entry.name}
        </div>
        <div className="tabular" style={{ fontSize: '12px', color: theme.textMuted, marginTop: '1px' }}>
          {entry.amount}{entry.unit} · P{Math.round(entry.p)} C{Math.round(entry.c)} F{Math.round(entry.f)}
        </div>
      </div>
      <div className="tabular" style={{ fontSize: '14px', fontWeight: 700 }}>{entry.kcal}</div>
    </motion.div>
  );
}

// ============ SEARCH MODAL ============
function SearchModal({ theme, onClose, favorites, recent, onToggleFav, onAdd }) {
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);
  const [meal, setMeal] = useState(guessMeal());
  const [amount, setAmount] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    if (selected) setAmount(selected.per);
  }, [selected]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const ql = q.toLowerCase();
    return FOOD_DB.filter(f =>
      f.name.toLowerCase().includes(ql) || f.brand.toLowerCase().includes(ql)
    ).slice(0, 12);
  }, [q]);

  const sectioned = !q.trim();
  const favFoods = FOOD_DB.filter(f => favorites.includes(f.id));
  const recentFoods = recent.map(id => FOOD_DB.find(f => f.id === id)).filter(Boolean);

  const handleAdd = () => {
    onAdd(selected, amount, meal);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)', zIndex: 100,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '480px',
          background: theme.bg, borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
          height: '85vh', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Handle */}
        <div style={{ padding: '10px 0 0', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '4px', background: theme.border, borderRadius: '100px' }} />
        </div>

        {!selected ? (
          <>
            {/* Search header */}
            <div style={{ padding: '14px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div className="serif" style={{ fontSize: '26px' }}>Add food</div>
                <button onClick={onClose} style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: theme.surface, display: 'grid', placeItems: 'center',
                }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{
                background: theme.surface, borderRadius: '14px',
                padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'center',
                border: `1px solid ${theme.border}`,
              }}>
                <Search size={16} color={theme.textMuted} />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Search 30+ foods..."
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    color: theme.text, fontSize: '15px',
                  }}
                />
                {q && (
                  <button onClick={() => setQ('')}><X size={14} color={theme.textMuted} /></button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <QuickPill theme={theme} icon={<Barcode size={13} />} label="Scan barcode" />
                <QuickPill theme={theme} icon={<Mic size={13} />} label="Voice" />
                <QuickPill theme={theme} icon={<Camera size={13} />} label="Photo" />
              </div>
            </div>

            {/* Results */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
              {sectioned ? (
                <>
                  {favFoods.length > 0 && (
                    <Section theme={theme} title="Favorites" icon="⭐">
                      {favFoods.map(f => (
                        <FoodRow key={f.id} theme={theme} food={f} onSelect={() => setSelected(f)}
                          favored={favorites.includes(f.id)} onFav={() => onToggleFav(f.id)} />
                      ))}
                    </Section>
                  )}
                  <Section theme={theme} title="Recent" icon="🕐">
                    {recentFoods.map(f => (
                      <FoodRow key={f.id} theme={theme} food={f} onSelect={() => setSelected(f)}
                        favored={favorites.includes(f.id)} onFav={() => onToggleFav(f.id)} />
                    ))}
                  </Section>
                </>
              ) : (
                <div style={{ marginTop: '12px' }}>
                  {results.length > 0 ? results.map(f => (
                    <FoodRow key={f.id} theme={theme} food={f} onSelect={() => setSelected(f)}
                      favored={favorites.includes(f.id)} onFav={() => onToggleFav(f.id)} />
                  )) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: theme.textSub }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                      <div style={{ fontSize: '14px' }}>No matches for "{q}"</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <FoodDetail
            theme={theme} food={selected} amount={amount} setAmount={setAmount}
            meal={meal} setMeal={setMeal}
            onBack={() => setSelected(null)} onAdd={handleAdd}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

function Section({ theme, title, icon, children }) {
  return (
    <div style={{ marginTop: '18px' }}>
      <div style={{
        fontSize: '11px', fontWeight: 700, color: theme.textMuted,
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', padding: '0 4px',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <span>{icon}</span> {title}
      </div>
      <div style={{
        background: theme.surface, borderRadius: '16px',
        border: `1px solid ${theme.border}`, overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

function FoodRow({ theme, food, onSelect, favored, onFav }) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      style={{
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px',
        borderBottom: `1px solid ${theme.border}`, cursor: 'pointer',
      }}
    >
      <div style={{ fontSize: '24px' }}>{food.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>{food.name}</div>
        <div className="tabular" style={{ fontSize: '12px', color: theme.textMuted, marginTop: '1px' }}>
          {food.brand} · {food.kcal} kcal / {food.per}{food.unit}
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onFav(); }} style={{
        width: '32px', height: '32px', display: 'grid', placeItems: 'center',
      }}>
        <Star size={16} fill={favored ? '#FFC107' : 'none'} color={favored ? '#FFC107' : theme.textMuted} />
      </button>
    </motion.div>
  );
}

function QuickPill({ theme, icon, label }) {
  return (
    <div style={{
      padding: '7px 12px', borderRadius: '100px',
      background: theme.surface, border: `1px solid ${theme.border}`,
      display: 'flex', alignItems: 'center', gap: '5px',
      fontSize: '12px', color: theme.textSub, fontWeight: 600,
    }}>
      {icon} {label}
    </div>
  );
}

function FoodDetail({ theme, food, amount, setAmount, meal, setMeal, onBack, onAdd }) {
  const sc = scale(food, amount);
  const presets = food.unit === 'g' ? [50, 100, 150, 200, 250] :
    food.unit === 'ml' ? [100, 250, 350, 500] : [0.5, 1, 2, 3];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={onBack} style={{
          width: '32px', height: '32px', borderRadius: '10px',
          background: theme.surface, display: 'grid', placeItems: 'center',
        }}>
          <ChevronLeft size={16} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {food.name}
          </div>
          <div style={{ fontSize: '12px', color: theme.textMuted }}>{food.brand}</div>
        </div>
        <div style={{ fontSize: '32px' }}>{food.emoji}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px' }}>
        {/* Preview totals */}
        <div style={{
          background: theme.surface, borderRadius: '20px', padding: '20px',
          border: `1px solid ${theme.border}`,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', textAlign: 'center',
        }}>
          <Stat theme={theme} label="kcal" value={sc.kcal} color={theme.accent} />
          <Stat theme={theme} label="P" value={sc.p + 'g'} color={theme.red} />
          <Stat theme={theme} label="C" value={sc.c + 'g'} color={theme.orange} />
          <Stat theme={theme} label="F" value={sc.f + 'g'} color={theme.purple} />
        </div>

        {/* Amount */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
            Amount
          </div>
          <div style={{
            background: theme.surface, borderRadius: '16px', padding: '16px 20px',
            border: `1px solid ${theme.border}`,
            display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <button onClick={() => setAmount(Math.max(1, amount - (food.unit === 'item' ? 0.5 : 10)))} style={{
              width: '36px', height: '36px', borderRadius: '12px',
              background: theme.surfaceAlt, display: 'grid', placeItems: 'center',
            }}>
              <Minus size={16} />
            </button>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div className="tabular serif" style={{ fontSize: '30px', lineHeight: 1 }}>{amount}</div>
              <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '2px' }}>{food.unit}</div>
            </div>
            <button onClick={() => setAmount(amount + (food.unit === 'item' ? 0.5 : 10))} style={{
              width: '36px', height: '36px', borderRadius: '12px',
              background: theme.surfaceAlt, display: 'grid', placeItems: 'center',
            }}>
              <Plus size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {presets.map(p => (
              <button key={p} onClick={() => setAmount(p)} style={{
                padding: '7px 14px', borderRadius: '100px',
                background: amount === p ? theme.accent : theme.surface,
                color: amount === p ? '#fff' : theme.text,
                border: `1px solid ${amount === p ? theme.accent : theme.border}`,
                fontSize: '13px', fontWeight: 600, flexShrink: 0,
              }}>
                {p}{food.unit}
              </button>
            ))}
          </div>
        </div>

        {/* Meal */}
        <div style={{ marginTop: '18px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
            Meal
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
            {[
              { k: 'breakfast', l: 'Breakfast', e: '🌅' },
              { k: 'lunch', l: 'Lunch', e: '☀️' },
              { k: 'dinner', l: 'Dinner', e: '🌙' },
              { k: 'snack', l: 'Snack', e: '🍎' },
            ].map(m => (
              <button key={m.k} onClick={() => setMeal(m.k)} style={{
                padding: '10px 4px', borderRadius: '14px',
                background: meal === m.k ? theme.accentSoft : theme.surface,
                border: `1px solid ${meal === m.k ? theme.accent : theme.border}`,
                color: meal === m.k ? theme.accent : theme.text,
                fontSize: '11px', fontWeight: 600,
                display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center',
              }}>
                <span style={{ fontSize: '18px' }}>{m.e}</span>
                {m.l}
              </button>
            ))}
          </div>
        </div>

        {/* Extra nutrients */}
        <div style={{
          marginTop: '18px', padding: '14px 16px',
          background: theme.surface, borderRadius: '16px',
          border: `1px solid ${theme.border}`,
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
            Per {amount}{food.unit}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <MiniStat theme={theme} label="Fiber" val={sc.fiber + 'g'} />
            <MiniStat theme={theme} label="Sugar" val={sc.sugar + 'g'} />
            <MiniStat theme={theme} label="Sodium" val={sc.sodium + 'mg'} />
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px 24px', borderTop: `1px solid ${theme.border}`, background: theme.bg }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onAdd}
          style={{
            width: '100%', padding: '16px', borderRadius: '16px',
            background: theme.accent, color: '#fff',
            fontSize: '15px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
          <Check size={18} /> Log {sc.kcal} kcal
        </motion.button>
      </div>
    </div>
  );
}

function Stat({ theme, label, value, color }) {
  return (
    <div>
      <div className="tabular" style={{ fontSize: '20px', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '10px', fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>{label}</div>
    </div>
  );
}

function MiniStat({ theme, label, val }) {
  return (
    <div>
      <div style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 600 }}>{label}</div>
      <div className="tabular" style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>{val}</div>
    </div>
  );
}

// ============ EDIT MODAL ============
function EditModal({ theme, entry, onClose, onUpdate, onRemove }) {
  const [amount, setAmount] = useState(entry.amount);
  const food = FOOD_DB.find(f => f.id === entry.foodId);
  const sc = food ? scale(food, amount) : entry;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: theme.surface, borderRadius: '24px', padding: '24px',
          width: '100%', maxWidth: '360px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{ fontSize: '30px' }}>{entry.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>{entry.name}</div>
            <div style={{ fontSize: '12px', color: theme.textMuted }}>{entry.brand}</div>
          </div>
        </div>

        <div style={{
          background: theme.surfaceAlt, borderRadius: '16px', padding: '14px',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', textAlign: 'center',
          marginBottom: '16px',
        }}>
          <Stat theme={theme} label="kcal" value={sc.kcal} color={theme.accent} />
          <Stat theme={theme} label="P" value={sc.p + 'g'} color={theme.red} />
          <Stat theme={theme} label="C" value={sc.c + 'g'} color={theme.orange} />
          <Stat theme={theme} label="F" value={sc.f + 'g'} color={theme.purple} />
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '14px',
          background: theme.surfaceAlt, borderRadius: '16px', marginBottom: '16px',
        }}>
          <button onClick={() => setAmount(Math.max(1, amount - 10))} style={{
            width: '36px', height: '36px', borderRadius: '12px',
            background: theme.surface, display: 'grid', placeItems: 'center',
          }}>
            <Minus size={16} />
          </button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div className="tabular serif" style={{ fontSize: '28px' }}>{amount}{entry.unit}</div>
          </div>
          <button onClick={() => setAmount(amount + 10)} style={{
            width: '36px', height: '36px', borderRadius: '12px',
            background: theme.surface, display: 'grid', placeItems: 'center',
          }}>
            <Plus size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onRemove} style={{
            flex: 1, padding: '13px', borderRadius: '14px',
            background: 'rgba(255, 59, 48, 0.1)', color: theme.red,
            fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}>
            <Trash2 size={14} /> Remove
          </button>
          <button onClick={() => onUpdate(amount)} style={{
            flex: 2, padding: '13px', borderRadius: '14px',
            background: theme.accent, color: '#fff',
            fontWeight: 700, fontSize: '14px',
          }}>
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============ GOALS MODAL ============
function GoalsModal({ theme, goals, setGoals, onClose }) {
  const [g, setG] = useState(goals);

  const applyPreset = (type) => {
    const presets = {
      loss: { kcal: 1800, p: 160, c: 160, f: 60, type: 'loss' },
      maintenance: { kcal: 2200, p: 150, c: 230, f: 75, type: 'maintenance' },
      gain: { kcal: 2700, p: 180, c: 320, f: 80, type: 'gain' },
    };
    setG(presets[type]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)', zIndex: 100,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: theme.bg, borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
          width: '100%', maxWidth: '480px', padding: '16px 20px 28px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <div style={{ width: '36px', height: '4px', background: theme.border, borderRadius: '100px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div className="serif" style={{ fontSize: '26px' }}>Goals</div>
          <button onClick={onClose} style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: theme.surface, display: 'grid', placeItems: 'center',
          }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
          Quick preset
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '18px' }}>
          {[
            { k: 'loss', l: 'Fat loss', e: '🔥' },
            { k: 'maintenance', l: 'Maintain', e: '⚖️' },
            { k: 'gain', l: 'Muscle', e: '💪' },
          ].map(p => (
            <button key={p.k} onClick={() => applyPreset(p.k)} style={{
              padding: '14px 8px', borderRadius: '14px',
              background: g.type === p.k ? theme.accentSoft : theme.surface,
              border: `1px solid ${g.type === p.k ? theme.accent : theme.border}`,
              color: g.type === p.k ? theme.accent : theme.text,
              fontSize: '13px', fontWeight: 600,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            }}>
              <span style={{ fontSize: '20px' }}>{p.e}</span>
              {p.l}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
          Targets
        </div>
        <div style={{ background: theme.surface, borderRadius: '16px', padding: '4px', border: `1px solid ${theme.border}` }}>
          <GoalRow theme={theme} label="Calories" unit="kcal" value={g.kcal} onChange={v => setG({ ...g, kcal: v })} step={50} />
          <GoalRow theme={theme} label="Protein" unit="g" value={g.p} onChange={v => setG({ ...g, p: v })} step={5} color={theme.red} />
          <GoalRow theme={theme} label="Carbs" unit="g" value={g.c} onChange={v => setG({ ...g, c: v })} step={5} color={theme.orange} />
          <GoalRow theme={theme} label="Fat" unit="g" value={g.f} onChange={v => setG({ ...g, f: v })} step={5} color={theme.purple} last />
        </div>

        <button onClick={() => { setGoals(g); onClose(); }} style={{
          width: '100%', marginTop: '18px', padding: '16px', borderRadius: '16px',
          background: theme.accent, color: '#fff', fontSize: '15px', fontWeight: 700,
        }}>
          Save goals
        </button>
      </motion.div>
    </motion.div>
  );
}

function GoalRow({ theme, label, unit, value, onChange, step, color, last }) {
  return (
    <div style={{
      padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: '12px',
      borderBottom: last ? 'none' : `1px solid ${theme.border}`,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: color || theme.text }}>{label}</div>
        <div className="tabular" style={{ fontSize: '12px', color: theme.textMuted }}>{value} {unit}</div>
      </div>
      <button onClick={() => onChange(Math.max(0, value - step))} style={{
        width: '32px', height: '32px', borderRadius: '10px',
        background: theme.surfaceAlt, display: 'grid', placeItems: 'center',
      }}>
        <Minus size={14} />
      </button>
      <button onClick={() => onChange(value + step)} style={{
        width: '32px', height: '32px', borderRadius: '10px',
        background: theme.surfaceAlt, display: 'grid', placeItems: 'center',
      }}>
        <Plus size={14} />
      </button>
    </div>
  );
}

// ============ PROGRESS VIEW ============
function ProgressView({ theme, logs, weight, setWeight, goals, streak }) {
  const [view, setView] = useState('calories'); // calories | weight | macros

  // Last 7 days data
  const days = useMemo(() => {
    const arr = [];
    const d = new Date();
    for (let i = 6; i >= 0; i--) {
      const dd = new Date(d);
      dd.setDate(d.getDate() - i);
      const k = dd.toISOString().slice(0, 10);
      const entries = logs[k] || [];
      const tot = entries.reduce((a, e) => ({
        kcal: a.kcal + e.kcal, p: a.p + e.p, c: a.c + e.c, f: a.f + e.f,
      }), { kcal: 0, p: 0, c: 0, f: 0 });
      arr.push({ key: k, label: dd.toLocaleDateString(undefined, { weekday: 'narrow' }), ...tot });
    }
    return arr;
  }, [logs]);

  const avg = useMemo(() => {
    const withData = days.filter(d => d.kcal > 0);
    if (withData.length === 0) return { kcal: 0, p: 0 };
    return {
      kcal: Math.round(withData.reduce((a, d) => a + d.kcal, 0) / withData.length),
      p: Math.round(withData.reduce((a, d) => a + d.p, 0) / withData.length),
    };
  }, [days]);

  const maxKcal = Math.max(...days.map(d => d.kcal), goals.kcal);
  const latestWeight = weight[weight.length - 1]?.kg || 75;

  const [showWeight, setShowWeight] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="serif" style={{ fontSize: '28px', padding: '4px 4px 0' }}>Progress</div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <SummaryCard theme={theme} icon="🔥" label="Streak" value={streak} unit="days" color={theme.orange} />
        <SummaryCard theme={theme} icon="📊" label="Avg kcal" value={avg.kcal || '—'} unit="/ day" color={theme.accent} />
        <SummaryCard theme={theme} icon="⚖️" label="Weight" value={latestWeight} unit="kg" color={theme.green}
          onClick={() => setShowWeight(true)} />
        <SummaryCard theme={theme} icon="💪" label="Avg protein" value={avg.p || '—'} unit="g / day" color={theme.red} />
      </div>

      {/* Chart */}
      <div style={{
        background: theme.surface, borderRadius: '24px', padding: '20px',
        border: `1px solid ${theme.border}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Last 7 days
            </div>
            <div className="serif" style={{ fontSize: '22px', marginTop: '2px' }}>Daily calories</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="tabular" style={{ fontSize: '20px', fontWeight: 700 }}>{avg.kcal || 0}</div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>avg kcal</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', gap: '8px', padding: '4px 0' }}>
          {days.map((d, i) => {
            const h = d.kcal > 0 ? Math.max(4, (d.kcal / maxKcal) * 140) : 4;
            const goalPct = goals.kcal / maxKcal * 100;
            const isToday = d.key === todayKey();
            return (
              <div key={d.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative' }}>
                <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}px` }}
                    transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
                    style={{
                      width: '100%', borderRadius: '8px',
                      background: isToday ? theme.accent :
                        d.kcal > goals.kcal * 1.1 ? theme.red :
                        d.kcal > goals.kcal * 0.8 ? theme.green :
                        d.kcal > 0 ? theme.accentSoft :
                        theme.border,
                      minHeight: '4px',
                    }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: isToday ? theme.accent : theme.textMuted, fontWeight: 600 }}>
                  {d.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Goal line */}
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
          <span style={{ color: theme.textMuted }}>Goal: {goals.kcal} kcal</span>
          <span style={{ color: theme.textMuted }}>
            {days.filter(d => d.kcal > 0 && Math.abs(d.kcal - goals.kcal) < goals.kcal * 0.15).length}/7 on target
          </span>
        </div>
      </div>

      {/* Achievements */}
      <div style={{
        background: theme.surface, borderRadius: '24px', padding: '20px',
        border: `1px solid ${theme.border}`,
      }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
          Achievements
        </div>
        <div className="serif" style={{ fontSize: '22px', marginBottom: '16px' }}>Milestones</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <Achievement theme={theme} emoji="🔥" label="3-day streak" unlocked={streak >= 3} />
          <Achievement theme={theme} emoji="🎯" label="Hit goal" unlocked={days.some(d => Math.abs(d.kcal - goals.kcal) < 100)} />
          <Achievement theme={theme} emoji="💪" label="Protein hero" unlocked={days.some(d => d.p >= goals.p)} />
          <Achievement theme={theme} emoji="📅" label="7-day streak" unlocked={streak >= 7} />
          <Achievement theme={theme} emoji="⭐" label="10 logs" unlocked={Object.values(logs).flat().length >= 10} />
          <Achievement theme={theme} emoji="🏆" label="30-day streak" unlocked={streak >= 30} />
        </div>
      </div>

      <AnimatePresence>
        {showWeight && (
          <WeightModal theme={theme} weight={weight} setWeight={setWeight} onClose={() => setShowWeight(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryCard({ theme, icon, label, value, unit, color, onClick }) {
  return (
    <motion.div
      whileTap={onClick ? { scale: 0.97 } : {}}
      onClick={onClick}
      style={{
        background: theme.surface, borderRadius: '20px', padding: '16px',
        border: `1px solid ${theme.border}`,
        cursor: onClick ? 'pointer' : 'default',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ fontSize: '18px' }}>{icon}</div>
        <div style={{ fontSize: '11px', fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <div className="tabular" style={{ fontSize: '24px', fontWeight: 700, color }}>{value}</div>
        <div style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 500 }}>{unit}</div>
      </div>
    </motion.div>
  );
}

function Achievement({ theme, emoji, label, unlocked }) {
  return (
    <div style={{
      padding: '14px 6px', borderRadius: '14px',
      background: unlocked ? theme.accentSoft : theme.surfaceAlt,
      border: `1px solid ${unlocked ? theme.accent : theme.border}`,
      textAlign: 'center',
      opacity: unlocked ? 1 : 0.5,
    }}>
      <div style={{ fontSize: '24px', marginBottom: '4px', filter: unlocked ? 'none' : 'grayscale(1)' }}>{emoji}</div>
      <div style={{ fontSize: '10px', fontWeight: 600, lineHeight: 1.2 }}>{label}</div>
    </div>
  );
}

function WeightModal({ theme, weight, setWeight, onClose }) {
  const [kg, setKg] = useState(weight[weight.length - 1]?.kg || 75);

  const save = () => {
    const k = todayKey();
    const filtered = weight.filter(w => w.date !== k);
    setWeight([...filtered, { date: k, kg: parseFloat(kg) }].sort((a, b) => a.date.localeCompare(b.date)));
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: theme.surface, borderRadius: '24px', padding: '24px',
          width: '100%', maxWidth: '340px',
        }}
      >
        <div className="serif" style={{ fontSize: '24px', marginBottom: '8px' }}>Log weight</div>
        <div style={{ fontSize: '13px', color: theme.textSub, marginBottom: '20px' }}>
          {fmtDate(todayKey())}
        </div>
        <div style={{
          background: theme.surfaceAlt, borderRadius: '16px', padding: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
          marginBottom: '16px',
        }}>
          <button onClick={() => setKg((+kg - 0.1).toFixed(1))} style={{
            width: '36px', height: '36px', borderRadius: '12px',
            background: theme.surface, display: 'grid', placeItems: 'center',
          }}>
            <Minus size={16} />
          </button>
          <div style={{ textAlign: 'center', minWidth: '120px' }}>
            <input
              type="number" step="0.1" value={kg}
              onChange={e => setKg(e.target.value)}
              style={{
                width: '100%', border: 'none', outline: 'none', background: 'transparent',
                textAlign: 'center', fontSize: '40px', fontWeight: 700, color: theme.text,
                fontFamily: 'Instrument Serif, serif',
              }}
            />
            <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '-4px' }}>kg</div>
          </div>
          <button onClick={() => setKg((+kg + 0.1).toFixed(1))} style={{
            width: '36px', height: '36px', borderRadius: '12px',
            background: theme.surface, display: 'grid', placeItems: 'center',
          }}>
            <Plus size={16} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '13px', borderRadius: '14px',
            background: theme.surfaceAlt, fontWeight: 700, fontSize: '14px',
          }}>
            Cancel
          </button>
          <button onClick={save} style={{
            flex: 2, padding: '13px', borderRadius: '14px',
            background: theme.accent, color: '#fff', fontWeight: 700, fontSize: '14px',
          }}>
            Save weight
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============ PLANS VIEW ============
function PlansView({ theme, onPick }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <div className="serif" style={{ fontSize: '28px', padding: '4px 4px 0' }}>Meal Plans</div>
        <div style={{ fontSize: '14px', color: theme.textSub, padding: '2px 4px 0' }}>
          Curated plans matched to your goal.
        </div>
      </div>
      {MEAL_PLANS.map(p => (
        <motion.div
          key={p.id}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPick(p)}
          style={{
            background: theme.surface, borderRadius: '24px', padding: '20px',
            border: `1px solid ${theme.border}`, cursor: 'pointer',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div style={{
              width: '54px', height: '54px', borderRadius: '16px',
              background: theme.accentSoft, display: 'grid', placeItems: 'center',
              fontSize: '28px',
            }}>
              {p.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {p.tag}
              </div>
              <div className="serif" style={{ fontSize: '22px', lineHeight: 1.2, marginTop: '2px' }}>{p.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="tabular" style={{ fontSize: '18px', fontWeight: 700 }}>{p.kcal}</div>
              <div style={{ fontSize: '11px', color: theme.textMuted }}>kcal</div>
            </div>
          </div>
          <div style={{ fontSize: '13px', color: theme.textSub, marginBottom: '14px', lineHeight: 1.5 }}>
            {p.desc}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {p.meals.map((m, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', background: theme.surfaceAlt, borderRadius: '10px',
                fontSize: '13px',
              }}>
                <span>{m.name}</span>
                <span className="tabular" style={{ color: theme.textMuted, fontWeight: 600 }}>{m.kcal} kcal</span>
              </div>
            ))}
          </div>
          <button style={{
            width: '100%', marginTop: '14px', padding: '12px', borderRadius: '14px',
            background: theme.accentSoft, color: theme.accent,
            fontWeight: 700, fontSize: '13px',
          }}>
            Activate plan →
          </button>
        </motion.div>
      ))}
    </div>
  );
}

// ============ ME VIEW ============
function MeView({ theme, goals, setGoals, streak, dark, setDark, logs }) {
  const totalLogs = Object.values(logs).flat().length;
  const activeDays = Object.values(logs).filter(a => a.length > 0).length;

  const exportData = () => {
    const data = JSON.stringify({ goals, logs }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'food-tracker-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Profile header */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.accent}, #AF52DE)`,
        borderRadius: '28px', padding: '24px', color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
            display: 'grid', placeItems: 'center', fontSize: '28px',
          }}>
            👋
          </div>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Welcome back
            </div>
            <div className="serif" style={{ fontSize: '26px', lineHeight: 1.1 }}>You</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <ProfileStat label="Streak" value={streak} />
          <ProfileStat label="Days logged" value={activeDays} />
          <ProfileStat label="Meals" value={totalLogs} />
        </div>
      </div>

      {/* Settings sections */}
      <SettingsGroup theme={theme} title="Goals">
        <SettingRow theme={theme} icon={<Target size={16} />} label="Daily targets"
          hint={`${goals.kcal} kcal · ${goals.type}`} onClick={() => {}} />
        <SettingRow theme={theme} icon={<Flag size={16} />} label="Goal type"
          hint={goals.type === 'loss' ? 'Fat loss' : goals.type === 'gain' ? 'Muscle gain' : 'Maintenance'}
          onClick={() => {}} last />
      </SettingsGroup>

      <SettingsGroup theme={theme} title="Integrations">
        <SettingRow theme={theme} icon={<Heart size={16} />} label="Apple Health" hint="Not connected" onClick={() => {}} />
        <SettingRow theme={theme} icon={<Activity size={16} />} label="Google Fit" hint="Not connected" onClick={() => {}} />
        <SettingRow theme={theme} icon={<Zap size={16} />} label="Wearables" hint="Not connected" onClick={() => {}} last />
      </SettingsGroup>

      <SettingsGroup theme={theme} title="Appearance">
        <SettingRow theme={theme} icon={dark ? <Moon size={16} /> : <Sun size={16} />}
          label="Dark mode" onClick={() => setDark(!dark)}
          right={<Toggle on={dark} theme={theme} />} last />
      </SettingsGroup>

      <SettingsGroup theme={theme} title="Data & privacy">
        <SettingRow theme={theme} icon={<Edit3 size={16} />} label="Export my data" hint="Download JSON"
          onClick={exportData} />
        <SettingRow theme={theme} icon={<Trash2 size={16} />} label="Clear all data"
          danger onClick={() => {
            if (confirm('Delete all logged data? This cannot be undone.')) {
              try { window.localStorage?.clear(); window.location.reload(); } catch {}
            }
          }} last />
      </SettingsGroup>

      <div style={{ textAlign: 'center', padding: '20px 0', fontSize: '12px', color: theme.textMuted }}>
        Private by design · Offline-first · No signup required
      </div>
    </div>
  );
}

function ProfileStat({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="tabular serif" style={{ fontSize: '28px', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '11px', opacity: 0.8, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '2px' }}>
        {label}
      </div>
    </div>
  );
}

function SettingsGroup({ theme, title, children }) {
  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', padding: '0 4px' }}>
        {title}
      </div>
      <div style={{
        background: theme.surface, borderRadius: '18px',
        border: `1px solid ${theme.border}`, overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

function SettingRow({ theme, icon, label, hint, onClick, last, right, danger }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: '12px',
      borderBottom: last ? 'none' : `1px solid ${theme.border}`,
      textAlign: 'left', color: danger ? theme.red : theme.text,
    }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '10px',
        background: danger ? 'rgba(255, 59, 48, 0.1)' : theme.surfaceAlt,
        display: 'grid', placeItems: 'center', color: danger ? theme.red : theme.textSub,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 600 }}>{label}</div>
        {hint && <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '1px' }}>{hint}</div>}
      </div>
      {right || <ChevronRight size={14} color={theme.textMuted} />}
    </button>
  );
}

function Toggle({ on, theme }) {
  return (
    <div style={{
      width: '48px', height: '28px', borderRadius: '100px',
      background: on ? theme.green : theme.border,
      position: 'relative', transition: 'background 0.2s',
    }}>
      <motion.div
        animate={{ x: on ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          width: '24px', height: '24px', borderRadius: '50%',
          background: '#fff', position: 'absolute', top: '2px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
}

// ============ TAB BAR ============
function TabBar({ theme, tab, setTab }) {
  const tabs = [
    { key: 'today', label: 'Today', icon: Home },
    { key: 'progress', label: 'Progress', icon: BarChart3 },
    { key: 'plans', label: 'Plans', icon: BookOpen },
    { key: 'me', label: 'Me', icon: User },
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
      display: 'flex', justifyContent: 'center',
      padding: '8px 16px 20px',
      background: `linear-gradient(to top, ${theme.bg} 40%, transparent)`,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-around',
        width: '100%', maxWidth: '400px',
        background: theme.surface, backdropFilter: 'blur(20px)',
        borderRadius: '22px', padding: '6px',
        border: `1px solid ${theme.border}`,
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      }}>
        {tabs.map(t => {
          const active = tab === t.key;
          const Icon = t.icon;
          return (
            <motion.button
              key={t.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: '10px 4px', borderRadius: '16px',
                background: active ? theme.accentSoft : 'transparent',
                color: active ? theme.accent : theme.textMuted,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.02em' }}>{t.label}</div>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

// ============ COACHING LOGIC ============
function getCoaching(totals, goals, log) {
  const msgs = [];
  const kcalPct = (totals.kcal / goals.kcal) * 100;
  const pPct = (totals.p / goals.p) * 100;

  const now = new Date();
  const h = now.getHours();

  if (log.length === 0) return "Log your first meal to get started.";

  if (kcalPct > 100) {
    const over = totals.kcal - goals.kcal;
    msgs.push(`You're ${over} kcal over goal. Tomorrow's a fresh start.`);
  } else if (h > 19 && kcalPct < 60) {
    msgs.push(`You've only hit ${Math.round(kcalPct)}% of calories. A solid dinner would help.`);
  } else if (pPct < 50 && h > 14) {
    msgs.push(`Protein's low today (${Math.round(totals.p)}g). Try adding Greek yogurt or a protein shake.`);
  } else if (totals.sugar > 50) {
    msgs.push(`Sugar is tracking high (${Math.round(totals.sugar)}g). Consider swapping dessert for fruit.`);
  } else if (totals.sodium > 2300) {
    msgs.push(`Sodium is over 2,300mg. Drink extra water today.`);
  } else if (pPct >= 80 && kcalPct >= 60 && kcalPct <= 100) {
    msgs.push(`Great balance today. ${Math.round(totals.p)}g protein in, macros on target.`);
  } else if (kcalPct < 50 && h > 12) {
    msgs.push(`You're running light on calories. Make sure to eat enough to support your goal.`);
  } else {
    msgs.push(`On track. ${goals.kcal - totals.kcal} kcal left for today.`);
  }

  return msgs[0];
}

function guessMeal() {
  const h = new Date().getHours();
  if (h < 10) return 'breakfast';
  if (h < 15) return 'lunch';
  if (h < 21) return 'dinner';
  return 'snack';
}
