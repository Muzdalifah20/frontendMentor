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
const meaningsSect = document.querySelector("#meaningsSect");
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
    getMeanings(wordResult);
    loadSource(wordResult);
    // console.log(result[0]);
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

function getMeanings(result) {
  const meanings = result.meanings;
  meanings.forEach((meaning) => {
    const partOfSpeach = meaning.partOfSpeach;
    addMeaningElement("div", "part-speach-dv", "", meaningsSect);
    const partSpeachDv = document.querySelector(".part-speach-dv");
    addMeaningElement("h2", "part-speach", partOfSpeach, partSpeachDv);
    addMeaningElement("h3", "meaning", "Meaning", partSpeachDv);
    addMeaningElement("ul", "meaning__list", "", partSpeachDv);
    const meaningListUl = partSpeachDv.querySelector(".meaning__list");
    // const meaningListUl = partSpeachDv.querySelector(".meaning__list");
    // console.log(partSpeachDv);
    const definitions = meaning.definitions;
    //  dfLength = definitions.length
    for (let i = 0; i < definitions.length; i++) {
      const definition = definitions[i].definition;

      const example = definitions[i].example;

      addMeaningElement("li", "", definition, meaningListUl);
      const meaningListLi = meaningListUl.children[i + 1];
      if (example) {
        addMeaningElement("span", "example", example, meaningListLi);
      }
    }
    const synonyms = meaning.synonyms;
    // while (partSpeachDv.firstChild) {
    //   partSpeachDv.removeChild(partSpeachDv.firstChild);
    // }
  });
  console.log(meanings);
}

// function addMeaningElement() {
//   const partOfSpeachDv = document.createElement("div");
//   partOfSpeachDv.className = "part-speach-dv";
//   const partSpeachH2 = document.createElement("h2");
//   partSpeachH2.className = "part-speach";
//   const meaningH3 = document.createElement("h3");
//   meaningH3.className = "meaning";
//   const meaningListUl = document.createElement("ul");
//   meaningListUl.className = "meaning__list";
//   const meaningListLi = document.createElement("li");
//   const meaningListLi = document.createElement("h3");
// }

function addMeaningElement(tag, className, Content, parentElement, position) {
  if (!parentElement) {
    console.warn("Parent element missing, skipping");
    return;
  }
  const newElement = document.createElement(tag);
  newElement.className = className;
  if (Content !== "") {
    newElement.textContent = Content;
  }

  // parentElement.insertAdjacentElement(position, newElement);

  if (!position) {
    parentElement.appendChild(newElement);
  }
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
