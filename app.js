// Firebase configuration - REPLACE WITH YOUR NEW CONFIG FROM STEP 4
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

const firebaseConfig = {
    apiKey: "AIzaSyDxaywibUBrlEGtB10tBfsugfvtiGDcDtw",
    authDomain: "https://junkyard-photobooth-f01a1.firebaseapp.com",
    projectId: "junkyard-photobooth-f01a1",
    storageBucket: "junkyard-photobooth-f01a1.firebasestorage.app",
    messagingSenderId: "755780180370",
    appId: "1:755780180370:web:62118302aa9071e2c9094b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// DOM elements
const photoContainer = document.getElementById('photo-container');
const loadingDiv = document.getElementById('loading');

// Load photos from Firestore
async function loadPhotos() {
    try {
        // Query photos collection, ordered by timestamp (newest first)
        const photosQuery = query(
            collection(db, 'photos'),
            orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(photosQuery);
        
        // Hide loading message
        loadingDiv.style.display = 'none';
        
        if (querySnapshot.empty) {
            photoContainer.innerHTML = '<p style="text-align: center; color: #666;">No photos yet!</p>';
            return;
        }
        
        // Display each photo
        querySnapshot.forEach(async (doc) => {
            const photoData = doc.data();
            
            // Get download URL from storage
            const storageRef = ref(storage, photoData.storagePath);
            const downloadURL = await getDownloadURL(storageRef);
            
            // Create photo element
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            
            const img = document.createElement('img');
            img.src = downloadURL;
            img.alt = 'Photobooth photo';
            img.loading = 'lazy';
            
            // Click to view full size
            img.addEventListener('click', () => openLightbox(downloadURL));
            
            photoItem.appendChild(img);
            photoContainer.appendChild(photoItem);
        });
        
    } catch (error) {
        console.error('Error loading photos:', error);
        loadingDiv.textContent = 'Error loading photos. Please refresh the page.';
    }
}

// Lightbox functionality
function openLightbox(imageUrl) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox active';
    
    const img = document.createElement('img');
    img.src = imageUrl;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => lightbox.remove();
    
    lightbox.appendChild(closeBtn);
    lightbox.appendChild(img);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.remove();
        }
    });
    
    document.body.appendChild(lightbox);
}

// Load photos when page loads
loadPhotos();