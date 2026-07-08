const form = document.querySelector("form");
const successMessageSection = document.querySelector(
  ".success-message__section",
);
const firstName = form.querySelector("#firstName");
const lastName = form.querySelector("#lastName");
const email = form.querySelector("#email");
const consentCheckbox = form.querySelector("#consent");
const message = form.querySelector("#message");
const queryTypes = form.querySelectorAll('input[name="queryType"]');

function showErrorMessage(input, message) {
  const errorEL = document.querySelector(`#${input.id}Validation`);
  if (errorEL) {
    errorEL.textContent = message;
    errorEL.classList.add("in-valid");
    input.setAttribute("aria-invalid", "true");
  }
}

function clearErrorMessage(input) {
  const errorEL = document.querySelector(`#${input.id}Validation`);
  if (errorEL) {
    errorEL.textContent = "";
    errorEL.classList.remove("in-valid");
    input.setAttribute("aria-invalid", "false");
  }
}

function clearRadioErrorMessage() {
  const checked = Array.from(radios).some((radio) => radio.checked);
  const errorEl = form.querySelector("#radioValidation");
  if (checked) {
    errorEl.textContent = "";
    errorEl.classList.remove("in-valid");
    radios[0].setAttribute("aria-invalid", "false");
    return false;
  }
}

function validateText(input) {
  if (!input) return;
  if (input.value.trim() === "") {
    showErrorMessage(input, `This field is required`);
    return false;
  }
  clearErrorMessage(input);
  return true;
}
function validateCheckBox(input) {
  if (!input) return;
  if (!input.checked) {
    showErrorMessage(input, `Please consent to being contacted`);
    return false;
  }
  clearErrorMessage(input);
  return true;
}

function validateEmail(input) {
  if (!input) return;
  if (!input.validity.valid) {
    showErrorMessage(input, `Please enter a valid email address`);
    return false;
  }
  clearErrorMessage(input);
  return true;
}

function validateRadio(radios) {
  const checked = Array.from(radios).some((radio) => radio.checked);
  const errorEl = form.querySelector("#radioValidation");
  if (!checked) {
    errorEl.textContent = "Please select a query type";
    errorEl.classList.add("in-valid");
    radios[0].setAttribute("aria-invalid", "true");
    return false;
  }

  errorEl.textContent = "";
  errorEl.classList.remove("in-valid");
  radios[0].setAttribute("aria-invalid", "false");
  return true;
}

function hideSuccessMessageSection() {
  successMessageSection.hidden = true;
}

function allValidInput() {
  return (
    validateText(firstName) &&
    validateText(lastName) &&
    validateText(email) &&
    validateText(message) &&
    validateEmail(email) &&
    validateCheckBox(consentCheckbox) &&
    validateRadio(queryTypes)
  );
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const allValid = allValidInput();

  if (allValid) {
    form.reset();
    successMessageSection.hidden = false;
  }
});

firstName.addEventListener("blur", () => validateText(firstName));
lastName.addEventListener("blur", () => validateText(lastName));
email.addEventListener("blur", () => validateEmail(email));
message.addEventListener("blur", () => validateText(message));
consent.addEventListener("blur", () => validateCheckBox(consent));

queryTypes.forEach((radio) => {
  radio.addEventListener("blur", () => validateRadio(queryTypes));
  radio.addEventListener("change", () => validateRadio(queryTypes));
});

firstName.addEventListener("input", (e) => {
  clearErrorMessage(e.target);
  hideSuccessMessageSection();
});
lastName.addEventListener("input", (e) => {
  clearErrorMessage(e.target);
  hideSuccessMessageSection();
});
email.addEventListener("input", (e) => {
  clearErrorMessage(e.target);
  hideSuccessMessageSection();
});
message.addEventListener("input", (e) => {
  clearErrorMessage(e.target);
  hideSuccessMessageSection();
});
consent.addEventListener("input", (e) => {
  clearErrorMessage(e.target);
  hideSuccessMessageSection();
});
