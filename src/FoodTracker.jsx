import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Drumstick, Wheat, Droplet, Target,
  Mic, Camera, Barcode, Star, ChevronRight, ChevronLeft, X,
  Check, Flag, Sparkles, Activity, Moon, Sun,
  BarChart3, Heart, Zap, Edit3, Trash2,
  Home, BookOpen, User, ChevronDown, Minus,
} from 'lucide-react';

// ============ BRAND ============
const BRAND = {
  name: 'Fitora',
  tagline: 'Nutrition, simplified.',
};

// Logo: uses the /public/logo-mark.png image
// Accepts the same props as before for backward compatibility, but only `size` is used now.
function FitoraLogo({ size = 32, color, accent, style }) {
  return (
    <img
      src="/logo-mark.png"
      alt="Fitora"
      width={size}
      height={size}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        display: 'block',
        ...style,
      }}
    />
  );
}

// Text wordmark
function FitoraWordmark({ theme, size = 22 }) {
  return (
    <div className="serif" style={{
      fontSize: `${size}px`,
      fontWeight: 400,
      letterSpacing: '-0.02em',
      color: theme.text,
      display: 'flex', alignItems: 'center',
    }}>
      Fit<span style={{ color: theme.accent }}>ora</span>
    </div>
  );
}

// ============ USDA FOODDATA CENTRAL API ============
// Sign up for a free API key at https://fdc.nal.usda.gov/api-key-signup
// Set VITE_USDA_API_KEY in your .env.local file (locally) or Vercel env vars (production).
// Falls back to DEMO_KEY which has stricter limits but works out of the box.
const USDA_API_KEY = import.meta.env?.VITE_USDA_API_KEY || 'DEMO_KEY';
const USDA_BASE = 'https://api.nal.usda.gov/fdc/v1';

// USDA nutrient IDs we care about
const NUTRIENT_IDS = {
  kcal: [1008, 2047, 2048], // Energy (Atwater or general)
  p: [1003],   // Protein
  c: [1005],   // Carbohydrate, by difference
  f: [1004],   // Total lipid (fat)
  fiber: [1079], // Fiber, total dietary
  sugar: [2000, 1063], // Sugars, total
  sodium: [1093], // Sodium, Na
};

// Small emoji lookup to decorate USDA results
const EMOJI_MAP = [
  { match: /chicken|poultry|turkey/i, e: '🍗' },
  { match: /beef|steak|ground beef/i, e: '🥩' },
  { match: /pork|bacon|ham|sausage/i, e: '🥓' },
  { match: /salmon|tuna|cod|fish|tilapia|halibut|shrimp|lobster|crab/i, e: '🐟' },
  { match: /egg/i, e: '🥚' },
  { match: /cheese/i, e: '🧀' },
  { match: /milk|yogurt|cream/i, e: '🥛' },
  { match: /butter/i, e: '🧈' },
  { match: /rice/i, e: '🍚' },
  { match: /bread|toast|bagel|roll/i, e: '🍞' },
  { match: /pasta|spaghetti|macaroni|noodle|ramen/i, e: '🍝' },
  { match: /pizza/i, e: '🍕' },
  { match: /burger|cheeseburger/i, e: '🍔' },
  { match: /fries|french fry/i, e: '🍟' },
  { match: /hot dog|hotdog/i, e: '🌭' },
  { match: /sushi|sashimi/i, e: '🍣' },
  { match: /taco|burrito|quesadilla/i, e: '🌮' },
  { match: /sandwich|sub/i, e: '🥪' },
  { match: /salad|lettuce|spinach|kale|arugula/i, e: '🥗' },
  { match: /oat|oatmeal|cereal|granola/i, e: '🥣' },
  { match: /soup|broth|stew/i, e: '🥣' },
  { match: /apple/i, e: '🍎' },
  { match: /banana/i, e: '🍌' },
  { match: /orange|tangerine/i, e: '🍊' },
  { match: /grape/i, e: '🍇' },
  { match: /strawberr/i, e: '🍓' },
  { match: /blueberr|raspberr|blackberr/i, e: '🫐' },
  { match: /watermelon/i, e: '🍉' },
  { match: /pineapple/i, e: '🍍' },
  { match: /mango/i, e: '🥭' },
  { match: /peach/i, e: '🍑' },
  { match: /pear/i, e: '🍐' },
  { match: /lemon|lime/i, e: '🍋' },
  { match: /avocado|guacamole/i, e: '🥑' },
  { match: /tomato/i, e: '🍅' },
  { match: /broccoli/i, e: '🥦' },
  { match: /carrot/i, e: '🥕' },
  { match: /corn/i, e: '🌽' },
  { match: /pepper|jalapeno/i, e: '🌶️' },
  { match: /cucumber|pickle/i, e: '🥒' },
  { match: /potato/i, e: '🥔' },
  { match: /sweet potato|yam/i, e: '🍠' },
  { match: /onion/i, e: '🧅' },
  { match: /garlic/i, e: '🧄' },
  { match: /mushroom/i, e: '🍄' },
  { match: /bean|lentil|chickpea/i, e: '🫘' },
  { match: /peanut|almond|cashew|walnut|pistachio|nut/i, e: '🌰' },
  { match: /chocolate|cocoa/i, e: '🍫' },
  { match: /candy|sweet|gummy/i, e: '🍬' },
  { match: /ice cream/i, e: '🍦' },
  { match: /cake|cupcake|muffin/i, e: '🧁' },
  { match: /cookie|biscuit/i, e: '🍪' },
  { match: /donut|doughnut/i, e: '🍩' },
  { match: /pie/i, e: '🥧' },
  { match: /honey/i, e: '🍯' },
  { match: /coffee|latte|espresso|cappuccino/i, e: '☕' },
  { match: /tea|matcha/i, e: '🍵' },
  { match: /juice/i, e: '🧃' },
  { match: /soda|cola|pepsi|coke/i, e: '🥤' },
  { match: /water/i, e: '💧' },
  { match: /beer|ale|lager/i, e: '🍺' },
  { match: /wine/i, e: '🍷' },
  { match: /oil|olive/i, e: '🫒' },
  { match: /tofu|soy/i, e: '🟫' },
  { match: /protein powder|whey/i, e: '🥤' },
];
function guessEmoji(name) {
  for (const { match, e } of EMOJI_MAP) if (match.test(name)) return e;
  return '🍽️';
}

// Pull a nutrient value by trying multiple possible nutrient IDs
function getNutrient(food, ids) {
  if (!food.foodNutrients) return 0;
  for (const id of ids) {
    const n = food.foodNutrients.find(x => x.nutrientId === id || x.nutrient?.id === id);
    if (n) return n.value ?? n.amount ?? 0;
  }
  return 0;
}

// Normalize a USDA food into our app's shape
function normalizeUSDA(food) {
  const name = food.description || food.lowercaseDescription || 'Unknown food';
  const brand = food.brandOwner || food.brandName || food.dataType || 'USDA';
  // USDA data is per 100g for Foundation/SR, per-serving for Branded (but we'll standardize to 100g)
  const kcal = Math.round(getNutrient(food, NUTRIENT_IDS.kcal));
  return {
    id: `usda_${food.fdcId}`,
    fdcId: food.fdcId,
    name: name.length > 60 ? name.slice(0, 57) + '…' : name,
    brand: brand.length > 30 ? brand.slice(0, 27) + '…' : brand,
    per: 100,
    unit: 'g',
    kcal,
    p: +(getNutrient(food, NUTRIENT_IDS.p)).toFixed(1),
    c: +(getNutrient(food, NUTRIENT_IDS.c)).toFixed(1),
    f: +(getNutrient(food, NUTRIENT_IDS.f)).toFixed(1),
    fiber: +(getNutrient(food, NUTRIENT_IDS.fiber)).toFixed(1),
    sugar: +(getNutrient(food, NUTRIENT_IDS.sugar)).toFixed(1),
    sodium: Math.round(getNutrient(food, NUTRIENT_IDS.sodium)),
    emoji: guessEmoji(name),
    source: 'usda',
  };
}

// Search USDA. Returns array of normalized foods. Throws on network error.
async function searchUSDA(query, signal) {
  const url = `${USDA_BASE}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=25&dataType=Foundation,SR%20Legacy,Branded`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`USDA API error: ${res.status}`);
  const data = await res.json();
  return (data.foods || [])
    .map(normalizeUSDA)
    // Filter out foods with no useful macro data
    .filter(f => f.kcal > 0 || f.p > 0 || f.c > 0 || f.f > 0);
}

// ============ OPEN FOOD FACTS API (worldwide, including Gulf brands) ============
// Free, no API key needed. Best for packaged/branded products — including Almarai,
// Al Ain, Baladna, Mai Dubai, and other Gulf-region brands contributed by volunteers.
const OFF_BASE = 'https://world.openfoodfacts.org';

