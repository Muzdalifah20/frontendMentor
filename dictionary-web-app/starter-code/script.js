const themes = document.querySelectorAll('input[name="theme"]');
const body = document.body;
console.log(themes);

themes.forEach((theme) => {
  theme.addEventListener("change", () => {
    if (theme.id == "dark") {
      body.className = "";
      body.className = "dark";
      localStorage.setItem("theme", "");
      localStorage.setItem("theme", "dark");
    } else {
      body.className = "";
      body.className = "light";
      localStorage.setItem("theme", "");
      localStorage.setItem("theme", "light");
    }
  });
});

function defaultTheme() {
  if (window.matchMedia("(prefers-color-scheme: dark)")) {
    body.className = "";
    body.className = "dark";
  } else {
    body.className = "";
    body.className = "light";
  }
}

function prefrence() {
  const prefTheme = localStorage.getItem("theme");
  if (prefTheme == "dark") {
    body.className = "";
    body.className = "dark";
  } else {
    body.className = "";
    body.className = "light";
  }
}

addEventListener("DOMContentLoaded", defaultTheme);
addEventListener("DOMContentLoaded", prefrence);
