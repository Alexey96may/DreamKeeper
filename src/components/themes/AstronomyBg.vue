<template>
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0b0f19]">
        <!-- 1. Фоновые сияния (Без тяжелого blur, чистые радиальные градиенты) -->
        <div
            class="absolute -top-40 -left-40 h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.08)_0%,transparent_60%)]"
        ></div>
        <div
            class="absolute top-1/2 -right-40 h-[500px] w-[500px] bg-[radial-gradient(circle,rgba(14,165,233,0.08)_0%,transparent_70%)]"
        ></div>

        <!-- 2. Вращающиеся орбитальные кольца (GPU-слой) -->
        <div
            class="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-15"
        >
            <svg
                class="orbit-spinning h-full w-full"
                viewBox="0 0 800 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    cx="400"
                    cy="400"
                    r="399"
                    stroke="#818cf8"
                    stroke-width="1"
                    stroke-dasharray="4 8"
                />
                <circle cx="400" cy="400" r="299" stroke="#6366f1" stroke-width="1" />
                <circle
                    cx="400"
                    cy="400"
                    r="199"
                    stroke="#818cf8"
                    stroke-width="1"
                    stroke-dasharray="2 12"
                />
                <!-- Координатные засечки -->
                <path
                    d="M400 0V20M400 780V800M0 400H20M780 400H800"
                    stroke="#818cf8"
                    stroke-width="2"
                />
            </svg>
        </div>
    </div>
</template>

<style scoped>
    /* Плавное вращение через GPU-трансформацию (0% Repaint) */
    .orbit-spinning {
        animation: spinSmooth 120s linear infinite;
        will-change: transform;
    }

    @keyframes spinSmooth {
        0% {
            transform: rotate3d(0, 0, 1, 0deg);
        }
        100% {
            transform: rotate3d(0, 0, 1, 360deg);
        }
    }
</style>
