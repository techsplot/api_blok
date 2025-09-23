import { useState } from 'react';
import { ArrowLeft, Copy, Play, Shield, Code, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
export function ApiDetail({ api, onNavigate }) {
	const [activeTab, setActiveTab] = useState('overview');
	const [selectedLanguage, setSelectedLanguage] = useState('javascript');
	const [copied, setCopied] = useState(false);

	// Use API's code examples if available, otherwise fallback to default
	const getCodeExamples = () => {
			if (api.code_examples && api.code_examples.length > 0) {
				const examples = {};
				api.code_examples.forEach(example => {
					examples[example.language] = example.code;
				});
				return examples;
			}

		// Fallback to generated examples
		return {
			javascript: `// Initialize the API request\nconst response = await fetch('https://api.example.com${api.url}', {\n  method: '${api.method}',\n  headers: {\n    'Content-Type': 'application/json'${api.authRequired ? ",\n    'Authorization': 'Bearer YOUR_API_KEY'" : ''}\n  }${api.method !== 'GET' ? ',\n  body: JSON.stringify({\n    // Request parameters\n  })' : ''}\n});\n\nconst data = await response.json();\nconsole.log(data);`,
			python: `import requests\n\n# Set up the request\nurl = "https://api.example.com${api.url}"\nheaders = {\n    "Content-Type": "application/json"${api.authRequired ? ',\n    "Authorization": "Bearer YOUR_API_KEY"' : ''}\n}${api.method !== 'GET' ? `\ndata = {\n    # Request parameters\n}` : ''}\n\n# Make the request\nresponse = requests.${api.method.toLowerCase()}(url, headers=headers${api.method !== 'GET' ? ', json=data' : ''})\nresult = response.json()\nprint(result)`,
			curl: `curl -X ${api.method} "https://api.example.com${api.url}"${api.authRequired ? ' \\\n  -H "Authorization: Bearer YOUR_API_KEY"' : ''} \\\n  -H "Content-Type: application/json"${api.method !== 'GET' ? ' \\\n  -d \'{\n    "parameter": "value"\n  }\'' : ''}`
		};
	};

	const codeExamples = getCodeExamples();

		const handleCopy = async (text) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	};

		const tabs = [
			{ id: 'overview', label: 'Overview', icon: BookOpen },
			{ id: 'code', label: 'Code Examples', icon: Code },
			{ id: 'errors', label: 'Error Handling', icon: AlertCircle }
		];

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center gap-4">
						<button
							onClick={() => onNavigate('search')}
							className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<ArrowLeft className="w-5 h-5" />
						</button>
						<div>
							<h1 className="text-2xl font-medium">{api.title}</h1>
							<p className="text-gray-600">{api.description}</p>
						</div>
					</div>
					<button
						onClick={() => onNavigate('chat')}
						className="bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
					>
						Ask AI About This API
					</button>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* API Info Card */}
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<div className="flex items-center gap-4 mb-4">
								<span className={`px-3 py-1 rounded-md font-medium ${
									api.method === 'GET' ? 'bg-blue-50 text-blue-600' :
									api.method === 'POST' ? 'bg-green-50 text-green-600' :
									api.method === 'PUT' ? 'bg-yellow-50 text-yellow-600' :
									'bg-red-50 text-red-600'
								}`}>
									{api.method}
								</span>
								<code className="bg-gray-100 px-3 py-1 rounded-md font-mono text-sm">
									{api.url}
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
									{tabs.map(tab => {
										const Icon = tab.icon;
										return (
											<button
												key={tab.id}
												onClick={() => setActiveTab(tab.id)}
												className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
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
									<div className="space-y-6">
										<div>
											<h3 className="font-medium mb-3">Authentication</h3>
											<div className="bg-gray-50 rounded-lg p-4">
												{api.authRequired ? (
													<div>
														<p className="text-gray-600 mb-2">This endpoint requires authentication using an API key.</p>
														<code className="bg-white px-2 py-1 rounded text-sm">
															Authorization: Bearer YOUR_API_KEY
														</code>
													</div>
												) : (
													<p className="text-gray-600">This endpoint does not require authentication.</p>
												)}
											</div>
										</div>

										<div>
											<h3 className="font-medium mb-3">Parameters</h3>
											<div className="overflow-x-auto">
												<table className="w-full border border-gray-200 rounded-lg">
													<thead className="bg-gray-50">
														<tr>
															<th className="px-4 py-2 text-left font-medium">Parameter</th>
															<th className="px-4 py-2 text-left font-medium">Type</th>
															<th className="px-4 py-2 text-left font-medium">Required</th>
															<th className="px-4 py-2 text-left font-medium">Description</th>
														</tr>
													</thead>
													<tbody>
														<tr className="border-t border-gray-200">
															<td className="px-4 py-2 font-mono text-sm">amount</td>
															<td className="px-4 py-2 text-sm">integer</td>
															<td className="px-4 py-2 text-sm">Yes</td>
															<td className="px-4 py-2 text-sm">Amount in smallest currency unit</td>
														</tr>
														<tr className="border-t border-gray-200">
															<td className="px-4 py-2 font-mono text-sm">currency</td>
															<td className="px-4 py-2 text-sm">string</td>
															<td className="px-4 py-2 text-sm">Yes</td>
															<td className="px-4 py-2 text-sm">Three-letter ISO currency code</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>

										<div>
											<h3 className="font-medium mb-3">Response</h3>
											<div className="bg-gray-50 rounded-lg p-4">
												<pre className="text-sm text-gray-700 font-mono">
{`{
	"id": "pi_1234567890",
	"object": "payment_intent",
	"amount": 2000,
	"currency": "usd",
	"status": "succeeded",
	"created": 1625097600
}`}
												</pre>
											</div>
										</div>
									</div>
								)}

								{activeTab === 'code' && (
									<div className="space-y-4">
										<div className="flex gap-2 mb-4">
											{Object.keys(codeExamples).map(lang => (
																		<button
																			key={lang}
																			onClick={() => setSelectedLanguage(lang)}
																			className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
																				selectedLanguage === lang
																					? 'bg-blue-100 text-blue-600'
																					: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
																			}`}
																		>
																			{lang === 'javascript' ? 'JavaScript' : lang === 'python' ? 'Python' : 'cURL'}
																		</button>
											))}
										</div>

										<div className="relative">
											<button
												onClick={() => handleCopy(codeExamples[selectedLanguage])}
												className="absolute top-4 right-4 p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
											>
												{copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
											</button>
											<pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
												<code>{codeExamples[selectedLanguage]}</code>
											</pre>
										</div>
									</div>
								)}

								{activeTab === 'errors' && (
									<div className="space-y-4">
										<p className="text-gray-600">Common error responses for this endpoint:</p>
										<div className="space-y-4">
											<div className="border border-red-200 rounded-lg p-4">
												<div className="flex items-center gap-2 mb-2">
													<span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">400</span>
													<span className="font-medium">Bad Request</span>
												</div>
												<p className="text-gray-600 text-sm mb-2">Invalid parameters provided</p>
												<pre className="bg-gray-50 p-3 rounded text-sm">
{`{
	"error": {
		"type": "invalid_request_error",
		"message": "Missing required parameter: amount"
	}
}`}
												</pre>
											</div>

											<div className="border border-orange-200 rounded-lg p-4">
												<div className="flex items-center gap-2 mb-2">
													<span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-sm font-medium">401</span>
													<span className="font-medium">Unauthorized</span>
												</div>
												<p className="text-gray-600 text-sm mb-2">Authentication failed</p>
												<pre className="bg-gray-50 p-3 rounded text-sm">
{`{
	"error": {
		"type": "authentication_error",
		"message": "Invalid API key provided"
	}
}`}
												</pre>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Quick Actions */}
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="font-medium mb-4">Quick Actions</h3>
							<div className="space-y-3">
								<button 
									onClick={() => handleCopy(codeExamples.javascript)}
									className="w-full flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] text-white rounded-lg hover:opacity-90 transition-opacity"
								>
									<Copy className="w-4 h-4" />
									Copy Code
								</button>
							</div>
						</div>

						{/* API Info */}
						<div className="bg-white border border-gray-200 rounded-lg p-6">
							<h3 className="font-medium mb-4">API Information</h3>
							<div className="space-y-3 text-sm">
								<div className="flex justify-between">
									<span className="text-gray-600">Category:</span>
									<span className="font-medium">{api.category}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Authentication:</span>
									<span className="font-medium">{api.authRequired ? 'Required' : 'Not Required'}</span>
								</div>
								{api.provider && (
									<div className="flex justify-between">
										<span className="text-gray-600">Provider:</span>
										<span className="font-medium">{api.provider}</span>
									</div>
								)}
								{api.difficulty && (
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
								)}
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
								{api.rate_limit && (
									<div className="flex justify-between">
										<span className="text-gray-600">Rate Limit:</span>
										<span className="font-medium text-xs">{api.rate_limit}</span>
									</div>
								)}
							</div>
							{/* Documentation Link */}
							{api.documentation_url && (
								<div className="mt-4 pt-4 border-t border-gray-200">
									<a
										href={api.documentation_url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:text-blue-700 text-sm underline"
									>
										View Official Documentation →
									</a>
								</div>
							)}
							{/* Tags */}
							{api.tags && api.tags.length > 0 && (
								<div className="mt-4 pt-4 border-t border-gray-200">
									<h4 className="font-medium mb-2 text-sm">Tags</h4>
									<div className="flex flex-wrap gap-1">
										{api.tags.map((tag, index) => (
											<span
												key={index}
												className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
											>
												{tag}
											</span>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
