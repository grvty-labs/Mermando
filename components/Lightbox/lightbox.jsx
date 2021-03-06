// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Config from 'Config';
import { Button } from '../Button';

export type StoreProps = {
  children: React.Node | Array<React.Node>,
  className?: string,
  show: boolean,
  title: string,
  topComponent?: React.Node | Array<React.Node>,
  footerComponent?: React.Node | Array<React.Node>,
};
export type Actions = {
  onCloseClick: Function,
  onToggleLightbox?: Function,
};
type Props = StoreProps & Actions;
type State = {
  show: boolean,
};
type Default = {
  className: string,
  onToggleLightbox: Function,
};

export default class Lightbox extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
    onToggleLightbox: () => {},
  };
  state: State = {
    show: false,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.show !== nextProps.show) {
      if (this.state.show) {
        setTimeout(
          () => this.setState(
            { show: nextProps.show },
            () => this.props.onToggleLightbox(nextProps.show),
          ),
          300,
        );
      } else {
        this.setState({ show: nextProps.show });
        this.props.onToggleLightbox(nextProps.show);
      }
    }
  }

  @autobind
  onCloseClick(event: SyntheticEvent<*>) {
    event.stopPropagation();
    this.props.onCloseClick();
  }

  render() {
    const {
      children, className, footerComponent, onCloseClick, show,
      title, topComponent,
    } = this.props;
    const { show: definitivelyShow } = this.state;
    if (show || definitivelyShow) {
      return (
        <div className={`lightbox-wrapper ${show ? '' : 'close'}`}>
          <div
            className='overlay'
            onClick={this.onCloseClick}
            onKeyPress={this.onCloseClick}
            role='button'
            tabIndex={-1}
          />

          <div className={`lightbox ${className || ''}`}>
            <div className='header'>
              <div>
                <Button
                  strain='icon'
                  iconSide='right'
                  icon={Config.mermando.icons.close}
                  onClick={onCloseClick}
                />
              </div>
              <div><span>{title}</span></div>
              <div>{topComponent}</div>
            </div>
            <div className='content'>
              { children }
            </div>
            <div className='footer'>
              { footerComponent }
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}
