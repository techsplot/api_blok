'use client';'use client';'use client';



import React, { useState, useRef, useEffect } from 'react';

import { ArrowLeft, Send, Code, Copy, CheckCircle, User, Bot, Settings, Rocket } from 'lucide-react';

import React, { useState, useRef, useEffect } from 'react';import React, { useState, useRef, useEffect } from 'react';

export function AiChat({ onNavigate, apiDoc }) {

  const [messages, setMessages] = useState([]);import { ArrowLeft, Send, Mic, Volume2, Code, Copy, CheckCircle, User, Bot, Lightbulb, Rocket, Settings, Home, X } from 'lucide-react';import { ArrowLeft, Send, Mic, Volume2, Code, Copy, CheckCircle, User, Bot, Lightbulb, Rocket, Settings, Home, X } from 'lucide-react';

  const [inputValue, setInputValue] = useState('');

  const [isTyping, setIsTyping] = useState(false);

  const [copied, setCopied] = useState(null);

  const [userProfile, setUserProfile] = useState({ hasAnsweredOnboarding: false });export function AiChat({ onNavigate, apiDoc }) {export function AiChat({ onNavigate, apiDoc }) {

  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0);

  const messagesEndRef = useRef(null);  const [messages, setMessages] = useState([]);  const [messages, setMessages] = useState([]);



  const onboardingQuestions = [  const [inputValue, setInputValue] = useState('');  const [inputValue, setInputValue] = useState('');

    { question: "Hi! I'm your AI development assistant, ready to help you with APIs. To start, what type of project are you building?", options: ["Web Application", "Mobile App", "Backend/API", "E-commerce Store", "SaaS Platform", "Other"] },

    { question: "Great! What's your primary tech stack or programming language?", options: ["JavaScript/Node.js", "Python", "React/Next.js", "PHP", "Java", "C#/.NET", "Ruby", "Go", "Other"] },  const [isTyping, setIsTyping] = useState(false);  const [isTyping, setIsTyping] = useState(false);

    { question: "How would you describe your API integration experience?", options: ["Beginner - New to APIs", "Intermediate - Some experience", "Advanced - Very experienced"] },

    { question: "Finally, what's your main goal today?", options: ["Understand API docs", "Get help with integration", "Debug existing code", "Build from scratch", "Learn best practices"] }  const [copied, setCopied] = useState(null);  const [copied, setCopied] = useState(null);

  ];

  const [userProfile, setUserProfile] = useState({ hasAnsweredOnboarding: false });  const [userProfile, setUserProfile] = useState({ hasAnsweredOnboarding: false });

  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0);  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0);

  };

  const [navigationHistory, setNavigationHistory] = useState([]);  const [navigationHistory, setNavigationHistory] = useState([]);

  useEffect(scrollToBottom, [messages]);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {

    if (messages.length === 0) {  const [apiContext, setApiContext] = useState(null);  const [apiContext, setApiContext] = useState(null);

      setTimeout(() => {

        let welcomeMessage;  const messagesEndRef = useRef(null);  const messagesEndRef = useRef(null);

        if (apiDoc) {

          welcomeMessage = {

            id: Date.now().toString(),

            content: `I see you're looking at the **${apiDoc.name}** documentation. I'm ready to answer any questions you have about it.\n\nBut first, let's personalize your experience.\n\n${onboardingQuestions[0].question}`,  const onboardingQuestions = [  const onboardingQuestions = [

            isUser: false,

            timestamp: new Date(),    { question: "Hi! I'm your AI development assistant, ready to help you with APIs. To start, what type of project are you building?", options: ["Web Application", "Mobile App", "Backend/API", "E-commerce Store", "SaaS Platform", "Other"] },    { question: "Hi! I'm your AI development assistant, ready to help you with APIs. To start, what type of project are you building?", options: ["Web Application", "Mobile App", "Backend/API", "E-commerce Store", "SaaS Platform", "Other"] },

            type: 'onboarding'

          };    { question: "Great! What's your primary tech stack or programming language?", options: ["JavaScript/Node.js", "Python", "React/Next.js", "PHP", "Java", "C#/.NET", "Ruby", "Go", "Other"] },    { question: "Great! What's your primary tech stack or programming language?", options: ["JavaScript/Node.js", "Python", "React/Next.js", "PHP", "Java", "C#/.NET", "Ruby", "Go", "Other"] },

        } else {

          welcomeMessage = {    { question: "How would you describe your API integration experience?", options: ["Beginner - New to APIs", "Intermediate - Some experience", "Advanced - Very experienced"] },    { question: "How would you describe your API integration experience?", options: ["Beginner - New to APIs", "Intermediate - Some experience", "Advanced - Very experienced"] },

            id: Date.now().toString(),

            content: onboardingQuestions[0].question,    { question: "Finally, what's your main goal today?", options: ["Understand API docs", "Get help with integration", "Debug existing code", "Build from scratch", "Learn best practices"] }    { question: "Finally, what's your main goal today?", options: ["Understand API docs", "Get help with integration", "Debug existing code", "Build from scratch", "Learn best practices"] }

            isUser: false,

            timestamp: new Date(),  ];  ];

            type: 'onboarding'

          };

        }

        setMessages([welcomeMessage]);  const scrollToBottom = () => {  const scrollToBottom = () => {

      }, 500);

    }    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  }, []);

  };  };

  const handleCopy = async (text, messageId) => {

    try {

      await navigator.clipboard.writeText(text);

      setCopied(messageId);  useEffect(scrollToBottom, [messages]);  useEffect(scrollToBottom, [messages]);

      setTimeout(() => setCopied(null), 2000);

    } catch (err) {

      console.error('Failed to copy:', err);

    }  // Load API context if coming from API details  // Load API context if coming from API details

  };

  useEffect(() => {  useEffect(() => {

  const handleOnboardingResponse = (answer) => {

    const userMessage = { id: (Date.now() + 1).toString(), content: answer, isUser: true, timestamp: new Date(), type: 'onboarding' };    if (typeof window !== 'undefined') {    if (typeof window !== 'undefined') {

    setMessages(prev => [...prev, userMessage]);

          const contextData = sessionStorage.getItem('chatApiContext');      const contextData = sessionStorage.getItem('chatApiContext');

    const updatedProfileFields = {};

    switch (currentOnboardingStep) {      if (contextData) {      if (contextData) {

      case 0:

        updatedProfileFields.projectType = answer;        try {        try {

        break;

      case 1:          const context = JSON.parse(contextData);          const context = JSON.parse(contextData);

        updatedProfileFields.techStack = [answer];

        break;          // Check if context is recent (within 5 minutes)          // Check if context is recent (within 5 minutes)

      case 2:

        updatedProfileFields.experience = answer;          if (Date.now() - context.timestamp < 5 * 60 * 1000) {          if (Date.now() - context.timestamp < 5 * 60 * 1000) {

        break;

      case 3:            setApiContext(context);            setApiContext(context);

        updatedProfileFields.currentGoal = answer;

        break;            // Skip onboarding and set up profile based on API            // Skip onboarding and set up profile based on API

    }

                setUserProfile({            setUserProfile({

    setUserProfile(prev => ({ ...prev, ...updatedProfileFields }));

                  hasAnsweredOnboarding: true,              hasAnsweredOnboarding: true,

    setIsTyping(true);

    setTimeout(() => {              projectType: 'API Integration',              projectType: 'API Integration',

      if (currentOnboardingStep < onboardingQuestions.length - 1) {

        const nextStep = currentOnboardingStep + 1;              techStack: ['JavaScript'],              techStack: ['JavaScript'],

        setCurrentOnboardingStep(nextStep);

        const nextMessage = { id: Date.now().toString(), content: onboardingQuestions[nextStep].question, isUser: false, timestamp: new Date(), type: 'onboarding' };              experience: 'Intermediate',              experience: 'Intermediate',

        setMessages(prev => [...prev, nextMessage]);

        setIsTyping(false);              currentGoal: `Integrate ${context.api.name} API`,              currentGoal: `Integrate ${context.api.name} API`,

      } else {

        setUserProfile(prev => {              apiContext: context.api              apiContext: context.api

          const finalProfile = { ...prev, ...updatedProfileFields, hasAnsweredOnboarding: true };

          const personalizedWelcome = `Perfect! I'm now set up to help with your **${finalProfile.projectType}** using **${finalProfile.techStack?.[0]}**. I'll tailor my answers to your **${finalProfile.experience}** level.\n\nHow can I help you with the **${apiDoc?.name || 'API'}** documentation? Feel free to ask anything!`;            });            });

          const nextMessage = { id: Date.now().toString(), content: personalizedWelcome, isUser: false, timestamp: new Date(), type: 'guidance' };

          setMessages(prevMsgs => [...prevMsgs, nextMessage]);          } else {          } else {

          setIsTyping(false);

          return finalProfile;            // Remove expired context            // Remove expired context

        });

      }            sessionStorage.removeItem('chatApiContext');            sessionStorage.removeItem('chatApiContext');

    }, 1200);

  };            sessionStorage.removeItem('navigationIntent');            sessionStorage.removeItem('navigationIntent');



  const handleSendMessage = async () => {          }          }

    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now().toString(), content: inputValue, isUser: true, timestamp: new Date() };        } catch (err) {        } catch (err) {

    setMessages(prev => [...prev, userMessage]);

    const currentInput = inputValue;          console.warn('Failed to parse API context:', err);          console.warn('Failed to parse API context:', err);

    setInputValue('');

    setIsTyping(true);          sessionStorage.removeItem('chatApiContext');          sessionStorage.removeItem('chatApiContext');



    try {          sessionStorage.removeItem('navigationIntent');          sessionStorage.removeItem('navigationIntent');

      const relevanceResponse = await fetch('/api/chat', {

        method: 'POST',        }        }

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ action: 'checkRelevance', question: currentInput, apiDoc: apiDoc })      }      }

      });

    }    }

      if (!relevanceResponse.ok) throw new Error('Relevance check failed');

      const { relevant } = await relevanceResponse.json();  }, []);  }, []);



      if (!relevant) {

        const aiResponse = {

          id: (Date.now() + 1).toString(),  useEffect(() => {  useEffect(() => {

          content: `I'm sorry, but my expertise is focused on the **${apiDoc?.name || 'API'}** documentation. Could you please ask a question related to its features, endpoints, or usage?`,

          isUser: false,    if (messages.length === 0) {    if (messages.length === 0) {

          timestamp: new Date(),

        };      setTimeout(() => {      setTimeout(() => {

        setMessages(prev => [...prev, aiResponse]);

        setIsTyping(false);        let welcomeMessage;        let welcomeMessage;

        return;

      }        if (apiContext) {        if (apiContext) {



      let prompt = currentInput;          // Context-aware welcome message for specific API          // Context-aware welcome message for specific API

      if (apiDoc) {

        const docString = JSON.stringify(apiDoc, null, 2);          welcomeMessage = {          welcomeMessage = {

        prompt = `CONTEXT: I am a developer reviewing the following API documentation. Please answer my question based on this context and my user profile.\n\n---\n\nAPI DOCUMENTATION:\n\`\`\`json\n${docString}\n\`\`\`\n\n---\n\nMY QUESTION:\n${currentInput}`;

      }            id: Date.now().toString(),            id: Date.now().toString(),



      const chatResponse = await fetch('/api/chat', {            content: `Hi! I'm here to help you with the **${apiContext.api.name}** API. I can assist you with:\n\n🔧 **Integration guidance** - Step-by-step implementation\n📚 **Documentation explanation** - Breaking down complex concepts\n💻 **Code examples** - Custom code for your use case\n🐛 **Troubleshooting** - Debug integration issues\n🚀 **Best practices** - Production-ready implementations\n\nWhat would you like to know about ${apiContext.api.name}?`,            content: `Hi! I'm here to help you with the **${apiContext.api.name}** API. I can assist you with:\n\n🔧 **Integration guidance** - Step-by-step implementation\n📚 **Documentation explanation** - Breaking down complex concepts\n💻 **Code examples** - Custom code for your use case\n🐛 **Troubleshooting** - Debug integration issues\n🚀 **Best practices** - Production-ready implementations\n\nWhat would you like to know about ${apiContext.api.name}?`,

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },            isUser: false,            isUser: false,

        body: JSON.stringify({ action: 'getChatResponse', prompt: prompt, userProfile: userProfile })

      });            timestamp: new Date(),            timestamp: new Date(),



      if (!chatResponse.ok) throw new Error('Chat response failed');            type: 'api-context'            type: 'api-context'

      const { response: aiTextResponse } = await chatResponse.json();

          };          };

      const hasCode = aiTextResponse.includes('```');

      const aiResponse = {        } else if (apiDoc) {        } else if (apiDoc) {

        id: (Date.now() + 1).toString(),

        content: aiTextResponse,          // API doc context          // API doc context

        isUser: false,

        timestamp: new Date(),          welcomeMessage = {          welcomeMessage = {

        hasCode: hasCode,

        codeExample: hasCode ? aiTextResponse.split('```')[1]?.split('\n').slice(1).join('\n').trim() : undefined            id: Date.now().toString(),            id: Date.now().toString(),

      };

      setMessages(prev => [...prev, aiResponse]);            content: `I see you're looking at the **${apiDoc.name}** documentation. I'm ready to answer any questions you have about it.\n\nBut first, let's personalize your experience.\n\n${onboardingQuestions[0].question}`,            content: `I see you're looking at the **${apiDoc.name}** documentation. I'm ready to answer any questions you have about it.\n\nBut first, let's personalize your experience.\n\n${onboardingQuestions[0].question}`,

    } catch (error) {

      console.error("Failed to fetch from /api/chat:", error);            isUser: false,            isUser: false,

      const errorResponse = {

        id: (Date.now() + 1).toString(),            timestamp: new Date(),            timestamp: new Date(),

        content: "Sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.",

        isUser: false,            type: 'onboarding'            type: 'onboarding'

        timestamp: new Date(),

      };          };          };

      setMessages(prev => [...prev, errorResponse]);

    } finally {        } else {        } else {

      setIsTyping(false);

    }          // Default onboarding message          // Default onboarding message

  };

            welcomeMessage = {          welcomeMessage = {

  const handleKeyPress = (e) => {

    if (e.key === 'Enter' && !e.shiftKey) {            id: Date.now().toString(),            id: Date.now().toString(),

      e.preventDefault();

      handleSendMessage();            content: onboardingQuestions[0].question,            content: onboardingQuestions[0].question,

    }

  };            isUser: false,            isUser: false,



  const isOnboarding = !userProfile.hasAnsweredOnboarding;            timestamp: new Date(),            timestamp: new Date(),



  return (            type: 'onboarding'            type: 'onboarding'

    <div className="h-screen bg-white flex flex-col">

      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">          };          };

        <div className="max-w-4xl mx-auto flex items-center justify-between">

          <div className="flex items-center gap-4">        }        }

            <button

              onClick={() => onNavigate('search')}        setMessages([welcomeMessage]);        setMessages([welcomeMessage]);

              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"

            >      }, 500);      }, 500);

              <ArrowLeft className="w-5 h-5" />

            </button>    }    }

            <div>

              <h1 className="text-xl font-medium">AI Development Assistant</h1>  }, []);  }, []);

              <p className="text-sm text-gray-600">

                {apiDoc ? `Context: ${apiDoc.name}` : 'Ready to help'}

              </p>

            </div>  // Define variables before using them in useEffect dependencies  // Define variables before using them in useEffect dependencies

          </div>

          <div className="flex items-center gap-3">  const isOnboarding = !userProfile.hasAnsweredOnboarding && currentOnboardingStep < onboardingQuestions.length;  const isOnboarding = !userProfile.hasAnsweredOnboarding && currentOnboardingStep < onboardingQuestions.length;

            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="AI is online"></div>

            <Bot className="w-6 h-6 text-blue-500" />  const canGoBack = isOnboarding && (currentOnboardingStep > 0 || navigationHistory.length > 0);  const canGoBack = isOnboarding && (currentOnboardingStep > 0 || navigationHistory.length > 0);

          </div>

        </div>

      </div>

  // Add keyboard navigation  // Add keyboard navigation

      <div className="flex-1 overflow-y-auto px-6 py-8 bg-gray-50/50">

        <div className="max-w-4xl mx-auto space-y-6">  useEffect(() => {  useEffect(() => {

          {messages.map((message) => (

            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>    const handleKeyDown = (e) => {    const handleKeyDown = (e) => {

              <div className={`flex gap-3 max-w-3xl ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.isUser ? 'bg-gradient-to-r from-[#4FACFE] to-[#00F2FE]' : 'bg-gray-200'}`}>      // Escape key to cancel/go home      // Escape key to cancel/go home

                  {message.isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-gray-700" />}

                </div>      if (e.key === 'Escape') {      if (e.key === 'Escape') {

                <div className={`rounded-xl px-4 py-3 shadow-sm ${message.isUser ? 'bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white' : 'bg-white text-gray-900'}`}>

                  <div        handleCancelToHome();        handleCancelToHome();

                    className="prose prose-sm max-w-none"

                    dangerouslySetInnerHTML={{      }      }

                      __html: message.content

                        .replace(/```(.*?)\n([\s\S]*?)```/gs, (match, lang, code) => {      // Alt + Left Arrow to go back      // Alt + Left Arrow to go back

                          const safeCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

                          return `<pre class="bg-gray-800 text-white p-3 rounded-md my-2 overflow-x-auto"><code>${safeCode}</code></pre>`;      if (e.altKey && e.key === 'ArrowLeft') {      if (e.altKey && e.key === 'ArrowLeft') {

                        })

                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')        e.preventDefault();        e.preventDefault();

                        .replace(/\n/g, '<br />'),

                    }}        handleBackNavigation();        handleBackNavigation();

                  ></div>

                        }      }

                  {message.hasCode && message.codeExample && (

                    <div className="mt-4 bg-gray-900 rounded-lg overflow-hidden">    };    };

                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">

                        <div className="flex items-center gap-2">

                          <Code className="w-4 h-4 text-gray-400" />

                          <span className="text-sm text-gray-300">Code Snippet</span>    window.addEventListener('keydown', handleKeyDown);    window.addEventListener('keydown', handleKeyDown);

                        </div>

                        <button     return () => window.removeEventListener('keydown', handleKeyDown);    return () => window.removeEventListener('keydown', handleKeyDown);

                          onClick={() => handleCopy(message.codeExample || '', message.id)} 

                          className="p-1 hover:bg-gray-700 rounded transition-colors"  }, [isOnboarding, currentOnboardingStep, navigationHistory]);  }, [isOnboarding, currentOnboardingStep, navigationHistory]);

                        >

                          {copied === message.id ? 

                            <CheckCircle className="w-4 h-4 text-green-400" /> : 

                            <Copy className="w-4 h-4 text-gray-400" />  // Cleanup on unmount  // Cleanup on unmount

                          }

                        </button>  useEffect(() => {  useEffect(() => {

                      </div>

                      <pre className="p-4 text-sm text-gray-100 overflow-x-auto">    return () => {    return () => {

                        <code>{message.codeExample}</code>

                      </pre>      // Only clean up if user is navigating away from chat without using back button      // Only clean up if user is navigating away from chat without using back button

                    </div>

                  )}      if (typeof window !== 'undefined' && !sessionStorage.getItem('chatReturnHandled')) {      if (typeof window !== 'undefined' && !sessionStorage.getItem('chatReturnHandled')) {

                  <div className="flex items-center justify-between mt-2">

                    <span className="text-xs opacity-70">        sessionStorage.removeItem('chatApiContext');        sessionStorage.removeItem('chatApiContext');

                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

                    </span>        sessionStorage.removeItem('navigationIntent');        sessionStorage.removeItem('navigationIntent');

                  </div>

                </div>      }      }

              </div>

            </div>    };    };

          ))}

          {isTyping && (  }, []);  }, []);

            <div className="flex justify-start">

              <div className="flex gap-3">

                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">

                  <Bot className="w-4 h-4 text-gray-700" />  const handleCopy = async (text, messageId) => {  const handleCopy = async (text, messageId) => {

                </div>

                <div className="bg-white rounded-xl px-4 py-3 shadow-sm">    try {    try {

                  <div className="flex space-x-1">

                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>      await navigator.clipboard.writeText(text);      await navigator.clipboard.writeText(text);

                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>

                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>      setCopied(messageId);      setCopied(messageId);

                  </div>

                </div>      setTimeout(() => setCopied(null), 2000);      setTimeout(() => setCopied(null), 2000);

              </div>

            </div>    } catch (err) {    } catch (err) {

          )}

          <div ref={messagesEndRef} />      console.error('Failed to copy:', err);      console.error('Failed to copy:', err);

        </div>

      </div>    }    }



      {isOnboarding && (  };  };

        <div className="px-6 pb-4 pt-2 bg-white border-t border-gray-100">

          <div className="max-w-4xl mx-auto">

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

              {onboardingQuestions[currentOnboardingStep].options.map((option) => (  const handleOnboardingResponse = (answer) => {  const handleOnboardingResponse = (answer) => {

                <button 

                  key={option}     const userMessage = { id: (Date.now() + 1).toString(), content: answer, isUser: true, timestamp: new Date(), type: 'onboarding' };    const userMessage = { id: (Date.now() + 1).toString(), content: answer, isUser: true, timestamp: new Date(), type: 'onboarding' };

                  onClick={() => handleOnboardingResponse(option)} 

                  className="p-3 bg-white border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-800 rounded-lg transition-all text-left text-sm"    setMessages(prev => [...prev, userMessage]);    setMessages(prev => [...prev, userMessage]);

                >

                  {option}        

                </button>

              ))}    // Save current state to navigation history    // Save current state to navigation history

            </div>

          </div>    setNavigationHistory(prev => [...prev, {    setNavigationHistory(prev => [...prev, {

        </div>

      )}      step: currentOnboardingStep,      step: currentOnboardingStep,



      {!isOnboarding && messages.length < 5 && (      messages: [...messages, userMessage],      messages: [...messages, userMessage],

        <div className="px-6 pb-4 pt-2 bg-white border-t border-gray-100">

          <div className="max-w-4xl mx-auto">      userProfile: { ...userProfile }      userProfile: { ...userProfile }

            <p className="text-sm text-gray-500 mb-2">

              Here are some ideas for your {userProfile.projectType}:    }]);    }]);

            </p>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">        

              <button 

                onClick={() => setInputValue(`How do I handle authentication with the ${apiDoc?.name}?`)}     const updatedProfileFields = {};    const updatedProfileFields = {};

                className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-sm transition-colors"

              >    switch (currentOnboardingStep) {    switch (currentOnboardingStep) {

                <Settings className="w-4 h-4 text-green-600 flex-shrink-0" />

                <span>Authentication Setup</span>      case 0:      case 0:

              </button>

              <button         updatedProfileFields.projectType = answer;        updatedProfileFields.projectType = answer;

                onClick={() => setInputValue(`Give me a code example for a basic charge using ${apiDoc?.name}.`)} 

                className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-sm transition-colors"        break;        break;

              >

                <Rocket className="w-4 h-4 text-blue-600 flex-shrink-0" />      case 1:      case 1:

                <span>Core Integration Example</span>

              </button>        updatedProfileFields.techStack = [answer];        updatedProfileFields.techStack = [answer];

            </div>

          </div>        break;        break;

        </div>

      )}      case 2:      case 2:



      <div className="border-t border-gray-200 px-6 py-4 bg-white">        updatedProfileFields.experience = answer;        updatedProfileFields.experience = answer;

        <div className="max-w-4xl mx-auto">

          <div className="flex items-center gap-4">        break;        break;

            <div className="flex-1 relative">

              <textarea      case 3:      case 3:

                value={inputValue}

                onChange={(e) => setInputValue(e.target.value)}        updatedProfileFields.currentGoal = answer;        updatedProfileFields.currentGoal = answer;

                onKeyDown={handleKeyPress}

                placeholder={        break;        break;

                  isOnboarding 

                    ? "Select an option above to continue..."     }    }

                    : `Ask about ${apiDoc?.name || 'the API'}...`

                }        

                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"

                rows={1}    setUserProfile(prev => ({ ...prev, ...updatedProfileFields }));    setUserProfile(prev => ({ ...prev, ...updatedProfileFields }));

                style={{ minHeight: '48px', maxHeight: '120px' }}

                disabled={isOnboarding || isTyping}        

              />

              <button    setIsTyping(true);    setIsTyping(true);

                onClick={handleSendMessage}

                disabled={!inputValue.trim() || isOnboarding || isTyping}    setTimeout(() => {    setTimeout(() => {

                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"

              >      if (currentOnboardingStep < onboardingQuestions.length - 1) {      if (currentOnboardingStep < onboardingQuestions.length - 1) {

                <Send className="w-5 h-5" />

              </button>        const nextStep = currentOnboardingStep + 1;        const nextStep = currentOnboardingStep + 1;

            </div>

          </div>        setCurrentOnboardingStep(nextStep);        setCurrentOnboardingStep(nextStep);

        </div>

      </div>        const nextMessage = { id: Date.now().toString(), content: onboardingQuestions[nextStep].question, isUser: false, timestamp: new Date(), type: 'onboarding' };        const nextMessage = { id: Date.now().toString(), content: onboardingQuestions[nextStep].question, isUser: false, timestamp: new Date(), type: 'onboarding' };

    </div>

  );        setMessages(prev => [...prev, nextMessage]);        setMessages(prev => [...prev, nextMessage]);

}
        setIsTyping(false);        setIsTyping(false);

      } else {      } else {

        // Final step of onboarding        // Final step of onboarding

        setUserProfile(prev => {        setUserProfile(prev => {

          const finalProfile = { ...prev, ...updatedProfileFields, hasAnsweredOnboarding: true };          const finalProfile = { ...prev, ...updatedProfileFields, hasAnsweredOnboarding: true };

          const personalizedWelcome = generatePersonalizedWelcome(finalProfile);          const personalizedWelcome = generatePersonalizedWelcome(finalProfile);

          const nextMessage = { id: Date.now().toString(), content: personalizedWelcome, isUser: false, timestamp: new Date(), type: 'guidance' };          const nextMessage = { id: Date.now().toString(), content: personalizedWelcome, isUser: false, timestamp: new Date(), type: 'guidance' };

          setMessages(prevMsgs => [...prevMsgs, nextMessage]);          setMessages(prevMsgs => [...prevMsgs, nextMessage]);

          setIsTyping(false);          setIsTyping(false);

          return finalProfile;          return finalProfile;

        });        });

      }      }

    }, 1200);    }, 1200);

  };  };



  const generatePersonalizedWelcome = (profile) => {  const generatePersonalizedWelcome = (profile) => {

    return `Perfect! I'm now set up to help with your **${profile.projectType}** using **${profile.techStack?.[0]}**. I'll tailor my answers to your **${profile.experience}** level.\n\nHow can I help you with the **${apiDoc?.name || 'API'}** documentation? Feel free to ask anything!`;    return `Perfect! I'm now set up to help with your **${profile.projectType}** using **${profile.techStack?.[0]}**. I'll tailor my answers to your **${profile.experience}** level.\n\nHow can I help you with the **${apiDoc?.name || 'API'}** documentation? Feel free to ask anything!`;

  };  };



  const handleSendMessage = async () => {<<<<<<< HEAD

    if (!inputValue.trim()) return;  const generateApiSpecificResponse = (userMessage, api) => {

    const userMessage = { id: Date.now().toString(), content: inputValue, isUser: true, timestamp: new Date() };    const lowerMessage = userMessage.toLowerCase();

    setMessages(prev => [...prev, userMessage]);    const apiName = api.name || 'this API';

    const currentInput = inputValue;    const provider = api.provider || 'the provider';

    setInputValue('');    const baseUrl = api.documentation_url || 'https://api.example.com';

    setIsTyping(true);    const endpoint = api.endpoint || '/endpoint';

    const method = api.method || 'GET';

    try {    

      // First, check if the question is relevant via API route    // Authentication questions

      const relevanceResponse = await fetch('/api/chat', {    if (lowerMessage.includes('auth') || lowerMessage.includes('key') || lowerMessage.includes('token')) {

        method: 'POST',      let authCodeExample = undefined;

        headers: { 'Content-Type': 'application/json' },      if (api.authRequired) {

        body: JSON.stringify({ action: 'checkRelevance', question: currentInput, apiDoc: apiDoc })        authCodeExample = `// Using ${apiName} with authentication

      });const response = await fetch('${baseUrl}${endpoint}', {

  method: '${method}',

      if (!relevanceResponse.ok) throw new Error('Relevance check failed');  headers: {

      const { relevant } = await relevanceResponse.json();    'Authorization': 'Bearer YOUR_API_KEY',

    'Content-Type': 'application/json'

      if (!relevant) {  }

        const aiResponse = {});

          id: (Date.now() + 1).toString(),

          content: `I'm sorry, but my expertise is focused on the **${apiDoc?.name || 'API'}** documentation. Could you please ask a question related to its features, endpoints, or usage?`,const data = await response.json();

          isUser: false,console.log(data);`;

          timestamp: new Date(),      }

        };        

        setMessages(prev => [...prev, aiResponse]);      return {

        setIsTyping(false);        id: Date.now().toString(),

        return;        content: `Great question about ${apiName} authentication!

      }

**Authentication Method:** ${api.authRequired ? 'API Key/Token required' : 'No authentication needed'}

      // If relevant, proceed to get a detailed answer

      let prompt = currentInput;${api.authRequired ? `To authenticate with ${apiName}:

      if (apiDoc) {

        const docString = JSON.stringify(apiDoc, null, 2);1. **Get your API key** from ${provider}

        prompt = `CONTEXT: I am a developer reviewing the following API documentation. Please answer my question based on this context and my user profile.\n\n---\n\nAPI DOCUMENTATION:\n\`\`\`json\n${docString}\n\`\`\`\n\n---\n\nMY QUESTION:\n${currentInput}`;2. **Include it in your requests** in the Authorization header

      }3. **Keep it secure** - never expose it in client-side code



      const chatResponse = await fetch('/api/chat', {Here's how to use it:` : `Good news! ${apiName} doesn't require authentication for basic usage.`}`,

        method: 'POST',        isUser: false,

        headers: { 'Content-Type': 'application/json' },        timestamp: new Date(),

        body: JSON.stringify({ action: 'getChatResponse', prompt: prompt, userProfile: userProfile })        hasCode: api.authRequired,

      });        codeExample: authCodeExample,

        type: 'api-specific'

      if (!chatResponse.ok) throw new Error('Chat response failed');      };

      const { response: aiTextResponse } = await chatResponse.json();    }

    

      const hasCode = aiTextResponse.includes('```');    // Integration/implementation questions

      const aiResponse = {    if (lowerMessage.includes('integrate') || lowerMessage.includes('implement') || lowerMessage.includes('use') || lowerMessage.includes('start')) {

        id: (Date.now() + 1).toString(),      const hasEndpoints = api.endpoints && api.endpoints.length > 0;

        content: aiTextResponse,      const mainEndpoint = hasEndpoints ? api.endpoints[0] : { path: endpoint, method: method };

        isUser: false,      const cleanApiName = apiName.toLowerCase().replace(/[^a-z0-9]/g, '');

        timestamp: new Date(),      const cleanMethodName = (mainEndpoint.path || 'getData').replace(/[^a-zA-Z0-9]/g, '');

        hasCode: hasCode,      

        codeExample: hasCode ? aiTextResponse.split('```')[1]?.split('\n').slice(1).join('\n').trim() : undefined      let integrationCode = `// ${apiName} Integration Example

      };const ${cleanApiName}Api = {

      setMessages(prev => [...prev, aiResponse]);  baseUrl: '${baseUrl}',`;

    } catch (error) {  

      console.error("Failed to fetch from /api/chat:", error);      if (api.authRequired) {

      const errorResponse = {        integrationCode += `

        id: (Date.now() + 1).toString(),  apiKey: 'YOUR_API_KEY',`;

        content: "Sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.",      }

        isUser: false,      

        timestamp: new Date(),      integrationCode += `

      };  

      setMessages(prev => [...prev, errorResponse]);  async ${cleanMethodName}() {

    } finally {    const response = await fetch(\`\${this.baseUrl}${mainEndpoint.path || endpoint}\`, {

      setIsTyping(false);      method: '${mainEndpoint.method || method}',

    }      headers: {

  };        'Content-Type': 'application/json'`;

          

  const handleKeyPress = (e) => {      if (api.authRequired) {

    if (e.key === 'Enter' && !e.shiftKey) {        integrationCode += `,

      e.preventDefault();        'Authorization': \`Bearer \${this.apiKey}\``;

      handleSendMessage();      }

    }      

  };      integrationCode += `

      }

  const handleBackNavigation = () => {    });

    // If we have API context, handle navigation properly    

    if (apiContext && apiContext.returnUrl) {    if (!response.ok) {

      // Clear the navigation intent to prevent loops      throw new Error(\`${apiName} API error: \${response.status}\`);

      if (typeof window !== 'undefined') {    }

        sessionStorage.setItem('navigationIntent', 'chat-to-api');    

        sessionStorage.setItem('chatReturnHandled', 'true');    return await response.json();

      }  }

      };

      // Use router.replace to avoid adding to history stack

      window.location.replace(apiContext.returnUrl);// Usage

      return;try {

    }  const data = await ${cleanApiName}Api.${cleanMethodName}();

      console.log('${apiName} data:', data);

    // If we're in onboarding and there's history, go back a step} catch (error) {

    if (isOnboarding && navigationHistory.length > 0) {  console.error('Error:', error.message);

      const lastState = navigationHistory[navigationHistory.length - 1];}`;

      setCurrentOnboardingStep(lastState.step);      

      setMessages(lastState.messages);      return {

      setUserProfile(lastState.userProfile);        id: Date.now().toString(),

      setNavigationHistory(prev => prev.slice(0, -1));        content: `Let me help you integrate ${apiName}! Here's a step-by-step approach:

    } else if (isOnboarding && currentOnboardingStep > 0) {

      // If no history but we can go back a step**Quick Start Guide:**

      setCurrentOnboardingStep(prev => prev - 1);

      // Remove last two messages (user response and AI question)1. **Set up your environment** with the necessary dependencies

      setMessages(prev => prev.slice(0, -2));2. **Get your API credentials** ${api.authRequired ? 'from your dashboard' : '(none required)'}

    } else {3. **Make your first request** to test the connection

      // Default back navigation4. **Handle responses and errors** properly

      onNavigate('search');

    }**Main Endpoint:** \`${mainEndpoint.method || method} ${mainEndpoint.path || endpoint}\`

  };

Here's a working example to get you started:`,

  const handleCancelToHome = () => {        isUser: false,

    if (isOnboarding && currentOnboardingStep > 0) {        timestamp: new Date(),

      setShowCancelConfirm(true);        hasCode: true,

    } else {        codeExample: integrationCode,

      onNavigate('home');        type: 'api-specific'

    }      };

  };    }

    

  const confirmCancelToHome = () => {    // Documentation questions

    setShowCancelConfirm(false);    if (lowerMessage.includes('docs') || lowerMessage.includes('documentation') || lowerMessage.includes('reference')) {

    onNavigate('home');      let endpointsList = '';

  };      if (api.endpoints && api.endpoints.length > 0) {

        endpointsList = `**Available Endpoints:**

  return (${api.endpoints.map(ep => `• \`${ep.method || 'GET'} ${ep.path}\` - ${ep.name || 'Endpoint'}`).join('\n')}

    <div className="h-screen bg-white flex flex-col">

      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">`;

        <div className="max-w-4xl mx-auto flex items-center justify-between">      }

          <div className="flex items-center gap-4">      

            <button      return {

              onClick={handleBackNavigation}        id: Date.now().toString(),

              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${        content: `Here's what you need to know about ${apiName} documentation:

                canGoBack || !isOnboarding ? '' : 'opacity-50 cursor-not-allowed'

              }`}**Key Information:**

              title={• **API Name:** ${apiName}

                isOnboarding && currentOnboardingStep > 0 • **Provider:** ${provider}

                  ? "Go back to previous question" • **Base URL:** ${baseUrl}

                  : isOnboarding • **Authentication:** ${api.authRequired ? 'Required' : 'Not required'}

                    ? "Cannot go back from first question"• **Main Method:** ${method}

                    : "Go back"

              }${endpointsList}**Next Steps:**

              disabled={isOnboarding && currentOnboardingStep === 0 && navigationHistory.length === 0}1. Review the official documentation

            >2. Test endpoints with small requests first

              <ArrowLeft className="w-5 h-5" />3. Implement error handling

            </button>4. Consider rate limiting

            <div>

              <h1 className="text-xl font-medium">AI Development Assistant</h1>What specific aspect of ${apiName} would you like me to explain in detail?`,

              <p className="text-sm text-gray-600">        isUser: false,

                {apiContext         timestamp: new Date(),

                  ? `Helping with ${apiContext.api.name} API integration`        type: 'api-specific'

                  : apiDoc       };

                    ? `Context: ${apiDoc.name}`    }

                    : userProfile.hasAnsweredOnboarding     

                      ? `Helping with your ${userProfile.projectType} using ${userProfile.techStack?.[0]}`    // Error/troubleshooting questions

                      : `Setup: Question ${currentOnboardingStep + 1} of ${onboardingQuestions.length}`}    if (lowerMessage.includes('error') || lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('debug')) {

              </p>      const authSection = api.authRequired ? 

            </div>        '• Check your API key is correct\n• Verify key permissions\n• Ensure proper header format' : 

          </div>        '• This API doesn\'t require auth - check other headers';

          <div className="flex items-center gap-3">      const cleanApiName = apiName.replace(/[^a-zA-Z0-9]/g, '');

            <button      

              onClick={handleCancelToHome}      let debugCode = `// ${apiName} Debug Helper

              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"const debug${cleanApiName} = async () => {

              title="Cancel and go to home page"  try {

            >    console.log('Testing ${apiName} connection...');

              <Home className="w-4 h-4" />    

              <span className="hidden sm:inline">Home</span>    const response = await fetch('${baseUrl}${endpoint}', {

            </button>      method: '${method}',

            <button      headers: {

              onClick={handleCancelToHome}        'Content-Type': 'application/json'`;

              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors sm:hidden"        

              title="Cancel and go to home page"      if (api.authRequired) {

            >        debugCode += `,

              <X className="w-4 h-4" />        'Authorization': 'Bearer YOUR_API_KEY'`;

            </button>      }

            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="AI is online"></div>      

            {userProfile.hasAnsweredOnboarding && (      debugCode += `

              <Bot className="w-6 h-6 text-blue-500" />      }

            )}    });

          </div>    

        </div>    console.log('Response status:', response.status);

            console.log('Response headers:', response.headers);

        {/* Progress Bar for Onboarding (only show if not in API context) */}    

        {isOnboarding && !apiContext && (    if (!response.ok) {

          <div className="max-w-4xl mx-auto mt-4">      const errorBody = await response.text();

            <div className="flex items-center gap-2">      console.error('Error response:', errorBody);

              <span className="text-xs text-gray-500">Progress:</span>      throw new Error(\`${apiName} API error: \${response.status} - \${errorBody}\`);

              <div className="flex-1 bg-gray-200 rounded-full h-2">    }

                <div     

                  className="bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] h-2 rounded-full transition-all duration-300"    const data = await response.json();

                  style={{ width: `${((currentOnboardingStep + 1) / onboardingQuestions.length) * 100}%` }}    console.log('Success! Data received:', data);

                ></div>    return data;

              </div>    

              <span className="text-xs text-gray-500">  } catch (error) {

                {currentOnboardingStep + 1}/{onboardingQuestions.length}    console.error('${apiName} Debug Error:', {

              </span>      message: error.message,

            </div>      stack: error.stack

          </div>    });

        )}    throw error;

      </div>  }

};

      <div className="flex-1 overflow-y-auto px-6 py-8 bg-gray-50/50">

        <div className="max-w-4xl mx-auto space-y-6">// Run debug

          {messages.map((message) => (debug${cleanApiName}();`;

            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>      

              <div className={`flex gap-3 max-w-3xl ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>      return {

                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.isUser ? 'bg-gradient-to-r from-[#4FACFE] to-[#00F2FE]' : 'bg-gray-200'}`}>        id: Date.now().toString(),

                  {message.isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-gray-700" />}        content: `I can help you troubleshoot ${apiName} issues! Here are the most common problems and solutions:

                </div>

                <div className={`rounded-xl px-4 py-3 shadow-sm ${message.isUser ? 'bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white' : 'bg-white text-gray-900'}`}>**Common ${apiName} Issues:**

                  <div

                    className="prose prose-sm max-w-none"🔑 **Authentication Errors (401/403)**

                    dangerouslySetInnerHTML={{${authSection}

                      __html: message.content

                        .replace(/```(.*?)\n([\s\S]*?)```/gs, (match, lang, code) => {🌐 **Request Errors (400/422)**

                          // Basic sanitization• Validate request format and required fields

                          const safeCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");• Check endpoint URL is correct

                          return `<pre class="bg-gray-800 text-white p-3 rounded-md my-2 overflow-x-auto"><code>${safeCode}</code></pre>`;• Verify request method (${method})

                        })

                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')⏰ **Rate Limiting (429)**

                        .replace(/\n/g, '<br />'),• Implement exponential backoff

                    }}• Check your rate limits

                  ></div>• Consider caching responses

                  

                  {message.hasCode && message.codeExample && (🔗 **Network Issues**

                    <div className="mt-4 bg-gray-900 rounded-lg overflow-hidden">• Verify base URL: ${baseUrl}

                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">• Check CORS settings for browser requests

                        <div className="flex items-center gap-2">• Test with curl first

                          <Code className="w-4 h-4 text-gray-400" />

                          <span className="text-sm text-gray-300">Code Snippet</span>**Debug Template:**`,

                        </div>        isUser: false,

                        <button         timestamp: new Date(),

                          onClick={() => handleCopy(message.codeExample || '', message.id)}         hasCode: true,

                          className="p-1 hover:bg-gray-700 rounded transition-colors"        codeExample: debugCode,

                        >        type: 'api-specific'

                          {copied === message.id ?       };

                            <CheckCircle className="w-4 h-4 text-green-400" /> :     }

                            <Copy className="w-4 h-4 text-gray-400" />    

                          }    // Default API-specific response

                        </button>    return {

                      </div>      id: Date.now().toString(),

                      <pre className="p-4 text-sm text-gray-100 overflow-x-auto">      content: `I'm here to help you with ${apiName}! I can assist you with:

                        <code>{message.codeExample}</code>

                      </pre>🔧 **Integration** - Step-by-step implementation guide

                    </div>🔑 **Authentication** - ${api.authRequired ? 'API key setup and usage' : 'No auth required - ready to use!'}

                  )}📖 **Documentation** - Explaining endpoints and parameters

                  <div className="flex items-center justify-between mt-2">🐛 **Troubleshooting** - Debugging common issues

                    <span className="text-xs opacity-70">💡 **Best Practices** - Production-ready implementation tips

                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}🚀 **Code Examples** - Custom code for your specific use case

                    </span>

                  </div>**Quick API Info:**

                </div>• **Provider:** ${provider}

              </div>• **Main Endpoint:** \`${method} ${endpoint}\`

            </div>• **Auth Required:** ${api.authRequired ? 'Yes' : 'No'}

          ))}

          {isTyping && (What would you like to know about ${apiName}? Just ask me anything!`,

            <div className="flex justify-start">      isUser: false,

              <div className="flex gap-3">      timestamp: new Date(),

                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">      type: 'api-specific'

                  <Bot className="w-4 h-4 text-gray-700" />    };

                </div>  };

                <div className="bg-white rounded-xl px-4 py-3 shadow-sm">

                  <div className="flex space-x-1">  const generateContextualResponse = (userMessage) => {

                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>    const lowerMessage = userMessage.toLowerCase();

                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>    

                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>    // If we have API context, provide specific help for that API

                  </div>    if (apiContext && apiContext.api) {

                </div>      const api = apiContext.api;

              </div>      return generateApiSpecificResponse(userMessage, api);

            </div>    }

          )}    

          <div ref={messagesEndRef} />    // Otherwise use general contextual responses

        </div>    const { projectType, techStack, experience, currentGoal } = userProfile;

      </div>    const primaryTech = techStack?.[0] || 'JavaScript';

    // Payment-related queries

      {isOnboarding && (    if (lowerMessage.includes('payment') || lowerMessage.includes('stripe') || lowerMessage.includes('billing')) {

        <div className="px-6 pb-4 pt-2 bg-white border-t border-gray-100">      const experienceLevel = experience?.includes('Beginner') ? 'beginner' : 

          <div className="max-w-4xl mx-auto">                             experience?.includes('Intermediate') ? 'intermediate' : 'advanced';

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">      let responseContent = `Great choice! For ${projectType} projects, Stripe is the gold standard for payments. Given your ${experience} level with ${primaryTech}, here's what I recommend:\n\n`;

              {onboardingQuestions[currentOnboardingStep].options.map((option) => (      if (experienceLevel === 'beginner') {

                <button         responseContent += `**Getting Started:**\n1. Create a Stripe account and get your API keys\n2. Install the Stripe SDK for ${primaryTech}\n3. Start with a simple payment form\n\n`;

                  key={option}       }

                  onClick={() => handleOnboardingResponse(option)}       responseContent += `Here's a ${primaryTech}-specific example for your ${projectType}:`;

                  className="p-3 bg-white border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-800 rounded-lg transition-all text-left text-sm"      let codeExample = '';

                >      if (primaryTech.includes('JavaScript') || primaryTech.includes('Node')) {

                  {option}        codeExample = `// Install: npm install stripe\nconst stripe = require('stripe')(\'sk_test_...\');\n// Create a payment intent\nconst paymentIntent = await stripe.paymentIntents.create({\n  amount: 2000, // $20.00\n  currency: 'usd',\n  payment_method_types: ['card'],\n  metadata: {\n    project_type: '${projectType}',\n    integration_id: 'your_project_id'\n  }\n});\n\nconsole.log('Payment intent created:', paymentIntent.client_secret);`;

                </button>      } else if (primaryTech.includes('Python')) {

              ))}        codeExample = `# Install: pip install stripe\nimport stripe\n\nstripe.api_key = \"sk_test_...\"\n\n# Create a payment intent\npayment_intent = stripe.PaymentIntent.create(\n    amount=2000,  # $20.00\n    currency='usd',\n    payment_method_types=['card'],\n    metadata={\n        'project_type': '${projectType}',\n        'integration_id': 'your_project_id'\n    }\n)\n\nprint(f\"Payment intent created: {payment_intent.client_secret}\")`;

            </div>      } else {

          </div>        codeExample = `// Generic REST API call for ${primaryTech}\nPOST https://api.stripe.com/v1/payment_intents\nAuthorization: Bearer sk_test_...\nContent-Type: application/x-www-form-urlencoded\n\namount=2000&currency=usd&payment_method_types[]=card`;

        </div>      }

      )}      return {

        id: Date.now().toString(),

      {!isOnboarding && messages.length < 5 && (        content: responseContent,

        <div className="px-6 pb-4 pt-2 bg-white border-t border-gray-100">        isUser: false,

          <div className="max-w-4xl mx-auto">        timestamp: new Date(),

            <p className="text-sm text-gray-500 mb-2">        hasCode: true,

              Here are some ideas for your {userProfile.projectType}:        codeExample,

            </p>        type: 'guidance'

            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">      };

              <button     }

                onClick={() => setInputValue(`How do I handle authentication with the ${apiDoc?.name}?`)}     // Authentication queries

                className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-sm transition-colors"    if (lowerMessage.includes('auth') || lowerMessage.includes('login') || lowerMessage.includes('user')) {

              >      let responseContent = `For ${projectType} authentication with ${primaryTech}, I recommend these options based on your needs:\n\n`;

                <Settings className="w-4 h-4 text-green-600 flex-shrink-0" />      if (projectType?.includes('Web') || projectType?.includes('SaaS')) {

                <span>Authentication Setup</span>        responseContent += `**Auth0** - Perfect for ${projectType}, handles everything\n**Firebase Auth** - Great for rapid development\n**Supabase Auth** - Open-source alternative\n\n`;

              </button>      }

              <button       responseContent += `Here's a ${primaryTech} implementation:`;

                onClick={() => setInputValue(`Give me a code example for a basic charge using ${apiDoc?.name}.`)}       const codeExample = primaryTech.includes('React') ? 

                className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-sm transition-colors"        `// Firebase Auth with React\nimport { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';\nimport { auth } from './firebase-config';\n\nconst signIn = async (email, password) => {\n  try {\n    const userCredential = await signInWithEmailAndPassword(auth, email, password);\n    console.log('User signed in:', userCredential.user.uid);\n    // Perfect for your ${projectType} project\n  } catch (error) {\n    console.error('Sign in error:', error.message);\n  }\n};` :

              >        `// Authentication example for ${primaryTech}\n// This code is optimized for your ${projectType} project\nconst authenticate = async (email, password) => {\n  const response = await fetch('/api/auth/login', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ email, password })\n  });\n  \n  if (response.ok) {\n    const { token } = await response.json();\n    localStorage.setItem('authToken', token);\n    return token;\n  }\n  throw new Error('Authentication failed');\n};`;

                <Rocket className="w-4 h-4 text-blue-600 flex-shrink-0" />      return {

                <span>Core Integration Example</span>        id: Date.now().toString(),

              </button>        content: responseContent,

            </div>        isUser: false,

          </div>        timestamp: new Date(),

        </div>        hasCode: true,

      )}        codeExample,

        type: 'guidance'

      <div className="border-t border-gray-200 px-6 py-4 bg-white">      };

        <div className="max-w-4xl mx-auto">    }

          {/* Keyboard shortcuts hint */}    // Help with integration

          {isOnboarding && (    if (lowerMessage.includes('integrate') || lowerMessage.includes('implement') || lowerMessage.includes('build')) {

            <div className="mb-3 text-xs text-gray-500 flex items-center gap-4">      return {

              <span>💡 Keyboard shortcuts:</span>        id: Date.now().toString(),

              <span>Alt + ← to go back</span>        content: `Perfect! Let's build this step by step for your ${projectType} using ${primaryTech}. Based on your ${experience} level, here's my recommended approach:\n\n**Phase 1: Setup & Planning**\n• Environment setup for ${primaryTech}\n• API key management and security\n• Project structure best practices\n\n**Phase 2: Core Integration**\n• API client setup\n• Authentication handling\n• Error handling and retries\n\n**Phase 3: Testing & Deployment**\n• Testing strategies for your ${projectType}\n• Production deployment checklist\n• Monitoring and logging\n\nWhich phase would you like to dive into first? Or do you have a specific API you'd like to integrate?`,

              <span>Esc to go home</span>        isUser: false,

            </div>        timestamp: new Date(),

          )}        type: 'guidance'

                };

          <div className="flex items-center gap-4">    }

            <div className="flex-1 relative">    // Default contextual response

              <textarea    return {

                value={inputValue}      id: Date.now().toString(),

                onChange={(e) => setInputValue(e.target.value)}      content: `I'd love to help you with that! Given your ${projectType} project using ${primaryTech} and your goal to ${currentGoal}, I can provide specific guidance.\n\nCould you tell me more about:\n• Which specific API you're interested in?\n• What functionality you're trying to implement?\n• Any challenges you're currently facing?\n\nThe more context you give me, the better I can tailor my assistance to your ${experience} level and ${primaryTech} setup.`,

                onKeyDown={handleKeyPress}      isUser: false,

                placeholder={      timestamp: new Date(),

                  apiContext       type: 'message'

                    ? `Ask me anything about ${apiContext.api.name} integration...`    };

                    : isOnboarding   };

                      ? "Select an option above to continue..." 

                      : `Ask about ${apiDoc?.name || 'the API'}...`  const handleSendMessage = () => {

                }=======

                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"  const handleSendMessage = async () => {

                rows={1}>>>>>>> 68f3faa523a6fac3785af4c7128f0468e985d5ca

                style={{ minHeight: '48px', maxHeight: '120px' }}    if (!inputValue.trim()) return;

                disabled={isOnboarding && !apiContext || isTyping}    const userMessage = { id: Date.now().toString(), content: inputValue, isUser: true, timestamp: new Date() };

              />    setMessages(prev => [...prev, userMessage]);

              <button    const currentInput = inputValue;

                onClick={handleSendMessage}    setInputValue('');

                disabled={!inputValue.trim() || (isOnboarding && !apiContext) || isTyping}    setIsTyping(true);

                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"

              >    try {

                <Send className="w-5 h-5" />      // First, check if the question is relevant via API route

              </button>      const relevanceResponse = await fetch('/api/chat', {

            </div>        method: 'POST',

          </div>        headers: { 'Content-Type': 'application/json' },

        </div>        body: JSON.stringify({ action: 'checkRelevance', question: currentInput, apiDoc: apiDoc })

      </div>      });



      {/* Cancel Confirmation Dialog */}      if (!relevanceResponse.ok) throw new Error('Relevance check failed');

      {showCancelConfirm && (      const { relevant } = await relevanceResponse.json();

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white rounded-lg p-6 max-w-md mx-4">      if (!relevant) {

            <h3 className="text-lg font-medium mb-2">Cancel Setup?</h3>        const aiResponse = {

            <p className="text-gray-600 mb-6">          id: (Date.now() + 1).toString(),

              You're in the middle of setting up your AI assistant. If you leave now, you'll lose your progress.          content: `I'm sorry, but my expertise is focused on the **${apiDoc.name}** documentation. Could you please ask a question related to its features, endpoints, or usage?`,

            </p>          isUser: false,

            <div className="flex gap-3 justify-end">          timestamp: new Date(),

              <button        };

                onClick={() => setShowCancelConfirm(false)}        setMessages(prev => [...prev, aiResponse]);

                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"        setIsTyping(false);

              >        return;

                Continue Setup      }

              </button>

              <button      // If relevant, proceed to get a detailed answer

                onClick={confirmCancelToHome}      let prompt = currentInput;

                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"      if (apiDoc) {

              >        const docString = JSON.stringify(apiDoc, null, 2);

                Go to Home        prompt = `CONTEXT: I am a developer reviewing the following API documentation. Please answer my question based on this context and my user profile.\n\n---\n\nAPI DOCUMENTATION:\n\`\`\`json\n${docString}\n\`\`\`\n\n---\n\nMY QUESTION:\n${currentInput}`;

              </button>      }

            </div>

          </div>      const chatResponse = await fetch('/api/chat', {

        </div>        method: 'POST',

      )}        headers: { 'Content-Type': 'application/json' },

    </div>        body: JSON.stringify({ action: 'getChatResponse', prompt: prompt, userProfile: userProfile })

  );      });

}
      if (!chatResponse.ok) throw new Error('Chat response failed');
      const { response: aiTextResponse } = await chatResponse.json();

      const hasCode = aiTextResponse.includes('```');
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: aiTextResponse,
        isUser: false,
        timestamp: new Date(),
        hasCode: hasCode,
        codeExample: hasCode ? aiTextResponse.split('```')[1]?.split('\n').slice(1).join('\n').trim() : undefined
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
        console.error("Failed to fetch from /api/chat:", error);
        const errorResponse = {
            id: (Date.now() + 1).toString(),
            content: "Sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.",
            isUser: false,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorResponse]);
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

<<<<<<< HEAD
  const handleBackNavigation = () => {
    // If we have API context, handle navigation properly
    if (apiContext && apiContext.returnUrl) {
      // Clear the navigation intent to prevent loops
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('navigationIntent', 'chat-to-api');
        sessionStorage.setItem('chatReturnHandled', 'true');
      }
      
      // Use router.replace to avoid adding to history stack
      window.location.replace(apiContext.returnUrl);
      return;
    }
    
    // If we're in onboarding and there's history, go back a step
    if (isOnboarding && navigationHistory.length > 0) {
      const lastState = navigationHistory[navigationHistory.length - 1];
      setCurrentOnboardingStep(lastState.step);
      setMessages(lastState.messages);
      setUserProfile(lastState.userProfile);
      setNavigationHistory(prev => prev.slice(0, -1));
    } else if (isOnboarding && currentOnboardingStep > 0) {
      // If no history but we can go back a step
      setCurrentOnboardingStep(prev => prev - 1);
      // Remove last two messages (user response and AI question)
      setMessages(prev => prev.slice(0, -2));
    } else {
      // Default back navigation
      onNavigate('back');
    }
  };

  const handleCancelToHome = () => {
    if (isOnboarding && currentOnboardingStep > 0) {
      setShowCancelConfirm(true);
    } else {
      onNavigate('home');
    }
  };

  const confirmCancelToHome = () => {
    setShowCancelConfirm(false);
    onNavigate('home');
  };
=======
  const isOnboarding = !userProfile.hasAnsweredOnboarding;
>>>>>>> 68f3faa523a6fac3785af4c7128f0468e985d5ca

  return (
    <div className="h-screen bg-white flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
<<<<<<< HEAD
              onClick={handleBackNavigation}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                canGoBack || !isOnboarding ? '' : 'opacity-50 cursor-not-allowed'
              }`}
              title={
                isOnboarding && currentOnboardingStep > 0 
                  ? "Go back to previous question" 
                  : isOnboarding 
                    ? "Cannot go back from first question"
                    : "Go back"
              }
              disabled={isOnboarding && currentOnboardingStep === 0 && navigationHistory.length === 0}
=======
              onClick={() => onNavigate('search')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
>>>>>>> 68f3faa523a6fac3785af4c7128f0468e985d5ca
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
<<<<<<< HEAD
              <h1 className="text-2xl font-medium">AI Development Assistant</h1>
              <p className="text-gray-600">
                {apiContext 
                  ? `Helping with ${apiContext.api.name} API integration`
                  : userProfile.hasAnsweredOnboarding 
                    ? `Helping with your ${userProfile.projectType} using ${userProfile.techStack?.[0]}`
                    : `Setup: Question ${currentOnboardingStep + 1} of ${onboardingQuestions.length}`}
=======
              <h1 className="text-xl font-medium">AI Development Assistant</h1>
              <p className="text-sm text-gray-600">
                {apiDoc ? `Context: ${apiDoc.name}` : 'Ready to help'}
>>>>>>> 68f3faa523a6fac3785af4c7128f0468e985d5ca
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <button
              onClick={handleCancelToHome}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title="Cancel and go to home page"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
            <button
              onClick={handleCancelToHome}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors sm:hidden"
              title="Cancel and go to home page"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="AI is online"></div>
            {userProfile.hasAnsweredOnboarding && (
              <Bot className="w-6 h-6 text-blue-500" />
            )}
=======
            <div
              className="w-3 h-3 bg-green-400 rounded-full animate-pulse"
              title="AI is online"
            ></div>
            <Bot className="w-6 h-6 text-blue-500" />
>>>>>>> 68f3faa523a6fac3785af4c7128f0468e985d5ca
          </div>
        </div>
        
        {/* Progress Bar for Onboarding (only show if not in API context) */}
        {isOnboarding && !apiContext && (
          <div className="max-w-4xl mx-auto mt-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Progress:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentOnboardingStep + 1) / onboardingQuestions.length) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">
                {currentOnboardingStep + 1}/{onboardingQuestions.length}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 bg-gray-50/50">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-3xl ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.isUser ? 'bg-gradient-to-r from-[#4FACFE] to-[#00F2FE]' : 'bg-gray-200'}`}>
                  {message.isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-gray-700" />}
                </div>
                <div className={`rounded-xl px-4 py-3 shadow-sm ${message.isUser ? 'bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white' : 'bg-white text-gray-900'}`}>
                   <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: message.content
                        .replace(/```(.*?)\n([\s\S]*?)```/gs, (match, lang, code) => {
                           // Basic sanitization
                          const safeCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                          return `<pre class="bg-gray-800 text-white p-3 rounded-md my-2 overflow-x-auto"><code>${safeCode}</code></pre>`;
                        })
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br />'),
                    }}
                  ></div>
                  
                  {message.hasCode && message.codeExample && (
                     <div className="mt-4 bg-gray-900 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-800"><div className="flex items-center gap-2"><Code className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-300">Code Snippet</span></div><button onClick={() => handleCopy(message.codeExample || '', message.id)} className="p-1 hover:bg-gray-700 rounded transition-colors">{copied === message.id ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}</button></div>
                      <pre className="p-4 text-sm text-gray-100 overflow-x-auto"><code>{message.codeExample}</code></pre>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2"><span className="text-xs opacity-70">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start"><div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-gray-700" /></div><div className="bg-white rounded-xl px-4 py-3 shadow-sm"><div className="flex space-x-1"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div></div></div></div></div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {isOnboarding && (
        <div className="px-6 pb-4 pt-2 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto"><div className="grid grid-cols-2 md:grid-cols-3 gap-3">{onboardingQuestions[currentOnboardingStep].options.map((option) => (<button key={option} onClick={() => handleOnboardingResponse(option)} className="p-3 bg-white border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-800 rounded-lg transition-all text-left text-sm">{option}</button>))}</div></div>
        </div>
      )}

