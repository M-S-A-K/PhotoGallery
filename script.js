document.addEventListener('DOMContentLoaded', () => {
    let photos = [];
    const photoUrlInput = document.getElementById('photoUrl');
    const photoTitleInput = document.getElementById('photoTitle');
    const addButton = document.getElementById('add-btn');
    const photoGallery = document.getElementById('photo-gallery');


    async function fetchPhotos() {
        try {
            const response = await fetch('http://localhost:5216/api/Photos');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            photos = await response.json();
            
            displayPhotos(photos);
            
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    async function addPhoto(event) {
        event.preventDefault();

        const url = photoUrlInput.value;
        const title = photoTitleInput.value;

        if (!url || !title) {
            alert('Please fill in both fields.');
            return;
        }

        const newPhoto = { url, title };

        try {
            const response = await fetch('http://localhost:5216/api/Photos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPhoto)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            photoUrlInput.value = '';
            photoTitleInput.value = '';
            fetchPhotos();

        } catch (error) {
            console.error('Error adding photo:', error);
        }
    }

   
    function displayPhotos(photos) {
        photoGallery.innerHTML = '';

        photos.forEach(photo => {
            const photoCard = document.createElement('div');
            photoCard.className = 'photo-card';

            photoCard.innerHTML = `
                <img src="${photo.url}" alt="${photo.title}">
                <h3>${photo.title}</h3>
                <div class="card-buttons">
                    <button class="edit-btn" data-id="${photo.id}">Edit</button>
                    <button class="delete-btn" data-id="${photo.id}">Delete</button>
                </div>
            `;
            photoGallery.appendChild(photoCard);
        });
    }

   
    async function deletePhoto(id) {
        try {
            const response = await fetch(`http://localhost:5216/api/Photos/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            fetchPhotos();
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    }

  
    async function updatePhoto(id, newTitle) {
        const photoToUpdate = photos.find(p => p.id == id);
        if (!photoToUpdate) {
            console.error('Photo not found.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5216/api/Photos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
               
                body: JSON.stringify({ id: id, title: newTitle, url: photoToUpdate.url }) 
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchPhotos();
        } catch (error) {
            console.error('Error updating photo:', error);
        }
    }

    
    photoGallery.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const photoId = event.target.dataset.id;
            if (confirm('Are you sure you want to delete this photo?')) {
                deletePhoto(photoId);
            }
        } else if (event.target.classList.contains('edit-btn')) {
            const photoId = event.target.dataset.id;
            const newTitle = prompt('Enter new title:');
            if (newTitle !== null && newTitle.trim() !== '') {
                updatePhoto(photoId, newTitle);
            }
        }
    });

    addButton.addEventListener('click', addPhoto);

    fetchPhotos();
});
