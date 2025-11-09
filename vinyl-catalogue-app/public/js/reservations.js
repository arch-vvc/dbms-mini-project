
// =============================
// RESERVATIONS.JS
// =============================

// Load dropdowns for customer and record
async function loadReservationDropdowns() {
    try {
        // Load Customers
        const custResponse = await fetch(`${API_URL}/customers`);
        const customers = await custResponse.json();
        const custDropdown = document.getElementById('resCustomer');
        custDropdown.innerHTML = '<option value="">Select Customer</option>';
        customers.forEach(customer => {
            const name = `${customer.First_Name} ${customer.Last_Name}`;
            custDropdown.innerHTML += `<option value="${customer.Customer_ID}">${name}</option>`;
        });

        // Load Records
        const recResponse = await fetch(`${API_URL}/records`);
        const records = await recResponse.json();
        const recDropdown = document.getElementById('resRecord');
        recDropdown.innerHTML = '<option value="">Select Record</option>';
        records.forEach(record => {
            recDropdown.innerHTML += `<option value="${record.Record_ID}">${record.Title} (${record.Available_Copies} available)</option>`;
        });
    } catch (error) {
        console.error('Error loading reservation dropdowns:', error);
    }
}

// Load all reservations
async function loadReservations() {
    try {
        const response = await fetch(`${API_URL}/reservations`);
        const reservations = await response.json();

        const reservationsList = document.getElementById('reservationsList');
        if (reservations.length === 0) {
            reservationsList.innerHTML = '<p>No reservations found.</p>';
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Record</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        reservations.forEach(res => {
            const date = new Date(res.Reservation_Date).toLocaleDateString();
            const customer = `${res.First_Name} ${res.Last_Name}`;
            html += `
                <tr>
                    <td>${res.Reservation_ID}</td>
                    <td>${customer}</td>
                    <td>${res.Record_Title}</td>
                    <td>${date}</td>
                    <td>${res.Status}</td>
                    <td>
                        <button onclick="updateReservation(${res.Reservation_ID}, 'Completed')">Mark Completed</button>
                        <button class="btn-delete" onclick="deleteReservation(${res.Reservation_ID})">Delete</button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        reservationsList.innerHTML = html;
    } catch (error) {
        console.error('Error loading reservations:', error);
        document.getElementById('reservationsList').innerHTML = '<p>Error loading reservations</p>';
    }
}

// Handle reservation form submission
document.getElementById('reservationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const reservationData = {
        customer_id: document.getElementById('resCustomer').value,
        record_id: document.getElementById('resRecord').value
    };

    if (!reservationData.customer_id || !reservationData.record_id) {
        alert('Please select both customer and record.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationData)
        });

        const result = await response.json();

        if (response.ok) {
            
            document.getElementById('reservationForm').reset();
            loadReservations();
            loadReservationDropdowns();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding reservation:', error);
        alert('Error adding reservation');
    }
});

// Update reservation status
async function updateReservation(id, status) {
    try {
        const response = await fetch(`${API_URL}/reservations/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        const result = await response.json();
        if (response.ok) {
            
            loadReservations();
        } else {
            alert('Error updating status: ' + result.error);
        }
    } catch (error) {
        console.error('Error updating reservation:', error);
    }
}

// Delete reservation
async function deleteReservation(id) {
    if (!confirm('Are you sure you want to delete this reservation?')) return;

    try {
        const response = await fetch(`${API_URL}/reservations/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {

            loadReservations();
        } else {
            alert('Error deleting reservation: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting reservation:', error);
    }
}

// Load everything when page loads
window.addEventListener('DOMContentLoaded', async () => {
    await loadReservationDropdowns();
    await loadReservations();
});