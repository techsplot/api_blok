# Enhanced Storyblok Schema for Meta-Grade API Documentation

## Current Schema Fields
- name (text)
- description (richtext) 
- endpoints (bloks)
- auth_method (option)
- base_url (text)
- tags (multilink)
- image/logo (asset)

## Proposed Enhanced Schema

### Core API Information
- **name** (text) - API display name
- **slug** (text) - URL slug
- **description** (richtext) - Main description
- **short_description** (text) - Brief one-liner for cards
- **base_url** (text) - API base URL
- **documentation_url** (text) - Official docs link
- **logo** (asset) - API provider logo

### Authentication & Security
- **auth_method** (single option: none, api_key, oauth2, bearer_token)
- **auth_description** (richtext) - How to authenticate
- **auth_example** (code) - Authentication code example
- **security_notes** (richtext) - Security considerations

### Technical Details
- **endpoints** (bloks) - Enhanced endpoint configuration
  - name (text)
  - path (text) 
  - method (option: GET, POST, PUT, DELETE, PATCH)
  - description (text)
  - parameters (bloks) - Request parameters
    - name (text)
    - type (option: string, number, boolean, object, array)
    - required (boolean)
    - description (text)
    - example_value (text)
  - response_example (code) - JSON response example
  - error_responses (bloks) - Common error responses
    - status_code (number)
    - description (text)
    - example (code)

### Developer Experience
- **difficulty** (option: beginner, intermediate, advanced)
- **pricing** (option: free, freemium, paid)
- **rate_limit** (text) - Rate limiting info
- **sdks** (multilink) - Available SDKs/libraries
- **code_examples** (bloks) - Language-specific examples
  - language (option: javascript, python, php, curl, etc.)
  - title (text)
  - code (code)
  - description (text)

### Categorization & Discovery
- **category** (option: payments, messaging, storage, ai, etc.)
- **tags** (multilink) - Searchable tags
- **use_cases** (bloks) - Common use cases
  - title (text)
  - description (text)
  - code_example (code)

### Meta Information
- **version** (text) - API version
- **status** (option: stable, beta, deprecated)
- **updated_at** (datetime) - Last update
- **popularity_score** (number) - For ranking
- **community_rating** (number) - User ratings