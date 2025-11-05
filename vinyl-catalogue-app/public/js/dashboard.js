// Dashboard Functions
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const stats = await response.json();
        
        document.getElementById('totalRecords').textContent = stats.totalRecords;
        document.getElementById('totalCustomers').textContent = stats.totalCustomers;
        document.getElementById('activeReservations').textContent = stats.activeReservations;
        document.getElementById('todaySales').textContent = `$${stats.todaySales.toFixed(2)}`;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}