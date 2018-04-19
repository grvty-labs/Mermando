// @flow
import * as React from 'react';
import Config from 'Config';
import { Button } from '../Button';
import { sizes, strains } from '../../js/buttons';

export type Props = {
  className?: string,
  text?: string,
  icon?: React.Node | string,
  buttonStrain?: $Keys<typeof strains>,
  buttonSize?: $Keys<typeof sizes>,
  bubble?: React.Node | string,
  bubbleSize?: $Keys<typeof sizes>,
  bubbleText?: string,

  showHead?: boolean,
  headTitle?: string,
  headLeftElement?: React.Node,
  headRightElement?: React.Node,

  children: Array<React.Node>,
  onShow: Function,
}

type State = {};
type Default = {
  className: string,
  text: string,
  icon: string,
  showHead: boolean,
};

export default class Dropdown extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
    text: '',
    icon: Config.mermando.icons.dropdownButton,
    showHead: false,
  };

  render() {
    const {
      className, icon, text, headTitle, children, buttonSize,
      buttonStrain, headLeftElement, headRightElement,
      showHead,

      bubbleText,
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
        {
          bubbleText
            ?
              <div className='unread-bubble'>
                {bubbleText}
              </div>
            : null
        }
        <Button
          strain={buttonStrain || (text ? 'link' : 'icon')}
          iconSide='right'
          icon={icon}
          size={buttonSize}
          onClick={this.props.onShow}
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
