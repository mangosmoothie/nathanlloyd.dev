/** @type {import('tailwindcss').Config} */
module.exports = {
    // Enables dark mode using the 'class' strategy for manual toggle
    darkMode: 'class',
    content: ['./index.html', './pages/**/*.html', './src/**/*.{js,ts,html}'],
    theme: {
        extend: {
            colors: {
                primary: '#0F766E', // Teal-700
                accent: '#D97706', // Amber-600
                brandBg: {
                    light: '#F8FAFC',
                    dark: '#0F172A',
                },
                brandText: {
                    primary: '#1E2937',
                    secondary: '#64748B',
                },
            },
            fontFamily: {
                heading: ['Inter', 'system-ui', 'sans-serif'],
                body: ['Inter', 'system-ui', 'sans-serif'],
            },
            fontWeight: {
                heading: 700,
                body: 400,
            },
            spacing: {
                // base: 4px matching your scale
                'brand-none': '0px',
                'brand-xs': '4px',
                'brand-sm': '8px',
                'brand-md': '12px',
                'brand-lg': '16px',
                'brand-xl': '24px',
                'brand-xxl': '32px',
                'brand-xxxl': '48px',
                'brand-huge': '64px',
            },
            borderRadius: {
                default: '16px',
                large: '24px',
            },
            boxShadow: {
                card: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            },
        },
    },
    plugins: [],
};
