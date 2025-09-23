import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, Volume2, Code, Copy, CheckCircle, User, Bot, Lightbulb, Rocket, Settings } from 'lucide-react';

export function AiChat({ onNavigate }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(null);
  const [userProfile, setUserProfile] = useState({ hasAnsweredOnboarding: false });
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0);
  const messagesEndRef = useRef(null);

  const onboardingQuestions = [
    {
      question: "Hi! I'm your AI development assistant. I'm here to help you understand, integrate, and build with APIs from start to finish. Let's start by getting to know your project better.\n\nWhat type of project are you working on?",
      options: ["Web Application", "Mobile App", "Backend/API", "E-commerce Store", "SaaS Platform", "Other"]
    },
    {
      question: "Great! What's your primary tech stack or programming language?",
      options: ["JavaScript/Node.js", "Python", "React/Next.js", "PHP", "Java", "C#/.NET", "Ruby", "Go", "Other"]
    },
    {
      question: "How would you describe your API integration experience?",
      options: ["Beginner - New to APIs", "Intermediate - Some experience", "Advanced - Very experienced", "Expert - I build APIs"]
    },
    {
      question: "What's your main goal today?",
      options: ["Find the right API", "Understand API documentation", "Get help with integration", "Debug existing code", "Build from scratch", "Learn best practices"]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        const welcomeMessage = {
          id: Date.now().toString(),
          content: onboardingQuestions[0].question,
          isUser: false,
          timestamp: new Date(),
          type: 'onboarding'
        };
        setMessages([welcomeMessage]);
      }, 500);
    }
  }, []);

  const handleCopy = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(messageId);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleOnboardingResponse = (answer) => {
    const userMessage = {
      id: Date.now().toString(),
      content: answer,
      isUser: true,
      timestamp: new Date(),
      type: 'onboarding'
    };
    setMessages(prev => [...prev, userMessage]);
    const newProfile = { ...userProfile };
    switch (currentOnboardingStep) {
      case 0:
        newProfile.projectType = answer;
        break;
      case 1:
        newProfile.techStack = [answer];
        break;
      case 2:
        newProfile.experience = answer;
        break;
      case 3:
        newProfile.currentGoal = answer;
        break;
    }
    setIsTyping(true);
    setTimeout(() => {
      let nextMessage;
      if (currentOnboardingStep < onboardingQuestions.length - 1) {
        const nextStep = currentOnboardingStep + 1;
        setCurrentOnboardingStep(nextStep);
        nextMessage = {
          id: Date.now().toString(),
          content: onboardingQuestions[nextStep].question,
          isUser: false,
          timestamp: new Date(),
          type: 'onboarding'
        };
      } else {
        newProfile.hasAnsweredOnboarding = true;
        setUserProfile(newProfile);
        const personalizedWelcome = generatePersonalizedWelcome(newProfile);
        nextMessage = {
          id: Date.now().toString(),
          content: personalizedWelcome,
          isUser: false,
          timestamp: new Date(),
          type: 'guidance'
        };
      }
      setMessages(prev => [...prev, nextMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generatePersonalizedWelcome = (profile) => {
    const projectType = profile.projectType?.toLowerCase() || 'project';
    const techStack = profile.techStack?.[0] || 'your tech stack';
    const experience = profile.experience?.toLowerCase() || 'your level';
    const goal = profile.currentGoal?.toLowerCase() || 'your goals';
    return `Perfect! Now I understand your ${projectType} project using ${techStack}. Based on your ${experience} experience level and your goal to ${goal}, I'm ready to provide you with personalized assistance.\n\nHere's how I can help you:\n\n🎯 **Smart API Recommendations** - I'll suggest APIs that fit your ${projectType} and ${techStack} setup\n📚 **Contextual Documentation** - I'll explain API docs in terms that match your experience level\n🔧 **Custom Code Examples** - All code examples will be tailored to ${techStack}\n🚀 **Step-by-Step Guidance** - From API discovery to production deployment\n🐛 **Debug & Troubleshoot** - Help you solve integration issues quickly\n📖 **Best Practices** - Share industry standards for your specific stack\n\nWhat would you like to start with? I can help you find the right API, understand documentation, write integration code, or anything else related to your project!`;
  };

  const generateContextualResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    const { projectType, techStack, experience, currentGoal } = userProfile;
    const primaryTech = techStack?.[0] || 'JavaScript';
    // Payment-related queries
    if (lowerMessage.includes('payment') || lowerMessage.includes('stripe') || lowerMessage.includes('billing')) {
      const experienceLevel = experience?.includes('Beginner') ? 'beginner' : 
                             experience?.includes('Intermediate') ? 'intermediate' : 'advanced';
      let responseContent = `Great choice! For ${projectType} projects, Stripe is the gold standard for payments. Given your ${experience} level with ${primaryTech}, here's what I recommend:\n\n`;
      if (experienceLevel === 'beginner') {
        responseContent += `**Getting Started:**\n1. Create a Stripe account and get your API keys\n2. Install the Stripe SDK for ${primaryTech}\n3. Start with a simple payment form\n\n`;
      }
      responseContent += `Here's a ${primaryTech}-specific example for your ${projectType}:`;
      let codeExample = '';
      if (primaryTech.includes('JavaScript') || primaryTech.includes('Node')) {
        codeExample = `// Install: npm install stripe\nconst stripe = require('stripe')(\'sk_test_...\');\n// Create a payment intent\nconst paymentIntent = await stripe.paymentIntents.create({\n  amount: 2000, // $20.00\n  currency: 'usd',\n  payment_method_types: ['card'],\n  metadata: {\n    project_type: '${projectType}',\n    integration_id: 'your_project_id'\n  }\n});\n\nconsole.log('Payment intent created:', paymentIntent.client_secret);`;
      } else if (primaryTech.includes('Python')) {
        codeExample = `# Install: pip install stripe\nimport stripe\n\nstripe.api_key = \"sk_test_...\"\n\n# Create a payment intent\npayment_intent = stripe.PaymentIntent.create(\n    amount=2000,  # $20.00\n    currency='usd',\n    payment_method_types=['card'],\n    metadata={\n        'project_type': '${projectType}',\n        'integration_id': 'your_project_id'\n    }\n)\n\nprint(f\"Payment intent created: {payment_intent.client_secret}\")`;
      } else {
        codeExample = `// Generic REST API call for ${primaryTech}\nPOST https://api.stripe.com/v1/payment_intents\nAuthorization: Bearer sk_test_...\nContent-Type: application/x-www-form-urlencoded\n\namount=2000&currency=usd&payment_method_types[]=card`;
      }
      return {
        id: Date.now().toString(),
        content: responseContent,
        isUser: false,
        timestamp: new Date(),
        hasCode: true,
        codeExample,
        type: 'guidance'
      };
    }
    // Authentication queries
    if (lowerMessage.includes('auth') || lowerMessage.includes('login') || lowerMessage.includes('user')) {
      let responseContent = `For ${projectType} authentication with ${primaryTech}, I recommend these options based on your needs:\n\n`;
      if (projectType?.includes('Web') || projectType?.includes('SaaS')) {
        responseContent += `**Auth0** - Perfect for ${projectType}, handles everything\n**Firebase Auth** - Great for rapid development\n**Supabase Auth** - Open-source alternative\n\n`;
      }
      responseContent += `Here's a ${primaryTech} implementation:`;
      const codeExample = primaryTech.includes('React') ? 
        `// Firebase Auth with React\nimport { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';\nimport { auth } from './firebase-config';\n\nconst signIn = async (email, password) => {\n  try {\n    const userCredential = await signInWithEmailAndPassword(auth, email, password);\n    console.log('User signed in:', userCredential.user.uid);\n    // Perfect for your ${projectType} project\n  } catch (error) {\n    console.error('Sign in error:', error.message);\n  }\n};` :
        `// Authentication example for ${primaryTech}\n// This code is optimized for your ${projectType} project\nconst authenticate = async (email, password) => {\n  const response = await fetch('/api/auth/login', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ email, password })\n  });\n  \n  if (response.ok) {\n    const { token } = await response.json();\n    localStorage.setItem('authToken', token);\n    return token;\n  }\n  throw new Error('Authentication failed');\n};`;
      return {
        id: Date.now().toString(),
        content: responseContent,
        isUser: false,
        timestamp: new Date(),
        hasCode: true,
        codeExample,
        type: 'guidance'
      };
    }
    // Help with integration
    if (lowerMessage.includes('integrate') || lowerMessage.includes('implement') || lowerMessage.includes('build')) {
      return {
        id: Date.now().toString(),
        content: `Perfect! Let's build this step by step for your ${projectType} using ${primaryTech}. Based on your ${experience} level, here's my recommended approach:\n\n**Phase 1: Setup & Planning**\n• Environment setup for ${primaryTech}\n• API key management and security\n• Project structure best practices\n\n**Phase 2: Core Integration**\n• API client setup\n• Authentication handling\n• Error handling and retries\n\n**Phase 3: Testing & Deployment**\n• Testing strategies for your ${projectType}\n• Production deployment checklist\n• Monitoring and logging\n\nWhich phase would you like to dive into first? Or do you have a specific API you'd like to integrate?`,
        isUser: false,
        timestamp: new Date(),
        type: 'guidance'
      };
    }
    // Default contextual response
    return {
      id: Date.now().toString(),
      content: `I'd love to help you with that! Given your ${projectType} project using ${primaryTech} and your goal to ${currentGoal}, I can provide specific guidance.\n\nCould you tell me more about:\n• Which specific API you're interested in?\n• What functionality you're trying to implement?\n• Any challenges you're currently facing?\n\nThe more context you give me, the better I can tailor my assistance to your ${experience} level and ${primaryTech} setup.`,
      isUser: false,
      timestamp: new Date(),
      type: 'message'
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = userProfile.hasAnsweredOnboarding 
        ? generateContextualResponse(inputValue)
        : generateContextualResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isOnboarding = !userProfile.hasAnsweredOnboarding && currentOnboardingStep < onboardingQuestions.length;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-medium">AI Development Assistant</h1>
              <p className="text-gray-600">
                {userProfile.hasAnsweredOnboarding 
                  ? `Helping with your ${userProfile.projectType} using ${userProfile.techStack?.[0]}`
                  : "Getting to know your project"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="AI is online"></div>
            {userProfile.hasAnsweredOnboarding && (
              <Bot className="w-6 h-6 text-blue-500" />
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-3xl ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isUser 
                    ? 'bg-gradient-to-r from-[#4FACFE] to-[#00F2FE]' 
                    : 'bg-gray-100'
                }`}>
                  {message.isUser ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`rounded-lg px-4 py-3 ${
                    message.isUser
                      ? 'bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white'
                      : 'bg-gray-50 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.hasCode && message.codeExample && (
                    <div className="mt-4 bg-gray-900 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">Code Example</span>
                        </div>
                        <button
                          onClick={() => handleCopy(message.codeExample, message.id)}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                          {copied === message.id ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
                        <code>{message.codeExample}</code>
                      </pre>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    {!message.isUser && (
                      <button className="p-1 opacity-70 hover:opacity-100 transition-opacity">
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-gray-50 rounded-lg px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Onboarding Options */}
      {isOnboarding && currentOnboardingStep < onboardingQuestions.length && (
        <div className="px-6 pb-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {onboardingQuestions[currentOnboardingStep].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOnboardingResponse(option)}
                  className="p-3 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white rounded-lg hover:opacity-90 transition-opacity text-left"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions for Post-Onboarding */}
      {userProfile.hasAnsweredOnboarding && messages.length <= 2 && (
        <div className="px-6 pb-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-500 mb-3">Quick actions for your {userProfile.projectType}:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setInputValue("Show me payment integration options")}
                className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
              >
                <Rocket className="w-4 h-4 text-blue-600" />
                <span>Payment Integration</span>
              </button>
              <button
                onClick={() => setInputValue("Help me set up authentication")}
                className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors"
              >
                <Settings className="w-4 h-4 text-green-600" />
                <span>Authentication Setup</span>
              </button>
              <button
                onClick={() => setInputValue("I need help with API documentation")}
                className="flex items-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors"
              >
                <Lightbulb className="w-4 h-4 text-purple-600" />
                <span>Understand Documentation</span>
              </button>
              <button
                onClick={() => setInputValue("Guide me through the integration process")}
                className="flex items-center gap-2 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors"
              >
                <Code className="w-4 h-4 text-orange-600" />
                <span>Step-by-Step Integration</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-4">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isOnboarding 
                  ? "Or type your own answer..." 
                  : "Ask me anything about your project, APIs, or integration help..."}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isOnboarding}
              />
            </div>
            <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isOnboarding}
              className="p-3 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
