const CARDS_AMOUNT = 20;
const OFFERS_AMOUNT = 3;

const offers = [
  {
    name: `Add luggage`,
    type: `luggage`,
    price: 30,
    checked: true
  },
  {
    name: `Switch to comfort class`,
    type: `comfort`,
    price: 100,
    checked: true
  },
  {
    name: `Add meal`,
    type: `meal`,
    price: 15,
    checked: false
  },
  {
    name: `Choose seats`,
    type: `seats`,
    price: 5,
    checked: false
  },
  {
    name: `Travel by train`,
    type: `train`,
    price: 40,
    checked: false
  }
];

const cities = [`Amsterdam`, `Geneva`, `Chaomix`, `Saint Petersburg`];

const types = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`,
  `Check-in`,
  `Sightseeing`,
  `Restaurant`
];

const sentences = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`, `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getRandomPhoto = () => `http://picsum.photos/248/152?r=${Math.random()}`;

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const getRandomArrayItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomDescription = () =>
  shuffleArray(sentences)
    .slice(0, getRandomNumber(1, 4))
    .join(` `);

const getRandomDate = () => {
  return (
    Date.now() + 1 +
    Math.floor(Math.random() * 7) * 24 * getRandomNumber(0, 60) * 60 * 1000
  );
};

const generateCard = () => {
  const startDate = getRandomDate();
  const endDate = getRandomDate();
  return {
    id: String(Date.now() + Math.random()),
    type: getRandomArrayItem(types),
    city: getRandomArrayItem(cities),
    startDate: Math.min(startDate, endDate),
    endDate: Math.max(startDate, endDate),
    offers: shuffleArray(offers).slice(0, OFFERS_AMOUNT),
    photos: Array(5)
      .fill(``)
      .map(getRandomPhoto),
    description: getRandomDescription(),
    price: getRandomNumber(10, 100),
    isFavorite: false
  };
};

const generateCards = (amount) => {
  return Array(amount)
  .fill(``)
  .map(() => generateCard())
  .sort(
      (currentCard, nextCard) => currentCard.startDate - nextCard.startDate
  );
};

export const cards = generateCards(CARDS_AMOUNT);
