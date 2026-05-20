const themes = document.querySelectorAll('input[name="theme"]');
const body = document.body;
console.log(themes);
// const dark = document.querySelector("#dark");
const toggleBtn = document.querySelector(".header__toggle-button");
const toggleBtnackground = document.querySelector(".header__toggle-background");
console.log();

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

function toggleBtnDark() {
  toggleBtn.style.left = "calc(100% - 17px)";
  toggleBtnackground.style.backgroundColor = "var(--color-toggle-bg-dark)";
}

function preferedTheme() {
  const prefTheme = localStorage.getItem("theme");
  if (prefTheme) {
    if (prefTheme == "dark") {
      body.className = "";
      body.className = "dark";
      // toggleBtnDark();
    } else {
      body.className = "";
      body.className = "light";
    }
  } else {
    body.className = "";
  }
}

addEventListener("DOMContentLoaded", preferedTheme);
