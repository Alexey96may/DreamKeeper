<template>
    <div
        class="pointer-events-none fixed inset-0 -z-10 min-h-screen overflow-hidden bg-[var(--bg-primary)]"
    >
        <!-- 1. Свет уличного фонаря -->
        <div
            class="lamp-glow absolute -top-20 -left-20 h-[900px] w-[700px] bg-[radial-gradient(ellipse_at_top_left,var(--accent)_0%,transparent_70%)] opacity-[0.12]"
        ></div>

        <!-- Виньетирование -->
        <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_60%_50%,transparent_25%,var(--bg-tertiary)_90%)] opacity-85"
        ></div>

        <!-- 2. Графика: Кирпичная стена + Элементы улик (SVG) -->
        <div class="absolute inset-0 flex items-center justify-center opacity-50">
            <svg
                class="h-full max-h-[900px] w-full max-w-6xl"
                viewBox="0 0 1000 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <!-- Диагональный луч фонаря -->
                <polygon
                    points="0,0 420,0 720,800 0,800"
                    fill="url(#noir-street-light)"
                    opacity="0.2"
                />

                <!-- Кирпичная стена справа -->
                <g stroke="var(--border-strong)" stroke-width="1" opacity="0.4" fill="none">
                    <path
                        d="M 680 100 H 1000 M 680 130 H 1000 M 680 160 H 1000 M 680 190 H 1000 M 680 220 H 1000 M 680 250 H 1000 M 680 280 H 1000 M 680 310 H 1000 M 680 340 H 1000 M 680 370 H 1000 M 680 400 H 1000 M 680 430 H 1000 M 680 460 H 1000 M 680 490 H 1000 M 680 520 H 1000 M 680 550 H 1000 M 680 580 H 1000 M 680 610 H 1000 M 680 640 H 1000 M 680 670 H 1000 M 680 700 H 1000"
                    />
                    <path
                        d="M 740 100 V 130 M 860 100 V 130 M 980 100 V 130 M 800 130 V 160 M 920 130 V 160 M 740 160 V 190 M 860 160 V 190 M 980 160 V 190 M 800 190 V 220 M 920 190 V 220 M 740 220 V 250 M 860 220 V 250 M 980 220 V 250 M 800 250 V 280 M 920 250 V 280 M 740 280 V 310 M 860 280 V 310 M 980 280 V 310 M 800 310 V 340 M 920 310 V 340 M 740 340 V 370 M 860 340 V 370 M 980 340 V 370 M 800 370 V 400 M 920 370 V 400 M 740 400 V 430 M 860 400 V 430 M 980 400 V 430 M 800 430 V 460 M 920 430 V 460 M 740 460 V 490 M 860 460 V 490 M 980 460 V 490 M 800 490 V 520 M 920 490 V 520 M 740 520 V 550 M 860 520 V 550 M 980 520 V 550 M 800 550 V 580 M 920 550 V 580 M 740 580 V 610 M 860 580 V 610 M 980 580 V 610 M 800 610 V 640 M 920 610 V 640 M 740 640 V 670 M 860 640 V 670 M 980 640 V 670 M 800 670 V 700 M 920 670 V 700"
                    />
                </g>

                <!-- Меловая обводка улик на полу -->
                <g
                    stroke="var(--accent)"
                    stroke-width="1.8"
                    stroke-dasharray="5 5"
                    fill="none"
                    opacity="0.8"
                >
                    <ellipse cx="260" cy="520" rx="42" ry="26" transform="rotate(-20 260 520)" />
                    <path d="M 640 580 L 710 610 L 670 670 L 600 640 Z" />
                </g>

                <!-- Измерительная линейка криминалиста -->
                <g stroke="var(--border-strong)" stroke-width="1.5" opacity="0.75">
                    <line x1="180" y1="580" x2="380" y2="580" />
                    <path
                        d="M 180 572 V 580 M 220 575 V 580 M 260 572 V 580 M 300 575 V 580 M 340 572 V 580 M 380 572 V 580"
                    />
                </g>

                <!-- Маркеры улик (01 и 02) -->
                <g transform="translate(210, 460)">
                    <polygon points="0,0 34,0 42,38 -8,38" fill="var(--accent)" opacity="0.18" />
                    <path
                        d="M 0 0 L 34 0 L 42 38 L -8 38 Z"
                        stroke="var(--accent)"
                        stroke-width="2"
                        fill="none"
                        opacity="0.95"
                    />
                    <text
                        x="17"
                        y="26"
                        font-family="monospace"
                        font-size="18"
                        font-weight="bold"
                        fill="var(--accent)"
                        text-anchor="middle"
                    >
                        01
                    </text>
                </g>

                <g transform="translate(680, 520)">
                    <polygon points="0,0 34,0 42,38 -8,38" fill="var(--accent)" opacity="0.18" />
                    <path
                        d="M 0 0 L 34 0 L 42 38 L -8 38 Z"
                        stroke="var(--accent)"
                        stroke-width="2"
                        fill="none"
                        opacity="0.95"
                    />
                    <text
                        x="17"
                        y="26"
                        font-family="monospace"
                        font-size="18"
                        font-weight="bold"
                        fill="var(--accent)"
                        text-anchor="middle"
                    >
                        02
                    </text>
                </g>

                <defs>
                    <linearGradient
                        id="noir-street-light"
                        x1="0"
                        y1="0"
                        x2="600"
                        y2="800"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stop-color="var(--accent)" />
                        <stop offset="1" stop-color="var(--accent)" stop-opacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>

        <!-- 3. Диагональная лента CRIME SCENE -->
        <div
            class="absolute top-8 -right-14 rotate-12 border-y border-[var(--bg-primary)] bg-[var(--accent)] px-16 py-1.5 font-mono text-[11px] font-bold tracking-[0.25em] text-[var(--bg-primary)] uppercase opacity-85 shadow-md"
        >
            EVIDENCE AREA — DO NOT CROSS —
        </div>

        <!-- 4. Клубы ночного тумана (Скрыты на мобилках для стабильного FPS) -->
        <div class="detective-smoke-container absolute inset-0 hidden sm:block">
            <div class="detective-smoke-scroller"></div>
        </div>
    </div>
</template>

<style scoped>
    .lamp-glow {
        animation: lampFlicker 9s ease-in-out infinite alternate;
        will-change: opacity;
        transform: translateZ(0);
    }

    .detective-smoke-container {
        opacity: 0.1;
        transform: translateZ(0);
    }

    .detective-smoke-scroller {
        position: absolute;
        top: 0;
        left: -800px;
        width: calc(100% + 800px);
        height: calc(100% + 600px);
        background-image: url('@/assets/images/noir/detective-smoke.svg');
        background-size: 800px 600px;
        background-repeat: repeat;
        animation: driftSmokeOptimized 32s linear infinite;
        will-change: transform;
    }

    @keyframes lampFlicker {
        0%,
        100% {
            opacity: 0.12;
        }
        50% {
            opacity: 0.07;
        }
        75% {
            opacity: 0.14;
        }
    }

    @keyframes driftSmokeOptimized {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate(800px, -600px);
        }
    }
</style>
