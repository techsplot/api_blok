# API Q&A Setup Guide

This guide explains how to set up Q&A content in Storyblok for the hybrid AI chat system.

## Folder Structure in Storyblok

Create the following folder structure in your Storyblok space:

```
api_ai/
├── paystack/          # Folder for Paystack API Q&A
│   ├── authentication
│   ├── making-payments
│   ├── webhooks
│   └── refunds
├── flutterwave/       # Folder for Flutterwave API Q&A  
│   ├── authentication
│   ├── card-payments
│   ├── mobile-money
│   └── subscriptions
└── stripe/            # Folder for Stripe API Q&A
    ├── setup
    ├── payments
    └── customers
```

## Content Type Schema

Create a content type called `api_qa_item` with the following fields:

### Required Fields:
- **question** (Text) - The user question
- **answer** (Rich Text) - The detailed answer
- **tags** (Text, Multi-value) - Tags for categorization

### Optional Fields:
- **priority** (Number) - Display priority (higher = more important)
- **last_updated** (Date) - When the Q&A was last updated
- **related_endpoints** (Text, Multi-value) - Related API endpoints

## Example Content

### Sample Q&A Item for Paystack Authentication

**Slug:** `api_ai/paystack/authentication`

**Content:**
```json
{
  "question": "How do I authenticate with the Paystack API?",
  "answer": {
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "Paystack uses Bearer token authentication. Include your secret key in the Authorization header:"
          }
        ]
      },
      {
        "type": "code_block",
        "attrs": {
          "language": "javascript"
        },
        "content": [
          {
            "type": "text",
            "text": "const response = await fetch('https://api.paystack.co/transaction/initialize', {\n  method: 'POST',\n  headers: {\n    'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    email: 'customer@email.com',\n    amount: 20000 // amount in kobo\n  })\n});"
          }
        ]
      }
    ]
  },
  "tags": ["authentication", "bearer-token", "headers", "setup"],
  "priority": 10,
  "related_endpoints": ["/transaction/initialize", "/transaction/verify"]
}
```

### Sample Q&A Item for Payment Processing

**Slug:** `api_ai/paystack/making-payments`

**Content:**
```json
{
  "question": "How do I process a payment with Paystack?",
  "answer": {
    "type": "doc", 
    "content": [
      {
        "type": "paragraph",
        "content": [
          {
            "type": "text",
            "text": "To process a payment with Paystack, follow these steps:\n\n1. **Initialize the transaction** on your server\n2. **Redirect user** to Paystack payment page\n3. **Verify the transaction** after payment\n\nHere's a complete example:"
          }
        ]
      },
      {
        "type": "code_block",
        "attrs": {
          "language": "javascript"
        },
        "content": [
          {
            "type": "text",
            "text": "// 1. Initialize transaction\nconst initResponse = await fetch('https://api.paystack.co/transaction/initialize', {\n  method: 'POST',\n  headers: {\n    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    email: 'customer@email.com',\n    amount: 20000, // ₦200 in kobo\n    currency: 'NGN',\n    callback_url: 'https://yoursite.com/verify-payment'\n  })\n});\n\nconst { data } = await initResponse.json();\n\n// 2. Redirect user to payment page\nwindow.location.href = data.authorization_url;\n\n// 3. Verify transaction (on callback)\nconst verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {\n  headers: {\n    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`\n  }\n});"
          }
        ]
      }
    ]
  },
  "tags": ["payments", "initialize", "verify", "transaction"],
  "priority": 10,
  "related_endpoints": ["/transaction/initialize", "/transaction/verify"]
}
```

## Best Practices

### Question Writing
- Write questions as users would ask them
- Include variations of common questions
- Use natural language, not technical jargon
- Cover different skill levels (beginner to advanced)

### Answer Writing  
- Provide complete, working code examples
- Explain the "why" not just the "how"
- Include error handling examples
- Link to relevant documentation sections
- Use the user's tech stack when possible

### Tags
- Use consistent tagging across all APIs
- Include skill level tags: `beginner`, `intermediate`, `advanced`
- Include feature tags: `authentication`, `payments`, `webhooks`
- Include technology tags: `javascript`, `python`, `php`

### Content Organization
- Group related Q&As in folders by API
- Use descriptive slugs that reflect the content
- Set appropriate priority values for common questions
- Keep answers focused on one main topic

## Semantic Matching

The system uses AI to match user questions to your Q&A database semantically, meaning:
- Questions don't need to match exactly
- Different phrasings of the same question will match
- The AI considers context and intent
- Confidence threshold determines when to use Q&A vs fallback to AI

## Testing Your Q&A

1. Add a few Q&A items for your API
2. Test with exact question matches
3. Test with paraphrased questions  
4. Monitor which questions fall back to AI
5. Add new Q&A items for common fallback questions

## Maintenance

- Regularly review AI fallback responses
- Add popular questions that aren't covered
- Update answers when APIs change
- Monitor user feedback and questions
- Keep code examples up to date