function normalizeOFF(p) {
  const nutriments = p.nutriments || {};
  const name = p.product_name_en || p.product_name || p.generic_name || 'Unknown product';
  const brand = p.brands || p.stores || 'Open Food Facts';
  const kcal = Math.round(
    nutriments['energy-kcal_100g'] ||
    (nutriments['energy_100g'] ? nutriments['energy_100g'] / 4.184 : 0) ||
    0
  );
  return {
    id: `off_${p.code}`,
    name: name.length > 60 ? name.slice(0, 57) + '…' : name,
    brand: brand.length > 30 ? brand.slice(0, 27) + '…' : brand,
    per: 100,
    unit: 'g',
    kcal,
    p: +(nutriments.proteins_100g || 0).toFixed(1),
    c: +(nutriments.carbohydrates_100g || 0).toFixed(1),
    f: +(nutriments.fat_100g || 0).toFixed(1),
    fiber: +(nutriments.fiber_100g || 0).toFixed(1),
    sugar: +(nutriments.sugars_100g || 0).toFixed(1),
    sodium: Math.round((nutriments.sodium_100g || 0) * 1000), // OFF is in g, we want mg
    emoji: guessEmoji(name),
    source: 'off',
  };
}

async function searchOFF(query, signal) {
  // Use the CGI search endpoint — works best for general text queries
  const url = `${OFF_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20&fields=code,product_name,product_name_en,generic_name,brands,stores,nutriments`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`OFF API error: ${res.status}`);
  const data = await res.json();
  return (data.products || [])
    .map(normalizeOFF)
    .filter(f => f.kcal > 0 || f.p > 0 || f.c > 0 || f.f > 0);
}

// Search USDA and Open Food Facts in parallel, merging results.
async function searchRemote(query, signal) {
  const [usda, off] = await Promise.allSettled([
    searchUSDA(query, signal),
    searchOFF(query, signal),
  ]);
  const results = [];
  if (usda.status === 'fulfilled') results.push(...usda.value);
  if (off.status === 'fulfilled') results.push(...off.value);
  // Dedupe by name+brand signature
  const seen = new Set();
  const deduped = [];
  for (const r of results) {
    const key = `${r.name.toLowerCase()}|${r.brand.toLowerCase()}`;
    if (!seen.has(key)) { seen.add(key); deduped.push(r); }
  }
  // If both failed, throw the first error so UI knows
  if (usda.status === 'rejected' && off.status === 'rejected') {
    throw usda.reason;
  }
  return deduped;
}

// ============ BUILT-IN STARTER FOODS ============
// These load instantly and cover the basics — shown as "Common" and seed the Favorites/Recent lists.
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

  // ============ GULF & MIDDLE EASTERN FOODS ============
  // Main dishes
  { id: 101, name: 'Machboos Chicken', brand: 'Qatari / Gulf', per: 300, unit: 'g', kcal: 485, p: 28, c: 58, f: 15, fiber: 2, sugar: 3, sodium: 780, emoji: '🍛' },
  { id: 102, name: 'Machboos Laham', brand: 'Lamb, Gulf', per: 300, unit: 'g', kcal: 560, p: 30, c: 52, f: 23, fiber: 2, sugar: 3, sodium: 820, emoji: '🍛' },
  { id: 103, name: 'Machboos Robyan', brand: 'Shrimp, Gulf', per: 300, unit: 'g', kcal: 410, p: 24, c: 56, f: 10, fiber: 2, sugar: 3, sodium: 920, emoji: '🍤' },
  { id: 104, name: 'Madrouba', brand: 'Qatari porridge rice', per: 300, unit: 'g', kcal: 440, p: 22, c: 62, f: 12, fiber: 2, sugar: 2, sodium: 680, emoji: '🍚' },
  { id: 105, name: 'Harees', brand: 'Wheat & meat', per: 250, unit: 'g', kcal: 320, p: 18, c: 38, f: 10, fiber: 4, sugar: 1, sodium: 540, emoji: '🥣' },
  { id: 106, name: 'Thareed', brand: 'Emirati stew', per: 300, unit: 'g', kcal: 390, p: 19, c: 48, f: 14, fiber: 4, sugar: 4, sodium: 760, emoji: '🥘' },
  { id: 107, name: 'Saloona Laham', brand: 'Meat stew, Gulf', per: 300, unit: 'g', kcal: 340, p: 22, c: 20, f: 18, fiber: 3, sugar: 6, sodium: 680, emoji: '🍲' },
  { id: 108, name: 'Saloona Dajaj', brand: 'Chicken stew', per: 300, unit: 'g', kcal: 290, p: 24, c: 18, f: 13, fiber: 3, sugar: 5, sodium: 640, emoji: '🍲' },
  { id: 109, name: 'Mandi Chicken', brand: 'Yemeni / Gulf', per: 300, unit: 'g', kcal: 520, p: 32, c: 55, f: 18, fiber: 2, sugar: 2, sodium: 720, emoji: '🍗' },
  { id: 110, name: 'Mandi Lamb', brand: 'Yemeni / Gulf', per: 300, unit: 'g', kcal: 610, p: 30, c: 54, f: 28, fiber: 2, sugar: 2, sodium: 760, emoji: '🍖' },
  { id: 111, name: 'Ghuzi', brand: 'Whole lamb rice', per: 300, unit: 'g', kcal: 640, p: 28, c: 56, f: 32, fiber: 2, sugar: 3, sodium: 820, emoji: '🍖' },
  { id: 112, name: 'Biryani Chicken', brand: 'Indian / Gulf', per: 300, unit: 'g', kcal: 510, p: 26, c: 62, f: 16, fiber: 3, sugar: 4, sodium: 820, emoji: '🍛' },
  { id: 113, name: 'Kabsa', brand: 'Saudi / Gulf', per: 300, unit: 'g', kcal: 495, p: 27, c: 58, f: 16, fiber: 2, sugar: 3, sodium: 790, emoji: '🍛' },
  { id: 114, name: 'Mansaf', brand: 'Jordanian', per: 300, unit: 'g', kcal: 580, p: 30, c: 55, f: 25, fiber: 2, sugar: 3, sodium: 860, emoji: '🍖' },
  { id: 115, name: 'Kofta', brand: 'Grilled meat', per: 150, unit: 'g', kcal: 360, p: 22, c: 4, f: 28, fiber: 1, sugar: 1, sodium: 520, emoji: '🥩' },
  { id: 116, name: 'Shish Tawook', brand: 'Grilled chicken', per: 200, unit: 'g', kcal: 380, p: 42, c: 4, f: 22, fiber: 0, sugar: 2, sodium: 620, emoji: '🍢' },
  { id: 117, name: 'Shawarma Chicken', brand: 'Wrap', per: 1, unit: 'wrap', kcal: 520, p: 28, c: 52, f: 22, fiber: 3, sugar: 4, sodium: 980, emoji: '🌯' },
  { id: 118, name: 'Shawarma Beef', brand: 'Wrap', per: 1, unit: 'wrap', kcal: 580, p: 26, c: 50, f: 30, fiber: 3, sugar: 4, sodium: 1050, emoji: '🌯' },
  { id: 119, name: 'Falafel', brand: 'Per piece', per: 17, unit: 'g', kcal: 55, p: 2, c: 5, f: 3, fiber: 1.5, sugar: 0.5, sodium: 85, emoji: '🟤' },
  { id: 120, name: 'Grilled Hamour', brand: 'Gulf fish', per: 200, unit: 'g', kcal: 230, p: 40, c: 0, f: 7, fiber: 0, sugar: 0, sodium: 220, emoji: '🐟' },

  // Breads
  { id: 130, name: 'Khubz Arabi', brand: 'Pita bread', per: 60, unit: 'g', kcal: 165, p: 5.5, c: 33, f: 1.5, fiber: 2, sugar: 1, sodium: 300, emoji: '🫓' },
  { id: 131, name: 'Khubz Rgag', brand: 'Gulf flatbread', per: 40, unit: 'g', kcal: 110, p: 3, c: 22, f: 1, fiber: 1, sugar: 0.5, sodium: 180, emoji: '🫓' },
  { id: 132, name: 'Chapati', brand: 'Wheat flatbread', per: 50, unit: 'g', kcal: 140, p: 4, c: 28, f: 2, fiber: 2, sugar: 1, sodium: 200, emoji: '🫓' },
  { id: 133, name: 'Khubz Jibin', brand: 'Cheese bread', per: 100, unit: 'g', kcal: 310, p: 11, c: 40, f: 11, fiber: 2, sugar: 3, sodium: 620, emoji: '🥖' },

  // Mezze / cold dishes
  { id: 140, name: 'Hummus', brand: 'Chickpea dip', per: 100, unit: 'g', kcal: 170, p: 5, c: 14, f: 10, fiber: 4, sugar: 0.5, sodium: 380, emoji: '🫓' },
  { id: 141, name: 'Baba Ghanoush', brand: 'Eggplant dip', per: 100, unit: 'g', kcal: 120, p: 3, c: 8, f: 9, fiber: 3, sugar: 3, sodium: 300, emoji: '🍆' },
  { id: 142, name: 'Mutabbal', brand: 'Eggplant tahini', per: 100, unit: 'g', kcal: 140, p: 3.5, c: 7, f: 11, fiber: 3, sugar: 2, sodium: 340, emoji: '🍆' },
  { id: 143, name: 'Tabbouleh', brand: 'Parsley salad', per: 150, unit: 'g', kcal: 130, p: 3, c: 14, f: 7, fiber: 4, sugar: 2, sodium: 280, emoji: '🥗' },
  { id: 144, name: 'Fattoush', brand: 'Levantine salad', per: 200, unit: 'g', kcal: 180, p: 4, c: 20, f: 10, fiber: 5, sugar: 5, sodium: 340, emoji: '🥗' },
  { id: 145, name: 'Foul Medames', brand: 'Fava beans', per: 200, unit: 'g', kcal: 230, p: 14, c: 30, f: 6, fiber: 10, sugar: 2, sodium: 420, emoji: '🫘' },
  { id: 146, name: 'Mhammara', brand: 'Pepper walnut dip', per: 100, unit: 'g', kcal: 200, p: 4, c: 12, f: 15, fiber: 3, sugar: 4, sodium: 260, emoji: '🌶️' },
  { id: 147, name: 'Labneh', brand: 'Strained yogurt', per: 100, unit: 'g', kcal: 140, p: 7, c: 5, f: 10, fiber: 0, sugar: 4, sodium: 50, emoji: '🥛' },
  { id: 148, name: 'Laban', brand: 'Gulf drinking yogurt', per: 250, unit: 'ml', kcal: 110, p: 8, c: 12, f: 3, fiber: 0, sugar: 12, sodium: 120, emoji: '🥛' },

  // Snacks & sweets
  { id: 160, name: 'Luqaimat', brand: 'Sweet fritters', per: 100, unit: 'g', kcal: 360, p: 4, c: 58, f: 13, fiber: 1, sugar: 34, sodium: 80, emoji: '🍩' },
  { id: 161, name: 'Basbousa', brand: 'Semolina cake', per: 100, unit: 'g', kcal: 340, p: 5, c: 52, f: 13, fiber: 1, sugar: 34, sodium: 140, emoji: '🍰' },
  { id: 162, name: 'Kunafa', brand: 'Cheese pastry', per: 100, unit: 'g', kcal: 380, p: 8, c: 44, f: 20, fiber: 1, sugar: 26, sodium: 220, emoji: '🧀' },
  { id: 163, name: 'Umm Ali', brand: 'Bread pudding', per: 200, unit: 'g', kcal: 480, p: 10, c: 56, f: 24, fiber: 2, sugar: 32, sodium: 180, emoji: '🍮' },
  { id: 164, name: 'Baklava', brand: 'Per piece', per: 30, unit: 'g', kcal: 130, p: 2, c: 15, f: 7, fiber: 0.5, sugar: 11, sodium: 40, emoji: '🥮' },
  { id: 165, name: 'Maamoul (Date)', brand: 'Per piece', per: 25, unit: 'g', kcal: 95, p: 1.5, c: 14, f: 4, fiber: 1, sugar: 8, sodium: 20, emoji: '🍪' },
  { id: 166, name: 'Medjool Dates', brand: 'Per piece', per: 24, unit: 'g', kcal: 66, p: 0.4, c: 18, f: 0, fiber: 1.6, sugar: 16, sodium: 0, emoji: '🫐' },
  { id: 167, name: 'Halwa', brand: 'Omani / Gulf', per: 50, unit: 'g', kcal: 220, p: 1, c: 38, f: 8, fiber: 0.5, sugar: 32, sodium: 30, emoji: '🍯' },

  // Drinks
  { id: 180, name: 'Karak Chai', brand: 'Gulf milk tea', per: 250, unit: 'ml', kcal: 160, p: 4, c: 22, f: 6, fiber: 0, sugar: 20, sodium: 70, emoji: '☕' },
  { id: 181, name: 'Arabic Coffee', brand: 'Qahwa', per: 80, unit: 'ml', kcal: 5, p: 0, c: 1, f: 0, fiber: 0, sugar: 0, sodium: 4, emoji: '☕' },
  { id: 182, name: 'Fresh Lemon Mint', brand: 'Juice', per: 300, unit: 'ml', kcal: 120, p: 0.5, c: 30, f: 0, fiber: 1, sugar: 26, sodium: 10, emoji: '🍋' },
  { id: 183, name: 'Jallab', brand: 'Date molasses drink', per: 300, unit: 'ml', kcal: 190, p: 1, c: 47, f: 0, fiber: 1, sugar: 42, sodium: 20, emoji: '🥤' },
  { id: 184, name: 'Tamr Hindi', brand: 'Tamarind drink', per: 300, unit: 'ml', kcal: 140, p: 0.5, c: 34, f: 0, fiber: 1, sugar: 30, sodium: 15, emoji: '🥤' },
];

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
const greeting = () => {
  const h = new Date().getHours();
  if (h < 5) return 'Late night';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 22) return 'Good evening';
  return 'Good night';
};
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

