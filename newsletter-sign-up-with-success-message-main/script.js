const form = document.querySelector(".form");
const email = document.getElementById("email");
const subscribeBtn = document.querySelector("#subscribeBtn");
const signup = document.querySelector(".signup");
const success = document.querySelector(".success");
const inValidP = document.querySelector("#inValid");
const successMessage = document.querySelector("#successMessage");
const dismissmessageBtn = document.querySelector("#dismissmessageBtn");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const emailValue = email.value.trim();
  clearError();
  const emailPattren = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  let isvalid = true;
  if (!emailValue) {
    isvalid = false;

    showError("Email can't be empty!");
  } else if (!emailPattren.test(emailValue)) {
    isvalid = false;

    showError("Valid email required!");
  } else {
    successMessage.textContent = `A confirmation email has been sent to ${emailValue}. Please open it and click the button inside to confirm your subscription.`;

    email.value = "";
    successStyle();
  }
});

function showError(message) {
  inValidP.textContent = message;
  inValidP.classList.add("in-valid-message");
  email.classList.add("in-valid");
}

function clearError() {
  inValidP.textContent = "";
  inValidP.classList.remove("in-valid-message");
  email.classList.remove("in-valid");
}

function successStyle() {
  signup.style.display = "none";
  success.style.display = "block";
}

email.addEventListener("input", () => {
  email.classList.remove("in-valid");
  clearError();
});

dismissmessageBtn.addEventListener("click", (e) => {
  e.preventDefault();
  signup.style.display = "block";
  success.style.display = "none";
});
