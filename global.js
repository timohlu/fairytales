// Navigation Hide on Scroll
let isNavHidden = false;

const navbar = document.getElementById('navigation');
const bottomNav = document.getElementById('bottom-nav');
const navToggle = document.getElementById('nav-toggle');

navToggle.addEventListener('click', function () {
  isNavHidden = !isNavHidden;
  localStorage.setItem('navbarHidden', isNavHidden);

  updateNavState();
});

function updateNavState() {
  if (isNavHidden) {
    navbar.style.transform = 'translateY(-200%)';
    bottomNav.style.transform = 'translateY(200%)';
    navToggle.style.transform = 'rotate(45deg)';
  } else {
    navbar.style.transform = 'translateY(0%)';
    bottomNav.style.transform = 'translateY(0%)';
    navToggle.style.transform = 'rotate(0deg)';
  }
}

isNavHidden = localStorage.getItem('navbarHidden') === 'true' || false;
updateNavState();

// LOAD IMAGES
const imagePath = "assets/images/all/";

function loadImages() {
  const imageContainer = document.getElementById("container");

  fetch(imagePath)
    .then(response => response.text())
    .then(text => {
      const regex = /<span class="name">(.*?)<\/span>/g;
      const fileNames = [];
      let match;
      while ((match = regex.exec(text)) !== null) {
        fileNames.push(match[1]);
      }

      console.log("Filenames:", fileNames);

      const filteredFileNames = fileNames.filter(fileName => !fileName.includes(".DS_Store") && !fileName.includes(".."));

      filteredFileNames.forEach(fileName => {
        const trimmedFileName = fileName.trim();
        if (trimmedFileName !== "") {
          const img = document.createElement("img");
          const imageUrl = imagePath + trimmedFileName;
          img.src = imageUrl;
          img.classList.add("inspo-image");
          img.alt = "Inspiration Image";
          img.loading = "lazy";
          img.draggable = false;
          img.addEventListener("dblclick", function () {
            downloadImage(imageUrl, trimmedFileName);
          });

          // Add error event listener to log failed image loading
          img.addEventListener("error", function () {
            console.error("Failed to load image:", imageUrl);
          });

          imageContainer.appendChild(img);
        }
      });
    })
    .catch(error => console.error("Error loading images:", error));
}

window.onload = loadImages;

function downloadImage(imageUrl, fileName) {
  console.log("Downloading image:", imageUrl);
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Toggle Views
const toggleSwitch = document.getElementById("toggleSwitch");
const images = document.querySelectorAll('.inspo-image');
const container = document.getElementById("container");

function toggleClasses() {
  images.forEach(function (image) {
    image.classList.toggle("contain", toggleSwitch.checked);
  });
  container.classList.toggle("spacing", toggleSwitch.checked);
}

const savedState = localStorage.getItem('toggleState');
toggleSwitch.checked = savedState === 'true';
toggleClasses(); // Apply initial state

toggleSwitch.addEventListener("change", function () {
  toggleClasses(); // Apply class toggling when switch changes
  localStorage.setItem('toggleState', toggleSwitch.checked); // Save state to localStorage
});

// Show Help on Hover
const helpTrigger = document.getElementById("helpTrigger");
const infobox = document.getElementById("helpInfoBox");

helpTrigger.addEventListener("mouseover", () => {
  infobox.style.display = "flex";
  helpTrigger.classList.add("scaled");
});

helpTrigger.addEventListener("mouseleave", () => {
  infobox.style.display = "none";
  helpTrigger.classList.remove("scaled");
});
