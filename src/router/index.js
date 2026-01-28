import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/breathing',
        },
        {
            path: '/breathing',
            name: 'breathing',
            component: () => import('../views/BreathingView.vue'),
            meta: { title: 'Breathing' },
        },
        {
            path: '/bilateral',
            name: 'bilateral',
            component: () => import('../views/BilateralView.vue'),
            meta: { title: 'Bilateral (EMDR)' },
        },
        {
            path: '/presets',
            name: 'presets',
            component: () => import('../views/PresetsView.vue'),
            meta: { title: 'Presets & Sequences' },
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue'),
            meta: { title: 'About' },
        },
    ],
});

// Update document title on route change
router.beforeEach((to, from, next) => {
    document.title = to.meta.title ? `${to.meta.title} - Wellness App` : 'Wellness App';
    next();
});

export default router;
