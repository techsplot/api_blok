# Q&A System Architecture & Flow

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │           AI Chat Component (aichat.js)                   │  │
│  │                                                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │  │
│  │  │  Onboarding │  │   Q&A Btns  │  │  Chat Input │     │  │
│  │  │  Questions  │  │  (Quick Ans)│  │  (AI/Custom)│     │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                 │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │      /api/smart-qa (route.js)                            │  │
│  │                                                          │  │
│  │  Actions:                                                │  │
│  │  • getAPIQuestions  → Get all Q&A for an API            │  │
│  │  • getQuickQA       → Get instant answer by ID          │  │
│  │  • askAI            → AI-powered fallback               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │      /api/chat (route.js)                                │  │
│  │  • getChatResponse  → General AI chat                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                         │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │   qaCache.js     │  │  qaService.js    │                    │
│  │                  │  │                  │                    │
│  │  • loadAllQAData │  │  • getApiQA      │                    │
│  │  • getQAForAPI   │  │  • findBestMatch │                    │
│  │  • getQAById     │  │  • hybridResponse│                    │
│  │                  │  │                  │                    │
│  │  [5 min cache]   │  │  [AI matching]   │                    │
│  └──────────────────┘  └──────────────────┘                    │
│           │                      │                              │
│           └──────────┬───────────┘                              │
│                      │                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │      geminiService.js                                    │  │
│  │  • getChatResponse → Gemini AI API calls                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                              │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │   Storyblok CMS  │  │  Google Gemini   │                    │
│  │                  │  │                  │                    │
│  │  • api_ai/       │  │  • AI Responses  │                    │
│  │  • Q&A Content   │  │  • Smart Matching│                    │
│  │  • Rich Text     │  │  • Context Check │                    │
│  │  • Code Examples │  │                  │                    │
│  └──────────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

## User Flow Diagram

```
┌──────────────┐
│  User Opens  │
│   AI Chat    │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  Complete Onboarding │
│  (4 questions)       │
└──────┬───────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Load Q&A Questions         │
│  GET /api/smart-qa          │
│  action: getAPIQuestions    │
└──────┬──────────────────────┘
       │
       ├─────────┐
       │         │
       ▼         ▼
┌──────────┐  ┌──────────────┐
│ Q&A      │  │ No Q&A       │
│ Available│  │ Available    │
└────┬─────┘  └──────┬───────┘
     │               │
     ▼               ▼
┌─────────────┐  ┌──────────────┐
│ Show Q&A    │  │ Show Generic │
│ Buttons     │  │ Prompts      │
│ (6 max)     │  │              │
└─────┬───────┘  └──────┬───────┘
      │                 │
      └────────┬────────┘
               │
               ▼
       ┌───────────────┐
       │ User Interacts│
       └───────┬───────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│ Clicks Q&A  │  │ Types Custom │
│ Button      │  │ Question     │
└─────┬───────┘  └──────┬───────┘
      │                 │
      ▼                 ▼
┌─────────────┐  ┌──────────────┐
│ Get Quick   │  │ Check API    │
│ Answer      │  │ Relevance    │
│ (Instant)   │  │ (AI Check)   │
└─────┬───────┘  └──────┬───────┘
      │                 │
      │          ┌──────┴──────┐
      │          │             │
      │          ▼             ▼
      │    ┌──────────┐  ┌─────────┐
      │    │ Relevant │  │Not      │
      │    │          │  │Relevant │
      │    └────┬─────┘  └────┬────┘
      │         │             │
      │         ▼             ▼
      │    ┌──────────┐  ┌─────────┐
      │    │Generate  │  │Show     │
      │    │AI Answer │  │Boundary │
      │    └────┬─────┘  │Message  │
      │         │        └─────────┘
      └─────────┴────────────┘
                │
                ▼
        ┌───────────────┐
        │ Display Answer│
        │ with Badge    │
        └───────────────┘
```

## Q&A Button Click Flow

