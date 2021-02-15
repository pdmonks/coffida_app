import AsyncStorage from '@react-native-async-storage/async-storage';

const getItem = async (item) => {
  console.log('Get async-stored item: ', item);
  let retrieveItem = '';
  try {
    retrieveItem = await AsyncStorage.getItem(item);
    if (retrieveItem !== null) {
      console.log('retrieved async-stored value:', retrieveItem);
      // return retrieveItem;
    }
  } catch (e) {
    console.log('Error when getting async-stored item...');
  }
  return retrieveItem;
};

const setItem = async (item, value) => {
  console.log('Set async-stored item:', item, 'to value:', value);
  try {
    await AsyncStorage.setItem(item, value);
    console.log('item:', item, 'stored');
  } catch (e) {
    console.log('Error when getting async-stored item...');
  }
};

module.exports = {
  getAsyncItem: getItem,
  setAsyncItem: setItem,
};
