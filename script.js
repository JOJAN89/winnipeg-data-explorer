document.querySelector("#searchForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const commonName = document.querySelector("#commonNameInput").value.trim();
  const statusMessage = document.querySelector("#statusMessage");
  const tableBody = document.querySelector("#resultsTable tbody");
  tableBody.innerHTML = "";
  statusMessage.textContent = "Loading...";

  const apiUrl = `https://data.winnipeg.ca/resource/d3jk-hb6j.json?` +
                 `$where=lower(common_name) LIKE lower('%${commonName}%')` +
                 `&$order=diameter_at_breast_height DESC` +
                 `&$limit=100`;

  const encodedURL = encodeURI(apiUrl);

  try {
    const response = await fetch(encodedURL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    if (data.length === 0) {
      statusMessage.textContent = "No trees found.";
      return;
    }

    data.forEach(tree => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${tree.common_name || "N/A"}</td>
        <td>${tree.scientific_name || "N/A"}</td>
        <td>${tree.diameter_at_breast_height || "N/A"}</td>
      `;
      tableBody.appendChild(row);
    });
    statusMessage.textContent = `${data.length} results found.`;

  } catch (error) {
    console.error(error);
    statusMessage.textContent = "Error loading data. Please try again later.";
  }
});