```
┌─────────────────────┐
│ User Clicks Q&A Btn │
│ "How to auth?"      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Add User Message    │
│ to Chat History     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Show Typing         │
│ Indicator           │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ POST /api/smart-qa  │
│ {                   │
│   action: getQuickQA│
│   qaId: "123_0"     │
│ }                   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ qaCache.getQAById() │
│ (from cache)        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Return Full Answer  │
│ • Text content      │
│ • Code examples     │
│ • Formatted         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Display in Chat     │
│ • Parse markdown    │
│ • Show code blocks  │
│ • Add "Quick Ans"   │
│   badge             │
└─────────────────────┘
```

## Custom Question Flow

```
┌─────────────────────┐
│ User Types Question │
│ "How to deploy?"    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ POST /api/chat      │
│ with API context    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ AI Checks Relevance │
│ (Gemini API)        │
└──────┬──────────────┘
       │
    ┌──┴──┐
    │     │
    ▼     ▼
┌────────┐ ┌──────────┐
│Related │ │Not Related│
│to API  │ │to API     │
└───┬────┘ └─────┬────┘
    │            │
    ▼            ▼
┌────────┐  ┌──────────┐
│Generate│  │Show      │
│AI      │  │"Sorry    │
│Response│  │can't help│
└───┬────┘  │with that"│
    │       └──────────┘
    ▼
┌────────────┐
│Display     │
│Answer      │
└────────────┘
```

## Data Structure

### Q&A Item Structure
```javascript
{
  id: "story_id_0",
  question: "How do I authenticate?",
  answer: "Plain text answer...",
  fullAnswer: "Answer with code examples...",
  tags: ["authentication", "setup"],
  category: "authentication",
  apiSlug: "paystack",
  apiName: "Paystack"
}
```

### Message Structure
```javascript
{
  id: "timestamp",
  content: "Message text with **markdown**",
  isUser: true/false,
  timestamp: Date,
  source: "qa_database" | "ai_generated",
  hasCode: true/false,
  codeExample: "code snippet..."
}
```

## Caching Strategy

```
┌────────────────────────────────────────┐
│         Q&A Cache (qaCache.js)         │
├────────────────────────────────────────┤
│  Duration: 5 minutes                   │
│  Storage: In-memory Map                │
│                                        │
│  Key: apiSlug (e.g., "paystack")      │
│  Value: Array of Q&A items            │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ paystack → [qa1, qa2, qa3...]    │ │
│  │ flutterwave → [qa1, qa2...]      │ │
│  │ stripe → [qa1, qa2, qa3...]      │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Refresh: Automatic after 5 minutes   │
│  or on server restart                 │
└────────────────────────────────────────┘
```

## Performance Metrics

| Operation | Speed | Source |
|-----------|-------|--------|
| Q&A Button Click | ~100-200ms | Cache |
| AI Custom Question | ~2-5s | Gemini API |
| Q&A Data Load | ~500ms | Storyblok + Cache |
| Relevance Check | ~1-2s | Gemini API |

## Error Handling

```
┌─────────────────────┐
│  API Call Fails     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Check Error Type   │
└──────┬──────────────┘
       │
    ┌──┴──────────┐
    │             │
    ▼             ▼
┌──────────┐  ┌─────────────┐
│Q&A Not   │  │Network      │
│Found     │  │Error        │
└────┬─────┘  └──────┬──────┘
     │               │
     ▼               ▼
┌──────────┐  ┌─────────────┐
│Fallback  │  │Show Error   │
│to AI     │  │+ Retry      │
└──────────┘  └─────────────┘
```

---

## Key Benefits

✅ **Fast**: Instant Q&A responses (100-200ms)  
✅ **Reliable**: Pre-vetted, accurate answers  
✅ **Scalable**: Add Q&A without code changes  
✅ **Cost-Effective**: Reduces AI API calls  
✅ **User-Friendly**: Clear visual indicators  
✅ **Flexible**: Seamless fallback to AI  

