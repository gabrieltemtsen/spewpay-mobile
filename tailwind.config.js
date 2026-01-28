/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary - Deep blue gradient for fintech trust
        primary: {
          50: '#E6F0FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          500: '#0066FF', // Main primary
          600: '#0052CC',
          700: '#003D99',
          800: '#002966',
          900: '#001433',
          950: '#000A1A',
        },
        // Accent - Teal for success/positive
        accent: {
          50: '#E6FFF9',
          100: '#B3FFE6',
          200: '#80FFD4',
          300: '#4DFFC1',
          400: '#1AFFAF',
          500: '#00E699', // Main accent
          600: '#00B377',
          700: '#008055',
          800: '#004D33',
          900: '#001A11',
        },
        // Warning - Coral for alerts
        warning: {
          50: '#FFF5F2',
          100: '#FFE5DE',
          200: '#FFCBBE',
          300: '#FFB19D',
          400: '#FF977D',
          500: '#FF7D5C', // Main warning
          600: '#CC644A',
          700: '#994B37',
          800: '#663225',
          900: '#331912',
        },
        // Success
        success: {
          500: '#10B981',
          600: '#059669',
        },
        // Error
        error: {
          500: '#EF4444',
          600: '#DC2626',
        },
        // Background colors - OLED optimized
        background: {
          light: '#FFFFFF',
          dark: '#000000',
        },
        surface: {
          light: '#F8FAFC',
          dark: '#0A0A0B',
        },
        card: {
          light: '#FFFFFF',
          dark: '#111113',
        },
        // Text colors
        foreground: {
          light: '#0F172A',
          dark: '#F8FAFC',
        },
        muted: {
          light: '#64748B',
          dark: '#94A3B8',
        },
        // Border colors
        border: {
          light: '#E2E8F0',
          dark: '#1E293B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.08)',
        'card-dark': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 40px rgba(0, 102, 255, 0.15)',
        'glow-accent': '0 0 40px rgba(0, 230, 153, 0.15)',
      },
    },
  },
  plugins: [],
};
