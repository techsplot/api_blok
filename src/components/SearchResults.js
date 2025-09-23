import { useState, useMemo } from 'react';
import { ArrowLeft, Search, Filter, Code, Shield, Zap, X } from 'lucide-react';

export function SearchResults({ query, data, onApiSelect, onNavigate }) {
	const [filters, setFilters] = useState({});
	const [showFilters, setShowFilters] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const pageSize = 10;

	// Get available facets from data
	const availableFacets = useMemo(() => {
		const facets = {
			category: [],
			method: [],
			difficulty: [],
			pricing: [],
			provider: [],
		};
		data.forEach(api => {
			if (api.category && !facets.category.includes(api.category)) facets.category.push(api.category);
			if (api.method && !facets.method.includes(api.method)) facets.method.push(api.method);
			if (api.difficulty && !facets.difficulty.includes(api.difficulty)) facets.difficulty.push(api.difficulty);
			if (api.pricing && !facets.pricing.includes(api.pricing)) facets.pricing.push(api.pricing);
			if (api.provider && !facets.provider.includes(api.provider)) facets.provider.push(api.provider);
		});
		return facets;
	}, [data]);

	// Filter data based on query and filters
	const filteredResults = useMemo(() => {
		let results = data;
		if (query) {
			const q = query.toLowerCase();
			results = results.filter(api =>
				api.name?.toLowerCase().includes(q) ||
				api.description?.toLowerCase().includes(q) ||
				api.category?.toLowerCase().includes(q)
			);
		}
		if (filters.category && filters.category.length)
			results = results.filter(api => filters.category.includes(api.category));
		if (filters.method && filters.method.length)
			results = results.filter(api => filters.method.includes(api.method));
		if (filters.difficulty && filters.difficulty.length)
			results = results.filter(api => filters.difficulty.includes(api.difficulty));
		if (filters.pricing && filters.pricing.length)
			results = results.filter(api => filters.pricing.includes(api.pricing));
		if (filters.provider && filters.provider.length)
			results = results.filter(api => filters.provider.includes(api.provider));
		if (filters.authRequired !== undefined)
			results = results.filter(api => api.authRequired === filters.authRequired);
		return results;
	}, [data, query, filters]);

	const totalHits = filteredResults.length;
	const totalPages = Math.ceil(totalHits / pageSize);
	const paginatedResults = filteredResults.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

	const getMethodColor = (method) => {
		switch (method) {
			case 'GET': return 'text-blue-600 bg-blue-50';
			case 'POST': return 'text-green-600 bg-green-50';
			case 'PUT': return 'text-yellow-600 bg-yellow-50';
			case 'DELETE': return 'text-red-600 bg-red-50';
			case 'PATCH': return 'text-purple-600 bg-purple-50';
			default: return 'text-gray-600 bg-gray-50';
		}
	};

	const handleFilterChange = (filterType, value) => {
		setFilters(prev => {
			const currentValues = prev[filterType] || [];
			const newValues = currentValues.includes(value)
				? currentValues.filter(v => v !== value)
				: [...currentValues, value];
			return {
				...prev,
				[filterType]: newValues.length > 0 ? newValues : undefined
			};
		});
		setCurrentPage(0);
	};

	const handleAuthFilterChange = (value) => {
		setFilters(prev => ({
			...prev,
			authRequired: prev.authRequired === value ? undefined : value
		}));
		setCurrentPage(0);
	};

	const clearFilter = (filterType, value) => {
		setFilters(prev => {
			if (value && Array.isArray(prev[filterType])) {
				const newValues = prev[filterType].filter(v => v !== value);
				return {
					...prev,
					[filterType]: newValues.length > 0 ? newValues : undefined
				};
			} else {
				return {
					...prev,
					[filterType]: undefined
				};
			}
		});
	};

	const clearAllFilters = () => {
		setFilters({});
		setCurrentPage(0);
	};

	const hasActiveFilters = Object.values(filters).some(filter =>
		filter !== undefined && (Array.isArray(filter) ? filter.length > 0 : true)
	);

	// Simple highlight function
	const renderHighlightedText = (text) => {
		if (!query) return text;
		const parts = text.split(new RegExp(`(${query})`, 'gi'));
		return (
			<>
				{parts.map((part, i) =>
					part.toLowerCase() === query.toLowerCase() ? (
						<span key={i} className="bg-yellow-200">{part}</span>
					) : (
						part
					)
				)}
			</>
		);
	};

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								onClick={() => onNavigate('home')}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<ArrowLeft className="w-5 h-5" />
							</button>
							<div>
								<h1 className="text-2xl font-medium">Search Results</h1>
								<div className="text-gray-500 flex items-center gap-2">
									<span>{totalHits} result{totalHits !== 1 ? 's' : ''}</span>
									{query && <span>for "{query}"</span>}
								</div>
							</div>
						</div>
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<Filter className="w-5 h-5" />
						</button>
					</div>
					{/* Active Filters */}
					{hasActiveFilters && (
						<div className="mt-4 flex items-center gap-2 flex-wrap">
							<span className="text-sm font-medium text-gray-700">Active filters:</span>
							{filters.category?.map(category => (
								<button
									key={category}
									onClick={() => clearFilter('category', category)}
									className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
								>
									<span>Category: {category}</span>
									<X className="w-3 h-3" />
								</button>
							))}
							{filters.method?.map(method => (
								<button
									key={method}
									onClick={() => clearFilter('method', method)}
									className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
								>
									<span>{method}</span>
									<X className="w-3 h-3" />
								</button>
							))}
							{filters.authRequired !== undefined && (
								<button
									onClick={() => clearFilter('authRequired')}
									className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
								>
									<span>Auth: {filters.authRequired ? 'Required' : 'Not Required'}</span>
									<X className="w-3 h-3" />
								</button>
							)}
							{filters.difficulty?.map(difficulty => (
								<button
									key={difficulty}
									onClick={() => clearFilter('difficulty', difficulty)}
									className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
								>
									<span>{difficulty}</span>
									<X className="w-3 h-3" />
								</button>
							))}
							{filters.pricing?.map(pricing => (
								<button
									key={pricing}
									onClick={() => clearFilter('pricing', pricing)}
									className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
								>
									<span>{pricing}</span>
									<X className="w-3 h-3" />
								</button>
							))}
							<button
								onClick={clearAllFilters}
								className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm underline"
							>
								Clear all
							</button>
						</div>
					)}
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 py-8">
				<div className="flex gap-8">
					{/* Filters Sidebar */}
					<div className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
						<div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
							<div className="flex items-center gap-2 mb-6">
								<Filter className="w-5 h-5" />
								<h2 className="font-medium">Filters</h2>
								{hasActiveFilters && (
									<button
										onClick={clearAllFilters}
										className="ml-auto text-xs text-blue-600 hover:text-blue-800"
									>
										Clear all
									</button>
								)}
							</div>
							<div className="space-y-6">
								{/* Category Filter */}
								{availableFacets.category.length > 0 && (
									<div>
										<h3 className="font-medium mb-3">Category</h3>
										<div className="space-y-2 max-h-40 overflow-y-auto">
											{availableFacets.category.map(category => (
												<label key={category} className="flex items-center gap-2 cursor-pointer">
													<input
														type="checkbox"
														checked={filters.category?.includes(category) || false}
														onChange={() => handleFilterChange('category', category)}
														className="rounded border-gray-300"
													/>
													<span className="text-sm">{category}</span>
												</label>
											))}
										</div>
									</div>
								)}
								{/* Method Filter */}
								{availableFacets.method.length > 0 && (
									<div>
										<h3 className="font-medium mb-3">Method</h3>
										<div className="space-y-2">
											{availableFacets.method.map(method => (
												<label key={method} className="flex items-center gap-2 cursor-pointer">
													<input
														type="checkbox"
														checked={filters.method?.includes(method) || false}
														onChange={() => handleFilterChange('method', method)}
														className="rounded border-gray-300"
													/>
													<span className={`text-xs px-2 py-1 rounded ${getMethodColor(method)}`}>
														{method}
													</span>
												</label>
											))}
										</div>
									</div>
								)}
								{/* Auth Required Filter */}
								<div>
									<h3 className="font-medium mb-3">Authentication</h3>
									<div className="space-y-2">
										<label className="flex items-center gap-2 cursor-pointer">
											<input
												type="checkbox"
												checked={filters.authRequired === true}
												onChange={() => handleAuthFilterChange(true)}
												className="rounded border-gray-300"
											/>
											<span className="text-sm">Auth Required</span>
										</label>
										<label className="flex items-center gap-2 cursor-pointer">
											<input
												type="checkbox"
												checked={filters.authRequired === false}
												onChange={() => handleAuthFilterChange(false)}
												className="rounded border-gray-300"
											/>
											<span className="text-sm">No Auth Required</span>
										</label>
									</div>
								</div>
								{/* Difficulty Filter */}
								{availableFacets.difficulty.length > 0 && (
									<div>
										<h3 className="font-medium mb-3">Difficulty</h3>
										<div className="space-y-2">
											{availableFacets.difficulty.map(difficulty => (
												<label key={difficulty} className="flex items-center gap-2 cursor-pointer">
													<input
														type="checkbox"
														checked={filters.difficulty?.includes(difficulty) || false}
														onChange={() => handleFilterChange('difficulty', difficulty)}
														className="rounded border-gray-300"
													/>
													<span className="text-sm capitalize">{difficulty}</span>
												</label>
											))}
										</div>
									</div>
								)}
								{/* Pricing Filter */}
								{availableFacets.pricing.length > 0 && (
									<div>
										<h3 className="font-medium mb-3">Pricing</h3>
										<div className="space-y-2">
											{availableFacets.pricing.map(pricing => (
												<label key={pricing} className="flex items-center gap-2 cursor-pointer">
													<input
														type="checkbox"
														checked={filters.pricing?.includes(pricing) || false}
														onChange={() => handleFilterChange('pricing', pricing)}
														className="rounded border-gray-300"
													/>
													<span className="text-sm capitalize">{pricing}</span>
												</label>
											))}
										</div>
									</div>
								)}
								{/* Provider Filter */}
								{availableFacets.provider.length > 0 && (
									<div>
										<h3 className="font-medium mb-3">Provider</h3>
										<div className="space-y-2 max-h-40 overflow-y-auto">
											{availableFacets.provider.map(provider => (
												<label key={provider} className="flex items-center gap-2 cursor-pointer">
													<input
														type="checkbox"
														checked={filters.provider?.includes(provider) || false}
														onChange={() => handleFilterChange('provider', provider)}
														className="rounded border-gray-300"
													/>
													<span className="text-sm">{provider}</span>
												</label>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
					{/* Results */}
					<div className="flex-1">
						{paginatedResults.length === 0 ? (
							<div className="text-center py-12">
								<Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
								<h3 className="text-xl font-medium text-gray-500 mb-2">No APIs found</h3>
								<p className="text-gray-400">Try adjusting your search terms or filters</p>
								{hasActiveFilters && (
									<button
										onClick={clearAllFilters}
										className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
									>
										Clear all filters
									</button>
								)}
							</div>
						) : (
							<>
								<div className="space-y-4">
									{paginatedResults.map(api => (
										<div
											key={api.id}
											onClick={() => onApiSelect(api)}
											className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group"
										>
											<div className="flex items-start justify-between mb-4">
												<div className="flex-1">
													<div className="flex items-center gap-3 mb-2">
														<h3 className="text-xl font-medium group-hover:text-blue-600 transition-colors">
															{renderHighlightedText(api.name)}
														</h3>
														<span className={`px-2 py-1 rounded-md text-xs font-medium ${getMethodColor(api.method)}`}>
															{api.method}
														</span>
														{api.difficulty && (
															<span className={`px-2 py-1 rounded-md text-xs font-medium ${
																api.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
																api.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
																'bg-red-100 text-red-700'
															}`}>
																{api.difficulty}
															</span>
														)}
													</div>
													<p className="text-gray-600 mb-3">
														{renderHighlightedText(api.description)}
													</p>
													<div className="flex items-center gap-4 text-sm text-gray-500">
														<div className="flex items-center gap-1">
															<Code className="w-4 h-4" />
															<span className="font-mono">{api.endpoint}</span>
														</div>
														{api.authRequired && (
															<div className="flex items-center gap-1">
																<Shield className="w-4 h-4" />
																<span>Auth Required</span>
															</div>
														)}
														{api.provider && (
															<div className="flex items-center gap-1">
																<span>by {api.provider}</span>
															</div>
														)}
													</div>
												</div>
												<div className="ml-4 flex flex-col gap-2">
													<span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
														{api.category}
													</span>
													{api.pricing && (
														<span className={`text-xs px-2 py-1 rounded-md ${
															api.pricing === 'free' ? 'bg-green-100 text-green-700' :
															api.pricing === 'freemium' ? 'bg-blue-100 text-blue-700' :
															'bg-orange-100 text-orange-700'
														}`}>
															{api.pricing}
														</span>
													)}
												</div>
											</div>
											{/* Examples */}
											{api.commonUses && api.commonUses.length > 0 && (
												<div className="flex items-center gap-2">
													<Zap className="w-4 h-4 text-gray-400" />
													<span className="text-sm text-gray-500">Common uses:</span>
													<div className="flex gap-2 flex-wrap">
														{api.commonUses.slice(0, 3).map((example, index) => (
															<span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
																{example}
															</span>
														))}
													</div>
												</div>
											)}
										</div>
									))}
								</div>
								{/* Pagination */}
								{totalPages > 1 && (
									<div className="mt-8 flex items-center justify-center gap-2">
										<button
											onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
											disabled={currentPage === 0}
											className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
										>
											Previous
										</button>
										<div className="flex items-center gap-1">
											{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
												const pageNum = currentPage < 3 ? i : currentPage - 2 + i;
												if (pageNum >= totalPages) return null;
												return (
													<button
														key={pageNum}
														onClick={() => setCurrentPage(pageNum)}
														className={`px-3 py-2 rounded-lg ${
															currentPage === pageNum
																? 'bg-blue-600 text-white'
																: 'border border-gray-300 hover:bg-gray-50'
														}`}
													>
														{pageNum + 1}
													</button>
												);
											})}
										</div>
										<button
											onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
											disabled={currentPage >= totalPages - 1}
											className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
										>
											Next
										</button>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
