import { useState } from 'react';
import { ArrowLeft, Copy, Shield, Code, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

export function ApiDetail({ api, onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [copied, setCopied] = useState(false);
  const [activeEndpointIndex, setActiveEndpointIndex] = useState(0);

  const title = api.name || api.title || 'API';
  const endpoints = Array.isArray(api.endpoints) ? api.endpoints : [];
  const currentEndpoint = endpoints[activeEndpointIndex] || {};
  const endpointPath = currentEndpoint.path || api.endpoint || api.url || '';
  const documentationUrl = api.documentation_url || api.base_url || '';

  const getCodeExamples = () => {
    return {
      javascript: `// Example JavaScript request\nfetch("https://api.example.com${endpointPath}", { method: "${(currentEndpoint.method || 'GET').toUpperCase()}" });`,
      python: `# Example Python request\nimport requests\nrequests.${(currentEndpoint.method || 'GET').toLowerCase()}("https://api.example.com${endpointPath}")`,
      curl: `curl -X ${(currentEndpoint.method || 'GET').toUpperCase()} "https://api.example.com${endpointPath}"`,
    };
  };
  const codeExamples = getCodeExamples();

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'code', label: 'Code Examples', icon: Code },
    { id: 'errors', label: 'Error Handling', icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-medium">{title}</h1>
              <p className="text-gray-600">{api.description}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('chat', api)} // pass full API object
            className="bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Ask AI About This API
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* API Info Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 rounded-md bg-blue-50 text-blue-600">
                  {currentEndpoint.method || 'GET'}
                </span>
                <code className="bg-gray-100 px-3 py-1 rounded-md font-mono text-sm">
                  {endpointPath}
                </code>
                {api.authRequired && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Auth Required</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600">{api.description}</p>
            </div>

            {/* Tabs */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 font-medium ${
                          activeTab === tab.id
                            ? 'border-b-2 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="font-medium mb-3">Authentication</h3>
                    <p className="text-gray-600">
                      {api.authRequired
                        ? 'This endpoint requires authentication.'
                        : 'No authentication required.'}
                    </p>
                  </div>
                )}

                {activeTab === 'code' && (
                  <div>
                    <h3 className="font-medium mb-3">Code Example</h3>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                      {codeExamples[selectedLanguage]}
                    </pre>
                  </div>
                )}

                {activeTab === 'errors' && (
                  <div>
                    <h3 className="font-medium mb-3">Errors</h3>
                    <p className="text-gray-600">Example error responses here…</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-medium mb-4">API Information</h3>
              <div className="space-y-2 text-sm">
                <p>Category: {api.category}</p>
                <p>Provider: {api.provider}</p>
                <p>Difficulty: {api.difficulty}</p>
                <p>Pricing: {api.pricing}</p>
                <p>Rate Limit: {api.rate_limit}</p>
              </div>
              {documentationUrl && (
                <a
                  href={documentationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-sm underline mt-3 inline-block"
                >
                  View Documentation →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
