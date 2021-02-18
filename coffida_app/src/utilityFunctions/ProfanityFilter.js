// add more words to the list as required...
const profanityList = [
  'cake',
  'tea',
  'pastries',
];

const profFilter = (review) => {
  console.log('Input string:', review);
  let filteredString = review;
  const filteredStringElements = filteredString.split(/[\s,.]+/);
  for (let i = 0; i < filteredStringElements.length; i += 1) {
    for (let j = 0; j < profanityList.length; j += 1) {
      const elementLower = filteredStringElements[i].toLowerCase(); // convert to lower case
      if (elementLower.includes(profanityList[j])) {
        filteredString = filteredString.replace(filteredStringElements[i], elementLower); // replace word in string with lower case equivalent, 'Tea' becomes 'tea'
        filteredString = filteredString.replace(profanityList[j], '***'); // replace lower case equivalent with filter, 'tea' becomes '***'
      }
    }
  }
  console.log('Filtered string:', filteredString);
  return filteredString;
};

module.exports = {
  profanityFilter: profFilter,
};
