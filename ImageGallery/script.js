document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selections ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const filterButtons = document.querySelectorAll('#filter-buttons .btn');

    let currentIndex = 0;
    let currentItems = []; // Array to hold currently visible items for navigation

    // --- Functions ---
    const showLightbox = (index) => {
        if (index >= 0 && index < currentItems.length) {
            lightbox.style.display = 'flex'; // Use flex to center content
            lightboxImg.src = currentItems[index].querySelector('img').src;
            currentIndex = index;
        }
    };

    const closeLightbox = () => {
        lightbox.style.display = 'none';
    };

    const showNextImage = () => {
        const nextIndex = (currentIndex + 1) % currentItems.length; // Loop back to the start
        showLightbox(nextIndex);
    };

    const showPrevImage = () => {
        const prevIndex = (currentIndex - 1 + currentItems.length) % currentItems.length; // Loop to the end
        showLightbox(prevIndex);
    };

    const filterItems = (filter) => {
        currentItems = []; // Reset the current items
        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || filter === category) {
                item.style.display = 'block';
                currentItems.push(item); // Add visible items to the array
            } else {
                item.style.display = 'none';
            }
        });
    };

    // --- Event Listeners ---

    // Initial filter to set up currentItems
    filterItems('all');

    // Click on a gallery item to open lightbox
    currentItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Find the index in the currently visible items
            const visibleIndex = currentItems.indexOf(item);
            showLightbox(visibleIndex);
        });
    });

    // Close lightbox events
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) { // Close if clicking on the background
            closeLightbox();
        }
    });

    // Navigation events
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'Escape') closeLightbox();
        }
    });

    // Filter button events
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            document.querySelector('#filter-buttons .btn.active').classList.remove('active');
            button.classList.add('active');

            // Filter the gallery
            const filter = button.getAttribute('data-filter');
            filterItems(filter);

            // Re-attach click listeners to the now-visible items
            currentItems.forEach((item, index) => {
                // Remove old listeners to prevent duplicates
                const newItem = item.cloneNode(true);
                item.parentNode.replaceChild(newItem, item);
                
                newItem.addEventListener('click', () => {
                    showLightbox(index);
                });
            });
        });
    });
});