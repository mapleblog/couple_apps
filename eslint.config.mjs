import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    files: [
      'app/**/*.{ts,tsx}',
      'components/**/*.{ts,tsx}',
      'actions/**/*.{ts,tsx}',
      'lib/**/*.{ts,tsx}'
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      'simple-import-sort': simpleImportSort
    },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  }
]
