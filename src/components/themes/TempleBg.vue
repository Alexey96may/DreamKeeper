<template>
    <div
        class="min pointer-events-none fixed inset-0 -z-10 min-h-screen overflow-hidden bg-[var(--bg-primary)]"
    >
        <!-- 1. Купольный луч света (Оптимизировано: убран тяжелый blur, заменен на чистый градиент) -->
        <div
            class="temple-light-beam absolute -top-20 left-1/2 h-[600px] w-[800px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,var(--accent)_0%,var(--accent-subtle)_40%,transparent_70%)] opacity-[0.12]"
        ></div>

        <!-- 2. Виньетирование сводов (Статичная легкая тень) -->
        <div class="absolute inset-0 shadow-[inset_0_0_120px_rgba(10,10,15,0.7)]"></div>

        <!-- 3. Архитектура и геометрия: арка, колонны и солярный символ (SVG) -->
        <div class="absolute inset-0 flex items-center justify-center opacity-30">
            <svg
                class="h-full max-h-[850px] w-full max-w-5xl"
                viewBox="0 0 1000 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <!-- Внешний контур храмового свода -->
                <path
                    d="M 220 800 V 380 Q 220 160 500 110 Q 780 160 780 380 V 800"
                    stroke="var(--border-color)"
                    stroke-width="1.2"
                    stroke-dasharray="8 8"
                    opacity="0.5"
                />

                <!-- Внутренняя арка -->
                <path
                    d="M 300 800 V 410 Q 300 230 500 180 Q 700 230 700 410 V 800"
                    stroke="var(--border-strong)"
                    stroke-width="1"
                    opacity="0.35"
                />

                <!-- Символ Небесного Света / Восьмиконечная звезда (Под куполом) -->
                <!-- На мобилках вращение нимба отключено через CSS для экономии ресурсов -->
                <g class="temple-halo" transform-origin="500 300">
                    <!-- Окружности нимба -->
                    <circle
                        cx="500"
                        cy="300"
                        r="85"
                        stroke="var(--accent)"
                        stroke-width="1"
                        stroke-dasharray="4 4"
                        opacity="0.6"
                    />
                    <circle
                        cx="500"
                        cy="300"
                        r="60"
                        stroke="var(--accent-hover)"
                        stroke-width="1.2"
                        opacity="0.8"
                    />
                    <circle cx="500" cy="300" r="8" fill="var(--accent)" opacity="0.9" />

                    <!-- Лучи освящения (8 направлений) -->
                    <g stroke="var(--accent)" stroke-width="1" opacity="0.5">
                        <line x1="500" y1="200" x2="500" y2="400" />
                        <line x1="400" y1="300" x2="600" y2="300" />
                        <line x1="429" y1="229" x2="571" y2="371" stroke-dasharray="2 3" />
                        <line x1="429" y1="371" x2="571" y2="229" stroke-dasharray="2 3" />
                    </g>
                </g>

                <!-- Четкие вертикали колонн -->
                <g stroke="var(--border-color)" opacity="0.3" stroke-width="1">
                    <line x1="220" y1="380" x2="220" y2="800" />
                    <line x1="300" y1="410" x2="300" y2="800" />
                    <line x1="700" y1="410" x2="700" y2="800" />
                    <line x1="780" y1="380" x2="780" y2="800" />
                </g>

                <!-- Подножие / Горизонтальная линия алтарной ступени -->
                <line
                    x1="150"
                    y1="680"
                    x2="850"
                    y2="680"
                    stroke="var(--border-strong)"
                    stroke-width="1"
                    opacity="0.25"
                />
            </svg>
        </div>

        <!-- 4. Восходящие золотистые частицы фимиама (Скрыты на мобилках для идеального FPS) -->
        <div class="incense-particles-container absolute inset-0 hidden sm:block">
            <div class="incense-particles-scroller"></div>
        </div>
    </div>
</template>

<style scoped>
    /* Пульсация света теперь без тяжелого вычисления blur */
    .temple-light-beam {
        animation: divineGlow 8s ease-in-out infinite alternate;
        will-change: transform, opacity;
        transform: translateZ(0);
    }

    /* Вращение нимба работает только на ПК, на телефонах отключено ради производительности */
    @media (min-width: 768px) {
        .temple-halo {
            animation: rotateHalo 240s linear infinite;
            will-change: transform;
        }
    }

    .incense-particles-container {
        opacity: 0.3;
        transform: translateZ(0);
    }

    .incense-particles-scroller {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 200%;
        background-image: url('@/assets/images/temple/incense-particles.svg');
        background-size: 800px 800px;
        background-repeat: repeat;
        animation: driftIncenseOptimized 35s linear infinite;
        will-change: transform;
    }

    @keyframes divineGlow {
        0% {
            opacity: 0.08;
            transform: translateX(-50%) scale(0.96);
        }
        100% {
            opacity: 0.15;
            transform: translateX(-50%) scale(1.02);
        }
    }

    @keyframes rotateHalo {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes driftIncenseOptimized {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(-50%);
        }
    }
</style>
