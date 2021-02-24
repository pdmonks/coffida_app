import React, { Component } from 'react';
import { Item, Input, Label } from 'native-base';

// shared component for text entry fields

class FormItem extends Component {
  render() {
    return (
      <Item floatingLabel>
        <Label>{this.props.label}</Label>
        <Input
          placeholder={this.props.placeholder}
          onChangeText={this.props.onChangeText}
          value={this.props.value}
        />
      </Item>
    );
  }
}

export default FormItem;