import React, { Component } from 'react';
import { Item, Input, Label } from 'native-base';

// shared component for secure text entry fields

class FormItemSecure extends Component {
  render() {
    return (
      <Item floatingLabel>
        <Label>{this.props.label}</Label>
        <Input
          placeholder={this.props.placeholder}
          onChangeText={this.props.onChangeText}
          value={this.props.value}
          secureTextEntry
        />
      </Item>
    );
  }
}

export default FormItemSecure;