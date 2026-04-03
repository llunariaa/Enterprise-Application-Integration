const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');
const loader = document.getElementById('loader');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    fetchMusicData(query);
});

async function fetchMusicData(query) {
    loader.classList.remove('hidden');
    resultsContainer.innerHTML = '';

    try {
        const queries = query.split(',').map(q => q.trim());
        
        const fetchPromises = queries.map(async (q) => {
            const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=10`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data.results;
        });

        const resultsArray = await Promise.all(fetchPromises);
        
        let allSongs = resultsArray.flat();
        if (queries.length > 1) {
            allSongs = allSongs.sort(() => 0.5 - Math.random());
            allSongs = allSongs.slice(0, 24);
        }

        displayResults(allSongs);
    } catch (error) {
        console.error('Error fetching data:', error);
        resultsContainer.innerHTML = `<p style="text-align: center; grid-column: 1 / -1; color: red;">Failed to fetch data. Please try again later.</p>`;
    } finally {
        loader.classList.add('hidden');
    }
}

function displayResults(songs) {
    if (songs.length === 0) {
        resultsContainer.innerHTML = `<p style="text-align: center; grid-column: 1 / -1;">No results found for your search.</p>`;
        return;
    }

    songs.forEach(song => {
        const card = document.createElement('div');
        card.classList.add('card');

        const highResImage = song.artworkUrl100.replace('100x100bb', '300x300bb');

        card.innerHTML = `
            <img src="${highResImage}" alt="${song.trackName} cover">
            <h3>${song.trackName}</h3>
            <p>${song.artistName}</p>
            <audio controls src="${song.previewUrl}">
                Your browser does not support the audio element.
            </audio>
        `;

        resultsContainer.appendChild(card);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    fetchMusicData('The Beatles, Arctic Monkeys, Radiohead, Red Hot Chili Peppers, Deftones, Nirvana, Queen, Pink Floyd'); 
});