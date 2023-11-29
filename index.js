// the structure of this code draws inspiration heavily from the guided practice.
// That being said, I definately had to put a couple hours to tweak it and adapt it to meet the requirements of the assignmnet.
// I neither felt up to the task, nor had the time to do the additional work like RSVP and all that,
// and I would love to see an example of how that may have worked at some point. I was a bit confused by the connection of ids in the documentation.

const COHORT = "2310-FSA-ET-WEB-PT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

const eventList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);
console.log(API_URL);

async function render() {
  await getEvents();
  renderEvents();
}
render();

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}

function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML = "<li>No events.</li>";
    return;
  }

  const eventCards = state.events.map((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${event.name}</h2>
      <p>Date/Time: ${event.date}</p>
      <p>Location: ${event.location}</p>
      <p>Description: ${event.description}</p>
      <button onclick="deleteEvent(${event.id})">Delete</button>
    `;

    return li;
  });
  // I still dont feel confident in how these "..." work.
  eventList.replaceChildren(...eventCards);
}

// Could this have been dome more simply with .remove?
// Does this even need to be asynchronous since the delete button appears when everything is rendered?
async function deleteEvent(id) {
  try {
    await fetch(
      `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events/${id}`,
      {
        method: "DELETE",
      }
    );
    // I spent a long time trying to figure out why my deletions only worked after refreshing.
    //  The addition of this render was a big breakthrough!
    render();
  } catch (error) {
    console.log(error);
  }
}

async function addEvent(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      //  still not entirely clear what this headers thing does
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addEventForm.name.value,
        date: addEventForm.date.value,
        location: addEventForm.location.value,
        description: addEventForm.description.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}
