export const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;

  return element.firstChild;
};

export const parseTime = (UTCTime) => {
  const date = new Date(UTCTime);
  return `${date.getHours()}:${date.getMinutes()}`;
};

export const parseDate = (UTCTime) => {
  const date = new Date(UTCTime);
  return `${date.getDate()}/${date.getMonth()}/${String(date.getFullYear())
    .slice(2)}`;
};
