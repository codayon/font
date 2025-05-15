// Store loaded fonts
const fonts = [];

// Handle .ttf file upload
document
  .getElementById("fontUpload")
  .addEventListener("change", async (event) => {
    const files = event.target.files;
    for (const file of files) {
      if (file.name.endsWith(".ttf")) {
        const fontName = file.name.replace(".ttf", "");
        const arrayBuffer = await file.arrayBuffer();
        const fontData = new Uint8Array(arrayBuffer);
        const blob = new Blob([fontData], { type: "font/ttf" });
        const url = URL.createObjectURL(blob);

        // Create font face
        const fontFace = new FontFace(fontName, `url(${url})`);
        await fontFace.load();
        document.fonts.add(fontFace);

        fonts.push({ name: fontName, type: "ttf", url });
        updateComparison();
      }
    }
  });

// Handle Google Fonts URL
document.getElementById("addGoogleFont").addEventListener("click", () => {
  const urlInput = document.getElementById("googleFontUrl");
  let url = urlInput.value.trim();

  // Remove query parameters if present
  if (url.includes("?")) {
    url = url.split("?")[0];
  }

  if (url && url.includes("fonts.google.com")) {
    // Extract font name from URL
    const fontName = url.split("/").pop().replace(/\+/g, " ");
    const apiUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(
      /\s/g,
      "+",
    )}&display=swap`;

    // Add Google Fonts stylesheet
    const link = document.createElement("link");
    link.href = apiUrl;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    fonts.push({ name: fontName, type: "google", url: apiUrl });
    updateComparison();
    urlInput.value = "";
  } else {
    alert("Please enter a valid Google Fonts URL.");
  }
});

// Remove font
function removeFont(index) {
  const font = fonts[index];
  if (font.type === "ttf") {
    URL.revokeObjectURL(font.url);
  } else if (font.type === "google") {
    const link = document.querySelector(`link[href="${font.url}"]`);
    if (link) link.remove();
  }
  fonts.splice(index, 1);
  updateComparison();
}

// Update comparison grid
function updateComparison() {
  const fontList = document.getElementById("fontList");
  const comparisonGrid = document.getElementById("comparisonGrid");

  // Update font list with remove buttons
  fontList.innerHTML =
    fonts.length > 0
      ? fonts
          .map(
            (font, index) => `
            <span class="font-tag">
              ${font.name}
              <button onclick="removeFont(${index})">Remove</button>
            </span>
          `,
          )
          .join("")
      : '<p style="color: #666;">No fonts added yet.</p>';

  // Clear existing comparison
  comparisonGrid.innerHTML = "";

  // Sample text styles
  const samples = [
    {
      label: "Heading (H1)",
      class: "heading",
      text: "The Quick Brown Fox",
    },
    {
      label: "Subheading (H2)",
      class: "subheading",
      text: "Lorem Ipsum Dolor",
    },
    {
      label: "Body Text",
      class: "body-text",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    },
    {
      label: "Small Text",
      class: "small-text",
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];

  // Create comparison cards for each font
  fonts.forEach((font) => {
    const card = document.createElement("div");
    card.className = "font-card";
    card.innerHTML = `<h3>${font.name}</h3>`;

    samples.forEach((sample) => {
      const sampleDiv = document.createElement("div");
      sampleDiv.className = "sample";
      sampleDiv.innerHTML = `
            <p class="sample-label">${sample.label}</p>
            <p class="${sample.class}" style="font-family: '${font.name}';">${sample.text}</p>
          `;
      card.appendChild(sampleDiv);
    });

    comparisonGrid.appendChild(card);
  });
}
