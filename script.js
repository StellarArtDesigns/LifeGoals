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
