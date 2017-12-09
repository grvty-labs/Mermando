// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import colours from '../../js/theme';

export type StoreProps = {
  borderColor?: $Keys<typeof colours> | string,
  children: React.Node | Array<React.Node>,
  className?: string,
  footer?: React.Node | Array<React.Node>,
  title?: string,
};
export type Actions = {};
type Props = StoreProps & Actions;
type State = {
  show: boolean,
};
type Default = {
  borderColor: $Keys<typeof colours> | string,
  className: string,
};

export default class Sticky extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
    borderColor: 'brand',
  };
  state: State = {
    show: true,
  };

  render() {
    const {
      borderColor, className, children, footer, title,
    } = this.props;
    const { show } = this.state;
    const safeRibbonColor = borderColor || 'brand';
    const isKnownRibbon = Object.prototype.hasOwnProperty.call(
      colours,
      safeRibbonColor.toLowerCase(),
    );
    return (
      <div className={`sticky-wrapper ${className || ''} ${show ? 'open' : ''}`}>
        <button
          className='show-btn'
          onClick={() => { this.setState({ show: !this.state.show }); }}
        >
          <span className='symbolicon eye' />
        </button>
        <div className='sticky'>
          <div
            className={`ribbon ${isKnownRibbon ? safeRibbonColor : ''}`}
            style={isKnownRibbon ? {} : { borderColor: safeRibbonColor }}
          />
          <div className='header'>
            <span className='title'>{title}</span>
          </div>
          <div className='content'>
            {children}
          </div>
          <div className='footer'>
            {footer}
          </div>
        </div>
      </div>
    );
  }
}