<<<<<<< HEAD
      {/* Quick Actions for Post-Onboarding or API Context */}
      {((userProfile.hasAnsweredOnboarding && messages.length <= 2) || (apiContext && messages.length <= 1)) && (
        <div className="px-6 pb-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-500 mb-3">
              {apiContext ? `Quick help for ${apiContext.api.name}:` : `Quick actions for your ${userProfile.projectType}:`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {apiContext ? (
                // API-specific quick actions
                <>
                  <button
                    onClick={() => setInputValue("How do I authenticate with this API?")}
                    className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
                  >
                    <Settings className="w-4 h-4 text-blue-600" />
                    <span>Authentication Setup</span>
                  </button>
                  <button
                    onClick={() => setInputValue("Show me integration examples")}
                    className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors"
                  >
                    <Code className="w-4 h-4 text-green-600" />
                    <span>Integration Examples</span>
                  </button>
                  <button
                    onClick={() => setInputValue("Explain the documentation")}
                    className="flex items-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors"
                  >
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                    <span>Documentation Help</span>
                  </button>
                  <button
                    onClick={() => setInputValue("I'm having issues with this API")}
                    className="flex items-center gap-2 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors"
                  >
                    <Rocket className="w-4 h-4 text-orange-600" />
                    <span>Troubleshooting</span>
                  </button>
                </>
              ) : (
                // General quick actions
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
=======
      {!isOnboarding && messages.length < 5 && (
        <div className="px-6 pb-4 pt-2 bg-white border-t border-gray-100"><div className="max-w-4xl mx-auto"><p className="text-sm text-gray-500 mb-2">Here are some ideas for your {userProfile.projectType}:</p><div className="grid grid-cols-2 md:grid-cols-2 gap-3"><button onClick={() => setInputValue(`How do I handle authentication with the ${apiDoc?.name}?`)} className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-sm transition-colors"><Settings className="w-4 h-4 text-green-600 flex-shrink-0" /><span>Authentication Setup</span></button><button onClick={() => setInputValue(`Give me a code example for a basic charge using ${apiDoc?.name}.`)} className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left text-sm transition-colors"><Rocket className="w-4 h-4 text-blue-600 flex-shrink-0" /><span>Core Integration Example</span></button></div></div></div>
>>>>>>> 68f3faa523a6fac3785af4c7128f0468e985d5ca
      )}

      <div className="border-t border-gray-200 px-6 py-4 bg-white">
        <div className="max-w-4xl mx-auto">
<<<<<<< HEAD
          {/* Keyboard shortcuts hint */}
          {isOnboarding && (
            <div className="mb-3 text-xs text-gray-500 flex items-center gap-4">
              <span>💡 Keyboard shortcuts:</span>
              <span>Alt + ← to go back</span>
              <span>Esc to go home</span>
            </div>
          )}
          
          <div className="flex items-end gap-4">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={apiContext 
                  ? `Ask me anything about ${apiContext.api.name} integration...`
                  : isOnboarding 
                    ? "Or type your own answer..." 
                    : "Ask me anything about your project, APIs, or integration help..."}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isOnboarding && !apiContext}
              />
            </div>
            <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || (isOnboarding && !apiContext)}
              className="p-3 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
=======
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <textarea value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyPress} placeholder={isOnboarding ? "Select an option above to continue..." : `Ask about ${apiDoc?.name || 'the API'}...`} className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100" rows={1} style={{ minHeight: '48px', maxHeight: '120px' }} disabled={isOnboarding || isTyping}/>
               <button onClick={handleSendMessage} disabled={!inputValue.trim() || isOnboarding || isTyping} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"><Send className="w-5 h-5" /></button>
            </div>
>>>>>>> 68f3faa523a6fac3785af4c7128f0468e985d5ca
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium mb-2">Cancel Setup?</h3>
            <p className="text-gray-600 mb-6">
              You're in the middle of setting up your AI assistant. If you leave now, you'll lose your progress.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Setup
              </button>
              <button
                onClick={confirmCancelToHome}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}