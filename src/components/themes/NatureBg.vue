<template>
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bg-primary)]">
        <!-- 1. Рассеянный солнечный свет -->
        <div
            class="sun-glade absolute -top-32 left-1/3 h-[700px] w-[700px] bg-[radial-gradient(ellipse_at_top,var(--accent)_0%,transparent_70%)] opacity-25"
        ></div>

        <!-- 2. Мягкая лесная тень снизу -->
        <div
            class="absolute -bottom-28 -left-20 h-[650px] w-[650px] bg-[radial-gradient(circle,var(--bg-secondary)_0%,transparent_75%)] opacity-80"
        ></div>

        <!-- 3. Фолк-графика: Деревья, глиняная свистулька, рельеф (SVG) -->
        <div class="absolute inset-0 flex items-center justify-center opacity-50">
            <svg
                class="h-full max-h-[900px] w-full max-w-7xl"
                viewBox="0 0 1000 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <!-- Холмы и лесные тропы -->
                <g
                    stroke="var(--border-color)"
                    stroke-width="1"
                    opacity="0.6"
                    stroke-dasharray="5 5"
                >
                    <path d="M -100 580 Q 200 500 500 600 T 1100 540" />
                    <path d="M -100 680 Q 300 620 700 700 T 1100 650" />
                </g>

                <!-- Силуэты деревьев (Ели и фолк-деревья) -->
                <g stroke="var(--text-muted)" stroke-width="1.2" fill="none" opacity="0.45">
                    <!-- Еловый лес слева -->
                    <path
                        d="M 80 620 L 110 550 L 95 555 L 115 500 L 100 505 L 120 450 L 140 505 L 125 500 L 145 555 L 130 550 Z"
                    />
                    <line x1="115" y1="620" x2="115" y2="645" />

                    <path
                        d="M 150 640 L 175 580 L 162 584 L 180 535 L 168 539 L 185 490 L 202 539 L 190 535 L 208 584 L 195 580 Z"
                    />
                    <line x1="179" y1="640" x2="179" y2="660" />

                    <!-- Стилизованное фолк-дерево в центре -->
                    <path
                        d="M 480 590 C 470 530 430 480 390 480 C 350 480 340 530 380 570"
                        stroke-dasharray="3 3"
                    />
                    <path
                        d="M 480 590 C 490 510 540 460 590 470 C 630 480 620 540 570 585"
                        stroke-dasharray="3 3"
                    />
                    <line x1="480" y1="590" x2="480" y2="640" stroke-width="1.8" />
                </g>

                <!-- Глиняная свистулька (Птичка-уточка) справа внизу -->
                <g
                    transform="translate(730, 500)"
                    stroke="var(--accent)"
                    stroke-width="1.5"
                    fill="none"
                    opacity="0.75"
                >
                    <!-- Контур птички-свистульки -->
                    <path
                        d="M 20 70 C 5 65 -5 45 5 25 C 12 10 30 5 45 15 C 55 5 70 0 85 10 C 100 20 115 25 130 20 L 145 40 L 120 45 C 100 55 90 75 70 80 C 45 85 30 80 20 70 Z"
                    />
                    <!-- Клюв и глазик -->
                    <path d="M 5 25 L -8 28 L 3 35" />
                    <circle cx="18" cy="22" r="2.5" fill="var(--accent)" />

                    <!-- Игровые отверстия свистульки -->
                    <circle cx="48" cy="45" r="3" fill="var(--accent)" opacity="0.6" />
                    <circle cx="68" cy="48" r="3" fill="var(--accent)" opacity="0.6" />

                    <!-- Свистковое отверстие (поддув в хвосте) -->
                    <rect
                        x="125"
                        y="26"
                        width="10"
                        height="4"
                        transform="rotate(-15 125 26)"
                        fill="var(--accent)"
                        opacity="0.8"
                    />

                    <!-- Традиционная роспись на боку свистульки (солярный символ) -->
                    <circle cx="58" cy="62" r="10" stroke-dasharray="2 3" />
                    <path d="M 58 52 V 72 M 48 62 H 68" stroke-width="1" />
                </g>

                <!-- Солярный символ / Солнцеворот в небе -->
                <g
                    transform="translate(820, 160)"
                    stroke="var(--text-muted)"
                    stroke-width="1"
                    fill="none"
                    opacity="0.35"
                >
                    <circle cx="0" cy="0" r="35" stroke-dasharray="3 4" />
                    <circle cx="0" cy="0" r="20" />
                    <path d="M -40 0 H 40 M 0 -40 V 40 M -28 -28 L 28 28 M -28 28 L 28 -28" />
                </g>

                <!-- Растительные завитки и трава -->
                <g stroke="var(--text-muted)" stroke-width="1" fill="none" opacity="0.4">
                    <path d="M 300 630 Q 320 590 310 560 Q 300 540 320 530" />
                    <path d="M 315 580 C 330 570 340 580 335 595 Z" />
                    <path d="M 640 650 Q 660 610 680 620" />
                </g>
            </svg>
        </div>

        <!-- 4. Верхний этнический бордюр-орнамент -->
        <div
            class="absolute inset-x-0 top-0 h-4 opacity-35"
            style="
                background-image: radial-gradient(var(--text-muted) 1.2px, transparent 0);
                background-size: 14px 14px;
            "
        ></div>

        <!-- 5. Лесная пыльца и споры (Анимация возвращена везде, но с легким щадящим таймингом) -->
        <div
            class="spore-field absolute -top-[300px] -left-[300px] h-[calc(100%+600px)] w-[calc(100%+600px)]"
        >
            <div class="spore-pattern absolute inset-0"></div>
        </div>
    </div>
</template>

<style scoped>
    .sun-glade {
        animation: sunPulse 10s ease-in-out infinite alternate;
        will-change: opacity;
        transform: translateZ(0);
    }

    .spore-pattern {
        background-image:
            radial-gradient(1.5px 1.5px at 50px 60px, var(--accent), transparent),
            radial-gradient(2px 2px at 210px 280px, var(--text-muted), transparent),
            radial-gradient(1.5px 1.5px at 380px 120px, var(--border-color), transparent),
            radial-gradient(2px 2px at 520px 400px, var(--accent), transparent);
        background-size: 600px 500px;
        background-repeat: repeat;
        opacity: 0.4;
    }

    .spore-field {
        animation: driftSporesSmooth 80s linear infinite;
        will-change: transform;
        transform: translateZ(0);
    }

    @keyframes sunPulse {
        0% {
            opacity: 0.18;
        }
        100% {
            opacity: 0.32;
        }
    }

    @keyframes driftSporesSmooth {
        0% {
            transform: translate3d(0, 0, 0);
        }
        100% {
            transform: translate3d(300px, -250px, 0);
        }
    }
</style>
