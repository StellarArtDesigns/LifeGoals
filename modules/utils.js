// utils.js

export function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadData(key, defaultValue = null) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

export function formatDate(date = new Date()) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

export function calcProgress(current, target) {
  if (target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}
