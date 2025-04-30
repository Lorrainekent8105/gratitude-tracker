// --- Title Typing Animation ---
const text = "✨ Find Five";
let i = 0;

function typeWriter() {
  if (i < text.length) {
    document.getElementById("title").textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, 100);
  }
}
typeWriter();

// --- Utility ---
function getTodayKey() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

// --- Streak Tracker ---
function updateStreak() {
  const streakKey = "gratitude-streak";
  const lastDateKey = "gratitude-lastDate";
  const today = getTodayKey();
  const storedStreak = parseInt(localStorage.getItem(streakKey)) || 0;
  const lastDate = localStorage.getItem(lastDateKey);
  let newStreak = storedStreak;

  if (!lastDate) {
    newStreak = 1;
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yString = yesterday.toISOString().split("T")[0];
    if (lastDate === today) {
      newStreak = storedStreak;
    } else if (lastDate === yString) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  }

  localStorage.setItem(streakKey, newStreak);
  localStorage.setItem(lastDateKey, today);
  document.getElementById("streakDisplay").textContent = `Streak: ${newStreak} day${newStreak > 1 ? "s" : ""}`;
}

// --- Gratitude Entry Logic ---
function loadEntries() {
  const key = getTodayKey();
  const data = JSON.parse(localStorage.getItem("gratitudes") || "{}");
  return data[key] || [];
}

function saveEntry(text) {
  const key = getTodayKey();
  let data = JSON.parse(localStorage.getItem("gratitudes") || "{}");
  if (!data[key]) data[key] = [];
  data[key].push(text);
  localStorage.setItem("gratitudes", JSON.stringify(data));
}

function renderEntries() {
  const list = document.getElementById("todayList");
  const counter = document.getElementById("counterMsg");
  const entries = loadEntries();
  list.innerHTML = "";
  entries.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });

  if (entries.length < 5) {
    counter.textContent = `You've added ${entries.length} today — ${5 - entries.length} more to go.`;
  } else {
    counter.textContent = `You've reached your goal of 5 today 🙌`;
  }
}

function addGratitude() {
  const input = document.getElementById("gratitudeInput");
  const text = input.value.trim();
  if (text) {
    saveEntry(text);
    input.value = "";
    renderEntries();
    updateStreak();
  }
}

// --- History Toggle ---
function toggleHistory() {
  const div = document.getElementById("history");
  if (div.style.display === "none") {
    const allData = JSON.parse(localStorage.getItem("gratitudes") || "{}");
    const todayKey = getTodayKey();
    let html = "";
    for (let date in allData) {
      if (date !== todayKey) {
        html += `<strong>${date}</strong><ul>`;
        allData[date].forEach((e) => {
          html += `<li>${e}</li>`;
        });
        html += "</ul>";
      }
    }
    div.innerHTML = html || "<p>No past entries yet.</p>";
    div.style.display = "block";
  } else {
    div.style.display = "none";
  }
}
function updateStreak() {
  const streakKey = "gratitude-streak";
  const lastDateKey = "gratitude-lastDate";
  const today = new Date().toISOString().split("T")[0];

  const storedStreak = parseInt(localStorage.getItem(streakKey)) || 0;
  const lastDate = localStorage.getItem(lastDateKey);

  let newStreak = storedStreak;

  if (!lastDate) {
    newStreak = 1;
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yString = yesterday.toISOString().split("T")[0];

    if (lastDate === today) {
      newStreak = storedStreak;
    } else if (lastDate === yString) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  }

  localStorage.setItem(streakKey, newStreak);
  localStorage.setItem(lastDateKey, today);
  document.getElementById("streakDisplay").textContent = `Streak: ${newStreak} day${newStreak > 1 ? "s" : ""}`;
}
let selectedMood = 0;

function setupMoodSelector() {
  const moodSpans = document.querySelectorAll(".mood-selector span");
  moodSpans.forEach(span => {
    span.addEventListener("click", () => {
      moodSpans.forEach(s => s.classList.remove("selected"));
      span.classList.add("selected");
      selectedMood = parseInt(span.dataset.mood);
    });
  });
}

// --- Initialize Everything on Page Load ---
document.addEventListener("DOMContentLoaded", function () {
  renderEntries();
  updateStreak();
});

