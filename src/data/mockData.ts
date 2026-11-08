import { UserProfile, WeeklyLogDay, LocalMarketItem, PMConfigurationRule } from '../types';

export const PROFILES: UserProfile[] = [
  {
    id: 'profile-student-aarav',
    name: 'Aarav Sharma',
    role: 'hostel_student',
    age: 21,
    location: 'Engineering Campus Hostel · Pune',
    city: 'Pune',
    avatarLabel: 'Hostel Student',
    householdContext: 'Shared Room (3 roommates), University Mess Mandatory',
    kitchenEquipment: ['Electric Kettle (0.8L)', 'Single-plate Induction Stove', 'Small Water Jug'],
    dailyBudgetINR: 85,
    targetCalories: 2150,
    targetProtein: 75,
    targetCarbs: 260,
    targetFat: 60,
    targetFiber: 30,
    healthFocus: 'Combat severe protein deficit from carb-heavy mess & fix 2 AM study crashes',
    dislikesOrAllergies: ['Karela (Bitter Gourd)', 'Unpasteurized Raw Milk']
  },
  {
    id: 'profile-homemaker-sunita',
    name: 'Sunita Rawat',
    role: 'homemaker',
    age: 46,
    location: 'Family Home · Bhopal, MP',
    city: 'Bhopal',
    avatarLabel: 'Homemaker / Caretaker',
    householdContext: 'Household of 4 (Self, Working Spouse, College Student, 72yo Father-in-Law with Type-2 Diabetes)',
    kitchenEquipment: ['Hawkins Pressure Cooker', 'Iron Kadai', 'Cast Iron Tawa', 'Mixer Grinder'],
    dailyBudgetINR: 240,
    targetCalories: 1850,
    targetProtein: 65,
    targetCarbs: 220,
    targetFat: 50,
    targetFiber: 35,
    healthFocus: 'Low-glycemic family dishes, leftover zero-waste recycling, without cooking separate meals',
    dislikesOrAllergies: ['Excessive Palm Oil', 'Store-bought Mayonnaise']
  }
];

export const STUDENT_WEEKLY_LOG: WeeklyLogDay[] = [
  {
    dayName: 'Monday',
    dateStr: 'Yesterday',
    meals: [
      { id: 'm-1', mealType: 'Breakfast', dishName: 'Mess Poha & Sweet Milk Tea', source: 'University Mess', calories: 340, protein: 6, carbs: 58, fat: 9, notes: 'Very little peanuts in poha' },
      { id: 'm-2', mealType: 'Lunch', dishName: 'Mess Yellow Dal, White Rice & Aloo Gobi', source: 'University Mess', calories: 650, protein: 14, carbs: 110, fat: 16, notes: 'Watery dal, mostly refined rice' },
      { id: 'm-3', mealType: 'Late Snack', dishName: 'Campus Canteen Samosa & Cutting Chai', source: 'Canteen / Street', calories: 310, protein: 4, carbs: 38, fat: 17, notes: 'Studying for lab exam' },
      { id: 'm-4', mealType: 'Dinner', dishName: 'Mess 3 Rotis, Baingan Sabzi & Thin Moong Dal', source: 'University Mess', calories: 510, protein: 13, carbs: 82, fat: 14, notes: 'Skipped fruit' }
    ],
    totals: { calories: 1810, protein: 37, carbs: 288, fat: 56 }
  },
  {
    dayName: 'Tuesday',
    dateStr: '2 days ago',
    meals: [
      { id: 'm-5', mealType: 'Breakfast', dishName: 'Skipped (Overslept for 8 AM lecture) + 1 Biscuit', source: 'Packaged / Snack', calories: 90, protein: 1, carbs: 14, fat: 3 },
      { id: 'm-6', mealType: 'Lunch', dishName: 'Mess Chole Rice & Onion rings', source: 'University Mess', calories: 680, protein: 17, carbs: 104, fat: 19 },
      { id: 'm-7', mealType: 'Late Snack', dishName: '2-Minute Instant Noodles cooked in Kettle', source: 'Packaged / Snack', calories: 390, protein: 7, carbs: 56, fat: 15 },
      { id: 'm-8', mealType: 'Dinner', dishName: 'Mess Rotis, Matar Paneer (mostly gravy) & Rice', source: 'University Mess', calories: 620, protein: 15, carbs: 88, fat: 21 }
    ],
    totals: { calories: 1780, protein: 40, carbs: 262, fat: 58 }
  },
  {
    dayName: 'Wednesday',
    dateStr: '3 days ago',
    meals: [
      { id: 'm-9', mealType: 'Breakfast', dishName: 'Mess Bread Butter & Sweet Tea', source: 'University Mess', calories: 320, protein: 5, carbs: 46, fat: 12 },
      { id: 'm-10', mealType: 'Lunch', dishName: 'Mess Rajma Chawal & Boondi Raita', source: 'University Mess', calories: 640, protein: 18, carbs: 98, fat: 17 },
      { id: 'm-11', mealType: 'Late Snack', dishName: 'Roasted Chana Pack from local kiosk', source: 'Canteen / Street', calories: 180, protein: 11, carbs: 24, fat: 4 },
      { id: 'm-12', mealType: 'Dinner', dishName: 'Hostel Mess Dinner (Lauki Sabzi & 4 Rotis)', source: 'University Mess', calories: 480, protein: 12, carbs: 84, fat: 11 }
    ],
    totals: { calories: 1620, protein: 46, carbs: 252, fat: 44 }
  }
];

