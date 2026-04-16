document.addEventListener('DOMContentLoaded', () => {
    const ACTION_GET_STATE = 'getHideNazkUnsuficientDataState';
    const ACTION_TOGGLE = 'toggleHideNazkUnsuficientData';

    const toggleBtn = document.getElementById('toggleBtn');
    const statusEl = document.getElementById('status');

    function setStatus(enabled) {
        statusEl.textContent = enabled ? 'Hide mode: ON' : 'Hide mode: OFF';
    }

    function handleError(action) {
        statusEl.textContent = `Page content script not available. Source: ${action}.`;
        toggleBtn.disabled = true;
    }

    function refreshState() {
        chrome.runtime.sendMessage({ action: ACTION_GET_STATE }, response => {
            if (chrome.runtime.lastError || !response) {
                handleError(ACTION_GET_STATE);
                return;
            }
            setStatus(response.enabled);
        });
    }

    toggleBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: ACTION_TOGGLE }, response => {
            if (chrome.runtime.lastError || !response) {
                handleError(ACTION_TOGGLE);
                return;
            }
            setStatus(response.enabled);
        });
    });

    refreshState();
});
