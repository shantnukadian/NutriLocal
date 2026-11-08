export type AppView = 'plan' | 'next_meal' | 'drift' | 'household' | 'market' | 'master_prompt' | 'pm_rules' | 'profiles';

export type UserRole = 'hostel_student' | 'homemaker';

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'Self' | 'Elder (Diabetic / BP)' | 'Spouse' | 'Child / Student';
  age: number;
  dietaryNeed: string;
  targetProtein: number;
  targetCalories: number;
  specialRules: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  age: number;
  location: string;
  city: string;
  avatarLabel: string;
  householdContext: string;
  kitchenEquipment: string[];
  dailyBudgetINR: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetFiber: number;
  healthFocus: string;
  dislikesOrAllergies: string[];
  familyMembers?: FamilyMember[];
}

export interface FoodLogItem {
  id: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Late Snack';
  dishName: string;
  source: 'University Mess' | 'Home Cooked' | 'Canteen / Street' | 'Packaged / Snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string;
  timestamp?: string;
}

export interface WeeklyLogDay {
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  dateStr: string;
  meals: FoodLogItem[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface SupplementRecommendation {
  id: string;
  nutrient: string;
  deficiencyDays: number;
  suggestedSupplement: string;
  dosage: string;
  estimatedCostINR: number;
  clinicalReason: string;
  affiliatePlatform: 'Blinkit' | 'Zepto' | 'Instamart' | '1mg';
}

export interface NutrientDriftAnalysis {
  drift: {
    calorieDrift: number;
    proteinDrift: number;
    carbDrift: number;
    fatDrift: number;
    avgDailyCal: number;
    avgDailyProt: number;
    avgDailyCarbs: number;
    avgDailyFat: number;
  };
  deficiencyDaysCount: number;
  supplementTriggerActive: boolean;
  supplementRecommendations: SupplementRecommendation[];
  interpretation: string;
  actionSteps: string[];
  status: 'Well Balanced' | 'Mild Drift' | 'Significant Nutrient Gap';
}

export interface LocalMarketItem {
  id: string;
  name: string;
  category: 'Staple Protein' | 'Pulses & Legumes' | 'Dairy' | 'Poultry' | 'Nuts & Seeds' | 'Greens' | 'Vegetables' | 'Millets & Grains' | 'Snack Staples';
  pricePerKg: number;
  unit: string;
  seasonal: string;
  hostelFriendly: boolean;
  homemakerFriendly: boolean;
  equipment: string;
  proteinPer100g: number;
  caloriesPer100g: number;
  quickCommercePartner: 'Blinkit' | 'Zepto' | 'Instamart';
  notes: string;
}

export interface DualMarketOption {
  prepType: 'Cook at Home / Room' | 'Order Regional / Mess';
  dishName: string;
  description: string;
  costEstimateINR: number;
  prepOrDeliveryTime: string;
  platform: 'Blinkit' | 'Zepto' | 'Instamart' | 'Swiggy' | 'Zomato' | 'Hostel Mess';
  ingredientsOrRestaurant: string[];
}

export interface AdaptiveMealDetails {
  name: string;
  description: string;
  prepTime: string;
  proteinG: number;
  calories: number;
  practicalityTip: string;
  localIngredientsUsed: string[];
  dualMarket: {
    rawIngredientsOption: DualMarketOption;
    restaurantOrMessOption: DualMarketOption;
  };
}

export interface AdaptivePlanDay {
  dayName: string;
  breakfast: AdaptiveMealDetails;
  lunch: AdaptiveMealDetails;
  dinner: AdaptiveMealDetails;
  snack: AdaptiveMealDetails;
  leftoverOrPrepHack: string;
}

export interface AdaptiveMealPlan {
  planOverview: string;
  weeklyBudgetEstimateINR: number;
  days: AdaptivePlanDay[];
  engine?: string;
}

export interface PreMealCheckInState {
  currentMealToDecide: 'Lunch' | 'Dinner' | 'Late Snack';
  unloggedMeals: string[];
  isLocked: boolean;
  suggestedMeal?: AdaptiveMealDetails;
}

export interface PMConfigurationRule {
  flexibilityScale: number;
  driftRecoveryPace: 'Gentle (48h-72h)' | 'Active (24h)' | 'Immediate';
  kitchenToolEnforcement: 'Strict Equipment Lock' | 'Flexible Alternatives';
  budgetPenaltyStrictness: number;
  leftoverRecyclingBonus: boolean;
  messEmpathyMode: boolean;
  systemPromptPreview: string;
}