export const HOMEMAKER_WEEKLY_LOG: WeeklyLogDay[] = [
  {
    dayName: 'Monday',
    dateStr: 'Yesterday',
    meals: [
      { id: 'hm-1', mealType: 'Breakfast', dishName: '2 Stuffed Aloo Parathas with Butter & Ginger Chai', source: 'Home Cooked', calories: 460, protein: 9, carbs: 64, fat: 18, notes: 'Made for whole family' },
      { id: 'hm-2', mealType: 'Lunch', dishName: 'Fresh Tuvar Dal, 2 Phulkas, Bhindi Masala & Dahi', source: 'Home Cooked', calories: 510, protein: 16, carbs: 72, fat: 15, notes: 'Father-in-law had extra dahi' },
      { id: 'hm-3', mealType: 'Late Snack', dishName: 'Chai with 2 Marie Biscuits & Handful of Sev', source: 'Home Cooked', calories: 190, protein: 3, carbs: 28, fat: 7 },
      { id: 'hm-4', mealType: 'Dinner', dishName: 'Leftover Noon Dal reused with Jeera Rice & Aloo Gobi', source: 'Home Cooked', calories: 580, protein: 15, carbs: 88, fat: 16, notes: 'Recycled Monday noon dal' }
    ],
    totals: { calories: 1740, protein: 43, carbs: 252, fat: 56 }
  },
  {
    dayName: 'Tuesday',
    dateStr: '2 days ago',
    meals: [
      { id: 'hm-5', mealType: 'Breakfast', dishName: 'Vegetable Poha with Peanuts & Chai', source: 'Home Cooked', calories: 340, protein: 8, carbs: 54, fat: 11 },
      { id: 'hm-6', mealType: 'Lunch', dishName: 'Kala Chana Curry, 2 Phulkas & Cucumber Tomato Salad', source: 'Home Cooked', calories: 480, protein: 19, carbs: 68, fat: 12 },
      { id: 'hm-7', mealType: 'Late Snack', dishName: 'Roasted Makhana with Rock Salt', source: 'Home Cooked', calories: 140, protein: 4, carbs: 22, fat: 3 },
      { id: 'hm-8', mealType: 'Dinner', dishName: 'Lauki Kofta Curry (Shallow fried) & 3 Phulkas', source: 'Home Cooked', calories: 520, protein: 12, carbs: 76, fat: 17 }
    ],
    totals: { calories: 1480, protein: 43, carbs: 220, fat: 43 }
  }
];

