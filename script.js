 // متغيرات التايمر الرئيسية
let countdownDate;
let timerInterval;

// عناصر HTML
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const finishedMessage = document.getElementById('finishedMessage');
const timerDisplay = document.querySelector('.timer-display');

/**
 * تهيئة التايمر عند تحميل الصفحة
 */
function initializeTimer() {
    // التحقق من وجود وقت محفوظ في Local Storage
    const savedEndTime = localStorage.getItem('countdownEndTime');
    
    if (savedEndTime) {
        // استخدام الوقت المحفوظ
        countdownDate = new Date(savedEndTime);
        
        // التحقق من صحة الوقت المحفوظ
        if (countdownDate <= new Date()) {
            // إذا كان الوقت قد انتهى، إعادة تعيين التايمر
            resetTimer();
            return;
        }
    } else {
        // إنشاء تايمر جديد (30 يوم من الآن)
        countdownDate = new Date();
        countdownDate.setDate(countdownDate.getDate() + 30);
        
        // حفظ وقت الانتهاء في Local Storage
        localStorage.setItem('countdownEndTime', countdownDate.toISOString());
    }
    
    // بدء التايمر
    startTimer();
}

/**
 * بدء تشغيل التايمر
 */
function startTimer() {
    // تحديث التايمر كل ثانية
    timerInterval = setInterval(updateTimer, 1000);
    
    // تحديث فوري
    updateTimer();
}

/**
 * تحديث عرض التايمر
 */
function updateTimer() {
    // الحصول على الوقت الحالي
    const now = new Date().getTime();
    const endTime = countdownDate.getTime();
    
    // حساب الفرق الزمني
    const timeLeft = endTime - now;
    
    // التحقق من انتهاء الوقت
    if (timeLeft <= 0) {
        finishTimer();
        return;
    }
    
    // حساب الأيام والساعات والدقائق والثواني
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // تحديث العرض مع إضافة صفر قبل الأرقام الأحادية
    updateDisplay(days, hours, minutes, seconds);
}

/**
 * تحديث عرض الأرقام
 */
function updateDisplay(days, hours, minutes, seconds) {
    const newDays = padZero(days);
    const newHours = padZero(hours);
    const newMinutes = padZero(minutes);
    const newSeconds = padZero(seconds);
    
    // إضافة تأثير الحركة عند تغيير القيم
    updateElementWithAnimation(daysElement, newDays);
    updateElementWithAnimation(hoursElement, newHours);
    updateElementWithAnimation(minutesElement, newMinutes);
    updateElementWithAnimation(secondsElement, newSeconds);
}

/**
 * تحديث عنصر مع تأثير الحركة
 */
function updateElementWithAnimation(element, newValue) {
    if (element.textContent !== newValue) {
        // element.parentElement.classList.add('animate');
        element.textContent = newValue;
        
        // إزالة تأثير الحركة بعد انتهائه
        // setTimeout(() => {
        //     element.parentElement.classList.remove('animate');
        // }, 600);
    }
}

/**
 * إضافة صفر قبل الأرقام الأحادية
 */
function padZero(number) {
    return number.toString().padStart(2, '0');
}

/**
 * إنهاء التايمر وعرض رسالة الانتهاء
 */
function finishTimer() {
    // إيقاف التايمر
    clearInterval(timerInterval);
    
    // إخفاء عرض التايمر
    timerDisplay.style.display = 'none';
    
    // عرض رسالة الانتهاء
    finishedMessage.style.display = 'block';
    
    // حذف الوقت المحفوظ
    localStorage.removeItem('countdownEndTime');
    
    // تشغيل صوت تنبيه (اختياري)
    playNotificationSound();
}

/**
 * إعادة تشغيل التايمر
 */
function resetTimer() {
    // إيقاف التايمر الحالي
    clearInterval(timerInterval);
    
    // حذف الوقت المحفوظ
    localStorage.removeItem('countdownEndTime');
    
    // إخفاء رسالة الانتهاء
    finishedMessage.style.display = 'none';
    
    // إظهار عرض التايمر
    timerDisplay.style.display = 'flex';
    
    // إعادة تهيئة التايمر
    initializeTimer();
}

/**
 * تشغيل صوت تنبيه (اختياري)
 */
function playNotificationSound() {
    try {
        // إنشاء سياق صوتي للتنبيه
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
        console.log('لا يمكن تشغيل الصوت:', error);
    }
}

/**
 * التحقق من حالة التايمر عند العودة للصفحة
 */
function checkTimerStatus() {
    const savedEndTime = localStorage.getItem('countdownEndTime');
    
    if (savedEndTime) {
        const endTime = new Date(savedEndTime);
        const now = new Date();
        
        if (endTime <= now) {
            // انتهى الوقت أثناء غياب المستخدم
            finishTimer();
        }
    }
}

/**
 * حفظ الحالة عند إغلاق الصفحة
 */
function saveTimerState() {
    if (countdownDate) {
        localStorage.setItem('countdownEndTime', countdownDate.toISOString());
    }
}

/**
 * إدارة الأحداث
 */
// تهيئة التايمر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initializeTimer);

// التحقق من حالة التايمر عند العودة للصفحة
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        checkTimerStatus();
    }
});

// حفظ الحالة عند إغلاق الصفحة
window.addEventListener('beforeunload', saveTimerState);

// حفظ الحالة عند فقدان التركيز
window.addEventListener('blur', saveTimerState);

/**
 * دوال إضافية للتخصيص المستقبلي
 */

/**
 * تغيير خلفية الصفحة
 */
function setCustomBackground(imageUrl) {
    if (imageUrl) {
        document.body.style.backgroundImage = `url(${imageUrl})`;
        document.body.classList.add('custom-bg');
    } else {
        document.body.style.backgroundImage = '';
        document.body.classList.remove('custom-bg');
    }
}

/**
 * تغيير مدة التايمر (للاستخدام المستقبلي)
 */
function setTimerDuration(days, hours = 0, minutes = 0, seconds = 0) {
    clearInterval(timerInterval);
    
    countdownDate = new Date();
    countdownDate.setDate(countdownDate.getDate() + days);
    countdownDate.setHours(countdownDate.getHours() + hours);
    countdownDate.setMinutes(countdownDate.getMinutes() + minutes);
    countdownDate.setSeconds(countdownDate.getSeconds() + seconds);
    
    localStorage.setItem('countdownEndTime', countdownDate.toISOString());
    
    finishedMessage.style.display = 'none';
    timerDisplay.style.display = 'flex';
    
    startTimer();
}

/**
 * الحصول على الوقت المتبقي بصيغة نصية
 */
function getTimeLeftText() {
    const now = new Date().getTime();
    const timeLeft = countdownDate.getTime() - now;
    
    if (timeLeft <= 0) {
        return 'انتهى الوقت';
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    return `${days} يوم، ${hours} ساعة، ${minutes} دقيقة، ${seconds} ثانية`;
}

// تصدير الدوال للاستخدام العام (إذا لزم الأمر)
window.TimerApp = {
    reset: resetTimer,
    setBackground: setCustomBackground,
    setDuration: setTimerDuration,
    getTimeLeft: getTimeLeftText
};
