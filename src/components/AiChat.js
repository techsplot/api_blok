'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Send,
  Code,
  Copy,
  CheckCircle,
  User,
  Bot,
  Rocket,
  Settings,
} from 'lucide-react';

export function AiChat({ onNavigate }) {
  const [messages, setMessages] = useState([]);
  const [apiDoc, setApiDoc] = useState(null); // load from localStorage
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(null);
  const [userProfile, setUserProfile] = useState({ hasAnsweredOnboarding: false });
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0);
  const messagesEndRef = useRef(null);

  // ✅ Load API doc from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('activeDoc');
      if (stored) {
        setApiDoc(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to parse activeDoc:', err);
    }
  }, []);

  const onboardingQuestions = [
    {
      question: `Hi! ${apiDoc?.name || 'there'} 👋 I'm your AI development assistant, ready to help you with APIs. To start, what type of project are you building?`,
      options: [
        'Web Application',
        'Mobile App',
        'Backend/API',
        'E-commerce Store',
        'SaaS Platform',
        'Other',
      ],
    },
    {
      question: "Great! What's your primary tech stack or programming language?",
      options: [
        'JavaScript/Node.js',
        'Python',
        'React/Next.js',
        'PHP',
        'Java',
        'C#/.NET',
        'Ruby',
        'Go',
        'Other',
      ],
    },
    {
      question: 'How would you describe your API integration experience?',
      options: [
        'Beginner - New to APIs',
        'Intermediate - Some experience',
        'Advanced - Very experienced',
      ],
    },
    {
      question: "Finally, what's your main goal today?",
      options: [
        'Understand API docs',
        'Get help with integration',
        'Debug existing code',
        'Build from scratch',
        'Learn best practices',
      ],
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  // ✅ Initial welcome message
  useEffect(() => {
    if (!apiDoc) return;

    const initialMessageContent = `I see you're looking at the **${apiDoc.name}** documentation. I'm ready to answer any questions you have about it.\n\nBut first, let's personalize your experience.`;

    const welcomeMessage = {
      id: Date.now().toString(),
      content: `${initialMessageContent}\n\n${onboardingQuestions[0].question}`,
      isUser: false,
      timestamp: new Date(),
      type: 'onboarding',
    };
    setMessages([welcomeMessage]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiDoc]);

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
      id: (Date.now() + 1).toString(),
      content: answer,
      isUser: true,
      timestamp: new Date(),
      type: 'onboarding',
    };
    setMessages((prev) => [...prev, userMessage]);

    const updatedProfileFields = {};
    switch (currentOnboardingStep) {
      case 0:
        updatedProfileFields.projectType = answer;
        break;
      case 1:
        updatedProfileFields.techStack = [answer];
        break;
      case 2:
        updatedProfileFields.experience = answer;
        break;
      case 3:
        updatedProfileFields.currentGoal = answer;
        break;
    }
    setUserProfile((prev) => ({ ...prev, ...updatedProfileFields }));

    setIsTyping(true);
    setTimeout(() => {
      if (currentOnboardingStep < onboardingQuestions.length - 1) {
        const nextStep = currentOnboardingStep + 1;
        setCurrentOnboardingStep(nextStep);
        const nextMessage = {
          id: Date.now().toString(),
          content: onboardingQuestions[nextStep].question,
          isUser: false,
          timestamp: new Date(),
          type: 'onboarding',
        };
        setMessages((prev) => [...prev, nextMessage]);
        setIsTyping(false);
      } else {
        setUserProfile((prev) => {
          const finalProfile = {
            ...prev,
            ...updatedProfileFields,
            hasAnsweredOnboarding: true,
          };
          const personalizedWelcome = generatePersonalizedWelcome(finalProfile);
          const nextMessage = {
            id: Date.now().toString(),
            content: personalizedWelcome,
            isUser: false,
            timestamp: new Date(),
            type: 'guidance',
          };
          setMessages((prevMsgs) => [...prevMsgs, nextMessage]);
          setIsTyping(false);
          return finalProfile;
        });
      }
    }, 1200);
  };

  const generatePersonalizedWelcome = (profile) => {
    return `Perfect! I'm now set up to help with your **${profile.projectType}** using **${profile.techStack?.[0]}**. I'll tailor my answers to your **${profile.experience}** level.\n\nHow can I help you with the **${
      apiDoc?.name || 'API'
    }** documentation? Feel free to ask anything!`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !apiDoc) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // 🔑 Ask Gemini to decline if not relevant
      const docString = JSON.stringify(apiDoc, null, 2);
      const prompt = `
You are an AI that answers ONLY questions directly related to the following API documentation.
If the user's question is NOT related to this API, respond with EXACTLY: "__NOT_RELEVANT__".

API DOCUMENTATION:
\`\`\`json
${docString}
\`\`\`

USER QUESTION:
${currentInput}
      `;

      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getChatResponse',
          prompt,
          userProfile,
        }),
      });

      if (!chatResponse.ok) throw new Error('Chat response failed');
      const { response: aiTextResponse } = await chatResponse.json();

      // 🚫 If not relevant
      if (aiTextResponse.includes('__NOT_RELEVANT__')) {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          content: `I'm sorry, but my expertise is focused on the **${apiDoc.name}** documentation. Could you please ask a question related to its features, endpoints, or usage?`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
        return;
      }

      // ✅ Otherwise show answer
      const hasCode = aiTextResponse.includes('```');
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: aiTextResponse,
        isUser: false,
        timestamp: new Date(),
        hasCode: hasCode,
        codeExample: hasCode
          ? aiTextResponse.split('```')[1]?.split('\n').slice(1).join('\n').trim()
          : undefined,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to fetch from /api/chat:', error);
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isOnboarding = !userProfile.hasAnsweredOnboarding;

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('search')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-medium">AI Development Assistant</h1>
              <p className="text-sm text-gray-600">
                {apiDoc ? `Context: ${apiDoc.name}` : 'Loading...'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 bg-green-400 rounded-full animate-pulse"
              title="AI is online"
            ></div>
            <Bot className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Chat body */}
      <div className="flex-1 overflow-y-auto px-6 py-8 bg-gray-50/50">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex gap-3 max-w-3xl ${
                  message.isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isUser
                      ? 'bg-gradient-to-r from-[#4FACFE] to-[#00F2FE]'
                      : 'bg-gray-200'
                  }`}
                >
                  {message.isUser ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-700" />
                  )}
                </div>
                <div
                  className={`rounded-xl px-4 py-3 shadow-sm ${
                    message.isUser
                      ? 'bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white'
                      : 'bg-white text-gray-900'
                  }`}
                >
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: message.content
                        .replace(/```(.*?)\n([\s\S]*?)```/gs, (match, lang, code) => {
                          const safeCode = code
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;');
                          return `<pre class="bg-gray-800 text-white p-3 rounded-md my-2 overflow-x-auto"><code>${safeCode}</code></pre>`;
                        })
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br />'),
                    }}
                  ></div>

                  {message.hasCode && message.codeExample && (
                    <div className="mt-4 bg-gray-900 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-300">Code Snippet</span>
                        </div>
                        <button
                          onClick={() =>
                            handleCopy(message.codeExample || '', message.id)
                          }
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
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-gray-700" />
                </div>
                <div className="bg-white rounded-xl px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Onboarding options */}
      {isOnboarding && apiDoc && (
        <div className="px-6 pb-4 pt-2 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {onboardingQuestions[currentOnboardingStep].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOnboardingResponse(option)}
                  className="p-3 bg-white border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-800 rounded-lg transition-all text-left text-sm"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Suggested prompts */}
      {!isOnboarding && messages.length < 5 && apiDoc && (
        <div className="px-6 pb-4 pt-2 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-500 mb-2">
              Here are some ideas for your {userProfile.projectType}:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              <button
                onClick={() =>
                  setInputValue(`How do I handle authentication with the ${apiDoc?.name}?`)
                }
                className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-sm transition-colors"
              >
                <Settings className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>Authentication Setup</span>
              </button>
              <button
                onClick={() =>
                  setInputValue(
                    `Give me a code example for a basic charge using ${apiDoc?.name}.`
                  )
                }
                className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-sm transition-colors"
              >
                <Rocket className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Core Integration Example</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input box */}
      <div className="border-t border-gray-200 px-6 py-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  isOnboarding
                    ? 'Select an option above to continue...'
                    : `Ask about ${apiDoc?.name || 'the API'}...`
                }
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isOnboarding || isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isOnboarding || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