export const LOCAL_MARKET_CATALOG: LocalMarketItem[] = [
  { id: 'ing-1', name: 'Roasted Bengal Gram / Sattu', category: 'Staple Protein', pricePerKg: 90, unit: '500g pack', seasonal: 'Year-round', hostelFriendly: true, homemakerFriendly: true, equipment: 'No cook / Water mix', proteinPer100g: 22, caloriesPer100g: 380, quickCommercePartner: 'Blinkit', notes: 'Instant high-protein beverage, paratha stuffing, zero-cook' },
  { id: 'ing-2', name: 'Kala Chana (Brown Chickpeas)', category: 'Pulses & Legumes', pricePerKg: 75, unit: 'kg', seasonal: 'Year-round', hostelFriendly: true, homemakerFriendly: true, equipment: 'Kettle / Pressure Cooker', proteinPer100g: 19, caloriesPer100g: 360, quickCommercePartner: 'Zepto', notes: 'Sprouts easily in hostel room; excellent evening chaat with lemon' },
  { id: 'ing-3', name: 'Fresh Paneer (Cottage Cheese)', category: 'Dairy', pricePerKg: 340, unit: '200g block', seasonal: 'Year-round', hostelFriendly: true, homemakerFriendly: true, equipment: 'No cook / Pan sear', proteinPer100g: 18, caloriesPer100g: 265, quickCommercePartner: 'Instamart', notes: 'Available at local dairy booth; raw cubes with black pepper or bhurji' },
  { id: 'ing-4', name: 'Fresh Curd / Dahi', category: 'Dairy', pricePerKg: 65, unit: '400g pouch', seasonal: 'Year-round', hostelFriendly: true, homemakerFriendly: true, equipment: 'No cook', proteinPer100g: 3.5, caloriesPer100g: 61, quickCommercePartner: 'Blinkit', notes: 'Gut microbiome stabilizer; balances oily mess/canteen lunches' },
  { id: 'ing-5', name: 'Farm Eggs (Desi / Broiler)', category: 'Poultry', pricePerKg: 7, unit: 'per egg', seasonal: 'Year-round', hostelFriendly: true, homemakerFriendly: true, equipment: 'Electric kettle boil / Pan', proteinPer100g: 13, caloriesPer100g: 145, quickCommercePartner: 'Zepto', notes: 'Quickest hostel protein; 2 eggs boiled in electric kettle take 8 mins' },
  { id: 'ing-6', name: 'Moong Dal (Yellow / Green Split)', category: 'Pulses & Legumes', pricePerKg: 110, unit: 'kg', seasonal: 'Year-round', hostelFriendly: true, homemakerFriendly: true, equipment: 'Kettle / Cooker', proteinPer100g: 24, caloriesPer100g: 347, quickCommercePartner: 'Instamart', notes: 'Lightest on digestion; cooks faster than any other pulse' },
  { id: 'ing-7', name: 'Raw Roasted Peanuts / Mungfali', category: 'Nuts & Seeds', pricePerKg: 140, unit: 'kg', seasonal: 'Year-round', hostelFriendly: true, homemakerFriendly: true, equipment: 'No cook', proteinPer100g: 26, caloriesPer100g: 567, quickCommercePartner: 'Blinkit', notes: 'Budget friendly fat & protein booster for study table' },
  { id: 'ing-8', name: 'Seasonal Palak (Spinach)', category: 'Greens', pricePerKg: 25, unit: 'bunch', seasonal: 'Winter / Spring', hostelFriendly: false, homemakerFriendly: true, equipment: 'Kadai / Pan', proteinPer100g: 2.9, caloriesPer100g: 23, quickCommercePartner: 'Zepto', notes: 'Iron and folate booster; blend into dal or sauté with garlic' },
  { id: 'ing-9', name: 'Methi (Fresh Fenugreek)', category: 'Greens', pricePerKg: 20, unit: 'bunch', seasonal: 'Winter', hostelFriendly: false, homemakerFriendly: true, equipment: 'Kadai', proteinPer100g: 4.4, caloriesPer100g: 49, quickCommercePartner: 'Instamart', notes: 'Natural glycemic stabilizer; excellent for elder family members' },
  { id: 'ing-10', name: 'Lauki (Bottle Gourd)', category: 'Vegetables', pricePerKg: 30, unit: 'piece', seasonal: 'Summer / Monsoon', hostelFriendly: false, homemakerFriendly: true, equipment: 'Pressure cooker', proteinPer100g: 1.2, caloriesPer100g: 15, quickCommercePartner: 'Blinkit', notes: 'Ultra hydrating, high fiber, calming on stomach' },
  { id: 'ing-11', name: 'Ragi Flour (Finger Millet)', category: 'Millets & Grains', pricePerKg: 55, unit: 'kg', seasonal: 'Year-round', hostelFriendly: true, homemakerFriendly: true, equipment: 'Kettle porridge / Roti tawa', proteinPer100g: 7.3, caloriesPer100g: 328, quickCommercePartner: 'Zepto', notes: 'Rich in bioavailable calcium; 5-min malt drink in kettle' },
  { id: 'ing-12', name: 'Roasted Makhana (Fox Nuts)', category: 'Snack Staples', pricePerKg: 480, unit: '250g pack', seasonal: 'Year-round', hostelFriendly: true, homemakerFriendly: true, equipment: 'Dry roast', proteinPer100g: 9.7, caloriesPer100g: 347, quickCommercePartner: 'Instamart', notes: 'Low-calorie crunchy replacement for fried late-night chips' },
];

export const DEFAULT_PM_RULES: PMConfigurationRule = {
  flexibilityScale: 65,
  driftRecoveryPace: 'Gentle (48h-72h)',
  kitchenToolEnforcement: 'Strict Equipment Lock',
  budgetPenaltyStrictness: 8,
  leftoverRecyclingBonus: true,
  messEmpathyMode: true,
  systemPromptPreview: `System: You are NutriLocal Engine, an adaptive nutrition system for Indian hostel students and homemakers.
Your goal is to generate a realistic, comforting, culturally resonant 7-day meal plan.
Key principles:
1. Zero Rigid Restrictions: No guilt, no unrealistic imported ingredients (no quinoa, avocado, salmon).
2. Drift Compensation: Address logged deficits gracefully.
3. Flexibility Scale: 65% (80/20 balance).`
};