// ============ THEMES ============
const lightTheme = {
  bg: '#F6F7F5',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F2EF',
  text: '#1A1F1C',
  textSub: '#5C6560',
  textMuted: '#95A098',
  border: '#E5E8E3',
  accent: '#10B981',          // emerald
  accentSoft: 'rgba(16, 185, 129, 0.1)',
  accentDeep: '#059669',
  accentLeaf: '#34D399',
  blue: '#3B82F6',
  orange: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  toast: '#1A1F1C',
  toastText: '#fff',
};

const darkTheme = {
  bg: '#0B0F0C',
  surface: '#151A16',
  surfaceAlt: '#1F2521',
  text: '#F6F7F5',
  textSub: '#A8B0AA',
  textMuted: '#6B7670',
  border: '#252B27',
  accent: '#34D399',
  accentSoft: 'rgba(52, 211, 153, 0.12)',
  accentDeep: '#10B981',
  accentLeaf: '#6EE7B7',
  blue: '#60A5FA',
  orange: '#FBBF24',
  red: '#F87171',
  purple: '#A78BFA',
  pink: '#F472B6',
  toast: '#F6F7F5',
  toastText: '#0B0F0C',
};

// ============ MAIN APP ============
export default function Fitora() {
  const [dark, setDark] = useStorage('fitora_dark', false);
  const [tab, setTab] = useState('today');
  const [date, setDate] = useState(todayKey());
  const [logs, setLogs] = useStorage('fitora_logs', {});
  const [favorites, setFavorites] = useStorage('fitora_favs', [1, 2, 9, 22]);
  const [recent, setRecent] = useStorage('fitora_recent', [1, 9, 22, 3]);
  const [goals, setGoals] = useStorage('fitora_goals', { kcal: 2200, p: 150, c: 230, f: 75, type: 'maintenance' });
  const [weight, setWeight] = useStorage('fitora_weight', [
    { date: todayKey(), kg: 75.2 },
  ]);
  const [streak, setStreak] = useStorage('fitora_streak', 0);
  const [showSearch, setShowSearch] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [showGoals, setShowGoals] = useState(false);
  const [toast, setToast] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installDismissed, setInstallDismissed] = useStorage('fitora_install_dismissed', false);
  const [showIOSInstall, setShowIOSInstall] = useStorage('fitora_ios_install_shown', false);

  // Listen for the install-prompt event (Android/Chrome/Edge)
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Detect iOS Safari (no beforeinstallprompt support, needs manual instructions)
  const isIOS = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }, []);
  const isInStandaloneMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }, []);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  const dayLog = logs[date] || [];

  const showToast = (msg, emoji = '✓') => {
    setToast({ msg, emoji, id: Date.now() });
    setTimeout(() => setToast(null), 2000);
  };

  const totals = useMemo(() => {
    return dayLog.reduce((a, e) => ({
      kcal: a.kcal + e.kcal, p: a.p + e.p, c: a.c + e.c, f: a.f + e.f,
      fiber: a.fiber + e.fiber, sugar: a.sugar + e.sugar, sodium: a.sodium + e.sodium,
    }), { kcal: 0, p: 0, c: 0, f: 0, fiber: 0, sugar: 0, sodium: 0 });
  }, [dayLog]);

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
      // Snapshot the per-unit values so we can rescale without needing the original food object
      _per: food.per,
      _kcal: food.kcal, _p: food.p, _c: food.c, _f: food.f,
      _fiber: food.fiber, _sugar: food.sugar, _sodium: food.sodium,
      ...sc,
    };
    setLogs({ ...logs, [date]: [...(logs[date] || []), entry] });
    // Only seed Recent with numeric IDs (built-in foods) — USDA foods have string IDs
    if (typeof food.id === 'number') {
      setRecent([food.id, ...recent.filter(id => id !== food.id)].slice(0, 10));
    }
    showToast(`${food.name} logged`, food.emoji);
  };

  const removeEntry = (id) => {
    setLogs({ ...logs, [date]: dayLog.filter(e => e.id !== id) });
  };

  const updateEntry = (id, newAmount) => {
    const entry = dayLog.find(e => e.id === id);
    if (!entry) return;
    // Rescale from the stored per-unit values (works for both built-in and USDA foods)
    const basis = {
      per: entry._per || 100,
      kcal: entry._kcal ?? entry.kcal,
      p: entry._p ?? entry.p, c: entry._c ?? entry.c, f: entry._f ?? entry.f,
      fiber: entry._fiber ?? entry.fiber, sugar: entry._sugar ?? entry.sugar,
      sodium: entry._sodium ?? entry.sodium,
    };
    const sc = scale(basis, newAmount);
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
      paddingBottom: '110px',
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Inter+Tight:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
        input, textarea { font-family: inherit; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }
        .serif { font-family: 'Fraunces', 'Instrument Serif', serif; font-weight: 500; letter-spacing: -0.02em; }
        .tabular { font-variant-numeric: tabular-nums; font-feature-settings: 'tnum'; }
      `}</style>

      <Header
        theme={theme} dark={dark} setDark={setDark} streak={streak}
        date={date} setDate={setDate}
      />

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
                onEditGoals={() => setShowGoals(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {tab === 'today' && (
        <motion.button
          onClick={() => setShowSearch(true)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05, rotate: 90 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          style={{
            position: 'fixed', bottom: '100px', right: '20px', zIndex: 50,
            width: '60px', height: '60px', borderRadius: '20px',
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDeep})`,
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: dark
              ? `0 10px 30px rgba(52, 211, 153, 0.35), 0 2px 6px rgba(0,0,0,0.3)`
              : `0 10px 30px rgba(16, 185, 129, 0.35), 0 2px 6px rgba(0,0,0,0.05)`,
          }}
        >
          <Plus size={28} strokeWidth={2.5} />
        </motion.button>
      )}

      <TabBar theme={theme} tab={tab} setTab={setTab} />

      <AnimatePresence>
        {showSearch && (
          <SearchModal
            theme={theme} onClose={() => setShowSearch(false)}
            favorites={favorites} recent={recent}
            onToggleFav={toggleFav} onAdd={addEntry}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editEntry && (
          <EditModal
            theme={theme} entry={editEntry} onClose={() => setEditEntry(null)}
            onUpdate={(amt) => { updateEntry(editEntry.id, amt); setEditEntry(null); }}
            onRemove={() => { removeEntry(editEntry.id); setEditEntry(null); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGoals && (
          <GoalsModal theme={theme} goals={goals} setGoals={setGoals} onClose={() => setShowGoals(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ y: 80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{
              position: 'fixed', bottom: '180px', left: '50%', transform: 'translateX(-50%)',
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

      {/* Install banner: shown when installable and not already installed/dismissed */}
      <AnimatePresence>
        {!isInStandaloneMode && !installDismissed && (installPrompt || (isIOS && !showIOSInstall)) && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, delay: 2 }}
            style={{
              position: 'fixed', bottom: '100px', left: '16px', right: '16px',
              maxWidth: '448px', margin: '0 auto',
              background: theme.surface,
              border: `1px solid ${theme.accent}33`,
              borderRadius: '20px', padding: '14px',
              display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              zIndex: 45,
            }}
          >
            <img src="/logo-mark.png" alt="" width={40} height={40} style={{ borderRadius: '10px', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.2 }}>Install Fitora</div>
              <div style={{ fontSize: '12px', color: theme.textSub, marginTop: '2px', lineHeight: 1.3 }}>
                Add to your home screen · works offline
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={async () => {
                if (installPrompt) {
                  installPrompt.prompt();
                  const { outcome } = await installPrompt.userChoice;
                  if (outcome === 'accepted') setInstallPrompt(null);
                } else if (isIOS) {
                  setShowIOSHelp(true);
                  setShowIOSInstall(true);
                }
              }}
              style={{
                padding: '9px 16px', borderRadius: '100px',
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDeep})`,
                color: '#fff', fontSize: '13px', fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              Install
            </motion.button>
            <button
              onClick={() => setInstallDismissed(true)}
              style={{
                width: '28px', height: '28px', display: 'grid', placeItems: 'center',
                color: theme.textMuted,
              }}
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS install instructions sheet */}
      <AnimatePresence>
        {showIOSHelp && (
          <IOSInstallSheet theme={theme} onClose={() => setShowIOSHelp(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ iOS INSTALL SHEET ============
function IOSInstallSheet({ theme, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        zIndex: 110,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '480px',
          background: theme.bg, borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
          padding: '14px 24px 32px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <div style={{ width: '36px', height: '4px', background: theme.border, borderRadius: '100px' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <img src="/logo-mark.png" alt="" width={60} height={60} style={{ borderRadius: '16px' }} />
        </div>
        <div className="serif" style={{ fontSize: '26px', textAlign: 'center', marginBottom: '6px' }}>
          Install Fitora
        </div>
        <div style={{ fontSize: '13px', color: theme.textSub, textAlign: 'center', marginBottom: '22px', lineHeight: 1.5 }}>
          Add Fitora to your home screen — works offline, no browser bar.
        </div>

        <IOSStep theme={theme} num="1" text={<>Tap the <b>Share</b> button <span style={{ display: 'inline-block', verticalAlign: 'middle', padding: '2px 6px', background: theme.surfaceAlt, borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>⬆︎</span> at the bottom of Safari.</>} />
        <IOSStep theme={theme} num="2" text={<>Scroll and tap <b>Add to Home Screen</b>.</>} />
        <IOSStep theme={theme} num="3" text={<>Tap <b>Add</b> in the top right. The Fitora icon will appear on your home screen.</>} last />

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          style={{
            width: '100%', marginTop: '20px', padding: '14px', borderRadius: '14px',
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDeep})`,
            color: '#fff', fontWeight: 700, fontSize: '14px',
          }}
        >
          Got it
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function IOSStep({ theme, num, text, last }) {
  return (
    <div style={{
      display: 'flex', gap: '14px', alignItems: 'flex-start',
      padding: '12px 0',
      borderBottom: last ? 'none' : `1px solid ${theme.border}`,
    }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        background: theme.accentSoft, color: theme.accent,
        display: 'grid', placeItems: 'center',
        fontSize: '13px', fontWeight: 700, flexShrink: 0,
      }}>
        {num}
      </div>
      <div style={{ fontSize: '14px', lineHeight: 1.5, flex: 1, paddingTop: '3px' }}>
        {text}
      </div>
    </div>
  );
}

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
      maxWidth: '480px', margin: '0 auto', padding: '16px 20px 8px',
    }}>
      {/* Top strip: logo, streak, dark toggle */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FitoraLogo size={34} color={theme.accent} accent={theme.accentLeaf} />
          <FitoraWordmark theme={theme} size={22} />
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '7px 12px', borderRadius: '100px',
                background: 'linear-gradient(135deg, #FF6B35, #F59E0B)',
                color: '#fff', fontSize: '13px', fontWeight: 700,
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              }}
            >
              <span style={{ fontSize: '14px' }}>🔥</span> {streak}
            </motion.div>
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setDark(!dark)}
            style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: theme.surface, display: 'grid', placeItems: 'center',
              border: `1px solid ${theme.border}`,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={dark ? 'sun' : 'moon'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Date selector */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: theme.surface, borderRadius: '14px',
        padding: '6px', border: `1px solid ${theme.border}`,
      }}>
        <button
          onClick={() => changeDate(-1)}
          style={{
            width: '36px', height: '36px', borderRadius: '10px',
            display: 'grid', placeItems: 'center',
          }}
        >
          <ChevronLeft size={16} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {isToday ? `${greeting()}` : fmtDate(date)}
          </div>
          <div style={{ fontSize: '15px', fontWeight: 600, marginTop: '1px' }}>
            {isToday
              ? new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
              : new Date(date + 'T00:00:00').toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
          </div>
        </div>
        <button
          onClick={() => changeDate(1)}
          disabled={isToday}
          style={{
            width: '36px', height: '36px', borderRadius: '10px',
            display: 'grid', placeItems: 'center',
            opacity: isToday ? 0.3 : 1,
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </header>
  );
}

// ============ TODAY VIEW ============
function TodayView({ theme, totals, goals, dayLog, date, onOpenSearch, onEditEntry, onEditGoals, onRemove }) {
  const pct = Math.min(100, (totals.kcal / goals.kcal) * 100);
  const remaining = Math.max(0, goals.kcal - totals.kcal);
  const over = totals.kcal > goals.kcal;

  const meals = useMemo(() => {
    const m = { breakfast: [], lunch: [], dinner: [], snack: [] };
    dayLog.forEach(e => { (m[e.meal] || m.snack).push(e); });
    return m;
  }, [dayLog]);

  const mealInfo = [
    { key: 'breakfast', label: 'Breakfast', emoji: '🌅', time: '7 – 10 am' },
    { key: 'lunch', label: 'Lunch', emoji: '☀️', time: '12 – 2 pm' },
    { key: 'dinner', label: 'Dinner', emoji: '🌙', time: '6 – 9 pm' },
    { key: 'snack', label: 'Snacks', emoji: '🍎', time: 'Anytime' },
  ];

  const coaching = useMemo(() => getCoaching(totals, goals, dayLog), [totals, goals, dayLog]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '6px' }}>
      {/* Hero: Calorie ring */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={onEditGoals}
        style={{
          position: 'relative',
          background: theme.surface,
          borderRadius: '28px', padding: '28px 24px',
          border: `1px solid ${theme.border}`, cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        {/* Decorative gradient background */}
        <div style={{
          position: 'absolute', top: '-40%', right: '-20%',
          width: '300px', height: '300px',
          background: `radial-gradient(circle, ${theme.accentSoft}, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', position: 'relative' }}>
          <CalorieRing theme={theme} pct={pct} totals={totals} goals={goals} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              {over ? 'Over by' : 'Remaining'}
            </div>
            <div className="tabular serif" style={{ fontSize: '44px', lineHeight: 1, marginTop: '4px', color: over ? theme.red : theme.text }}>
              {over ? totals.kcal - goals.kcal : remaining}
            </div>
            <div style={{ fontSize: '13px', color: theme.textSub, marginTop: '6px' }}>
              of {goals.kcal.toLocaleString()} kcal
            </div>
            <div style={{
              marginTop: '14px',
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '4px 10px', borderRadius: '100px',
              background: theme.accentSoft, color: theme.accent,
              fontSize: '11px', fontWeight: 700,
            }}>
              <Target size={11} strokeWidth={2.5} />
              {goals.type === 'loss' ? 'Fat loss' : goals.type === 'gain' ? 'Muscle gain' : 'Maintenance'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Macros card */}
      <div style={{
        background: theme.surface, borderRadius: '24px', padding: '20px',
        border: `1px solid ${theme.border}`,
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px',
      }}>
        <MacroBar theme={theme} label="Protein" value={totals.p} goal={goals.p} color={theme.red} icon={<Drumstick size={13} strokeWidth={2.3} />} />
        <MacroBar theme={theme} label="Carbs" value={totals.c} goal={goals.c} color={theme.orange} icon={<Wheat size={13} strokeWidth={2.3} />} />
        <MacroBar theme={theme} label="Fat" value={totals.f} goal={goals.f} color={theme.purple} icon={<Droplet size={13} strokeWidth={2.3} />} />
      </div>

      {/* Coach card */}
      {dayLog.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            position: 'relative', overflow: 'hidden',
            background: `linear-gradient(135deg, ${theme.accentSoft}, ${theme.surface})`,
            border: `1px solid ${theme.accent}33`,
            borderRadius: '20px', padding: '16px',
            display: 'flex', gap: '12px', alignItems: 'flex-start',
          }}
        >
          <div style={{
            width: '36px', height: '36px', borderRadius: '12px',
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDeep})`,
            display: 'grid', placeItems: 'center',
            flexShrink: 0, color: '#fff',
            boxShadow: `0 4px 12px ${theme.accent}40`,
          }}>
            <Sparkles size={17} strokeWidth={2.3} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: theme.accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '3px' }}>
              Coach
            </div>
            <div style={{ fontSize: '13.5px', color: theme.text, lineHeight: 1.5, fontWeight: 500 }}>{coaching}</div>
          </div>
        </motion.div>
      )}

      {/* Quick Log */}
      <div style={{
        background: theme.surface, borderRadius: '24px', padding: '18px 16px',
        border: `1px solid ${theme.border}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', padding: '0 4px' }}>
          <div style={{ fontSize: '11px', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
            Quick log
          </div>
          <div style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 600 }}>
            Log in seconds
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <QuickBtn theme={theme} icon={<Search size={18} strokeWidth={2.3} />} label="Search" onClick={onOpenSearch} />
          <QuickBtn theme={theme} icon={<Barcode size={18} strokeWidth={2.3} />} label="Scan" onClick={onOpenSearch} />
          <QuickBtn theme={theme} icon={<Mic size={18} strokeWidth={2.3} />} label="Voice" onClick={onOpenSearch} />
        </div>
      </div>

      {/* Meals */}
      {mealInfo.map((m, i) => (
        <motion.div
          key={m.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i, duration: 0.3 }}
        >
          <MealSection
            theme={theme} info={m} entries={meals[m.key] || []}
            onAdd={onOpenSearch} onEdit={onEditEntry} onRemove={onRemove}
          />
        </motion.div>
      ))}

      {dayLog.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{
            padding: '40px 20px 20px', textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🍽️</div>
          <div className="serif" style={{ fontSize: '22px', color: theme.text, marginBottom: '4px' }}>A fresh start.</div>
          <div style={{ fontSize: '14px', color: theme.textSub }}>
            Tap the <Plus size={12} style={{ display: 'inline', verticalAlign: 'middle', color: theme.accent }} /> to log your first meal.
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ============ CALORIE RING ============
function CalorieRing({ theme, pct, totals, goals }) {
  const R = 58, C = 2 * Math.PI * R;
  const dash = (pct / 100) * C;
  const over = totals.kcal > goals.kcal;

  return (
    <div style={{ position: 'relative', width: '146px', height: '146px', flexShrink: 0 }}>
      <svg width="146" height="146" style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={over ? theme.red : theme.accent} />
            <stop offset="100%" stopColor={over ? '#DC2626' : theme.accentDeep} />
          </linearGradient>
        </defs>
        <circle cx="73" cy="73" r={R} fill="none" stroke={theme.border} strokeWidth="11" />
        <motion.circle
          cx="73" cy="73" r={R} fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="11" strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C - dash }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <motion.div
          className="tabular"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', damping: 15 }}
          style={{ fontSize: '30px', fontWeight: 700, lineHeight: 1 }}
        >
          {totals.kcal}
        </motion.div>
        <div style={{ fontSize: '10px', color: theme.textMuted, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>
          kcal
        </div>
        <div style={{ marginTop: '6px', fontSize: '10px', color: theme.textMuted, fontWeight: 600 }}>
          {Math.round(pct)}%
        </div>
      </div>
    </div>
  );
}

function MacroBar({ theme, label, value, goal, color, icon }) {
  const pct = Math.min(100, (value / goal) * 100);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', color }}>
        {icon}
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{label}</div>
      </div>
      <div className="tabular" style={{ fontSize: '19px', fontWeight: 700, lineHeight: 1 }}>
        {Math.round(value)}<span style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 500 }}>/{goal}g</span>
      </div>
      <div style={{ marginTop: '8px', height: '5px', background: theme.border, borderRadius: '100px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${color}AA, ${color})`,
            borderRadius: '100px',
          }}
        />
      </div>
    </div>
  );
}

