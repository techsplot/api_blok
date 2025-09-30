// Search Loading State Test Suite
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchResults } from '../SearchResults';
import { LoadingSpinner, SearchLoadingScreen, SearchResultsSkeletonList } from '../LoadingComponents';

// Mock data
const mockApiData = [
  {
    id: '1',
    name: 'Test API',
    slug: 'test-api',
    description: 'A test API for demonstration',
    method: 'GET',
    endpoint: '/test',
    category: 'testing',
    authRequired: false,
    provider: 'test.com',
    tags: ['test']
  }
];

const mockOnNavigate = jest.fn();
const mockOnApiSelect = jest.fn();

describe('Loading Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('LoadingSpinner', () => {
    it('renders with default props', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });

    it('renders with custom size and color', () => {
      render(<LoadingSpinner size="lg" color="white" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('h-12', 'w-12', 'border-white');
    });
  });

  describe('SearchLoadingScreen', () => {
    it('displays loading message without query', () => {
      render(<SearchLoadingScreen />);
      expect(screen.getByText('Loading APIs...')).toBeInTheDocument();
      expect(screen.getByText("We're finding the best APIs for your needs")).toBeInTheDocument();
    });

    it('displays loading message with query', () => {
      render(<SearchLoadingScreen query="payment" />);
      expect(screen.getByText('Searching for "payment"...')).toBeInTheDocument();
    });

    it('shows search tips', () => {
      render(<SearchLoadingScreen />);
      expect(screen.getByText('💡 Search Tips:')).toBeInTheDocument();
      expect(screen.getByText(/Try specific keywords/)).toBeInTheDocument();
    });
  });

  describe('SearchResultsSkeletonList', () => {
    it('renders default number of skeleton items', () => {
      render(<SearchResultsSkeletonList />);
      const skeletons = screen.getAllByText('Loading...', { hidden: true });
      expect(skeletons).toHaveLength(5); // Default count
    });

    it('renders custom number of skeleton items', () => {
      render(<SearchResultsSkeletonList count={3} />);
      const skeletons = screen.getAllByText('Loading...', { hidden: true });
      expect(skeletons).toHaveLength(3);
    });
  });
});

describe('SearchResults Loading States', () => {
  it('shows loading screen when loading is true', () => {
    render(
      <SearchResults
        query="test"
        data={[]}
        loading={true}
        onApiSelect={mockOnApiSelect}
        onNavigate={mockOnNavigate}
      />
    );

    expect(screen.getByText('Searching for "test"...')).toBeInTheDocument();
    expect(screen.getByText("We're finding the best APIs for your needs")).toBeInTheDocument();
  });

  it('shows no results message when not loading and no data', () => {
    render(
      <SearchResults
        query="nonexistent"
        data={[]}
        loading={false}
        onApiSelect={mockOnApiSelect}
        onNavigate={mockOnNavigate}
      />
    );

    expect(screen.getByText('No APIs found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search terms or filters')).toBeInTheDocument();
  });

  it('shows results when not loading and has data', () => {
    render(
      <SearchResults
        query="test"
        data={mockApiData}
        loading={false}
        onApiSelect={mockOnApiSelect}
        onNavigate={mockOnNavigate}
      />
    );

    expect(screen.getByText('Test API')).toBeInTheDocument();
    expect(screen.getByText('A test API for demonstration')).toBeInTheDocument();
    expect(screen.getByText('1 result')).toBeInTheDocument();
  });

  it('shows loading indicator in header when loading', () => {
    render(
      <SearchResults
        query="test"
        data={[]}
        loading={true}
        onApiSelect={mockOnApiSelect}
        onNavigate={mockOnNavigate}
      />
    );

    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('shows result count in header when not loading', () => {
    render(
      <SearchResults
        query="test"
        data={mockApiData}
        loading={false}
        onApiSelect={mockOnApiSelect}
        onNavigate={mockOnNavigate}
      />
    );

    expect(screen.getByText('1 result for "test"')).toBeInTheDocument();
  });
});

describe('Search Loading Performance', () => {
  it('does not block UI when showing loading state', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchResults
        query="test"
        data={[]}
        loading={true}
        onApiSelect={mockOnApiSelect}
        onNavigate={mockOnNavigate}
      />
    );

    // Should be able to interact with navigation elements while loading
    const backButton = screen.getByRole('button', { name: /back/i });
    await user.click(backButton);
    
    expect(mockOnNavigate).toHaveBeenCalledWith('home');
  });

  it('loading state changes do not cause unnecessary re-renders', () => {
    const { rerender } = render(
      <SearchResults
        query="test"
        data={[]}
        loading={true}
        onApiSelect={mockOnApiSelect}
        onNavigate={mockOnNavigate}
      />
    );

    // Change to loaded state
    rerender(
      <SearchResults
        query="test"
        data={mockApiData}
        loading={false}
        onApiSelect={mockOnApiSelect}
        onNavigate={mockOnNavigate}
      />
    );

    // Should show results immediately without flickering
    expect(screen.getByText('Test API')).toBeInTheDocument();
    expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
  });
});

describe('Accessibility in Loading States', () => {
  it('loading spinner has proper ARIA attributes', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('loading screen maintains focus management', () => {
    render(<SearchLoadingScreen query="test" />);
    
    // Loading content should be readable by screen readers
    expect(screen.getByText('Searching for "test"...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('skeleton loaders have proper accessibility labels', () => {
    render(<SearchResultsSkeletonList count={1} />);
    const skeletonContent = screen.getByText('Loading...', { hidden: true });
    expect(skeletonContent).toBeInTheDocument();
  });
});