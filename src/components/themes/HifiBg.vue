<template>
    <div
        class="pointer-events-none fixed inset-0 -z-10 min-h-screen overflow-hidden bg-[var(--bg-primary)]"
    >
        <!-- 1. Неоновое свечение несущей частоты (Без тяжелого blur) -->
        <div
            class="hifi-signal-glow absolute top-1/2 left-1/2 h-[750px] w-[950px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,var(--accent)_0%,var(--accent-subtle)_40%,transparent_70%)] opacity-20"
        ></div>

        <!-- 2. Сетка измерительной шкалы осциллографа -->
        <svg class="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="hifiGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path
                        d="M 60 0 L 0 0 0 60"
                        fill="none"
                        stroke="var(--border-color)"
                        stroke-width="0.5"
                    />
                    <circle cx="0" cy="0" r="1" fill="var(--border-strong)" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hifiGrid)" />
        </svg>

        <!-- 3. Рабочая зона дисплея и вращающаяся ДНК (SVG) -->
        <div class="absolute inset-0 flex items-center justify-center opacity-45">
            <svg
                class="h-full max-h-[850px] w-full max-w-5xl"
                viewBox="0 0 1000 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <!-- Граница рабочей зоны векторного дисплея -->
                <rect
                    x="100"
                    y="100"
                    width="800"
                    height="600"
                    rx="12"
                    stroke="var(--border-color)"
                    stroke-width="1"
                    stroke-dasharray="4 8"
                    opacity="0.5"
                />

                <!-- ВРАЩАЮЩАЯСЯ СПИРАЛЬ ДНК (3D Helix Animation) -->
                <g class="dna-helix-container" transform-origin="500 400">
                    <!-- Центральная ось ДНК -->
                    <line
                        x1="500"
                        y1="180"
                        x2="500"
                        y2="620"
                        stroke="var(--border-color)"
                        stroke-width="0.8"
                        stroke-dasharray="4 4"
                        opacity="0.4"
                    />

                    <!-- Нить 1 (Основная цепь) -->
                    <path
                        d="M 420 180 Q 580 250, 580 320 T 420 460 T 580 600"
                        stroke="var(--accent)"
                        stroke-width="2"
                        fill="none"
                        opacity="0.8"
                    />

                    <!-- Нить 2 (Комлементарная цепь со сдвигом фазы) -->
                    <path
                        d="M 580 180 Q 420 250, 420 320 T 580 460 T 420 600"
                        stroke="var(--accent-hover)"
                        stroke-width="1.5"
                        stroke-dasharray="3 3"
                        fill="none"
                        opacity="0.6"
                    />

                    <!-- Нуклеотидные мостики (Связи между цепями) -->
                    <g stroke="var(--border-strong)" stroke-width="1.2" opacity="0.5">
                        <line x1="432" y1="210" x2="568" y2="210" />
                        <line x1="460" y1="260" x2="540" y2="260" />
                        <line x1="500" y1="320" x2="500" y2="320" />
                        <!-- Центр перегиба -->
                        <line x1="535" y1="375" x2="465" y2="375" />
                        <line x1="570" y1="430" x2="430" y2="430" />
                        <line x1="535" y1="485" x2="465" y2="485" />
                        <line x1="480" y1="540" x2="520" y2="540" />
                        <line x1="435" y1="585" x2="565" y2="585" />
                    </g>

                    <!-- Узловые точки (Азотистые основания) -->
                    <g fill="var(--accent)" opacity="0.9">
                        <circle cx="432" cy="210" r="3" />
                        <circle cx="568" cy="210" r="3" />
                        <circle cx="460" cy="260" r="3" />
                        <circle cx="540" cy="260" r="3" />
                        <circle cx="535" cy="375" r="3" />
                        <circle cx="465" cy="375" r="3" />
                        <circle cx="570" cy="430" r="3" />
                        <circle cx="430" cy="430" r="3" />
                        <circle cx="480" cy="540" r="3" />
                        <circle cx="520" cy="540" r="3" />
                    </g>
                </g>

                <!-- Метки интерфейса -->
                <g
                    fill="var(--text-secondary)"
                    font-family="monospace"
                    font-size="10"
                    opacity="0.4"
                >
                    <text x="110" y="125">SYS.DNA // SEQ-01</text>
                    <text x="810" y="680">ACTIVE</text>
                </g>
            </svg>
        </div>

        <!-- 4. Кванты аудиошума / Квантовый фон (GPU-ускоренный сдвиг) -->
        <div
            class="hifi-particle-field absolute -top-[500px] -left-[500px] h-[calc(100%+1000px)] w-[calc(100%+1000px)]"
        >
            <div class="hifi-particle-pattern absolute inset-0"></div>
        </div>
    </div>
</template>

<style scoped>
    /* Плавное "дыхание" фонового свечения (через transform scale вместо reflow) */
    .hifi-signal-glow {
        animation: signalPulse 8s ease-in-out infinite alternate;
        will-change: transform, opacity;
    }

    /* Эффект вращения ДНК в 3D (имитация цилиндрического поворота через scaleX) */
    .dna-helix-container {
        animation: dnaSpin 8s ease-in-out infinite;
        will-change: transform;
    }

    /* Растровая сетка шума рендерится один раз */
    .hifi-particle-pattern {
        background-image:
            radial-gradient(1px 1px at 120px 250px, var(--accent), transparent),
            radial-gradient(1.5px 1.5px at 340px 420px, var(--text-primary), transparent),
            radial-gradient(1px 1px at 580px 190px, var(--accent-hover), transparent),
            radial-gradient(1.5px 1.5px at 760px 610px, var(--border-strong), transparent),
            radial-gradient(1px 1px at 880px 330px, var(--text-secondary), transparent);
        background-size: 900px 900px;
        background-repeat: repeat;
        opacity: 0.3;
    }

    /* Аппаратный сдвиг шумового поля через transform3d */
    .hifi-particle-field {
        animation: driftNoiseSmooth 40s linear infinite;
        will-change: transform;
    }

    @keyframes signalPulse {
        0% {
            opacity: 0.12;
            transform: translate(-50%, -50%) scale3d(0.95, 0.95, 1);
        }
        100% {
            opacity: 0.22;
            transform: translate(-50%, -50%) scale3d(1.05, 1.05, 1);
        }
    }

    /* Ключевые кадры реалистичного вращения цепей ДНК */
    @keyframes dnaSpin {
        0% {
            transform: rotate3d(0, 1, 0, 0deg) scaleX(1);
        }
        25% {
            transform: rotate3d(0, 1, 0, 90deg) scaleX(0.2);
        }
        50% {
            transform: rotate3d(0, 1, 0, 180deg) scaleX(-1);
        }
        75% {
            transform: rotate3d(0, 1, 0, 270deg) scaleX(-0.2);
        }
        100% {
            transform: rotate3d(0, 1, 0, 360deg) scaleX(1);
        }
    }

    @keyframes driftNoiseSmooth {
        0% {
            transform: translate3d(0, 0, 0);
        }
        100% {
            transform: translate3d(-900px, -900px, 0);
        }
    }
</style>
