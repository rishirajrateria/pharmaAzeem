import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

/** Flat config (ESLint 9) using the native eslint-config-next 16 exports. */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    files: ['src/seed/**', 'scripts/**', 'src/hooks/revalidate.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
  {
    ignores: ['.next/**', 'src/payload-types.ts', 'src/app/(payload)/admin/importMap.js', 'data/**', 'media/**', 'public/**'],
  },
]

export default eslintConfig
