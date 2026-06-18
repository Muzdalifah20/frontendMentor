const slider = document.querySelector("#passwordLengthInput");
const sliderValue = document.querySelector("#passwordLengthValue");
const checkBoxes = document.querySelectorAll("input[name='char']");
const passwordGeneratorBtn = document.querySelector("#passwordGeneratorBtn");
const passwordDisplay = document.querySelector("#passwordDisplay");
const copyIconBtn = document.querySelector(".password-display__copy-btn");
const copyIcon = document.querySelector("#copyIcon");
const strengthValueP = document.querySelector("#strengthValueP");
const optionsStrengthSquares = document.querySelector(
  ".options-strength__squares"
);
const passwordCopiedMessage = document.querySelector(
  ".password-display__copy-message"
);

function passwordLength() {
  if (!slider) return;
  return slider.value;
}

function updatePasswordLength(e) {
  sliderValue.textContent = e.target.value;
}

function handleSlider(e) {
  if (!slider) return;
  const min = slider.min || 0;
  const max = slider.max || 20;
  const pct = ((e.target.value - min) / (max - min)) * 100;
  e.target.style.setProperty("--range-pct", pct + "%");
}

function getRandomCharacter(availableCharacters) {
  const charactersLength = availableCharacters.length;

  const randomIndex = Math.floor(Math.random() * charactersLength);

  return availableCharacters[randomIndex];
}

let generatedPasswordValue;
function generatePassword() {
  let charctersArray = [];
  const passwordLengthValue = Number(passwordLength());
  if (passwordLengthValue === 0) return;

  let { availableCharacters, charactersRange } = getCharTypes();
  for (let i = 0; i < passwordLengthValue; i++) {
    charctersArray[i] = getRandomCharacter(availableCharacters);
  }

  generatedPasswordValue = passwordDisplay.textContent =
    charctersArray.join("");
  passwordDisplay.classList.add("active");
  passwordEntropy(passwordLengthValue, charactersRange);
}

function getCheckedBoxes() {
  let checkedValue = [];
  checkBoxes.forEach((checkBox) => {
    if (checkBox.checked) checkedValue.push(checkBox.value);
  });

  return checkedValue;
}

function getCharTypes() {
  let checkedBoxes = getCheckedBoxes();
  function charType(type) {
    return checkedBoxes.includes(type) ? type : "";
  }

  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  let availableCharacters = "";
  let charactersRange = 0;

  if (charType("upperCase")) {
    availableCharacters += upperCase;
    charactersRange += 26;
  }
  if (charType("lowerCase")) {
    availableCharacters += lowerCase;
    charactersRange += 26;
  }
  if (charType("numbers")) {
    availableCharacters += numbers;
    charactersRange += 10;
  }
  if (charType("symbols")) {
    availableCharacters += symbols;
    charactersRange += 32;
  }
  if (availableCharacters === "") {
    availableCharacters += upperCase;
    charactersRange += 26;
  }

  return {
    availableCharacters: availableCharacters,
    charactersRange: charactersRange,
  };
}

function showCopyMessage() {
  passwordCopiedMessage.classList.remove("hidden");
}
function hideCopyMessage() {
  passwordCopiedMessage.classList.add("hidden");
}

function handleCopy(generatedPasswordValue) {
  if (generatedPasswordValue === undefined) return;
  if (!navigator || !navigator.clipboard) return;
  navigator.clipboard
    .writeText(generatedPasswordValue)
    .then(showCopyMessage)
    .catch((error) => {
      alert("Failed to Copy to clipboard. Please copy manually!");
    });
}

function passwordEntropy(passwordLengthValue, charactersRange) {
  const passwordEntropyValue =
    Math.round(passwordLengthValue * Math.log2(charactersRange) * 10) / 10;
  passwordStrength(passwordEntropyValue);
}

function passwordStrength(passwordEntropyValue) {
  resetStrengthLevel("strong");
  resetStrengthLevel("medium");
  resetStrengthLevel("weak");
  resetStrengthLevel("too-weak");

  if (passwordEntropyValue <= 24) {
    showStrengthLevel("Too weak!", "too-weak");
  } else if (passwordEntropyValue < 50) {
    showStrengthLevel("weak", "weak");
  } else if (passwordEntropyValue < 75) {
    showStrengthLevel("medium", "medium");
  } else {
    showStrengthLevel("strong", "strong");
  }
}

function resetStrengthLevel(strengthLevelClass) {
  if (!optionsStrengthSquares) return;
  optionsStrengthSquares.classList.remove(strengthLevelClass);
}

function showStrengthLevel(strengthLevelText, strengthLevelClass) {
  if (!optionsStrengthSquares || !strengthValueP) return;
  strengthValueP.textContent = strengthLevelText;
  optionsStrengthSquares.classList.add(strengthLevelClass);
}

if (slider) {
  slider.addEventListener("input", (e) => {
    updatePasswordLength(e);
    handleSlider(e);
  });
}

if (passwordGeneratorBtn) {
  passwordGeneratorBtn.addEventListener("click", (e) => {
    e.preventDefault();
    hideCopyMessage();
    generatePassword();
  });
}

if (copyIconBtn) {
  copyIcon.addEventListener("click", () => {
    handleCopy(generatedPasswordValue);
  });
}
