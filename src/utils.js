export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const renderElement = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component);
      break;
    case RenderPosition.BEFOREEND:
      container.append(component);
      break;
  }
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

export const addZero = (value) => {
  if (value === 0) {
    return `00`;
  } else if (value < 10) {
    return `0${value}`;
  }

  return value;
};
