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
const customSelect = document.querySelector(".custom-select");
const selectTrigger = document.querySelector(".select-trigger");
const optionsList = document.querySelector(".options-list");
const options = document.querySelectorAll(".options-list li");

let isOpen = false;

function toggleOptionsList() {
  // https://codeaccessible.com/codepatterns/custom-select/
  isOpen = !isOpen;

  if (isOpen) {
    optionsList.style.display = "block";
    selectTrigger.setAttribute("aria-expanded", "true");
    optionsList.setAttribute("aria-hidden", "false");

    // Set tabindex for options and focus the options list
    optionsList.querySelectorAll("li").forEach((option) => {
      option.setAttribute("tabindex", "0");
    });

    optionsList.focus();
    optionsList.addEventListener("keydown", collapseOnEscape);
    optionsList.addEventListener("keydown", navigateOptions);
    customSelect.addEventListener("focusout", collapseDropdown);
  } else {
    optionsList.style.display = "none";
    selectTrigger.setAttribute("aria-expanded", "false");
    optionsList.setAttribute("aria-hidden", "true");

    // Reset tabindex for options and focus selectTrigger
    optionsList.querySelectorAll("li").forEach((option) => {
      option.setAttribute("tabindex", "-1");
    });

    selectTrigger.focus();
  }
}

function collapseOnEscape(event) {
  if (event.key === "Escape") {
    isOpen = false;
    optionsList.style.display = "none";
    selectTrigger.setAttribute("aria-expanded", "false");
    selectTrigger.focus();
  }
}

function navigateOptions(event) {
  const focusedIndex = Array.from(options).indexOf(document.activeElement);
  if (event.key === "ArrowDown") {
    event.preventDefault();
    const previousIndex = (focusedIndex - 1 + options.length) % options.length;
    options[previousIndex].focus();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    const nextIndex = (focusedIndex + 1) % options.length;
    options[nextIndex].focus();
  }
}

function collapseDropdown(event) {
  if (!event.relatedTarget || !optionsList.contains(event.relatedTarget)) {
    isOpen = false;
    optionsList.style.display = "none";
    selectTrigger.setAttribute("aria-expanded", "false");
    selectTrigger.focus();
  }
}

selectTrigger.addEventListener("click", toggleOptionsList);

optionsList.addEventListener("keydown", trapFocus);

options.forEach((option) => {
  option.addEventListener("click", () => {
    selectOption(option);
  });
  option.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      selectOption(option);
    } else if (event.key === "ArrowDown") {
      navigateOptions(event);
    } else if (event.key === "ArrowUp") {
      navigateOptions(event);
    } else if (event.key === "Escape") {
      toggleOptionsList();
    }
  });
});

function selectOption(option) {
  const font = option.dataset.font;

  selectTrigger.querySelector("#selectedOption").innerText = option.innerText;
  options.forEach((opt) => {
    opt.setAttribute("aria-selected", "false");
  });
  option.setAttribute("aria-selected", "true");
  // update body font
  document.body.style.fontFamily = "";
  if (font) {
    document.body.style.fontFamily = `var(--ff-${font})`;
  }
  setTimeout(() => {
    toggleOptionsList();
  }, 100);
}

function trapFocus(event) {
  const focusableElements = optionsList.querySelectorAll("li");
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  const isTabPressed = event.key === "Tab" || event.keyCode === 9;

  if (!isTabPressed) {
    return;
  }

  if (event.shiftKey) {
    if (document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    }
  } else {
    if (document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  }
}

console.log();
themes.forEach((theme) => {
  theme.addEventListener("change", () => {
    if (theme.id == "dark") {
      body.className = "";
      body.className = "dark";
      localStorage.setItem("theme", "");
      localStorage.setItem("theme", "dark");
      localStorage.setItem("hasShadow", "true");
    } else {
      body.className = "";
      body.className = "light";
      localStorage.setItem("theme", "");
      localStorage.setItem("theme", "light");
      localStorage.setItem("hasShadow", "false");
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
      optionsList.classList.add("has-shadow");

      // toggleBtnDark();
    } else {
      body.className = "";
      body.className = "light";
      optionsList.classList.remove("has-shadow");
    }
  } else {
    body.className = "";
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      optionsList.classList.add("has-shadow");
    } else {
      optionsList.classList.remove("has-shadow");
    }
  }
}

function saveShodowState() {
  localStorage.setItem("hasShadow");
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

// let headerCustomSelect,
//   i,
//   j,
//   headerCustomSelectLenght,
//   selElmntLenght,
//   selElmnt,
//   dvA,
//   dvB,
//   dvC;

// headerCustomSelect = document.querySelectorAll(".header__custom-select");

// headerCustomSelectLenght = headerCustomSelect.length;

// for (i = 0; i < headerCustomSelectLenght; i++) {
//   selElmnt = headerCustomSelect[i].getElementsByTagName("select")[0];
//   selElmntLenght = selElmnt.length;

//   dvA = document.createElement("div");
//   dvA.setAttribute("class", "header__select-selected");
//   dvA.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
//   headerCustomSelect.appendChild(dvA);
// }
