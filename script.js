document.addEventListener('DOMContentLoaded', () => {
    const myBirthday = new Date('2025-09-01T00:00:00');
    const herBirthday = new Date('2025-08-09T00:00:00');

    const params = new URLSearchParams(window.location.search);
    if (params.has('demo')) {
        const demoTarget = new Date(Date.now() + 10000);
        myBirthday.setTime(demoTarget.getTime());
        herBirthday.setTime(demoTarget.getTime());
    }

    const countdowns = [
        {
            targetDate: myBirthday,
            elements: {
                days: document.getElementById('days1'),
                hours: document.getElementById('hours1'),
                minutes: document.getElementById('minutes1'),
                seconds: document.getElementById('seconds1'),
                countdownEl: document.getElementById('countdown1'),
                revealEl: document.getElementById('reveal1')
            }
        },
        {
            targetDate: herBirthday,
            elements: {
                days: document.getElementById('days2'),
                hours: document.getElementById('hours2'),
                minutes: document.getElementById('minutes2'),
                seconds: document.getElementById('seconds2'),
                countdownEl: document.getElementById('countdown2'),
                revealEl: document.getElementById('reveal2')
            }
        }
    ];

    function updateFlip(element, newValue) {
        const valueStr = String(newValue).padStart(2, '0');
        const currentValue = element.textContent;

        if (valueStr !== currentValue) {
            const parent = element.parentElement;
            parent.classList.add('flipping');
            
            setTimeout(() => {
                element.textContent = valueStr;
            }, 250); 

            parent.addEventListener('animationend', () => {
                parent.classList.remove('flipping');
            }, { once: true });
        }
    }

    function fireConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
                zIndex: 9999
            });
        }
    }

    function updateAllCountdowns() {
        const now = new Date();

        countdowns.forEach(countdown => {
            const diff = countdown.targetDate - now;

            if (diff > 0) {
                updateFlip(countdown.elements.days, Math.floor(diff / (1000 * 60 * 60 * 24)));
                updateFlip(countdown.elements.hours, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
                updateFlip(countdown.elements.minutes, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
                updateFlip(countdown.elements.seconds, Math.floor((diff % (1000 * 60)) / 1000));
            } else if (!countdown.elements.countdownEl.classList.contains('fading-out')) {
     
                countdown.elements.countdownEl.classList.add('fading-out');
                countdown.elements.countdownEl.addEventListener('animationend', () => {
                    countdown.elements.countdownEl.style.display = 'none';
                    countdown.elements.revealEl.style.display = 'block';
                    fireConfetti();
                }, { once: true });
            }

        });
    }

    const musicPlayer = document.getElementById('bgMusic');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const volumeSlider = document.getElementById('volume-slider');

    function togglePlay() {
        if (musicPlayer.paused) {
            musicPlayer.play();
            playPauseBtn.classList.remove('paused');
            playPauseBtn.classList.add('playing');
            localStorage.setItem('musicWasPlaying', 'true');
        } else {
            musicPlayer.pause();
            playPauseBtn.classList.remove('playing');
            playPauseBtn.classList.add('paused');
            localStorage.setItem('musicWasPlaying', 'false');
        }
    }

    function setVolume() {
        musicPlayer.volume = volumeSlider.value;
        localStorage.setItem('musicVolume', volumeSlider.value);
    }

    if (musicPlayer && playPauseBtn && volumeSlider) {

        const savedVolume = localStorage.getItem('musicVolume') || 0.2;
        musicPlayer.volume = savedVolume;
        volumeSlider.value = savedVolume;

        const savedPos = parseFloat(localStorage.getItem('musicPos') || '0');
        if (!isNaN(savedPos)) {
            musicPlayer.currentTime = savedPos;
        }

        const wasPlaying = localStorage.getItem('musicWasPlaying') === 'true';
        if (wasPlaying) {
            musicPlayer.play().then(() => {
                playPauseBtn.classList.add('playing');
            }).catch(() => {});
        } else {
            playPauseBtn.classList.add('paused');
        }

        playPauseBtn.addEventListener('click', togglePlay);
        volumeSlider.addEventListener('input', setVolume);

        setInterval(() => {
            if (!musicPlayer.paused) {
                localStorage.setItem('musicPos', musicPlayer.currentTime);
            }
        }, 2000);
    }

    document.addEventListener('click', (e) => {
        const heart = document.createElement('div');
        heart.className = 'interactive-heart';
        heart.innerHTML = '❤️';
        document.body.appendChild(heart);

        heart.style.left = `${e.clientX}px`;
        heart.style.top = `${e.clientY}px`;

        const animationDuration = Math.random() * 1 + 0.8;
        heart.style.animation = `fly-out ${animationDuration}s ease-out forwards`;

        setTimeout(() => {
            heart.remove();
        }, animationDuration * 1000);
    });

    let keyBuffer = '';
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'a') {
            activateDemo();
            return; 
        }
        keyBuffer += e.key.toLowerCase();
        if (keyBuffer.length > 4) keyBuffer = keyBuffer.slice(-4);
        if (keyBuffer === 'love') {
            triggerHeartBurst();
            keyBuffer = '';
        }
    });

    function activateDemo() {
        const demoTarget = new Date(Date.now() + 10000);
        myBirthday.setTime(demoTarget.getTime());
        herBirthday.setTime(demoTarget.getTime());

        countdowns.forEach(c => {
            c.countdownEl.style.display = 'flex';
            c.countdownEl.classList.remove('fading-out');
            c.revealEl.style.display = 'none';
        });

        updateAllCountdowns();
    }

    function triggerHeartBurst() {
        const heartsToSpawn = 30;
        for (let i = 0; i < heartsToSpawn; i++) {
            const heart = document.createElement('div');
            heart.className = 'interactive-heart';
            heart.innerHTML = '❤️';
            document.body.appendChild(heart);

            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.2;

            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;

            const animationDuration = Math.random() * 1 + 1;
            heart.style.animation = `fly-out ${animationDuration}s ease-out forwards`;

            setTimeout(() => heart.remove(), animationDuration * 1000);
        }
    }

    updateAllCountdowns();
    setInterval(updateAllCountdowns, 1000);
});
