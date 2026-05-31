const timeFrameBtns = document.querySelectorAll(".tt__heading-btn");

const fetchData = async (timeFrame) => {
  try {
    const response = await fetch("./assets/data/data.json");
    if (!response.ok)
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`,
      );
    const data = await response.json();

    getTimeTrackData(data, timeFrame);
    return data;
  } catch (error) {
    console.error(error.message);
  }
};

function getTimeTrackData(data, timeFrame) {
  let time;

  if (timeFrame === "daily") {
    time = "Yesterday";
  } else if (timeFrame === "weekly") {
    time = "last Week";
  } else {
    time = "last Month";
  }

  const cards = document.querySelectorAll(".tt__card");
  data.forEach((item, index) => {
    const card = cards[index];

    if (!card) return;

    const timeTrackTitle = card.querySelector(".tt__card-content-title");
    const timeTrackCurrP = card.querySelector(".tt__card-content-result");
    const timeTrackPrevP = card.querySelector(".tt__card-content-status-prev");

    if (!timeTrackTitle || !timeTrackCurrP || !timeTrackPrevP) return;

    const timeFrameCurr = item.timeframes?.[timeFrame]?.current;
    const timeFramePrev = item.timeframes?.[timeFrame]?.previous;

    const hourStatusCurr = timeFrameCurr === 1 ? "hr" : "hrs";
    const hourStatusPrev = timeFramePrev === 1 ? "hr" : "hrs";

    timeTrackTitle.textContent = item.title;
    timeTrackCurrP.textContent = `${timeFrameCurr}${hourStatusCurr}`;
    timeTrackPrevP.textContent = ` ${time} - ${timeFramePrev}${hourStatusPrev}`;
  });
}

function setActiveTimeFrame(timeFrame) {
  timeFrameBtns.forEach((btn) => {
    const btnTimeFrame = btn.dataset.timeframe;
    btn.setAttribute(
      "aria-pressed",
      btnTimeFrame === timeFrame ? "true" : "false",
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchData("daily");
});

timeFrameBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const timeFrame = btn.dataset.timeframe;

    fetchData(timeFrame);
    setActiveTimeFrame(timeFrame);
  });
});
