<template>
    <div
        class="pointer-events-none fixed inset-0 -z-10 min-h-screen overflow-hidden bg-[var(--bg-primary)]"
    >
        <!-- 1. Мягкие рассеянные засветки (Без blur, через быстрый radial-gradient) -->
        <div
            class="light-glow-1 absolute -top-32 -right-32 h-[700px] w-[700px] bg-[radial-gradient(circle_at_center,var(--accent-subtle)_0%,transparent_70%)] opacity-30"
        ></div>
        <div
            class="light-glow-2 absolute -bottom-40 -left-32 h-[800px] w-[800px] bg-[radial-gradient(circle_at_center,var(--border-color)_0%,transparent_70%)] opacity-25"
        ></div>

        <!-- 2. Тонкая техническая сетка (Subtle Grid) -->
        <svg class="absolute inset-0 h-full w-full opacity-25" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="cleanGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="var(--border-color)"
                        stroke-width="0.5"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cleanGrid)" />
        </svg>

        <!-- 3. Центральные UI-маркеры (SVG) -->
        <div class="absolute inset-0 flex items-center justify-center opacity-40">
            <svg
                class="h-full max-h-[850px] w-full max-w-5xl"
                viewBox="0 0 1000 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g stroke="var(--border-strong)" stroke-width="1.5" opacity="0.3">
                    <path d="M 320 235 V 245 M 315 240 H 325" />
                    <path d="M 680 235 V 245 M 675 240 H 685" />
                    <path d="M 320 555 V 565 M 315 560 H 325" />
                    <path d="M 680 555 V 565 M 675 560 H 685" />
                    <path d="M 500 395 V 405 M 495 400 H 505" />
                </g>
            </svg>
        </div>

        <!-- 4. Аппаратно-ускоренные микро-частицы (GPU Compositing через transform) -->
        <div
            class="particle-field absolute -top-[500px] -left-[500px] h-[calc(100%+1000px)] w-[calc(100%+1000px)]"
        >
            <div class="particle-pattern absolute inset-0"></div>
        </div>
    </div>
</template>

<style scoped>
    /* Легкое, безнагрузочное "дыхание" засветок */
    .light-glow-1 {
        animation: pulseGlow 12s ease-in-out infinite alternate;
        will-change: transform, opacity;
    }

    .light-glow-2 {
        animation: pulseGlow 14s ease-in-out infinite alternate;
        animation-delay: -4s;
        will-change: transform, opacity;
    }

    /* Растровая карта точек рисуется 1 раз */
    .particle-pattern {
        background-image:
            radial-gradient(1px 1px at 100px 200px, var(--text-primary), transparent),
            radial-gradient(1px 1px at 300px 500px, var(--accent), transparent),
            radial-gradient(1.5px 1.5px at 600px 150px, var(--border-strong), transparent),
            radial-gradient(1px 1px at 800px 700px, var(--text-secondary), transparent),
            radial-gradient(1.5px 1.5px at 900px 300px, var(--accent-hover), transparent);
        background-size: 1000px 1000px;
        background-repeat: repeat;
        opacity: 0.25;
    }

    /* Анимация через transform3d: 0 Repaint / 0 Reflow / 60+ FPS */
    .particle-field {
        animation: driftUISmooth 50s linear infinite;
        will-change: transform;
    }

    @keyframes pulseGlow {
        0% {
            opacity: 0.2;
            transform: scale3d(0.95, 0.95, 1);
        }
        100% {
            opacity: 0.4;
            transform: scale3d(1.05, 1.05, 1);
        }
    }

    @keyframes driftUISmooth {
        0% {
            transform: translate3d(0, 0, 0);
        }
        100% {
            transform: translate3d(-500px, -500px, 0);
        }
    }
</style>
