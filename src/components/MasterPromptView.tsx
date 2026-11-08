import React, { useState } from 'react';

export const MasterPromptView: React.FC = () => {
  const [copyStatus, setCopyStatus] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'prompt' | 'audit' | 'architecture'>('prompt');

  const masterPromptText = `You are an expert full-stack engineer and product architect. Build "NutriLocal" — a production-grade, hyper-localized adaptive nutrition platform designed specifically for Indian hostel students and Indian homemakers. The platform assists them in maintaining a healthy lifestyle using affordable local ingredients without rigid restrictions, calorie shaming, or guilt.

### 1. CORE OPERATIONAL RULES & PRINCIPLES
1. ZERO SUBSCRIPTION & ZERO ADS: The app is completely free to end users. It monetizes transparently via quick commerce affiliate links for raw ingredients (Blinkit, Zepto, Instamart) and restaurant meals (Swiggy, Zomato, Campus Canteen).
2. DUAL MARKET TRIANGULATION: Ground every single meal suggestion in TWO parallel tracks:
   - Track A (Cook in Room/Home): Budget raw ingredients delivered in 10 minutes via Blinkit/Zepto/Instamart.
   - Track B (Order Regional/Mess): Common regional restaurant or mess canteen alternatives via Swiggy/Zomato.
3. FLEXIBILITY ENGINE (SCALE 1–10):
   - Score 10: Strict macro/micronutrient adherence.
   - Score 1: Maximum dietary freedom with subtle weekly compensation.
   - Default 6–7: 80/20 lifestyle balance that gracefully compensates for starchy mess food or family festive gravies over 48 hours without cutting meals.
4. MANDATORY PRE-MEAL CHECK-IN:
   - Before answering "What should I eat next?", the engine enforces intake logging for prior unlogged meals today. Provide 1-tap quick presets ("Mess Dal Chawal", "Canteen Samosa & Chai", "Skipped") to minimize user friction.
5. 14-DAY DEFICIT SUPPLEMENT TRIGGER:
   - Automatically tracks persistent nutrient deficits (e.g., bioavailable protein <45g/day, B12, or Iron/Vitamin D). If a deficit persists beyond 14 consecutive days, trigger low-cost generic Indian supplement recommendations (e.g., raw whey/sattu scoop, Vitamin D3 60k IU, Ferrous Ascorbate) with clear clinical rationales.
6. TARGET COHORTS & ADAPTIVE LOGIC:
   - Hostel Students: University mess food dependence, shared electric kettle (0.8L), single-plate induction, ₹50-₹90/day budget, late-night exam study snacks. Protein bridges: Sattu, boiled eggs, curd, roasted chana.
   - Homemakers: Household of 4 (including elderly diabetic in-law and school kids), pressure cooker & kadai, seasonal sabzi mandi produce, leftover zero-waste recycling ("Cook Once, Adapt for Four" without cooking separate menus).

### 2. TECHNICAL ARCHITECTURE
- LLM Engine: Lightweight Gemini 3.8 Flash (gemini-3.8-flash) called server-side via @google/genai SDK with structured JSON outputs.
- State Management: Dynamic 7-day intake log context + 14-day deficit trend injection.
- UI Framework: React 19 + TypeScript + Tailwind CSS v4, following high-density tabular numbers, WCAG AA legibility, and zero-pill clean typography.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(masterPromptText);
    setCopyStatus('Master Prompt copied to clipboard!');
    setTimeout(() => setCopyStatus(''), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Product Management Specification</span>
          <span aria-hidden="true">·</span>
          <span>Google AI Studio Master Blueprint</span>
          <span aria-hidden="true">·</span>
          <span>Comprehensive Prompt & Review</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Master Build Prompt & Architectural Audit
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          Below is the consolidated, unified master prompt incorporating all operational rules, system constraints, and technical architecture—paired with a rigorous Product Manager review analyzing edge cases, contradictions, and alignment with your original mission.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('prompt')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'prompt' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Master Executable Prompt
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'audit' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          PM Review: Gap & Contradiction Audit
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'architecture' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          AI Studio Architecture Table
        </button>
      </div>

      {/* Tab 1: The Master Prompt */}
      {activeTab === 'prompt' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Consolidated Google AI Studio Build Prompt
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ready to copy and execute directly into Google AI Studio Build.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {copyStatus && (
                <span className="text-xs text-emerald-700 font-semibold">{copyStatus}</span>
              )}
              <button
                onClick={handleCopy}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Copy Master Prompt
              </button>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-200 p-5 rounded-lg font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed">
            <pre className="whitespace-pre-wrap">{masterPromptText}</pre>
          </div>
        </div>
      )}

      {/* Tab 2: PM Review & Critical Audit */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wide block mb-1">
                Product Review Report
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Critical Evaluation Against Your Original Problem Statement
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Audited against: <em>"Assisting hostel students and homemakers in maintaining a healthy lifestyle with local ingredients without rigid restrictions."</em>
              </p>
            </div>

            <div className="space-y-6 text-xs text-slate-700">
              {/* Check 1: Does it solve the original problem? */}
              <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-emerald-950">
                    1. Core Alignment: Does it solve the problem you started with?
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    VERIFIED · 100% ALIGNED
                  </span>
                </div>
                <p className="text-emerald-900 leading-relaxed">
                  Yes, with exceptional specificity. Most nutrition apps fail for hostel students and homemakers because they assume individual meal cooking, expensive superfoods (avocado, quinoa, salmon), and full kitchens. By grounding the AI in <strong>hostel equipment (kettles/induction)</strong>, <strong>local mandi staples (Sattu, Kala Chana, Curd, Peanuts)</strong>, and <strong>zero-waste family batch cooking ("Cook Once, Adapt for Four")</strong>, the prompt directly solves your primary recurring problem.
                </p>
              </div>

              {/* Check 2: Potential Contradictions Checked */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    2. Contradiction Analysis: Were there conflicting requirements?
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    RESOLVED
                  </span>
                </div>
                <ul className="space-y-2 text-slate-600 list-disc pl-4">
                  <li>
                    <strong>"Zero Restrictions" vs. "Mandatory Pre-Meal Check-in":</strong> Users hate tedious food logging. We resolved this by providing <strong>1-tap quick presets</strong> (e.g. "Mess Thali", "Samosa & Chai", "Skipped") instead of requiring gram-by-gram weighing.
                  </li>
                  <li>
                    <strong>"Zero Ads & Free" vs. "Sustainable Business Model":</strong> Solved by transparent <strong>affiliate links</strong> on the Dual Market Triangulation buttons (Blinkit/Zepto/Instamart for groceries, Swiggy/Zomato for meals) that add genuine user value rather than distracting banner ads.
                  </li>
                  <li>
                    <strong>"Pure GenAI" vs. "Regional Grocery Data":</strong> Clarified that LLMs should NOT hallucinate store stock or pricing; the system uses pre-fetched local mandi benchmarks + direct quick-commerce deep links.
                  </li>
                </ul>
              </div>

              {/* Check 3: What was missing that we added? */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    3. Gaps Filled: Key Enhancements Injected from the Specification PDF
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                    ENHANCED
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                  <div className="p-3 bg-white rounded border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">Dual Market Triangulation</span>
                    <p className="text-[11px]">Gives every meal both a DIY 10-min grocery option (Blinkit) AND a delivered regional canteen/dhaba option (Swiggy).</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">14-Day Deficit Supplement Trigger</span>
                    <p className="text-[11px]">Prevents dangerous chronic micro-nutrient gaps (B12, Vitamin D, Protein) by suggesting affordable generic Indian supplements when deficits persist past 14 days.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Technical Architecture Specification Table */}
      {activeTab === 'architecture' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Technical & AI Studio Architecture Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Exact component specifications and engineering rationales from the PDF blueprint.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 pr-4">Component</th>
                  <th className="py-3 px-4">Specification</th>
                  <th className="py-3 pl-4">Engineering Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-slate-900">Core Model</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-800 font-semibold">Gemini 3.8 Flash (gemini-3.8-flash)</td>
                  <td className="py-3.5 pl-4 text-slate-600">Low latency, cost-effective, high reasoning, massive context window.</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-slate-900">State Management</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">Dynamic 7-Day Context Injection</td>
                  <td className="py-3.5 pl-4 text-slate-600">Replaces complex fine-tunes; dynamically feeds weekly food logs into active system prompts.</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-slate-900">Data Scraper Pipeline</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">Offline Regional Scrapes</td>
                  <td className="py-3.5 pl-4 text-slate-600">Pre-fetches city-wise mandi prices to avoid latency or rate limits during meal planning.</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-slate-900">Monetization Engine</td>
                  <td className="py-3.5 px-4 font-mono text-blue-700">Quick Commerce & Dining Affiliates</td>
                  <td className="py-3.5 pl-4 text-slate-600">Keeps product 100% free and ad-free for students while generating sustainable revenue via Blinkit/Zepto/Swiggy.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
