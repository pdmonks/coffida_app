import React, { Component } from 'react';
import { Text, Button } from 'native-base';

// shared button components used throughout the Coffida app
// to ensure consistency is styles and functionality

// button used for all functions in the app
class ButtonBlock extends Component {
  render() {
    return (
      <Button block primary onPress={this.props.buttonFunction}>
        <Text uppercase={false}>{this.props.buttonText}</Text>
      </Button>
    );
  }
}

// button used for displaying linkable information in the app
class ButtonInfo extends Component {
  render() {
    return (
      <Button block info onPress={this.props.buttonFunction}>
        <Text uppercase={false}>{this.props.buttonText}</Text>
      </Button>
    );
  }
}

// button used for cancel functions in the app
class ButtonLight extends Component {
  render() {
    return (
      <Button block light onPress={this.props.buttonFunction}>
        <Text uppercase={false}>{this.props.buttonText}</Text>
      </Button>
    );
  }
}

export {ButtonBlock, ButtonInfo, ButtonLight};
