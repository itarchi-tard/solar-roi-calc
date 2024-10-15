// frontend/public/adminScript.js

// Function to fetch and display all generators
async function fetchGenerators() {
  const response = await fetch("/api/v1/generators", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Admin token stored in localStorage
    },
  });

  const generators = await response.json();

  const generatorTable = document.querySelector("#generatorTable tbody");
  generatorTable.innerHTML = ""; // Clear the table before inserting new data

  generators.forEach((generator) => {
    const row = `
        <tr>
          <td>${generator.id}</td>
          <td>${generator.generator_size_wattage}</td>
          <td>${generator.generator_cost_naira}</td>
          <td>${generator.fuel_consumption_per_hr}</td>
          <td>
            <button onclick="deleteGenerator(${generator.id})">Delete</button>
          </td>
        </tr>
      `;
    generatorTable.innerHTML += row;
  });
}

// Function to handle adding a new generator
document
  .getElementById("addGeneratorForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const generatorSize = document.getElementById("genSize").value;
    const generatorCost = document.getElementById("genCost").value;
    const fuelConsumption = document.getElementById("fuelConsumption").value;

    const payload = {
      generator_size_wattage: generatorSize,
      generator_cost_naira: generatorCost,
      fuel_consumption_per_hr: fuelConsumption,
    };

    const response = await fetch("/api/v1/generators", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Admin token stored in localStorage
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("Generator added successfully");
      fetchGenerators(); // Refresh the generator list
    } else {
      alert("Failed to add generator");
    }
  });

// Function to delete a generator
async function deleteGenerator(id) {
  const response = await fetch(`/api/v1/generators/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Admin token stored in localStorage
    },
  });

  if (response.ok) {
    alert("Generator deleted successfully");
    fetchGenerators(); // Refresh the generator list
  } else {
    alert("Failed to delete generator");
  }
}

// Fetch all generators when the page loads
fetchGenerators();
