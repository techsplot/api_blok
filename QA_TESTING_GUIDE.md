# Quick Testing Guide for Q&A Feature

## 🚀 Quick Start Testing

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test Q&A Data Loading
```bash
# Open browser console and run:
curl http://localhost:3000/api/fetch-qa?folder=api_ai
```

Expected output:
```json
{
  "success": true,
  "totalStories": 3,
  "stories": [...]
}
```

### 3. Test Smart Q&A Endpoint

#### Get Questions List:
```bash
curl -X POST http://localhost:3000/api/smart-qa \
  -H "Content-Type: application/json" \
  -d '{
    "action": "getAPIQuestions",
    "apiSlug": "paystack"
  }'
```

Expected:
```json
{
  "success": true,
  "apiSlug": "paystack",
  "questions": [
    {
      "id": "123_0",
      "question": "How do I authenticate?",
      "tags": ["authentication"],
      "category": "setup"
    }
  ]
}
```

#### Get Quick Answer:
```bash
curl -X POST http://localhost:3000/api/smart-qa \
  -H "Content-Type: application/json" \
  -d '{
    "action": "getQuickQA",
    "qaId": "123_0"
  }'
```

Expected:
```json
{
  "response": "Full answer with code examples...",
  "source": "qa_database",
  "confidence": 1.0
}
```

## 🧪 Manual UI Testing Checklist

### ✅ Initial Load
- [ ] Open AI Chat from any API doc page
- [ ] Complete onboarding (4 questions)
- [ ] Check: Q&A buttons appear below chat
- [ ] Check: "Quick Answers from Knowledge Base" header visible
- [ ] Check: Green "Instant Response" badge visible
- [ ] Check: Up to 6 Q&A buttons displayed

### ✅ Q&A Button Interaction
- [ ] Click any Q&A button
- [ ] Check: Question appears as user message
- [ ] Check: Typing indicator shows briefly
- [ ] Check: Answer appears as AI message
- [ ] Check: "⚡ Quick Answer" badge on response
- [ ] Check: Code blocks formatted correctly
- [ ] Check: Response appears in < 500ms

### ✅ Custom Question
- [ ] Type a custom question
- [ ] Press Enter or click Send
- [ ] Check: AI processes the question
- [ ] Check: Response takes 2-5 seconds
- [ ] Check: No "Quick Answer" badge on AI responses

### ✅ No Q&A Available
- [ ] Test with API that has no Q&A data
- [ ] Check: Generic suggested prompts appear
- [ ] Check: No Q&A buttons shown
- [ ] Check: Chat still functions normally

### ✅ Q&A Buttons Disappear
- [ ] Send 3+ messages in chat
- [ ] Check: Q&A buttons hide after 2 messages
- [ ] Check: Chat input remains functional

### ✅ Error Handling
- [ ] Disconnect internet
- [ ] Click Q&A button
- [ ] Check: Error message appears
- [ ] Check: Chat doesn't crash

## 🔍 Console Debugging

### Check Q&A Loading
Open browser DevTools console and look for:
```
🔄 Loading fresh Q&A data from Storyblok...
✅ Loaded Q&A for 3 APIs: ['paystack', 'flutterwave', 'stripe']
📚 Found 5 Q&A items for API: paystack
```

### Check Q&A Fetch
```
✅ Loaded 6 Q&A questions for Paystack
```

### Check Q&A Response
```
Network tab → /api/smart-qa
Request: { action: "getQuickQA", qaId: "123_0" }
Response: { response: "...", source: "qa_database" }
```

## 📊 Test Scenarios

### Scenario 1: Happy Path
1. User opens chat → Onboarding completes
2. Q&A buttons appear
3. User clicks "How do I authenticate?"
4. Instant answer with code example appears
5. User satisfied ✅

### Scenario 2: No Match
1. User opens chat
2. User types "What's the weather?"
3. AI checks relevance
4. Returns: "I can only help with [API Name]"
5. User understands limitation ✅

