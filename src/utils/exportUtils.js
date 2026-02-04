export function exportPreset(preset) {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');

    const json = JSON.stringify(preset, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${preset.type}_${dateStr}_${preset.name.replace(/\s+/g, '_')}.json`;
    a.click();

    URL.revokeObjectURL(url);
}
