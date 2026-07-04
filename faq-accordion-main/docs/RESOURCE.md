# make image part of background

https://codepen.io/gc-nomade/pen/GqyxvX

# accessible accordion

https://www.aditus.io/patterns/accordion/

https://www.w3.org/WAI/ARIA/apg/patterns/accordion/examples/accordion/

# selecting techniques

1 - let target = accordionHeader.parentElement.nextElementSibling;
2 - const panelId = accordionHeader.getAttribute("aria-controls");
const target = document.getElementById(panelId);
