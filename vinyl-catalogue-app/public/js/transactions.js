
async function loadTransactions() {
    try {
        await loadTransactionDropdowns();
        
        const response = await fetch(`${API_URL}/transactions`);
        const transactions = await response.json();
        
        const transactionsList = document.getElementById('transactionsList');
        
        if (transactions.length === 0) {
            transactionsList.innerHTML = '<p>No transactions yet.</p>';
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
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                        <th>Staff</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        transactions.forEach(trans => {
            const date = new Date(trans.Transaction_Date).toLocaleDateString();
            const customerName = trans.First_Name ? `${trans.First_Name} ${trans.Last_Name}` : 'Unknown';
            
            html += `
                <tr>
                    <td>${trans.Transaction_ID}</td>
                    <td>${date}</td>
                    <td>${customerName}</td>
                    <td>${trans.Record_Title || 'Unknown'}</td>
                    <td>${trans.Transaction_Type}</td>
                    <td>${trans.Quantity}</td>
                    <td>$${trans.Unit_Price}</td>
                    <td>$${trans.Total_Amount}</td>
                    <td>${trans.Staff_Name || 'Unknown'}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        transactionsList.innerHTML = html;
    } catch (error) {
        console.error('Error loading transactions:', error);
        document.getElementById('transactionsList').innerHTML = '<p>Error loading transactions</p>';
    }
}

async function loadTransactionDropdowns() {
    try {
        const custResponse = await fetch(`${API_URL}/customers`);
        const customers = await custResponse.json();
        
        const custDropdown = document.getElementById('transCustomer');
        custDropdown.innerHTML = '<option value="">Select Customer</option>';
        customers.forEach(customer => {
            const name = `${customer.First_Name} ${customer.Last_Name}`;
            custDropdown.innerHTML += `<option value="${customer.Customer_ID}">${name}</option>`;
        });
        
        const recResponse = await fetch(`${API_URL}/records`);
        const records = await recResponse.json();
        
        const recDropdown = document.getElementById('transRecord');
        recDropdown.innerHTML = '<option value="">Select Record</option>';
        records.forEach(record => {
            recDropdown.innerHTML += `<option value="${record.Record_ID}">${record.Title} (${record.Available_Copies} available)</option>`;
        });
        
        const staffResponse = await fetch(`${API_URL}/staff`);
        const staff = await staffResponse.json();
        
        const staffDropdown = document.getElementById('transStaff');
        staffDropdown.innerHTML = '<option value="">Select Staff Member</option>';
        staff.forEach(member => {
            staffDropdown.innerHTML += `<option value="${member.Staff_ID}">${member.Name}</option>`;
        });
    } catch (error) {
        console.error('Error loading dropdowns:', error);
    }
}

document.getElementById('transactionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const transData = {
        customer_id: document.getElementById('transCustomer').value,
        record_id: document.getElementById('transRecord').value,
        staff_id: document.getElementById('transStaff').value,
        quantity: parseInt(document.getElementById('transQuantity').value),
        unit_price: parseFloat(document.getElementById('transPrice').value),
        transaction_type: document.getElementById('transType').value
    };
    
    try {
        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(`${result.message}\nTotal: $${result.total}`);
            document.getElementById('transactionForm').reset();
            loadTransactions();
            loadDashboardStats();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error processing transaction');
    }
    
    try{
        
        const response=await fetch(`${API_URL}/reservations`);
        const reservations=await response.json();
        for(const reservation of reservations){
            if(reservation.Customer_ID==transData.customer_id && reservation.Record_ID==transData.record_id){
                updateReservation(reservation.Reservation_ID,'Completed');
            }
    }
    }catch(error){
        console.error('Error updating reservation status:',error);
    }
});