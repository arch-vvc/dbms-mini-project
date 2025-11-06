function showTab(tabName, event) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked button
    if (event) event.target.classList.add('active');

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
    loadDashboardStats();
});