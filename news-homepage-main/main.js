const btnOpen = document.querySelector("#btnOpen");
const btnClose = document.querySelector("#btnClose");
const mobileTabMedia = window.matchMedia("(width < calc(1200 / 16 * 1rem))");
const topNavMenu = document.querySelector(".topnav__menu");
const mainContent = document.querySelector("#mainContent");
const body = document.querySelector("body");

// https://www.youtube.com/watch?v=pBv7igaxfQE
function setupTopNav(e) {
  if (!topNavMenu) return;
  if (e.matches) {
    topNavMenu.setAttribute("inert", "");
    topNavMenu.classList.add("remove-transition");
  } else {
    topNavMenu.removeAttribute("inert");
    closeMobileMenu();
  }
}

function openMobileMenu() {
  if (!btnOpen) return;
  btnOpen.setAttribute("aria-expanded", "true");
  topNavMenu.removeAttribute("inert");
  topNavMenu.classList.remove("remove-transition");
  mainContent.setAttribute("inert", "");
  bodyScrollLockUpgrade.disableBodyScroll(body);
  btnClose.focus();
}

function closeMobileMenu() {
  if (!btnClose) return;
  btnOpen.setAttribute("aria-expanded", "false");
  // topNavMenu.setAttribute("inert", "");
  mainContent.removeAttribute("inert");
  bodyScrollLockUpgrade.enableBodyScroll(body);
  btnOpen.focus();
  setTimeout(() => {
    topNavMenu.classList.remove("remove-transition");
  }, 500);
}

setupTopNav(mobileTabMedia);

if (btnOpen) {
  btnOpen.addEventListener("click", openMobileMenu);
}

if (btnClose) {
  btnClose.addEventListener("click", closeMobileMenu);
}
mobileTabMedia.addEventListener("change", function (e) {
  setupTopNav(e.target);
});
