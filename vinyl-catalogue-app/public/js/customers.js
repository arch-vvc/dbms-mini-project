async function loadCustomers() {
    try {
        const response = await fetch(`${API_URL}/customers`);
        const customers = await response.json();
        
        const customersList = document.getElementById('customersList');
        
        if (customers.length === 0) {
            customersList.innerHTML = '<p>No customers found. Add your first customer!</p>';
            return;
        }
        
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Membership</th>
                        <th>City</th>
                        <th>Join Date</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        customers.forEach(customer => {
            const fullName = `${customer.First_Name} ${customer.Second_Name || ''} ${customer.Last_Name}`.trim();
            const joinDate = customer.Date_Of_Join ? new Date(customer.Date_Of_Join).toLocaleDateString() : '-';
            
            html += `
                <tr>
                    <td>${customer.Customer_ID}</td>
                    <td>${fullName}</td>
                    <td>${customer.Email}</td>
                    <td>${customer.Membership_Type || '-'}</td>
                    <td>${customer.City || '-'}</td>
                    <td>${joinDate}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        customersList.innerHTML = html;
    } catch (error) {
        console.error('Error loading customers:', error);
        document.getElementById('customersList').innerHTML = '<p>Error loading customers</p>';
    }
}

// Add new customer
document.getElementById('customerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const customerData = {
        first_name: document.getElementById('custFirstName').value,
        second_name: document.getElementById('custSecondName').value,
        last_name: document.getElementById('custLastName').value,
        email: document.getElementById('custEmail').value,
        membership_type: document.getElementById('custMembership').value,
        phone: document.getElementById('custPhone').value,
        street: document.getElementById('custStreet').value,
        city: document.getElementById('custCity').value,
        pincode: document.getElementById('custPincode').value
    };
    
    try {
        const response = await fetch(`${API_URL}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Customer added successfully!');
            document.getElementById('customerForm').reset();
            loadCustomers();
        } else {
            alert('Error adding customer: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding customer');
    }
});