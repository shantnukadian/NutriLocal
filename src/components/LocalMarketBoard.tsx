import React, { useState } from 'react';
import { LOCAL_MARKET_CATALOG } from '../data/mockData';
import { LocalMarketItem } from '../types';

export const LocalMarketBoard: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'hostel' | 'homemaker'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredItems = LOCAL_MARKET_CATALOG.filter(item => {
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'hostel' 
        ? item.hostelFriendly 
        : item.homemakerFriendly;

    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.notes.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Regional Food Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Local Mandi Index & Quick Commerce</span>
            <span aria-hidden="true">·</span>
            <span>Affordable Local Staples</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Local Market Ingredient Board
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            We ground every AI recommendation in affordable, culturally authentic ingredients available at neighborhood vegetable carts (mandis) and 10-minute quick commerce (Blinkit, Zepto, Instamart).
          </p>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-500 shrink-0">
          <span className="font-semibold text-slate-900 block">Monetization Model:</span>
          <span>Zero Ads & Zero Subscription. Affiliate-supported.</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        {/* Interactive Segmented Filter Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Staples ({LOCAL_MARKET_CATALOG.length})
          </button>
          <button
            onClick={() => setFilter('hostel')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              filter === 'hostel' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hostel Friendly (Kettle/No-cook)
          </button>
          <button
            onClick={() => setFilter('homemaker')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              filter === 'homemaker' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Homemaker Family Batch
          </button>
        </div>

        {/* Search */}
        <div className="sm:max-w-xs w-full">
          <input
            type="text"
            placeholder="Search Sattu, Chana, Palak, Eggs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Ingredient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
          >
            <div>
              <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                <span className="font-semibold text-slate-700">{item.category}</span>
                <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  ₹{item.pricePerKg} / {item.unit}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">
                {item.name}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {item.notes}
              </p>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Cooking Equipment:</span>
                  <span className="font-medium text-slate-800">{item.equipment}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Seasonality:</span>
                  <span className="font-medium text-slate-800">{item.seasonal}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="font-mono tabular-nums text-slate-600">
                <strong className="text-emerald-700">{item.proteinPer100g}g</strong> Protein / 100g
              </div>

              <a
                href={`https://${item.quickCommercePartner.toLowerCase()}.com`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
              >
                Buy on {item.quickCommercePartner} →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
