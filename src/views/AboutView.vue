<script setup lang="ts">
    import { Moon, BookOpen, Sparkles, ShieldCheck, Compass, ArrowRight } from 'lucide-vue-next';
    import AppButton from '@/components/ui/AppButton.vue';

    const features = [
        {
            icon: BookOpen,
            title: 'Фиксация сновидений',
            description:
                'Записывайте детали сразу после пробуждения, сохраняя образы, эмоции и ключевые сюжетные повороты до того, как они растворятся в памяти.',
        },
        {
            icon: Sparkles,
            title: 'Анализ и символизм',
            description:
                'Исследуйте повторяющиеся паттерны, персонажей и метафоры. Понимайте скрытые знаки подсознания через структурированные теги и категории.',
        },
        {
            icon: Compass,
            title: 'Интерактивный журнал',
            description:
                'Удобная навигация по записям, фильтрация по настроению и осознанности. Отслеживайте динамику ваших снов с течением времени.',
        },
        {
            icon: ShieldCheck,
            title: 'Приватность данных',
            description:
                'Ваши личные переживания и сокровенные сны принадлежат только вам. Максимальная конфиденциальность и безопасность каждой записи.',
        },
    ];

    const steps = [
        {
            number: '01',
            title: 'Пробуждение',
            text: 'Не вставая с постели, сразу после пробуждения зафиксируйте в памяти ключевые образы.',
        },
        {
            number: '02',
            title: 'Запись',
            text: 'Откройте DreamKeeper и перенесите детали наброском: эмоции, цвета, людей, места.',
        },
        {
            number: '03',
            title: 'Рефлексия',
            text: 'Проставляйте теги, оценивайте яркость и осознанность, со временем находя глубокие смыслы.',
        },
    ];
</script>

<template>
    <div class="px-4 py-12 sm:px-6 lg:px-8">
        <!-- Главный контейнер через flex flex-col gap-16 -->
        <div class="container mx-auto flex flex-col gap-16">
            <!-- Hero Section -->
            <section class="flex flex-col items-center gap-2 text-center">
                <div
                    class="bg-accent-soft/50 text-accent mb-2 inline-flex items-center justify-center rounded-2xl p-3"
                >
                    <Moon class="h-10 w-10 shrink-0" aria-hidden="true" />
                </div>
                <div class="flex flex-col gap-6">
                    <h1 class="text-text-primary font-extrabold tracking-tight">
                        О проекте <span class="text-text-primary">Dream</span
                        ><span class="text-accent">Keeper</span>
                    </h1>
                    <p class="text-text-soft mx-auto max-w-2xl leading-relaxed">
                        Ваш личный проводник в бессознательное. Пространство для бережного
                        сохранения, анализа и осмысления каждого ночного путешествия.
                    </p>
                </div>
            </section>

            <!-- Core Concept / Philosophy -->
            <section
                class="bg-bg-secondary border-border flex flex-col gap-4 rounded-2xl border p-8 shadow-sm"
            >
                <h2 class="text-text-primary font-bold">Суть платформы</h2>
                <p class="text-text-soft leading-relaxed">
                    Сны — это уникальный язык нашего разума, на котором подсознание ведет диалог с
                    реальностью. Однако память о них хрупка: без своевременной фиксации детали
                    исчезают за считанные минуты.
                    <strong class="text-text-primary font-medium">DreamKeeper</strong> создан для
                    того, чтобы сделать этот процесс простым, эстетичным и глубоким, помогая вам
                    исследовать внутренний мир, развивать осознанность и находить ответы на важные
                    вопросы.
                </p>
            </section>

            <!-- How to Use -->
            <section class="flex flex-col gap-8">
                <div class="flex flex-col gap-2 text-center">
                    <h2 class="text-text-primary font-bold">Как использовать сервис</h2>
                    <p class="text-text-soft">Три простых шага к осознанному ведению дневника</p>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <article
                        v-for="step in steps"
                        :key="step.number"
                        class="bg-bg-secondary border-border relative flex flex-col justify-between rounded-xl border p-6"
                    >
                        <div class="flex flex-col gap-3">
                            <span class="text-accent/40 font-mono font-extrabold">{{
                                step.number
                            }}</span>
                            <h3 class="text-text-primary font-semibold">
                                {{ step.title }}
                            </h3>
                            <p class="text-text-soft leading-relaxed">{{ step.text }}</p>
                        </div>
                    </article>
                </div>
            </section>

            <!-- Features Grid -->
            <section class="flex flex-col gap-8">
                <h2 class="text-text-primary text-center font-bold">Возможности</h2>

                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div
                        v-for="feature in features"
                        :key="feature.title"
                        class="bg-bg-secondary border-border flex flex-col gap-3 rounded-xl border p-6"
                    >
                        <div class="bg-accent-soft/30 text-accent w-fit rounded-lg p-2.5">
                            <component
                                :is="feature.icon"
                                class="h-5 w-5 shrink-0"
                                aria-hidden="true"
                            />
                        </div>
                        <h3 class="text-text-primary font-semibold">{{ feature.title }}</h3>
                        <p class="text-text-soft leading-relaxed">
                            {{ feature.description }}
                        </p>
                    </div>
                </div>
            </section>

            <!-- Call to Action -->
            <section
                class="bg-bg-secondary border-border flex flex-col items-center gap-6 rounded-2xl border p-10 text-center shadow-sm"
            >
                <div class="flex flex-col gap-2">
                    <h2 class="text-text-primary font-bold">Готовы начать путешествие?</h2>
                    <p class="text-text-soft mx-auto max-w-md">
                        Запишите свой первый сон прямо сейчас и откройте дверь в неизведанные уголки
                        разума.
                    </p>
                </div>
                <div>
                    <AppButton to="/" variant="primary" size="md" :icon-right="ArrowRight">
                        Перейти к записям
                    </AppButton>
                </div>
            </section>
        </div>
    </div>
</template>
