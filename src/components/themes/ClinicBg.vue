<template>
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bg-primary)]">
        <!-- 1. Терапевтическая аура инсайта (Без тяжелого blur) -->
        <div
            class="clinic-aura absolute -top-32 left-1/2 h-[700px] w-[900px] bg-[radial-gradient(ellipse_at_center,var(--accent)_0%,var(--accent-subtle)_50%,transparent_70%)] opacity-15"
        ></div>

        <!-- 2. Защищенное пространство сеанса (Безопасный контейнер / Vignette) -->
        <div class="absolute inset-0 shadow-[inset_0_0_180px_rgba(15,23,42,0.4)]"></div>

        <!-- 3. Психоаналитическая графика: Оси ассоциаций и проективный паттерн Роршаха (SVG) -->
        <div class="absolute inset-0 flex items-center justify-center opacity-30">
            <svg
                class="h-full max-h-[850px] w-full max-w-5xl"
                viewBox="0 0 1000 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <!-- Граница сеттинга / Аналитического пространства -->
                <rect
                    x="120"
                    y="100"
                    width="760"
                    height="600"
                    rx="16"
                    stroke="var(--border-color)"
                    stroke-width="1"
                    stroke-dasharray="6 6"
                    opacity="0.4"
                />

                <!-- Фокус свободного внимания (Центр сеанса) -->
                <g
                    stroke="var(--accent)"
                    opacity="0.5"
                    class="breath-target"
                    transform-origin="500 400"
                >
                    <circle
                        cx="500"
                        cy="400"
                        r="45"
                        stroke="var(--accent)"
                        stroke-width="1"
                        stroke-dasharray="3 3"
                    />
                    <circle
                        cx="500"
                        cy="400"
                        r="8"
                        fill="var(--accent-subtle)"
                        stroke="var(--accent)"
                        stroke-width="1.5"
                    />
                    <line x1="480" y1="400" x2="450" y2="400" stroke-width="1" />
                    <line x1="520" y1="400" x2="550" y2="400" stroke-width="1" />
                    <line x1="500" y1="380" x2="500" y2="350" stroke-width="1" />
                    <line x1="500" y1="420" x2="500" y2="450" stroke-width="1" />
                </g>

                <!-- Симметричный паттерн бессознательного (Проективный тест / Роршах) -->
                <g stroke="var(--border-strong)" stroke-width="1.2" opacity="0.35">
                    <!-- Левое полушарие восприятия -->
                    <path
                        d="M 500 400 C 400 300, 280 220, 180 280 C 100 330, 150 500, 270 520 C 370 535, 460 440, 500 400 Z"
                        stroke-dasharray="2 4"
                    />
                    <!-- Правое полушарие восприятия -->
                    <path
                        d="M 500 400 C 600 300, 720 220, 820 280 C 900 330, 850 500, 730 520 C 630 535, 540 440, 500 400 Z"
                        stroke-dasharray="2 4"
                    />
                </g>

                <!-- Гармоничный ритм ЭЭГ / Ассоциативная волна -->
                <path
                    d="M 160 400 Q 240 370 330 400 T 500 400 T 670 400 T 840 400"
                    stroke="var(--accent)"
                    stroke-width="1.5"
                    opacity="0.4"
                    fill="none"
                />

                <!-- Шкалы аналитического сеттинга (Слева и справа) -->
                <g
                    fill="var(--border-color)"
                    stroke="var(--border-color)"
                    opacity="0.3"
                    stroke-width="1"
                >
                    <!-- Левая вертикаль -->
                    <line x1="80" y1="200" x2="80" y2="600" />
                    <line x1="74" y1="200" x2="86" y2="200" />
                    <line x1="76" y1="300" x2="84" y2="300" />
                    <line x1="74" y1="400" x2="86" y2="400" />
                    <line x1="76" y1="500" x2="84" y2="500" />
                    <line x1="74" y1="600" x2="86" y2="600" />

                    <!-- Правая вертикаль -->
                    <line x1="920" y1="200" x2="920" y2="600" />
                    <line x1="914" y1="200" x2="926" y2="200" />
                    <line x1="916" y1="300" x2="924" y2="300" />
                    <line x1="914" y1="400" x2="926" y2="400" />
                    <line x1="916" y1="500" x2="924" y2="500" />
                    <line x1="914" y1="600" x2="926" y2="600" />
                </g>
            </svg>
        </div>

        <!-- 4. Аппаратно-ускоренные синаптические импульсы (GPU Compositing) -->
        <div
            class="clinic-particle-field absolute -top-[350px] -left-[350px] h-[calc(100%+700px)] w-[calc(100%+700px)]"
        >
            <div class="clinic-particle-pattern absolute inset-0"></div>
        </div>
    </div>
</template>

<style scoped>
    /* Пульсация терапевтической ауры через transform (без рефлоу) */
    .clinic-aura {
        animation: pulseAura 9s ease-in-out infinite alternate;
        will-change: opacity, transform;
    }

    /* Ритмичный фокус внимания */
    .breath-target {
        animation: breathCycle 8s ease-in-out infinite;
        will-change: transform, opacity;
    }

    /* Растровый узор синапсов рендерится один раз */
    .clinic-particle-pattern {
        background-image:
            radial-gradient(1.5px 1.5px at 150px 200px, var(--accent), transparent),
            radial-gradient(2px 2px at 380px 480px, var(--text-primary), transparent),
            radial-gradient(1.5px 1.5px at 620px 180px, var(--border-strong), transparent),
            radial-gradient(2px 2px at 780px 520px, var(--accent-hover), transparent),
            radial-gradient(1.5px 1.5px at 890px 280px, var(--text-secondary), transparent);
        background-size: 1000px 700px;
        background-repeat: repeat;
        opacity: 0.35;
    }

    /* Плавный дрейф мыслей через translate3d (0% Repaint) */
    .clinic-particle-field {
        animation: driftParticlesSmooth 35s linear infinite;
        will-change: transform;
    }

    @keyframes pulseAura {
        0% {
            opacity: 0.1;
            transform: translate3d(-50%, 0, 0) scale3d(0.95, 0.95, 1);
        }
        100% {
            opacity: 0.2;
            transform: translate3d(-50%, 0, 0) scale3d(1.05, 1.05, 1);
        }
    }

    @keyframes breathCycle {
        0%,
        100% {
            transform: scale3d(1, 1, 1);
            opacity: 0.4;
        }
        50% {
            transform: scale3d(1.12, 1.12, 1);
            opacity: 0.7;
        }
    }

    @keyframes driftParticlesSmooth {
        0% {
            transform: translate3d(0, 0, 0);
        }
        100% {
            transform: translate3d(-500px, -350px, 0);
        }
    }
</style>