function QuickBtn({ theme, icon, label, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      style={{
        padding: '16px 8px', borderRadius: '16px',
        background: theme.surfaceAlt,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        color: theme.text, fontWeight: 600, fontSize: '12px',
        border: `1px solid transparent`,
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.accent + '40'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
    >
      <div style={{ color: theme.accent }}>{icon}</div>
      {label}
    </motion.button>
  );
}

function MealSection({ theme, info, entries, onAdd, onEdit, onRemove }) {
  const sum = entries.reduce((a, e) => a + e.kcal, 0);
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{
      background: theme.surface, borderRadius: '24px',
      border: `1px solid ${theme.border}`, overflow: 'hidden',
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px',
          textAlign: 'left',
        }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: theme.surfaceAlt,
          display: 'grid', placeItems: 'center', fontSize: '20px',
        }}>{info.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '15px', fontWeight: 700 }}>{info.label}</div>
          <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '1px' }}>
            {entries.length > 0 ? `${entries.length} item${entries.length > 1 ? 's' : ''}` : info.time}
          </div>
        </div>
        {sum > 0 && (
          <div className="tabular" style={{
            padding: '4px 10px', borderRadius: '100px',
            background: theme.accentSoft, color: theme.accent,
            fontSize: '12px', fontWeight: 700,
          }}>
            {sum} kcal
          </div>
        )}
        <motion.div animate={{ rotate: expanded ? 0 : -90 }}>
          <ChevronDown size={16} color={theme.textMuted} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 12px 12px' }}>
              <AnimatePresence>
                {entries.map(e => (
                  <EntryRow key={e.id} theme={theme} entry={e} onEdit={() => onEdit(e)} onRemove={() => onRemove(e.id)} />
                ))}
              </AnimatePresence>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onAdd}
                style={{
                  width: '100%', padding: '12px', marginTop: entries.length ? '6px' : '2px',
                  border: `1.5px dashed ${theme.border}`, borderRadius: '14px',
                  color: theme.textSub, fontSize: '13px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                <Plus size={14} strokeWidth={2.3} /> Add food
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EntryRow({ theme, entry, onEdit, onRemove }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      whileTap={{ scale: 0.99 }}
      onClick={onEdit}
      style={{
        width: '100%', padding: '10px 12px', borderRadius: '14px',
        display: 'flex', alignItems: 'center', gap: '12px',
        marginTop: '4px', textAlign: 'left',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = theme.surfaceAlt}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: theme.surfaceAlt,
        display: 'grid', placeItems: 'center', fontSize: '18px',
        flexShrink: 0,
      }}>{entry.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {entry.name}
        </div>
        <div className="tabular" style={{ fontSize: '12px', color: theme.textMuted, marginTop: '1px' }}>
          {entry.amount}{entry.unit} · P{Math.round(entry.p)} C{Math.round(entry.c)} F{Math.round(entry.f)}
        </div>
      </div>
      <div className="tabular" style={{ fontSize: '14px', fontWeight: 700 }}>{entry.kcal}</div>
    </motion.button>
  );
}

// ============ SEARCH MODAL ============
function SearchModal({ theme, onClose, favorites, recent, onToggleFav, onAdd }) {
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);
  const [meal, setMeal] = useState(guessMeal());
  const [amount, setAmount] = useState(0);
  const [remoteResults, setRemoteResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    if (selected) setAmount(selected.per);
  }, [selected]);

  // Local (built-in) matches — shown instantly
  const localResults = useMemo(() => {
    if (!q.trim()) return [];
    const ql = q.toLowerCase();
    return FOOD_DB.filter(f =>
      f.name.toLowerCase().includes(ql) || f.brand.toLowerCase().includes(ql)
    ).slice(0, 6);
  }, [q]);

  // USDA search — debounced, 280ms after last keystroke
  useEffect(() => {
    if (!q.trim() || q.trim().length < 2) {
      setRemoteResults([]);
      setLoading(false);
      setError(null);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const timer = setTimeout(async () => {
      try {
        const results = await searchRemote(q.trim(), controller.signal);
        // Dedupe anything already shown in local
        const localNames = new Set(localResults.map(f => f.name.toLowerCase()));
        setRemoteResults(results.filter(f => !localNames.has(f.name.toLowerCase())));
        setLoading(false);
      } catch (e) {
        if (e.name !== 'AbortError') {
          setError(e.message || 'Could not reach USDA');
          setLoading(false);
        }
      }
    }, 280);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, localResults]);

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
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 100,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '480px',
          background: theme.bg, borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
          height: '88vh', display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ padding: '10px 0 0', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '4px', background: theme.border, borderRadius: '100px' }} />
        </div>

        {!selected ? (
          <>
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
                  placeholder="Search foods..."
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                    color: theme.text, fontSize: '15px',
                  }}
                />
                {q && (
                  <button onClick={() => setQ('')}><X size={14} color={theme.textMuted} /></button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '2px' }}>
                <QuickPill theme={theme} icon={<Barcode size={13} />} label="Scan barcode" />
                <QuickPill theme={theme} icon={<Mic size={13} />} label="Voice" />
                <QuickPill theme={theme} icon={<Camera size={13} />} label="Photo" />
              </div>
            </div>

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
                  {/* Local (built-in) common foods */}
                  {localResults.length > 0 && (
                    <Section theme={theme} title="Common" icon="⚡">
                      {localResults.map(f => (
                        <FoodRow key={f.id} theme={theme} food={f} onSelect={() => setSelected(f)}
                          favored={favorites.includes(f.id)} onFav={() => onToggleFav(f.id)} />
                      ))}
                    </Section>
                  )}

                  {/* USDA remote results */}
                  {loading && (
                    <div style={{
                      marginTop: '18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      padding: '24px', color: theme.textSub, fontSize: '13px',
                    }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{
                          width: '16px', height: '16px', borderRadius: '50%',
                          border: `2px solid ${theme.border}`,
                          borderTopColor: theme.accent,
                        }}
                      />
                      Searching global databases…
                    </div>
                  )}

                  {!loading && error && (
                    <div style={{
                      marginTop: '18px', padding: '16px',
                      background: theme.red + '10', borderRadius: '14px',
                      border: `1px solid ${theme.red}33`,
                      color: theme.red, fontSize: '13px', textAlign: 'center',
                    }}>
                      Couldn't reach food databases. Check your connection.
                    </div>
                  )}

                  {!loading && !error && remoteResults.length > 0 && (
                    <Section theme={theme} title="Global Database" icon="🌐">
                      {remoteResults.map(f => (
                        <FoodRow key={f.id} theme={theme} food={f} onSelect={() => setSelected(f)}
                          favored={favorites.includes(f.id)} onFav={() => onToggleFav(f.id)} />
                      ))}
                    </Section>
                  )}

                  {!loading && !error && localResults.length === 0 && remoteResults.length === 0 && q.trim().length >= 2 && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: theme.textSub }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                      <div style={{ fontSize: '14px' }}>No matches for "{q}"</div>
                    </div>
                  )}

                  {q.trim().length === 1 && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: theme.textMuted, fontSize: '13px' }}>
                      Keep typing…
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
      <div style={{
        width: '40px', height: '40px', borderRadius: '11px',
        background: theme.surfaceAlt,
        display: 'grid', placeItems: 'center', fontSize: '20px',
        flexShrink: 0,
      }}>{food.emoji}</div>
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
      flexShrink: 0,
    }}>
      {icon} {label}
    </div>
  );
}