### Scenario 3: Empty Q&A
1. User opens chat for new API
2. No Q&A content in Storyblok
3. Generic prompts appear instead
4. User can still ask questions
5. AI provides answers ✅

### Scenario 4: Multiple APIs
1. User views Paystack docs → Opens chat
2. Sees Paystack Q&A buttons
3. User switches to Flutterwave docs → Opens chat
4. Sees Flutterwave Q&A buttons
5. Context switches correctly ✅

## 🐛 Common Issues & Solutions

### Issue: No Q&A Buttons Appearing

**Check:**
```javascript
// In browser console:
localStorage.getItem('activeDoc')
// Should show: {"name":"Paystack","slug":"paystack",...}
```

**Solution:**
1. Make sure you clicked on an API from search results
2. Check Storyblok has `api_ai/[api_name]_ai` story
3. Verify story has `qna_item` components

### Issue: Q&A Returns 404

**Check:**
```bash
# Test direct API call
curl -X POST http://localhost:3000/api/smart-qa \
  -H "Content-Type: application/json" \
  -d '{"action":"getAPIQuestions","apiSlug":"paystack"}'
```

**Solution:**
1. Check Storyblok story exists
2. Verify story is published (not draft)
3. Check slug naming: `paystack_ai` or contains `paystack`

### Issue: Answers Missing Code Examples

**Check:** Storyblok content structure:
```json
{
  "component": "qna_item",
  "examples": [
    {
      "example_title": "JavaScript Example",
      "example_code": {
        "type": "doc",
        "content": [
          {
            "type": "code_block",
            "content": [...]
          }
        ]
      }
    }
  ]
}
```

**Solution:**
1. Add `examples` field to Q&A items
2. Use code_block type in rich text
3. Set language attribute

### Issue: Slow Q&A Response

**Check:** Network waterfall in DevTools

**Solution:**
1. Q&A should be < 500ms
2. If slow, check Storyblok API response time
3. Verify cache is working (check console logs)
4. Cache expires after 5 minutes

## 📈 Success Metrics

Track these to measure success:

| Metric | Target | How to Check |
|--------|--------|--------------|
| Q&A Load Time | < 500ms | Network tab |
| Q&A Response Time | < 200ms | Network tab |
| Q&A Button Click Rate | > 50% | Analytics |
| Q&A Coverage | > 80% common questions | User feedback |
| Error Rate | < 1% | Console logs |

## 🧰 Developer Tools

### Chrome DevTools
- **Network Tab**: Monitor API calls
- **Console Tab**: Check logs and errors
- **Application Tab**: Check localStorage
- **Performance Tab**: Measure load times

### VS Code
- **Thunder Client**: Test API endpoints
- **Console Logs**: Server-side debugging

### Postman
Test API endpoints with collections:
```json
{
  "name": "Q&A Tests",
  "requests": [
    {
      "name": "Get Questions",
      "method": "POST",
      "url": "http://localhost:3000/api/smart-qa",
      "body": {
        "action": "getAPIQuestions",
        "apiSlug": "paystack"
      }
    }
  ]
}
```

## 📝 Test Checklist Summary

- [ ] Q&A buttons appear for APIs with content
- [ ] Instant responses (< 500ms) work
- [ ] Code examples display correctly
- [ ] "Quick Answer" badge shows
- [ ] Fallback prompts for APIs without Q&A
- [ ] Custom questions still work with AI
- [ ] Error messages display gracefully
- [ ] Cache refreshes after 5 minutes
- [ ] Multiple API contexts switch correctly
- [ ] Mobile responsive layout works

## 🎯 Ready for Production?

Before deploying, ensure:
- [ ] All test scenarios pass
- [ ] At least 5-10 Q&A items per API
- [ ] Error handling tested
- [ ] Performance meets targets
- [ ] User feedback collected
- [ ] Documentation updated

---

**Need Help?**
- Check `/docs/qa-setup-guide.md` for content structure
- Review `/QA_SYSTEM_ARCHITECTURE.md` for system details
- See `/QA_IMPLEMENTATION_SUMMARY.md` for feature overview
