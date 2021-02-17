import React, { Component } from 'react';
import { Text, Button } from 'native-base';

class ButtonBlock extends Component {
  render() {
    return (
      <Button block primary onPress={this.props.buttonFunction}>
        <Text uppercase={false}>{this.props.buttonText}</Text>
      </Button>
    );
  }
}

class ButtonInfo extends Component {
  render() {
    return (
      <Button block info onPress={this.props.buttonFunction}>
        <Text uppercase={false}>{this.props.buttonText}</Text>
      </Button>
    );
  }
}

class ButtonLight extends Component {
  render() {
    return (
      <Button block light onPress={this.props.buttonFunction}>
        <Text uppercase={false}>{this.props.buttonText}</Text>
      </Button>
    );
  }
}

class ButtonRounded extends Component {
  render() {
    return (
      <Button rounded success onPress={this.props.buttonFunction}>
        <Text uppercase={false}>{this.props.buttonText}</Text>
      </Button>
    );
  }
}

export {ButtonBlock, ButtonInfo, ButtonLight, ButtonRounded,};
