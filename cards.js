let projects = JSON.parse(localStorage.getItem("projects")) || [];
let currentProjectIndex = null;
let currentTaskIndex = null;
const UserName = document.getElementById("userNameDisplay");
const emailDisplay = document.getElementById("emailDisplay");
function renderProjects() {
  const projectContainer = document.getElementById("projectContainer");
  projectContainer.innerHTML = "";

  if (projects.length === 0) {
    projectContainer.innerHTML =
      "<p>No projects available. Please create a new project.</p>";
  }

  projects.forEach((project, index) => {
    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project");
    projectDiv.setAttribute("id", "project-" + index);

    projectDiv.innerHTML = `
            <h2>${project.title}</h2>
            <p>${project.description}</p>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${project.progress}%"></div>
            </div>
            <div class="project-actions">
                <button class="button" onclick="editProject(${index})">Edit</button>
                <button class="button" onclick="deleteProject(${index})">Delete</button>
                <button class="button" onclick="showCreateTaskModal(${index})">Add Task</button>
            </div>
        `;

    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");
    if (project.tasks && project.tasks.length > 0) {
      project.tasks.forEach((task, taskIndex) => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        taskDiv.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p><strong>Assignee:</strong> ${task.assignee || "N/A"}</p>
                    <p><strong>Due Date:</strong> ${task.dueDate || "N/A"}</p>
                    <p><strong>Status:</strong> ${task.status || "N/A"}</p>
                    <p><strong>Created On:</strong> ${task.createdOn}</p>
                    <p><strong>Updated On:</strong> ${
                      task.updatedOn || "N/A"
                    }</p>
                    <div class="task-actions">
                        <button class="button" onclick="editTask(${index}, ${taskIndex})">Edit</button>
                        <button class="button" onclick="deleteTask(${index}, ${taskIndex})">Delete</button>
                    </div>
                `;
        taskContainer.appendChild(taskDiv);
      });
    } else {
      taskContainer.innerHTML =
        "<p>No tasks available. Add tasks to this project.</p>";
    }

    projectDiv.appendChild(taskContainer);
    projectContainer.appendChild(projectDiv);
  });
}
function editProject(index) {
  currentProjectIndex = index;
  const project = projects[index];
  document.getElementById("createEditProjectModal").style.display = "flex";
  document.getElementById("modalTitle").innerText = "Edit Project";
  document.getElementById("modalButton").innerText = "Save Changes";
  document.getElementById("projectTitle").value = project.title;
  document.getElementById("projectDescription").value = project.description;
  document.getElementById("projectProgress").value = project.progress;
}

function showCreateProjectModal() {
  currentProjectIndex = null;
  document.getElementById("createEditProjectModal").style.display = "flex";
  document.getElementById("modalTitle").innerText = "Create Project";
  document.getElementById("modalButton").innerText = "Create Project";
  document.getElementById("projectTitle").value = "";
  document.getElementById("projectDescription").value = "";
  document.getElementById("projectProgress").value = 0;
}
function saveProject() {
  const title = document.getElementById("projectTitle").value;
  const description = document.getElementById("projectDescription").value;
  const progress = document.getElementById("projectProgress").value;

  if (currentProjectIndex === null) {
    projects.push({
      title,
      description,
      progress: parseInt(progress),
      tasks: [],
    });
  } else {
    const updatedProject = projects[currentProjectIndex];
    updatedProject.title = title;
    updatedProject.description = description;
    updatedProject.progress = parseInt(progress);
  }

  localStorage.setItem("projects", JSON.stringify(projects));
  closeModal("createEditProjectModal");
  renderProjects();
}

function deleteProject(index) {
  projects.splice(index, 1);
  localStorage.setItem("projects", JSON.stringify(projects));
  renderProjects();
}
function showCreateTaskModal(projectIndex) {
  currentProjectIndex = projectIndex;
  currentTaskIndex = null;
  document.getElementById("createEditTaskModal").style.display = "flex";
  document.getElementById("taskModalTitle").innerText = "Create Task";
  document.getElementById("taskModalButton").innerText = "Create Task";
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskAssignee").value = "";
  document.getElementById("taskDeadline").value = "";
  document.getElementById("taskStatus").value = "To-Do";
}
function editTask(projectIndex, taskIndex) {
  currentProjectIndex = projectIndex;
  currentTaskIndex = taskIndex;
  const task = projects[projectIndex].tasks[taskIndex];
  document.getElementById("createEditTaskModal").style.display = "flex";
  document.getElementById("taskModalTitle").innerText = "Edit Task";
  document.getElementById("taskModalButton").innerText = "Save Changes";
  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskDescription").value = task.description;
  document.getElementById("taskAssignee").value = task.assignee || "";
  document.getElementById("taskDeadline").value = task.dueDate || "";
  document.getElementById("taskStatus").value = task.status || "To-Do";
}
function saveTask() {
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;
  const assignee = document.getElementById("taskAssignee").value;
  const deadline = document.getElementById("taskDeadline").value;
  const status = document.getElementById("taskStatus").value;

  const task = {
    title,
    description,
    assignee,
    dueDate: deadline,
    status,
    createdOn: new Date().toLocaleString(),
    updatedOn: null,
  };

  if (currentTaskIndex === null) {
    projects[currentProjectIndex].tasks.push(task);
  } else {
    const updatedTask = projects[currentProjectIndex].tasks[currentTaskIndex];
    updatedTask.title = title;
    updatedTask.description = description;
    updatedTask.assignee = assignee;
    updatedTask.dueDate = deadline;
    updatedTask.status = status;
    updatedTask.updatedOn = new Date().toLocaleString();
  }

  localStorage.setItem("projects", JSON.stringify(projects));
  closeModal("createEditTaskModal");
  renderProjects();
}
function deleteTask(projectIndex, taskIndex) {
  projects[projectIndex].tasks.splice(taskIndex, 1);
  localStorage.setItem("projects", JSON.stringify(projects));
  renderProjects();
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  if (modalId === "createEditTaskModal") {
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskAssignee").value = "";
    document.getElementById("taskDeadline").value = "";
    document.getElementById("taskStatus").value = "To-Do";
  }
}
function displayName() {
  const users = JSON.parse(sessionStorage.getItem("users")) || [];
  if (users[0].email) {
    for (let i = 0; i < users.length; i++) {
      let Name = users[i].email.split("@")[0];
      UserName.innerText = "Welcome " + Name;
    }
  }
  if (users[0].email) {
    {
      let hidingEmail = () => {
        for (let i = 0; i < users.length; i++) {
          emailDisplay.innerText = users[i].email.replace(
            users[i].email.split("@")[0].slice(-5),
            "****"
          );
        }
      };
      hidingEmail();
    }
  }
}

window.onload = displayName;
renderProjects();
