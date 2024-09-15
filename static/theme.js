if (!localStorage.getItem("theme")) {
  localStorage.setItem("theme", "system");
}

const updateTheme = () => {
  switch (localStorage.getItem("theme")) {
    case "system":
      document.getElementById("theme-icon").className = "bi bi-circle-half";
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.body.setAttribute("data-bs-theme", "dark");
      } else {
        document.body.removeAttribute("data-bs-theme");
      }
      break;
    case "dark":
      document.getElementById("theme-icon").className = "bi bi-moon-stars-fill";
      document.body.setAttribute("data-bs-theme", "dark");
      break;
    case "light":
      document.getElementById("theme-icon").className =
        "bi bi-brightness-high-fill";
      document.body.removeAttribute("data-bs-theme");
      break;
    default:
      console.log(`Unknown theme: ${localStorage.getItem("theme")}`);
  }
};

const setTheme = (theme) => {
  localStorage.setItem("theme", theme);
  updateTheme();
};

window.matchMedia("(prefers-color-scheme: dark)").addEventListener(
  "change",
  updateTheme,
);

updateTheme();
