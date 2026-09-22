<template>
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bg-primary)]">
        <!-- 1. Статичное фоновое свечение (никаких анимаций масштаба, только легкая статика) -->
        <div
            class="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-15"
        ></div>

        <!-- 2. Печать Дагона (SVG) — статичная, без тяжелых циклов трансформации -->
        <div class="absolute inset-0 flex items-center justify-center opacity-30 sm:opacity-35">
            <svg
                class="h-full max-h-[700px] w-full max-w-3xl"
                viewBox="0 0 1000 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <!-- Внешнее и внутреннее кольца -->
                <circle cx="500" cy="400" r="240" stroke="var(--accent)" stroke-width="2" />
                <circle
                    cx="500"
                    cy="400"
                    r="180"
                    stroke="var(--border-strong)"
                    stroke-width="1.5"
                />

                <!-- Буквы D - A - G - O - N -->
                <g
                    font-family="Georgia, serif"
                    font-size="32"
                    font-weight="bold"
                    fill="var(--accent)"
                    text-anchor="middle"
                    dominant-baseline="central"
                >
                    <text x="500" y="195">D</text>
                    <text x="690" y="330">A</text>
                    <text x="615" y="555">G</text>
                    <text x="385" y="555">O</text>
                    <text x="310" y="330">N</text>
                </g>

                <!-- Две дуги глаза и зрачок -->
                <g
                    stroke="var(--text-primary)"
                    stroke-width="3.5"
                    stroke-linecap="round"
                    fill="none"
                >
                    <path d="M 380 400 C 440 310, 560 310, 620 400" />
                    <path d="M 380 400 C 440 490, 560 490, 620 400" />
                    <circle cx="500" cy="400" r="24" stroke-width="3" fill="var(--bg-primary)" />
                    <circle cx="500" cy="400" r="10" fill="var(--accent)" stroke="none" />
                </g>
            </svg>
        </div>

        <!-- 3. Частицы: полностью отключаем на мобильных устройствах через CSS, чтобы не было лагов -->
        <div class="abyssal-spore-field absolute inset-0 hidden sm:block">
            <div class="abyssal-spore-pattern absolute inset-0"></div>
        </div>
    </div>
</template>

<style scoped>
    /*
      Убраны тяжелые постоянные анимации scale и glowPulse,
      которые заставляли браузер пересчитывать геометрию экрана.
    */

    .abyssal-spore-pattern {
        background-image:
            radial-gradient(1.5px 1.5px at 80px 600px, var(--accent), transparent),
            radial-gradient(2px 2px at 250px 720px, var(--accent-hover), transparent),
            radial-gradient(1.5px 1.5px at 480px 550px, var(--text-muted), transparent);
        background-size: 600px 600px;
        background-repeat: repeat;
        opacity: 0.3;
    }

    /* Анимация частиц работает только на десктопах, на мобилках блок скрыт (hidden sm:block) */
    .abyssal-spore-field {
        animation: riseSporesSmooth 40s linear infinite;
        will-change: transform;
        transform: translateZ(0); /* Аппаратное ускорение */
    }

    @keyframes riseSporesSmooth {
        0% {
            transform: translate3d(0, 0, 0);
        }
        100% {
            transform: translate3d(0, 300px, 0);
        }
    }
</style>
