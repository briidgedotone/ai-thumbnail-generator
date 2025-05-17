import nlp from 'compromise';

// Define a proper interface for the extracted themes
export interface ExtractedThemes {
  mainSubject: string;
  action: string;
  setting: string;
  mood: string;
  topics: string[];
  adjectives: string[];
  hasPriceComparison: boolean;
}

/**
 * Extracts key themes, subjects, and elements from the video description
 * using NLP to better understand the content
 */
export const extractKeyThemes = (description: string): ExtractedThemes => {
  // Process the description with compromise.js
  const doc = nlp(description);
  
  // Extract nouns (potential subjects)
  const nouns = doc.nouns().out('array');
  
  // Extract verbs (potential actions)
  const verbs = doc.verbs().out('array');
  const verbBase = verbs.length > 0 ? 
    doc.verbs().toInfinitive().out('array')[0] : 'demonstrating';
  
  // Extract adjectives (descriptions, qualities)
  const adjectives = doc.adjectives().out('array');
  
  // Extract places (potential settings)
  const places = doc.places().out('array');
  
  // Determine the mood based on more sophisticated analysis
  const sentiments = {
    positive: ['amazing', 'exciting', 'awesome', 'great', 'incredible', 'excellent', 'fantastic'],
    negative: ['terrible', 'awful', 'bad', 'horrible', 'disappointing'],
    calm: ['peaceful', 'calm', 'relaxing', 'gentle', 'soothing', 'quiet'],
    intense: ['extreme', 'intense', 'dramatic', 'powerful', 'strong', 'epic']
  };
  
  // Detect the overall mood
  let detectedMood = 'neutral';
  
  // Check for sentiments in both adjectives and the full description
  if (adjectives.some((adj: string) => sentiments.positive.includes(adj.toLowerCase()))) {
    detectedMood = 'positive';
  } else if (adjectives.some((adj: string) => sentiments.negative.includes(adj.toLowerCase()))) {
    detectedMood = 'negative';
  } else if (adjectives.some((adj: string) => sentiments.calm.includes(adj.toLowerCase()))) {
    detectedMood = 'calm';
  } else if (adjectives.some((adj: string) => sentiments.intense.includes(adj.toLowerCase()))) {
    detectedMood = 'intense';
  }
  
  // Check the full description if no mood detected in adjectives
  if (detectedMood === 'neutral') {
    for (const mood in sentiments) {
      if (sentiments[mood as keyof typeof sentiments].some(term => 
        description.toLowerCase().includes(term))) {
        detectedMood = mood;
        break;
      }
    }
  }
  
  // Extract topics (important terms not covered by other categories)
  const topics = doc.topics().out('array');
  
  // Extract hashtags if they exist
  const hashtags = description.match(/#\w+/g) || [];
  
  // Get a main subject - prefer topics, then nouns
  const mainSubject = topics.length > 0 ? topics[0] : 
                     nouns.length > 0 ? nouns[0] : 'content';
                     
  // Get a setting - prefer places, then look for setting-like words
  const settingWords = ['room', 'house', 'outside', 'indoor', 'outdoor', 'studio', 'kitchen'];
  const settingNoun = nouns.find((noun: string) => 
    settingWords.some((setting: string) => noun.toLowerCase().includes(setting))
  );
  
  const setting = places.length > 0 ? places[0] : 
                 settingNoun || 'environment';

  // Check for price/value comparisons that might suggest MrBeast-style comparisons
  const pricePattern = /\$\d+\s*(?:vs\.?|versus)\s*\$\d+|\d+\s*(?:vs\.?|versus)\s*\d+|\$\d+\s*(?:to)\s*\$\d+|\d+\s*(?:day|days|hour|hours)/i;
  const hasPriceComparison = pricePattern.test(description);
  
  return {
    mainSubject,
    action: verbBase,
    setting,
    mood: detectedMood,
    topics: [...topics, ...hashtags.map(tag => tag.substring(1))], // Remove # from hashtags
    adjectives,
    hasPriceComparison
  };
}; 