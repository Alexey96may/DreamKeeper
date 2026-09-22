<template>
    <div
        class="pointer-events-none fixed inset-0 -z-10 min-h-screen overflow-hidden bg-[var(--bg-primary)]"
    >
        <!-- 1. Янтарный луч кинопроектора (Без тяжелого blur) -->
        <div
            class="projector-flicker absolute -top-20 -right-20 h-[850px] w-[850px] bg-[radial-gradient(circle_at_top_right,var(--accent)_0%,var(--accent-subtle)_40%,transparent_70%)] opacity-15"
        ></div>

        <!-- 2. Мягкое затемнение по краям кадра (Кашетирование) -->
        <div class="absolute inset-0 shadow-[inset_0_0_150px_rgba(20,20,22,0.8)]"></div>

        <!-- 3. Кинематографическая графика: бобина, перфорация и видоискатель (SVG) -->
        <div class="absolute inset-0 flex items-center justify-center opacity-30">
            <svg
                class="h-full max-h-[850px] w-full max-w-5xl"
                viewBox="0 0 1000 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <!-- Кадр видоискателя / Направляющие формата 2.39:1 -->
                <rect
                    x="100"
                    y="150"
                    width="800"
                    height="500"
                    stroke="var(--border-color)"
                    stroke-width="1"
                    stroke-dasharray="8 8"
                    opacity="0.5"
                />

                <!-- Уголки кадра видоискателя -->
                <g stroke="var(--accent)" stroke-width="2" opacity="0.6">
                    <path d="M 100 190 L 100 150 L 140 150" />
                    <path d="M 860 150 L 900 150 L 900 190" />
                    <path d="M 100 610 L 100 650 L 140 650" />
                    <path d="M 860 650 L 900 650 L 900 610" />
                </g>

                <!-- Перекрестие центра фокусировки -->
                <g stroke="var(--border-strong)" stroke-width="0.8" opacity="0.4">
                    <line x1="480" y1="400" x2="520" y2="400" />
                    <line x1="500" y1="380" x2="500" y2="420" />
                    <circle cx="500" cy="400" r="30" stroke-dasharray="2 4" />
                </g>

                <!-- Вращающаяся бобина с кинопленкой (GPU-оптимизировано) -->
                <g class="film-reel-spinning" transform-origin="800 180">
                    <circle
                        cx="800"
                        cy="180"
                        r="140"
                        stroke="var(--border-strong)"
                        stroke-width="1.2"
                        opacity="0.5"
                    />
                    <circle
                        cx="800"
                        cy="180"
                        r="130"
                        stroke="var(--border-color)"
                        stroke-width="0.8"
                        stroke-dasharray="4 6"
                    />
                    <circle
                        cx="800"
                        cy="180"
                        r="35"
                        stroke="var(--accent)"
                        stroke-width="1.5"
                        opacity="0.7"
                    />

                    <!-- Окна бобины -->
                    <circle
                        cx="800"
                        cy="100"
                        r="28"
                        fill="var(--bg-primary)"
                        stroke="var(--border-color)"
                        stroke-width="0.8"
                    />
                    <circle
                        cx="800"
                        cy="260"
                        r="28"
                        fill="var(--bg-primary)"
                        stroke="var(--border-color)"
                        stroke-width="0.8"
                    />
                    <circle
                        cx="720"
                        cy="180"
                        r="28"
                        fill="var(--bg-primary)"
                        stroke="var(--border-color)"
                        stroke-width="0.8"
                    />
                    <circle
                        cx="880"
                        cy="180"
                        r="28"
                        fill="var(--bg-primary)"
                        stroke="var(--border-color)"
                        stroke-width="0.8"
                    />
                </g>

                <!-- Перфорация кинопленки по левому краю -->
                <g fill="var(--border-color)" opacity="0.25">
                    <rect x="20" y="40" width="16" height="24" rx="3" />
                    <rect x="20" y="100" width="16" height="24" rx="3" />
                    <rect x="20" y="160" width="16" height="24" rx="3" />
                    <rect x="20" y="220" width="16" height="24" rx="3" />
                    <rect x="20" y="280" width="16" height="24" rx="3" />
                    <rect x="20" y="340" width="16" height="24" rx="3" />
                    <rect x="20" y="400" width="16" height="24" rx="3" />
                    <rect x="20" y="460" width="16" height="24" rx="3" />
                    <rect x="20" y="520" width="16" height="24" rx="3" />
                    <rect x="20" y="580" width="16" height="24" rx="3" />
                    <rect x="20" y="640" width="16" height="24" rx="3" />
                    <rect x="20" y="700" width="16" height="24" rx="3" />
                </g>
            </svg>
        </div>

        <!-- 4. Аппаратно-ускоренные частицы пыли в луче -->
        <div
            class="projector-dust-field absolute -top-[300px] -left-[300px] h-[calc(100%+600px)] w-[calc(100%+600px)]"
        >
            <div class="projector-dust-pattern absolute inset-0"></div>
        </div>
    </div>
</template>

<style scoped>
    /* Вращение бобины через transform3d */
    .film-reel-spinning {
        animation: rotateReelSmooth 90s linear infinite;
        will-change: transform;
    }

    /* Мерцание лампы через opacity */
    .projector-flicker {
        animation: flickerSmooth 4s ease-in-out infinite alternate;
        will-change: opacity;
    }

    /* Растровый слой пыли рендерится один раз */
    .projector-dust-pattern {
        background-image:
            radial-gradient(1.5px 1.5px at 100px 120px, var(--accent), transparent),
            radial-gradient(2px 2px at 320px 280px, var(--text-primary), transparent),
            radial-gradient(1.5px 1.5px at 550px 180px, var(--border-strong), transparent),
            radial-gradient(2px 2px at 700px 420px, var(--accent-hover), transparent),
            radial-gradient(1.5px 1.5px at 850px 250px, var(--text-secondary), transparent);
        background-size: 900px 600px;
        background-repeat: repeat;
        opacity: 0.4;
    }

    /* Плавный дрейф пыли через translate3d (0% Repaint) */
    .projector-dust-field {
        animation: driftDustSmooth 28s linear infinite;
        will-change: transform;
    }

    @keyframes rotateReelSmooth {
        0% {
            transform: rotate3d(0, 0, 1, 0deg);
        }
        100% {
            transform: rotate3d(0, 0, 1, 360deg);
        }
    }

    @keyframes flickerSmooth {
        0%,
        100% {
            opacity: 0.12;
        }
        25% {
            opacity: 0.15;
        }
        50% {
            opacity: 0.1;
        }
        75% {
            opacity: 0.14;
        }
    }

    @keyframes driftDustSmooth {
        0% {
            transform: translate3d(0, 0, 0);
        }
        100% {
            transform: translate3d(-450px, -300px, 0);
        }
    }
</style>
