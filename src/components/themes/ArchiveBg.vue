<template>
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bg-primary)]">
        <!-- 1. Мягкое тёплое свечение архивной лампы (Без тяжелого blur) -->
        <div
            class="lamp-pulse absolute -top-32 right-10 h-[650px] w-[650px] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-10"
        ></div>

        <!-- 2. Мягкое виньетирование документа по краям -->
        <div class="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.06)]"></div>

        <!-- 3. Графика: Сетка картотеки, метки сканирования и штамп (SVG) -->
        <div class="absolute inset-0 flex items-center justify-center opacity-30">
            <svg
                class="h-full max-h-[850px] w-full max-w-5xl"
                viewBox="0 0 1000 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <!-- Угловые кресты совмещения сканера -->
                <g stroke="var(--accent)" stroke-width="1.2" opacity="0.6">
                    <path d="M 60 70 L 60 90 M 50 80 L 70 80" />
                    <path d="M 940 70 L 940 90 M 930 80 L 950 80" />
                    <path d="M 60 710 L 60 730 M 50 720 L 70 720" />
                    <path d="M 940 710 L 940 730 M 930 720 L 950 720" />
                </g>

                <!-- Вертикальные и горизонтальные направляющие картотеки -->
                <g
                    stroke="var(--border-color)"
                    stroke-width="0.8"
                    opacity="0.5"
                    stroke-dasharray="4 6"
                >
                    <line x1="80" y1="140" x2="920" y2="140" />
                    <line x1="80" y1="280" x2="920" y2="280" />
                    <line x1="80" y1="420" x2="920" y2="420" />
                    <line x1="80" y1="560" x2="920" y2="560" />
                    <line x1="200" y1="100" x2="200" y2="700" />
                    <line x1="800" y1="100" x2="800" y2="700" />
                </g>

                <!-- Фоновый архивный штамп -->
                <g transform="translate(620, 110) rotate(-6)" opacity="0.45">
                    <rect
                        x="0"
                        y="0"
                        width="220"
                        height="85"
                        rx="3"
                        stroke="var(--accent)"
                        stroke-width="2"
                        fill="none"
                        stroke-dasharray="100 4 4 4"
                    />
                    <rect
                        x="5"
                        y="5"
                        width="210"
                        height="75"
                        rx="2"
                        stroke="var(--border-strong)"
                        stroke-width="1"
                        fill="none"
                    />

                    <text
                        x="110"
                        y="38"
                        font-family="monospace, sans-serif"
                        font-size="18"
                        font-weight="bold"
                        fill="var(--accent)"
                        text-anchor="middle"
                        letter-spacing="3"
                    >
                        ARCHIVED
                    </text>
                    <text
                        x="110"
                        y="60"
                        font-family="monospace, sans-serif"
                        font-size="11"
                        fill="var(--text-muted)"
                        text-anchor="middle"
                        letter-spacing="1"
                    >
                        FILE NO. 84-B / REF
                    </text>
                </g>

                <!-- Векторный штрих-код каталога -->
                <g transform="translate(90, 640)" fill="var(--border-strong)" opacity="0.35">
                    <rect x="0" y="0" width="3" height="35" />
                    <rect x="6" y="0" width="1" height="35" />
                    <rect x="10" y="0" width="4" height="35" />
                    <rect x="18" y="0" width="2" height="35" />
                    <rect x="23" y="0" width="1" height="35" />
                    <rect x="27" y="0" width="5" height="35" />
                    <rect x="35" y="0" width="2" height="35" />
                    <rect x="40" y="0" width="1" height="35" />
                    <rect x="44" y="0" width="3" height="35" />
                    <rect x="50" y="0" width="6" height="35" />
                    <rect x="59" y="0" width="2" height="35" />
                    <rect x="64" y="0" width="1" height="35" />
                    <rect x="68" y="0" width="4" height="35" />
                    <text
                        x="0"
                        y="48"
                        font-family="monospace"
                        font-size="10"
                        fill="var(--text-muted)"
                    >
                        CAT-INDEX 0092-X
                    </text>
                </g>
            </svg>
        </div>

        <!-- 4. Аппаратно-ускоренные пылинки и бумажные волокна -->
        <div
            class="archive-dust-field absolute -top-[300px] -left-[300px] h-[calc(100%+600px)] w-[calc(100%+600px)]"
        >
            <div class="archive-dust-pattern absolute inset-0"></div>
        </div>
    </div>
</template>

<style scoped>
    /* Пульсация лампы через opacity */
    .lamp-pulse {
        animation: lampPulseSmooth 9s ease-in-out infinite alternate;
        will-change: opacity;
    }

    /* Растровый узор пыли */
    .archive-dust-pattern {
        background-image:
            radial-gradient(1.5px 1.5px at 90px 140px, var(--accent), transparent),
            radial-gradient(2px 2px at 280px 320px, var(--text-muted), transparent),
            radial-gradient(1.5px 1.5px at 510px 180px, var(--border-strong), transparent),
            radial-gradient(2px 2px at 730px 480px, var(--accent), transparent),
            radial-gradient(1.5px 1.5px at 890px 220px, var(--text-secondary), transparent);
        background-size: 850px 650px;
        background-repeat: repeat;
        opacity: 0.35;
    }

    /* Плавный дрейф пыли через translate3d (0% Repaint) */
    .archive-dust-field {
        animation: driftArchiveSmooth 38s linear infinite;
        will-change: transform;
    }

    @keyframes lampPulseSmooth {
        0% {
            opacity: 0.06;
        }
        100% {
            opacity: 0.12;
        }
    }

    @keyframes driftArchiveSmooth {
        0% {
            transform: translate3d(0, 0, 0);
        }
        100% {
            transform: translate3d(-425px, -325px, 0);
        }
    }
</style>
