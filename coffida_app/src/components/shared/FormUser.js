import React, { Component } from 'react';
import { Form, Item, Input, Text, Label } from 'native-base';
import { ButtonBlock } from './Buttons'

// shared user information form, used in new account and update account screens

class FormUser extends Component {
  render() {
    return (
      
      <Form>
        <Item floatingLabel>
          <Label>First name</Label>
          <Input
            placeholder="Enter first name..."
            onChangeText={this.props.onChangeTextFirstName}
            value={this.props.valueFirstName}
          />
        </Item>
        <Item floatingLabel>
          <Label>Last name</Label>
          <Input
            placeholder="Enter last name..."
            onChangeText={this.props.onChangeTextLastName}
            value={this.props.valueLastName}
          />
        </Item>
        <Item floatingLabel>
          <Label>Email</Label>
          <Input
            placeholder="Enter email..."
            onChangeText={this.props.onChangeTextEmail}
            value={this.props.valueEmail}
          />
        </Item>
        <Item floatingLabel>
          <Label>Password (minimum 8 characters)</Label>
          <Input
            placeholder="Enter password..."
            onChangeText={this.props.onChangeTextPassword}
            value={this.props.valuePassword}
            secureTextEntry
        />
        </Item>
        <Item floatingLabel>
          <Label>Re-enter Password</Label>
          <Input
            placeholder="Re-enter password..."
            onChangeText={this.props.onChangeTextPasswordCheck}
            value={this.props.valuePasswordCheck}
            secureTextEntry
        />
        </Item>

        <Text>{''}</Text>

        <ButtonBlock buttonFunction={this.props.buttonPress} buttonText={this.props.buttonLabel} />

      </Form>

    );
  }
}

export default FormUser;