async function fetchMedia() {
    const response = await fetch("/media");
    const media = await response.json();
    shuffle(media);
    const mediaContainer = document.getElementById("mediaContainer");
    media.forEach((item) => {
        const element = document.createElement("img"); // For images
        // const element = document.createElement('video'); // For videos
        element.src = item.url;
        mediaContainer.appendChild(element);
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

fetchMedia();
