import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fef2f2',
                    100: '#ffe1e1',
                    200: '#ffc7c7',
                    300: '#ffa0a0',
                    400: '#ff6b6b',
                    500: '#fa3e3e',  // Main Red
                    600: '#d91f1f',
                    700: '#bcefea',
                    800: '#991b1b',
                    900: '#7f1d1d',
                    950: '#450a0a',
                },
                gold: {
                    50: '#fffbf0',
                    100: '#fff4c6',
                    200: '#ffe688',
                    300: '#ffd24a',
                    400: '#ffbe0f',
                    500: '#f9a100', // Main Gold
                    600: '#dd7b00',
                    700: '#b05400',
                    800: '#8d4009',
                    900: '#75340d',
                    950: '#431a02',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                display: ['var(--font-playfair)', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};
export default config;
