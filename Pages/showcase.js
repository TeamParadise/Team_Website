async function fetchMedia() {
    const response = await fetch("/media");
    const media = await response.json();
    shuffle(media); // Assuming you have a shuffle function
    const mediaContainer = document.getElementById("mediaContainer");
    media.forEach((item) => {
        const element = document.createElement("img"); // For images
        // const element = document.createElement('video'); // For videos
        element.src = item.url;
        mediaContainer.appendChild(element);
    });
}

fetchMedia();

function shuffle(array) {
    // Implementation of shuffle function
}
