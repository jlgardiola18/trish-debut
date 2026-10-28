const flipBook = (elBook) => {
    elBook.style.setProperty("--c", 0);
    elBook.querySelectorAll(".page").forEach((page, idx) => {
        page.style.setProperty("--i", idx);
        page.addEventListener("click", (evt) => {
            if (evt.target.closest("a, button, video, audio, input")) return;
            const curr = evt.target.closest(".back") ? idx : idx + 1;
            elBook.style.setProperty("--c", curr);
        });
    });
};

document.querySelectorAll(".book").forEach(flipBook);

// Browsers may block autoplay until the visitor interacts with the page.
// The sound button gives them a reliable way to start or stop the audio.
const backgroundSound = document.getElementById("backgroundSound");
const soundToggle = document.getElementById("soundToggle");

async function playBackgroundSound() {
    if (!backgroundSound || !soundToggle) return;
    try {
        await backgroundSound.play();
        soundToggle.textContent = "♫ Sound on";
        soundToggle.setAttribute("aria-pressed", "true");
    } catch (error) {
        soundToggle.textContent = "♫ Tap to play sound";
        soundToggle.setAttribute("aria-pressed", "false");
    }
}

if (backgroundSound && soundToggle) {
    backgroundSound.volume = 0.75;
    backgroundSound.addEventListener("play", () => {
        soundToggle.textContent = "♫ Sound on";
        soundToggle.setAttribute("aria-pressed", "true");
    });
    backgroundSound.addEventListener("pause", () => {
        soundToggle.textContent = "♫ Play sound";
        soundToggle.setAttribute("aria-pressed", "false");
    });
    soundToggle.addEventListener("click", async() => {
        if (backgroundSound.paused) {
            await playBackgroundSound();
        } else {
            backgroundSound.pause();
        }
    });
    playBackgroundSound();
}

// Calculate dynamic dimensions based on screen width
function getFlipbookSize() {
    const isMobile = window.innerWidth <= 768;
    const width = isMobile ? window.innerWidth : 500;
    const height = isMobile ? Math.round(window.innerWidth * 1.4) : 700;
    return { width, height, isMobile };
}

const size = getFlipbookSize();

const pageFlip = new St.PageFlip(document.getElementById('book'), {
    width: size.width,
    height: size.height,
    size: "fixed",
    minWidth: 300,
    maxWidth: 1000,
    minHeight: 400,
    maxHeight: 1400,
    maxShadowOpacity: 0.5,
    showCover: true,
    mobileScrollSupport: true, // Enables touch swipes on mobile
    usePortrait: size.isMobile // Single page view on mobile, double page on desktop
});

// Load pages
pageFlip.loadFromHTML(document.querySelectorAll('.page'));

// Optional: Handle orientation or window resize
window.addEventListener('resize', () => {
    const newSize = getFlipbookSize();
    pageFlip.updateFromHtml(document.querySelectorAll('.page'));
});
