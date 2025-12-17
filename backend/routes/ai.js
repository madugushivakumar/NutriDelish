import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import Dish from '../models/Dish.js';

const router = express.Router();

const API_KEY = process.env.GEMINI_API_KEY || '';
let ai = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

// Get food recommendation
router.post('/recommend', async (req, res) => {
  try {
    const { mood, weather, goal, cuisine, dishes: clientDishes } = req.body;
    
    // Use client-provided dishes if available, otherwise fetch from DB
    let dishes;
    if (clientDishes && Array.isArray(clientDishes) && clientDishes.length > 0) {
      // Convert client dishes format to match DB format
      dishes = clientDishes.map(d => ({
        _id: d.id,
        name: d.name,
        description: d.description,
        tags: d.tags || [],
        protein: d.protein || 0,
        carbs: d.carbs || 0,
        fats: d.fats || 0,
        calories: d.calories || 0,
        sodium: d.sodium || 0,
        price: d.price || 0
      }));
    } else {
      // Get all available dishes from DB
      dishes = await Dish.find({ isAvailable: true })
        .populate('restaurant', 'name cuisine');
    }
    
    // Filter by cuisine if specified
    if (cuisine && cuisine !== 'Any') {
      const cuisineLower = cuisine.toLowerCase();
      dishes = dishes.filter(d => {
        const dishTags = (d.tags || []).map(t => t.toLowerCase());
        const dishName = (d.name || '').toLowerCase();
        const dishDesc = (d.description || '').toLowerCase();
        const restaurantCuisine = d.restaurant?.cuisine 
          ? (Array.isArray(d.restaurant.cuisine) ? d.restaurant.cuisine : [d.restaurant.cuisine])
            .map(c => c.toLowerCase())
          : [];
        
        return dishTags.some(t => t.includes(cuisineLower)) ||
               dishName.includes(cuisineLower) ||
               dishDesc.includes(cuisineLower) ||
               restaurantCuisine.some(c => c.includes(cuisineLower));
      });
      
      // If no dishes match cuisine, use all dishes
      if (dishes.length === 0) {
        dishes = await Dish.find({ isAvailable: true }).populate('restaurant', 'name cuisine');
      }
    }
    
    const menuContext = dishes.map(d => ({
      id: d._id?.toString() || d.id,
      name: d.name,
      desc: d.description,
      tags: d.tags || [],
      macros: { p: d.protein || 0, c: d.carbs || 0, f: d.fats || 0 },
      calories: d.calories || 0,
      sodium: d.sodium || 0
    }));
    
    if (!ai) {
      // Fallback recommendation with cuisine consideration
      let fallbackDish = dishes[0] || null;
      
      // Try to find a better match based on goal
      if (goal === 'Weight Loss' && dishes.length > 0) {
        fallbackDish = dishes.filter(d => (d.calories || 0) < 400)
          .sort((a, b) => (a.calories || 0) - (b.calories || 0))[0] || dishes[0];
      } else if (goal === 'Muscle Gain' && dishes.length > 0) {
        fallbackDish = dishes.filter(d => (d.protein || 0) > 25)
          .sort((a, b) => (b.protein || 0) - (a.protein || 0))[0] || dishes[0];
      } else if (goal === 'Low Carb' && dishes.length > 0) {
        fallbackDish = dishes.filter(d => (d.carbs || 0) < 30)
          .sort((a, b) => (a.carbs || 0) - (b.carbs || 0))[0] || dishes[0];
      }
      
      return res.json({
        dishId: fallbackDish?._id?.toString() || fallbackDish?.id || '',
        dishName: fallbackDish?.name || 'Grilled Chicken Quinoa Bowl',
        reasoning: `Based on your ${goal.toLowerCase()} goal${cuisine && cuisine !== 'Any' ? ` and ${cuisine} cuisine preference` : ''}, this dish is perfect for you!`,
        estimatedCalories: fallbackDish?.calories || 450,
        protein: fallbackDish?.protein || 0
      });
    }
    
    const cuisineContext = cuisine && cuisine !== 'Any' ? `\n      - Cuisine Preference: ${cuisine}` : '';
    
    const prompt = `
      I have a specific menu of dishes: ${JSON.stringify(menuContext)}.
      
      User Context:
      - Mood: ${mood}
      - Weather: ${weather}
      - Health Goal: ${goal}${cuisineContext}
      
      Task:
      Analyze the nutritional profile and tags of the menu items.
      Select the single BEST dish ID that matches the user's context.
      ${cuisine && cuisine !== 'Any' ? `Prioritize dishes that match the ${cuisine} cuisine preference.` : ''}
      
      Return JSON with dishId, dishName, reasoning, estimatedCalories, and optionally protein.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dishId: { type: Type.STRING },
            dishName: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            estimatedCalories: { type: Type.INTEGER },
            protein: { type: Type.INTEGER }
          },
          required: ['dishId', 'dishName', 'reasoning', 'estimatedCalories']
        }
      }
    });
    
    if (response.text) {
      const recommendation = JSON.parse(response.text);
      res.json(recommendation);
    } else {
      throw new Error('No response from AI');
    }
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Generate dish from query
router.post('/generate-dish', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.length < 3) {
      return res.status(400).json({ message: 'Query must be at least 3 characters' });
    }
    
    if (!ai) {
      // Fallback: return a mock dish based on query
      return res.json({
        id: `ai-${Date.now()}`,
        name: `${query} Special`,
        description: `A delicious ${query} dish created just for you`,
        price: 299,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
        tags: ['Veg', 'Custom'],
        calories: 350,
        protein: 15,
        carbs: 45,
        fats: 10,
        sodium: 500,
        rating: 4.5,
        preparationTime: 30,
        restaurant: null,
        isAvailable: true
      });
    }
    
    const prompt = `
      Create a new food dish based on this query: "${query}"
      
      Return a JSON object with:
      - name: Creative dish name
      - description: Appetizing description (2-3 sentences)
      - price: Reasonable price in INR (200-500 range)
      - tags: Array of 2-4 relevant tags from: Veg, Non-Veg, Vegan, High Protein, Low Carb, Spicy, Sweet, Oily, Gluten Free, Street Food, Seafood, Beverage, Fast Food
      - calories: Estimated calories (200-600)
      - protein: Protein in grams (10-30)
      - carbs: Carbs in grams (20-60)
      - fats: Fats in grams (5-20)
      - sodium: Sodium in mg (300-800)
      - preparationTime: Prep time in minutes (20-45)
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            price: { type: Type.INTEGER },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            calories: { type: Type.INTEGER },
            protein: { type: Type.INTEGER },
            carbs: { type: Type.INTEGER },
            fats: { type: Type.INTEGER },
            sodium: { type: Type.INTEGER },
            preparationTime: { type: Type.INTEGER }
          },
          required: ['name', 'description', 'price', 'tags', 'calories', 'protein', 'carbs', 'fats', 'sodium', 'preparationTime']
        }
      }
    });
    
    if (response.text) {
      const dishData = JSON.parse(response.text);
      // Add default image and ID
      dishData.id = `ai-${Date.now()}`;
      dishData.image = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';
      dishData.rating = 4.5;
      dishData.isAvailable = true;
      dishData.restaurant = null;
      res.json(dishData);
    } else {
      throw new Error('No response from AI');
    }
  } catch (error) {
    console.error('AI Dish Generation Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Search nearby restaurants using AI based on location
router.post('/nearby-restaurants', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    // For demo: Generate AI-powered restaurant suggestions based on location
    // In production, you'd query a real restaurant database/API (like Google Places, Zomato, etc.)
    
    if (!ai) {
      // Fallback: Return mock nearby restaurants
      const mockRestaurants = [
        {
          id: 'nearby-1',
          name: 'Local Delights',
          cuisine: ['Indian', 'Street Food'],
          rating: 4.5,
          deliveryTime: 25,
          priceRange: '$$',
          distance: (Math.random() * 5 + 1).toFixed(1),
          menu: [
            { id: 'm1', name: 'Butter Chicken', price: 350, description: 'Creamy tomato-based curry' },
            { id: 'm2', name: 'Biryani', price: 280, description: 'Fragrant basmati rice dish' }
          ],
          coordinates: { lat: parseFloat(latitude) + (Math.random() * 0.1 - 0.05), lng: parseFloat(longitude) + (Math.random() * 0.1 - 0.05) },
          address: 'Near your location'
        }
      ];
      return res.json({ restaurants: mockRestaurants });
    }
    
    // Use AI to generate restaurant suggestions based on location
    const prompt = `
      Based on the user's location (latitude: ${latitude}, longitude: ${longitude}), 
      generate a list of 8-12 nearby restaurants. There is no distance limit - include restaurants at various distances.
      
      For each restaurant, provide:
      - name: Creative restaurant name (Indian, Italian, Chinese, Fast Food, etc.)
      - cuisine: Array of 2-3 cuisine types
      - rating: Rating between 4.0 and 5.0
      - deliveryTime: Delivery time in minutes (20-60, can vary based on distance)
      - priceRange: "$", "$$", or "$$$"
      - distance: Distance in km (can range from 0.5 to 20+ km)
      - menu: Array of 4-6 popular dishes with name, price (200-600 INR), and description
      - address: Approximate address near the location
      
      Make the restaurants diverse in cuisine types and price ranges.
      Include restaurants at various distances - some close (0.5-3km), some medium (3-10km), and some farther (10-20km).
      
      Return JSON array of restaurants.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              cuisine: { type: Type.ARRAY, items: { type: Type.STRING } },
              rating: { type: Type.NUMBER },
              deliveryTime: { type: Type.INTEGER },
              priceRange: { type: Type.STRING },
              distance: { type: Type.NUMBER },
              menu: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    price: { type: Type.INTEGER },
                    description: { type: Type.STRING }
                  }
                }
              },
              address: { type: Type.STRING },
              coordinates: {
                type: Type.OBJECT,
                properties: {
                  lat: { type: Type.NUMBER },
                  lng: { type: Type.NUMBER }
                }
              }
            },
            required: ['name', 'cuisine', 'rating', 'deliveryTime', 'priceRange', 'distance', 'menu', 'address']
          }
        }
      }
    });
    
    if (response.text) {
      let restaurants = JSON.parse(response.text);
      
      // Add IDs and coordinates if missing
      restaurants = restaurants.map((r, idx) => ({
        ...r,
        id: r.id || `nearby-${Date.now()}-${idx}`,
        coordinates: r.coordinates || {
          lat: parseFloat(latitude) + (Math.random() * 0.1 - 0.05),
          lng: parseFloat(longitude) + (Math.random() * 0.1 - 0.05)
        },
        image: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80`,
        priceHistory: []
      }));
      
      res.json({ restaurants });
    } else {
      throw new Error('No response from AI');
    }
  } catch (error) {
    console.error('AI Nearby Restaurants Error:', error);
    // Fallback to mock data
    const mockRestaurants = [
      {
        id: 'nearby-1',
        name: 'Local Delights',
        cuisine: ['Indian', 'Street Food'],
        rating: 4.5,
        deliveryTime: 25,
        priceRange: '$$',
        distance: 2.5,
        menu: [
          { id: 'm1', name: 'Butter Chicken', price: 350, description: 'Creamy tomato-based curry' },
          { id: 'm2', name: 'Biryani', price: 280, description: 'Fragrant basmati rice dish' }
        ],
        coordinates: { lat: parseFloat(req.body.latitude) || 28.6139, lng: parseFloat(req.body.longitude) || 77.2090 },
        address: 'Near your location',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80'
      }
    ];
    res.json({ restaurants: mockRestaurants });
  }
});

