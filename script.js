document.addEventListener('DOMContentLoaded', () => {
    const flowerCount = 700; 
    const container = document.querySelector('.parallax');
    const text = document.getElementById('text'); 
    const scrollSpeed = 2; 
    let scrollValue = 0; 
    let audioSwitched = false; 
    let touchStartY = 0;

    const audioTrack1 = document.getElementById('audioTrack1');
    const audioTrack2 = document.getElementById('audioTrack2');

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function setRandomMovement(flower, value) {
        const direction = flower.dataset.direction;

        if (direction === 'top-left') {
            flower.style.transform = `translate(${value * -scrollSpeed}px, ${value * -scrollSpeed}px)`;
        } else if (direction === 'top-right') {
            flower.style.transform = `translate(${value * scrollSpeed}px, ${value * -scrollSpeed}px)`;
        } else if (direction === 'bottom-left') {
            flower.style.transform = `translate(${value * -scrollSpeed}px, ${value * scrollSpeed}px)`;
        } else if (direction === 'bottom-right') {
            flower.style.transform = `translate(${value * scrollSpeed}px, ${value * scrollSpeed}px)`;
        }
    }

    function handleScroll(deltaY) {
        scrollValue += deltaY * 0.1;

        document.querySelectorAll('.flower').forEach(flower => {
            setRandomMovement(flower, scrollValue);
        });

        if (!audioSwitched) {
            audioTrack1.pause(); 
            audioTrack2.play().catch(err => {
                console.log("Error playing track 2: ", err);
            }); 
            audioSwitched = true; 
        }

        text.style.opacity = '0';
    }

    // Generate flowers
    for (let i = 0; i < flowerCount; i++) {
        const flower = document.createElement('img');
        flower.src = 'Images/flower.png';
        flower.classList.add('flower');

        const randomSize = getRandomInt(50, 250);
        flower.style.width = `${randomSize}px`;
        flower.style.height = `${randomSize}px`;

        flower.style.top = `${getRandomInt(-100, window.innerHeight)}px`;
        flower.style.left = `${getRandomInt(-100, window.innerWidth)}px`;

        const directions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        flower.dataset.direction = directions[getRandomInt(0, directions.length - 1)];

        container.appendChild(flower);
    }

    // Music button event
    document.getElementById('musicButton').addEventListener('click', () => {
        audioTrack1.play().then(() => {
            console.log("audioTrack1 is playing");
            document.getElementById('musicButton').style.display = 'none'; 
        }).catch(err => {
            console.log("Unable to play audioTrack1: ", err);
        });
    });

    // Mouse wheel event for desktop
    window.addEventListener('wheel', (event) => {
        event.preventDefault();
        handleScroll(event.deltaY);
    }, { passive: false });

    // Touch events for mobile
    window.addEventListener('touchstart', (event) => {
        touchStartY = event.touches[0].clientY;
    }, { passive: false });

    window.addEventListener('touchmove', (event) => {
        event.preventDefault();
        const touchCurrentY = event.touches[0].clientY;
        const deltaY = touchStartY - touchCurrentY;
        touchStartY = touchCurrentY;
        handleScroll(deltaY);
    }, { passive: false });
});

// Paper dragging code remains unchanged
let highestZ = 1;

class Paper {
    holdingPaper = false;
    mouseTouchX = 0;
    mouseTouchY = 0;
    mouseX = 0;
    mouseY = 0;
    prevMouseX = 0;
    prevMouseY = 0;
    velX = 0;
    velY = 0;
    rotation = Math.random() * 30 - 15;
    currentPaperX = 0;
    currentPaperY = 0;
    rotating = false;

    init(paper) {
        document.addEventListener('mousemove', (e) => {
            if(!this.rotating) {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                
                this.velX = this.mouseX - this.prevMouseX;
                this.velY = this.mouseY - this.prevMouseY;
            }
                
            const dirX = e.clientX - this.mouseTouchX;
            const dirY = e.clientY - this.mouseTouchY;
            const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
            const dirNormalizedX = dirX / dirLength;
            const dirNormalizedY = dirY / dirLength;

            const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
            let degrees = 180 * angle / Math.PI;
            degrees = (360 + Math.round(degrees)) % 360;
            if(this.rotating) {
                this.rotation = degrees;
            }

            if(this.holdingPaper) {
                if(!this.rotating) {
                    this.currentPaperX += this.velX;
                    this.currentPaperY += this.velY;
                }
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;

                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
            }
        });

        paper.addEventListener('mousedown', (e) => {
            if(this.holdingPaper) return; 
            this.holdingPaper = true;
            
            paper.style.zIndex = highestZ;
            highestZ += 1;
            
            if(e.button === 0) {
                this.mouseTouchX = this.mouseX;
                this.mouseTouchY = this.mouseY;
                this.prevMouseX = this.mouseX;
                this.prevMouseY = this.mouseY;
            }
            if(e.button === 2) {
                this.rotating = true;
            }
        });

        window.addEventListener('mouseup', () => {
            this.holdingPaper = false;
            this.rotating = false;
        });
    }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);
});
