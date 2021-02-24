// utility to check that profanity words are replaced by '***' in string inputs

// add more words to the list as required...
const profanityList = [
  'cake',
  'tea',
  'pastries',
];

// split the input string into words then compare each word to the words in the profanity list
const profFilter = (inputString) => {
  console.log('Input string:', inputString);
  let filteredString = inputString;
  const filteredStringElements = filteredString.split(/[\s,.]+/);
  for (let i = 0; i < filteredStringElements.length; i += 1) {
    for (let j = 0; j < profanityList.length; j += 1) {
      const elementLower = filteredStringElements[i].toLowerCase();
      if (elementLower.includes(profanityList[j])) {
        // replace word in string with lower case equivalent, 'Tea' becomes 'tea'
        filteredString = filteredString.replace(filteredStringElements[i], elementLower);
        // replace lower case equivalent with filter, 'tea' becomes '***'
        filteredString = filteredString.replace(profanityList[j], '***');
      }
    }
  }
  console.log('Filtered string:', filteredString);
  return filteredString;
};

module.exports = {
  profanityFilter: profFilter,
};
