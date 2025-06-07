let countdownDate;
let timerInterval;

const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const finishedMessage = document.getElementById('finishedMessage');
const timerDisplay = document.querySelector('.timer-display');

function initializeTimer() {
    // July 6, 2025 at 17:00 (UTC+2) == July 6, 2025 at 15:00 (UTC)
    countdownDate = new Date(Date.UTC(2025, 6, 6, 15, 0, 0));
    startTimer();
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);

    updateTimer();
}

function updateTimer() {
    const now = new Date();
    const timeLeft = countdownDate.getTime() - now.getTime();
    if (timeLeft <= 0) {
        finishTimer();
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    updateDisplay(days, hours, minutes, seconds);
}

function updateDisplay(days, hours, minutes, seconds) {
    const newDays = padZero(days);
    const newHours = padZero(hours);
    const newMinutes = padZero(minutes);
    const newSeconds = padZero(seconds);

    updateElementWithAnimation(daysElement, newDays);
    updateElementWithAnimation(hoursElement, newHours);
    updateElementWithAnimation(minutesElement, newMinutes);
    updateElementWithAnimation(secondsElement, newSeconds);
}


function updateElementWithAnimation(element, newValue) {
    if (element.textContent !== newValue) {
        element.textContent = newValue;

    }
}

function padZero(number) {
    return number.toString().padStart(2, '0');
}

document.addEventListener('DOMContentLoaded', initializeTimer);

