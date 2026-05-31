const axios = require('axios');

// Fruit database with detailed information
const fruitDatabase = [
  { name: 'Apple', color: 'Red', taste: 'Sweet', category: 'Temperate', origin: 'Central Asia' },
  { name: 'Banana', color: 'Yellow', taste: 'Sweet', category: 'Tropical', origin: 'Southeast Asia' },
  { name: 'Orange', color: 'Orange', taste: 'Citrus', category: 'Subtropical', origin: 'China' },
  { name: 'Strawberry', color: 'Red', taste: 'Sweet', category: 'Temperate', origin: 'Europe' },
  { name: 'Mango', color: 'Yellow', taste: 'Sweet', category: 'Tropical', origin: 'India' },
  { name: 'Grapes', color: 'Purple', taste: 'Sweet', category: 'Temperate', origin: 'Middle East' },
  { name: 'Watermelon', color: 'Green', taste: 'Sweet', category: 'Tropical', origin: 'Africa' },
  { name: 'Pineapple', color: 'Yellow', taste: 'Tangy', category: 'Tropical', origin: 'South America' },
  { name: 'Blueberry', color: 'Blue', taste: 'Sweet', category: 'Temperate', origin: 'North America' },
  { name: 'Peach', color: 'Orange', taste: 'Sweet', category: 'Temperate', origin: 'China' },
  { name: 'Cherry', color: 'Red', taste: 'Sweet', category: 'Temperate', origin: 'Europe' },
  { name: 'Kiwi', color: 'Green', taste: 'Tangy', category: 'Subtropical', origin: 'China' },
  { name: 'Lemon', color: 'Yellow', taste: 'Sour', category: 'Subtropical', origin: 'India' },
  { name: 'Coconut', color: 'White', taste: 'Sweet', category: 'Tropical', origin: 'Southeast Asia' },
  { name: 'Papaya', color: 'Orange', taste: 'Sweet', category: 'Tropical', origin: 'Central America' },
  { name: 'Guava', color: 'Green', taste: 'Sweet', category: 'Tropical', origin: 'Mexico' },
  { name: 'Dragon Fruit', color: 'Pink', taste: 'Mild', category: 'Tropical', origin: 'Central America' },
  { name: 'Lychee', color: 'Red', taste: 'Sweet', category: 'Tropical', origin: 'China' },
  { name: 'Pomegranate', color: 'Red', taste: 'Tangy', category: 'Subtropical', origin: 'Iran' },
  { name: 'Avocado', color: 'Green', taste: 'Creamy', category: 'Tropical', origin: 'Mexico' },
  { name: 'Passion Fruit', color: 'Purple', taste: 'Tangy', category: 'Tropical', origin: 'South America' },
  { name: 'Fig', color: 'Purple', taste: 'Sweet', category: 'Subtropical', origin: 'Middle East' },
  { name: 'Date', color: 'Brown', taste: 'Sweet', category: 'Subtropical', origin: 'Middle East' },
  { name: 'Raspberry', color: 'Red', taste: 'Sweet', category: 'Temperate', origin: 'Europe' },
  { name: 'Blackberry', color: 'Black', taste: 'Sweet', category: 'Temperate', origin: 'Europe' },
  { name: 'Cranberry', color: 'Red', taste: 'Tart', category: 'Temperate', origin: 'North America' },
  { name: 'Apricot', color: 'Orange', taste: 'Sweet', category: 'Temperate', origin: 'China' },
  { name: 'Plum', color: 'Purple', taste: 'Sweet', category: 'Temperate', origin: 'Europe' },
  { name: 'Pear', color: 'Green', taste: 'Sweet', category: 'Temperate', origin: 'Europe' },
  { name: 'Durian', color: 'Green', taste: 'Creamy', category: 'Tropical', origin: 'Southeast Asia' },
  { name: 'Jackfruit', color: 'Yellow', taste: 'Sweet', category: 'Tropical', origin: 'India' },
  { name: 'Star Fruit', color: 'Yellow', taste: 'Tangy', category: 'Tropical', origin: 'Southeast Asia' },
  { name: 'Persimmon', color: 'Orange', taste: 'Sweet', category: 'Subtropical', origin: 'China' },
  { name: 'Pomelo', color: 'Yellow', taste: 'Citrus', category: 'Tropical', origin: 'Southeast Asia' },
  { name: 'Tangerine', color: 'Orange', taste: 'Citrus', category: 'Subtropical', origin: 'China' },
  { name: 'Cantaloupe', color: 'Orange', taste: 'Sweet', category: 'Tropical', origin: 'Africa' }
];

// Question templates
const questionTemplates = [
  {
    template: (fruit) => `What color is ${fruit.name} typically?`,
    correct: (fruit) => fruit.color,
    category: 'color'
  },
  {
    template: (fruit) => `What is the taste of ${fruit.name}?`,
    correct: (fruit) => fruit.taste,
    category: 'taste'
  },
  {
    template: (fruit) => `Where did ${fruit.name} originally come from?`,
    correct: (fruit) => fruit.origin,
    category: 'origin'
  },
  {
    template: (fruit) => `What category does ${fruit.name} belong to?`,
    correct: (fruit) => fruit.category,
    category: 'category'
  },
  {
    template: (fruit) => `Which fruit is known for its ${fruit.color} color and ${fruit.taste} taste?`,
    correct: (fruit) => fruit.name,
    category: 'identification'
  }
];

async function fetchFruitsFromAPI() {
  try {
    // You can integrate with real fruit APIs here
    // For now, we'll use our comprehensive database
    return fruitDatabase;
  } catch (error) {
    console.error('Error fetching fruits:', error);
    return fruitDatabase;
  }
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateOptions(correctAnswer, allFruits, category, count = 4) {
  const options = [correctAnswer];
  
  // Get unique values for the category
  const possibleAnswers = [...new Set(allFruits.map(f => f[category]))]
    .filter(val => val !== correctAnswer && val && val.trim() !== '');
  
  const shuffled = shuffleArray(possibleAnswers);
  
  for (let i = 0; i < count - 1 && i < shuffled.length; i++) {
    options.push(shuffled[i]);
  }
  
  // If we don't have enough options, add more from other fruits
  if (options.length < count) {
    const allValues = allFruits.map(f => f[category]).filter(v => v && v.trim() !== '');
    const uniqueValues = [...new Set(allValues)].filter(v => !options.includes(v));
    const moreOptions = shuffleArray(uniqueValues);
    
    for (let i = 0; i < count - options.length && i < moreOptions.length; i++) {
      options.push(moreOptions[i]);
    }
  }
  
  return shuffleArray(options);
}

async function generateQuestions(numQuestions = 10) {
  const fruits = await fetchFruitsFromAPI();
  const questions = [];
  const usedFruits = new Set();
  
  for (let i = 0; i < numQuestions; i++) {
    // Select a random fruit
    let fruitIndex;
    do {
      fruitIndex = Math.floor(Math.random() * fruits.length);
    } while (usedFruits.has(fruitIndex) && usedFruits.size < fruits.length);
    
    usedFruits.add(fruitIndex);
    const fruit = fruits[fruitIndex];
    
    // Select a random question template
    const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
    
    const question = template.template(fruit);
    const correctAnswer = template.correct(fruit);
    const options = generateOptions(correctAnswer, fruits, template.category);
    const correctIndex = options.indexOf(correctAnswer);
    
    questions.push({
      question,
      options,
      correctIndex,
      fruit: fruit.name
    });
  }
  
  return questions;
}

module.exports = { generateQuestions, fetchFruitsFromAPI };
