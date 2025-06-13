const targetDate1 = new Date('2025-09-01T00:00:00').getTime();
const targetDate2 = new Date('2025-08-09T00:00:00').getTime();

function updateCountdown(targetDate, ids, endMessage) {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        // end msg
        for (const id of Object.values(ids)) {
            document.getElementById(id).innerText = '';
        }
        document.getElementById(ids.days).innerText = endMessage;
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    animateUpdate(ids.days, days);
    animateUpdate(ids.hours, hours);
    animateUpdate(ids.minutes, minutes);
    animateUpdate(ids.seconds, seconds);
}

function animateUpdate(id, value) {
    const el = document.getElementById(id);
    if (el.innerText != value) {
        el.classList.remove('animate');
        void el.offsetWidth; // black
        el.innerText = value;
        el.classList.add('animate');
    }
}

function updateAll() {
    updateCountdown(targetDate1, 
        {days: 'days1', hours: 'hours1', minutes: 'minutes1', seconds: 'seconds1'}, 
        'MY BDAYYY FINALLY!!!'
    );
    updateCountdown(targetDate2, 
        {days: 'days2', hours: 'hours2', minutes: 'minutes2', seconds: 'seconds2'}, 
        "YAYAYAY CONGRATULATIONS BABY MWAHH U DESERVE THE WORLD AND BEYOND"
    );
}

setInterval(updateAll, 1000);
updateAll();
