# Gemini API Integration for Intelligent Prompt Generation

This document explains the integration of Google's Gemini API for intelligent prompt generation in the YouTube thumbnail creator.

## Overview

The application now uses Gemini's advanced language model to analyze user descriptions and generate structured prompts for image generation. This replaces the previous complex regex-based approach with a more flexible and intelligent system.

## How It Works

1. User enters a description for their video
2. The application sends this description to Gemini API via our `/api/analyze-prompt` endpoint
3. Gemini analyzes the text, extracting key elements like:
   - Subject matter (products, concepts, etc.)
   - Colors and visual elements
   - Composition requirements (closeup, hand-focused, etc.)
   - Background information
4. Gemini returns a fully structured prompt following our template format
5. This prompt is sent to the image generation API
6. The fallback mechanism ensures reliability even if Gemini is unavailable

## Implementation Details

### 1. API Endpoint
- Located at: `src/app/api/analyze-prompt/route.ts`
- Receives user description and extracted themes
- Formats a detailed prompt request for Gemini
- Returns a structured image generation prompt

### 2. Gemini Prompt Template
Gemini is instructed to generate prompts following our established format:
```
Create a [style] YouTube thumbnail for a video about: "[description]"

FACIAL EXPRESSION GUIDANCE:
...

COMPOSITION:
...

SUBJECTS & EXPRESSIONS:
...

VISUAL TREATMENT:
...

STORYTELLING ELEMENTS:
...

TECHNICAL SPECIFICATIONS:
...

KEY ELEMENTS FROM VIDEO:
...

OVERRIDE INSTRUCTIONS:
...
```

### 3. Fallback Mechanism
If the Gemini API call fails for any reason, the system falls back to the original template-based approach, ensuring reliability.

## Setup Requirements

1. Obtain a Gemini API key from Google Cloud Console
2. Add this key to your `.env.local` file:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## Benefits

- **More flexible language understanding**: Can understand natural language descriptions without rigid patterns
- **Better context awareness**: Extracts meaning rather than matching patterns
- **Improved output quality**: Generates detailed, contextually appropriate prompts
- **Reduced code complexity**: Replaces complex regex and logic with AI understanding
- **Future extensibility**: Easy to enhance with new capabilities without additional code

## Minimalist Style Implementation

The implementation currently focuses on the minimalist style, with a path for extending to other styles. 