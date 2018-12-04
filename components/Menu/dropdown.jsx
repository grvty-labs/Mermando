// @flow
import * as React from 'react';
import Config from 'Config';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
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

type State = {
  show: boolean,
};

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

  state = {
    show: false,
  };

  @autobind
  onShow() {
    const { onShow } = this.props;
    const { show } = this.state;
    if (show) document.removeEventListener('click', this.handleOutsideClick);
    else document.addEventListener('click', this.handleOutsideClick);

    this.setState({ show: !show }, onShow);
  }

  @autobind
  handleOutsideClick(e: Event) {
    // ignore clicks on the component itself
    if (this.node && this.node.contains(e.target)) {
      return;
    }

    this.setState({ show: false });
    document.removeEventListener('click', this.handleOutsideClick);
  }

  node: ?HTMLDivElement;

  render() {
    const {
      className, icon, text, headTitle, children, buttonSize,
      buttonStrain, headLeftElement, headRightElement,
      showHead,

      bubbleText,
    } = this.props;
    const { show } = this.state;

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
      <div
        ref={(v) => { this.node = v; }}
        className={classnames('dropdown-wrapper', className)}
      >
        {
          bubbleText
            ? (
              <div className='unread-bubble'>
                {bubbleText}
              </div>)
            : null
        }
        <Button
          className={classnames({ active: show })}
          strain={buttonStrain || (text ? 'link' : 'icon')}
          iconSide='right'
          icon={icon}
          size={buttonSize}
          onClick={this.onShow}
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
