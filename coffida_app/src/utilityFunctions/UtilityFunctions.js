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

const checkEmail = (emailValue) => {
  // const emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailFormat.test(emailValue);
};

module.exports = {
  checkUserLogin: checkLogin,
  validEmailFormat: checkEmail,
};
