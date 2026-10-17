import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/'] },
  js.configs.recommended,
  {
    // Código del juego: se ejecuta en el navegador
    files: ['src/**/*.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    // Pruebas y herramientas: se ejecutan en Node
    files: ['tests/**/*.js', 'eslint.config.js'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  {
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      eqeqeq: 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];
