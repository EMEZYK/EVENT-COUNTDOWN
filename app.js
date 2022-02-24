const containerApp = document.querySelector(".event-wrapper");
const settings = document.querySelector(".settings");
const settingsBtn = document.querySelector(".settings-btn");
const title = document.querySelector(".app-name");

const eventName = document.querySelector("#event-name");
const eventImage = document.querySelector("#event-image");
const saveBtn = document.querySelector(".save");

let usersTime;
let eventID = 0;
const dates = [];

const showSettings = () => {
  settings.classList.toggle("active");
  title.classList.toggle("hide-title");
};

const renderEvent = (event) => {
  const newEvent = document.createElement("div");
  newEvent.classList.add("event-item");
  newEvent.setAttribute("id", event.eventId);

  let days;
  let hours;
  let minutes;
  let seconds;
  newEvent.innerHTML = `
<div class="image-section" style='background-image: url("${event.eventImage}")'>
<div class="delete-btn"  onclick="deleteEvent(${
    event.eventId
  })"><i class="fa fa-trash-o"></i></div>
</div>
<div class="time-section">
<span class="event" >${event.eventName}</span>
<div class="time-cards">
  <div class="card">
    <p class="days-count number" id=${"day" + event.eventId}>${days}</p>
    <p class="card-title">Days</p>
  </div>
  <div class="card">
    <p class="hours-count number"  id=${"hour" + event.eventId}>${hours}</p>
    <p class="card-title">Hours</p>
  </div>
  <div class="card">
    <p class="minutes-count number" id=${
      "minute" + event.eventId
    }>${minutes}</p>
    <p class="card-title">Minutes</p>
  </div>
  <div class="card">
    <p class="seconds-count number"  id=${
      "second" + event.eventId
    }>${seconds}</p>
    <p class="card-title">Seconds</p>
  </div>
</div>
</div>
`;
  containerApp.appendChild(newEvent);

  const setTime = () => {
    const currentTime = new Date();
    const result =
      new Date(event.eventYear, event.eventMonth - 1, event.eventDay) -
      currentTime;
    days = Math.floor(result / 1000 / 60 / 60 / 24);
    hours = Math.floor(result / 1000 / 60 / 60) % 24;
    minutes = Math.floor(result / 1000 / 60) % 60;
    seconds = Math.floor(result / 1000) % 60;
    const daysCount = document.getElementById("day" + event.eventId);
    daysCount.innerHTML = days;
    const hoursCount = document.getElementById("hour" + event.eventId);
    hoursCount.innerHTML = hours;
    const minutesCount = document.getElementById("minute" + event.eventId);
    minutesCount.innerHTML = minutes;
    const secondsCount = document.getElementById("second" + event.eventId);
    secondsCount.innerHTML = seconds;
  };
  setTime();
  setInterval(setTime, 1000);
  eventImage.value = "";
  eventName.value = "";

  if (days < 3) {
    newEvent.classList.add("coming-date");
  }
};

const refreshEvents = () => {
  document.querySelectorAll(".event-item").forEach((el) => el.remove());
  const savedEventsString = localStorage.getItem("events");
  if (savedEventsString) {
    const eventsArray = JSON.parse(savedEventsString);
    eventsArray.forEach((el) => {
      renderEvent(el);
      if (el.eventId == eventID) {
        eventID = el.eventId + 1;
      }
      eventsArray.sort((a, b) => a.eventYear - b.eventYear);
    });
  }
};

refreshEvents();

const createEvent = () => {
  const eventDay = document.querySelector("#event-day");
  const eventMonth = document.querySelector("#event-month");
  const eventYear = document.querySelector("#event-year");
  usersTime = new Date(eventYear.value, eventMonth.value - 1, eventDay.value);
  const event = {
    eventName: eventName.value,
    eventImage: eventImage.value,
    eventDay: eventDay.value,
    eventMonth: eventMonth.value,
    eventYear: eventYear.value,
    eventId: eventID++,
  };

  const events = localStorage.getItem("events");
  if (!events) {
    localStorage.setItem("events", JSON.stringify([event]));
  } else {
    const eventsArray = JSON.parse(events);
    localStorage.setItem("events", JSON.stringify([...eventsArray, event]));
  }
  dates.push(usersTime);
  refreshEvents();
  settings.classList.remove("active");
  title.classList.remove("hide-title");
};

const removeItemFromLS = (id) => {
  const events = localStorage.getItem("events");
  const eventsArray = JSON.parse(events);
  eventsArray.splice(id, 1);
  console.log(id);
  localStorage.setItem("events", JSON.stringify(eventsArray));
};

const deleteEvent = (id) => {
  const eventToDelete = document.getElementById(id);
  containerApp.removeChild(eventToDelete);
  removeItemFromLS(id);
};

saveBtn.addEventListener("click", createEvent);
settingsBtn.addEventListener("click", showSettings);
