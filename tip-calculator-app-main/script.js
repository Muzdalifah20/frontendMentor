const amountInput = document.querySelector("#bill");

const amountInputValue = amountInput.value;
const peopleNumberInput = document.querySelector("#peopleNumber");
const invalidPeopeSpan = document.querySelector("#invalidPeope");
const invalidBillSpan = document.querySelector("#invalidBill");

const resetBtn = document.querySelector("#resetBtn");
const customInput = document.querySelector("#customInput");
const tipAmountP = document.querySelector(
  ".tip-calculator__result-amount-value",
);
const tipBtns = document.querySelectorAll(".tip-calculator__btn");

const tipTotalP = document.querySelector(".tip-calculator__result-total-value");

let currentTip = 0;

function tipFormula(amount = 0, percent = 1) {
  return Math.round(((amount * percent) / 100) * 100) / 100;
}

function tipAmontPerPerson(amount = 0, percent, numPeople = 1) {
  const tipAmount = tipFormula(amount, percent) / numPeople;
  const rounded = Math.round(tipAmount * 100) / 100;
  return rounded.toFixed(2);
}

function tipTotalPerPerson(amount = 0, percent, numPeople = 1) {
  const total = Number(amount) + tipFormula(amount, percent);
  const rounded = Math.round((total / numPeople) * 100) / 100;
  return rounded.toFixed(2);
}

function resetInput(input) {
  input.placeholder = `0`;
  input.value = "";
  input.classList.remove("in-valid");
}

function resetElement(element) {
  element.textContent = "$0.00";
}

function resetCustom(element) {
  element.value = "";
  element.placeholder = "Custom";
}

function getTip(e) {
  const tip = e.target.dataset.tipPercentage;
  return Number(tip);
}

function updateTipResultUi(element, result) {
  return (element.textContent = `$${result}`);
}

function validateInput(input, messageElement, inputElement) {
  let message;
  if (input === 0 || input === "") {
    message = "Can't be zero";
    invalidMessage(messageElement, inputElement, message);
    return false;
  }
  if (Number.isNaN(input)) {
    message = "Input must be number";
    invalidMessage(messageElement, inputElement, message);
    return false;
  }

  if (input < 0) {
    message = "Can't be negative number";
    invalidMessage(messageElement, inputElement, message);
    return false;
  }
  validlMessage(messageElement, inputElement);
  return true;
}

function invalidMessage(element, inputElement, message) {
  element.classList.remove("hidden");
  element.classList.add("in-valid-span");
  inputElement.classList.add("in-valid");

  element.textContent = message;
}

function validlMessage(element, inputElement) {
  element.classList.remove("in-valid-span");
  inputElement.classList.remove("in-valid");
  element.textContent = "";
}

function getCustomBtnTip(e) {
  const tipCustom = Number(e.target.value);
  return tipCustom;
}

tipBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let tip = getTip(e);
    currentTip = tip;

    if (!tip) return;
    const billAmount = Number(amountInput.value);
    const peopleNumber = Number(peopleNumberInput.value);

    const billValid = validateInput(billAmount, invalidBillSpan, amountInput);
    const peopleValid = validateInput(
      peopleNumber,
      invalidPeopeSpan,
      peopleNumberInput,
    );

    if (!billValid || !peopleValid) return;

    updateTipResultUi(
      tipAmountP,
      tipAmontPerPerson(billAmount, tip, peopleNumber),
    );
    updateTipResultUi(
      tipTotalP,
      tipTotalPerPerson(billAmount, tip, peopleNumber),
    );
  });
});

customInput.addEventListener("input", (e) => {
  let tip = getCustomBtnTip(e);
  currentTip = tip;

  const billAmount = Number(amountInput.value);
  const peopleNumber = Number(peopleNumberInput.value);

  if (tip < 0) return;
  const billValid = validateInput(billAmount, invalidBillSpan, amountInput);
  const peopleValid = validateInput(
    peopleNumber,
    invalidPeopeSpan,
    peopleNumberInput,
  );

  if (!billValid || !peopleValid) return;

  updateTipResultUi(
    tipAmountP,
    tipAmontPerPerson(billAmount, tip, peopleNumber),
  );
  updateTipResultUi(
    tipTotalP,
    tipTotalPerPerson(billAmount, tip, peopleNumber),
  );
});

amountInput.addEventListener("input", (e) => {
  const billAmount = Number(amountInput.value);
  const peopleNumber = Number(peopleNumberInput.value);

  const billValid = validateInput(billAmount, invalidBillSpan, amountInput);
  const peopleValid = validateInput(
    peopleNumber,
    invalidPeopeSpan,
    peopleNumberInput,
  );

  if (!billValid || !peopleValid) return;
  if (currentTip <= 0) return;

  updateTipResultUi(
    tipAmountP,
    tipAmontPerPerson(billAmount, currentTip, peopleNumber),
  );
  updateTipResultUi(
    tipTotalP,
    tipTotalPerPerson(billAmount, currentTip, peopleNumber),
  );
});

peopleNumberInput.addEventListener("input", (e) => {
  const billAmount = Number(amountInput.value);
  const peopleNumber = Number(peopleNumberInput.value);

  const billValid = validateInput(billAmount, invalidBillSpan, amountInput);
  const peopleValid = validateInput(
    peopleNumber,
    invalidPeopeSpan,
    peopleNumberInput,
  );

  if (!billValid || !peopleValid) return;
  if (currentTip <= 0) return;

  updateTipResultUi(
    tipAmountP,
    tipAmontPerPerson(billAmount, currentTip, peopleNumber),
  );
  updateTipResultUi(
    tipTotalP,
    tipTotalPerPerson(billAmount, currentTip, peopleNumber),
  );
});

resetBtn.addEventListener("click", (e) => {
  resetElement(tipAmountP);
  resetElement(tipTotalP);
  resetInput(amountInput);
  resetInput(peopleNumberInput);
  resetCustom(customInput);
  invalidBillSpan.classList.remove("in-valid-span");

  invalidPeopeSpan.classList.remove("in-valid-span");

  currentTip = 0;
});
