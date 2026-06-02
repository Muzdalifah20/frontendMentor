const billInput = document.querySelector("#bill");
const peopleInput = document.querySelector("#peopleNumber");
const invalidPeopeSpan = document.querySelector("#invalidPeople");
const invalidBillSpan = document.querySelector("#invalidBill");

const resetBtn = document.querySelector("#resetBtn");
const customTipInput = document.querySelector("#customInput");
const tipAmountDisplay = document.querySelector(
  ".tip-calculator__result-amount-value",
);
const tipTotalDisplay = document.querySelector(
  ".tip-calculator__result-total-value",
);
const tipBtns = document.querySelectorAll(".tip-calculator__btn");

let currentTipPercentage = 0;

function calculateTipAmount(billAmount = 0, tipPercentage = 1) {
  return Math.round(((billAmount * tipPercentage) / 100) * 100) / 100;
}

function calculateTipAmontPerPerson(
  billAmount = 0,
  tipPercentage,
  numPeople = 1,
) {
  const totalTip = calculateTipAmount(billAmount, tipPercentage);
  const tipPerPerson = totalTip / numPeople;
  return Math.round(tipPerPerson * 100) / 100;
}

function calculateTotalPerPerson(billAmount = 0, tipPercentage, numPeople = 1) {
  const totalTip = calculateTipAmount(billAmount, tipPercentage);
  const total = Number(billAmount) + totalTip;
  const perPerson = total / numPeople;
  return Math.round(perPerson * 100) / 100;
}

// format currency & update its Ui
function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function updateDisplay(element, value) {
  element.textContent = formatCurrency(value);
}

// Reset Dispaly helper
function clearDisplay(element) {
  element.textContent = formatCurrency(0);
}

function clearDisplayInput(input) {
  input.placeholder = `0`;
  input.value = "";
  input.classList.remove("validation__input-outline");
}

function clearCustomDisplay(element) {
  element.value = "";
  element.placeholder = "Custom";
}

//  validation helper

function validateInput(input, messageElement, inputElement) {
  if (input === 0 || input === "") {
    showInvalidMessage(messageElement, inputElement, "Can't be zero");
    return false;
  }
  if (Number.isNaN(input)) {
    showInvalidMessage(messageElement, inputElement, "Input must be number");
    return false;
  }

  if (input < 0) {
    showInvalidMessage(messageElement, inputElement, "Can't be negative");
    return false;
  }

  clearInvalidlMessage(messageElement, inputElement);
  return true;
}

function getInputValue(input) {
  return Number(input.value);
}

function showInvalidMessage(messageElement, inputElement, message) {
  messageElement.classList.remove("hidden");
  messageElement.classList.add("validation__message");
  inputElement.classList.add("validation__input-outline");
  messageElement.textContent = message;
}

function clearInvalidlMessage(messageElement, inputElement) {
  messageElement.classList.remove("validation__message");
  inputElement.classList.remove("validation__input-outline");
  messageElement.textContent = "";
}

function getTip(e) {
  const tip = e.target.dataset.tipPercentage;
  return Number(tip);
}

function getCustomBtnTip(e) {
  const tipCustom = Number(e.target.value);
  return tipCustom;
}

function recalculatetipResults() {
  const billAmount = getInputValue(billInput);
  const peopleNumber = getInputValue(peopleInput);

  const isBillValid = validateInput(billAmount, invalidBillSpan, billInput);
  const isPeopleValid = validateInput(
    peopleNumber,
    invalidPeopeSpan,
    peopleInput,
  );

  if (!isBillValid || !isPeopleValid) return;

  if (currentTipPercentage <= 0) return;

  const tipPerPerson = calculateTipAmontPerPerson(
    billAmount,
    currentTipPercentage,
    peopleNumber,
  );
  const totalperPerson = calculateTotalPerPerson(
    billAmount,
    currentTipPercentage,
    peopleNumber,
  );

  updateDisplay(tipAmountDisplay, tipPerPerson);
  updateDisplay(tipTotalDisplay, totalperPerson);
}

function handleTipBtnsClick(e) {
  let tipPercentage = getTip(e);
  if (!tipPercentage) return;

  currentTipPercentage = tipPercentage;
  recalculatetipResults();
}

function handleCustomTipInput(e) {
  let tipPercentage = getCustomBtnTip(e);
  if (!tipPercentage || tipPercentage < 0) return;

  currentTipPercentage = tipPercentage;
  recalculatetipResults();
}

function handleTipInput() {
  recalculatetipResults();
}

resetBtn.addEventListener("click", (e) => {
  clearDisplay(tipAmountDisplay);
  clearDisplay(tipTotalDisplay);
  clearDisplayInput(billInput);
  clearDisplayInput(peopleInput);
  clearCustomDisplay(customTipInput);

  invalidBillSpan.classList.remove("validation__message");
  invalidPeopeSpan.classList.remove("validation__message");

  currentTipPercentage = 0;
});

tipBtns.forEach((btn) => {
  btn.addEventListener("click", handleTipBtnsClick);
});
customTipInput.addEventListener("input", handleCustomTipInput);
billInput.addEventListener("input", handleTipInput);
peopleInput.addEventListener("input", handleTipInput);
