import { getAsyncItem } from '../asyncStorage/AsyncUtilities';

const checkLogin = async (props) => {
  let loggedIn = false;
  console.log('checking if user is logged in...');
  const token = await getAsyncItem('@token');
  const { navigation } = props;
  if (token == null) {
    console.log('user is not logged in');
    navigation.navigate('Login');
  } else {
    loggedIn = true;
    console.log('user is logged in');
  }
  return loggedIn;
};

module.exports = {
  checkUserLogin: checkLogin,
};
