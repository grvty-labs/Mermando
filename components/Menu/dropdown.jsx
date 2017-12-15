// @flow
import * as React from 'react';
import { Button } from '../Button';
import { sizes } from '../../js/buttons';

export type Props = {
  className?: string,
  text?: string,
  icon?: React.Node | string,
  buttonSize?: $Keys<typeof sizes>,
  showAngle?: boolean,

  showHead?: boolean,
  headTitle?: string,
  headLeftElement?: React.Node,
  headRightElement?: React.Node,

  children: Array<React.Node>,
}

type State = {};
type Default = {
  className: string,
  text: string,
  icon: string,
  showHead: boolean,
  showAngle: boolean,
};

export default class Notifications extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
    text: '',
    icon: '',
    showHead: false,
    showAngle: false,
  };

  render() {
    const {
      className, icon, text, headTitle, children, buttonSize,
      headLeftElement, headRightElement, showAngle, showHead,
    } = this.props;

    const titleRender = showHead
      ? (
        <div className='title'>
          <div>{headLeftElement}</div>
          <div>{headTitle}</div>
          <div>{headRightElement}</div>
        </div>
      )
      : null;

    return (
      <div className={`dropdown-wrapper ${className || ''}`}>
        <Button
          className={showAngle ? 'angled' : ''}
          type={text ? 'link' : 'icon'}
          iconSide='right'
          icon={icon}
          size={buttonSize}
        >
          {text}
        </Button>
        <div className='dropdown'>
          {titleRender}
          {children}
        </div>
      </div>
    );
  }
}
