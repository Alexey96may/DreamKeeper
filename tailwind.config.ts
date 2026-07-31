// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

    // ============================================
    // 1. ОТКЛЮЧЕНИЕ HOVER НА МОБИЛКАХ
    // ============================================
    future: {
        hoverOnlyWhenSupported: true,
    },

    // ============================================
    // 2. НАСТРОЙКИ ТЕМ
    // ============================================
    theme: {
        extend: {
            // ----- ЦВЕТА ЧЕРЕЗ CSS ПЕРЕМЕННЫЕ -----
            colors: {
                // Фоны
                bg: {
                    primary: 'rgb(var(--color-background) / <alpha-value>)',
                    secondary: 'rgb(var(--color-background-soft) / <alpha-value>)',
                    mute: 'rgb(var(--color-background-mute) / <alpha-value>)',
                    card: 'rgb(var(--color-background-card) / <alpha-value>)',
                    input: 'rgb(var(--color-background-input) / <alpha-value>)',
                },

                // Текст
                text: {
                    primary: 'rgb(var(--color-text) / <alpha-value>)',
                    soft: 'rgb(var(--color-text-soft) / <alpha-value>)',
                    mute: 'rgb(var(--color-text-mute) / <alpha-value>)',
                    inverse: 'rgb(var(--color-text-inverse) / <alpha-value>)',
                    link: 'rgb(var(--color-text-link) / <alpha-value>)',
                },

                // Границы
                border: {
                    DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
                    hover: 'rgb(var(--color-border-hover) / <alpha-value>)',
                    focus: 'rgb(var(--color-border-focus) / <alpha-value>)',
                },

                // Акценты
                accent: {
                    DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
                    hover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
                    soft: 'rgb(var(--color-accent-soft) / <alpha-value>)',
                },

                // Тени
                shadow: {
                    DEFAULT: 'rgb(var(--color-shadow) / <alpha-value>)',
                    lg: 'rgb(var(--color-shadow-lg) / <alpha-value>)',
                    xl: 'rgb(var(--color-shadow-xl) / <alpha-value>)',
                },

                // Статусы
                success: 'rgb(var(--color-success) / <alpha-value>)',
                warning: 'rgb(var(--color-warning) / <alpha-value>)',
                error: 'rgb(var(--color-error) / <alpha-value>)',
                info: 'rgb(var(--color-info) / <alpha-value>)',

                // Сны
                dream: {
                    lucid: 'rgb(var(--color-dream-lucid) / <alpha-value>)',
                    nightmare: 'rgb(var(--color-dream-nightmare) / <alpha-value>)',
                    prophetic: 'rgb(var(--color-dream-prophetic) / <alpha-value>)',
                    normal: 'rgb(var(--color-dream-normal) / <alpha-value>)',
                },

                // Золото (для бренда)
                gold: {
                    50: 'var(--dk-gold-50)',
                    100: 'var(--dk-gold-100)',
                    200: 'var(--dk-gold-200)',
                    300: 'var(--dk-gold-300)',
                    400: 'var(--dk-gold-400)',
                    500: 'var(--dk-gold-500)',
                    600: 'var(--dk-gold-600)',
                    700: 'var(--dk-gold-700)',
                    800: 'var(--dk-gold-800)',
                    900: 'var(--dk-gold-900)',
                },
            },

            // ----- ШРИФТЫ -----
            fontFamily: {
                sans: [
                    'Inter',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'Oxygen',
                    'Ubuntu',
                    'Cantarell',
                    'Fira Sans',
                    'Droid Sans',
                    'Helvetica Neue',
                    'sans-serif',
                ],
                mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
            },

            // ----- РАЗМЕРЫ -----
            spacing: {
                '18': '4.5rem',
                '72': '18rem',
                '84': '21rem',
                '96': '24rem',
            },

            // ----- RADIUS -----
            borderRadius: {
                xl: '16px',
                '2xl': '20px',
                '3xl': '24px',
            },

            // ----- ТЕНИ -----
            boxShadow: {
                card: '0 2px 8px var(--color-shadow)',
                'card-hover': '0 4px 16px var(--color-shadow-lg)',
                'card-lg': '0 8px 32px var(--color-shadow-xl)',
                dropdown: '0 4px 24px var(--color-shadow-lg)',
            },

            // ----- АНИМАЦИИ -----
            animation: {
                'fade-in': 'fadeIn 0.4s ease forwards',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
                'slide-up': 'slideUp 0.3s ease forwards',
                'slide-down': 'slideDown 0.3s ease forwards',
                'scale-in': 'scaleIn 0.3s ease forwards',
            },

            keyframes: {
                fadeIn: {
                    from: { opacity: '0', transform: 'translateY(16px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.6' },
                },
                slideUp: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    from: { opacity: '0', transform: 'translateY(-20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    from: { opacity: '0', transform: 'scale(0.95)' },
                    to: { opacity: '1', transform: 'scale(1)' },
                },
            },

            // ----- ПЛАВНЫЕ ПЕРЕХОДЫ -----
            transitionDuration: {
                theme: '300ms',
                '400': '400ms',
            },

            transitionProperty: {
                theme: 'color, background-color, border-color, box-shadow',
            },
        },
    },
} satisfies Config;
