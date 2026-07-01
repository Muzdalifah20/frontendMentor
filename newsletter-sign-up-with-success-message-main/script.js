const form = document.querySelector(".form");
const emailInput = document.getElementById("email");
const subscribeBtn = document.querySelector("#subscribeBtn");
const signup = document.querySelector(".signup");
const success = document.querySelector(".success");
const emailErrorP = document.querySelector("#emailError");
const successMessage = document.querySelector("#successMessage");
const dismissmessageBtn = document.querySelector("#dismissmessageBtn");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const emailValue = emailInput.value.trim();
  clearError();
  const emailPattren = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  let isvalidEmail = true;
  if (!emailValue) {
    isvalidEmail = false;
    emailInput.setAttribute("aria-invalid", "true");
    showError("Email can't be empty!");
  } else if (!emailPattren.test(emailValue)) {
    isvalidEmail = false;
    emailInput.setAttribute("aria-invalid", "true");
    showError("Valid email required!");
  } else {
    emailInput.setAttribute("aria-invalid", "false");
    successMessage.textContent = `A confirmation email has been sent to ${emailValue}. Please open it and click the button inside to confirm your subscription.`;

    emailInput.value = "";
    hideSection(signup);
    ShowSection(success);
  }
});

function showError(message) {
  emailErrorP.textContent = message;
  emailErrorP.classList.add("in-valid-message");
  emailInput.classList.add("in-valid");
}

function clearError() {
  emailErrorP.textContent = "";
  emailErrorP.classList.remove("in-valid-message");
  emailInput.classList.remove("in-valid");
}

function ShowSection(section) {
  section.classList.remove("hidden");
}

function hideSection(section) {
  section.classList.add("hidden");
}

emailInput.addEventListener("input", () => {
  emailInput.classList.remove("in-valid");
  clearError();
});

dismissmessageBtn.addEventListener("click", (e) => {
  e.preventDefault();
  ShowSection(signup);
  hideSection(success);
});
