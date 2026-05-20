const themes = document.querySelectorAll('input[name="theme"]');
const body = document.body;
// console.log(themes);
// const dark = document.querySelector("#dark");
const toggleBtn = document.querySelector(".header__toggle-button");
const toggleBtnackground = document.querySelector(".header__toggle-background");
const wordTitle = document.querySelector("#wordTitle");
const wordPhonotic = document.querySelector("#phonotic");
const wordAudio = document.querySelector("#wordAudio");
const audioBtn = document.querySelector("#audioBtn");
const sourceWindow = document.querySelector("#sourceWindow");
const souceLink = document.querySelector("#souceLink");
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

async function getWordData() {
  let search = "hello";
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${search}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    const wordResult = result[0];

    getPronounciation(wordResult);
    loadSource(wordResult);
    console.log(result[0]);
  } catch (error) {
    console.error(error);
  }
}

function getPronounciation(result) {
  const wordTit = result.word;
  const american = result.phonetics.find(
    (p) => p.audio?.includes("-us") || p.audio?.includes("-au"),
  );

  const british = result.phonetics.find((p) => p.audio?.includes("-uk"));

  let phonotic, audio;
  if (american & american.text) {
    phonotic = american.text;
    audio = american.audio;
  } else if (british & british.text) {
    phonotic = british.text;
    audio = british.audio;
  } else {
    phonotic = american?.text || british?.text || result.phonetics[0]?.text;
    audio = american.audio || british?.audio || result.phonetics[0]?.audio;
  }

  loadWordInfo(wordTit, phonotic, audio);
}

function loadWordInfo(wordTit, phonotic, audio) {
  wordTitle.textContent = wordTit;
  wordPhonotic.textContent = phonotic;
  wordAudio.src = audio;
}

function loadSource(result) {
  const source = result.sourceUrls[0];
  souceLink.href = source;
  souceLink.textContent = source;
}

loadWordInfo();

getWordData();
addEventListener("DOMContentLoaded", preferedTheme);
audioBtn.addEventListener("click", () => {
  if (wordAudio.paused) {
    wordAudio.play();
  } else {
    wordAudio.pause();
  }
});

sourceWindow.addEventListener("click", () => {
  souceLink.click();
});
