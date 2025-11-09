
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

// ===============================
// LOAD ALL CUSTOMERS
// ===============================
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

// ===============================
// DISPLAY CUSTOMERS IN TABLE
// ===============================
function displayCustomers(customers) {
    const customersList = document.getElementById('customersList');

    if (!customers || customers.length === 0) {
        customersList.innerHTML = '<p>No customers found.</p>';
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
        const fullName = `${customer.First_Name} ${customer.Second_Name || ''} ${customer.Last_Name || ''}`.trim();
        const joinDate = customer.Date_Of_Join ? new Date(customer.Date_Of_Join).toLocaleDateString() : '-';
        html += `
            <tr>
                <td>${customer.Customer_ID}</td>
                <td>${fullName}</td>
                <td>${customer.Email || '-'}</td>
                <td>${customer.Membership_Type || '-'}</td>
                <td>${customer.City || '-'}</td>
                <td>${joinDate}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    customersList.innerHTML = html;
}

// ===============================
// ADD CUSTOMER FUNCTIONALITY
// ===============================
async function addCustomer(event) {
    event.preventDefault();

    const first_name = document.getElementById('custFirstName').value.trim();
    const second_name = document.getElementById('custSecondName').value.trim();
    const last_name = document.getElementById('custLastName').value.trim();
    const email = document.getElementById('custEmail').value.trim();
    const membership_type = document.getElementById('custMembership').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const street = document.getElementById('custStreet').value.trim();
    const city = document.getElementById('custCity').value.trim();
    const pincode = document.getElementById('custPincode').value.trim();

    // Basic validation
    if (!first_name || !last_name || !email) {
        alert('Please enter at least first name, last name, and email.');
        return;
    }

    const data = {
        first_name,
        second_name,
        last_name,
        email,
        membership_type,
        street,
        city,
        pincode,
        phone
    };

    try {
        const response = await fetch(`${API_URL}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || 'Customer added successfully!');
            document.getElementById('customerForm').reset();
            loadCustomers();
        } else {
            alert(result.error || 'Failed to add customer');
        }
    } catch (error) {
        console.error('Error adding customer:', error);
        alert('Something went wrong while adding the customer.');
    }
}

// ===============================
// SEARCH FUNCTIONALITY
// ===============================
async function searchCustomers() {
    const searchValue = document.getElementById('searchCustomer').value.toLowerCase();
    const membershipFilter = document.getElementById('filterMembership').value;

    try {
        const response = await fetch(`${API_URL}/customers`);
        const customers = await response.json();

        const filtered = customers.filter(c => {
            const nameMatch = `${c.First_Name} ${c.Second_Name || ''} ${c.Last_Name || ''}`.toLowerCase().includes(searchValue);
            const emailMatch = c.Email.toLowerCase().includes(searchValue);
            const membershipMatch = membershipFilter ? c.Membership_Type === membershipFilter : true;
            return (nameMatch || emailMatch) && membershipMatch;
        });

        displayCustomers(filtered);
    } catch (error) {
        console.error('Error searching customers:', error);
        alert('Search failed.');
    }
}

// ===============================
// INITIALIZE EVENT LISTENERS
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();

    const form = document.getElementById('customerForm');
    if (form) {
        console.log('✅ Customer form found and listener attached.');
        form.addEventListener('submit', addCustomer);
    } else {
        console.error('❌ Customer form not found!');
    }
});