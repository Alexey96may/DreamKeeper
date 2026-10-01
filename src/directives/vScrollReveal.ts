import type { Directive } from 'vue';

interface WatchableElement extends HTMLElement {
    _observer?: IntersectionObserver;
}

export const vScrollReveal: Directive = {
    mounted(el: WatchableElement) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

        const observer = new IntersectionObserver(
            ([entry], obs) => {
                if (entry.isIntersecting) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    obs.disconnect();
                    delete el._observer;
                }
            },
            { threshold: 0.15 },
        );

        observer.observe(el);

        el._observer = observer;
    },

    unmounted(el: WatchableElement) {
        if (el._observer) {
            el._observer.disconnect();
            delete el._observer;
        }
    },
};
