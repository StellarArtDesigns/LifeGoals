import { saveData, loadData } from './utils.js';

const mealTemplates = {
  balanced: { ... },
  keto: { ... },
  vegetarian: { ... }
};

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

export function generateMealPlan(dietType, sensitivities) {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const templates = mealTemplates[dietType] || mealTemplates["balanced"];
  return days.map((day, i) => ({
    day,
    breakfast: filterMeal(templates.breakfast[i % templates.breakfast.length], sensitivities),
    lunch: filterMeal(templates.lunch[i % templates.lunch.length], sensitivities),
    dinner: filterMeal(templates.dinner[i % templates.dinner.length], sensitivities)
  }));
}
