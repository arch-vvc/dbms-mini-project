/**
 * Handles switching between tabs in the main navigation.
 * @param {string} tabName - The ID of the tab content to show (e.g., 'dashboard', 'records')
 * @param {HTMLElement} clickedButton - The button element that was clicked (passed as 'this')
 */
function showTab(tabName, clickedButton) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked button
    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    // Load data for the selected tab
    switch (tabName) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'records':
            loadRecords();
            break;
        case 'artists':
            loadArtists();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'transactions':
            loadTransactions();
            break;
        case 'reservations':
            loadReservations();
            loadReservationDropdowns();
            break;
        case 'labels':
            loadLabels();
            break;
        case 'staff':
            loadStaff();
            break;
    }
}

// Initialize app when page loads
window.addEventListener('DOMContentLoaded', () => {
    // Find the default active button and tab, then load its data
    const activeButton = document.querySelector('.tab-button.active');
    if (activeButton) {
        // We get the tab name from the onclick attribute
        // Example: onclick="showTab('dashboard', this)"
        const onclickAttr = activeButton.getAttribute('onclick');
        const tabName = onclickAttr.split("'")[1];

        if (tabName === 'dashboard') {
            loadDashboardStats();
        }
        // You could add else-if blocks here if the default tab isn't dashboard
    }
});