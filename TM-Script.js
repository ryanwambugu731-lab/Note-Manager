const addNote = document.querySelector(".add-button");
const note = document.querySelector(".note");
const overlay = document.querySelector(".overlay");
const day = document.querySelector(".day");
const month = document.querySelector(".month");
const time = document.querySelector(".time");
const title = document.querySelector(".note-title");
const textarea = document.querySelector(".note-description");
const finish = document.querySelector(".finish-btn");
const numChar = document.querySelector(".num-char");
const metaData = document.querySelector(".extra-info");
const notelist = document.querySelector(".note-list");

let editingNoteId = null;
let editingListItem = null;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const savedNotes = new Map();

// =========================
// SAVE NEW NOTE
// =========================

const saveInfo = function () {
  if (title.value.trim() === "" && textarea.value.trim() === "") {
    return;
  }

  const id = crypto.randomUUID();

  const savedNote = {
    id,
    title: title.value,
    extraInfo: metaData.textContent.trim().replace(/\s+/g, " "),
    content: textarea.value,
    position: savedNotes.size,
  };

  savedNotes.set(id, savedNote);

  return savedNote;
};

// =========================
// OPEN NEW NOTE
// =========================

addNote.addEventListener("click", () => {
  title.value = "";
  textarea.value = "";
  textarea.style.height = "";
  numChar.textContent = "0";

  // We are creating a new note,
  // so there is currently no note being edited.
  editingNoteId = null;
  editingListItem = null;

  note.classList.add("active");
  overlay.classList.add("active");

  setTimeout(() => {
  title.focus();
}, 100);

  const now = new Date();

  const today = now.getDate();
  const thisMonth = now.getMonth();
  const curHour = now.getHours();
  const curMinute = now.getMinutes();

  const hour = curHour % 12 || 12;

  day.textContent = today;

  month.textContent = months[thisMonth];

  time.textContent =
    `${String(hour).padStart(2, "0")}:` +
    `${String(curMinute).padStart(2, "0")} ` +
    `${curHour < 12 ? "AM" : "PM"}`;

});

// =========================
// TEXTAREA
// =========================

textarea.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";

  numChar.textContent = textarea.value.replace(/\s/g, "").length;
});

// =========================
// CLOSE NOTE
// =========================

overlay.addEventListener("click", () => {
  note.classList.remove("active");
  overlay.classList.remove("active");
});

// =========================
// CREATE NOTE
// =========================

finish.addEventListener("click", () => {
  const savedNote = saveInfo();

  if (!savedNote) {
    note.classList.remove("active");
    overlay.classList.remove("active");
    return;
  }

  const newNote = document.createElement("div");

  newNote.classList.add("note-list-item");

  // Store the Map key on the HTML element
  newNote.dataset.id = savedNote.id;

  newNote.innerHTML = `
    <h4 class="note-item-title">
      ${savedNote.title || "Untitled"}
    </h4>

    <p class="note-item-content">
      ${savedNote.content.slice(0, 162)}
    </p>
  `;

  notelist.appendChild(newNote);

  // Close editor
  note.classList.remove("active");
  overlay.classList.remove("active");

  // Reset editor
  title.value = "";
  textarea.value = "";
  textarea.style.height = "";
  numChar.textContent = "0";

  const success = document.createElement("div");
  success.classList.add("success");
  success.textContent = "Note Successfully Saved✅";

  document.body.appendChild(success);

  requestAnimationFrame(() => {
    success.style.opacity = "0.9";
    success.style.visibility = "visible";
  });

  setTimeout(() => {
    success.style.opacity = "0";
    success.style.visibility = "hidden";
  }, 5000);
});

// =========================
// OPEN EXISTING NOTE
// =========================

notelist.addEventListener("click", (e) => {
  const listItem = e.target.closest(".note-list-item");

  if (!listItem) return;

  // Remember BOTH the ID and the actual HTML element
  editingNoteId = listItem.dataset.id;
  editingListItem = listItem;

  // Retrieve the original object from the Map
  const selectedNote = savedNotes.get(editingNoteId);

  // Put its data into the editor
  title.value = selectedNote.title;
  textarea.value = selectedNote.content;

  note.classList.add("active");
  overlay.classList.add("active");

  // Create Update button
  const updateBtn = document.createElement("button");

  updateBtn.classList.add("update-btn");
  updateBtn.textContent = "Update";

  // Replace Finish with Update
  finish.replaceWith(updateBtn);

    setTimeout(() => {
  textarea.focus();
}, 100);

  // =========================
  // UPDATE NOTE
  // =========================

  updateBtn.addEventListener("click", () => {
    // Get the SAME object using the SAME ID
    const selectedNote = savedNotes.get(editingNoteId);

    // Update the object
    selectedNote.title = title.value;
    selectedNote.content = textarea.value;

    // Update the displayed HTML
    editingListItem.querySelector(".note-item-title").textContent =
      selectedNote.title || "Untitled";

    editingListItem.querySelector(".note-item-content").textContent =
      selectedNote.content.slice(0, 99);

    // Close editor
    note.classList.remove("active");
    overlay.classList.remove("active");

    console.log("Updated note:", selectedNote);
    console.log("Map:", savedNotes);

    // Reset editing state
    editingNoteId = null;
    editingListItem = null;

    // Put Finish button back
    updateBtn.replaceWith(finish);

    const updated = document.createElement("div");
    updated.classList.add("updated");
    updated.textContent = "Note Successfully Updated✅";

    document.body.appendChild(updated);

    requestAnimationFrame(() => {
      updated.style.opacity = "0.9";
      updated.style.visibility = "visible";
    });

    setTimeout(() => {
    updated.style.opacity = "0";
    updated.style.visibility = "hidden";
  }, 5000);
  });
});
