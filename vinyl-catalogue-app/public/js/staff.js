async function loadStaff() {
    try {
        const response = await fetch(`${API_URL}/staff`);
        const staff = await response.json();
        
        const staffList = document.getElementById('staffList');
        
        if (staff.length === 0) {
            staffList.innerHTML = '<p>No staff members found. Add your first employee!</p>';
            return;
        }
        
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Salary</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        staff.forEach(member => {
            html += `
                <tr>
                    <td>${member.Staff_ID}</td>
                    <td>${member.Name}</td>
                    <td>${member.Role}</td>
                    <td>$${member.Salary}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        staffList.innerHTML = html;
    } catch (error) {
        console.error('Error loading staff:', error);
        document.getElementById('staffList').innerHTML = '<p>Error loading staff</p>';
    }
}

document.getElementById('staffForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const staffData = {
        name: document.getElementById('staffName').value,
        role: document.getElementById('staffRole').value,
        salary: document.getElementById('staffSalary').value,
        contact: document.getElementById('staffContact').value
    };
    
    try {
        const response = await fetch(`${API_URL}/staff`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(staffData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Staff member added successfully!');
            document.getElementById('staffForm').reset();
            loadStaff();
        } else {
            alert('Error adding staff: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding staff member');
    }
});