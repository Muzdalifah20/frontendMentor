const slider = document.querySelector("#passwordLenghtInput");
const sliderValue = document.querySelector("#passwordLengthValue");

function passwordLength(e) {
  sliderValue.textContent = e.target.value;
}

function handleSlider(e) {
  const min = slider.min || 0;
  const max = slider.max || 20;
  const pct = ((e.target.value - min) / (max - min)) * 100;
  e.target.style.setProperty("--range-pct", pct + "%");
}
slider.addEventListener("input", (e) => {
  passwordLength(e);
  handleSlider(e);
});

// const handleInput = (el) => {
//   const min = el.min || 0;
//   const max = el.max || 100;
//   const pct = ((el.value - min) / (max - min)) * 100;
//   el.style.setProperty("--range-pct", pct + "%");
// };

// slider.addEventListener("input", (e) => handleInput(e.target));
// handleInput(slider);