function FoodDetail({ theme, food, amount, setAmount, meal, setMeal, onBack, onAdd }) {
  const sc = scale(food, amount);
  const presets = food.unit === 'g' ? [50, 100, 150, 200, 250] :
    food.unit === 'ml' ? [100, 250, 350, 500] : [0.5, 1, 2, 3];
  const step = food.unit === 'item' ? 0.5 : 10;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={onBack} style={{
          width: '36px', height: '36px', borderRadius: '11px',
          background: theme.surface, display: 'grid', placeItems: 'center',
          border: `1px solid ${theme.border}`,
        }}>
          <ChevronLeft size={16} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {food.name}
          </div>
          <div style={{ fontSize: '12px', color: theme.textMuted }}>{food.brand}</div>
        </div>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: theme.surfaceAlt, display: 'grid', placeItems: 'center',
          fontSize: '26px',
        }}>{food.emoji}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px' }}>
        <div style={{
          background: `linear-gradient(135deg, ${theme.accentSoft}, ${theme.surface})`,
          borderRadius: '20px', padding: '20px',
          border: `1px solid ${theme.accent}33`,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', textAlign: 'center',
        }}>
          <Stat theme={theme} label="kcal" value={sc.kcal} color={theme.accent} />
          <Stat theme={theme} label="P" value={sc.p + 'g'} color={theme.red} />
          <Stat theme={theme} label="C" value={sc.c + 'g'} color={theme.orange} />
          <Stat theme={theme} label="F" value={sc.f + 'g'} color={theme.purple} />
        </div>

        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
            Amount
          </div>
          <div style={{
            background: theme.surface, borderRadius: '16px', padding: '16px 20px',
            border: `1px solid ${theme.border}`,
            display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setAmount(Math.max(1, amount - step))} style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: theme.surfaceAlt, display: 'grid', placeItems: 'center',
            }}>
              <Minus size={16} />
            </motion.button>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div className="tabular serif" style={{ fontSize: '32px', lineHeight: 1 }}>{amount}</div>
              <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '4px' }}>{food.unit}</div>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setAmount(amount + step)} style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: theme.surfaceAlt, display: 'grid', placeItems: 'center',
            }}>
              <Plus size={16} />
            </motion.button>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {presets.map(p => (
              <motion.button
                key={p}
                whileTap={{ scale: 0.94 }}
                onClick={() => setAmount(p)}
                style={{
                  padding: '8px 14px', borderRadius: '100px',
                  background: amount === p ? theme.accent : theme.surface,
                  color: amount === p ? '#fff' : theme.text,
                  border: `1px solid ${amount === p ? theme.accent : theme.border}`,
                  fontSize: '13px', fontWeight: 600, flexShrink: 0,
                }}
              >
                {p}{food.unit}
              </motion.button>
            ))}
          </div>
        </div>

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
              <motion.button
                key={m.k} whileTap={{ scale: 0.96 }}
                onClick={() => setMeal(m.k)}
                style={{
                  padding: '12px 4px', borderRadius: '14px',
                  background: meal === m.k ? theme.accentSoft : theme.surface,
                  border: `1px solid ${meal === m.k ? theme.accent : theme.border}`,
                  color: meal === m.k ? theme.accent : theme.text,
                  fontSize: '11px', fontWeight: 600,
                  display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '18px' }}>{m.e}</span>
                {m.l}
              </motion.button>
            ))}
          </div>
        </div>

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
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDeep})`,
            color: '#fff',
            fontSize: '15px', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: `0 4px 14px ${theme.accent}50`,
          }}
        >
          <Check size={18} strokeWidth={3} /> Log {sc.kcal} kcal
        </motion.button>
      </div>
    </div>
  );
}

function Stat({ theme, label, value, color }) {
  return (
    <div>
      <div className="tabular" style={{ fontSize: '20px', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '10px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>{label}</div>
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
  // Use stored per-unit values (works for both built-in and USDA foods)
  const basis = {
    per: entry._per || 100,
    kcal: entry._kcal ?? entry.kcal,
    p: entry._p ?? entry.p, c: entry._c ?? entry.c, f: entry._f ?? entry.f,
    fiber: entry._fiber ?? entry.fiber, sugar: entry._sugar ?? entry.sugar,
    sodium: entry._sodium ?? entry.sodium,
  };
  const sc = scale(basis, amount);
  const step = entry.unit === 'item' ? 0.5 : 10;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: theme.surface, borderRadius: '24px', padding: '24px',
          width: '100%', maxWidth: '360px',
          border: `1px solid ${theme.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: theme.surfaceAlt, display: 'grid', placeItems: 'center',
            fontSize: '26px',
          }}>{entry.emoji}</div>
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
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setAmount(Math.max(1, amount - step))} style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: theme.surface, display: 'grid', placeItems: 'center',
          }}>
            <Minus size={16} />
          </motion.button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div className="tabular serif" style={{ fontSize: '28px' }}>{amount}{entry.unit}</div>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setAmount(amount + step)} style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: theme.surface, display: 'grid', placeItems: 'center',
          }}>
            <Plus size={16} />
          </motion.button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.button whileTap={{ scale: 0.96 }} onClick={onRemove} style={{
            flex: 1, padding: '14px', borderRadius: '14px',
            background: theme.red + '1a', color: theme.red,
            fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}>
            <Trash2 size={14} /> Remove
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => onUpdate(amount)} style={{
            flex: 2, padding: '14px', borderRadius: '14px',
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDeep})`,
            color: '#fff', fontWeight: 700, fontSize: '14px',
          }}>
            Save
          </motion.button>
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
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 100,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
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
          <div className="serif" style={{ fontSize: '26px' }}>Your goals</div>
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
            <motion.button
              key={p.k} whileTap={{ scale: 0.95 }}
              onClick={() => applyPreset(p.k)}
              style={{
                padding: '14px 8px', borderRadius: '14px',
                background: g.type === p.k ? theme.accentSoft : theme.surface,
                border: `1px solid ${g.type === p.k ? theme.accent : theme.border}`,
                color: g.type === p.k ? theme.accent : theme.text,
                fontSize: '13px', fontWeight: 600,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              }}
            >
              <span style={{ fontSize: '20px' }}>{p.e}</span>
              {p.l}
            </motion.button>
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

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => { setGoals(g); onClose(); }}
          style={{
            width: '100%', marginTop: '18px', padding: '16px', borderRadius: '16px',
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDeep})`,
            color: '#fff', fontSize: '15px', fontWeight: 700,
            boxShadow: `0 4px 14px ${theme.accent}50`,
          }}
        >
          Save goals
        </motion.button>
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
      <motion.button whileTap={{ scale: 0.9 }} onClick={() => onChange(Math.max(0, value - step))} style={{
        width: '34px', height: '34px', borderRadius: '11px',
        background: theme.surfaceAlt, display: 'grid', placeItems: 'center',
      }}>
        <Minus size={14} />
      </motion.button>
      <motion.button whileTap={{ scale: 0.9 }} onClick={() => onChange(value + step)} style={{
        width: '34px', height: '34px', borderRadius: '11px',
        background: theme.surfaceAlt, display: 'grid', placeItems: 'center',
      }}>
        <Plus size={14} />
      </motion.button>
    </div>
  );
}

