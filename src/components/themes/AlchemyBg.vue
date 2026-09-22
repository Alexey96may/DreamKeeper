<template>
    <div
        class="pointer-events-none fixed inset-0 -z-10 min-h-screen overflow-hidden bg-[var(--bg-primary)]"
    >
        <!-- 1. Тёплый отблеск пламени (Без тяжелого blur) -->
        <div
            class="lamp-pulse absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-10"
        ></div>

        <!-- 2. Эффект потертости пергамента по краям -->
        <div class="absolute inset-0 shadow-[inset_0_0_120px_rgba(67,52,34,0.08)]"></div>

        <!-- 3. Алхимическая сакральная геометрия -->
        <div class="absolute inset-0 flex items-center justify-center opacity-40">
            <svg
                class="alchemy-circle h-full max-h-[800px] w-full max-w-4xl"
                viewBox="0 0 800 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <!-- Внешнее астрологическое/алхимическое кольцо с делениями -->
                <circle
                    cx="400"
                    cy="400"
                    r="320"
                    stroke="var(--border-strong)"
                    stroke-width="1"
                    stroke-dasharray="2 6"
                />
                <circle
                    cx="400"
                    cy="400"
                    r="300"
                    stroke="var(--accent)"
                    stroke-width="1.2"
                    opacity="0.6"
                />
                <circle
                    cx="400"
                    cy="400"
                    r="285"
                    stroke="var(--border-strong)"
                    stroke-width="0.8"
                    stroke-dasharray="8 4"
                />

                <!-- Символ «Квадратура круга» -->
                <rect
                    x="200"
                    y="200"
                    width="400"
                    height="400"
                    stroke="var(--text-muted)"
                    stroke-width="1"
                    opacity="0.5"
                />

                <polygon
                    points="400,115 647,543 153,543"
                    stroke="var(--accent)"
                    stroke-width="1.2"
                    opacity="0.7"
                />

                <circle cx="400" cy="400" r="143" stroke="var(--border-strong)" stroke-width="1" />
                <circle
                    cx="400"
                    cy="400"
                    r="135"
                    stroke="var(--text-muted)"
                    stroke-width="0.6"
                    stroke-dasharray="3 3"
                />

                <!-- Оси стихий -->
                <line
                    x1="400"
                    y1="60"
                    x2="400"
                    y2="740"
                    stroke="var(--border-color)"
                    stroke-width="0.8"
                    opacity="0.5"
                />
                <line
                    x1="60"
                    y1="400"
                    x2="740"
                    y2="400"
                    stroke="var(--border-color)"
                    stroke-width="0.8"
                    opacity="0.5"
                />

                <!-- Символические метки орбит стихий -->
                <circle cx="400" cy="257" r="5" fill="var(--accent)" opacity="0.8" />
                <circle cx="400" cy="543" r="5" fill="var(--text-muted)" opacity="0.8" />
                <circle cx="257" cy="400" r="5" fill="var(--text-muted)" opacity="0.8" />
                <circle cx="543" cy="400" r="5" fill="var(--accent)" opacity="0.8" />
            </svg>
        </div>

        <!-- 4. Аппаратно-ускоренные золотые искры и алхимический порошок -->
        <div
            class="alchemy-dust-field absolute -top-[350px] -left-[350px] h-[calc(100%+700px)] w-[calc(100%+700px)]"
        >
            <div class="alchemy-dust-pattern absolute inset-0"></div>
        </div>
    </div>
</template>

<style scoped>
    /* Пульсация пламени через opacity */
    .lamp-pulse {
        animation: lampPulseSmooth 7s ease-in-out infinite alternate;
        will-change: opacity;
    }

    /* Плавное вращение геометрии через GPU (translate3d + rotate) */
    .alchemy-circle {
        animation: rotateCircleSmooth 120s linear infinite;
        transform-origin: center;
        will-change: transform;
    }

    /* Растровый узор микрочастиц */
    .alchemy-dust-pattern {
        background-image:
            radial-gradient(1.5px 1.5px at 50px 80px, var(--accent), transparent),
            radial-gradient(2px 2px at 220px 300px, var(--text-muted), transparent),
            radial-gradient(1.5px 1.5px at 400px 150px, var(--accent-hover), transparent),
            radial-gradient(2px 2px at 600px 420px, var(--border-strong), transparent),
            radial-gradient(1.5px 1.5px at 720px 180px, var(--accent), transparent),
            radial-gradient(2px 2px at 850px 520px, var(--text-secondary), transparent);
        background-size: 900px 700px;
        background-repeat: repeat;
        opacity: 0.45;
    }

    /* Аппаратный дрейф алхимического порошка */
    .alchemy-dust-field {
        animation: driftDustSmooth 40s linear infinite;
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

    @keyframes rotateCircleSmooth {
        0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
        }
        100% {
            transform: translate3d(0, 0, 0) rotate(360deg);
        }
    }

    @keyframes driftDustSmooth {
        0% {
            transform: translate3d(0, 0, 0);
        }
        100% {
            transform: translate3d(-450px, 350px, 0);
        }
    }
</style>
