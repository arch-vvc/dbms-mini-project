// Artists Functions
async function loadArtists() {
    try {
        const response = await fetch(`${API_URL}/artists`);
        const artists = await response.json();
        displayArtists(artists);
    } catch (error) {
        console.error('Error loading artists:', error);
        document.getElementById('artistsList').innerHTML = '<p>Error loading artists</p>';
    }
}

function displayArtists(artists) {
    const artistsList = document.getElementById('artistsList');
    
    if (artists.length === 0) {
        artistsList.innerHTML = '<p>No artists found. Add your first artist!</p>';
        return;
    }
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Nationality</th>
                    <th>Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    artists.forEach(artist => {
        html += `
            <tr>
                <td>${artist.Artist_ID}</td>
                <td>${artist.Name}</td>
                <td>${artist.Nationality || '-'}</td>
                <td>${artist.Type || '-'}</td>
                <td>
                    <button class="btn-delete" onclick="deleteArtist(${artist.Artist_ID}, '${artist.Name.replace(/'/g, "\\'")}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    artistsList.innerHTML = html;
}

async function deleteArtist(id, name) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/artists/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Artist deleted successfully!');
            loadArtists();
        } else {
            alert('Error deleting artist: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting artist');
    }
}

async function searchArtists() {
    const searchTerm = document.getElementById('searchArtist').value.toLowerCase();
    
    if (!searchTerm) {
        loadArtists();
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/artists`);
        const artists = await response.json();
        
        const filtered = artists.filter(artist => 
            artist.Name.toLowerCase().includes(searchTerm)
        );
        
        displayArtists(filtered);
    } catch (error) {
        console.error('Error searching artists:', error);
    }
}

// Form handler
document.getElementById('artistForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const artistData = {
        name: document.getElementById('artistName').value,
        nationality: document.getElementById('artistNationality').value,
        type: document.getElementById('artistType').value
    };
    
    try {
        const response = await fetch(`${API_URL}/artists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(artistData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Artist added successfully!');
            document.getElementById('artistForm').reset();
            loadArtists();
        } else {
            alert('Error adding artist: ' + result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding artist');
    }
});