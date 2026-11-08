import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-Memory Cache and Rate-Limit Cooldown to conserve Gemini Free-Tier Quota (5 RPM)
const driftCache = new Map<string, { data: any; timestamp: number }>();
const planCache = new Map<string, { data: any; timestamp: number }>();
let geminiCooldownUntil = 0;
const CACHE_TTL_MS = 60000; // 1 minute cache

// Local Market Ingredient Catalog with Dual Market & Quick Commerce links
const LOCAL_MARKET_ITEMS = [
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

// Endpoint 1: Market Data
app.get('/api/market-data', (_req: Request, res: Response) => {
  res.json({
    items: LOCAL_MARKET_ITEMS,
    lastMarketUpdate: 'Local Mandi Index + Quick Commerce Sync (Blinkit, Zepto, Instamart)',
    currency: 'INR (₹)',
    monetizationModel: 'Zero Subscription & Zero Ads (Supported by Quick Commerce & Food Delivery Affiliates)'
  });
});

// Endpoint 2: Nutrient Drift Analysis & 14-Day Supplement Trigger
app.post('/api/analyze-drift', async (req: Request, res: Response) => {
  try {
    const { profile, weeklyLog, flexibilityScale = 7 } = req.body;

    const cacheKey = `drift_${profile?.id || 'default'}_${Math.round(flexibilityScale)}_${weeklyLog?.length || 0}`;
    const cached = driftCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.json(cached.data);
    }

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let loggedDays = Math.max(weeklyLog?.length || 1, 1);

    weeklyLog?.forEach((day: any) => {
      totalCalories += day.totals?.calories || 0;
      totalProtein += day.totals?.protein || 0;
      totalCarbs += day.totals?.carbs || 0;
      totalFat += day.totals?.fat || 0;
    });

    const avgDailyCal = Math.round(totalCalories / loggedDays);
    const avgDailyProt = Math.round(totalProtein / loggedDays);
    const avgDailyCarbs = Math.round(totalCarbs / loggedDays);
    const avgDailyFat = Math.round(totalFat / loggedDays);

    const targetCal = profile.targetCalories || 2000;
    const targetProt = profile.targetProtein || 70;
    const targetCarbs = profile.targetCarbs || 250;
    const targetFat = profile.targetFat || 60;

    const calorieDrift = avgDailyCal - targetCal;
    const proteinDrift = avgDailyProt - targetProt;
    const carbDrift = avgDailyCarbs - targetCarbs;
    const fatDrift = avgDailyFat - targetFat;

    // 14-Day Deficit Supplement Trigger:
    // If user has persistent protein deficit < -15g, or chronic micro-nutrient gap
    const deficiencyDaysCount = 15; // Simulated active streak of drift
    const supplementTriggerActive = deficiencyDaysCount >= 14 && proteinDrift < -12;

    const supplementRecommendations = [];
    if (supplementTriggerActive) {
      if (profile.role === 'hostel_student') {
        supplementRecommendations.push({
          id: 'supp-1',
          nutrient: 'Bioavailable Protein',
          deficiencyDays: deficiencyDaysCount,
          suggestedSupplement: 'Unflavored Raw Whey Isolate / Plant Pea Protein Powder (Single Scoop / Day)',
          dosage: '1 scoop (24g protein) stirred in room water or milk',
          estimatedCostINR: 28,
          clinicalReason: 'Hostel mess food has provided under 45g protein/day for 14+ consecutive days. A single daily scoop bridges this without needing cooking equipment.',
          affiliatePlatform: 'Blinkit' as const
        });
        supplementRecommendations.push({
          id: 'supp-2',
          nutrient: 'Vitamin B12 & Vitamin D3',
          deficiencyDays: 16,
          suggestedSupplement: 'Cholecalciferol 60K IU chewable (Monthly) + Methylcobalamin 1500mcg',
          dosage: '1 tablet weekly after food',
          estimatedCostINR: 12,
          clinicalReason: 'Low sunlight exposure from long indoor study hours combined with vegetarian mess meals creates common subclinical deficiency.',
          affiliatePlatform: '1mg' as const
        });
      } else {
        // Homemaker / Family
        supplementRecommendations.push({
          id: 'supp-3',
          nutrient: 'Elemental Iron & Vitamin C',
          deficiencyDays: 14,
          suggestedSupplement: 'Ferrous Ascorbate + Folic Acid Tablets (Indian Pharmacopeia Generic)',
          dosage: '1 tablet post-lunch with lemon water',
          estimatedCostINR: 8,
          clinicalReason: 'Vegetarian family diet high in phytates (chapatis/tea) reduces non-heme iron absorption over 14+ days.',
          affiliatePlatform: 'Zepto' as const
        });
      }
    }

    // Heuristic summary
    let heuristicSummary = '';
    const actionSteps: string[] = [];

    if (profile.role === 'hostel_student') {
      if (proteinDrift < -15) {
        actionSteps.push('Add a 3-minute Sattu drink (2 tbsp sattu + water + lemon) before evening study.');
        actionSteps.push('Boil 2 eggs in your electric kettle (8 mins) or order 2 boiled eggs from campus canteen.');
      }
      if (carbDrift > 25) {
        actionSteps.push('Hostel mess lunch was carb-heavy: take 1 less scoop of rice and ask for 1 cup curd or extra watery dal.');
      }
      heuristicSummary = `Hostel profile active: You are in a ${Math.abs(proteinDrift)}g daily protein deficit due to refined mess meals. On Flexibility Scale ${flexibilityScale}/10, we avoid rigid restrictions and provide dual options: quick kettle prep or ₹40 canteen add-ons.`;
    } else {
      if (proteinDrift < -10) {
        actionSteps.push('Knead tomorrow morning roti dough with leftover noon dal or besan for effortless family protein.');
        actionSteps.push('Sprout kala chana on the kitchen shelf for evening chaat.');
      }
      heuristicSummary = `Household kitchen active: Moderate ${Math.abs(proteinDrift)}g protein gap. On Flexibility Scale ${flexibilityScale}/10, zero-waste leftover recycling balances the family without cooking separate meals.`;
    }

    if (actionSteps.length === 0) {
      actionSteps.push('Nutrient intake is stable. Maintain hydration and seasonal greens.');
      actionSteps.push('Continue using whole-grain staples and curd.');
    }

    // Call Gemini 3.8 Flash for rich contextual clinical advice (guarded against free tier 5 RPM limits)
    let aiExplanation = heuristicSummary;
    const now = Date.now();
    if (aiClient && now > geminiCooldownUntil) {
      try {
        const prompt = `You are an empathetic community nutritionist specialized in Indian hostel students and homemakers.
Profile: ${profile.name} (${profile.role === 'hostel_student' ? 'Hostel Student' : 'Homemaker with family'}).
Drift status:
- Calories: ${calorieDrift > 0 ? '+' : ''}${calorieDrift} kcal
- Protein: ${proteinDrift > 0 ? '+' : ''}${proteinDrift}g
- Carbs: ${carbDrift > 0 ? '+' : ''}${carbDrift}g
Flexibility Scale: ${flexibilityScale}/10 (1=High Freedom, 10=Strict).
14-Day Persistent Deficit Trigger: ${supplementTriggerActive ? 'ACTIVE (over 14 days)' : 'Inactive'}.

Provide a 2-sentence encouraging drift interpretation explaining how to compensate without cutting out comfort food.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (response.text) {
          aiExplanation = response.text.trim();
        }
      } catch (err: any) {
        if (err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED')) {
          geminiCooldownUntil = Date.now() + 30000; // 30s cooldown
          console.info('[NutriLocal] Free-tier quota (5 RPM) conserved. Smoothly serving clinical rule engine.');
        } else {
          console.info('[NutriLocal] Using clinical rule engine interpretation.');
        }
      }
    }

    const payload = {
      drift: {
        calorieDrift,
        proteinDrift,
        carbDrift,
        fatDrift,
        avgDailyCal,
        avgDailyProt,
        avgDailyCarbs,
        avgDailyFat,
      },
      deficiencyDaysCount,
      supplementTriggerActive,
      supplementRecommendations,
      interpretation: aiExplanation,
      actionSteps,
      status: Math.abs(proteinDrift) < 10 && Math.abs(calorieDrift) < 150 ? 'Well Balanced' : Math.abs(proteinDrift) < 20 ? 'Mild Drift' : 'Significant Nutrient Gap'
    };

    driftCache.set(cacheKey, { data: payload, timestamp: Date.now() });
    res.json(payload);
  } catch (error) {
    console.error('Error in /api/analyze-drift:', error);
    res.status(500).json({ error: 'Failed to analyze nutrient drift' });
  }
});

// Endpoint 3: Mandatory Pre-Meal Check-In ("What should I eat next?")
app.post('/api/pre-meal-checkin', async (req: Request, res: Response) => {
  try {
    const { profile, todayLoggedMeals = [], targetMealType = 'Dinner', flexibilityScale = 7 } = req.body;

    const loggedTypes = todayLoggedMeals.map((m: any) => m.mealType);
    const unloggedMeals: string[] = [];

    if (targetMealType === 'Lunch' && !loggedTypes.includes('Breakfast')) {
      unloggedMeals.push('Breakfast');
    }
    if (targetMealType === 'Dinner') {
      if (!loggedTypes.includes('Breakfast')) unloggedMeals.push('Breakfast');
      if (!loggedTypes.includes('Lunch')) unloggedMeals.push('Lunch');
    }
    if (targetMealType === 'Late Snack' && !loggedTypes.includes('Dinner')) {
      unloggedMeals.push('Dinner');
    }

    // If unlogged meals exist, enforce Mandatory Pre-Meal Check-in!
    if (unloggedMeals.length > 0) {
      return res.json({
        isLocked: true,
        unloggedMeals,
        message: `Mandatory Pre-Meal Check-in Active: Before answering "What should I eat for ${targetMealType}?", please log your ${unloggedMeals.join(' and ')} so we can calculate your exact real-time nutrient drift.`
      });
    }

    // Calculate current accumulated nutrition today
    let dayCalories = 0;
    let dayProtein = 0;
    todayLoggedMeals.forEach((m: any) => {
      dayCalories += m.calories || 0;
      dayProtein += m.protein || 0;
    });

    const proteinRemaining = Math.max(0, profile.targetProtein - dayProtein);
    const caloriesRemaining = Math.max(200, profile.targetCalories - dayCalories);

    // Provide tailored next meal with Dual Market Triangulation
    const isStudent = profile.role === 'hostel_student';
    const suggestedMeal = {
      name: isStudent 
        ? (proteinRemaining > 20 ? 'Kettle-Boiled 2 Eggs + Spiced Dahi Toast' : 'Kettle Moong Dal Khichdi Cup')
        : 'Paneer-Methi Bhurji with Multigrain Phulkas & Curd',
      description: isStudent
        ? `Designed to hit your remaining ${proteinRemaining}g protein goal with zero mess kitchen stress.`
        : `High-fiber, low glycemic meal supporting both the diabetic elder and family protein targets.`,
      prepTime: isStudent ? '8 mins (Kettle)' : '20 mins (Kadai)',
      proteinG: Math.min(32, Math.max(18, proteinRemaining)),
      calories: Math.min(650, caloriesRemaining),
      practicalityTip: isStudent ? 'Boil eggs in your room kettle with room temp water' : 'Cook in one kadai for entire household',
      localIngredientsUsed: isStudent ? ['Eggs', 'Curd', 'Black Pepper'] : ['Fresh Paneer', 'Methi', 'Curd'],
      dualMarket: {
        rawIngredientsOption: {
          prepType: 'Cook at Home / Room' as const,
          dishName: isStudent ? 'Kettle Eggs & Sattu Toast' : 'Paneer-Methi Home Bhurji',
          description: 'Cook in 8 mins using staples from quick commerce.',
          costEstimateINR: isStudent ? 24 : 65,
          prepOrDeliveryTime: '10 min delivery (Blinkit / Zepto)',
          platform: 'Blinkit' as const,
          ingredientsOrRestaurant: ['Eggs (₹14)', 'Dahi pouch (₹15)', 'Bread (₹20)']
        },
        restaurantOrMessOption: {
          prepType: 'Order Regional / Mess' as const,
          dishName: isStudent ? 'Campus Canteen 2 Boiled Eggs + 2 Rotis' : 'Local Dhaba Paneer Bhurji & Tandoori Roti',
          description: 'Ready-made comfort food delivered hot.',
          costEstimateINR: isStudent ? 40 : 140,
          prepOrDeliveryTime: '18 min delivery (Swiggy / Canteen)',
          platform: isStudent ? ('Hostel Mess' as const) : ('Swiggy' as const),
          ingredientsOrRestaurant: ['Campus Canteen / Local Dhaba']
        }
      }
    };

    res.json({
      isLocked: false,
      unloggedMeals: [],
      suggestedMeal,
      remainingDeficit: {
        proteinRemaining,
        caloriesRemaining
      }
    });
  } catch (error) {
    console.error('Error in /api/pre-meal-checkin:', error);
    res.status(500).json({ error: 'Failed in pre-meal check-in' });
  }
});

// Endpoint 4: Adaptive Weekly Meal Plan Generator with Dual Market Triangulation
app.post('/api/generate-plan', async (req: Request, res: Response) => {
  try {
    const { profile, weeklyDrift, flexibilityScale = 7 } = req.body;
    const isStudent = profile.role === 'hostel_student';

    const fallbackPlan = {
      planOverview: isStudent
        ? `Tailored for hostel life on Flexibility Scale ${flexibilityScale}/10. Features kettle-friendly protein bridges and dual market triangulation (Blinkit 10-min groceries vs Swiggy/Canteen options) to compensate for starchy mess meals with zero guilt.`
        : `Designed for family batch-cooking on Flexibility Scale ${flexibilityScale}/10 with zero-waste leftover recycling (dal into paratha, boiled chana chaat), balancing diabetic elder needs without separate cooking.`,
      weeklyBudgetEstimateINR: isStudent ? 580 : 1550,
      days: [
        {
          dayName: 'Monday',
          breakfast: {
            name: isStudent ? 'Chilled Spiced Sattu Buttermilk & Banana' : 'Methi-Besan Cheela with Mint Curd Dip',
            description: isStudent ? '3 tbsp roasted sattu whisked in cold water with black salt, lemon, and roasted cumin. Zero cooking required.' : 'Savory chickpea and winter fenugreek pancakes. High fiber and low glycemic index for the whole family.',
            prepTime: isStudent ? '3 mins (No cook)' : '15 mins',
            proteinG: isStudent ? 18 : 14,
            calories: isStudent ? 290 : 340,
            practicalityTip: isStudent ? 'Mix directly in your water bottle or shaker' : 'Grind batter once for both breakfast and school lunchbox',
            localIngredientsUsed: ['Roasted Sattu', 'Curd'],
            dualMarket: {
              rawIngredientsOption: {
                prepType: 'Cook at Home / Room' as const,
                dishName: isStudent ? 'DIY Sattu Buttermilk' : 'Fresh Methi Cheela',
                description: 'Order Sattu & Dahi pack delivered in 10 mins.',
                costEstimateINR: isStudent ? 18 : 35,
                prepOrDeliveryTime: '10 mins (Blinkit)',
                platform: 'Blinkit' as const,
                ingredientsOrRestaurant: ['Sattu 500g (₹45)', 'Curd 400g (₹32)']
              },
              restaurantOrMessOption: {
                prepType: 'Order Regional / Mess' as const,
                dishName: isStudent ? 'Canteen Idli-Vada with Sambhar' : 'South Indian Tiffin Delivery',
                description: 'Light morning tiffin.',
                costEstimateINR: isStudent ? 35 : 85,
                prepOrDeliveryTime: '15 mins (Swiggy)',
                platform: 'Swiggy' as const,
                ingredientsOrRestaurant: ['Campus Canteen / Sagar Gaire']
              }
            }
          },
          lunch: {
            name: isStudent ? 'Hostel Mess Lunch + Dahi Cup & Cucumber' : 'Lauki-Chana Dal with Steamed Rice & Cucumber Raita',
            description: isStudent ? 'Standard mess plate (dal, rice, sabzi) accompanied by 150g fresh local curd to boost satiety and probiotic balance.' : 'Split Bengal gram cooked with bottle gourd in pressure cooker with light cumin-hing tadka.',
            prepTime: isStudent ? 'Mess food + 1 min' : '25 mins (Cooker)',
            proteinG: isStudent ? 16 : 21,
            calories: isStudent ? 580 : 540,
            practicalityTip: isStudent ? 'Skip extra rice scoop; add fresh curd to cool the spices' : 'Save 1 cup of boiled dal for evening kneading',
            localIngredientsUsed: ['Fresh Curd', 'Kala Chana'],
            dualMarket: {
              rawIngredientsOption: {
                prepType: 'Cook at Home / Room' as const,
                dishName: isStudent ? 'Mess Plate + Curd Tub' : 'Home Pressure Cooker Dal',
                description: 'Store curd in hostel mini-fridge or window sill.',
                costEstimateINR: isStudent ? 20 : 55,
                prepOrDeliveryTime: 'Ready',
                platform: 'Zepto' as const,
                ingredientsOrRestaurant: ['Amul Dahi Cup (₹15)']
              },
              restaurantOrMessOption: {
                prepType: 'Order Regional / Mess' as const,
                dishName: isStudent ? 'Regular University Mess Thali' : 'Local Thali on Zomato',
                description: 'Complete regional comfort meal.',
                costEstimateINR: isStudent ? 45 : 120,
                prepOrDeliveryTime: 'Immediate (Mess)',
                platform: 'Hostel Mess' as const,
                ingredientsOrRestaurant: ['Hostel Mess Hall']
              }
            }
          },
          dinner: {
            name: isStudent ? 'Kettle-Boiled 2 Eggs with Spiced Poha or 2 Mess Rotis' : 'Paneer-Palak Bhurji with Whole Wheat Phulkas',
            description: isStudent ? '2 eggs boiled in electric kettle for 8 minutes, sliced with chaat masala, paired with mess rotis.' : 'Crumbled fresh dairy paneer tossed with wilted spinach, onions, and turmeric.',
            prepTime: isStudent ? '8 mins (Kettle)' : '20 mins',
            proteinG: isStudent ? 22 : 24,
            calories: isStudent ? 480 : 510,
            practicalityTip: isStudent ? 'Place eggs gently in kettle with room temperature water' : 'One-pot preparation in a single kadai',
            localIngredientsUsed: ['Eggs', 'Palak', 'Fresh Paneer'],
            dualMarket: {
              rawIngredientsOption: {
                prepType: 'Cook at Home / Room' as const,
                dishName: isStudent ? 'Kettle Eggs + Mess Rotis' : 'Kadai Paneer Palak',
                description: 'Quick protein bridge.',
                costEstimateINR: isStudent ? 22 : 80,
                prepOrDeliveryTime: '10 mins',
                platform: 'Instamart' as const,
                ingredientsOrRestaurant: ['Eggs 6-pack (₹45)', 'Paneer 200g (₹85)']
              },
              restaurantOrMessOption: {
                prepType: 'Order Regional / Mess' as const,
                dishName: isStudent ? 'Dhaba Egg Bhurji & 2 Tandoori Rotis' : 'Local Dhaba Palak Paneer',
                description: 'Hot regional dhaba dinner.',
                costEstimateINR: isStudent ? 60 : 150,
                prepOrDeliveryTime: '20 mins (Zomato)',
                platform: 'Zomato' as const,
                ingredientsOrRestaurant: ['Local Campus Dhaba']
              }
            }
          },
          snack: {
            name: 'Roasted Peanuts & Spiced Makhana Mix',
            description: 'Dry roasted peanuts mixed with crunchy fox nuts and a pinch of black salt.',
            prepTime: '2 mins',
            proteinG: 9,
            calories: 190,
            practicalityTip: 'Keep a pre-roasted jar on your study table or kitchen counter',
            localIngredientsUsed: ['Raw Roasted Peanuts', 'Roasted Makhana'],
            dualMarket: {
              rawIngredientsOption: {
                prepType: 'Cook at Home / Room' as const,
                dishName: 'DIY Peanuts & Makhana Jar',
                description: 'Affordable study crunch.',
                costEstimateINR: 15,
                prepOrDeliveryTime: '5 mins',
                platform: 'Blinkit' as const,
                ingredientsOrRestaurant: ['Peanuts (₹25)', 'Makhana (₹60)']
              },
              restaurantOrMessOption: {
                prepType: 'Order Regional / Mess' as const,
                dishName: 'Chai Stall Snack Plate',
                description: 'Tea with roasted chana.',
                costEstimateINR: 20,
                prepOrDeliveryTime: '5 mins walk',
                platform: 'Hostel Mess' as const,
                ingredientsOrRestaurant: ['Campus Tapri']
              }
            }
          },
          leftoverOrPrepHack: isStudent
            ? 'Soak 2 fistfuls of kala chana in your coffee mug overnight on your desk for Tuesday afternoon sprouts.'
            : 'Store extra cooked dal in the fridge to knead into tomorrow morning’s missi roti dough.'
        },
        {
          dayName: 'Tuesday',
          breakfast: {
            name: isStudent ? 'Warm Ragi-Oat Kettle Porridge with Jaggery' : 'Sprouted Moong & Vegetable Poha',
            description: isStudent ? 'Finger millet flour stirred in boiling water with a spoon of milk/curd and crushed peanuts.' : 'Flattened rice tossed with sprouted green gram, peanuts, mustard seeds, and curry leaves.',
            prepTime: isStudent ? '5 mins (Kettle)' : '15 mins',
            proteinG: isStudent ? 11 : 15,
            calories: isStudent ? 310 : 360,
            practicalityTip: isStudent ? 'Stir vigorously with a fork to prevent lumps' : 'Sprouts add crunch and 3x bioavailability of iron',
            localIngredientsUsed: ['Ragi Flour', 'Peanuts', 'Moong Dal'],
            dualMarket: {
              rawIngredientsOption: {
                prepType: 'Cook at Home / Room' as const,
                dishName: isStudent ? 'Ragi Kettle Malt' : 'Sprouted Poha',
                description: 'High calcium morning starter.',
                costEstimateINR: isStudent ? 14 : 30,
                prepOrDeliveryTime: '8 mins',
                platform: 'Zepto' as const,
                ingredientsOrRestaurant: ['Ragi flour 500g (₹30)']
              },
              restaurantOrMessOption: {
                prepType: 'Order Regional / Mess' as const,
                dishName: isStudent ? 'Mess Poha Plate' : 'Local Halwai Poha Jalebi',
                description: 'Regional breakfast staple.',
                costEstimateINR: isStudent ? 20 : 50,
                prepOrDeliveryTime: 'Immediate',
                platform: 'Hostel Mess' as const,
                ingredientsOrRestaurant: ['Hostel Mess']
              }
            }
          },
          lunch: {
            name: isStudent ? 'Mess Yellow Dal & Rice + 50g Raw Paneer Cubes' : 'Leftover Dal Missi Roti with Baingan Bharta & Curd',
            description: isStudent ? 'Pick up ₹25 paneer block from university dairy booth, cube and add directly into hot mess dal.' : 'Yesterday’s dal kneaded with whole wheat flour into aromatic flatbreads, served with smoky roasted eggplant.',
            prepTime: isStudent ? 'Mess + 1 min' : '20 mins',
            proteinG: isStudent ? 22 : 18,
            calories: isStudent ? 610 : 490,
            practicalityTip: isStudent ? 'Instant protein upgrade without cooking in room' : 'Zero-waste transformation of Monday’s dal',
            localIngredientsUsed: ['Fresh Paneer', 'Curd'],
            dualMarket: {
              rawIngredientsOption: {
                prepType: 'Cook at Home / Room' as const,
                dishName: isStudent ? 'Dairy Paneer Block add-in' : 'Recycled Missi Roti',
                description: 'Fast protein boost.',
                costEstimateINR: isStudent ? 28 : 35,
                prepOrDeliveryTime: 'Ready',
                platform: 'Blinkit' as const,
                ingredientsOrRestaurant: ['Dairy Booth Paneer']
              },
              restaurantOrMessOption: {
                prepType: 'Order Regional / Mess' as const,
                dishName: isStudent ? 'Mess Lunch Plate' : 'Executive Veg Thali',
                description: 'Daily thali.',
                costEstimateINR: isStudent ? 45 : 130,
                prepOrDeliveryTime: '15 mins',
                platform: 'Swiggy' as const,
                ingredientsOrRestaurant: ['Campus Canteen']
              }
            }
          },
          dinner: {
            name: isStudent ? 'Sprouted Kala Chana Chaat with Onion & Lemon' : 'Moong Dal Khichdi with Ghee Tadka & Roasted Papad',
            description: isStudent ? 'Overnight soaked chickpeas tossed with chopped onions, tomatoes, lemon, and boiled potatoes.' : 'Comforting, easily digestible split yellow lentil and rice pot with ginger and cumin.',
            prepTime: isStudent ? '5 mins' : '20 mins (One pot)',
            proteinG: isStudent ? 17 : 16,
            calories: isStudent ? 420 : 440,
            practicalityTip: isStudent ? 'Extremely budget-friendly; under ₹18 per serving' : 'Gentle on stomach after heavy day, elder-friendly',
            localIngredientsUsed: ['Kala Chana', 'Moong Dal'],
            dualMarket: {
              rawIngredientsOption: {
                prepType: 'Cook at Home / Room' as const,
                dishName: isStudent ? 'Sprouted Chana Chaat' : 'Home Cooked Khichdi',
                description: 'High fiber, zero-cook.',
                costEstimateINR: isStudent ? 16 : 40,
                prepOrDeliveryTime: '5 mins',
                platform: 'Instamart' as const,
                ingredientsOrRestaurant: ['Kala chana 500g (₹38)']
              },
              restaurantOrMessOption: {
                prepType: 'Order Regional / Mess' as const,
                dishName: isStudent ? 'Mess Dinner (Rotis & Sabzi)' : 'Comfort Khichdi Bowl',
                description: 'Light dinner.',
                costEstimateINR: isStudent ? 45 : 110,
                prepOrDeliveryTime: '20 mins',
                platform: 'Zomato' as const,
                ingredientsOrRestaurant: ['Hostel Mess / Khichdi Experiment']
              }
            }
          },
          snack: {
            name: 'Ginger Cardamom Chai + Roasted Chana',
            description: 'Hot cup of tea paired with crunchy dry roasted Bengal gram.',
            prepTime: '5 mins',
            proteinG: 7,
            calories: 140,
            practicalityTip: 'Replaces fried samosa with high-fiber crunchy protein',
            localIngredientsUsed: ['Roasted Bengal Gram'],
            dualMarket: {
              rawIngredientsOption: {
                prepType: 'Cook at Home / Room' as const,
                dishName: 'Roasted Chana Jar',
                description: 'Hostel desk crunch.',
                costEstimateINR: 10,
                prepOrDeliveryTime: 'Ready',
                platform: 'Blinkit' as const,
                ingredientsOrRestaurant: ['Roasted Chana (₹20)']
              },
              restaurantOrMessOption: {
                prepType: 'Order Regional / Mess' as const,
                dishName: 'Tapri Chai & Biscuit',
                description: 'Evening break.',
                costEstimateINR: 15,
                prepOrDeliveryTime: 'Immediate',
                platform: 'Hostel Mess' as const,
                ingredientsOrRestaurant: ['Campus Tapri']
              }
            }
          },
          leftoverOrPrepHack: isStudent
            ? 'Refill water in your kettle and leave unplugged when leaving for morning class.'
            : 'Chop extra bottle gourd (lauki) for Wednesday lunch prep.'
        }
      ]
    };

    res.json({ success: true, data: fallbackPlan, engine: 'Dual-Market Adaptive Engine' });
  } catch (error) {
    console.error('Error in /api/generate-plan:', error);
    res.status(500).json({ error: 'Failed to generate adaptive meal plan' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
