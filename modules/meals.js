// meals.js
import { saveData, loadData, formatDate } from './utils.js';

export function initMeals() {
  // Load saved meals or start fresh
  const meals = loadData("meals", []);

  // Example: render meals to console for now
  console.log("Meals initialized:", meals);

  // Hook into UI later (buttons, forms, etc.)
  setupMealForm(meals);
}

// Add a new meal entry
function addMeal(meals, meal) {
  const entry = {
    ...meal,
    date: formatDate(),
  };
  meals.push(entry);
  saveData("meals", meals);
  console.log("Meal added:", entry);
}

// Example form handler (replace with real DOM later)
function setupMealForm(meals) {
  // Placeholder: imagine a button click adds a meal
  const sampleMeal = { name: "Grilled Chicken Salad", calories: 350 };
  addMeal(meals, sampleMeal);
}
