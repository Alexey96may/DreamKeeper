<template>
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bg-primary)]">
        <!-- 1. Купольный луч света (Divine Beam) -->
        <div
            class="temple-light-beam absolute -top-32 left-1/2 h-[800px] w-[900px] -translate-x-1/2 bg-radial from-[var(--accent)] via-[var(--accent-subtle)] to-transparent opacity-[0.1] blur-[130px]"
        ></div>

        <!-- 2. Виньетирование сводов (Мягкая тень по периметру) -->
        <div class="absolute inset-0 shadow-[inset_0_0_180px_rgba(10,10,15,0.8)]"></div>

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

        <!-- 4. Восходящие золотистые частицы фимиама (Оптимизированный слой) -->
        <div class="incense-particles-container absolute inset-0">
            <div class="incense-particles-scroller"></div>
        </div>
    </div>
</template>

<style scoped>
    /* Плавная дыхательная пульсация света из купола */
    .temple-light-beam {
        animation: divineGlow 8s ease-in-out infinite alternate;
        will-change: transform, opacity; /* Подсказка для оптимизации */
    }

    /* Едва заметное медленное вращение лучей света (1 оборот за 4 минуты) */
    .temple-halo {
        animation: rotateHalo 240s linear infinite;
        will-change: transform; /* Подсказка для оптимизации */
    }

    /* Оптимизированный слой парящих частиц */
    .incense-particles-container {
        /* Контейнер маскирует выходящую за пределы область */
        mask-image: radial-gradient(ellipse at center, black 20%, transparent 90%);
        -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 90%);
        opacity: 0.35;
    }

    .incense-particles-scroller {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        /* Делаем слой в два раза выше экрана для бесконечной прокрутки */
        height: 200%;
        /* Подключаем сохраненный SVG как паттерн */
        background-image: url('@/assets/images/temple/incense-particles.svg');
        background-size: 800px 800px;
        background-repeat: repeat;
        /* Анимируем transform, а не position! */
        animation: driftIncenseOptimized 35s linear infinite;
        will-change: transform; /* Критично для GPU-анимации */
    }

    @keyframes divineGlow {
        0% {
            opacity: 0.1;
            transform: translateX(-50%) scale(0.95);
        }
        100% {
            opacity: 0.18;
            transform: translateX(-50%) scale(1.03);
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

    /* GPU-эффективная анимация сдвига */
    @keyframes driftIncenseOptimized {
        0% {
            transform: translateY(0);
        }
        100% {
            /* Сдвигаем вверх на половину высоты слоя (размер одного паттерна) */
            transform: translateY(-50%);
        }
    }
</style>
