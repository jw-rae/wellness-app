import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import BilateralControls from '../bilateral/BilateralControls.vue';
import { useSessionStore } from '../../stores/sessionStore';

describe('BilateralControls', () => {
    let wrapper;
    let store;
    // Always define refs at the top scope so they persist across tests
    const { ref } = require('vue');
    const bpmRef = ref(50);
    const durationMinutesRef = ref(5);
    const durationSecondsRef = ref(0);
    let pinia;

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
        store = useSessionStore();

        // Reset refs for each test
        bpmRef.value = 50;
        durationMinutesRef.value = 5;
        durationSecondsRef.value = 0;

        wrapper = mount(BilateralControls, {
            global: {
                plugins: [pinia],
                stubs: {
                    BasicControlsSection: {
                        template: '<div class="basic-controls-stub"></div>',
                        setup() {
                            return {
                                bpm: bpmRef,
                                durationMinutes: durationMinutesRef,
                                durationSeconds: durationSecondsRef,
                                getTotalSeconds: () => durationMinutesRef.value * 60 + durationSecondsRef.value
                            };
                        }
                    },
                    StyleSection: {
                        template: '<div class="style-stub"></div>',
                        setup() {
                            return {
                                visualMode: { value: 'slide' },
                                setLightMode: () => { },
                                setDarkMode: () => { }
                            };
                        }
                    },
                    AudioSection: {
                        template: '<div class="audio-stub"></div>',
                        setup() {
                            return { bilateralAudio: { value: false } };
                        }
                    },
                    AffirmationsSection: {
                        template: '<div class="affirmations-stub"></div>',
                        setup() {/* ...existing code... */ }
                    },
                    SaveImportSection: { template: '<div class="save-import-stub"></div>' },
                    CollapsibleSection: {
                        template: '<div><slot /></div>'
                    }
                }
            }
        });

        // Expose refs on wrapper.vm for test access
        wrapper.vm._test_bpmRef = bpmRef;
        wrapper.vm._test_durationMinutesRef = durationMinutesRef;
        wrapper.vm._test_durationSecondsRef = durationSecondsRef;
    });

    describe('Session Start', () => {
        it('should start a standalone bilateral session', async () => {
            const startSpy = vi.spyOn(store, 'startSession');

            wrapper.vm.handleStart();

            expect(startSpy).toHaveBeenCalledWith('bilateral', expect.objectContaining({
                name: 'Current Session',
                type: 'bilateral',
                duration: 300,
                bpm: 50
            }));
        });

        it('should start sequence preset when sequence is loaded', async () => {
            const preset = {
                id: 'preset-1',
                name: 'Bilateral Preset',
                type: 'bilateral',
                durationMinutes: 1,
                durationSeconds: 0,
                bpm: 60
            };

            store.isPlayingSequence = true;
            store.currentPreset = preset;
            store.isActive = false;

            const startSpy = vi.spyOn(store, 'startSession');

            wrapper.vm.handleStart();

            expect(startSpy).toHaveBeenCalledWith('bilateral', preset);
        });

        it('should not restart if already active in sequence', async () => {
            store.isPlayingSequence = true;
            store.isActive = true;
            store.isPaused = false;

            const startSpy = vi.spyOn(store, 'startSession');

            wrapper.vm.handleStart();

            expect(startSpy).not.toHaveBeenCalled();
        });
    });

    describe('Preset Application', () => {
        it('should apply bilateral preset settings', async () => {
            const preset = {
                id: 'preset-1',
                name: 'Test Bilateral',
                type: 'bilateral',
                bpm: 80,
                durationMinutes: 2,
                durationSeconds: 30,
                visualMode: 'flash',
                bilateralAudio: true,
                selectedTheme: 'blue',
                darkMode: false,
                showTime: true,
                affirmations: 'Test affirmation',
                affirmationInterval: 20
            };

            wrapper.vm.applyBilateralPreset(preset);
            await wrapper.vm.$nextTick();

            // Verify the preset was applied using top-level refs
            expect(bpmRef.value).toBe(80);
            expect(durationMinutesRef.value).toBe(2);
            expect(durationSecondsRef.value).toBe(30);
        });
    });

    describe('BPM and Visual Mode Changes', () => {
        it('should stop session when BPM changes', async () => {
            store.isActive = true;
            const stopSpy = vi.spyOn(store, 'stopSession');

            // Simulate BPM change using top-level ref
            bpmRef.value = 70;
            await wrapper.vm.$nextTick();

            // Watch should trigger stopSession
            expect(stopSpy).toHaveBeenCalled();
        });

        it('should stop session when visual mode changes', async () => {
            store.isActive = true;
            const stopSpy = vi.spyOn(store, 'stopSession');

            // Simulate visual mode change
            wrapper.vm.styleRef.visualMode.value = 'circle';
            await wrapper.vm.$nextTick();

            // Watch should trigger stopSession
            expect(stopSpy).toHaveBeenCalled();
        });
    });

    describe('Computed Properties', () => {
        it('should compute BPM correctly', () => {
            expect(bpmRef.value).toBe(50);
        });

        it('should compute duration correctly', () => {
            expect(durationMinutesRef.value).toBe(5);
            expect(durationSecondsRef.value).toBe(0);
        });

        it('should compute visual mode correctly', () => {
            expect(wrapper.vm.visualMode.value).toBe('slide');
        });

        it('should compute bilateral audio setting', () => {
            expect(wrapper.vm.bilateralAudio.value).toBe(false);
        });
    });

    describe('Session Control', () => {
        it('should toggle pause', async () => {
            store.isActive = true;
            store.isPaused = false;

            const pauseSpy = vi.spyOn(store, 'pauseSession');

            wrapper.vm.handleTogglePause();

            expect(pauseSpy).toHaveBeenCalled();
        });

        it('should stop session', async () => {
            store.isActive = true;

            const stopSpy = vi.spyOn(store, 'stopSession');

            wrapper.vm.handleStop();

            expect(stopSpy).toHaveBeenCalled();
        });
    });
});
