document.addEventListener('DOMContentLoaded', () => {
    const flowerCount = 700; 
    const container = document.querySelector('.parallax');
    const text = document.getElementById('text'); 
    const scrollSpeed = 2; 
    let scrollValue = 0; 
    let audioSwitched = false; 
    let isTouching = false;
    let startY = 0;
    let currentY = 0;

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

    document.getElementById('musicButton').addEventListener('click', () => {
        audioTrack1.play().then(() => {
            console.log("audioTrack1 is playing");
            document.getElementById('musicButton').style.display = 'none'; 
        }).catch(err => {
            console.log("Unable to play audioTrack1: ", err);
        });
    });

    function handleScroll(deltaY) {
        scrollValue += deltaY * 0.1;
        document.querySelectorAll('.flower').forEach(flower => {
            setRandomMovement(flower, scrollValue);
        });
        switchAudio();
        text.style.opacity = '0'; 
    }

    function switchAudio() {
        if (!audioSwitched) {
            audioTrack1.pause(); 
            audioTrack2.play().catch(err => {
                console.log("Error playing track 2: ", err);
            }); 
            audioSwitched = true; 
        }
    }

    window.addEventListener('wheel', (event) => {
        event.preventDefault();
        handleScroll(event.deltaY);
    }, { passive: false });

    window.addEventListener('touchstart', (event) => {
        isTouching = true;
        startY = event.touches[0].clientY;
    });

    window.addEventListener('touchmove', (event) => {
        if (isTouching) {
            currentY = event.touches[0].clientY;
            const deltaY = startY - currentY;
            startY = currentY; 
            handleScroll(deltaY);
        }
    });

    window.addEventListener('touchend', () => {
        isTouching = false;
    });
});
