// frontend/public/adminScript.js

let currentId = null;
let currentSection = "";

// Dynamically show section based on sidebar click
function showSection(section) {
  console.log(localStorage.getItem("token"));
  currentSection = section;
  document.querySelectorAll(".content-section").forEach((sec) => {
    sec.style.display = sec.id.includes(section) ? "block" : "none";
  });
  fetchRecords(section);
}

// Function to open Add Modal with dynamic fields
function openAddModal(section) {
  currentSection = section;
  const form = document.getElementById("addForm");
  form.innerHTML =
    generateFormFields(section) + `<button type="submit">Add</button>`;
  document.getElementById("addModal").style.display = "block";
}

// Function to open Update Modal with dynamic fields
function openUpdateModal(id, ...fields) {
  currentId = id;
  const form = document.getElementById("updateForm");
  form.innerHTML =
    generateFormFields(currentSection, fields) +
    `<button type="submit">Update</button>`;
  document.getElementById("updateModal").style.display = "block";
}

// Generate form fields based on section
function generateFormFields(section, values = []) {
  const fields = {
    generators: [
      { label: "Size (W)", id: "generator_size_wattage", value: values[0] },
      { label: "Cost (Naira)", id: "generator_cost_naira", value: values[1] },
      {
        label: "Fuel Consumption (L/hr)",
        id: "fuel_consumption_per_hr",
        value: values[2],
      },
    ],
    inverters: [
      { label: "Size (W)", id: "inverter_size_watts", value: values[0] },
      { label: "Cost (Naira)", id: "inverter_cost_naira", value: values[1] },
    ],
    solar_charge_controllers: [
      {
        label: "Size",
        id: "solar_charge_controller_size_amperes",
        value: values[0],
      },
      {
        label: "Cost (Naira)",
        id: "solar_charge_controller_cost_naira",
        value: values[1],
      },
    ],
  };

  return fields[section]
    .map(
      (field) => `
    <label for="${field.id}">${field.label}</label>
    <input type="text" id="${field.id}" value="${field.value || ""}" required />
  `
    )
    .join("");
}

// Fetch records for the current section
async function fetchRecords(section) {
  const response = await fetch(`/api/v1/${section}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  const records = await response.json();
  records.sort((a, b) => a.id - b.id);

  const tableBody = document.querySelector(`#${section}Table tbody`);
  tableBody.innerHTML = "";
  records.forEach((record) => {
    const row = `
      <tr>
        <td>${record.id}</td>
        ${Object.values(record)
          .slice(1)
          .map((value) => `<td>${value}</td>`)
          .join("")}
        <td>
          <button class="notion-btn update-btn" onclick="openUpdateModal(${
            record.id
          }, ${Object.values(record)
      .slice(1)
      .map((value) => `'${value}'`)
      .join(", ")})">Update</button>
          <button class="notion-btn delete-btn" onclick="deleteRecord(${
            record.id
          })">Delete</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// Add new record
document
  .getElementById("addForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const payload = generatePayload(currentSection);

    const response = await fetch(`/api/v1/${currentSection}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("Record added successfully");
      fetchRecords(currentSection);
      closeModal("addModal");
    } else {
      alert("Failed to add record");
    }
  });

// Update record
document
  .getElementById("updateForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const payload = generatePayload(currentSection);

    const response = await fetch(`/api/v1/${currentSection}/${currentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("Record updated successfully");
      fetchRecords(currentSection);
      closeModal("updateModal");
    } else {
      alert("Failed to update record");
    }
  });

// Delete record
async function deleteRecord(id) {
  const response = await fetch(`/api/v1/${currentSection}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  if (response.ok) {
    alert("Record deleted successfully");
    fetchRecords(currentSection);
  } else {
    alert("Failed to delete record");
  }
}

// Generate payload from form inputs based on section
function generatePayload(section) {
  const fields = {
    generators: [
      "generator_size_wattage",
      "generator_cost_naira",
      "fuel_consumption_per_hr",
    ],
    inverters: ["inverter_size_watts", "inverter_cost_naira"],
    solar_charge_controllers: [
      "solar_charge_controller_size_amperes",
      "solar_charge_controller_cost_naira",
    ],
  };

  const payload = {};
  fields[section].forEach((id) => {
    payload[id] = document.getElementById(id).value;
  });

  return payload;
}

function logout() {
  // Clear the token from localStorage
  localStorage.removeItem("token");

  // Redirect to the login page
  window.location.href = "admin-login.html";
}

// Close modal function
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Load initial section when page loads
showSection("generators");