// Generate image URL for a dish using AI
router.post('/generate-image', async (req, res) => {
  try {
    const { dishName, description, tags } = req.body;
    
    if (!dishName) {
      return res.status(400).json({ message: 'Dish name is required' });
    }
    
    if (!ai) {
      // Fallback: Return a generic food image
      return res.json({
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        prompt: `${dishName} food dish`
      });
    }
    
    // Use AI to generate a detailed image description/prompt
    const prompt = `
      Based on this food dish information:
      - Name: ${dishName}
      - Description: ${description || 'Delicious food dish'}
      - Tags: ${tags ? tags.join(', ') : 'Food'}
      
      Generate a detailed, vivid description of how this dish should look in a professional food photography style.
      Focus on:
      - The main ingredients and their appearance
      - The plating/presentation style
      - Colors and textures
      - Lighting and ambiance
      - Food styling details
      
      IMPORTANT: For Indian dishes like dosa, idli, biryani, etc., make sure the keywords are specific to that dish type.
      For example, "Mysore Masala Dosa" should use keywords like "dosa", "masala dosa", "south indian dosa", "crispy dosa", "fermented crepe".
      
      Return a JSON object with:
      - imagePrompt: A detailed description suitable for image generation (2-3 sentences)
      - searchKeywords: An array of 3-5 keywords that would help find similar images (be very specific to the dish type)
      - style: The photography style (e.g., "professional food photography", "restaurant style", "home-cooked style")
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            imagePrompt: { type: Type.STRING },
            searchKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            style: { type: Type.STRING }
          },
          required: ['imagePrompt', 'searchKeywords']
        }
      }
    });
    
    if (response.text) {
      const imageData = JSON.parse(response.text);
      
      // Generate Unsplash URL using the primary keyword
      const primaryKeyword = imageData.searchKeywords[0] || dishName.toLowerCase().replace(/\s+/g, '-');
      
      // Use Unsplash Source API to get a relevant image
      // Format: https://source.unsplash.com/800x600/?{keyword}
      // Add timestamp to prevent caching
      const timestamp = Date.now();
      const imageUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(primaryKeyword)}&sig=${timestamp}`;
      
      console.log(`🖼️ Generated image URL for ${dishName}: ${imageUrl}`);
      console.log(`🔑 Keywords used: ${imageData.searchKeywords.join(', ')}`);
      
      res.json({
        imageUrl,
        prompt: imageData.imagePrompt,
        keywords: imageData.searchKeywords,
        style: imageData.style || 'professional food photography'
      });
    } else {
      throw new Error('No response from AI');
    }
  } catch (error) {
    console.error('AI Image Generation Error:', error);
    // Fallback to generic food image
    res.json({
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      prompt: `${req.body.dishName || 'Food'} dish`,
      keywords: [req.body.dishName?.toLowerCase() || 'food'],
      style: 'professional food photography'
    });
  }
});

export default router;

