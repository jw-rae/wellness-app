import { ref } from 'vue';

export function useSequences() {
    const sequences = ref([]);

    function loadSequences() {
        try {
            const stored = localStorage.getItem('wellness_sequences');
            if (stored) {
                sequences.value = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading sequences:', error);
        }
    }

    function saveSequences() {
        try {
            localStorage.setItem('wellness_sequences', JSON.stringify(sequences.value));
        } catch (error) {
            console.error('Error saving sequences:', error);
        }
    }

    function addSequence(sequence) {
        sequences.value.push(sequence);
        saveSequences();
    }

    function deleteSequence(sequenceId) {
        const index = sequences.value.findIndex(s => s.id === sequenceId);
        if (index !== -1) {
            sequences.value.splice(index, 1);
            saveSequences();
        }
    }

    return {
        sequences,
        loadSequences,
        saveSequences,
        addSequence,
        deleteSequence
    };
}