// ============ PROGRESS VIEW ============
function ProgressView({ theme, logs, weight, setWeight, goals, streak }) {
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

  const maxKcal = Math.max(...days.map(d => d.kcal), goals.kcal * 1.15);
  const latestWeight = weight[weight.length - 1]?.kg || 75;
  const [showWeight, setShowWeight] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '6px' }}>
      <div className="serif" style={{ fontSize: '28px', padding: '4px 4px 0' }}>Progress</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <SummaryCard theme={theme} icon="🔥" label="Streak" value={streak} unit="days" color={theme.orange} />
        <SummaryCard theme={theme} icon="📊" label="Avg kcal" value={avg.kcal || '—'} unit="/ day" color={theme.accent} />
        <SummaryCard theme={theme} icon="⚖️" label="Weight" value={latestWeight} unit="kg" color={theme.blue}
          onClick={() => setShowWeight(true)} />
        <SummaryCard theme={theme} icon="💪" label="Avg protein" value={avg.p || '—'} unit="g / day" color={theme.red} />
      </div>

      {/* Chart */}
      <div style={{
        background: theme.surface, borderRadius: '24px', padding: '20px',
        border: `1px solid ${theme.border}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Last 7 days
            </div>
            <div className="serif" style={{ fontSize: '22px', marginTop: '2px' }}>Daily calories</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="tabular" style={{ fontSize: '22px', fontWeight: 700 }}>{avg.kcal || 0}</div>
            <div style={{ fontSize: '11px', color: theme.textMuted }}>avg kcal</div>
          </div>
        </div>

        <div style={{ position: 'relative', height: '170px', marginBottom: '8px' }}>
          {/* Goal line */}
          <div style={{
            position: 'absolute', left: 0, right: 0,
            top: `${100 - (goals.kcal / maxKcal) * 100}%`,
            borderTop: `1.5px dashed ${theme.accent}88`,
            zIndex: 1,
          }}>
            <div style={{
              position: 'absolute', right: 0, top: '-9px',
              padding: '2px 6px', borderRadius: '6px',
              background: theme.accentSoft, color: theme.accent,
              fontSize: '9px', fontWeight: 700,
            }}>
              GOAL
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', gap: '8px', position: 'relative', zIndex: 2 }}>
            {days.map((d, i) => {
              const h = d.kcal > 0 ? Math.max(4, (d.kcal / maxKcal) * 100) : 2;
              const isToday = d.key === todayKey();
              const onTarget = d.kcal > 0 && Math.abs(d.kcal - goals.kcal) < goals.kcal * 0.12;
              return (
                <div key={d.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.06, duration: 0.6, ease: 'easeOut' }}
                      style={{
                        width: '100%', borderRadius: '8px 8px 4px 4px',
                        background: isToday
                          ? `linear-gradient(180deg, ${theme.accent}, ${theme.accentDeep})`
                          : onTarget
                          ? theme.accent + 'cc'
                          : d.kcal > goals.kcal * 1.1
                          ? theme.red + 'cc'
                          : d.kcal > 0
                          ? theme.border
                          : theme.border,
                        minHeight: '4px',
                        boxShadow: isToday ? `0 4px 12px ${theme.accent}40` : 'none',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 2px 0' }}>
          {days.map(d => {
            const isToday = d.key === todayKey();
            return (
              <div key={d.key} style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: isToday ? theme.accent : theme.textMuted, fontWeight: isToday ? 700 : 600 }}>
                {d.label}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: theme.textMuted }}>Goal: <span className="tabular" style={{ color: theme.text, fontWeight: 600 }}>{goals.kcal}</span> kcal</span>
          <span style={{ color: theme.textMuted }}>
            <span className="tabular" style={{ color: theme.accent, fontWeight: 700 }}>
              {days.filter(d => d.kcal > 0 && Math.abs(d.kcal - goals.kcal) < goals.kcal * 0.15).length}/7
            </span> on target
          </span>
        </div>
      </div>

      {/* Achievements */}
      <div style={{
        background: theme.surface, borderRadius: '24px', padding: '20px',
        border: `1px solid ${theme.border}`,
      }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
          Milestones
        </div>
        <div className="serif" style={{ fontSize: '22px', marginBottom: '16px' }}>Achievements</div>
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
        background: theme.surface, borderRadius: '20px', padding: '18px',
        border: `1px solid ${theme.border}`,
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative', overflow: 'hidden',
      }}>
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px',
        fontSize: '60px', opacity: 0.08,
      }}>{icon}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', position: 'relative' }}>
        <div style={{ fontSize: '18px' }}>{icon}</div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', position: 'relative' }}>
        <div className="tabular" style={{ fontSize: '26px', fontWeight: 700, color }}>{value}</div>
        <div style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 500 }}>{unit}</div>
      </div>
    </motion.div>
  );
}

function Achievement({ theme, emoji, label, unlocked }) {
  return (
    <motion.div
      whileHover={unlocked ? { y: -2 } : {}}
      style={{
        padding: '14px 6px', borderRadius: '14px',
        background: unlocked ? theme.accentSoft : theme.surfaceAlt,
        border: `1px solid ${unlocked ? theme.accent + '44' : theme.border}`,
        textAlign: 'center',
        opacity: unlocked ? 1 : 0.5,
      }}>
      <div style={{ fontSize: '26px', marginBottom: '4px', filter: unlocked ? 'none' : 'grayscale(1)' }}>{emoji}</div>
      <div style={{ fontSize: '10px', fontWeight: 600, lineHeight: 1.2 }}>{label}</div>
    </motion.div>
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
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: theme.surface, borderRadius: '24px', padding: '24px',
          width: '100%', maxWidth: '340px',
          border: `1px solid ${theme.border}`,
        }}
      >
        <div className="serif" style={{ fontSize: '24px', marginBottom: '4px' }}>Log weight</div>
        <div style={{ fontSize: '13px', color: theme.textSub, marginBottom: '20px' }}>
          {fmtDate(todayKey())}
        </div>
        <div style={{
          background: theme.surfaceAlt, borderRadius: '16px', padding: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
          marginBottom: '16px',
        }}>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setKg((+kg - 0.1).toFixed(1))} style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: theme.surface, display: 'grid', placeItems: 'center',
          }}>
            <Minus size={16} />
          </motion.button>
          <div style={{ textAlign: 'center', minWidth: '120px' }}>
            <input
              type="number" step="0.1" value={kg}
              onChange={e => setKg(e.target.value)}
              style={{
                width: '100%', border: 'none', outline: 'none', background: 'transparent',
                textAlign: 'center', fontSize: '40px', fontWeight: 500, color: theme.text,
                fontFamily: 'Fraunces, serif', letterSpacing: '-0.02em',
              }}
            />
            <div style={{ fontSize: '12px', color: theme.textMuted, marginTop: '-2px' }}>kg</div>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setKg((+kg + 0.1).toFixed(1))} style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: theme.surface, display: 'grid', placeItems: 'center',
          }}>
            <Plus size={16} />
          </motion.button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '14px', borderRadius: '14px',
            background: theme.surfaceAlt, fontWeight: 700, fontSize: '14px',
          }}>
            Cancel
          </button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={save} style={{
            flex: 2, padding: '14px', borderRadius: '14px',
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDeep})`,
            color: '#fff', fontWeight: 700, fontSize: '14px',
          }}>
            Save weight
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============ PLANS VIEW ============
function PlansView({ theme, onPick }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '6px' }}>
      <div>
        <div className="serif" style={{ fontSize: '28px', padding: '4px 4px 0' }}>Meal Plans</div>
        <div style={{ fontSize: '14px', color: theme.textSub, padding: '2px 4px 0' }}>
          Curated plans matched to your goal.
        </div>
      </div>
      {MEAL_PLANS.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onPick(p)}
          style={{
            background: theme.surface, borderRadius: '24px', padding: '20px',
            border: `1px solid ${theme.border}`, cursor: 'pointer',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: `linear-gradient(135deg, ${theme.accentSoft}, ${theme.accent}20)`,
              display: 'grid', placeItems: 'center',
              fontSize: '30px',
              border: `1px solid ${theme.accent}33`,
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
              <div className="tabular" style={{ fontSize: '20px', fontWeight: 700 }}>{p.kcal}</div>
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
                padding: '10px 12px', background: theme.surfaceAlt, borderRadius: '10px',
                fontSize: '13px',
              }}>
                <span style={{ fontWeight: 500 }}>{m.name}</span>
                <span className="tabular" style={{ color: theme.textMuted, fontWeight: 600 }}>{m.kcal} kcal</span>
              </div>
            ))}
          </div>
          <motion.button whileTap={{ scale: 0.98 }} style={{
            width: '100%', marginTop: '14px', padding: '12px', borderRadius: '14px',
            background: theme.accentSoft, color: theme.accent,
            fontWeight: 700, fontSize: '13px',
          }}>
            Activate plan →
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
}

