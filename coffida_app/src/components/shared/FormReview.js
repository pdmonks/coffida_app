import React, { Component } from 'react';
import {
    Form, Item, Input, Text, Label,
} from 'native-base';
import StarEditable from '../shared/StarEditable';
import { ButtonBlock } from './Buttons';

// shared review information form, used in new review and update review screens,
// using shared button and editable star elements within the form.

class FormReview extends Component {
  render() {
    return (
      
      <Form>

        <Item>
          <Label>Overall rating</Label>
          <StarEditable
            rating={parseInt(this.props.overallStarRatingValue)}
            selectedStar={this.props.selectedOverallRatingStar}
          />
        </Item>

        <Item>
          <Label>Price rating</Label>
          <StarEditable
            rating={parseInt(this.props.priceStarRatingValue)}
            selectedStar={this.props.selectedPriceRatingStar}
          />
        </Item>

        <Item>
          <Label>Quality rating</Label>
          <StarEditable
            rating={parseInt(this.props.qualityStarRatingValue)}
            selectedStar={this.props.selectedQualityRatingStar}
          />
        </Item>

        <Item>
          <Label>Cleanliness rating</Label>
          <StarEditable
            rating={parseInt(this.props.clenlinessStarRatingValue)}
            selectedStar={this.props.selectedClenlinessRatingStar}
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
