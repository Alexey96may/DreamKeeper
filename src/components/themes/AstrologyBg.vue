<template>
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bg-primary)]">
        <!-- 1. Фиолетово-пурпурная туманность (Без тяжелого blur) -->
        <div
            class="nebula-pulse absolute -top-40 -right-20 h-[750px] w-[750px] rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-15"
        ></div>

        <!-- 2. Глубокий мистический отблеск снизу -->
        <div
            class="absolute -bottom-32 -left-20 h-[650px] w-[650px] rounded-full bg-[radial-gradient(circle,var(--mystical-bg)_0%,transparent_70%)] opacity-40"
        ></div>

        <!-- 3. Небесная сфера и зодиакальное колесо (SVG) -->
        <div class="absolute inset-0 flex items-center justify-center opacity-35">
            <svg
                class="zodiac-wheel h-full max-h-[850px] w-full max-w-4xl"
                viewBox="0 0 800 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <!-- Внешний градуированный обод зодиака -->
                <circle
                    cx="400"
                    cy="400"
                    r="360"
                    stroke="var(--border-strong)"
                    stroke-width="1.2"
                    opacity="0.7"
                />
                <circle
                    cx="400"
                    cy="400"
                    r="340"
                    stroke="var(--border-color)"
                    stroke-width="0.8"
                    stroke-dasharray="2 6"
                />
                <circle
                    cx="400"
                    cy="400"
                    r="325"
                    stroke="var(--accent)"
                    stroke-width="1"
                    stroke-dasharray="12 4"
                    opacity="0.6"
                />

                <!-- 12 Астрологических домов -->
                <g stroke="var(--border-color)" stroke-width="0.8" opacity="0.5">
                    <line x1="400" y1="75" x2="400" y2="725" />
                    <line x1="75" y1="400" x2="725" y2="400" />
                    <line x1="118" y1="237" x2="682" y2="563" />
                    <line x1="118" y1="563" x2="682" y2="237" />
                    <line x1="237" y1="118" x2="563" y2="682" />
                    <line x1="237" y1="682" x2="563" y2="118" />
                </g>

                <!-- Орбитальные кольца и планетарные узлы -->
                <circle
                    cx="400"
                    cy="400"
                    r="230"
                    stroke="var(--text-muted)"
                    stroke-width="0.8"
                    stroke-dasharray="4 8"
                    opacity="0.4"
                />
                <circle
                    cx="400"
                    cy="400"
                    r="150"
                    stroke="var(--accent)"
                    stroke-width="1"
                    opacity="0.5"
                />

                <!-- 12-конечная звезда аспектов -->
                <polygon
                    points="400,250 438,362 550,325 475,400 550,475 438,438 400,550 362,438 250,475 325,400 250,325 362,362"
                    stroke="var(--border-strong)"
                    stroke-width="0.8"
                    fill="none"
                    opacity="0.4"
                />

                <!-- Планеты на орбитах -->
                <circle cx="400" cy="170" r="4" fill="var(--accent-hover)" />
                <circle cx="630" cy="400" r="6" fill="var(--text-secondary)" />
                <circle cx="237" cy="563" r="5" fill="var(--mystical-text)" />
                <circle cx="400" cy="250" r="3" fill="var(--text-primary)" />

                <!-- Внутреннее ядро созерцания -->
                <circle
                    cx="400"
                    cy="400"
                    r="40"
                    stroke="var(--border-strong)"
                    stroke-width="1"
                    stroke-dasharray="2 4"
                />
                <circle cx="400" cy="400" r="6" fill="var(--accent)" opacity="0.8" />
            </svg>
        </div>

        <!-- 4. Аппаратно-ускоренные звезды и звездная пыль -->
        <div
            class="starlight-field absolute -top-[350px] -left-[350px] h-[calc(100%+700px)] w-[calc(100%+700px)]"
        >
            <div class="starlight-pattern absolute inset-0"></div>
        </div>
    </div>
</template>

<style scoped>
    /* Вращение небесной сферы через GPU-слой */
    .zodiac-wheel {
        animation: rotateZodiacSmooth 180s linear infinite;
        transform-origin: center;
        will-change: transform;
    }

    /* Пульсация туманности через opacity */
    .nebula-pulse {
        animation: pulseSmooth 11s ease-in-out infinite alternate;
        will-change: opacity;
    }

    /* Статический растровый паттерн звезд */
    .starlight-pattern {
        background-image:
            radial-gradient(1.5px 1.5px at 70px 100px, var(--accent-hover), transparent),
            radial-gradient(2px 2px at 240px 380px, var(--text-primary), transparent),
            radial-gradient(1.5px 1.5px at 490px 140px, var(--mystical-text), transparent),
            radial-gradient(2px 2px at 650px 510px, var(--border-strong), transparent),
            radial-gradient(1.5px 1.5px at 810px 240px, var(--accent), transparent),
            radial-gradient(2px 2px at 300px 620px, var(--text-secondary), transparent);
        background-size: 850px 750px;
        background-repeat: repeat;
        opacity: 0.5;
    }

    /* Плавный дрейф звезд через translate3d (0% Repaint) */
    .starlight-field {
        animation: driftStarsSmooth 40s linear infinite;
        will-change: transform;
    }

    @keyframes rotateZodiacSmooth {
        0% {
            transform: rotate3d(0, 0, 1, 0deg);
        }
        100% {
            transform: rotate3d(0, 0, 1, 360deg);
        }
    }

    @keyframes pulseSmooth {
        0% {
            opacity: 0.1;
        }
        100% {
            opacity: 0.2;
        }
    }

    @keyframes driftStarsSmooth {
        0% {
            transform: translate3d(0, 0, 0);
        }
        100% {
            transform: translate3d(-425px, 375px, 0);
        }
    }
</style>
