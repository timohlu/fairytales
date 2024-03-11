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


// Toggle Views
document.addEventListener('DOMContentLoaded', function () {
  const toggleSwitch = document.getElementById("toggleSwitch");
  const images = document.querySelectorAll('.inspo-image');
  const container = document.getElementById("container");

  const savedState = localStorage.getItem('toggleState');
  if (savedState === 'true') {
    toggleSwitch.checked = true;
    container.classList.add("spacing");
    images.forEach(function (image) {
      image.classList.add("contain");
    });
  }

  toggleSwitch.addEventListener("change", function () {
    images.forEach(function (image) {
      if (toggleSwitch.checked) {
        image.classList.add("contain");
      } else {
        image.classList.remove("contain");
      }
    });

    if (toggleSwitch.checked) {
      container.classList.add("spacing");
    } else {
      container.classList.remove("spacing");
    }

    localStorage.setItem('toggleState', toggleSwitch.checked);
  });
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

// Download Images on Double-Click
function downloadImage(element) {
  var imagePath = element.getAttribute("src");
  var imageName = imagePath.split('/').pop();

  fetch(imagePath)
    .then(response => response.blob())
    .then(blob => {
      var anchorElement = document.createElement("a");
      var objectURL = URL.createObjectURL(blob);

      anchorElement.href = objectURL;
      anchorElement.download = imageName;

      document.body.appendChild(anchorElement);
      anchorElement.click();

      document.body.removeChild(anchorElement);

      URL.revokeObjectURL(objectURL);
    })
    .catch(error => console.error("Error downloading image:", error));
}

// Image Count
document.addEventListener('DOMContentLoaded', () => {
  const imageCountElement = document.getElementById('count');
  const imageContainer = document.getElementById('container');

  let currentCount = 0;
  const targetCount = document.querySelectorAll('.inspo-image').length;
  const animationDuration = 1000;

  const updateImageCount = () => {
    imageCountElement.innerHTML = currentCount;
  };

  const incrementCounter = () => {
    if (currentCount < targetCount) {
      currentCount++;
      updateImageCount();
    } else {
      clearInterval(counterInterval);
    }
  };

  updateImageCount();

  const observer = new MutationObserver(() => {
    currentCount = 0;
    incrementCounter();
  });

  const observerConfig = { childList: true, subtree: true };
  observer.observe(imageContainer, observerConfig);

  const counterInterval = setInterval(incrementCounter, animationDuration / targetCount);
});
