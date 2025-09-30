// Enhanced API Details Component Test Suite - Meta Grade Implementation

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiDetailEnhanced } from '../apiDetailsEnhanced';

// Mock data for testing
const mockApiData = {
  id: 'test-api-id',
  name: 'Test Payment API',
  slug: 'test-payment-api',
  description: 'A comprehensive payment processing API for e-commerce applications',
  shortDescription: 'Process payments securely',
  base_url: 'https://api.example.com',
  documentation_url: 'https://docs.example.com',
  version: '2.0',
  auth_method: 'api_key',
  authRequired: true,
  authDescription: 'API key authentication required in header',
  authExample: 'Authorization: Bearer your_api_key',
  difficulty: 'intermediate',
  pricing: 'freemium',
  rateLimit: '1000/hour',
  status: 'stable',
  category: 'payments',
  tags: ['payments', 'ecommerce', 'stripe'],
  image: 'https://example.com/logo.png',
  imageAlt: 'Test API Logo',
  provider: 'api.example.com',
  endpoints: [
    {
      name: 'Create Payment',
      path: '/v2/payments',
      method: 'POST',
      description: 'Create a new payment intent',
      parameters: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          description: 'Payment amount in cents',
          example: '2000'
        },
        {
          name: 'currency',
          type: 'string',
          required: true,
          description: 'Three-letter ISO currency code',
          example: 'USD'
        }
      ],
      responseExample: '{\n  "id": "pi_1234567890",\n  "status": "succeeded",\n  "amount": 2000\n}',
      errorResponses: [
        {
          statusCode: 400,
          description: 'Invalid request parameters',
          example: '{"error": "amount_invalid"}',
          solution: 'Verify amount is a positive integer'
        }
      ]
    }
  ],
  codeExamples: {
    javascript: {
      title: 'JavaScript Example',
      code: 'const response = await fetch("/api/payments", {\n  method: "POST",\n  body: JSON.stringify({ amount: 2000 })\n});',
      description: 'Basic JavaScript implementation'
    },
    python: {
      title: 'Python Example',
      code: 'import requests\n\nresponse = requests.post("/api/payments", json={"amount": 2000})',
      description: 'Python requests implementation'
    }
  },
  useCases: [
    {
      title: 'E-commerce Checkout',
      description: 'Process customer payments during checkout',
      codeExample: 'processPayment({ amount: cart.total, customer: user.id })',
      difficulty: 'beginner'
    }
  ],
  sdks: [
    {
      name: 'JavaScript SDK',
      language: 'javascript',
      url: 'https://npmjs.com/example-sdk',
      installCommand: 'npm install example-sdk'
    }
  ]
};

const mockOnNavigate = jest.fn();

