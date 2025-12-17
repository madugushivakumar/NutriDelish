import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  ShoppingCart, 
  Wallet, 
  Activity, 
  Users, 
  BrainCircuit, 
  AlertTriangle, 
  TrendingUp,
  X,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  Flame,
  Info,
  Leaf,
  Beef,
  Sprout,
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Share2,
  History,
  Sparkles,
  Utensils,
  Timer,
  UserPlus,
  Trash2,
  MapPin,
  Bike,
  Phone,
  MessageSquare,
  CheckCircle,
  Home,
  Navigation,
  Map as MapIcon,
  List,
  Filter,
  Zap,
  Loader2,
  Globe,
  Smartphone,
  Banknote,
  RotateCcw,
  Gift,
  ShieldCheck,
  Building,
  Lock,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Star
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { MOCK_COUPONS, HealthCondition, Tag, PaymentMethod } from './constants';
import { MOCK_RESTAURANTS, MOCK_DISHES } from './mockData';
import { getFoodRecommendation, generateDishFromQuery, getRestaurants, getDishes, generateDishImage } from './services/api';

// --- Helper Functions ---

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const d = R * c; // Distance in km
  return parseFloat(d.toFixed(1));
};

// --- Components ---

const Navbar = ({ 
  cartCount, 
  balance, 
  onViewChange, 
  currentView,
  searchQuery,
  setSearchQuery,
  userLocation,
  onChangeLocation,
  onBackToLanding,
  isGenerating
}) => (
  <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm py-4">
    <div className="w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto px-6 md:px-12">
      <div className="flex justify-between items-center gap-8">
        {/* Logo */}
        <div className="flex items-center cursor-pointer flex-shrink-0" onClick={onBackToLanding}>
           <div className="bg-orange-500 rounded-full p-2 mr-3"><Utensils size={24} className="text-white"/></div>
           <span className="text-3xl font-bold font-serif text-black tracking-tight hidden sm:block">
             ORDER MEAL
           </span>
        </div>

        {/* Location Display */}
        {userLocation && (
          <div 
            className="hidden xl:flex items-center cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-xl border border-transparent hover:border-gray-200 transition"
            onClick={onChangeLocation}
          >
            <div className="bg-orange-50 p-2 rounded-full mr-3">
              <MapPin size={20} className="text-orange-500" />
            </div>
            <div className="truncate max-w-[200px]">
              <span className="block font-bold text-gray-900 text-sm leading-none mb-1">Delivering to</span>
              <span className="text-gray-500 text-xs truncate block">{userLocation.address}</span>
            </div>
            <ChevronDown size={16} className="ml-2 text-gray-400" />
          </div>
        )}
        
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isGenerating ? (
               <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />
            ) : (
               <Search className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-10 py-3 border border-gray-200 rounded-full leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base transition-all shadow-sm"
            placeholder={isGenerating ? "AI Chef is cooking up results..." : "Search for restaurants, cuisine or a dish..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8 flex-shrink-0">
          <NavButton active={currentView === 'home'} onClick={() => onViewChange('home')} text="Food" />
          <NavButton active={currentView === 'ai'} onClick={() => onViewChange('ai')} text="Advisor" />
          <NavButton active={currentView === 'group'} onClick={() => onViewChange('group')} text="Group" />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <div className="hidden sm:flex items-center bg-black text-white px-5 py-2.5 rounded-full cursor-pointer hover:bg-orange-500 transition shadow-lg" onClick={() => onViewChange('wallet')}>
            <Wallet className="h-5 w-5 mr-2" />
            <span className="font-bold text-lg">INR {balance.toFixed(0)}</span>
          </div>
          <button 
            type="button"
            className="relative p-2 text-gray-800 hover:text-orange-500 transition"
            onClick={() => onViewChange('cart')}
          >
            <ShoppingCart className="h-8 w-8" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-red-600 rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
    
    {/* Mobile Search & Nav */}
    <div className="md:hidden px-4 pb-2 pt-2 space-y-2">
       <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="block w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm bg-gray-50 focus:ring-1 focus:ring-orange-500 outline-none"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
       </div>
       <div className="flex justify-around pt-2 border-t border-gray-100">
         <NavButtonMobile active={currentView === 'home'} onClick={() => onViewChange('home')} icon={<Utensils size={20} />} />
         <NavButtonMobile active={currentView === 'ai'} onClick={() => onViewChange('ai')} icon={<BrainCircuit size={20} />} />
         <NavButtonMobile active={currentView === 'group'} onClick={() => onViewChange('group')} icon={<Users size={20} />} />
         <NavButtonMobile active={currentView === 'wallet'} onClick={() => onViewChange('wallet')} icon={<Wallet size={20} />} />
       </div>
    </div>
  </nav>
);

const NavButton = ({ active, onClick, text }) => (
  <button
    onClick={onClick}
    className={`text-xl font-bold transition-colors ${
      active ? 'text-orange-500' : 'text-gray-600 hover:text-black'
    }`}
  >
    {text}
  </button>
);

const NavButtonMobile = ({ active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-xl transition-colors ${
      active ? 'bg-orange-50 text-orange-600' : 'text-gray-400'
    }`}
  >
    {icon}
  </button>
);

// --- Landing Page ---

const LandingPage = ({ onGetStarted, allDishes = [] }) => {
  return (
    <div className="font-sans text-gray-800 bg-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 text-white">
        <div className="flex gap-8 items-center">
           <div className="text-4xl font-bold tracking-tighter flex items-center gap-2 font-serif cursor-pointer" onClick={onGetStarted}>
             <div className="bg-orange-500 rounded-full p-2"><Utensils size={28} className="text-white"/></div>
             ORDER MEAL
           </div>
           <div className="hidden md:flex gap-8 text-xl font-bold tracking-wide">
             <button onClick={onGetStarted} className="hover:text-orange-400 transition">Home</button>
             <button onClick={onGetStarted} className="hover:text-orange-400 transition">Order</button>
             <button onClick={onGetStarted} className="hover:text-orange-400 transition">Promotion</button>
           </div>
        </div>
        <div className="flex gap-6 items-center">
           <Search className="w-8 h-8 cursor-pointer hover:text-orange-400 transition"/>
           <Heart className="w-8 h-8 cursor-pointer hover:text-orange-400 transition"/>
           <div onClick={onGetStarted} className="cursor-pointer hover:text-orange-400 transition relative">
              <ShoppingCart className="w-8 h-8"/>
           </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-[#0f172a] text-white min-h-screen flex items-center pt-20 overflow-hidden">
         {/* Background Overlay */}
         <div className="absolute inset-0 z-0">
            <img 
               src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974" 
               className="w-full h-full object-cover opacity-20" 
               alt="Background"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
         </div>
         
         <div className="w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto px-6 md:px-12 relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 md:pr-12 animate-in slide-in-from-left duration-700">
               <h3 className="text-orange-500 font-bold tracking-[0.2em] text-sm uppercase">Find Your Favorite Dish</h3>
               <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold leading-[0.9]">
                 ORDER FOOD <br/> TO YOUR DOOR
               </h1>
               <p className="text-gray-300 max-w-md text-base md:text-lg leading-relaxed">
                 Discover culinary delights and find your favorite dish with our swift and savory food delivery service.
               </p>
               <button 
                 onClick={onGetStarted}
                 className="bg-white text-black px-6 md:px-10 py-3 md:py-4 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-colors duration-200 shadow-lg hover:shadow-xl mt-4 md:mt-6 text-base md:text-lg inline-block"
               >
                 Explore Menu
               </button>
            </div>
            
            <div className="relative flex justify-center animate-in zoom-in duration-1000">
               {/* 12K User Badge */}
               <div className="absolute top-10 right-0 md:-right-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center z-20 transform translate-x-4 -translate-y-4 shadow-xl">
                  <div className="text-3xl font-bold text-orange-500">12K+</div>
                  <div className="text-xs text-gray-300 font-medium uppercase tracking-wider">Users using our Services</div>
               </div>
               
               {/* Big Burger Image */}
               <div className="relative z-10 w-[350px] h-[350px] md:w-[500px] md:h-[500px]">
                  <div className="absolute inset-0 bg-orange-500 rounded-full blur-[100px] opacity-20"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80" 
                    alt="Giant Burger" 
                    className="w-full h-full object-cover rounded-full shadow-2xl relative z-10 transform hover:rotate-3 transition duration-700 border-4 border-white/5"
                  />
               </div>
            </div>
         </div>

         {/* Bottom Wave */}
         <div className="absolute bottom-0 left-0 w-full leading-none z-20">
            <svg viewBox="0 0 1440 320" className="w-full h-24 md:h-48 block" preserveAspectRatio="none">
              <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
         </div>
      </div>

      {/* Steps Section */}
      <div className="py-24 bg-white relative">
         <div className="w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto px-6 md:px-12">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               <div className="lg:w-1/3 space-y-6">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight text-gray-900">
                    GET YOUR FOOD <br/> IN LESS THAN <br/> AN HOUR
                  </h2>
                  <p className="text-gray-500 leading-relaxed text-lg">
                    Craving delicious meals without the hassle of cooking? Look no further than OrderMeal. 
                    We bring the restaurant experience to your home.
                  </p>
                  <button onClick={onGetStarted} className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-orange-500 hover:text-white transition shadow-lg text-lg">
                     Explore Menu
                  </button>
               </div>
               
               <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                  {/* Step 1 */}
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative z-10 hover:-translate-y-2 transition duration-300">
                     <div className="text-5xl font-bold text-gray-100 absolute top-4 right-6">01</div>
                     <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-500">
                        <Globe size={28}/>
                     </div>
                     <h3 className="text-xl font-bold mb-3">Browse Website</h3>
                     <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                        Visit OrderMeal on your browser to explore our curated list of top-rated restaurants.
                     </p>
                     <span className="text-orange-500 font-bold text-sm cursor-pointer hover:underline" onClick={onGetStarted}>Browse Now &gt;</span>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-orange-500 text-white p-8 rounded-3xl shadow-xl relative z-20 transform md:translate-y-12 hover:-translate-y-2 transition duration-300">
                     <div className="text-5xl font-bold text-orange-400 absolute top-4 right-6">02</div>
                     <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-white">
                        <Utensils size={28}/>
                     </div>
                     <h3 className="text-xl font-bold mb-3">Select your food</h3>
                     <p className="text-orange-100 text-sm mb-4 leading-relaxed">
                        Choose from thousands of dishes across various cuisines that match your taste and health goals.
                     </p>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 md:col-span-2 md:w-2/3 md:mx-auto transform md:-translate-y-6 hover:-translate-y-2 transition duration-300">
                     <div className="text-5xl font-bold text-gray-100 absolute top-4 right-6">03</div>
                     <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                        <CheckCircle size={28}/>
                     </div>
                     <h3 className="text-xl font-bold mb-3">Confirm your order</h3>
                     <p className="text-gray-500 text-sm leading-relaxed">
                        Proceed to checkout with secure payment options and track your meal in real-time until it arrives.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Deals Section */}
      <div className="py-24 bg-white relative">
         <div className="w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto px-6 md:px-12 text-center">
             <div className="mb-16">
                <p className="text-orange-500 font-bold tracking-[0.2em] text-sm uppercase mb-4">Don't Miss Out</p>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">SEE TODAYS BEST DEAL !!!</h2>
             </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
               {[
                 allDishes[0], 
                 allDishes[3], 
                 allDishes[6], 
                 allDishes[7], 
                 allDishes[9], 
                 allDishes[17]
               ].filter(Boolean).map((dish, idx) => (
                 <div key={dish?._id || dish?.id || idx} className="group cursor-pointer relative text-center" onClick={onGetStarted}>
                    <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-gray-100 group-hover:border-orange-500 transition-all duration-300 mx-auto mb-6 relative shadow-lg">
                       <img 
                         src={dish.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EFood%3C/text%3E%3C/svg%3E'} 
                         className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" 
                         alt={dish.name}
                         onError={(e) => {
                           // Prevent infinite loop - use data URI instead of making network request
                           e.target.onerror = null;
                           e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EFood%3C/text%3E%3C/svg%3E';
                         }}
                         loading="lazy"
                       />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                          <span className="bg-white text-black font-bold px-6 py-2 rounded-full text-lg">Order Now</span>
                       </div>
                    </div>
                    <h3 className="font-bold text-2xl text-gray-900 group-hover:text-orange-500 transition px-4">{dish?.name || 'Dish'}</h3>
                    <p className="text-gray-400 text-sm mt-2">{(dish?.tags || []).slice(0,2).join(', ')}</p>
                    <p className="text-orange-600 font-bold text-2xl mt-3">INR {dish?.price || 0}</p>
                 </div>
               ))}
            </div>
            <button onClick={onGetStarted} className="mt-20 bg-black text-white px-12 py-4 rounded-full font-bold hover:bg-orange-500 transition shadow-lg text-lg">
               See All Menu
            </button>
         </div>
      </div>

      {/* Partner Section */}
      <div className="bg-black py-24 text-white relative overflow-hidden">
         {/* Top Wave */}
         <div className="absolute top-0 left-0 w-full leading-none transform rotate-180">
            <svg viewBox="0 0 1440 120" className="w-full h-12 block bg-white" preserveAspectRatio="none">
              <path fill="#000000" fillOpacity="1" d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,42.7C1248,43,1344,53,1392,58.7L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
            </svg>
         </div>

         <div className="w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto px-6 md:px-12 mt-12">
            <div className="grid md:grid-cols-2 gap-16 items-center">
               <div className="space-y-6">
                  <div className="text-orange-500 font-serif italic text-2xl">Join Us</div>
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight">PARTNER FOR <br/> SHARED SUCCESS</h2>
                  <p className="text-gray-400 text-lg leading-relaxed">
                     Join us as a partner and expand your reach in the culinary world. Showcase your delicious creations to a broader audience through our platform.
                  </p>
                  <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-orange-500 hover:text-white transition mt-4 text-lg">
                     Join Now
                  </button>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-[#1a1a1a] p-6 rounded-3xl text-center border border-gray-800 hover:border-orange-500 transition duration-300">
                     <div className="h-40 mb-4 rounded-2xl overflow-hidden bg-gray-700">
                        <img 
                           src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=400&fit=crop&q=80" 
                           className="w-full h-full object-cover hover:scale-110 transition duration-500"
                           alt="Restaurant interior"
                           onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=400&fit=crop&q=80";
                           }}
                        />
                     </div>
                     <h3 className="font-bold text-lg mb-2">Got a Restaurant?</h3>
                     <a href="#" className="text-sm font-bold text-orange-500 hover:text-orange-400">Read More &rarr;</a>
                  </div>
                  <div className="bg-[#1a1a1a] p-6 rounded-3xl text-center border border-gray-800 hover:border-orange-500 transition duration-300 transform translate-y-8">
                     <div className="h-40 mb-4 rounded-2xl overflow-hidden bg-gray-700">
                        <img 
                           src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop&q=80" 
                           className="w-full h-full object-cover hover:scale-110 transition duration-500"
                           alt="Delivery bike"
                           onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=400&fit=crop&q=80";
                           }}
                        />
                     </div>
                     <h3 className="font-bold text-lg mb-2">Got a Bike?</h3>
                     <a href="#" className="text-sm font-bold text-orange-500 hover:text-orange-400">Read More &rarr;</a>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Why We Are Best */}
      <div className="bg-slate-50 py-24 relative overflow-hidden">
         {/* Transition to White */}
         <div className="absolute top-0 left-0 w-full leading-none">
            <svg viewBox="0 0 1440 120" className="w-full h-12 block bg-black" preserveAspectRatio="none">
               <path fill="#f8fafc" fillOpacity="1" d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,42.7C1248,43,1344,53,1392,58.7L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
            </svg>
         </div>

         <div className="w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto px-6 md:px-12 text-center relative z-10 mt-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-20 text-gray-900">WHY WE ARE BEST</h2>
            
            <div className="grid lg:grid-cols-3 items-center gap-12">
               {/* Left Column */}
               <div className="space-y-16 lg:text-right">
                  <div className="group">
                     <div className="flex items-center lg:justify-end gap-4 mb-3">
                        <h3 className="font-bold text-2xl group-hover:text-orange-500 transition">Wide Culinary Selection</h3>
                        <div className="bg-black text-white w-12 h-12 flex items-center justify-center rounded-lg font-mono font-bold text-xl group-hover:bg-orange-500 transition">01</div>
                     </div>
                     <p className="text-gray-500 text-lg leading-relaxed">Choose from a diverse range of cuisines, ensuring there's something for every craving.</p>
                  </div>
                  <div className="group">
                     <div className="flex items-center lg:justify-end gap-4 mb-3">
                        <h3 className="font-bold text-2xl group-hover:text-orange-500 transition">Fast Delivery</h3>
                        <div className="bg-black text-white w-12 h-12 flex items-center justify-center rounded-lg font-mono font-bold text-xl group-hover:bg-orange-500 transition">02</div>
                     </div>
                     <p className="text-gray-500 text-lg leading-relaxed">Our efficient network ensures your food arrives fresh and hot, right on time.</p>
                  </div>
               </div>

               {/* Center Image */}
               <div className="relative order-first lg:order-none mb-12 lg:mb-0">
                  <div className="absolute inset-0 bg-orange-500 rounded-full opacity-10 blur-3xl transform scale-150"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=800&fit=crop&q=80" 
                    className="w-80 h-80 md:w-96 md:h-96 object-cover rounded-full mx-auto relative z-10 shadow-2xl hover:rotate-6 transition duration-700 border-8 border-white" 
                    alt="Center Burger"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=800&fit=crop&q=80";
                    }}
                  />
               </div>

               {/* Right Column */}
               <div className="space-y-16 text-left">
                  <div className="group">
                     <div className="flex items-center gap-4 mb-3">
                        <div className="bg-black text-white w-12 h-12 flex items-center justify-center rounded-lg font-mono font-bold text-xl group-hover:bg-orange-500 transition">03</div>
                        <h3 className="font-bold text-2xl group-hover:text-orange-500 transition">Real-time Tracking</h3>
                     </div>
                     <p className="text-gray-500 text-lg leading-relaxed">Stay informed with live order tracking, so you know exactly where your meal is.</p>
                  </div>
                  <div className="group">
                     <div className="flex items-center gap-4 mb-3">
                        <div className="bg-black text-white w-12 h-12 flex items-center justify-center rounded-lg font-mono font-bold text-xl group-hover:bg-orange-500 transition">04</div>
                        <h3 className="font-bold text-2xl group-hover:text-orange-500 transition">24/7 Support</h3>
                     </div>
                     <p className="text-gray-500 text-lg leading-relaxed">Need assistance? Our support team is available around the clock to assist you.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

       {/* Footer */}
       <footer className="bg-black text-white py-16 border-t border-gray-900">
          <div className="w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="text-3xl font-bold tracking-tighter flex items-center gap-2 font-serif">
               <div className="bg-orange-500 rounded-full p-2"><Utensils size={20} className="text-white"/></div>
               ORDER MEAL
             </div>
             
             <div className="flex flex-col md:flex-row gap-8 text-lg font-medium text-gray-400">
                <a href="#" className="hover:text-white transition">About Us</a>
                <a href="#" className="hover:text-white transition">Terms & Conditions</a>
                <a href="#" className="hover:text-white transition">Privacy Policy</a>
                <a href="#" className="hover:text-white transition">Contact</a>
             </div>

             <div className="flex gap-6">
                <div className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 hover:text-white transition cursor-pointer"><Facebook size={24}/></div>
                <div className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 hover:text-white transition cursor-pointer"><Twitter size={24}/></div>
                <div className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 hover:text-white transition cursor-pointer"><Instagram size={24}/></div>
             </div>
          </div>
          <div className="text-center text-gray-600 text-sm mt-12">
             Â© 2024 OrderMeal. All rights reserved.
          </div>
       </footer>

    </div>
  );
};

const TagBadge = ({ tag }) => {
  let color = 'bg-gray-100 text-gray-600';
  if (tag === Tag.VEG) color = 'bg-green-100 text-green-800 border-green-200';
  if (tag === Tag.NON_VEG) color = 'bg-red-100 text-red-800 border-red-200';
  if (tag === Tag.VEGAN) color = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (tag === Tag.HIGH_PROTEIN) color = 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (tag === Tag.GLUTEN_FREE) color = 'bg-blue-100 text-blue-800 border-blue-200';
  if (tag === Tag.STREET_FOOD) color = 'bg-orange-100 text-orange-800 border-orange-200';
  if (tag === Tag.SEAFOOD) color = 'bg-cyan-100 text-cyan-800 border-cyan-200';
  if (tag === Tag.BEVERAGE) color = 'bg-pink-100 text-pink-800 border-pink-200';
  if (tag === Tag.FAST_FOOD) color = 'bg-amber-100 text-amber-800 border-amber-200';
  
  return (
    <span className={`text-[10px] px-2 py-1 rounded border ${color} mr-1 font-medium`}>
      {tag}
    </span>
  );
};

const RegretBadge = () => (
  <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded shadow-lg flex items-center animate-pulse z-10">
    <AlertTriangle size={12} className="mr-1" />
    High Regret Risk
  </div>
);

const RestaurantMenuModal = ({ 
  isOpen, 
  onClose, 
  restaurant, 
  addToCart,
  checkRegret
}) => {
  const [activeConditions, setActiveConditions] = useState([]);

  if (!isOpen || !restaurant) return null;

  const toggleCondition = (c) => {
    setActiveConditions(prev => 
      prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]
    );
  };

  const isDishSafe = (dish) => {
    if (activeConditions.length === 0 || activeConditions.includes(HealthCondition.NONE)) return true;
    
    // Disease Logic
    if (activeConditions.includes(HealthCondition.DIABETES)) {
      if (dish.carbs > 50 || dish.tags.includes(Tag.SWEET)) return false;
    }
    if (activeConditions.includes(HealthCondition.HIGH_BP)) {
      if (dish.sodium > 800 || dish.tags.includes(Tag.OILY)) return false;
    }
    if (activeConditions.includes(HealthCondition.PCOD) || activeConditions.includes(HealthCondition.THYROID)) {
       if (dish.tags.includes(Tag.GLUTEN_FREE) && dish.tags.includes(Tag.VEGAN)) return true;
       if (dish.tags.includes(Tag.FAST_FOOD) || dish.tags.includes(Tag.OILY) || dish.tags.includes(Tag.SWEET)) return false;
    }
    return true;
  };

  const filteredMenu = restaurant.menu.filter(isDishSafe);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col animate-in zoom-in-95 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
           <div>
              <h2 className="text-3xl font-bold font-serif text-gray-900">{restaurant.name}</h2>
              <p className="text-gray-500 mt-1">{restaurant.cuisine.join(' • ')}</p>
           </div>
           <button onClick={onClose} className="bg-white p-2 rounded-full hover:bg-gray-200 transition">
             <X size={24} className="text-gray-600"/>
           </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-100 overflow-x-auto">
           <div className="flex gap-2 min-w-max items-center">
              <span className="text-xs font-bold uppercase text-gray-400 mr-2 flex items-center">
                 <Filter size={14} className="mr-1"/> Filter by Health:
              </span>
              {[HealthCondition.NONE, HealthCondition.DIABETES, HealthCondition.HIGH_BP, HealthCondition.PCOD, HealthCondition.THYROID].map(condition => (
                 <button
                    key={condition}
                    onClick={() => toggleCondition(condition)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
                       activeConditions.includes(condition)
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                 >
                    {condition}
                 </button>
              ))}
           </div>
        </div>

        {/* Menu List */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
           {filteredMenu.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                 <AlertTriangle size={48} className="mx-auto mb-4 opacity-50"/>
                 <p className="text-lg">No dishes match your selected health filters.</p>
              </div>
           ) : (
              <div className="grid md:grid-cols-2 gap-6">
                 {filteredMenu.map(dish => (
                    <div key={dish.id} className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition group bg-white">
                       <div className="relative w-32 h-32 flex-shrink-0">
                          <img 
                            src={dish.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f3f4f6" width="300" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EFood%3C/text%3E%3C/svg%3E'} 
                            alt={dish.name} 
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                              // Prevent network requests - use data URI instead
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f3f4f6" width="300" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EFood%3C/text%3E%3C/svg%3E';
                            }}
                            loading="lazy"
                          />
                          {checkRegret(dish) && <RegretBadge />}
                       </div>
                       <div className="flex-1 flex flex-col justify-between">
                          <div>
                             <div className="flex justify-between items-start">
                                <h4 className="font-bold text-gray-900 text-lg leading-tight">{dish.name}</h4>
                                <TagBadge tag={dish.tags.includes(Tag.VEG) ? Tag.VEG : Tag.NON_VEG} />
                             </div>
                             <p className="text-sm text-gray-500 line-clamp-2 mt-1">{dish.description}</p>
                             <div className="flex flex-wrap gap-1 mt-2">
                                {dish.tags.slice(1, 3).map(t => <TagBadge key={t} tag={t} />)}
                             </div>
                          </div>
                          <div className="flex justify-between items-end mt-3">
                             <div className="font-bold text-xl text-orange-600">INR {dish.price}</div>
                             <button 
                                onClick={() => addToCart(dish)}
                                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-500 transition shadow-md"
                             >
                                ADD +
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

const LocationModal = ({ 
  isOpen, 
  onLocationSelect 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [houseNo, setHouseNo] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('');
  
  if (!isOpen) return null;

  const handleDetectLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      // Faster options for manual detection
      const options = {
        enableHighAccuracy: false, // Faster, less accurate
        timeout: 3000, // 3 seconds timeout (shorter)
        maximumAge: 300000 // Accept cached location up to 5 minutes old
      };
      
      // Set a backup timeout to ensure we don't hang forever
      const backupTimeout = setTimeout(() => {
        setIsLoading(false);
        // Silently set default location if GPS takes too long
        const defaultLoc = {
          address: "New Delhi, India",
          lat: 28.6139,
          lng: 77.2090
        };
        onLocationSelect(defaultLoc);
        console.log('⏱️ Location detection timed out, using default location');
      }, 4000); // 4 seconds total max wait
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(backupTimeout);
          setIsLoading(false);
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Set location immediately with coordinates (don't wait for address)
          const loc = {
            address: `Current GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            lat: lat,
            lng: lng
          };
          onLocationSelect(loc);
          console.log('✅ Location detected:', lat, lng);
          
          // Try to get address in background (non-blocking, with timeout)
          const fetchController = new AbortController();
          const fetchTimeout = setTimeout(() => fetchController.abort(), 2000);
          
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`, {
            signal: fetchController.signal
          })
            .then(res => res.json())
            .then(data => {
              clearTimeout(fetchTimeout);
              const address = data.locality 
                ? `${data.locality}, ${data.city || data.principalSubdivision || 'Unknown'}`
                : loc.address;
              
              // Update location with better address
              const updatedLoc = {
                address: address,
                lat: lat,
                lng: lng
              };
              onLocationSelect(updatedLoc);
              console.log('✅ Updated location address:', address);
            })
            .catch(() => {
              clearTimeout(fetchTimeout);
              // Already set location with coordinates, that's fine
              console.log('⚠️ Could not fetch address, using coordinates');
            });
        },
        (error) => {
          clearTimeout(backupTimeout);
          setIsLoading(false);
          // Error - Log but don't show alert (less intrusive)
          console.error("GPS Error", error);
          
          // Silently set default location instead of showing alert
          const defaultLoc = {
            address: "New Delhi, India",
            lat: 28.6139,
            lng: 77.2090
          };
          onLocationSelect(defaultLoc);
          
          // Only show console message, not alert
          if (error.code === error.PERMISSION_DENIED) {
            console.log('⚠️ Location permission denied. Please enable in browser settings or enter manually.');
          } else if (error.code === error.TIMEOUT) {
            console.log('⚠️ Location request timed out. Using default location.');
          } else {
            console.log('⚠️ Could not detect location. Using default location.');
          }
        },
        options
      );
    } else {
      // Browser doesn't support geolocation - set default immediately
      setIsLoading(false);
      const defaultLoc = {
        address: "New Delhi, India",
        lat: 28.6139,
        lng: 77.2090
      };
      onLocationSelect(defaultLoc);
      console.log('⚠️ Geolocation not supported. Using default location.');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!area || !city) return;

    // Construct full address string
    const fullAddress = `${houseNo ? houseNo + ', ' : ''}${area}, ${city}${pincode ? ' - ' + pincode : ''}`;

    // Pseudo-Geocoding: Generate deterministic coordinates based on the area name + city
    const cityLower = city.toLowerCase();
    
    // Default to New Delhi coordinates
    let lat = 28.6139;
    let lng = 77.2090;

    // Basic mapping for major cities to allow testing different locations
    if (cityLower.includes('mumbai')) { lat = 19.0760; lng = 72.8777; }
    else if (cityLower.includes('bangalore') || cityLower.includes('bengaluru')) { lat = 12.9716; lng = 77.5946; }
    else if (cityLower.includes('hyderabad')) { lat = 17.3850; lng = 78.4867; }
    else if (cityLower.includes('chennai')) { lat = 13.0827; lng = 80.2707; }
    else if (cityLower.includes('kolkata')) { lat = 22.5726; lng = 88.3639; }
    else if (cityLower.includes('pune')) { lat = 18.5204; lng = 73.8567; }
    else if (cityLower.includes('gurgaon') || cityLower.includes('gurugram')) { lat = 28.4595; lng = 77.0266; }
    else if (cityLower.includes('noida')) { lat = 28.5355; lng = 77.3910; }
    else if (cityLower.includes('london')) { lat = 51.5074; lng = -0.1278; }
    else if (cityLower.includes('new york')) { lat = 40.7128; lng = -74.0060; }
    
    // Simple hash function to generate offset based on area name to prevent exact overlaps
    const hash = area.toLowerCase().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Create an offset between -0.05 and 0.05 degrees (approx 5km radius)
    const latOffset = ((hash % 100) / 1000) * (hash % 2 === 0 ? 1 : -1);
    const lngOffset = ((hash % 100) / 1000) * (hash % 3 === 0 ? 1 : -1);

    onLocationSelect({
      address: fullAddress,
      lat: lat + latOffset,
      lng: lng + lngOffset
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 overflow-y-auto max-h-[90vh]">
        <div className="text-center mb-6">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Delivery Location</h2>
          <p className="text-gray-500 mt-2">Where should we bring your food?</p>
        </div>

        <button 
          onClick={handleDetectLocation}
          disabled={isLoading}
          className="w-full bg-white border-2 border-emerald-100 text-emerald-700 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-emerald-50 transition mb-4 group"
        >
          {isLoading ? (
             <Loader2 size={18} className="mr-2 animate-spin"/>
          ) : (
             <Navigation size={18} className="mr-2 group-hover:animate-bounce" />
          )}
          {isLoading ? "Detecting..." : "Use Current Location (GPS)"}
        </button>
        
        <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold tracking-widest">OR ENTER MANUALLY</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleManualSubmit} className="mt-4 space-y-3 text-left">
           <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Flat / House No</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={houseNo}
                onChange={e => setHouseNo(e.target.value)}
                placeholder="e.g. 402, Sunshine Apts"
              />
           </div>
           <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Area / Sector / Locality <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="e.g. Connaught Place"
              />
           </div>
           <div className="flex gap-2">
             <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase">City <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. New Delhi"
                />
             </div>
             <div className="w-1/3">
                <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  placeholder="110001"
                />
             </div>
           </div>
           
           <button 
             type="submit"
             disabled={!area || !city}
             className="w-full bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg mt-2"
           >
             Save Address & Proceed
           </button>
        </form>
      </div>
    </div>
  );
};

const CustomSelect = ({ 
  label, 
  value, 
  onChange, 
  options 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all shadow-sm ${
          isOpen 
            ? 'border-emerald-500 ring-2 ring-emerald-100 bg-white' 
            : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-emerald-200'
        }`}
      >
        <span className="font-medium text-gray-900">{value}</span>
        <ChevronDown 
          size={18} 
          className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-emerald-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`px-4 py-3 cursor-pointer text-sm font-medium transition-colors flex justify-between items-center ${
                option === value
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {option}
              {option === value && <CheckCircle2 size={16} className="text-emerald-600"/>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SplitBillModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const friends = ['Alice', 'Bob', 'Charlie', 'David'];

  if (!isOpen) return null;

  const handleToggleFriend = (friend) => {
    if (selectedFriends.includes(friend)) {
      setSelectedFriends(selectedFriends.filter(f => f !== friend));
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const sharePerPerson = amount ? (parseFloat(amount) / (selectedFriends.length + 1)).toFixed(2) : '0';

  const handleSendRequest = () => {
    alert(`Split request for INR ${sharePerPerson} sent to ${selectedFriends.length} friends!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center text-gray-900"><Share2 className="mr-2" size={20}/> Split Bill</h3>
          <button onClick={onClose}><X className="text-gray-500" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 font-bold">INR</span>
              <input 
                type="number" 
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Split with</label>
            <div className="grid grid-cols-2 gap-2">
              {friends.map(friend => (
                <div 
                  key={friend}
                  onClick={() => handleToggleFriend(friend)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedFriends.includes(friend) 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-medium' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold mr-2">
                      {friend[0]}
                    </div>
                    {friend}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {amount && parseFloat(amount) > 0 && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
               <div className="flex justify-between text-sm text-gray-600 mb-1">
                 <span>Total Split</span>
                 <span>{selectedFriends.length + 1} people</span>
               </div>
               <div className="flex justify-between text-lg font-bold text-gray-900">
                 <span>Your Share</span>
                 <span>INR {sharePerPerson}</span>
               </div>
            </div>
          )}

          <button 
            onClick={handleSendRequest}
            disabled={!amount || selectedFriends.length === 0}
            className="w-full bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg"
          >
            Send Payment Links (UPI)
          </button>
        </div>
      </div>
    </div>
  );
};

const WalletView = ({ 
  balance, 
  transactions, 
  onAddMoney,
  onOpenSplitBill,
  onRequestRefund
}) => {
  const [addAmount, setAddAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    const val = parseFloat(addAmount);
    if (val > 0) {
      onAddMoney(val);
      setAddAmount('');
      setIsAdding(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-emerald-100 font-medium mb-1">Total Balance</p>
          <h1 className="text-5xl font-bold mb-6">INR {balance.toFixed(2)}</h1>
          
          <div className="flex gap-4">
             <button 
               onClick={() => setIsAdding(!isAdding)}
               className="bg-white text-emerald-700 px-6 py-2.5 rounded-xl font-bold shadow-sm hover:bg-emerald-50 transition flex items-center"
             >
               <Plus size={18} className="mr-2"/> Add Money
             </button>
             <button 
               onClick={onOpenSplitBill}
               className="bg-emerald-700/50 backdrop-blur-sm text-white border border-white/20 px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center"
             >
               <Share2 size={18} className="mr-2"/> Split Bill
             </button>
          </div>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-black opacity-10 rounded-full blur-2xl"></div>
      </div>

      {/* Add Money Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 mb-8 animate-in slide-in-from-top-4">
           <h3 className="font-bold text-gray-900 mb-4">Add Funds to Wallet</h3>
           <div className="flex gap-4 mb-4">
              {[500, 1000, 2000].map(amt => (
                <button 
                  key={amt} 
                  onClick={() => setAddAmount(amt.toString())}
                  className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-600"
                >
                  + INR {amt}
                </button>
              ))}
           </div>
           <div className="flex gap-2">
             <div className="relative flex-1">
               <span className="absolute left-3 top-3 text-gray-500 font-bold">INR</span>
               <input 
                 type="number" 
                 value={addAmount} 
                 onChange={e => setAddAmount(e.target.value)}
                 className="w-full pl-8 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                 placeholder="Enter amount" 
               />
             </div>
             <button 
               onClick={handleAdd}
               className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700"
             >
               Proceed to Pay
             </button>
           </div>
        </div>
      )}

      {/* Transactions */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
           <History className="mr-2 text-gray-500"/> Payment Activity
        </h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           {transactions.length === 0 ? (
             <div className="p-8 text-center text-gray-400">No transactions yet</div>
           ) : (
             <div className="divide-y divide-gray-100">
                {transactions.map(t => (
                  <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition gap-4">
                     <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                          t.type === 'CREDIT' ? 'bg-green-100 text-green-600' : 
                          t.type === 'REFUND' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                        }`}>
                           {t.type === 'CREDIT' ? <ArrowDownLeft size={20}/> : t.type === 'REFUND' ? <RotateCcw size={20}/> : <ArrowUpRight size={20}/>}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{t.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                             <span>{t.date}</span>
                             <span>•</span>
                             <span>{t.method}</span>
                             {t.orderId && (
                               <>
                                <span>•</span>
                                <span>ID: {t.orderId}</span>
                               </>
                             )}
                          </div>
                        </div>
                     </div>
                     <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <div className={`font-bold ${
                            t.type === 'CREDIT' || t.type === 'REFUND' ? 'text-green-600' : 'text-gray-900'
                          }`}>
                            {t.type === 'CREDIT' || t.type === 'REFUND' ? '+' : '-'} INR {t.amount.toFixed(2)}
                          </div>
                          <div className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded w-fit ml-auto ${
                            t.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 
                            t.status === 'REFUNDED' ? 'bg-blue-100 text-blue-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {t.status}
                          </div>
                        </div>
                        {t.type === 'DEBIT' && t.status === 'SUCCESS' && (
                          <button 
                            onClick={() => onRequestRefund(t.id)}
                            className="text-xs font-medium text-gray-500 hover:text-emerald-600 underline"
                          >
                            Report / Refund
                          </button>
                        )}
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const PaymentModal = ({
  isOpen,
  onClose,
  totalAmount,
  walletBalance,
  onPay
}) => {
  const [method, setMethod] = useState(PaymentMethod.UPI);
  const [status, setStatus] = useState('IDLE');
  
  // Mock form states - dummy UPI for testing
  const [upiId, setUpiId] = useState('test@razorpay');
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [cardExpiry, setCardExpiry] = useState('12/25');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardName, setCardName] = useState('John Doe');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  
  // Dummy banks for net banking
  const dummyBanks = [
    'HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 
    'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda'
  ];
  
  // Generate random transaction ID
  const generateTransactionId = () => {
    return `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };
  
  // Load Razorpay script dynamically
  useEffect(() => {
    if (isOpen && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        // Cleanup if needed
      };
    }
  }, [isOpen]);
  
  // Initialize Razorpay payment
  const initiateRazorpayPayment = (paymentMethod) => {
    const txnId = generateTransactionId();
    setTransactionId(txnId);
    setStatus('PROCESSING');
    setProcessingStep('Initializing Razorpay gateway...');
    
    // Razorpay options with dummy/test keys
    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // Razorpay test key
      amount: Math.round(totalAmount * 100), // Amount in paise
      currency: 'INR',
      name: 'NutriDelish',
      description: `Order Payment - ${txnId}`,
      image: 'https://via.placeholder.com/150',
      order_id: null, // Will be generated by Razorpay
      handler: function (response) {
        // Payment success
        setStatus('SUCCESS');
        setProcessingStep('Payment successful!');
        setTransactionId(response.razorpay_payment_id);
        
        setTimeout(() => {
          onPay(paymentMethod);
        }, 2000);
      },
      prefill: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        contact: '9999999999'
      },
      notes: {
        address: 'NutriDelish Food Platform',
        order_id: txnId
      },
      theme: {
        color: '#10b981' // Emerald green
      },
      method: paymentMethod === PaymentMethod.UPI ? 'upi' : 
              paymentMethod === PaymentMethod.CARD ? 'card' :
              paymentMethod === PaymentMethod.NET_BANKING ? 'netbanking' : null,
      modal: {
        ondismiss: function() {
          setStatus('IDLE');
          setProcessingStep('');
        }
      }
    };
    
    // Simulate order creation delay
    setTimeout(() => {
      setProcessingStep('Creating payment order...');
      
      // For demo purposes, we'll simulate Razorpay
      // In production, you'd create an order on your backend first
      setTimeout(() => {
        if (window.Razorpay) {
          try {
            const razorpay = new window.Razorpay(options);
            razorpay.open();
            setProcessingStep('Waiting for payment confirmation...');
          } catch (error) {
            console.error('Razorpay error:', error);
            // Fallback to simulated payment
            simulateRazorpayPayment(paymentMethod, txnId);
          }
        } else {
          // Fallback if Razorpay script didn't load
          simulateRazorpayPayment(paymentMethod, txnId);
        }
      }, 1000);
    }, 500);
  };
  
  // Simulated Razorpay payment (fallback or for demo)
  const simulateRazorpayPayment = (paymentMethod, txnId) => {
    setProcessingStep('Processing through Razorpay...');
    
    setTimeout(() => {
      setProcessingStep('Validating payment details...');
    }, 800);
    
    setTimeout(() => {
      if (paymentMethod === PaymentMethod.CARD) {
        setShowOtp(true);
        setProcessingStep('OTP sent to your registered mobile');
        return;
      }
      setProcessingStep('Authorizing payment...');
    }, 1600);
    
    setTimeout(() => {
      if (paymentMethod === PaymentMethod.UPI) {
        setProcessingStep('Waiting for UPI confirmation...');
      } else {
        setProcessingStep('Processing transaction...');
      }
    }, 2400);
    
    setTimeout(() => {
      // 90% success rate
      if (Math.random() > 0.1) {
        setStatus('SUCCESS');
        setProcessingStep('Payment successful via Razorpay!');
        setTimeout(() => {
          onPay(paymentMethod);
        }, 2000);
      } else {
        setStatus('FAILED');
        setProcessingStep('Transaction declined by Razorpay');
      }
    }, 3200);
  };
  
  if (!isOpen) return null;

  const handlePayClick = () => {
    // Basic validation - relaxed for dummy/testing
    if (method === PaymentMethod.UPI && !upiId) {
      // Auto-fill dummy UPI if empty
      setUpiId('test@razorpay');
    }
    if (method === PaymentMethod.CARD && !cardNumber) {
      alert("Please enter card details");
      return;
    }
    if (method === PaymentMethod.NET_BANKING && !selectedBank) {
      alert("Please select a bank");
      return;
    }
    if (method === PaymentMethod.WALLET && walletBalance < totalAmount) {
      alert("Insufficient Wallet Balance");
      return;
    }
    if (method === PaymentMethod.COD) {
      // COD doesn't need Razorpay
      setStatus('SUCCESS');
      setTimeout(() => {
        onPay(method);
      }, 1000);
      return;
    }
    
    if (method === PaymentMethod.WALLET && walletBalance < totalAmount) {
      alert("Insufficient Wallet Balance");
      return;
    }

    // All other payments go through Razorpay
    initiateRazorpayPayment(method);
  };

  const handleOtpSubmit = () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter 6-digit OTP");
      return;
    }
    
    setShowOtp(false);
    setProcessingStep('Verifying OTP with Razorpay...');
    
    setTimeout(() => {
      setProcessingStep('Processing transaction through Razorpay...');
    }, 1000);
    
    setTimeout(() => {
      // 95% success after OTP
      if (Math.random() > 0.05) {
        setStatus('SUCCESS');
        setProcessingStep('Payment successful via Razorpay!');
        setTimeout(() => {
          onPay(method);
        }, 2000);
      } else {
        setStatus('FAILED');
        setProcessingStep('Invalid OTP or transaction declined by Razorpay');
      }
    }, 2000);
  };

  const retry = () => {
    setStatus('IDLE');
    setShowOtp(false);
    setOtp('');
    setProcessingStep('');
    setTransactionId('');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row h-[500px] animate-in zoom-in-95">
        
        {/* Left Sidebar - Methods */}
        <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-100 p-4 overflow-y-auto">
           <h3 className="font-bold text-gray-900 mb-4 px-2">Payment Options</h3>
           <div className="space-y-2">
              {Object.values(PaymentMethod).filter(m => m !== PaymentMethod.RAZORPAY).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMethod(m); setStatus('IDLE'); }}
                  className={`w-full flex items-center p-3 rounded-xl transition-all text-left ${
                      method === m
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'hover:bg-gray-200 text-gray-700'
                    }`}
                >
                  <div className={`mr-3 ${method === m ? 'text-white' : 'text-gray-500'}`}>
                    {m === PaymentMethod.UPI && <Smartphone size={18} />}
                    {m === PaymentMethod.CARD && <CreditCard size={18} />}
                    {m === PaymentMethod.WALLET && <Wallet size={18} />}
                    {m === PaymentMethod.NET_BANKING && <Building size={18} />}
                    {m === PaymentMethod.COD && <Banknote size={18} />}
                  </div>
                  <span className="text-sm font-medium">{m}</span>
                </button>
              ))}
           </div>
        </div>

        {/* Right Content */}
        <div className="w-full md:w-2/3 p-8 flex flex-col relative">
           <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20}/></button>
           
           {status === 'IDLE' && (
             <>
               <div className="mb-6">
                 <div className="flex items-center justify-between mb-2">
                   <h2 className="text-2xl font-bold text-gray-900">Pay INR {totalAmount.toFixed(2)}</h2>
                   <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      <ShieldCheck size={12} />
                      <span>Powered by Razorpay</span>
                   </div>
                 </div>
                 <p className="text-gray-500 text-sm">Complete your payment to place order</p>
               </div>

               <div className="flex-1">
                 {method === PaymentMethod.UPI && (
                   <div className="space-y-4 animate-in fade-in">
                      <div>
                         <p className="text-sm font-medium text-gray-700 mb-2">Enter UPI ID (Any dummy ID works for testing)</p>
                         <input 
                           type="text" 
                           placeholder="e.g. test@razorpay or any@upi" 
                           className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                           value={upiId}
                           onChange={e => setUpiId(e.target.value)}
                         />
                         <div className="flex gap-2 mt-2 flex-wrap">
                           <button 
                             type="button"
                             onClick={() => setUpiId('test@razorpay')}
                             className="text-xs bg-emerald-100 hover:bg-emerald-200 px-2 py-1 rounded text-emerald-700 transition font-medium"
                           >
                             test@razorpay (Recommended)
                           </button>
                           <button 
                             type="button"
                             onClick={() => setUpiId('dummy@okaxis')}
                             className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600 transition"
                           >
                             dummy@okaxis
                           </button>
                           <button 
                             type="button"
                             onClick={() => setUpiId('test@okhdfcbank')}
                             className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600 transition"
                           >
                             test@okhdfcbank
                           </button>
                           <button 
                             type="button"
                             onClick={() => setUpiId('demo@ybl')}
                             className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-600 transition"
                           >
                             demo@ybl
                           </button>
                         </div>
                         <p className="text-xs text-gray-500 mt-2">
                            💡 <strong>Note:</strong> Any UPI ID format is accepted for testing. No real validation required.
                         </p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                         <p className="flex items-start">
                            <Info size={16} className="mr-2 mt-0.5 flex-shrink-0"/>
                            This is a test payment. You can use any dummy UPI ID - no real payment will be processed.
                         </p>
                      </div>
                   </div>
                 )}

                 {method === PaymentMethod.CARD && (
                   <div className="space-y-4 animate-in fade-in">
                      <div>
                         <label className="text-sm font-medium text-gray-700 mb-2 block">Card Number</label>
                         <input 
                           type="text" 
                           placeholder="1234 5678 9012 3456" 
                           className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                           value={cardNumber}
                           onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                           maxLength={19}
                         />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                           <label className="text-sm font-medium text-gray-700 mb-2 block">Expiry</label>
                           <input 
                             type="text" 
                             placeholder="MM/YY" 
                             className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                             value={cardExpiry}
                             onChange={e => setCardExpiry(e.target.value.replace(/\D/g, '').replace(/(.{2})/, '$1/').slice(0, 5))}
                             maxLength={5}
                           />
                        </div>
                        <div className="flex-1">
                           <label className="text-sm font-medium text-gray-700 mb-2 block">CVV</label>
                           <input 
                             type="text" 
                             placeholder="123" 
                             className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                             value={cardCvv}
                             onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                             maxLength={3}
                           />
                        </div>
                      </div>
                      <div>
                         <label className="text-sm font-medium text-gray-700 mb-2 block">Card Holder Name</label>
                         <input 
                           type="text" 
                           placeholder="John Doe" 
                           className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                           value={cardName}
                           onChange={e => setCardName(e.target.value)}
                         />
                      </div>
                      <div className="flex gap-2 mt-2">
                         <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Visa</div>
                         <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Mastercard</div>
                         <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">RuPay</div>
                      </div>
                   </div>
                 )}

                 {method === PaymentMethod.WALLET && (
                   <div className="space-y-4 animate-in fade-in bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Available Balance</span>
                        <span className="font-bold text-emerald-700 text-lg">INR {walletBalance.toFixed(2)}</span>
                      </div>
                      {walletBalance < totalAmount && (
                        <div className="text-red-600 text-xs flex items-center">
                           <AlertTriangle size={12} className="mr-1"/> Insufficient balance. Please top up or choose another method.
                        </div>
                      )}
                   </div>
                 )}

                 {method === PaymentMethod.NET_BANKING && (
                   <div className="space-y-4 animate-in fade-in">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Select Bank</label>
                      <select 
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        value={selectedBank}
                        onChange={e => setSelectedBank(e.target.value)}
                      >
                         <option value="">Choose your bank</option>
                         {dummyBanks.map(bank => (
                            <option key={bank} value={bank}>{bank}</option>
                         ))}
                      </select>
                      {selectedBank && (
                         <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800">
                            You will be redirected to {selectedBank} secure login page
                         </div>
                      )}
                   </div>
                 )}

                 {method === PaymentMethod.COD && (
                   <div className="space-y-4 animate-in fade-in bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                      <p className="text-sm text-yellow-800 flex items-start">
                         <Info size={16} className="mr-2 mt-0.5 flex-shrink-0"/>
                         Pay cash to the delivery partner upon arrival. Please keep exact change ready to ensure contactless delivery.
                      </p>
                      <div className="mt-3 text-xs text-yellow-700">
                         <strong>Note:</strong> Cash on delivery charges may apply. Order will be confirmed immediately.
                      </div>
                   </div>
                 )}
               </div>

               <div className="mt-auto pt-6">
                 <button 
                   onClick={handlePayClick}
                   disabled={method === PaymentMethod.WALLET && walletBalance < totalAmount}
                   className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   Pay Now
                 </button>
                 <div className="text-center mt-3 flex items-center justify-center text-xs text-gray-400">
                    <ShieldCheck size={12} className="mr-1"/> 100% Secure Payment via Razorpay
                 </div>
               </div>
             </>
           )}

           {status === 'PROCESSING' && !showOtp && (
             <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in">
                <div className="relative mb-6">
                   <Loader2 size={64} className="text-emerald-600 animate-spin" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full"></div>
                   </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Processing via Razorpay</h3>
                <p className="text-gray-500 text-sm mb-1">{processingStep || 'Please wait...'}</p>
                {transactionId && (
                   <p className="text-xs text-gray-400 mt-2">Transaction ID: {transactionId}</p>
                )}
                <div className="mt-3 text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded">
                   <ShieldCheck size={10} className="inline mr-1"/> Secured by Razorpay
                </div>
                <div className="mt-8 w-full max-w-xs bg-gray-200 h-2 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 animate-[progress_3s_ease-in-out_infinite]"></div>
                </div>
                <p className="text-xs text-gray-400 mt-4">Please do not close this window...</p>
             </div>
           )}

           {showOtp && (
             <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                   <Smartphone size={40} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enter OTP</h3>
                <p className="text-gray-500 text-sm mb-6">OTP sent to your registered mobile number</p>
                <div className="w-full max-w-xs space-y-4">
                   <input 
                      type="text" 
                      placeholder="Enter 6-digit OTP" 
                      className="w-full p-4 border-2 border-gray-300 rounded-xl text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      autoFocus
                   />
                   <div className="flex gap-2 justify-center">
                      <button 
                         onClick={() => { setShowOtp(false); setOtp(''); setStatus('IDLE'); }}
                         className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                      >
                         Cancel
                      </button>
                      <button 
                         onClick={handleOtpSubmit}
                         className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700"
                      >
                         Verify OTP
                      </button>
                   </div>
                   <p className="text-xs text-gray-400 mt-4">
                      Didn't receive OTP? <button className="text-emerald-600 hover:underline">Resend</button>
                   </p>
                </div>
             </div>
           )}

           {status === 'SUCCESS' && (
             <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in">
                <div className="relative mb-6">
                   <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                      <CheckCircle size={48} className="text-green-600" />
                   </div>
                   <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                      <CheckCircle size={20} className="text-white" />
                   </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-500 text-sm mb-4">Your order has been confirmed</p>
                {transactionId && (
                   <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-xs text-gray-500">Transaction ID</p>
                      <p className="text-sm font-mono font-bold text-gray-900">{transactionId}</p>
                   </div>
                )}
                <div className="flex items-center gap-2 text-emerald-600">
                   <Loader2 size={16} className="animate-spin" />
                   <p className="text-sm">Redirecting to order tracking...</p>
                </div>
             </div>
           )}

           {status === 'FAILED' && (
             <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                   <X size={40} className="text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h3>
                <p className="text-gray-500 text-sm mb-1">{processingStep || 'The bank rejected the transaction.'}</p>
                {transactionId && (
                   <p className="text-xs text-gray-400 mb-4">Transaction ID: {transactionId}</p>
                )}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-xs">
                   <p className="text-sm text-red-800">
                      <strong>Possible reasons:</strong>
                   </p>
                   <ul className="text-xs text-red-700 mt-2 text-left list-disc list-inside space-y-1">
                      <li>Insufficient funds</li>
                      <li>Invalid card/UPI details</li>
                      <li>Network timeout</li>
                      <li>Bank server error</li>
                   </ul>
                </div>
                <div className="flex gap-3">
                   <button 
                     onClick={retry}
                     className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800"
                   >
                     Try Again
                   </button>
                   <button 
                     onClick={onClose}
                     className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                   >
                     Cancel
                   </button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const CartSidebar = ({ 
  isOpen, 
  onClose, 
  cart, 
  updateQuantity, 
  onCheckoutClick 
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const platformFee = 5;
  const gst = subtotal * 0.05;
  const deliveryFee = 40;
  
  // Coupon Logic
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'FLAT') {
      discountAmount = appliedCoupon.value;
    } else {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
      if (appliedCoupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, appliedCoupon.maxDiscount);
      }
    }
  }

  const total = Math.max(0, subtotal + platformFee + gst + deliveryFee - discountAmount);

  const applyCoupon = () => {
    setCouponError('');
    const coupon = MOCK_COUPONS.find(c => c.code === couponCode.toUpperCase());
    
    if (!coupon) {
      setCouponError('Invalid Coupon Code');
      return;
    }
    if (subtotal < coupon.minOrder) {
      setCouponError(`Min order value must be INR ${coupon.minOrder}`);
      return;
    }

    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col h-full transform animate-in slide-in-from-right">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
               <ShoppingCart size={48} className="mb-4 opacity-50"/>
               <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">INR {item.price}</p>
                  </div>
                  <div className="flex items-center space-x-3 bg-white border rounded px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-500 hover:text-red-500"><Minus size={14}/></button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="text-emerald-600 hover:text-emerald-700"><Plus size={14}/></button>
                  </div>
                </div>
              ))}

              {/* Coupons Section */}
              <div className="mt-6 border-t pt-4">
                 <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase flex items-center">
                   <Gift size={14} className="mr-2"/> Offers & Benefits
                 </h3>
                 {!appliedCoupon ? (
                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={couponCode}
                         onChange={e => setCouponCode(e.target.value)}
                         placeholder="Enter Coupon Code"
                         className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none uppercase"
                       />
                       <button 
                         onClick={applyCoupon}
                         className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800"
                       >
                         APPLY
                       </button>
                    </div>
                 ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center">
                       <div>
                          <div className="font-bold text-green-700 flex items-center text-sm">
                             <CheckCircle size={14} className="mr-1"/> '{appliedCoupon.code}' Applied
                          </div>
                          <div className="text-xs text-green-600">You saved INR {discountAmount.toFixed(0)}</div>
                       </div>
                       <button onClick={removeCoupon} className="text-gray-400 hover:text-red-500"><X size={16}/></button>
                    </div>
                 )}
                 {couponError && <p className="text-red-500 text-xs mt-1 ml-1">{couponError}</p>}
                 
                 {/* Available Coupons Hint */}
                 {!appliedCoupon && (
                   <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                     {MOCK_COUPONS.map(c => (
                        <button 
                          key={c.code}
                          onClick={() => { setCouponCode(c.code); }}
                          className="flex-shrink-0 text-[10px] bg-gray-100 border border-gray-200 px-2 py-1 rounded text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition"
                        >
                          {c.code}
                        </button>
                     ))}
                   </div>
                 )}
              </div>
              
              {/* True Price Calculator */}
              <div className="mt-6 border-t pt-4">
                 <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase">True Price Breakdown</h3>
                 <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600"><span>Item Total</span><span>INR {subtotal}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Platform Fee</span><span>INR {platformFee}</span></div>
                    <div className="flex justify-between text-gray-600"><span>GST (5%)</span><span>INR {gst.toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Delivery Surge</span><span>INR {deliveryFee}</span></div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600 font-medium"><span>Discount ({appliedCoupon?.code})</span><span>- INR {discountAmount.toFixed(2)}</span></div>
                    )}
                    <div className="flex justify-between font-bold text-lg text-gray-900 border-t border-dashed pt-2 mt-2">
                       <span>To Pay</span>
                       <span>INR {total.toFixed(2)}</span>
                    </div>
                 </div>
                 
                 {/* Fake Discount Detector / Savings Badge */}
                 <div className="mt-3 text-xs bg-blue-50 p-2 rounded border border-blue-100 flex items-start">
                    <TrendingUp size={14} className="text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-blue-700">
                       <strong>Fair Price Check:</strong> Other apps are charging ~INR {total + 42} for this order. You save INR 42 here.
                    </span>
                 </div>
              </div>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <button 
              type="button"
              onClick={() => onCheckoutClick(subtotal, discountAmount, total)}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition flex justify-between px-6"
            >
              <span>Total: INR {total.toFixed(0)}</span>
              <span>Proceed to Pay</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const PriceGraphModal = ({ isOpen, onClose, restaurant }) => {
  if (!isOpen || !restaurant) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
            <p className="text-sm text-gray-500">Price History Checker</p>
          </div>
          <button onClick={onClose}><X className="text-gray-500" /></button>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={restaurant.priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Line type="monotone" dataKey="avgPrice" stroke="#10b981" strokeWidth={2} dot={{fill: '#10b981'}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 bg-emerald-50 p-3 rounded-lg flex items-start">
           <TrendingUp size={16} className="text-emerald-600 mr-2 mt-0.5" />
           <p className="text-sm text-emerald-800">
             <strong>Dynamic Pricing Alert:</strong> Prices for this restaurant are currently stable compared to the weekly average.
           </p>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate mock reviews for a dish
const generateMockReviews = (dishId) => {
  const reviewTemplates = [
    { userName: 'Rahul Sharma', rating: 5, comment: 'Absolutely delicious! The flavors were amazing and the portion size was perfect. Will definitely order again!', date: '2 days ago', verified: true },
    { userName: 'Priya Patel', rating: 4, comment: 'Really good dish, fresh ingredients. The only reason I gave 4 stars is because it took a bit longer to arrive, but worth the wait!', date: '5 days ago', verified: true },
    { userName: 'Amit Kumar', rating: 5, comment: 'Best dish I\'ve had in a while! Highly recommend this to everyone. The quality is top-notch.', date: '1 week ago', verified: true },
    { userName: 'Sneha Reddy', rating: 4, comment: 'Great taste and presentation. The dish was exactly as described. Would order again!', date: '2 weeks ago', verified: true },
    { userName: 'Vikram Singh', rating: 5, comment: 'Excellent quality! The food was fresh, hot, and tasted amazing. Delivery was also very quick.', date: '3 weeks ago', verified: true },
    { userName: 'Anjali Mehta', rating: 4, comment: 'Very tasty and healthy option. Good value for money. The packaging was also eco-friendly which I appreciate.', date: '1 month ago', verified: true },
  ];
  
  // Return 3-5 random reviews
  const shuffled = [...reviewTemplates].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 3);
};

const DishDetailModal = ({ isOpen, onClose, dish, addToCart, userConditions }) => {
  if (!isOpen || !dish) return null;
  
  // Get reviews for the dish (use dish.reviews if available, otherwise generate mock reviews)
  const reviews = dish.reviews || generateMockReviews(dish.id || dish._id);

    const healthWarnings = [];
  if (userConditions.includes(HealthCondition.DIABETES) && (dish.carbs > 50 || dish.tags.includes(Tag.SWEET))) {
    healthWarnings.push("High sugar/carbs - Not recommended for Diabetes");
  }
  if (userConditions.includes(HealthCondition.HIGH_BP) && dish.sodium > 800) {
    healthWarnings.push("High sodium - Not recommended for High BP");
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95">
        
        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
           <DishImage 
             dish={dish} 
             className="w-full h-full object-cover"
           />
           <button onClick={onClose} className="absolute top-4 left-4 bg-white/80 p-2 rounded-full md:hidden">
             <X size={20} />
           </button>
        </div>

        <div className="w-full md:w-1/2 p-6 overflow-y-auto">
           <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{dish.name}</h2>
                <div className="flex flex-wrap gap-1 mt-2">
                   {dish.tags.map(t => <TagBadge key={t} tag={t} />)}
                </div>
              </div>
              <button onClick={onClose} className="hidden md:block text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
           </div>

           <div className="mt-4 flex items-baseline gap-2">
             <span className="text-3xl font-bold text-gray-900">INR {dish.price}</span>
             {dish.originalPrice && dish.originalPrice > dish.price && (
               <span className="text-lg text-gray-400 line-through">INR {dish.originalPrice}</span>
             )}
           </div>

           <p className="mt-4 text-gray-600 leading-relaxed">{dish.description}</p>

           {healthWarnings.length > 0 && (
             <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3">
               {healthWarnings.map((w, i) => (
                 <div key={i} className="flex items-start text-red-700 text-sm mb-1 last:mb-0">
                   <AlertTriangle size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                   {w}
                 </div>
               ))}
             </div>
           )}

           <div className="mt-6">
             <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase">Nutrition Facts</h4>
             <div className="grid grid-cols-4 gap-2 text-center">
               <div className="bg-gray-50 p-2 rounded-lg">
                 <div className="text-xs text-gray-500">Calories</div>
                 <div className="font-bold text-gray-900">{dish.calories}</div>
               </div>
               <div className="bg-gray-50 p-2 rounded-lg">
                 <div className="text-xs text-gray-500">Protein</div>
                 <div className="font-bold text-gray-900">{dish.protein}g</div>
               </div>
               <div className="bg-gray-50 p-2 rounded-lg">
                 <div className="text-xs text-gray-500">Carbs</div>
                 <div className="font-bold text-gray-900">{dish.carbs}g</div>
               </div>
               <div className="bg-gray-50 p-2 rounded-lg">
                 <div className="text-xs text-gray-500">Fats</div>
                 <div className="font-bold text-gray-900">{dish.fats}g</div>
               </div>
             </div>
           </div>

           {/* Reviews Section */}
           <div className="mt-8 border-t border-gray-200 pt-6">
             <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
               <Heart size={18} className="text-red-500" />
               Customer Reviews
               {reviews && reviews.length > 0 && (
                 <span className="text-sm font-normal text-gray-500">({reviews.length})</span>
               )}
             </h4>
             
             {reviews && reviews.length > 0 ? (
               <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                 {reviews.map((review, index) => (
                   <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                     <div className="flex items-start justify-between mb-2">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                           {review.userName.charAt(0).toUpperCase()}
                         </div>
                         <div>
                           <div className="font-semibold text-gray-900">{review.userName}</div>
                           <div className="flex items-center gap-1 mt-0.5">
                             {[...Array(5)].map((_, i) => (
                               <Star 
                                 key={i} 
                                 size={12} 
                                 className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                               />
                             ))}
                           </div>
                         </div>
                       </div>
                       <span className="text-xs text-gray-500">{review.date}</span>
                     </div>
                     <p className="text-sm text-gray-700 mt-2 leading-relaxed">{review.comment}</p>
                     {review.verified && (
                       <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600">
                         <CheckCircle size={12} />
                         <span>Verified Purchase</span>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                 <Heart size={32} className="mx-auto text-gray-300 mb-2" />
                 <p className="text-gray-500 text-sm">No reviews yet</p>
                 <p className="text-gray-400 text-xs mt-1">Be the first to review this dish!</p>
               </div>
             )}
           </div>

           <div className="mt-8">
             <button 
               onClick={() => { addToCart(dish); onClose(); }}
               className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition flex items-center justify-center"
             >
               <ShoppingCart size={18} className="mr-2" />
               Add to Order
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const RestaurantMapView = ({ restaurantLocation, userLocation }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (typeof L !== 'undefined' && mapRef.current && userLocation) {
        if (mapRef.current.innerHTML !== "") return;
        
        try {
            const map = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            // User marker
            L.marker([userLocation.lat, userLocation.lng])
             .addTo(map)
             .bindPopup("You")
             .openPopup();

            // Restaurant marker
            L.marker([restaurantLocation.lat, restaurantLocation.lng])
             .addTo(map)
             .bindPopup("Restaurant");

            // Line
            const latlngs = [
                [userLocation.lat, userLocation.lng],
                [restaurantLocation.lat, restaurantLocation.lng]
            ];
            const polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
              map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

        } catch (e) {
            console.error("Map init failed", e);
        }
    }
  }, [userLocation, restaurantLocation]);

  return (
    <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden relative">
      <div ref={mapRef} className="w-full h-full z-0"></div>
      {(!userLocation || typeof L === 'undefined') && (
         <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Map Visualization (Leaflet not loaded or location missing)
         </div>
      )}
    </div>
  );
};

const TrackingView = ({ onBackHome, userLocation, restaurantLocation }) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
       setStep(s => s < 4 ? s + 1 : 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
       <button onClick={onBackHome} className="flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium">
         <X size={18} className="mr-2" /> Close Tracking
       </button>

       <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
             <div className="flex justify-between items-center">
                <div>
                   <h2 className="text-2xl font-bold text-gray-900">Order #1002</h2>
                   <p className="text-gray-500">Arriving in 24 mins</p>
                </div>
                <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                   Live
                </div>
             </div>
          </div>

          <div className="p-6">
             <RestaurantMapView restaurantLocation={restaurantLocation} userLocation={userLocation} />
          </div>

          <div className="p-6 bg-gray-50">
             <div className="space-y-6 relative">
                {/* Connecting Line */}
                <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-200 -z-10"></div>

                {[
                  { s: 1, title: "Order Placed", desc: "Restaurant has accepted your order", icon: <CheckCircle2 size={16} /> },
                  { s: 2, title: "Preparing", desc: "Chef is cooking your meal", icon: <Flame size={16} /> },
                  { s: 3, title: "Out for Delivery", desc: "Rider is on the way", icon: <Bike size={16} /> },
                  { s: 4, title: "Delivered", desc: "Enjoy your meal!", icon: <Home size={16} /> }
                ].map((item) => (
                  <div key={item.s} className={`flex items-start transition-all duration-500 ${step >= item.s ? 'opacity-100' : 'opacity-40'}`}>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 z-10 transition-colors ${
                        step >= item.s ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                     }`}>
                        {item.icon}
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="p-4 flex gap-4">
             <button className="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                <Phone size={18} className="mr-2"/> Call Driver
             </button>
             <button className="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                <MessageSquare size={18} className="mr-2"/> Chat Support
             </button>
          </div>
       </div>
    </div>
  );
};

const AIAdvisorView = ({ addToCart, allDishes = [], restaurants = [] }) => {
  const [mood, setMood] = useState('Hungry');
  const [weather, setWeather] = useState('Clear');
  const [goal, setGoal] = useState('Balanced Diet');
  const [cuisine, setCuisine] = useState('Any');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const handleGetAdvice = async () => {
    setLoading(true);
    setRecommendation(null);
    try {
      // Get all available dishes for AI to analyze
      const dishesToAnalyze = allDishes.length > 0 ? allDishes : MOCK_DISHES;
      
      // Filter by cuisine if not "Any"
      let filteredDishes = dishesToAnalyze;
      if (cuisine !== 'Any') {
        const cuisineLower = cuisine.toLowerCase();
        
        // Create a map of dish ID to restaurant cuisine for faster lookup
        const dishToRestaurantCuisine = {};
        restaurants.forEach(rest => {
          if (rest.menu && Array.isArray(rest.menu)) {
            rest.menu.forEach(dish => {
              const dishId = dish._id || dish.id;
              if (dishId) {
                dishToRestaurantCuisine[dishId] = rest.cuisine || [];
              }
            });
          }
        });
        
        filteredDishes = dishesToAnalyze.filter(dish => {
          const dishId = dish._id || dish.id;
          const restaurantCuisine = dishToRestaurantCuisine[dishId] || [];
          const restaurantCuisineMatch = Array.isArray(restaurantCuisine) 
            ? restaurantCuisine.some(c => c.toLowerCase().includes(cuisineLower))
            : false;
          
          return dish.tags?.some(tag => tag.toLowerCase().includes(cuisineLower)) ||
                 dish.name?.toLowerCase().includes(cuisineLower) ||
                 dish.description?.toLowerCase().includes(cuisineLower) ||
                 restaurantCuisineMatch;
        });
        
        // If no dishes match, use all dishes
        if (filteredDishes.length === 0) {
          filteredDishes = dishesToAnalyze;
        }
      }
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI recommendation timeout')), 5000)
      );
      
      const recommendationPromise = getFoodRecommendation({ 
        mood, 
        weather, 
        goal, 
        cuisine: cuisine !== 'Any' ? cuisine : undefined,
        dishes: filteredDishes.map(d => ({
          id: d._id || d.id,
          name: d.name,
          description: d.description,
          tags: d.tags || [],
          calories: d.calories,
          carbs: d.carbs,
          protein: d.protein,
          fats: d.fats,
          sodium: d.sodium,
          price: d.price
        }))
      });
      
      const result = await Promise.race([recommendationPromise, timeoutPromise]);
      const recommendation = result?.data;
      setRecommendation(recommendation);
    } catch (e) {
      console.error('Error getting AI recommendation:', e);
      // Fallback: Use local AI logic
      const dishesToAnalyze = allDishes.length > 0 ? allDishes : MOCK_DISHES;
      const filteredDishes = cuisine !== 'Any' 
        ? dishesToAnalyze.filter(d => 
            d.tags?.some(t => t.toLowerCase().includes(cuisine.toLowerCase())) ||
            d.name?.toLowerCase().includes(cuisine.toLowerCase())
          )
        : dishesToAnalyze;
      
      if (filteredDishes.length > 0) {
        // Simple local recommendation logic
        let recommended = filteredDishes[0];
        
        // Filter based on goal
        if (goal === 'Weight Loss') {
          recommended = filteredDishes.filter(d => d.calories < 400).sort((a, b) => a.calories - b.calories)[0] || filteredDishes[0];
        } else if (goal === 'Muscle Gain') {
          recommended = filteredDishes.filter(d => d.protein > 25).sort((a, b) => b.protein - a.protein)[0] || filteredDishes[0];
        } else if (goal === 'Low Carb') {
          recommended = filteredDishes.filter(d => d.carbs < 30).sort((a, b) => a.carbs - b.carbs)[0] || filteredDishes[0];
        }
        
        setRecommendation({
          dishId: recommended._id || recommended.id,
          dishName: recommended.name,
          reasoning: `Based on your ${goal.toLowerCase()} goal${cuisine !== 'Any' ? `, ${cuisine} cuisine preference` : ''}, and ${mood.toLowerCase()} mood, ${recommended.name} is perfect for you!`,
          estimatedCalories: recommended.calories || 400,
          protein: recommended.protein || 0
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddRec = () => {
    if (recommendation) {
       const dish = (allDishes.length > 0 ? allDishes : MOCK_DISHES).find(d => (d._id || d.id) === recommendation.dishId);
       if (dish) addToCart(dish);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl mb-8 relative overflow-hidden">
         <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 flex items-center">
               <Sparkles className="mr-3 text-yellow-300"/> AI Food Advisor
            </h1>
            <p className="text-indigo-100 text-lg max-w-xl">
               Not sure what to eat? Let Gemini analyze your mood, weather, and health goals to pick the perfect meal.
            </p>
         </div>
         <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
            <BrainCircuit size={300} />
         </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <CustomSelect 
               label="How are you feeling?" 
               value={mood} 
               onChange={setMood}
               options={["Hungry", "Stressed", "Happy", "Tired", "Energetic", "Sick"]}
            />
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <CustomSelect 
               label="What's the weather?" 
               value={weather} 
               onChange={setWeather}
               options={["Clear", "Rainy", "Cold", "Hot", "Humid"]}
            />
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <CustomSelect 
               label="Health Goal" 
               value={goal} 
               onChange={setGoal}
               options={["Balanced Diet", "Muscle Gain", "Weight Loss", "Comfort Food", "Low Carb"]}
            />
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <CustomSelect 
               label="Cuisine Type" 
               value={cuisine} 
               onChange={setCuisine}
               options={["Any", "Indian", "Italian", "Chinese", "Japanese", "American", "Mexican", "Thai", "Mediterranean", "Fast Food", "Healthy", "Desserts"]}
            />
         </div>
      </div>

      <div className="flex justify-center mb-10">
         <button 
           onClick={handleGetAdvice}
           disabled={loading}
           className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition shadow-lg flex items-center disabled:opacity-70 disabled:cursor-not-allowed group"
         >
           {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 group-hover:text-yellow-300 transition-colors" />}
           {loading ? "Analyzing Menu..." : "Find My Perfect Meal"}
         </button>
      </div>

      {recommendation && (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100 animate-in slide-in-from-bottom-8">
           <div className="bg-emerald-50 p-6 border-b border-emerald-100 flex items-center">
              <div className="bg-emerald-100 p-2 rounded-full mr-4">
                 <CheckCircle2 className="text-emerald-600 h-8 w-8" />
              </div>
              <div>
                 <p className="text-emerald-800 font-bold uppercase text-xs tracking-wider">AI Recommendation</p>
                 <h2 className="text-2xl font-bold text-gray-900">{recommendation.dishName}</h2>
                 {cuisine !== 'Any' && (
                   <p className="text-sm text-emerald-700 mt-1">Cuisine: {cuisine}</p>
                 )}
              </div>
           </div>
           <div className="p-8">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                 "{recommendation.reasoning}"
              </p>
              
              <div className="flex items-center justify-between">
                 <div className="flex gap-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium text-gray-600">
                       ~{recommendation.estimatedCalories} kcal
                    </span>
                    {recommendation.protein && (
                      <span className="bg-blue-100 px-3 py-1 rounded-lg text-sm font-medium text-blue-600">
                         {recommendation.protein}g protein
                      </span>
                    )}
                 </div>
                 <button 
                   onClick={handleAddRec}
                   className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-md flex items-center"
                 >
                   <ShoppingCart size={18} className="mr-2"/> View & Order
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const GroupOrderView = ({ onAddGroupToCart, restaurants = [], onStartOrder }) => {
  const [members, setMembers] = useState([
    { id: '1', name: 'You', restaurantVote: null, dishVote: null, budget: 500 },
    { id: '2', name: 'Alex', restaurantVote: null, dishVote: null, budget: 500 },
  ]);
  const [newName, setNewName] = useState('');
  const [step, setStep] = useState('restaurant'); // 'restaurant' or 'dish'
  const [activeMemberId, setActiveMemberId] = useState('1'); // Currently voting member
  const [drawMessage, setDrawMessage] = useState(null);
  
  // Restaurant voting
  const handleRestaurantVote = (memberId, restaurantId) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, restaurantVote: restaurantId } : m));
  };

  // Dish voting
  const handleDishVote = (memberId, dishId) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, dishVote: dishId } : m));
  };

  const addMember = () => {
    if (newName) {
       setMembers([...members, { id: Math.random().toString(), name: newName, restaurantVote: null, dishVote: null, budget: 500 }]);
       setNewName('');
    }
  };

  // Determine restaurant winner with draw handling
  const restaurantVotes = members.reduce((acc, m) => {
    if (m.restaurantVote) acc[m.restaurantVote] = (acc[m.restaurantVote] || 0) + 1;
    return acc;
  }, {});
  
  const voteEntries = Object.entries(restaurantVotes).sort((a, b) => b[1] - a[1]);
  const maxVotes = voteEntries.length > 0 ? voteEntries[0][1] : 0;
  const winners = voteEntries.filter(([_, votes]) => votes === maxVotes);
  
  const allRestaurants = restaurants.length > 0 ? restaurants : MOCK_RESTAURANTS;
  
  // Store random winner for draws using ref (stable across renders, no re-renders)
  const randomWinnerRef = useRef(null);
  const previousWinnersKeyRef = useRef('');
  
  // Calculate winner (memoized to prevent re-renders)
  const winnerData = useMemo(() => {
    if (winners.length === 0) {
      randomWinnerRef.current = null;
      previousWinnersKeyRef.current = '';
      return { winnerId: null, winnerRestaurant: null };
    }
    
    let winnerId;
    const winnersKey = winners.map(([id]) => id).sort().join(',');
    
    if (winners.length > 1) {
      // Draw - check if winners changed, if so pick new random winner
      if (previousWinnersKeyRef.current !== winnersKey || !randomWinnerRef.current) {
        const randomIndex = Math.floor(Math.random() * winners.length);
        randomWinnerRef.current = winners[randomIndex][0];
        previousWinnersKeyRef.current = winnersKey;
      }
      winnerId = randomWinnerRef.current;
    } else {
      winnerId = winners[0][0];
      randomWinnerRef.current = null;
      previousWinnersKeyRef.current = '';
    }
    
    const winnerRestaurant = allRestaurants.find(r => {
      const rId = String(r._id || r.id);
      return rId === String(winnerId);
    });
    
    return { winnerId, winnerRestaurant };
  }, [winners, allRestaurants]);
  
  const { winnerId, winnerRestaurant } = winnerData;
  
  // Handle draw message in useEffect to prevent infinite re-renders
  useEffect(() => {
    if (winners.length > 1 && winnerRestaurant) {
      const selectedRestaurant = allRestaurants.find(r => {
        const rId = String(r._id || r.id);
        return rId === String(winnerId);
      });
      if (selectedRestaurant) {
        setDrawMessage({
          type: 'restaurant',
          message: `Draw detected! Randomly selected: ${selectedRestaurant.name}`
        });
        const timer = setTimeout(() => setDrawMessage(null), 5000);
        return () => clearTimeout(timer);
      }
    } else if (winners.length === 1) {
      setDrawMessage(null);
    }
  }, [winners.length, winnerRestaurant, winnerId, allRestaurants]);

  // Check if all members have voted for restaurant
  const allVotedRestaurant = members.every(m => m.restaurantVote !== null);
  
  // Move to dish voting when restaurant is selected
  useEffect(() => {
    if (winnerRestaurant && allVotedRestaurant && step === 'restaurant') {
      // Auto-advance to dish voting after a short delay
      setTimeout(() => {
        setStep('dish');
      }, 1500);
    }
  }, [winnerRestaurant, allVotedRestaurant, step]);

  // Determine dish votes
  const dishVotes = members.reduce((acc, m) => {
    if (m.dishVote) acc[m.dishVote] = (acc[m.dishVote] || 0) + 1;
    return acc;
  }, {});

  const handleStartOrder = () => {
     if (winnerRestaurant && winnerRestaurant.menu && winnerRestaurant.menu.length > 0) {
       // Collect all voted dishes
       const votedDishes = [];
       members.forEach(member => {
         if (member.dishVote) {
           const dish = winnerRestaurant.menu.find(d => String(d._id || d.id) === String(member.dishVote));
           if (dish) {
             votedDishes.push(dish);
           }
         }
       });
       
       if (votedDishes.length > 0) {
         onAddGroupToCart(votedDishes);
         if (onStartOrder) {
           onStartOrder();
         }
       } else {
         alert('Please vote for dishes before starting the order.');
       }
     } else {
       console.error('Winner restaurant has no menu items');
       alert('Selected restaurant has no menu items available.');
     }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
       <div className="bg-orange-500 rounded-3xl p-8 text-white shadow-xl mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Group Ordering</h1>
            <p className="text-orange-100">Vote on a restaurant and split the bill easily.</p>
          </div>
          <Users size={64} className="text-orange-300 opacity-50"/>
       </div>

       {/* Step Indicator */}
       <div className="mb-6 flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 ${step === 'restaurant' ? 'text-orange-500' : 'text-gray-400'}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 'restaurant' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>1</div>
             <span className="font-medium">Choose Restaurant</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className={`flex items-center gap-2 ${step === 'dish' ? 'text-orange-500' : 'text-gray-400'}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 'dish' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>2</div>
             <span className="font-medium">Choose Dishes</span>
          </div>
       </div>

       <div className="grid md:grid-cols-2 gap-8">
          {/* Members List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
             <h3 className="font-bold text-gray-900 mb-4">Group Members</h3>
             <div className="space-y-3 mb-6">
                {members.map(m => (
                  <div 
                    key={m.id} 
                    onClick={() => setActiveMemberId(m.id)}
                    className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all ${
                      activeMemberId === m.id ? 'bg-orange-50 border-2 border-orange-500' : 'bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                     <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${
                          activeMemberId === m.id ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'
                        }`}>
                           {m.name[0]}
                        </div>
                        <span className="font-medium text-gray-900">{m.name}</span>
                     </div>
                     <div className="flex flex-col gap-1 items-end">
                        <span className={`text-xs px-2 py-0.5 rounded ${m.restaurantVote ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                           {step === 'restaurant' ? (m.restaurantVote ? 'Voted' : 'Waiting') : (m.restaurantVote ? '✓ Restaurant' : '')}
                        </span>
                        {step === 'dish' && (
                          <span className={`text-xs px-2 py-0.5 rounded ${m.dishVote ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}`}>
                            {m.dishVote ? '✓ Dish' : 'Waiting'}
                          </span>
                        )}
                     </div>
                  </div>
                ))}
             </div>
             
             <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Friend's Name"
                  className="flex-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <button 
                  onClick={addMember}
                  className="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-gray-800"
                >
                  <UserPlus size={18}/>
                </button>
             </div>
          </div>

          {/* Voting Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
             {step === 'restaurant' ? (
               <>
                  <h3 className="font-bold text-gray-900 mb-4">Vote for Restaurant</h3>
                  {drawMessage && drawMessage.type === 'restaurant' && (
                    <div className="mb-4 p-3 bg-orange-100 border border-orange-300 rounded-xl text-orange-800 text-sm">
                      <span className="font-semibold">🎲 {drawMessage.message}</span>
                    </div>
                  )}
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                     {(restaurants.length > 0 ? restaurants : MOCK_RESTAURANTS).slice(0, 5).map(r => {
                        const restaurantId = String(r._id || r.id);
                        const voteCount = members.filter(m => String(m.restaurantVote) === restaurantId).length;
                        const activeMember = members.find(m => m.id === activeMemberId);
                        const isSelected = activeMember && String(activeMember.restaurantVote) === restaurantId;
                        return (
                          <div 
                             key={restaurantId} 
                             onClick={() => handleRestaurantVote(activeMemberId, restaurantId)}
                             className={`p-4 border rounded-xl cursor-pointer transition-all flex justify-between items-center ${
                                isSelected ? 'border-orange-500 bg-orange-50' : 'hover:border-gray-300'
                             }`}
                          >
                             <div>
                                <div className="font-bold text-gray-900">{r.name}</div>
                                <div className="text-xs text-gray-500">{r.cuisine.join(', ')}</div>
                             </div>
                             <div className="flex items-center gap-3">
                                {voteCount > 0 && (
                                   <div className="flex -space-x-2">
                                      {members.filter(m => String(m.restaurantVote) === restaurantId).map(m => (
                                         <div key={m.id} className="w-6 h-6 rounded-full bg-orange-500 border-2 border-white text-[10px] text-white flex items-center justify-center font-bold" title={m.name}>
                                            {m.name[0]}
                                         </div>
                                      ))}
                                   </div>
                                )}
                                <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                                   {isSelected && <div className="w-3 h-3 bg-orange-500 rounded-full"></div>}
                                </div>
                             </div>
                          </div>
                        );
                     })}
                  </div>
               </>
             ) : winnerRestaurant && winnerRestaurant.menu ? (
               <>
                  <div className="mb-4 flex items-center justify-between">
                     <h3 className="font-bold text-gray-900">Vote for Dish from {winnerRestaurant.name}</h3>
                     <button 
                        onClick={() => setStep('restaurant')}
                        className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                     >
                        Change Restaurant
                     </button>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                     {winnerRestaurant.menu.slice(0, 10).map(dish => {
                        const dishId = String(dish._id || dish.id);
                        const voteCount = members.filter(m => String(m.dishVote) === dishId).length;
                        const activeMember = members.find(m => m.id === activeMemberId);
                        const isSelected = activeMember && String(activeMember.dishVote) === dishId;
                        return (
                          <div 
                             key={dishId} 
                             onClick={() => handleDishVote(activeMemberId, dishId)}
                             className={`p-4 border rounded-xl cursor-pointer transition-all flex justify-between items-center ${
                                isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                             }`}
                          >
                             <div className="flex-1">
                                <div className="font-bold text-gray-900">{dish.name}</div>
                                <div className="text-xs text-gray-500 mt-1">{dish.description || 'Delicious dish'}</div>
                                <div className="text-sm font-semibold text-orange-600 mt-1">INR {dish.price || 0}</div>
                             </div>
                             <div className="flex items-center gap-3 ml-4">
                                {voteCount > 0 && (
                                   <div className="flex -space-x-2">
                                      {members.filter(m => String(m.dishVote) === dishId).map(m => (
                                         <div key={m.id} className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white text-[10px] text-white flex items-center justify-center font-bold" title={m.name}>
                                            {m.name[0]}
                                         </div>
                                      ))}
                                   </div>
                                )}
                                <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                                   {isSelected && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                                </div>
                             </div>
                          </div>
                        );
                     })}
                  </div>
               </>
             ) : null}
          </div>
       </div>

       {step === 'restaurant' && winnerRestaurant && allVotedRestaurant && (
          <div className="mt-8 bg-emerald-500 text-white rounded-2xl p-6 flex justify-between items-center animate-in slide-in-from-bottom-4">
             <div>
                <p className="text-emerald-100 text-sm mb-1">Restaurant Selected!</p>
                <h2 className="text-2xl font-bold">Winning: {winnerRestaurant.name}</h2>
                <p className="text-emerald-100 text-sm mt-1">{Object.values(restaurantVotes).reduce((a,b)=>Math.max(a,b),0)} votes</p>
             </div>
             <div className="text-emerald-200">Moving to dish selection...</div>
          </div>
       )}

       {step === 'dish' && winnerRestaurant && (
          <div className="mt-8 bg-gray-900 text-white rounded-2xl p-6 flex justify-between items-center animate-in slide-in-from-bottom-4">
             <div>
                <p className="text-gray-400 text-sm mb-1">Ready to Order</p>
                <h2 className="text-2xl font-bold">{winnerRestaurant.name}</h2>
                <p className="text-gray-400 text-sm mt-1">
                   {members.filter(m => m.dishVote).length} of {members.length} members have selected dishes
                </p>
             </div>
             <button 
               onClick={handleStartOrder}
               className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg"
             >
               Start Order
             </button>
          </div>
       )}
    </div>
  );
};

// Dish Image Component with AI Generation
const DishImage = ({ dish, className = "w-full h-full object-cover rounded-xl shadow-sm" }) => {
  // Initialize with dish.image
  const [imageUrl, setImageUrl] = useState(dish.image || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasTriedAI, setHasTriedAI] = useState(false);
  
  console.log(`🖼️ DishImage component rendered for "${dish.name}":`, {
    dishImage: dish.image,
    imageUrl,
    isGenerating,
    hasTriedAI,
    needsAI: !dish.image || dish.image === null || dish.image === ''
  });
  
  // Update imageUrl when dish.image changes
  useEffect(() => {
    if (dish.image && dish.image !== imageUrl) {
      console.log(`🔄 Updating imageUrl for "${dish.name}":`, { old: imageUrl, new: dish.image });
      setImageUrl(dish.image);
      setHasTriedAI(false); // Reset AI generation flag when image changes
    }
  }, [dish.image, dish.id]);
  
  // Generate AI image function
  const generateAIImage = useCallback(async () => {
    if (isGenerating || hasTriedAI) {
      console.log('⏭️ Skipping AI generation - already generating or tried');
      return;
    }
    
    console.log(`🤖 Starting AI image generation for: ${dish.name}`);
    setIsGenerating(true);
    setHasTriedAI(true);
    
    try {
      const response = await generateDishImage(
        dish.name,
        dish.description,
        dish.tags || []
      );
      
      console.log('✅ AI response:', response?.data);
      
      if (response?.data?.imageUrl) {
        console.log(`✅ Generated image URL: ${response.data.imageUrl}`);
        setImageUrl(response.data.imageUrl);
      } else {
        console.log('⚠️ No image URL in response, using fallback');
        setImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80');
      }
    } catch (error) {
      console.error('❌ AI image generation failed:', error);
      setImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80');
    } finally {
      setIsGenerating(false);
    }
  }, [dish.name, dish.description, dish.tags, isGenerating, hasTriedAI]);
  
  // Generate AI image on mount if no image is provided
  useEffect(() => {
    // Check if image is null, undefined, or empty string
    const needsAIImage = !dish.image || dish.image === null || dish.image === '';
    
    console.log(`🔍 DishImage useEffect for "${dish.name}":`, {
      hasImage: !!dish.image,
      imageValue: dish.image,
      needsAIImage,
      hasTriedAI,
      isGenerating,
      dishId: dish.id || dish._id
    });
    
    if (needsAIImage && !hasTriedAI && !isGenerating) {
      console.log(`🖼️ ✅ Triggering AI image generation for: ${dish.name}`);
      // Call immediately
      generateAIImage();
    }
  }, [dish.id, dish.name, dish.image, hasTriedAI, isGenerating, generateAIImage]);
  
  const handleImageError = async (e) => {
    e.target.onerror = null;
    
    // If already tried AI generation, use fallback
    if (hasTriedAI) {
      console.log('⚠️ Already tried AI, using fallback');
      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
      return;
    }
    
    // Generate AI image based on dish details
    console.log(`🔄 Image error, generating AI image for: ${dish.name}`);
    await generateAIImage();
    // Update the src after generation
    setTimeout(() => {
      if (imageUrl) {
        e.target.src = imageUrl;
      } else {
        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
      }
    }, 100);
  };
  
  return (
    <div className="relative">
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10 rounded-xl">
          <Loader2 size={20} className="text-orange-500 animate-spin" />
        </div>
      )}
      <img 
        key={`${dish.id || dish._id || dish.name}-${imageUrl || 'default'}`} // Force re-render when imageUrl changes
        src={imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'} 
        alt={dish.name} 
        className={className}
        onError={(e) => {
          console.error(`❌ Image failed to load for "${dish.name}":`, imageUrl);
          handleImageError(e);
        }}
        onLoad={() => {
          console.log(`✅ Image loaded successfully for: ${dish.name} from ${imageUrl}`);
        }}
        loading="lazy"
      />
    </div>
  );
};

// Restaurant Card Component with Health Filter
const RestaurantCard = ({ 
  restaurant, 
  isAiKitchen, 
  dist, 
  searchQuery, 
  addToCart, 
  checkRegret, 
  onDishClick, 
  onOpenMenu 
}) => {
  const [cardConditions, setCardConditions] = useState([]);
  
  const toggleCardCondition = (c) => {
    setCardConditions(prev => 
      prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]
    );
  };
  
  const isDishSafe = (dish) => {
    if (cardConditions.length === 0 || cardConditions.includes(HealthCondition.NONE)) return true;
    
    for (const condition of cardConditions) {
      if (condition === HealthCondition.DIABETES) {
        if (dish.carbs > 50 || (dish.tags && dish.tags.includes(Tag.SWEET))) return false;
      }
      if (condition === HealthCondition.HIGH_BP) {
        if (dish.sodium > 800 || (dish.tags && dish.tags.includes(Tag.OILY))) return false;
      }
      if (condition === HealthCondition.PCOD || condition === HealthCondition.THYROID) {
        if (dish.tags && (dish.tags.includes(Tag.FAST_FOOD) || dish.tags.includes(Tag.OILY) || dish.tags.includes(Tag.SWEET))) {
          if (!(dish.tags.includes(Tag.GLUTEN_FREE) && dish.tags.includes(Tag.VEGAN))) return false;
        }
      }
    }
    return true;
  };
  
  const menu = restaurant.menu || [];
  const displayMenu = searchQuery ? menu.filter(d => 
    d && d.name && (
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (restaurant.cuisine && restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  ) : menu;
  
  const filteredMenu = displayMenu.filter(isDishSafe);
  
  return (
    <div className={`bg-white rounded-3xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 group ${isAiKitchen ? 'border-orange-300 ring-2 ring-orange-100' : 'border-gray-100 hover:border-orange-100'}`}>
      <div className={`p-6 border-b ${isAiKitchen ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100' : 'bg-gray-50/50 border-gray-50'}`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition flex items-center">
              {restaurant.name}
              {isAiKitchen && <Sparkles size={16} className="ml-2 text-orange-500 fill-orange-500" />}
            </h3>
            <p className="text-sm text-gray-500">{restaurant.cuisine.join(' • ')}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-bold flex items-center">
              <span className="mr-1">★</span> {restaurant.rating}
            </span>
            {!isAiKitchen && <span className="text-xs text-gray-400 font-medium">{dist} km</span>}
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
          <span className="flex items-center"><Clock size={14} className="mr-1 text-orange-400"/> {restaurant.deliveryTime} mins</span>
          {!isAiKitchen && <span className="flex items-center"><MapIcon size={14} className="mr-1 text-blue-400"/> Live Tracking</span>}
        </div>
        
        {/* Health Condition Filters - Per Restaurant Card */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-bold uppercase text-gray-400 mr-1 flex items-center">
              <Filter size={12} className="mr-1"/> Health:
            </span>
            {[HealthCondition.NONE, HealthCondition.DIABETES, HealthCondition.HIGH_BP, HealthCondition.PCOD, HealthCondition.THYROID].map(condition => (
              <button
                key={condition}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCardCondition(condition);
                }}
                className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all border ${
                  cardConditions.includes(condition)
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid gap-4">
          {filteredMenu && filteredMenu.length > 0 ? (
            <>
              {filteredMenu.slice(0, 4).map(dish => (
                <div key={dish._id || dish.id} className="flex gap-4 p-3 rounded-2xl hover:bg-orange-50/50 transition cursor-pointer border border-transparent hover:border-orange-100" onClick={() => onDishClick(dish)}>
                  <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <DishImage dish={dish} className="w-full h-full object-cover rounded-xl shadow-sm" />
                    {checkRegret(dish) && <RegretBadge />}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 truncate pr-2 text-sm md:text-base">{dish.name}</h4>
                        <TagBadge tag={(dish.tags || []).includes(Tag.VEG) ? Tag.VEG : Tag.NON_VEG} />
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{dish.description}</p>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-orange-600 font-bold">INR {dish.price}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(dish); }}
                        className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase hover:bg-orange-500 transition shadow-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => isAiKitchen ? null : onOpenMenu(restaurant)}
                className="w-full py-3 text-sm text-gray-500 font-bold hover:text-orange-600 border-t border-dashed border-gray-200 mt-2 flex items-center justify-center gap-2"
              >
                {isAiKitchen ? <span className="flex items-center"><BrainCircuit size={14} className="mr-1"/> Generated by Gemini AI</span> : "View Full Menu"}
              </button>
            </>
          ) : (
            <div className="text-center py-4 text-gray-400 text-sm">
              <p>{cardConditions.length > 0 && !cardConditions.includes(HealthCondition.NONE) ? 'No dishes match your health filters' : 'Menu items loading...'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HomeView = ({
  restaurants,
  userConditions,
  toggleCondition,
  addToCart,
  openPriceGraph,
  checkRegret, 
  onDishClick,
  searchQuery,
  userLocation,
  onOpenMenu
}) => {
  
  // Filter Logic
  const filteredRestaurants = useMemo(() => {
    const filtered = restaurants.filter(r => {
      // Show all restaurants (menu might be loading or empty)
      const menu = r.menu || [];
      
      // Search Filter
      const matchesSearch = searchQuery === '' || 
         (r.name && r.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
         (r.cuisine && Array.isArray(r.cuisine) && r.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))) ||
         (Array.isArray(menu) && menu.some(d => d && d.name && d.name.toLowerCase().includes(searchQuery.toLowerCase())));
      
      return matchesSearch;
    });
    
    console.log(`🔍 Showing ${filtered.length} restaurants from ${restaurants.length} total`);
    return filtered;
  }, [restaurants, searchQuery]);

  return (
    <div className="w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto px-6 md:px-12 py-8">
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
         <div>
            <h2 className="text-3xl font-bold font-serif text-gray-900">Nearby Restaurants</h2>
            <p className="text-gray-500 mt-1">Discover the best food around you</p>
         </div>
      </div>

      {restaurants.length === 0 ? (
         <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <Loader2 size={48} className="mx-auto text-orange-400 mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-gray-500">Loading restaurants...</h3>
            <p className="text-gray-400">Please wait while we fetch the best restaurants for you.</p>
         </div>
      ) : filteredRestaurants.length === 0 ? (
         <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <h3 className="text-xl font-bold text-gray-500">No restaurants found</h3>
            <p className="text-gray-400">Try adjusting your search query.</p>
         </div>
      ) : (
         <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredRestaurants.map(restaurant => {
               // Special Styling for AI Generated Restaurant
               const isAiKitchen = (restaurant._id || restaurant.id) === 'ai-kitchen';

               const menu = restaurant.menu || [];
               const displayMenu = searchQuery ? menu.filter(d => 
                  d && d.name && (
                    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (restaurant.cuisine && restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())))
                  )
               ) : menu;
               
               // Show restaurant even if menu is empty (might be loading)
               if (displayMenu.length === 0 && searchQuery) return null;

               // Use pre-calculated distance if available, otherwise calculate
               const dist = restaurant.distance !== undefined 
                  ? restaurant.distance
                  : (userLocation 
                     ? calculateDistance(
                         userLocation.lat, 
                         userLocation.lng, 
                         restaurant.coordinates?.lat || restaurant.lat || userLocation.lat, 
                         restaurant.coordinates?.lng || restaurant.lng || userLocation.lng
                       )
                     : 0);

               return (
                  <RestaurantCard
                     key={restaurant._id || restaurant.id}
                     restaurant={restaurant}
                     isAiKitchen={isAiKitchen}
                     dist={dist}
                     searchQuery={searchQuery}
                     addToCart={addToCart}
                     checkRegret={checkRegret}
                     onDishClick={onDishClick}
                     onOpenMenu={onOpenMenu}
                  />
               );
            })}
         </div>
      )}
    </div>
  );
};

// --- Main App Export ---

export function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [splitBillOpen, setSplitBillOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // App State - API Data
  // Initialize with mock data immediately - no empty state
  const [restaurants, setRestaurants] = useState(MOCK_RESTAURANTS);
  const [allDishes, setAllDishes] = useState(MOCK_DISHES);
  const [loading, setLoading] = useState(false);
  
  // App State
  const [cart, setCart] = useState([]);
  const [wallet, setWallet] = useState(2500);
  const [userLocation, setUserLocation] = useState(null);
  const [trackingRestaurant, setTrackingRestaurant] = useState(null);
  const [aiDishes, setAiDishes] = useState([]);
  const [isGeneratingDish, setIsGeneratingDish] = useState(false);
  
  // Payment Staging State
  const [checkoutTotal, setCheckoutTotal] = useState(0);

  const [transactions, setTransactions] = useState([
    { id: 't1', type: 'CREDIT', amount: 3000, description: 'Added money to wallet', date: '2023-10-01', status: 'SUCCESS', method: PaymentMethod.UPI },
    { id: 't2', type: 'DEBIT', amount: 500, description: 'Order #1001 - FitBite Kitchen', date: '2023-10-02', status: 'SUCCESS', method: PaymentMethod.WALLET, orderId: '#1001' }
  ]);
  const [conditions, setConditions] = useState([HealthCondition.NONE]);
  
  // Load location from localStorage on app start - set default immediately, NO AUTO-DETECTION
  useEffect(() => {
    // Always set default location immediately (synchronous, no waiting, no blocking)
    const defaultLoc = {
      address: "New Delhi, India",
      lat: 28.6139,
      lng: 77.2090
    };
    
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const loc = JSON.parse(savedLocation);
        setUserLocation(loc);
      } catch (e) {
        // Use default if saved location is corrupted
        setUserLocation(defaultLoc);
      }
    } else {
      // Set default immediately - no waiting, no blocking
      setUserLocation(defaultLoc);
    }
    
    // DISABLED: Auto-detection causes buffering
    // Location can be manually set via the location modal
    // Auto-detection removed to prevent any blocking operations
  }, []);


  // Fetch restaurants and dishes from API with immediate fallback to mock data
  useEffect(() => {
    // Set mock data IMMEDIATELY - synchronous, no waiting, no blocking
    setRestaurants(MOCK_RESTAURANTS);
    setAllDishes(MOCK_DISHES);
    setLoading(false);
    
    // DISABLED: API calls are causing buffering issues
    // Only enable if backend is confirmed to be running and responsive
    // Uncomment below to enable API fetching:
    /*
    const apiTimeout = setTimeout(() => {
      const fetchFromAPI = async () => {
        try {
          const [restaurantsRes, dishesRes] = await Promise.all([
            getRestaurants().catch(() => ({ data: [] })),
            getDishes().catch(() => ({ data: [] }))
          ]);
          
          const apiRestaurants = restaurantsRes?.data || [];
          const apiDishes = dishesRes?.data || [];
          
          if (apiRestaurants.length > 0) {
            setRestaurants(apiRestaurants);
          }
          
          if (apiDishes.length > 0) {
            setAllDishes(apiDishes);
          }
        } catch (apiErr) {
          // Silently fail, keep mock data
        }
      };
      
      fetchFromAPI();
    }, 5000); // Wait 5 seconds after page load
    
    return () => clearTimeout(apiTimeout);
    */
  }, []);
  
  const regretList = useMemo(() => ['d2'], []);

  // Debounced Search & Auto Generation
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) return;

    const handler = setTimeout(async () => {
      // Check if search has results in existing restaurants (including AI kitchen)
      const allRestaurants = [...restaurants, {
         id: 'ai-kitchen',
         name: "AI Chef's Kitchen",
         cuisine: ["Custom", "AI Generated"],
         rating: 5.0,
         deliveryTime: 35,
         priceRange: "$$",
         menu: aiDishes,
         priceHistory: [],
         coordinates: { lat: 28.6139, lng: 77.2090 },
         address: "Cloud Kitchen"
      }];

      const hasResults = allRestaurants.some(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        r.menu.some(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      // If no results, automatically generate (with timeout to prevent hanging)
      if (!hasResults && !isGeneratingDish) {
        setIsGeneratingDish(true);
        try {
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Generation timeout')), 3000)
          );
          
          const generationPromise = generateDishFromQuery(searchQuery);
          
          const response = await Promise.race([generationPromise, timeoutPromise]);
          const newDish = response?.data;
          if (newDish) {
             setAiDishes(prev => [newDish, ...prev]);
          }
        } catch (e) {
          // Silently fail - don't show errors for AI generation
          console.log('AI generation skipped');
        } finally {
          setIsGeneratingDish(false);
        }
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(handler);
  }, [searchQuery, aiDishes, isGeneratingDish]);

  // Construct the restaurant list including AI Kitchen
  const displayedRestaurants = useMemo(() => {
     const base = [...restaurants];
     
     // Add AI Kitchen if there are AI dishes
     if (aiDishes.length > 0) {
        base.unshift({
           id: 'ai-kitchen',
           name: "AI Chef's Kitchen",
           cuisine: ["Custom", "AI Generated"],
           rating: 5.0,
           deliveryTime: 35,
           priceRange: "$$",
           menu: aiDishes,
           priceHistory: [],
           coordinates: { lat: userLocation?.lat || 28.6139, lng: userLocation?.lng || 77.2090 },
           address: "Cloud Kitchen"
        });
     }
     
     return base;
  }, [restaurants, aiDishes, userLocation]);


  const toggleCondition = (c) => {
    setConditions(prev => 
      prev.includes(c) ? prev.filter(i => i !== c) : [...prev, c]
    );
  };

  const handleViewChange = (view) => {
    if (view === 'cart') {
      setCartOpen(true);
    } else {
      setCurrentView(view);
    }
  };

  const addToCart = (dish) => {
    const restaurant = displayedRestaurants.find(r => {
      const menu = r.menu || [];
      return menu.some(d => (d._id || d.id) === (dish._id || dish.id));
    });
    setCart(prev => {
      const dishId = dish._id || dish.id;
      const existing = prev.find(i => (i._id || i.id) === dishId);
      if (existing) {
        return prev.map(i => {
          const itemId = i._id || i.id;
          return itemId === dishId ? { ...i, quantity: i.quantity + 1 } : i;
        });
      }
      return [...prev, { ...dish, quantity: 1, restaurantId: restaurant?._id || restaurant?.id }];
    });
    setCartOpen(true);
  };

  const addMultipleToCart = (dishes) => {
    setCart(prev => {
      const newCart = [...prev];
      dishes.forEach(dish => {
        const dishId = dish._id || dish.id;
        const existingIndex = newCart.findIndex(i => (i._id || i.id) === dishId);
        if (existingIndex >= 0) {
          newCart[existingIndex] = { ...newCart[existingIndex], quantity: newCart[existingIndex].quantity + 1 };
        } else {
          const foundRestaurant = displayedRestaurants.find(r => {
            const menu = r.menu || [];
            return menu.some(d => (d._id || d.id) === dishId);
          });
          newCart.push({ ...dish, quantity: 1, restaurantId: foundRestaurant?._id || foundRestaurant?.id });
        }
      });
      return newCart;
    });
    setCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
          return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(i => i.quantity > 0));
  };

  const checkRegret = (dish) => regretList.includes(dish.id);

  const openPriceGraph = (r) => {
    setSelectedRestaurant(r);
    setPriceModalOpen(true);
  };

  const openRestaurantMenu = (r) => {
    setSelectedRestaurant(r);
    setMenuModalOpen(true);
  };

  const handleCheckoutInit = (subtotal, discount, finalTotal) => {
    setCheckoutTotal(finalTotal);
    setCartOpen(false); 
    setPaymentModalOpen(true); 
  };

  const handlePaymentComplete = (method) => {
    if (method === PaymentMethod.WALLET) {
       setWallet(prev => prev - checkoutTotal);
    }

    if (cart.length > 0 && cart[0].restaurantId) {
      const restId = cart[0].restaurantId;
      const restaurant = displayedRestaurants.find(r => r.id === restId);
      setTrackingRestaurant(restaurant ? restaurant.coordinates : { lat: 28.6139, lng: 77.2090 });
    }

    const orderId = `#${Math.floor(Math.random() * 1000) + 1000}`;

    const newTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'DEBIT',
      amount: checkoutTotal,
      description: `Order ${orderId}`,
      date: new Date().toISOString().split('T')[0],
      status: 'SUCCESS',
      method: method,
      orderId: orderId
    };
    setTransactions(prev => [newTransaction, ...prev]);

    setPaymentModalOpen(false);
    setCart([]);
    setCurrentView('tracking');
  };

  const handleAddMoney = (amount) => {
    setWallet(prev => prev + amount);
    const newTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'CREDIT',
      amount: amount,
      description: 'Wallet Top-up',
      date: new Date().toISOString().split('T')[0],
      status: 'SUCCESS',
      method: PaymentMethod.UPI
    };
    setTransactions(prev => [newTransaction, ...prev]);
    alert(`Successfully added INR ${amount} to wallet!`);
  };

  const handleRequestRefund = (id) => {
     const txn = transactions.find(t => t.id === id);
     if(!txn) return;
     
     if(window.confirm(`Request refund for ${txn.description}? This is a simulation.`)) {
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'REFUNDED', type: 'REFUND' } : t));
        setWallet(prev => prev + txn.amount);
        alert("Refund processed successfully! Amount credited to wallet.");
     }
  };

  const handleLocationSelect = (loc) => {
    setUserLocation(loc);
    localStorage.setItem('userLocation', JSON.stringify(loc));
    setLocationModalOpen(false);
  };

  const handleGetStarted = () => {
     setShowLanding(false);
     setCurrentView('home');
     if (!userLocation) {
        setTimeout(() => setLocationModalOpen(true), 500);
     }
  };

  // REMOVED: Loading screen - always show content immediately with mock data
  // No loading state blocking - app always renders immediately

  if (showLanding) {
     return <LandingPage onGetStarted={handleGetStarted} allDishes={allDishes} />;
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-white text-gray-900 font-sans">
      <Navbar 
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)} 
        balance={wallet} 
        onViewChange={handleViewChange}
        currentView={currentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        userLocation={userLocation}
        onChangeLocation={() => setLocationModalOpen(true)}
        onBackToLanding={() => setShowLanding(true)}
        isGenerating={isGeneratingDish}
      />

      <main>
        {currentView === 'home' && (
          <HomeView 
            restaurants={displayedRestaurants} 
            userConditions={conditions} 
            toggleCondition={toggleCondition}
            addToCart={addToCart}
            openPriceGraph={openPriceGraph}
            checkRegret={checkRegret}
            onDishClick={(d) => setSelectedDish(d)}
            searchQuery={searchQuery}
            userLocation={userLocation}
            onOpenMenu={openRestaurantMenu}
          />
        )}
        {currentView === 'ai' && <AIAdvisorView addToCart={addToCart} allDishes={allDishes} restaurants={restaurants} />}
        {currentView === 'group' && <GroupOrderView onAddGroupToCart={addMultipleToCart} restaurants={restaurants} onStartOrder={() => setCurrentView('home')} />}
        {currentView === 'wallet' && (
          <WalletView 
            balance={wallet} 
            transactions={transactions}
            onAddMoney={handleAddMoney}
            onOpenSplitBill={() => setSplitBillOpen(true)}
            onRequestRefund={handleRequestRefund}
          />
        )}
        {currentView === 'tracking' && trackingRestaurant && (
          <TrackingView 
            onBackHome={() => setCurrentView('home')} 
            userLocation={userLocation}
            restaurantLocation={trackingRestaurant}
          />
        )}
      </main>

      <CartSidebar 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        cart={cart}
        updateQuantity={updateQuantity}
        onCheckoutClick={handleCheckoutInit}
      />

      <PaymentModal 
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        totalAmount={checkoutTotal}
        walletBalance={wallet}
        onPay={handlePaymentComplete}
      />

      <PriceGraphModal 
        isOpen={priceModalOpen}
        onClose={() => setPriceModalOpen(false)}
        restaurant={selectedRestaurant}
      />

      <SplitBillModal 
        isOpen={splitBillOpen}
        onClose={() => setSplitBillOpen(false)}
      />

      <RestaurantMenuModal 
        isOpen={menuModalOpen}
        onClose={() => setMenuModalOpen(false)}
        restaurant={selectedRestaurant}
        addToCart={addToCart}
        checkRegret={checkRegret}
      />

      <DishDetailModal 
        isOpen={!!selectedDish}
        onClose={() => setSelectedDish(null)}
        dish={selectedDish}
        addToCart={addToCart}
        userConditions={conditions}
      />

      <LocationModal 
        isOpen={locationModalOpen}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}
