module.exports = {
  //root: true,
  //extends: '@react-native-community',
  "extends": "airbnb",
  "parser": "babel-eslint",
  "ecmaFeatures": {
    "classes": true
  },
  "rules": {
    "react/jsx-filename-extension": ["error", { "extensions": [".js", ".jsx"]}],
    "linebreak-style": ["error", "windows"],
    //"allowPattern": "^[a-z]+(_[a-z]+)+$"
  }
};
