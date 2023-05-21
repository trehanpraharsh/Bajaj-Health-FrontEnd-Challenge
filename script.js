document.addEventListener("DOMContentLoaded", function () {
  fetch("bajaj.json")
    .then((response) => response.json())
    .then((data) => {
      const employees = data.employees;

      const nameFilter = document.getElementById("name-filter");
      const designationFilter = document.getElementById("designation-filter");
      const skillsFilterContainer = document.getElementById(
        "skills-filter-container"
      );

      const designations = new Set();
      employees.forEach((employee) => {
        if (employee.designation) {
          designations.add(employee.designation);
        }
      });
      designations.forEach((designation) => {
        const option = document.createElement("option");
        option.text = designation;
        option.value = designation;
        designationFilter.add(option);
      });

      const skills = new Set();
      employees.forEach((employee) => {
        employee.skills.forEach((skill) => {
          skills.add(skill);
        });
      });

      // Populate the skills filter with checkboxes
      skills.forEach((skill) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = skill;
        checkbox.classList.add("skills-filter-checkbox");
        checkbox.addEventListener("change", filterEmployees);

        const label = document.createElement("label");
        label.textContent = skill;
        label.classList.add("skills-filter-label");
        label.appendChild(checkbox);

        skillsFilterContainer.appendChild(label);
      });

      const employeeList = document.getElementById("employee-list");
      employees.forEach((employee) => {
        const card = createEmployeeCard(employee);
        employeeList.appendChild(card);
      });

      function filterEmployees() {
        const name = nameFilter.value.toLowerCase();
        const designation = designationFilter.value;
        const skills = Array.from(
          skillsFilterContainer.querySelectorAll(
            'input[type="checkbox"]:checked'
          )
        ).map((checkbox) => checkbox.value);
        const cards = document.getElementsByClassName("employee-card");

        Array.from(cards).forEach((card) => {
          const nameMatch =
            card.dataset.name.toLowerCase().includes(name) ||
            skills.some((skill) => card.dataset.name.skills.includes(skill));
          const designationMatch =
            designation === "" || card.dataset.designation === designation;
          const skillMatch =
            skills.length === 0 ||
            skills.some((skill) => card.dataset.skills.includes(skill));

          if (nameMatch && designationMatch && skillMatch) {
            card.classList.remove("filtered");
          } else {
            card.classList.add("filtered");
          }
        });
      }

      nameFilter.addEventListener("input", filterEmployees);
      designationFilter.addEventListener("change", filterEmployees);
      skillsFilterContainer.addEventListener("change", filterEmployees);
    })
    .catch((error) => {
      console.log("Error loading JSON data:", error);
    });
});

function createEmployeeCard(employee) {
  const card = document.createElement("div");
  card.className = "employee-card";
  card.dataset.name = employee.name;
  card.dataset.designation = employee.designation;
  card.dataset.skills = employee.skills.join(",");

  const name = document.createElement("h2");
  name.textContent = employee.name;

  const designation = document.createElement("p");
  designation.textContent = employee.designation;

  const projects = document.createElement("p");
  projects.innerHTML = "Projects: " + formatProjects(employee.projects);

  const tasks = document.createElement("p");
  tasks.textContent =
    "Tasks: " + (employee.tasks ? employee.tasks.join(", ") : "N/A");

  const skills = document.createElement("div");
  skills.className = "skills";
  employee.skills.forEach((skill) => {
    const span = document.createElement("span");
    span.textContent = skill;
    skills.appendChild(span);
  });

  card.appendChild(name);
  card.appendChild(designation);
  card.appendChild(projects);
  card.appendChild(tasks);
  card.appendChild(skills);

  return card;
}

function formatProjects(projects) {
  if (!projects || projects.length === 0) {
    return "N/A";
  }

  let formattedProjects = "";
  projects.forEach((project) => {
    formattedProjects += `<strong>Project Name:</strong> ${project.name}<br>`;
    formattedProjects += `<strong>Description:</strong> ${project.description}<br>`;
    formattedProjects += `<strong>Role:</strong> ${project.role}<br>`;
    formattedProjects += "<br>";
  });

  return formattedProjects;
}
