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
 * Card component - Wraps children in a customizable card
 *
 */
class Card extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onClick(e);
  }

  render() {
    const cursorStyle = this.props.onClick ? {
      cursor: 'pointer',
    } : null;
    return (
      <Panel title={this.props.title}>
        <div
          key={this.props.id}
          onClick={this.handleClick}
          style={cursorStyle}
        >
          {this.props.children}
        </div>
      </Panel>
    );
  }
}

Card.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

Card.defaultProps = {
  onClick: function() {
    console.warn('onClick() Card callback not set!');
  },
};

export default Card;
