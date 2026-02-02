import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSessionStore } from '../sessionStore';

describe('sessionStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.useFakeTimers();
    });

    describe('Session State', () => {
        it('should initialize with default state', () => {
            const store = useSessionStore();

            expect(store.isActive).toBe(false);
            expect(store.isPaused).toBe(false);
            expect(store.currentMode).toBe(null);
            expect(store.elapsedTime).toBe(0);
            expect(store.totalDuration).toBe(0);
            expect(store.isPlayingSequence).toBe(false);
        });

        it('should calculate remaining time correctly', () => {
            const store = useSessionStore();
            store.totalDuration = 100;
            store.elapsedTime = 30;

            expect(store.remainingTime).toBe(70);
        });
    });

    describe('startSession', () => {
        it('should start a breathing session with correct duration', () => {
            const store = useSessionStore();
            const preset = {
                id: 'test-1',
                name: 'Test Breathing',
                type: 'breathing',
                durationMinutes: 2,
                durationSeconds: 30,
                breathingPattern: { inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 4 }
            };

            store.startSession('breathing', preset);

            expect(store.isActive).toBe(true);
            expect(store.currentMode).toBe('breathing');
            expect(store.totalDuration).toBe(150); // 2*60 + 30
            expect(store.currentPreset).toEqual(preset);
        });

        it('should start a bilateral session with correct duration', () => {
            const store = useSessionStore();
            const preset = {
                id: 'test-2',
                name: 'Test Bilateral',
                type: 'bilateral',
                durationMinutes: 1,
                durationSeconds: 0,
                bpm: 50
            };

            store.startSession('bilateral', preset);

            expect(store.isActive).toBe(true);
            expect(store.currentMode).toBe('bilateral');
            expect(store.totalDuration).toBe(60);
        });

        it('should prioritize durationMinutes/Seconds over duration field', () => {
            const store = useSessionStore();
            const preset = {
                id: 'test-3',
                name: 'Test Priority',
                type: 'breathing',
                duration: 300, // 5 minutes
                durationMinutes: 0,
                durationSeconds: 30 // 30 seconds - should win
            };

            store.startSession('breathing', preset);

            expect(store.totalDuration).toBe(30);
        });
    });

    describe('Timer Management', () => {
        it('should increment elapsed time every second', () => {
            const store = useSessionStore();
            const preset = {
                id: 'test-4',
                name: 'Timer Test',
                type: 'breathing',
                durationMinutes: 0,
                durationSeconds: 10
            };

            store.startSession('breathing', preset);
            expect(store.elapsedTime).toBe(0);

            vi.advanceTimersByTime(1000);
            expect(store.elapsedTime).toBe(1);

            vi.advanceTimersByTime(3000);
            expect(store.elapsedTime).toBe(4);
        });

        it('should not increment time when paused', () => {
            const store = useSessionStore();
            const preset = {
                id: 'test-5',
                name: 'Pause Test',
                type: 'breathing',
                durationMinutes: 0,
                durationSeconds: 10
            };

            store.startSession('breathing', preset);
            vi.advanceTimersByTime(2000);
            expect(store.elapsedTime).toBe(2);

            store.pauseSession();
            vi.advanceTimersByTime(3000);
            expect(store.elapsedTime).toBe(2); // Should not change

            store.resumeSession();
            vi.advanceTimersByTime(2000);
            expect(store.elapsedTime).toBe(4);
        });

        it('should complete session when time runs out', () => {
            const store = useSessionStore();
            const preset = {
                id: 'test-6',
                name: 'Complete Test',
                type: 'breathing',
                durationMinutes: 0,
                durationSeconds: 3
            };

            store.startSession('breathing', preset);

            vi.advanceTimersByTime(3000);

            expect(store.isActive).toBe(false);
            expect(store.elapsedTime).toBe(0);
        });
    });

    describe('Sequence Playback', () => {
        it('should load sequence with first preset inactive', () => {
            const store = useSessionStore();
            const sequence = { id: 'seq-1', name: 'Test Sequence' };
            const presets = [
                {
                    id: 'preset-1',
                    name: 'First',
                    type: 'breathing',
                    durationMinutes: 0,
                    durationSeconds: 30
                },
                {
                    id: 'preset-2',
                    name: 'Second',
                    type: 'bilateral',
                    durationMinutes: 1,
                    durationSeconds: 0
                }
            ];

            store.startSequence(sequence, presets);

            expect(store.isPlayingSequence).toBe(true);
            expect(store.isActive).toBe(false); // Not started yet
            expect(store.currentPreset).toEqual(presets[0]);
            expect(store.totalDuration).toBe(30);
            expect(store.currentStepIndex).toBe(0);
        });

        it('should advance to next preset when current completes', () => {
            const store = useSessionStore();
            const sequence = { id: 'seq-2', name: 'Multi Sequence' };
            const presets = [
                {
                    id: 'preset-1',
                    name: 'First',
                    type: 'breathing',
                    durationMinutes: 0,
                    durationSeconds: 2
                },
                {
                    id: 'preset-2',
                    name: 'Second',
                    type: 'bilateral',
                    durationMinutes: 0,
                    durationSeconds: 2
                }
            ];

            store.startSequence(sequence, presets);
            store.startSession('breathing', presets[0]); // User starts

            // Complete first preset
            vi.advanceTimersByTime(2000);

            expect(store.currentStepIndex).toBe(1);
            expect(store.currentPreset).toEqual(presets[1]);
            expect(store.isActive).toBe(true); // Auto-started
            expect(store.totalDuration).toBe(2);
        });

        it('should end sequence after last preset completes', () => {
            const store = useSessionStore();
            const sequence = { id: 'seq-3', name: 'Short Sequence' };
            const presets = [
                {
                    id: 'preset-1',
                    name: 'Only One',
                    type: 'breathing',
                    durationMinutes: 0,
                    durationSeconds: 2
                }
            ];

            store.startSequence(sequence, presets);
            store.startSession('breathing', presets[0]);

            vi.advanceTimersByTime(2000);

            expect(store.isPlayingSequence).toBe(false);
            expect(store.isActive).toBe(false);
            expect(store.currentPreset).toBe(null);
        });
    });

    describe('Session Control', () => {
        it('should pause and resume session', () => {
            const store = useSessionStore();
            const preset = {
                id: 'test-7',
                name: 'Pause Resume Test',
                type: 'breathing',
                durationMinutes: 0,
                durationSeconds: 10
            };

            store.startSession('breathing', preset);
            expect(store.isPaused).toBe(false);

            store.pauseSession();
            expect(store.isPaused).toBe(true);

            store.resumeSession();
            expect(store.isPaused).toBe(false);
        });

        it('should stop session and reset all state', () => {
            const store = useSessionStore();
            const preset = {
                id: 'test-8',
                name: 'Stop Test',
                type: 'breathing',
                durationMinutes: 0,
                durationSeconds: 10
            };

            store.startSession('breathing', preset);
            vi.advanceTimersByTime(3000);

            store.stopSession();

            expect(store.isActive).toBe(false);
            expect(store.isPaused).toBe(false);
            expect(store.currentMode).toBe(null);
            expect(store.currentPreset).toBe(null);
            expect(store.elapsedTime).toBe(0);
            expect(store.totalDuration).toBe(0);
        });
    });
});
