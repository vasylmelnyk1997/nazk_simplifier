// TBD: add some logic to the popup, e.g., to show the current status of the content script or to allow toggling the hiding functionality on and off.

document.addEventListener('DOMContentLoaded', function() {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = 'NAZK Simplifier is ready.';
});