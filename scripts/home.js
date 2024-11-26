function removeVideoControls() {
    const videos = document.querySelectorAll('video');

    videos.forEach(video => {
        video.controls = false;
    });
}

document.addEventListener('DOMContentLoaded', removeVideoControls);
