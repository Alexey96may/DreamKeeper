<template>
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bg-primary)]">
        <!-- 1. Фоновое фосфорное свечение (Без тяжелого blur) -->
        <div
            class="dagon-glow absolute -top-32 left-1/4 h-[700px] w-[700px] bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-20"
        ></div>

        <!-- 2. Печать Дагона (SVG) -->
        <div class="absolute inset-0 flex items-center justify-center opacity-35">
            <svg
                class="dagon-seal h-full max-h-[800px] w-full max-w-4xl"
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
                    <!-- Верхняя дуга -->
                    <path d="M 380 400 C 440 310, 560 310, 620 400" />
                    <!-- Нижняя дуга -->
                    <path d="M 380 400 C 440 490, 560 490, 620 400" />
                    <!-- Зрачок -->
                    <circle cx="500" cy="400" r="24" stroke-width="3" fill="var(--bg-primary)" />
                    <circle cx="500" cy="400" r="10" fill="var(--accent)" stroke="none" />
                </g>
            </svg>
        </div>

        <!-- 3. Аппаратно-ускоренные частицы бездны (GPU Compositing) -->
        <div
            class="abyssal-spore-field absolute -top-[300px] -left-[300px] h-[calc(100%+600px)] w-[calc(100%+600px)]"
        >
            <div class="abyssal-spore-pattern absolute inset-0"></div>
        </div>
    </div>
</template>

<style scoped>
    /* Пульсация фонового свечения через transform */
    .dagon-glow {
        animation: glowPulse 10s ease-in-out infinite alternate;
        will-change: opacity, transform;
    }

    /* Плавное "дышащее" мерцание печати Дагона через аппаратный scale */
    .dagon-seal {
        animation: dagonPulse 8s ease-in-out infinite alternate;
        transform-origin: 500px 400px;
        will-change: transform, opacity;
    }

    /* Растровая карта частиц бездны рендерится один раз */
    .abyssal-spore-pattern {
        background-image:
            radial-gradient(1.5px 1.5px at 80px 600px, var(--accent), transparent),
            radial-gradient(2px 2px at 250px 720px, var(--accent-hover), transparent),
            radial-gradient(1.5px 1.5px at 480px 550px, var(--text-muted), transparent),
            radial-gradient(2px 2px at 680px 800px, var(--border-strong), transparent),
            radial-gradient(1.5px 1.5px at 880px 640px, var(--accent), transparent);
        background-size: 900px 750px;
        background-repeat: repeat;
        opacity: 0.4;
    }

    /* Плавный подъем частиц через translate3d (0% Repaint / 60+ FPS) */
    .abyssal-spore-field {
        animation: riseSporesSmooth 36s linear infinite;
        will-change: transform;
    }

    @keyframes glowPulse {
        0% {
            opacity: 0.12;
            transform: scale3d(0.95, 0.95, 1);
        }
        100% {
            opacity: 0.25;
            transform: scale3d(1.05, 1.05, 1);
        }
    }

    @keyframes dagonPulse {
        0% {
            transform: scale3d(0.97, 0.97, 1);
            opacity: 0.75;
        }
        100% {
            transform: scale3d(1.02, 1.02, 1);
            opacity: 0.95;
        }
    }

    @keyframes riseSporesSmooth {
        0% {
            transform: translate3d(0, 0, 0);
        }
        100% {
            transform: translate3d(0, 375px, 0);
        }
    }
</style>
