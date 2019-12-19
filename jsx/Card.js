/**
 * This file contains React component for Card
 *
 * @author Zaliqa Rosli
 * @version 1.0.0
 *
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Panel from 'jsx/Panel';

/**
 * Card component
 * Wraps children in a customizable card
 *
 * Prop data an array of objects in the form:
 * {
 *   label: '',
 *   value: '',
 * }
 */
class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: this.props.initCollapsed,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onClick(e);
  }

  render() {
    const cardInfo = (
      this.props.data.map((info) => {
        return (
          <StaticElement
            text={info.value}
            label={info.label}
          />
        );
      })
    );
    return (
      <div
        key={this.props.id}
        onClick={this.handleClick}
      >
        <Panel title={this.props.title}>
          <FormElement
            name={"Card_"+this.props.id}
          >
            {cardInfo}
          </FormElement>
        </Panel>
      <div>
    );
  }
}

Card.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onClick: PropTypes.func,
};

Card.defaultProps = {
  onClick: function() {
    console.warn('onClick() Card callback not set!');
  },
};

export default Card;
