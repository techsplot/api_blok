// Enhanced API Details Component - Meta Grade Implementation
// Replaces hardcoded content with dynamic Storyblok data

import { useState, useMemo } from 'react';
import { ChevronLeft, ExternalLink, Copy, Check, MessageCircle, Home, Search } from 'lucide-react';

// Enhanced API Details Component with full Storyblok integration
export function ApiDetailEnhanced({ api, onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeCodeLang, setActiveCodeLang] = useState('javascript');
  const [copiedStates, setCopiedStates] = useState({});

  // Memoized computed values
  const computedValues = useMemo(() => {
    const documentationUrl = api.documentation_url || api.base_url;
    const hasParameters = api.endpoints?.some(ep => ep.parameters && ep.parameters.length > 0);
    const hasCodeExamples = api.codeExamples && Object.keys(api.codeExamples).length > 0;
    const hasUseCases = api.useCases && api.useCases.length > 0;
    const primaryEndpoint = api.endpoints?.[0] || {};
    
    return {
      documentationUrl,
      hasParameters,
      hasCodeExamples,
      hasUseCases,
      primaryEndpoint
    };
  }, [api]);

  // Copy to clipboard functionality
  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Generate dynamic code examples based on API data
  const generateCodeExample = (endpoint, language = 'javascript') => {
    const { path, method, parameters } = endpoint;
    const authHeader = api.authRequired ? 
      (api.auth_method === 'api_key' ? 
        `'Authorization': 'Bearer YOUR_API_KEY'` : 
        `'Authorization': 'Bearer YOUR_TOKEN'`) : '';
    
    // Build parameters object for POST/PUT requests
    const bodyParams = parameters?.filter(p => p.required).map(p => 
      `  "${p.name}": ${p.example ? `"${p.example}"` : `"${p.type === 'number' ? '123' : 'value'}"`}`
    ).join(',\n') || '';

    switch (language) {
      case 'javascript':
        return `// ${api.name} - ${endpoint.name || method} Request
const response = await fetch('${api.base_url}${path}', {
  method: '${method}',
  headers: {
    'Content-Type': 'application/json'${authHeader ? `,\n    ${authHeader}` : ''}
  }${method !== 'GET' && bodyParams ? `,\n  body: JSON.stringify({\n${bodyParams}\n  })` : ''}
});

const data = await response.json();
console.log(data);`;

      case 'python':
        return `# ${api.name} - ${endpoint.name || method} Request
import requests

url = "${api.base_url}${path}"
headers = {
    "Content-Type": "application/json"${authHeader ? `,\n    "Authorization": "Bearer YOUR_API_KEY"` : ''}
}

${method !== 'GET' && bodyParams ? `data = {\n${bodyParams.replace(/"/g, '"')}\n}\n\nresponse = requests.${method.toLowerCase()}(url, headers=headers, json=data)` : `response = requests.${method.toLowerCase()}(url, headers=headers)`}
print(response.json())`;

      case 'curl':
        return `# ${api.name} - ${endpoint.name || method} Request
curl -X ${method} "${api.base_url}${path}" \\
  -H "Content-Type: application/json"${authHeader ? ` \\\n  -H "Authorization: Bearer YOUR_API_KEY"` : ''}${method !== 'GET' && bodyParams ? ` \\\n  -d '{\n${bodyParams}\n  }'` : ''}`;

      default:
        return `// ${api.name} example for ${language} coming soon...`;
    }
  };

  // Render parameters table
  const renderParametersTable = (parameters) => {
    if (!parameters || parameters.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>No parameters required for this endpoint.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium">Parameter</th>
              <th className="text-left py-3 px-4 font-medium">Type</th>
              <th className="text-left py-3 px-4 font-medium">Required</th>
              <th className="text-left py-3 px-4 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-4 font-mono text-sm text-blue-600">{param.name}</td>
                <td className="py-3 px-4 text-sm">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                    {param.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    param.required ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {param.required ? 'Required' : 'Optional'}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">{param.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render error responses section
  const renderErrorResponses = (errorResponses) => {
    if (!errorResponses || errorResponses.length === 0) return null;

    return (
      <div className="mt-6">
        <h4 className="font-medium mb-3">Common Error Responses</h4>
        <div className="space-y-3">
          {errorResponses.map((error, index) => (
            <div key={index} className="border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                  {error.statusCode}
                </span>
                <span className="font-medium">{error.description}</span>
              </div>
              {error.example && (
                <pre className="bg-red-50 p-3 rounded text-sm font-mono text-red-800 overflow-x-auto">
                  {error.example}
                </pre>
              )}
              {error.solution && (
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Solution:</strong> {error.solution}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('back')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              {api.image && (
                <img 
                  src={api.image} 
                  alt={api.imageAlt || api.name}
                  className="w-8 h-8 rounded object-contain"
                />
              )}
              <div>
                <h1 className="text-xl font-bold">{api.name}</h1>
                <p className="text-sm text-gray-600">{api.shortDescription || api.description}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('search')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              AI Help
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'endpoints', label: 'Endpoints' },
                    ...(computedValues.hasCodeExamples ? [{ id: 'code', label: 'Code Examples' }] : []),
                    ...(computedValues.hasUseCases ? [{ id: 'use-cases', label: 'Use Cases' }] : [])
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-3">Description</h2>
                      <p className="text-gray-700 leading-relaxed">{api.description}</p>
                    </div>

                    {api.securityNotes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 className="font-medium text-yellow-800 mb-2">Security Notes</h3>
                        <p className="text-yellow-700 text-sm">{api.securityNotes}</p>
                      </div>
                    )}

                    {api.authRequired && api.authDescription && (
                      <div>
                        <h3 className="font-medium mb-3">Authentication</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-blue-700 text-sm">{api.authDescription}</p>
                          {api.authExample && (
                            <pre className="mt-3 bg-blue-100 p-3 rounded text-sm font-mono text-blue-800 overflow-x-auto">
                              {api.authExample}
                            </pre>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'endpoints' && (
                  <div className="space-y-6">
                    {api.endpoints?.map((endpoint, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`px-3 py-1 rounded text-sm font-medium ${
                            endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                            endpoint.method === 'DELETE' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {endpoint.method}
                          </span>
                          <code className="bg-gray-100 px-3 py-1 rounded font-mono text-sm">
                            {api.base_url}{endpoint.path}
                          </code>
                        </div>
                        
                        {endpoint.description && (
                          <p className="text-gray-600 mb-4">{endpoint.description}</p>
                        )}

                        {endpoint.parameters && endpoint.parameters.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-3">Parameters</h4>
                            {renderParametersTable(endpoint.parameters)}
                          </div>
                        )}

                        {endpoint.responseExample && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-3">Example Response</h4>
                            <div className="relative">
                              <pre className="bg-gray-50 p-4 rounded text-sm font-mono overflow-x-auto">
                                {endpoint.responseExample}
                              </pre>
                              <button
                                onClick={() => copyToClipboard(endpoint.responseExample, `response-${index}`)}
                                className="absolute top-2 right-2 p-2 bg-white rounded hover:bg-gray-100 transition-colors"
                              >
                                {copiedStates[`response-${index}`] ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4 text-gray-600" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {renderErrorResponses(endpoint.errorResponses)}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'code' && computedValues.hasCodeExamples && (
                  <div className="space-y-4">
                    <div className="flex gap-2 mb-4">
                      {Object.keys(api.codeExamples).map(lang => (
                        <button
                          key={lang}
                          onClick={() => setActiveCodeLang(lang)}
                          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                            activeCodeLang === lang
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </button>
                      ))}
                    </div>
                    
                    {api.codeExamples[activeCodeLang] && (
                      <div>
                        <h3 className="font-medium mb-3">{api.codeExamples[activeCodeLang].title}</h3>
                        {api.codeExamples[activeCodeLang].description && (
                          <p className="text-gray-600 mb-4">{api.codeExamples[activeCodeLang].description}</p>
                        )}
                        <div className="relative">
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                            <code>{api.codeExamples[activeCodeLang].code}</code>
                          </pre>
                          <button
                            onClick={() => copyToClipboard(api.codeExamples[activeCodeLang].code, `code-${activeCodeLang}`)}
                            className="absolute top-2 right-2 p-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
                          >
                            {copiedStates[`code-${activeCodeLang}`] ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-300" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'use-cases' && computedValues.hasUseCases && (
                  <div className="space-y-6">
                    {api.useCases.map((useCase, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">{useCase.title}</h3>
                        <p className="text-gray-600 mb-4">{useCase.description}</p>
                        {useCase.codeExample && (
                          <div className="relative">
                            <pre className="bg-gray-50 p-4 rounded text-sm font-mono overflow-x-auto">
                              {useCase.codeExample}
                            </pre>
                            <button
                              onClick={() => copyToClipboard(useCase.codeExample, `usecase-${index}`)}
                              className="absolute top-2 right-2 p-2 bg-white rounded hover:bg-gray-100 transition-colors"
                            >
                              {copiedStates[`usecase-${index}`] ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* API Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="font-semibold mb-4">API Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Authentication:</span>
                  <span className={`font-medium ${api.authRequired ? 'text-red-600' : 'text-green-600'}`}>
                    {api.authRequired ? 'Required' : 'Not Required'}
                  </span>
                </div>
                {api.provider && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-medium">{api.provider}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className={`font-medium capitalize ${
                    api.difficulty === 'beginner' ? 'text-green-600' :
                    api.difficulty === 'intermediate' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {api.difficulty}
                  </span>
                </div>
                {api.pricing && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pricing:</span>
                    <span className={`font-medium capitalize ${
                      api.pricing === 'free' ? 'text-green-600' :
                      api.pricing === 'freemium' ? 'text-blue-600' :
                      'text-orange-600'
                    }`}>
                      {api.pricing}
                    </span>
                  </div>
                )}
                {api.rateLimit && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate Limit:</span>
                    <span className="font-medium text-xs">{api.rateLimit}</span>
                  </div>
                )}
                {api.version && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version:</span>
                    <span className="font-medium">{api.version}</span>
                  </div>
                )}
                {api.status && api.status !== 'stable' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium capitalize ${
                      api.status === 'beta' ? 'text-yellow-600' :
                      api.status === 'deprecated' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {api.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Documentation Link */}
              {computedValues.documentationUrl && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href={computedValues.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm underline flex items-center gap-1"
                  >
                    View Official Documentation
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Tags */}
            {api.tags && api.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {api.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* SDKs */}
            {api.sdks && api.sdks.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold mb-3">Available SDKs</h3>
                <div className="space-y-2">
                  {api.sdks.map((sdk, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{sdk.name}</span>
                      <span className="text-xs text-gray-500">{sdk.language}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Backward compatibility export
export { ApiDetailEnhanced as ApiDetail };