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
const sourceSec = document.querySelector("#sourceSec");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const notfoundDv = document.querySelector(".not-found");
const wordInfoDv = document.querySelector(".hero__word-info");
const warningP = document.querySelector(".warning-p");

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

let firstLoad = true;
async function getWordData() {
  let row = searchInput.value.trim();
  if (row == "") {
    if (firstLoad) {
      row = "Keyboard";
    } else {
      searchInput.classList.add("warning");
      warningP.classList.remove("hidden");
      wordInfoDv.style.display = "none";
      meaningsSect.style.display = "none";
      sourceSec.style.display = "none";
      return;
    }
  }

  searchInput.classList.remove("warning");
  warningP.classList.add("hidden");
  wordInfoDv.style.removeProperty("display");
  meaningsSect.style.removeProperty("display");
  sourceSec.style.removeProperty("display");

  let search = row;
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${search}`;

  firstLoad = false;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      notFoundWord();
      throw new Error(`Response status: ${response.status}`);
    }
    foundWord();
    const result = await response.json();
    const wordResult = result[0];

    console.log(wordResult);
    getPronounciation(wordResult);
    getMeanings(wordResult);
    loadSource(wordResult);

    // console.log(result[0]);
  } catch (error) {
    console.error(error);
  }
}
function notFoundWord() {
  notfoundDv.style.display = "block";
  wordInfoDv.style.display = "none";
  meaningsSect.style.display = "none";
  sourceSec.style.display = "none";
}

function foundWord() {
  notfoundDv.style.display = "none";
  wordInfoDv.style.removeProperty("display");
  meaningsSect.style.removeProperty("display");
  sourceSec.style.removeProperty("display");
}

function searchInputValidation() {
  if (searchInput.value.trim() === "") {
    searchInput.classList.add("warning");
    warning.classList.remove("hidden");
    warning.classList.add("warning-p");
    wordInfoDv.style.display = "none";
    meaningsSect.style.display = "none";
    sourceSec.style.display = "none";
  } else {
    searchInput.classList.remove("warning");
    warning.classList.remove("warning-p");
    wordInfoDv.style.removeProperty("display");
    meaningsSect.style.removeProperty("display");
    sourceSec.style.removeProperty("display");
  }
}

function getPronounciation(result) {
  const wordTit = result.word;
  const american = result.phonetics.find(
    (p) => p.audio?.includes("-us") || p.audio?.includes("-au"),
  );

  const british = result.phonetics.find((p) => p.audio?.includes("-uk"));
  // console.log(american);
  let phonotic, audio;
  if (american && american.text) {
    phonotic = american.text;
    audio = american.audio;
  } else if (british && british.text) {
    phonotic = british.text;
    audio = british.audio;
  } else {
    phonotic = american?.text || british?.text || result.phonetics[0]?.text;
    audio = american.audio || british?.audio || result.phonetics[0]?.audio;
  }
  // console.log(phonotic);
  loadWordInfo(wordTit, phonotic, audio);
}

function loadWordInfo(wordTit, phonotic, audio) {
  wordTitle.textContent = wordTit;
  wordPhonotic.textContent = phonotic;
  wordAudio.src = audio;
}

function loadSource(result) {
  const source = result.sourceUrls?.[0];

  souceLink.href = source;
  souceLink.textContent = source;
}

function getMeanings(result) {
  const meanings = result.meanings;
  meaningsSect.replaceChildren();
  let id = 1;
  meanings.forEach((meaning) => {
    const partOfSpeech = meaning.partOfSpeech;

    addMeaningElement(
      "div",
      "part-speech-dv",
      "",
      meaningsSect,
      `partSpeech${id}`,
    );
    const partSpeechDv = document.querySelector(`#partSpeech${id}`);

    addMeaningElement("h2", "part-speech", partOfSpeech, partSpeechDv);
    addMeaningElement("h3", "meaning", "Meaning", partSpeechDv);
    addMeaningElement("ul", "meaning__list", "", partSpeechDv);
    const meaningListUl = partSpeechDv.querySelector(".meaning__list");

    const definitions = meaning.definitions;

    for (let i = 0; i < definitions.length; i++) {
      const definition = definitions[i].definition;

      const example = definitions[i].example;

      addMeaningElement("li", "", definition, meaningListUl);
      const meaningListLi = meaningListUl.children[i + 1];
      if (example) {
        addMeaningElement("span", "example", example, meaningListLi);
      }
    }

    let synonyms = meaning.synonyms.slice(0, 4).join(", ");
    if (synonyms.length > 0) {
      addMeaningElement("div", "synonyms", "", partSpeechDv, `synonyms${id}`);
      const synonymsDv = document.querySelector(`#synonyms${id}`);

      addMeaningElement("h3", "synonyms-word", "Synonyms", synonymsDv);
      addMeaningElement("p", "synonyms-elect", synonyms, synonymsDv);
    }

    id++;

    // while (partspeechDv.firstChild) {
    //   partspeechDv.removeChild(partspeechDv.firstChild);
    // }
  });
  console.log(meanings);
}

function addMeaningElement(tag, className, Content, parentElement, id) {
  if (!parentElement) {
    console.warn("Parent element missing, skipping");
    return;
  }
  const newElement = document.createElement(tag);
  newElement.className = className;
  if (id) {
    newElement.id = id;
  }
  if (Content !== "") {
    newElement.textContent = Content;
  }

  parentElement.appendChild(newElement);
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

searchInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    getWordData();
  }
});

searchBtn.addEventListener("click", () => {
  getWordData();
});
