const ratingFeedback = document.querySelector("#ratingFeedback");
const ratingForm = document.querySelector(".rating__options");
const ratingSection = document.querySelector(".rating");
const thankYouSection = document.querySelector(".rating-thank-you");
const ratingSubmitBtn = document.querySelector(".rating__submit-btn");

// ratingForm.addEventListener("change", (e) => {
//   if (e.target.name === "rating") {
//     ratingFeedback.textContent = `You selected ${e.target.value} out of 5`;
//   }
// });

ratingSubmitBtn.addEventListener("click", () => {
  const selectedInput = document.querySelector("input[name='rating']:checked");

  if (!selectedInput) {
    alert("please select a rating first!");
    return;
  }

  ratingFeedback.textContent = `You selected ${selectedInput.value} out of 5`;
  ratingSection.hidden = true;
  thankYouSection.hidden = false;
});