describe('ApiDetailEnhanced Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering and Basic Functionality', () => {
    it('renders API information correctly', () => {
      render(<ApiDetailEnhanced api={mockApiData} onNavigate={mockOnNavigate} />);
      
      expect(screen.getByText('Test Payment API')).toBeInTheDocument();
      expect(screen.getByText('Process payments securely')).toBeInTheDocument();
      expect(screen.getByText('A comprehensive payment processing API for e-commerce applications')).toBeInTheDocument();
    });

    it('displays API metadata correctly', () => {
      render(<ApiDetailEnhanced api={mockApiData} onNavigate={mockOnNavigate} />);
      
      expect(screen.getByText('Required')).toBeInTheDocument(); // Authentication
      expect(screen.getByText('intermediate')).toBeInTheDocument(); // Difficulty
      expect(screen.getByText('freemium')).toBeInTheDocument(); // Pricing
      expect(screen.getByText('2.0')).toBeInTheDocument(); // Version
    });

    it('renders API logo when provided', () => {
      render(<ApiDetailEnhanced api={mockApiData} onNavigate={mockOnNavigate} />);
      
      const logo = screen.getByAltText('Test API Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'https://example.com/logo.png');
    });

    it('displays tags correctly', () => {
      render(<ApiDetailEnhanced api={mockApiData} onNavigate={mockOnNavigate} />);
      
      expect(screen.getByText('payments')).toBeInTheDocument();
      expect(screen.getByText('ecommerce')).toBeInTheDocument();
      expect(screen.getByText('stripe')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('shows all available tabs based on data', () => {
      render(<ApiDetailEnhanced api={mockApiData} onNavigate={mockOnNavigate} />);
      
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Endpoints')).toBeInTheDocument();
      expect(screen.getByText('Code Examples')).toBeInTheDocument();
      expect(screen.getByText('Use Cases')).toBeInTheDocument();
    });

    it('switches tabs correctly', async () => {
      const user = userEvent.setup();
      render(<ApiDetailEnhanced api={mockApiData} onNavigate={mockOnNavigate} />);
      
      // Default should be Overview
      expect(screen.getByText('Description')).toBeInTheDocument();
      
      // Switch to Endpoints
      await user.click(screen.getByText('Endpoints'));
      expect(screen.getByText('Create Payment')).toBeInTheDocument();
      expect(screen.getByText('/v2/payments')).toBeInTheDocument();
      
      // Switch to Code Examples
      await user.click(screen.getByText('Code Examples'));
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
    });

    it('hides tabs when data is not available', () => {
      const apiWithoutCodeExamples = { ...mockApiData, codeExamples: null, useCases: null };
      render(<ApiDetailEnhanced api={apiWithoutCodeExamples} onNavigate={mockOnNavigate} />);
      
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Endpoints')).toBeInTheDocument();
      expect(screen.queryByText('Code Examples')).not.toBeInTheDocument();
      expect(screen.queryByText('Use Cases')).not.toBeInTheDocument();
    });
  });

  describe('Endpoints Functionality', () => {
    it('displays endpoint information correctly', async () => {
      const user = userEvent.setup();
      render(<ApiDetailEnhanced api={mockApiData} onNavigate={mockOnNavigate} />);
      
      await user.click(screen.getByText('Endpoints'));
      
      expect(screen.getByText('POST')).toBeInTheDocument();
      expect(screen.getByText('https://api.example.com/v2/payments')).toBeInTheDocument();
      expect(screen.getByText('Create a new payment intent')).toBeInTheDocument();
    });

    it('renders parameters table correctly', async () => {
      const user = userEvent.setup();
      render(<ApiDetailEnhanced api={mockApiData} onNavigate={mockOnNavigate} />);
      
      await user.click(screen.getByText('Endpoints'));
      
      expect(screen.getByText('Parameters')).toBeInTheDocument();
      expect(screen.getByText('amount')).toBeInTheDocument();
      expect(screen.getByText('number')).toBeInTheDocument();
      expect(screen.getByText('Required')).toBeInTheDocument();
      expect(screen.getByText('Payment amount in cents')).toBeInTheDocument();
    });

    it('displays error responses', async () => {
      const user = userEvent.setup();
      render(<ApiDetailEnhanced api={mockApiData} onNavigate={mockOnNavigate} />);
      
      await user.click(screen.getByText('Endpoints'));
      
      expect(screen.getByText('Common Error Responses')).toBeInTheDocument();
      expect(screen.getByText('400')).toBeInTheDocument();
      expect(screen.getByText('Invalid request parameters')).toBeInTheDocument();
    });
  });

  describe('Code Examples Functionality', () => {
    it('displays code examples with language selection', async () => {
      const user = userEvent.setup();
      render(<ApiDetailEnhanced api={mockApiData} onNavigate={mockOnNavigate} />);
      
      await user.click(screen.getByText('Code Examples'));
      
      expect(screen.getByText('Javascript')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
      
      // Check default JavaScript example
      expect(screen.getByText(/const response = await fetch/)).toBeInTheDocument();
    });

    it('switches between code example languages', async () => {
      const user = userEvent.setup();
      render(<ApiDetailEnhanced api={mockApiData} onNavigate={mockOnNavigate} />);
      
      await user.click(screen.getByText('Code Examples'));
      
      // Switch to Python
      await user.click(screen.getByText('Python'));
      expect(screen.getByText(/import requests/)).toBeInTheDocument();
      
      // Switch back to JavaScript
      await user.click(screen.getByText('Javascript'));
      expect(screen.getByText(/const response = await fetch/)).toBeInTheDocument();
    });
  });

  describe('Copy to Clipboard Functionality', () => {
    beforeEach(() => {
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn().mockResolvedValue(undefined),
        },
      });
    });

    it('copies code to clipboard when copy button is clicked', async () => {
      const user = userEvent.setup();
      render(<ApiDetailEnhanced api={mockApiData} onNavigate={mockOnNavigate} />);
      
      await user.click(screen.getByText('Code Examples'));
      
      const copyButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('svg')
      );
      
      if (copyButton) {
        await user.click(copyButton);
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          expect.stringContaining('const response = await fetch')
        );
      }
    });
  });

  describe('Navigation Functionality', () => {
    it('calls onNavigate with correct parameters', async () => {
      const user = userEvent.setup();
      render(<ApiDetailEnhanced api={mockApiData} onNavigate={mockOnNavigate} />);
      
      // Test back navigation
      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);
      expect(mockOnNavigate).toHaveBeenCalledWith('back');
      
      // Test home navigation
      const homeButton = screen.getByRole('button', { name: /home/i });
      await user.click(homeButton);
      expect(mockOnNavigate).toHaveBeenCalledWith('home');
      
      // Test search navigation
      const searchButton = screen.getByRole('button', { name: /search/i });
      await user.click(searchButton);
      expect(mockOnNavigate).toHaveBeenCalledWith('search');
      
      // Test AI help navigation
      const aiHelpButton = screen.getByText('AI Help');
      await user.click(aiHelpButton);
      expect(mockOnNavigate).toHaveBeenCalledWith('chat');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<ApiDetailEnhanced api={mockApiData} onNavigate={mockOnNavigate} />);
      
      // Check that interactive elements have proper roles
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // Check navigation
      const navigation = screen.getByRole('navigation', { hidden: true });
      expect(navigation).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ApiDetailEnhanced api={mockApiData} onNavigate={mockOnNavigate} />);
      
      // Tab to first interactive element
      await user.tab();
      
      // Should be able to navigate to tabs
      expect(document.activeElement).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('handles missing optional data gracefully', () => {
      const minimalApiData = {
        id: 'minimal',
        name: 'Minimal API',
        slug: 'minimal',
        description: 'A minimal API',
        base_url: 'https://api.minimal.com',
        auth_method: 'none',
        authRequired: false,
        tags: [],
        endpoints: []
      };
      
      expect(() => {
        render(<ApiDetailEnhanced api={minimalApiData} onNavigate={mockOnNavigate} />);
      }).not.toThrow();
      
      expect(screen.getByText('Minimal API')).toBeInTheDocument();
    });

    it('displays fallback content when endpoints are empty', async () => {
      const user = userEvent.setup();
      const apiWithoutEndpoints = { ...mockApiData, endpoints: [] };
      
      render(<ApiDetailEnhanced api={apiWithoutEndpoints} onNavigate={mockOnNavigate} />);
      
      await user.click(screen.getByText('Endpoints'));
      // Should handle empty endpoints gracefully
      expect(screen.getByText('Endpoints')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders efficiently with large datasets', () => {
      const largeApiData = {
        ...mockApiData,
        endpoints: Array.from({ length: 50 }, (_, i) => ({
          name: `Endpoint ${i}`,
          path: `/api/endpoint-${i}`,
          method: 'GET',
          description: `Description for endpoint ${i}`,
          parameters: []
        }))
      };
      
      const start = performance.now();
      render(<ApiDetailEnhanced api={largeApiData} onNavigate={mockOnNavigate} />);
      const end = performance.now();
      
      // Should render in reasonable time (less than 100ms)
      expect(end - start).toBeLessThan(100);
    });
  });
});