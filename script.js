const monthDisplay = document.getElementById('month');
const dayDisplay = document.getElementById('day');
const hourDisplay = document.getElementById('hour');
const minuteDisplay = document.getElementById('minute');
const secondDisplay = document.getElementById('second');

const label = document.querySelector('.label');

const ageYear = document.getElementById('age-year');
const ageMonth = document.getElementById('age-month');
const ageDay = document.getElementById('age-day');

const ageDisplay = document.querySelector('.age-container');

const dateChoice = document.querySelector('.date-choice');
const dateInput = document.querySelector('.date-input');
const dateButton = document.querySelector('.date-button');
const dateError = document.querySelector('.date-error');

const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const thisDay = new Date().getDate();
const thisMonth = new Date().getMonth() + 1;
const thisYear = new Date().getFullYear();
const newYear = new Date(`1 jan ${thisYear + 1}`);

const basicInterval = setInterval(()=> countDown(), 1000);
let bdInterval;
// let ageInterval;

dateButton.addEventListener('click', showBirthday);

function countDown(displayDate = newYear){
    const thisMoment = Date.now();
    const gap = displayDate.getTime() - thisMoment;

    const months = Math.floor(gap / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor(gap / (1000 * 60 * 60 * 24) % 30);
    const hours = Math.floor(gap / (1000 * 60 * 60) % 24);
    const minutes = Math.floor(gap / (1000 * 60) % 60);
    const seconds = Math.floor(gap / (1000) % 60);

    monthDisplay.innerText = formatTime(months);
    dayDisplay.innerText = formatTime(days);
    hourDisplay.innerText = formatTime(hours);
    minuteDisplay.innerText = formatTime(minutes);
    secondDisplay.innerText = formatTime(seconds);
}

function showBirthday(){
    const userInput = dateInput.value;
    if(!userInput) return;

    const validation = validateDate(userInput);
    if(validation) return;

    clearInterval(basicInterval);
    clearInterval(bdInterval);

    const thisMoment = new Date();
    const userBD = new Date(userInput);

    // check if the date has passed already
    if  (thisMoment.getMonth() === userBD.getMonth() &&
        thisMoment.getDate() >= userBD.getDate() || thisMoment.getMonth() > userBD.getMonth())
        userBD.setFullYear(thisMoment.getFullYear() + 1);
    else userBD.setFullYear(thisMoment.getFullYear());

    bdInterval = setInterval(() => countDown(userBD), 1000);
    setTimeout(() => label.textContent = "Your Birthday's Countdown", 1000);

    calcAge(userInput);
}

function calcAge(userInput){
    if(userInput.split('/').length === 2) return;
    let userYears, userMonths, userDays;

    // Dates
    const userBD = new Date(userInput);
    const today = new Date();

    // Day & Month & Year of Today
    const today_date = today.getDate();
    const today_month = today.getMonth() + 1;
    const today_year = today.getFullYear();

    // Day & Month & Year of Birth Date
    const userB_date = userBD.getDate();
    const userB_month = userBD.getMonth() + 1; // +1 because the month is 0 based
    const userB_year = userBD.getFullYear();

    leapChecker(today_year);

    // Age In Years
    userYears = today_year - userB_year;
    if
        (today_month === userB_month &&
        today_date < userB_date ||
        today_month < userB_month
        )
        userYears--; // if the birth month is yet to come
    
    // Age In Months
    if (today_month >= userB_month) userMonths = today_month - userB_month;
    else userMonths = 12 + today_month - userB_month;

    // Age In Days
    if(today_date >= userB_date) userDays = today_date - userB_date;
    else {
        userMonths--;
        let days = months[today_month - 1];
        userDays = days + today_date - userB_date;
        if(userMonths < 0){
            userMonths = 11;
        }
    }

    // Show Age
    setTimeout(() => {
        ageDisplay.style.opacity = '1';
        ageYear.innerText = formatTime(userYears);
        ageMonth.innerText = formatTime(userMonths);
        ageDay.innerText = formatTime(userDays);
    }, 1000)
}

function validateDate(date){
    const splitDate = date.split('/');
    if(
        splitDate.length < 2 ||
        splitDate.length > 3 ||
        isNaN(splitDate[0]) ||
        isNaN(splitDate[1]) ||
        splitDate[0] > 12 ||
        splitDate[0] <= 0 ||
        splitDate[1] > months[splitDate[0] - 1] ||
        splitDate[1] <= 0 ||
        splitDate.length === 3 &&
        (isNaN(splitDate[2]) ||
        splitDate[2] > thisYear ||
        splitDate[2] < 100 ||
        splitDate[2] == thisYear &&
        splitDate[0] > thisMonth ||
        splitDate[2] == thisYear &&
        splitDate[0] == thisMonth &&
        splitDate[1] > thisDay)
    ) {
        dateError.style.display = 'flex';
        dateChoice.style.display = 'none';
        setTimeout(() => {
            dateError.style.display = 'none';
            dateChoice.style.display = 'flex';
        }, 2000)
        return true;
    }
}

function formatTime(time){
    return time < 10 ? `0${time}` : time;
}

function leapChecker(year){
    if (year % 4 === 0 || year % 400 === 0) months[1] = 29;
    else months[1] = 28;
}
