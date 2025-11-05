// Load all records
async function loadRecords() {
    try {
        // Load artists for the dropdown
        await loadArtistsDropdown();
        
        // Load records with artists
        const response = await fetch(`${API_URL}/records-with-artists`);
        const records = await response.json();
        
        displayRecords(records);
    } catch (error) {
        console.error('Error loading records:', error);
        document.getElementById('recordsList').innerHTML = '<p>Error loading records</p>';
    }
}

// Display records in a table
function displayRecords(records) {
    const recordsList = document.getElementById('recordsList');
    
    if (records.length === 0) {
        recordsList.innerHTML = '<p>No records found matching your search.</p>';
        return;
    }
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Artist(s)</th>
                    <th>Genre</th>
                    <th>Edition</th>
                    <th>Catalog #</th>
                    <th>Total</th>
                    <th>Available</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    records.forEach(record => {
        html += `
            <tr>
                <td>${record.Record_ID}</td>
                <td>${record.Title}</td>
                <td>${record.Artists || 'No artist assigned'}</td>
                <td>${record.Genre || '-'}</td>
                <td>${record.Edition || '-'}</td>
                <td>${record.Catalog_Number || '-'}</td>
                <td>${record.Total_Copies}</td>
                <td>${record.Available_Copies}</td>
                <td>
                    <button class="btn-delete" onclick="deleteRecord(${record.Record_ID}, '${record.Title.replace(/'/g, "\\'")}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    recordsList.innerHTML = html;
}

// Search records function - matches your HTML (only has searchRecord input, no genre filter)
async function searchRecords() {
    const searchTerm = document.getElementById('searchRecord').value.toLowerCase();
    
    try {
        const response = await fetch(`${API_URL}/records-with-artists`);
        const records = await response.json();
        
        let filtered = records;
        
        if (searchTerm) {
            filtered = filtered.filter(record => {
                return record.Title.toLowerCase().includes(searchTerm) ||
                       (record.Genre && record.Genre.toLowerCase().includes(searchTerm)) ||
                       (record.Artists && record.Artists.toLowerCase().includes(searchTerm)) ||
                       (record.Catalog_Number && record.Catalog_Number.toLowerCase().includes(searchTerm));
            });
        }
        
        displayRecords(filtered);
    } catch (error) {
        console.error('Error searching records:', error);
    }
}

// Load artists into dropdown
async function loadArtistsDropdown() {
    try {
        const response = await fetch(`${API_URL}/artists`);
        const artists = await response.json();
        
        const dropdown = document.getElementById('recordArtist');
        dropdown.innerHTML = '<option value="">Select Artist (Optional)</option>';
        
        artists.forEach(artist => {
            dropdown.innerHTML += `<option value="${artist.Artist_ID}">${artist.Name}</option>`;
        });
    } catch (error) {
        console.error('Error loading artists dropdown:', error);
    }
}

// Delete record function
async function deleteRecord(id, title) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/records/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Record deleted successfully!');
            loadRecords(); // Reload the list
        } else {
            alert('Error deleting record: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting record');
    }
}

// Record form handler
document.getElementById('recordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const recordData = {
        title: document.getElementById('recordTitle').value,
        genre: document.getElementById('recordGenre').value,
        edition: document.getElementById('recordEdition').value,
        catalog_number: document.getElementById('recordCatalog').value,
        total_copies: document.getElementById('recordTotal').value,
        available_copies: document.getElementById('recordAvailable').value
    };
    
    const artistId = document.getElementById('recordArtist').value;
    
    try {
        // First, add the record
        const response = await fetch(`${API_URL}/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recordData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // If artist selected, link them
            if (artistId) {
                const linkResponse = await fetch(`${API_URL}/records/${result.id}/artists/${artistId}`, {
                    method: 'POST'
                });
                
                if (!linkResponse.ok) {
                    console.error('Failed to link artist to record');
                }
            }
            
            alert('Record added successfully!');
            document.getElementById('recordForm').reset();
            loadRecords();
        } else {
            alert('Error adding record: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding record');
    }
});