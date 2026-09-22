<template>
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bg-primary)]">
        <!-- 1. Свечение северного сияния -->
        <div
            class="aurora-glow absolute -top-32 left-1/3 h-[500px] w-[700px] bg-[radial-gradient(ellipse_at_center,var(--accent)_0%,transparent_70%)] opacity-[0.12]"
        ></div>

        <!-- 2. Холодная тень северной ночи снизу -->
        <div
            class="absolute -right-20 -bottom-20 h-[600px] w-[600px] bg-[radial-gradient(circle_at_center,var(--bg-tertiary)_0%,transparent_70%)] opacity-60"
        ></div>

        <!-- 3. Рунический став / Компас (Vegvisir & Aegishjalmur) -->
        <div class="absolute inset-0 flex items-center justify-center opacity-30">
            <svg
                class="rune-compass h-full max-h-[800px] w-full max-w-4xl"
                viewBox="0 0 800 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <!-- Внешнее руническое кольцо -->
                <circle
                    cx="400"
                    cy="400"
                    r="340"
                    stroke="var(--border-strong)"
                    stroke-width="1"
                    stroke-dasharray="3 7"
                />
                <circle
                    cx="400"
                    cy="400"
                    r="320"
                    stroke="var(--accent)"
                    stroke-width="1.2"
                    opacity="0.6"
                />
                <circle
                    cx="400"
                    cy="400"
                    r="305"
                    stroke="var(--border-color)"
                    stroke-width="0.8"
                    stroke-dasharray="12 6"
                />

                <!-- 8 лучей рунического древа/компаса -->
                <g stroke="var(--accent)" stroke-width="1.5" opacity="0.75" stroke-linecap="round">
                    <line x1="400" y1="120" x2="400" y2="680" />
                    <line x1="120" y1="400" x2="680" y2="400" />
                    <line x1="202" y1="202" x2="598" y2="598" />
                    <line x1="598" y1="202" x2="202" y2="598" />
                </g>

                <!-- Засечки и трезубцы Альгиз на концах лучей -->
                <g
                    stroke="var(--accent-hover)"
                    stroke-width="1.2"
                    opacity="0.8"
                    stroke-linecap="round"
                >
                    <path d="M 385 140 L 400 120 L 415 140" />
                    <line x1="385" y1="160" x2="415" y2="160" />
                    <path d="M 385 660 L 400 680 L 415 660" />
                    <line x1="385" y1="640" x2="415" y2="640" />
                    <path d="M 140 385 L 120 400 L 140 415" />
                    <line x1="160" y1="385" x2="160" y2="415" />
                    <path d="M 660 385 L 680 400 L 660 415" />
                    <line x1="640" y1="385" x2="640" y2="415" />
                </g>

                <!-- Внутренний круг и паутина судьбы (Урд) -->
                <circle
                    cx="400"
                    cy="400"
                    r="160"
                    stroke="var(--text-muted)"
                    stroke-width="1"
                    stroke-dasharray="4 4"
                />
                <polygon
                    points="400,240 538,400 400,560 262,400"
                    stroke="var(--border-strong)"
                    stroke-width="0.8"
                    opacity="0.5"
                />
                <circle cx="400" cy="400" r="12" fill="var(--accent)" opacity="0.6" />
            </svg>
        </div>

        <!-- 4. Дрейфующая морозная пыль (Скрыта на мобилках для стабильных 60 FPS) -->
        <div class="frost-particles-container absolute inset-0 hidden sm:block">
            <div class="frost-particles-scroller"></div>
        </div>
    </div>
</template>

<style scoped>
    .aurora-glow {
        animation: auroraPulse 10s ease-in-out infinite alternate;
        will-change: opacity;
        transform: translateZ(0);
    }

    /* Вращение компаса работает только на десктопах (min-width: 768px), на смартфонах статично */
    @media (min-width: 768px) {
        .rune-compass {
            animation: rotateCompass 160s linear infinite;
            transform-origin: center;
            will-change: transform;
        }
    }

    .frost-particles-container {
        mask-image: radial-gradient(ellipse at center, black 30%, transparent 90%);
        -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 90%);
        opacity: 0.35;
        transform: translateZ(0);
    }

    .frost-particles-scroller {
        position: absolute;
        top: 0;
        left: -800px;
        width: calc(100% + 800px);
        height: calc(100% + 700px);
        background-image: url('@/assets/images/nordic/frost-particles.svg');
        background-size: 800px 700px;
        background-repeat: repeat;
        animation: driftFrostOptimized 35s linear infinite;
        will-change: transform;
    }

    @keyframes auroraPulse {
        0% {
            opacity: 0.08;
        }
        100% {
            opacity: 0.16;
        }
    }

    @keyframes rotateCompass {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes driftFrostOptimized {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate(800px, -700px);
        }
    }
</style>
