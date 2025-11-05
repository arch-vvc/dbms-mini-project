// Load all customers initially
async function loadCustomers() {
    try {
        const response = await fetch(`${API_URL}/customers`);
        const customers = await response.json();
        displayCustomers(customers);
    } catch (error) {
        console.error('Error loading customers:', error);
        document.getElementById('customersList').innerHTML = '<p>Error loading customers</p>';
    }
}

// Display customers in a table
function displayCustomers(customers) {
    const customersList = document.getElementById('customersList');
    
    if (customers.length === 0) {
        customersList.innerHTML = '<p>No customers found matching your search.</p>';
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
}

// Search customers with filters
async function searchCustomers() {
    const searchTerm = document.getElementById('searchCustomer').value.toLowerCase();
    const membershipFilter = document.getElementById('filterMembership').value;
    
    try {
        const response = await fetch(`${API_URL}/customers`);
        const customers = await response.json();
        
        let filtered = customers;
        
        if (searchTerm) {
            filtered = filtered.filter(customer => {
                const fullName = `${customer.First_Name} ${customer.Second_Name || ''} ${customer.Last_Name}`.toLowerCase();
                return fullName.includes(searchTerm) || 
                       customer.Email.toLowerCase().includes(searchTerm);
            });
        }
        
        if (membershipFilter) {
            filtered = filtered.filter(customer => 
                customer.Membership_Type === membershipFilter
            );
        }
        
        displayCustomers(filtered);
    } catch (error) {
        console.error('Error searching customers:', error);
    }
}