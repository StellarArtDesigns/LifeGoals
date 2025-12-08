import { initMeals } from './modules/meals.js';

document.addEventListener("DOMContentLoaded", () => {
  initMeals();
});
// Local storage helper
const store = {
  get: (key, fallback) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch(e){ return fallback; }
  },
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
  del: (key) => localStorage.removeItem(key)
};

// Elements
const els = {
  name: document.getElementById('pf_name'),
  age: document.getElementById('pf_age'),
  htCm: document.getElementById('pf_height_cm'),
  wt: document.getElementById('pf_weight'),
  dietType: document.getElementById('diet_type'),
  saveProfile: document.getElementById('saveProfile'),
  profileStatus: document.getElementById('profileStatus'),
  curBMI: document.getElementById('curBMI'),
  suggestedGoal: document.getElementById('suggestedGoal'),
  goalDisplay: document.getElementById('goalDisplay'),
  goalWeight: document.getElementById('goal_weight'),
  saveGoal: document.getElementById('saveGoal'),
  goalStatus: document.getElementById('goalStatus'),
  progressBar: document.getElementById('progressBar'),
  progressText: document.getElementById('progressText'),
  distanceText: document.getElementById('distanceText'),
  genWorkout: document.getElementById('genWorkout'),
  workoutTable: document.getElementById('workoutTable'),
  genMeals: document.getElementById('genMeals'),
  mealTable: document.getElementById('mealPlanTable'),
  wlAdd: document.getElementById('wl_add'),
  wlDate: document.getElementById('wl_date'),
  wlWeight: document.getElementById('wl_weight'),
  wlTable: document.getElementById('wl_table'),
  wlCurrent: document.getElementById('wl_current'),
  wlChange: document.getElementById('wl_change'),
  wlCount: document.getElementById('wl_count'),
  resetAll: document.getElementById('resetAll')
};

// Helpers
const lbToKg = (lb) => Number(lb) * 0.45359237;
const kgToLb = (kg) => Number(kg) / 0.45359237;
const clamp = (x,min,max)=>Math.max(min,Math.min(max,x));

// Save profile
els.saveProfile.addEventListener('click', ()=>{
  const profile = {
    name: els.name.value.trim(),
    age: Number(els.age.value) || null,
    heightCm: Number(els.htCm.value) || null,
    startWeight: Number(els.wt.value) || null,
    dietType: els.dietType.value,
    sensitivities: [] // later we’ll add checkboxes for sensitivities
  };
  store.set('profile', profile);
  els.profileStatus.textContent = "Profile saved!";
  els.profileStatus.className = "text-green-400 text-sm ml-2";
  updateBMIAndSuggestion();
});

// BMI + suggested goal
function updateBMIAndSuggestion(){
  const p = store.get('profile', null);
  const goal = store.get('goal', { weight: null }).weight;
  if (!p || !p.heightCm || !p.startWeight) {
    els.curBMI.textContent = '—';
    els.suggestedGoal.textContent = '—';
    els.goalDisplay.textContent = goal || '—';
    updateProgressBar();
    return;
  }
  const hM = p.heightCm / 100;
  const wKg = lbToKg(p.startWeight);
  const bmi = wKg / (hM*hM);
  els.curBMI.textContent = bmi.toFixed(1);

  const midBMI = 21.7;
  const goalKg = midBMI * (hM*hM);
  const goalLb = Math.round(kgToLb(goalKg));
  els.suggestedGoal.textContent = goalLb;
  els.goalDisplay.textContent = goal || goalLb;

  updateProgressBar();
}

// Save goal
els.saveGoal.addEventListener('click', ()=>{
  const gw = clamp(Number(els.goalWeight.value || 0), 80, 500);
  if (!gw) {
    els.goalStatus.textContent = "Enter a valid goal weight.";
    els.goalStatus.className = "text-red-400 text-sm";
    return;
  }
  store.set('goal', { weight: gw });
  els.goalDisplay.textContent = gw;
  els.goalStatus.textContent = "Goal saved!";
  els.goalStatus.className = "text-green-400 text-sm";
  updateProgressBar();
});

// Progress bar
function updateProgressBar(){
  const p = store.get('profile', null);
  const g = store.get('goal', { weight: null }).weight;
  const log = store.get('weightLog', []);
  const current = log.length ? log[log.length - 1].weight : (p?.startWeight || null);
  const goal = g || (Number(els.suggestedGoal.textContent) || null);

  if (!current || !goal) {
    els.progressBar.style.width = "0%";
    els.progressText.textContent = "—";
    els.distanceText.textContent = "—";
    return;
  }

  const start = p?.startWeight || current;
  const totalChangeNeeded = Math.abs(goal - start);
  const achieved = Math.abs(current - start);
  const pct = totalChangeNeeded ? Math.min(100, Math.round((achieved / totalChangeNeeded) * 100)) : 0;

  els.progressBar.style.width = pct + "%";
  els.progressBar.className = "h-4 rounded " + ((goal < start && current <= start) || (goal > start && current >= start) ? "bg-green-500" : "bg-red-500");
  els.progressText.textContent = `${pct}% toward goal`;
  els.distanceText.textContent = `${Math.abs(goal - current).toFixed(1)} lb remaining`;
}

// Workout plan generator
els.genWorkout.addEventListener('click', ()=>{
  const plan = [
    { day:"Mon", focus:"Cardio", exercises:"Treadmill or brisk walk" },
    { day:"Tue", focus:"Strength", exercises:"Dumbbell circuit or bodyweight" },
    { day:"Wed", focus:"Mobility", exercises:"Yoga or stretching" },
    { day:"Thu", focus:"Cardio", exercises:"Elliptical or jump rope" },
    { day:"Fri", focus:"Strength", exercises:"Weights or resistance bands" },
    { day:"Sat", focus:"Active recovery", exercises:"Dog walk, mobility" },
    { day:"Sun", focus:"Mixed session", exercises:"Cardio + yoga" }
  ];
  renderTable(plan, els.workoutTable);
});

// Meal templates
import { generateMealPlan } from './modules/meals.js';

els.genMeals.addEventListener('click', () => {
  const p = store.get('profile', null);
  if (!p) return alert("Save your profile first.");
  const plan = generateMealPlan(p.dietType, p.sensitivities || []);
  renderTable(plan, els.mealTable);
});


// Sensitivity filter
function filterMeal(meal, sensitivities) {
  if (sensitivities.includes("gluten") && /bread|toast|pasta|wrap/i.test(meal)) {
    return "Gluten-free alternative";
  }
  if (sensitivities.includes("dairy") && /cheese|yogurt|milk/i.test(meal)) {
    return "Dairy-free alternative";
  }
  if (sensitivities.includes("nuts") && /almond|peanut|cashew/i.test(meal)) {
    return "Nut-free alternative";
  }
  return meal;
}

// Meal plan generator
els.genMeals.addEventListener('click', ()=>{
  const p = store.get('profile', null);
  if (!p) return alert("Save your profile first.");
  const plan = generateMealPlan(p.dietType, p.sensitivities || []);
  renderTable(plan, els.mealTable);
});

function generateMealPlan(dietType, sensitivities) {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const plan = [];
  const templates = mealTemplates[dietType] || mealTemplates["balanced"];

  days.forEach((day, i) => {
    plan.push({
      day,
      breakfast: filterMeal(templates.breakfast[i % templates.breakfast.length], sensitivities),
      lunch: filterMeal(templates.lunch[i % templates.lunch.length], sensitivities),
      dinner: filterMeal(templates.dinner[i % templates.dinner.length], sensitivities
