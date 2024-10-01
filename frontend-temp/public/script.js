// public/script.js

document
  .getElementById("roiForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get form values
    const kWhConsumed = document.getElementById("kWhConsumed").value;
    const hoursOfNepaLight = document.getElementById("hoursOfNepaLight").value;
    const userBackupTime = document.getElementById("userBackupTime").value;

    // Prepare the request payload
    const payload = {
      kWhConsumed: parseFloat(kWhConsumed),
      hoursOfNepaLight: parseFloat(hoursOfNepaLight),
      userBackupTime: parseFloat(userBackupTime),
    };

    // Send POST request to the server
    try {
      const response = await fetch("/api/v1/calculate-solar-roi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      // Display the results
      const resultsDiv = document.getElementById("results");
      if (response.ok) {
        resultsDiv.innerHTML = `
                <h2>Solar ROI Results</h2>
                <p><strong>Initial Solar Cost:</strong> ${result.initialSolarCost} Naira</p>
                <p><strong>Initial Generator Cost:</strong> ${result.initialGeneratorCost} Naira</p>
                <p><strong>Monthly Operating Generator Cost:</strong> ${result.monthlyOperatingGeneratorCost} Naira</p>
                <p><strong>Yearly Operating Generator Cost:</strong> ${result.yearlyOperatingGeneratorCost} Naira</p>
                <p><strong>How long for cumulative generator cost to equal initial solar cost:</strong> ${result.breakEvenYears} years and ${result.remainingMonths} months</p>
            `;
      } else {
        resultsDiv.innerHTML = `<p>Error: ${result.message}</p>`;
      }
    } catch (error) {
      console.error("Error:", error);
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = `<p>Error: Unable to calculate ROI at this time.</p>`;
    }
  });
