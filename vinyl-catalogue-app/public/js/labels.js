
// =============================
// LABELS.JS
// =============================

// Load all labels
async function loadLabels() {
    try {
        const response = await fetch(`${API_URL}/labels`);
        const labels = await response.json();

        const labelsList = document.getElementById('labelsList');
        if (labels.length === 0) {
            labelsList.innerHTML = '<p>No record labels found.</p>';
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        labels.forEach(label => {
            html += `
                <tr>
                    <td>${label.Label_ID}</td>
                    <td>${label.Name}</td>
                    <td>${label.Address || '-'}</td>
                    <td>
                        <button class="btn-delete" onclick="deleteLabel(${label.Label_ID})">Delete</button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        labelsList.innerHTML = html;
    } catch (error) {
        console.error('Error loading labels:', error);
        document.getElementById('labelsList').innerHTML = '<p>Error loading labels</p>';
    }
}

// Handle form submission
document.getElementById('labelForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const labelData = {
        name: document.getElementById('labelName').value,
        address: document.getElementById('labelAddress').value
    };

    try {
        const response = await fetch(`${API_URL}/labels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(labelData)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            document.getElementById('labelForm').reset();
            loadLabels();
        } else {
            alert('Error adding label: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding label:', error);
        alert('Error adding label');
    }
});

// Delete label
async function deleteLabel(id) {
    if (!confirm('Are you sure you want to delete this label?')) return;

    try {
        const response = await fetch(`${API_URL}/labels/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            loadLabels();
        } else {
            alert('Error deleting label: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting label:', error);
    }
}

// Load all labels on page load
window.addEventListener('DOMContentLoaded', loadLabels);