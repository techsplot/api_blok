module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended'
  ],
  plugins: ['jest'],
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    // Meta-specific code quality rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',
    'eqeqeq': 'error',
    'curly': 'error',
    
    // React specific
    'react/prop-types': 'off', // Using TypeScript instead
    'react/react-in-jsx-scope': 'off', // Next.js auto-imports React
    'react/display-name': 'off',
    
    // Next.js specific
    '@next/next/no-img-element': 'error',
    '@next/next/no-html-link-for-pages': 'error',
    
    // Performance
    'no-await-in-loop': 'warn',
    'require-atomic-updates': 'error'
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.jsx'],
      env: {
        jest: true
      },
      rules: {
        'no-console': 'off'
      }
    }
  ]
};