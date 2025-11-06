// ===========================
// DASHBOARD.JS
// ===========================

async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const stats = await response.json();

        // Update stat cards
        document.getElementById('totalRecords').textContent = stats.totalRecords;
        document.getElementById('totalCustomers').textContent = stats.totalCustomers;
        document.getElementById('activeReservations').textContent = stats.activeReservations;
        document.getElementById('todaySales').textContent = `$${parseFloat(stats.todaySales || 0).toFixed(2)}`;

        // Render recent transactions
        displayRecentTransactions(stats.recentTransactions || []);
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function displayRecentTransactions(transactions) {
    const container = document.getElementById('recentTransactions');

    if (!transactions.length) {
        container.innerHTML = '<p>No transactions yet today.</p>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Record</th>
                    <th>Type</th>
                    <th>Total ($)</th>
                </tr>
            </thead>
            <tbody>
    `;

    transactions.forEach(t => {
        const date = new Date(t.Transaction_Date).toLocaleDateString();
        const customer = t.First_Name ? `${t.First_Name} ${t.Last_Name}` : 'Unknown';
        html += `
            <tr>
                <td>${t.Transaction_ID}</td>
                <td>${date}</td>
                <td>${customer}</td>
                <td>${t.Title || '-'}</td>
                <td>${t.Transaction_Type}</td>
                <td>${t.Total_Amount}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}