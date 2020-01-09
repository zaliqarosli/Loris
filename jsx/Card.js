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
      <div style={{marginLeft: '5px', marginRight: '5px'}}>
        <Panel
          id={this.props.id}
          title={this.props.title}
          backgroundColor={this.props.backgroundColor}
          initCollapsed={this.props.initCollapsed}
        >
          <div
            onClick={this.handleClick}
            style={cursorStyle}
          >
            {this.props.children}
          </div>
        </Panel>
      </div>
    );
  }
}

Card.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  backgroundColor: PropTypes.string,
  initCollapsed: PropTypes.bool,
};

Card.defaultProps = {
  onClick: null,
  backgroundColor: 'white',
  initCollapsed: false,
};

export default Card;
