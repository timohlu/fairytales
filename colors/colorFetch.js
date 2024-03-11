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

// COLORS SORT
const sortMethod = 'hue';

const hexToHsl = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;

  const cmin = Math.min(normR, normG, normB);
  const cmax = Math.max(normR, normG, normB);
  const delta = cmax - cmin;

  let h = 0;
  let s = 0;
  let l = 0.5;

  if (delta !== 0) {
    if (cmax === normR) {
      h = ((normG - normB) / delta) % 6;
    } else if (cmax === normG) {
      h = (normB - normR) / delta + 2;
    } else {
      h = (normR - normG) / delta + 4;
    }
  }

  h = Math.round(h * 60);

  l = (cmax + cmin) / 2;

  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h, s, l };
};

// FETCH COLORS
const fetchColors = async () => {
  try {
    const response = await fetch('/hexcodes.json');
    const colors = await response.json();
    console.log('Fetched colors:', colors);
    return colors;
  } catch (error) {
    console.error('Error fetching colors:', error.message);
    throw error;
  }
};

const createColorElement = (color) => {
  const colorElement = document.createElement('div');
  colorElement.classList.add('color');
  colorElement.classList.add(color.colorCategory.toLowerCase());

  const nameElement = document.createElement('p');
  nameElement.classList.add('name');
  nameElement.textContent = color.name;

  const hexcodeElement = document.createElement('p');
  hexcodeElement.classList.add('hexcode');
  hexcodeElement.textContent = color.hexcode;

  colorElement.appendChild(nameElement);
  colorElement.appendChild(hexcodeElement);

  return colorElement;
};

const addColorsToCategory = (category, colors, categoryContainer) => {
  colors.sort((a, b) => {
    if (sortMethod === 'lightness') {
      const aL = hexToHsl(a.hexcode).l;
      const bL = hexToHsl(b.hexcode).l;
      return aL - bL;
    } else {
      const aH = hexToHsl(a.hexcode).h;
      const bH = hexToHsl(b.hexcode).h;
      return aH - bH;
    }
  });

  colors.forEach(color => {
    const colorElement = createColorElement(color);
    categoryContainer.appendChild(colorElement);

    colorElement.style.backgroundColor = color.hexcode;

    colorElement.addEventListener('dblclick', function () {
      const tempInput = document.createElement('input');
      tempInput.value = color.hexcode.toUpperCase();
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);

      this.style.backgroundColor = 'white';
      setTimeout(() => {
        this.style.backgroundColor = color.hexcode;
      }, 150);
    });
  });
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const colors = await fetchColors();
    console.log('Colors:', colors);

    const colorsByCategory = colors.reduce((acc, color) => {
      acc[color.colorCategory] = acc[color.colorCategory] || [];
      acc[color.colorCategory].push(color);
      return acc;
    }, {});

    const colorContainer = document.getElementById('container');

    Object.entries(colorsByCategory).forEach(([category, colors]) => {
      if (colors.length > 0) {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('color-category');
        categoryContainer.id = category.toLowerCase();
        colorContainer.appendChild(categoryContainer);
        addColorsToCategory(category, colors, categoryContainer);
      }
    });
  } catch (error) {
    console.error('Error fetching or processing colors:', error.message);
  }
});

// COLOR COUNTER
document.addEventListener('DOMContentLoaded', async () => {
  const imageCountElement = document.getElementById('colorCount');
  const imageContainer = document.getElementById('container');

  let currentCount = 0;

  const fetchColors = async () => {
    try {
      const response = await fetch('/hexcodes.json');
      const colors = await response.json();
      console.log('Fetched colors for counter:', colors);
      return colors;
    } catch (error) {
      console.error('Error fetching colors for counter:', error.message);
      throw error;
    }
  };

  const colors = await fetchColors();

  const targetCount = colors.length;
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
    currentCount = colors.length;
    incrementCounter();
  });

  const observerConfig = { childList: true, subtree: true };
  observer.observe(imageContainer, observerConfig);

  const counterInterval = setInterval(incrementCounter, animationDuration / targetCount);
});

// SHOW HELP ON HOVER
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