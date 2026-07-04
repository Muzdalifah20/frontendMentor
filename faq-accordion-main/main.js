const accordionHeaders = document.querySelectorAll("[data-accordion-header]");

accordionHeaders.forEach((accordionHeader) => {
  const panelId = accordionHeader.getAttribute("aria-controls");
  const target = document.getElementById(panelId);
  accordionHeader.addEventListener("click", () => {
    const faqsAccordinBtnIcon = accordionHeader.querySelector(
      ".faqs-accordion__plus-minus-icon",
    );
    let expanded = accordionHeader.getAttribute("aria-expanded") === "true";
    accordionHeader.setAttribute("aria-expanded", String(!expanded));
    target.hidden = expanded;
    accordionBtnIconState(faqsAccordinBtnIcon, expanded);
  });
});

function accordionBtnIconState(element, status) {
  if (status) {
    element.src = "./assets/images/icon-plus.svg";
  } else {
    element.src = "./assets/images/icon-minus.svg";
  }
}
