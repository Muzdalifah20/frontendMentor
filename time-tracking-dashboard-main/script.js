const dailyBtn = document.querySelector("#daily");
const weeklyBtn = document.querySelector("#weekly");
const monthlyBtn = document.querySelector("#monthly");

const fetchData = async (timeFrame) => {
  try {
    const response = await fetch("./data.json");
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
  let title;

  if (timeFrame === "daily") {
    time = "Yesterday";
  } else if (timeFrame === "weekly") {
    time = "last Week";
  } else {
    time = "last Month";
  }
  let id = 1;
  data.forEach((item) => {
    const timeTrackTitle = document.querySelector(
      `#tt__card${id} .tt__card-content-title`,
    );
    const timeTrackCurrP = document.querySelector(
      `#tt__card${id} .tt__card-content-result`,
    );
    const timeTrackPrevP = document.querySelector(
      `#tt__card${id} .tt__card-content-status-prev`,
    );

    timeFrameCurr = item.timeframes[timeFrame].current;
    timeFramePrev = item.timeframes[timeFrame].previous;
    const hourStatusCurr = timeFrameCurr === 1 ? "hr" : "hrs";
    const hourStatusPrev = timeFramePrev === 1 ? "hr" : "hrs";

    timeTrackTitle.textContent = item.title;
    timeTrackCurrP.textContent = `${timeFrameCurr}${hourStatusCurr}`;
    timeTrackPrevP.textContent = ` ${time} - ${timeFramePrev}${hourStatusPrev}`;

    id++;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchData("daily");
});
dailyBtn.addEventListener("click", (e) => {
  let timeFrame = e.target.textContent.toLowerCase();
  fetchData(timeFrame);
});
weeklyBtn.addEventListener("click", (e) => {
  let timeFrame = e.target.textContent.toLowerCase();
  fetchData(timeFrame);
});
monthlyBtn.addEventListener("click", (e) => {
  let timeFrame = e.target.textContent.toLowerCase();
  fetchData(timeFrame);
});
