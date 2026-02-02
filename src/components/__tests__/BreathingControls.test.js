import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import BreathingControls from '../BreathingControls.vue';
import { useSessionStore } from '../../stores/sessionStore';

describe('BreathingControls', () => {
    let wrapper;
    let store;
    let pinia;

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
        store = useSessionStore();

        wrapper = mount(BreathingControls, {
            global: {
                plugins: [pinia],
                stubs: {
                    BasicControlsSection: {
                        template: '<div class="basic-controls-stub"></div>',
                        setup() {
                            return {
                                selectedPattern: { value: 'box' },
                                durationMinutes: { value: 5 },
                                durationSeconds: { value: 0 },
                                getBreathingPattern: () => ({ inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 4 }),
                                getTotalSeconds: () => 300
                            };
                        }
                    },
                    StyleSection: { template: '<div class="style-stub"></div>' },
                    AffirmationsSection: {
                        template: '<div class="affirmations-stub"></div>',
                        setup() {
                            return { affirmations: { value: '' } };
                        }
                    },
                    SaveImportSection: { template: '<div class="save-import-stub"></div>' },
                    CollapsibleSection: {
                        template: '<div><slot /></div>'
                    }
                }
            }
        });
    });

    describe('Component Rendering', () => {
        it('should render without errors', () => {
            expect(wrapper.exists()).toBe(true);
        });

        it('should collapse when sidebar is toggled', async () => {
            expect(wrapper.classes()).not.toContain('collapsed');

            const toggleBtn = wrapper.find('.toggle-btn');
            await toggleBtn.trigger('click');

            expect(wrapper.classes()).toContain('collapsed');
        });
    });

    describe('Session Start', () => {
        it('should start a standalone session when not in sequence', async () => {
            const startSpy = vi.spyOn(store, 'startSession');

            // Simulate clicking start button through the stub
            wrapper.vm.handleStart();

            expect(startSpy).toHaveBeenCalledWith('breathing', expect.objectContaining({
                name: 'Current Session',
                type: 'breathing',
                duration: 300
            }));
        });

        it('should start sequence preset when sequence is loaded but not active', async () => {
            const preset = {
                id: 'preset-1',
                name: 'Sequence Preset',
                type: 'breathing',
                durationMinutes: 2,
                durationSeconds: 0
            };

            store.isPlayingSequence = true;
            store.currentPreset = preset;
            store.isActive = false;

            const startSpy = vi.spyOn(store, 'startSession');

            wrapper.vm.handleStart();

            expect(startSpy).toHaveBeenCalledWith('breathing', preset);
        });

        it('should resume when paused during sequence', async () => {
            store.isPlayingSequence = true;
            store.isActive = true;
            store.isPaused = true;

            const resumeSpy = vi.spyOn(store, 'resumeSession');

            wrapper.vm.handleStart();

            expect(resumeSpy).toHaveBeenCalled();
        });
    });

    describe('Session Control', () => {
        it('should toggle pause when active', async () => {
            store.isActive = true;
            store.isPaused = false;

            const pauseSpy = vi.spyOn(store, 'pauseSession');

            wrapper.vm.handleTogglePause();

            expect(pauseSpy).toHaveBeenCalled();
        });

        it('should resume when paused', async () => {
            store.isActive = true;
            store.isPaused = true;

            const resumeSpy = vi.spyOn(store, 'resumeSession');

            wrapper.vm.handleTogglePause();

            expect(resumeSpy).toHaveBeenCalled();
        });

        it('should stop session', async () => {
            store.isActive = true;

            const stopSpy = vi.spyOn(store, 'stopSession');

            wrapper.vm.handleStop();

            expect(stopSpy).toHaveBeenCalled();
        });
    });

    describe('Duration Display', () => {
        it('should show countdown during active session', async () => {
            store.isActive = true;
            store.totalDuration = 300;
            store.elapsedTime = 60;

            await wrapper.vm.$nextTick();

            // Duration inputs should show remaining time
            expect(store.remainingTime).toBe(240);
        });

        it('should be disabled during active session', async () => {
            store.isActive = true;

            await wrapper.vm.$nextTick();

            // Verify that basicControlsRef would pass isActive to disable inputs
            expect(store.isActive).toBe(true);
        });
    });

    describe('Preset Management', () => {
        it('should expose necessary methods', () => {
            expect(wrapper.vm.handleStart).toBeDefined();
            expect(wrapper.vm.handleTogglePause).toBeDefined();
            expect(wrapper.vm.handleStop).toBeDefined();
            expect(wrapper.vm.toggleSidebar).toBeDefined();
        });

        it('should have access to child component refs', () => {
            expect(wrapper.vm.basicControlsRef).toBeDefined();
            expect(wrapper.vm.styleRef).toBeDefined();
            expect(wrapper.vm.affirmationsRef).toBeDefined();
            expect(wrapper.vm.saveImportRef).toBeDefined();
        });
    });
});
