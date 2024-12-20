class Job {
  constructor(title, postedTime, type, level, skill, detail) {
    this.title = title;
    this.postedTime = this.normalizePostedTime(postedTime);
    this.type = type;
    this.level = level;
    this.skill = skill;
    this.detail = detail;
  }

  normalizePostedTime(postedTime) {
    const timeValue = parseInt(postedTime.match(/\d+/)) || 0;
    if (postedTime.includes("minute")) return timeValue;
    if (postedTime.includes("hour")) return timeValue * 60;
    if (postedTime.includes("day")) return timeValue * 1440;
    return 0;
  }

  getDetails() {
    return `
      <strong>Title:</strong> ${this.title}<br>
      <strong>Posted Time:</strong> ${this.postedTime} minutes ago<br>
      <strong>Type:</strong> ${this.type}<br>
      <strong>Level:</strong> ${this.level}<br>
      <strong>Skill:</strong> ${this.skill}<br>
      <strong>Detail:</strong> ${this.detail}
    `;
  }
}

let jobs = [];
let filteredJobs = [];

document.getElementById("fileInput").addEventListener("change", handleFileUpload);
document.getElementById("levelFilter").addEventListener("change", applyFilters);
document.getElementById("typeFilter").addEventListener("change", applyFilters);
document.getElementById("sortOptions").addEventListener("change", applySorting);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    try {
      const data = JSON.parse(reader.result);
      jobs = data.map(
        (job) =>
          new Job(job.Title, job.Posted, job.Type, job.Level, job.Skill, job.Detail)
      );
      filteredJobs = [...jobs];
      populateFilters();
      displayJobs(filteredJobs);
      document.getElementById("errorMessage").textContent = "";
    } catch (error) {
      document.getElementById("errorMessage").textContent =
        "Error loading file. Please ensure it is a valid JSON file.";
    }
  };
  reader.readAsText(file);
}

function populateFilters() {
  const levels = new Set(jobs.map((job) => job.level));
  const types = new Set(jobs.map((job) => job.type));

  const levelFilter = document.getElementById("levelFilter");
  const typeFilter = document.getElementById("typeFilter");

  levels.forEach((level) => {
    const option = document.createElement("option");
    option.value = level;
    option.textContent = level;
    levelFilter.appendChild(option);
  });

  types.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeFilter.appendChild(option);
  });
}

function applyFilters() {
  const level = document.getElementById("levelFilter").value;
  const type = document.getElementById("typeFilter").value;

  filteredJobs = jobs.filter(
    (job) =>
      (level === "" || job.level === level) &&
      (type === "" || job.type === type)
  );
  displayJobs(filteredJobs);
}

function applySorting() {
  const sortOption = document.getElementById("sortOptions").value;
  if (sortOption === "title-asc") {
    filteredJobs.sort((a, b) => a.title.localeCompare(b.title)); // A-Z
  } else if (sortOption === "title-desc") {
    filteredJobs.sort((a, b) => b.title.localeCompare(a.title)); // Z-A
  } else if (sortOption === "time-oldest") {
    filteredJobs.sort((a, b) => a.postedTime - b.postedTime); // Oldest First
  } else if (sortOption === "time-newest") {
    filteredJobs.sort((a, b) => b.postedTime - a.postedTime); // Newest First
  }
  displayJobs(filteredJobs);
}

function displayJobs(jobs) {
  const jobList = document.getElementById("jobList");
  jobList.innerHTML = "";

  jobs.forEach((job) => {
    const jobItem = document.createElement("li");
    jobItem.className = "job-item";
    jobItem.textContent = job.title;
    jobItem.addEventListener("click", () => toggleDetails(job, jobItem));
    jobList.appendChild(jobItem);
  });
}

function toggleDetails(job, jobItem) {
  let details = jobItem.querySelector(".details");
  if (!details) {
    details = document.createElement("div");
    details.className = "details";
    details.innerHTML = job.getDetails();
    jobItem.appendChild(details);
  }
  details.style.display = details.style.display === "block" ? "none" : "block";
}
