function tsiolkovskyEquation({ massRatio, exitVelocity, deltaV }) {
  if (massRatio && exitVelocity) {
    return exitVelocity * Math.log(massRatio);
  } else if (massRatio && deltaV) {
    return deltaV / Math.log(massRatio);
  } else if (exitVelocity && deltaV) {
    return Math.exp(deltaV / exitVelocity);
  } else {
    throw new Error(
      "Please provide exactly two of the three parameters: massRatio, exitVelocity, deltaV."
    );
  }
}

function calculateRange(start, end, steps) {
  const range = [];
  const stepSize = (end - start) / (steps - 1);
  for (let i = 0; i < steps; i++) {
    range.push(start + i * stepSize);
  }
  return range;
}

function calculateAndDisplay() {
  // Make the table visible
  document.getElementById("resultsTable").style.display = "table";

  const massRatioStart = parseFloat(
    document.getElementById("massRatioStart").value
  );
  const massRatioEnd = parseFloat(
    document.getElementById("massRatioEnd").value
  );
  const exitVelocityStart = parseFloat(
    document.getElementById("exitVelocityStart").value
  );
  const exitVelocityEnd = parseFloat(
    document.getElementById("exitVelocityEnd").value
  );
  const deltaVStart = parseFloat(document.getElementById("deltaVStart").value);
  const deltaVEnd = parseFloat(document.getElementById("deltaVEnd").value);
  const steps = parseInt(document.getElementById("steps").value);

  const resultsTableBody = document
    .getElementById("resultsTable")
    .getElementsByTagName("tbody")[0];
  resultsTableBody.innerHTML = "";

  const results = [];

  if (
    !isNaN(massRatioStart) &&
    !isNaN(massRatioEnd) &&
    !isNaN(exitVelocityStart) &&
    !isNaN(exitVelocityEnd)
  ) {
    const massRatios = calculateRange(massRatioStart, massRatioEnd, steps);
    const exitVelocities = calculateRange(
      exitVelocityStart,
      exitVelocityEnd,
      steps
    );
    for (const massRatio of massRatios) {
      for (const exitVelocity of exitVelocities) {
        const deltaV = tsiolkovskyEquation({ massRatio, exitVelocity });
        results.push({ massRatio, exitVelocity, deltaV });

        const row = resultsTableBody.insertRow();
        row.insertCell(0).innerText = massRatio.toFixed(2);
        row.insertCell(1).innerText = exitVelocity.toFixed(2);
        row.insertCell(2).innerText = deltaV.toFixed(2);
      }
    }
  } else if (
    !isNaN(massRatioStart) &&
    !isNaN(massRatioEnd) &&
    !isNaN(deltaVStart) &&
    !isNaN(deltaVEnd)
  ) {
    const massRatios = calculateRange(massRatioStart, massRatioEnd, steps);
    const deltaVs = calculateRange(deltaVStart, deltaVEnd, steps);
    for (const massRatio of massRatios) {
      for (const deltaV of deltaVs) {
        const exitVelocity = tsiolkovskyEquation({ massRatio, deltaV });
        results.push({ massRatio, exitVelocity, deltaV });

        const row = resultsTableBody.insertRow();
        row.insertCell(0).innerText = massRatio.toFixed(2);
        row.insertCell(1).innerText = exitVelocity.toFixed(2);
        row.insertCell(2).innerText = deltaV.toFixed(2);
      }
    }
  } else if (
    !isNaN(exitVelocityStart) &&
    !isNaN(exitVelocityEnd) &&
    !isNaN(deltaVStart) &&
    !isNaN(deltaVEnd)
  ) {
    const exitVelocities = calculateRange(
      exitVelocityStart,
      exitVelocityEnd,
      steps
    );
    const deltaVs = calculateRange(deltaVStart, deltaVEnd, steps);
    for (const exitVelocity of exitVelocities) {
      for (const deltaV of deltaVs) {
        const massRatio = tsiolkovskyEquation({ exitVelocity, deltaV });
        results.push({ massRatio, exitVelocity, deltaV });

        const row = resultsTableBody.insertRow();
        row.insertCell(0).innerText = massRatio.toFixed(2);
        row.insertCell(1).innerText = exitVelocity.toFixed(2);
        row.insertCell(2).innerText = deltaV.toFixed(2);
      }
    }
  } else {
    throw new Error(
      "Please provide ranges for exactly two of the three parameters: massRatio, exitVelocity, deltaV."
    );
  }
}

function downloadCSV() {
  const resultsTable = document.getElementById("resultsTable");
  const rows = Array.from(resultsTable.rows);
  const csvContent = rows
    .map((row) =>
      Array.from(row.cells)
        .map((cell) => cell.innerText)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "results.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
