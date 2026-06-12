import type { Config } from 'tailwindcss'

/**
 * DI Dreamlabs brand tokens — exact values from Brand Guidelines v1.0.
 * Do not approximate these colours (see CLAUDE.md "Do Not Touch").
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        violet: { ray: '#8B32FF' },
        navy: { deep: '#040F49' },
        rebecca: '#64378B',
        magenta: { bloom: '#F0386B' },
        cyan: { strong: '#00DFDF' },
        offwhite: '#F4F4F8',
      },
      fontFamily: {
        heading: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: { content: '72rem' },
      boxShadow: {
        'glow-violet': '0 0 24px 0 rgba(139, 50, 255, 0.35)',
        'glow-violet-lg': '0 0 48px 8px rgba(139, 50, 255, 0.45)',
        card: '0 4px 24px rgba(4, 15, 73, 0.08)',
        'card-hover': '0 12px 32px rgba(4, 15, 73, 0.14)',
      },
      borderRadius: { card: '12px' },
    },
  },
  plugins: [],
} satisfies Config
