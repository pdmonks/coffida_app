import React, { Component } from 'react';
import {
    Form, Item, Input, Text, Label,
} from 'native-base';
import { ButtonBlock } from './Buttons';

class FormReview extends Component {
  render() {
    return (
      
      <Form>
        <Item floatingLabel>
          <Label>Overall rating</Label>
          <Input
            placeholder="0 - 5"
            onChangeText={this.props.onChangeTextOverall}
            value={this.props.valueOverall}
          />
        </Item>
        <Item floatingLabel>
          <Label>Price rating</Label>
          <Input
            placeholder="0 - 5"
            onChangeText={this.props.onChangeTextPrice}
            value={this.props.valuePrice}
          />
        </Item>
        <Item floatingLabel>
          <Label>Quality rating</Label>
          <Input
            placeholder="0 - 5"
            onChangeText={this.props.onChangeTextQuality}
            value={this.props.valueQuality}
          />
        </Item>
        <Item floatingLabel>
          <Label>Cleanliness rating</Label>
          <Input
            placeholder="0 - 5"
            onChangeText={this.props.onChangeTextClenliness}
            value={this.props.valueClenliness}
        />
        </Item>
        <Item floatingLabel>
          <Label>Review</Label>
          <Input
            placeholder="Review text..."
            onChangeText={this.props.onChangeTextReview}
            value={this.props.valueReview}
        />
        </Item>

        <Text>{''}</Text>

        <ButtonBlock buttonFunction={this.props.buttonPress} buttonText={this.props.buttonLabel} />

      </Form>

    );
  }
}

export default FormReview;