// ============ ME VIEW ============
function MeView({ theme, goals, setGoals, streak, dark, setDark, logs, onEditGoals }) {
  const totalLogs = Object.values(logs).flat().length;
  const activeDays = Object.values(logs).filter(a => a.length > 0).length;

  const exportData = () => {
    const data = JSON.stringify({ goals, logs }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'fitora-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '6px' }}>
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDeep})`,
          borderRadius: '28px', padding: '24px', color: '#fff',
          position: 'relative', overflow: 'hidden',
        }}>
        {/* Decorative leaf background */}
        <div style={{
          position: 'absolute', top: '-30px', right: '-30px',
          opacity: 0.12,
        }}>
          <FitoraLogo size={180} style={{ filter: 'brightness(0) invert(1)' }} />
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '18px',
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
              display: 'grid', placeItems: 'center', fontSize: '28px',
              border: '1px solid rgba(255,255,255,0.3)',
            }}>
              👋
            </div>
            <div>
              <div style={{ fontSize: '12px', opacity: 0.85, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Welcome back
              </div>
              <div className="serif" style={{ fontSize: '26px', lineHeight: 1.1, marginTop: '2px' }}>You</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <ProfileStat label="Streak" value={streak} />
            <ProfileStat label="Days logged" value={activeDays} />
            <ProfileStat label="Meals" value={totalLogs} />
          </div>
        </div>
      </motion.div>

      <SettingsGroup theme={theme} title="Goals">
        <SettingRow theme={theme} icon={<Target size={16} />} label="Daily targets"
          hint={`${goals.kcal} kcal · ${goals.type}`} onClick={onEditGoals} />
        <SettingRow theme={theme} icon={<Flag size={16} />} label="Goal type"
          hint={goals.type === 'loss' ? 'Fat loss' : goals.type === 'gain' ? 'Muscle gain' : 'Maintenance'}
          onClick={onEditGoals} last />
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

      <div style={{ textAlign: 'center', padding: '20px 0 8px', fontSize: '12px', color: theme.textMuted }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
          <FitoraLogo size={16} color={theme.accent} accent={theme.accentLeaf} />
          <span className="serif" style={{ fontSize: '15px', color: theme.text }}>Fitora</span>
        </div>
        Private by design · Offline-first
      </div>
    </div>
  );
}

function ProfileStat({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="tabular serif" style={{ fontSize: '28px', lineHeight: 1, color: '#fff' }}>{value}</div>
      <div style={{ fontSize: '11px', opacity: 0.85, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '4px' }}>
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
        width: '34px', height: '34px', borderRadius: '11px',
        background: danger ? theme.red + '1a' : theme.surfaceAlt,
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
      background: on ? theme.accent : theme.border,
      position: 'relative', transition: 'background 0.2s',
    }}>
      <motion.div
        animate={{ x: on ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          width: '24px', height: '24px', borderRadius: '50%',
          background: '#fff', position: 'absolute', top: '2px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
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
        background: theme.surface, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
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
              whileTap={{ scale: 0.92 }}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: '10px 4px', borderRadius: '16px',
                background: active ? theme.accentSoft : 'transparent',
                color: active ? theme.accent : theme.textMuted,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
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
  const kcalPct = (totals.kcal / goals.kcal) * 100;
  const pPct = (totals.p / goals.p) * 100;
  const h = new Date().getHours();

  if (log.length === 0) return "Log your first meal to get started.";

  if (kcalPct > 110) {
    const over = totals.kcal - goals.kcal;
    return `${over} kcal over goal. Tomorrow's a fresh start — no stress.`;
  }
  if (h > 19 && kcalPct < 60) {
    return `You've only hit ${Math.round(kcalPct)}% of calories. A solid dinner would help.`;
  }
  if (pPct < 50 && h > 14) {
    return `Protein's low today (${Math.round(totals.p)}g). Try adding Greek yogurt or a protein shake.`;
  }
  if (totals.sugar > 50) {
    return `Sugar is tracking high (${Math.round(totals.sugar)}g). Consider swapping dessert for fruit.`;
  }
  if (totals.sodium > 2300) {
    return `Sodium is over 2,300mg. Drink extra water today.`;
  }
  if (pPct >= 80 && kcalPct >= 60 && kcalPct <= 100) {
    return `Great balance today. ${Math.round(totals.p)}g protein in, macros on target.`;
  }
  if (kcalPct < 50 && h > 12) {
    return `You're running light on calories. Make sure to eat enough to support your goal.`;
  }
  return `On track. ${goals.kcal - totals.kcal} kcal left for today.`;
}

function guessMeal() {
  const h = new Date().getHours();
  if (h < 10) return 'breakfast';
  if (h < 15) return 'lunch';
  if (h < 21) return 'dinner';
  return 'snack';
}
