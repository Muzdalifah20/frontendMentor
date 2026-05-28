const form = document.querySelector(".form");
const email = document.getElementById("email");
const subscribeBtn = document.querySelector("#subscribeBtn");
const signup = document.querySelector(".signup");
const success = document.querySelector(".success");
const inValidP = document.querySelector("#inValid");
const dismissmessageBtn = document.querySelector("#dismissmessageBtn");
// console.log(emailInput);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const emailValue = email.value.trim();

  let isvalid = true;

  const pattren = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!emailValue) {
    isvalid = false;
    inValidP.textContent = "";
    inValidP.textContent = "Email can't be empty!";
    inValidP.style.color = "var(--color-invalid)";
    inputStyle();
  } else if (!pattren.test(emailValue)) {
    isvalid = false;
    inValidP.textContent = "";
    inValidP.textContent = "Valid email required!";
    inValidP.style.color = "var(--color-invalid)";
    inputStyle();
  } else {
    inValidP.textContent = "";
    email.value = "";
    successStyle();
  }

  function inputStyle() {
    email.classList.add("in-valid");
  }

  function successStyle() {
    signup.style.display = "none";
    success.style.display = "block";
  }
});

email.addEventListener("input", () => {
  email.classList.remove("in-valid");
});

dismissmessageBtn.addEventListener("click", (e) => {
  e.preventDefault();
  signup.style.display = "block";
  success.style.display = "none";
});
