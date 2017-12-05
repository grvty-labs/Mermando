// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import { Button } from '../Button';

type StoreProps = {
  children: React.Node | Array<React.Node>,
  className?: string,
  show: boolean,
  title: string,
  topComponent?: React.Node | Array<React.Node>,
};
type Actions = {
  onCloseClick: Function,
  onToggleLightbox: Function,
};
type Props = StoreProps & Actions;
type State = {
  show: boolean,
};
type Default = {
  className: string,
};

export default class Lightbox extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    className: '',
  };
  state: State = {
    show: false,
  };

  componentWillReceiveProps(nextProps: Props) {
    console.log(nextProps);
    if (this.props.show !== nextProps.show) {
      if (this.state.show) {
        setTimeout(
          () => this.setState(
            { show: nextProps.show },
            () => this.props.onToggleLightbox(nextProps.show),
          ),
          300,
        );
        console.log('done');
      } else {
        this.setState({ show: nextProps.show });
        this.props.onToggleLightbox(nextProps.show);
      }
    }
  }

  render() {
    const {
      children, className, onCloseClick, show,
      title, topComponent,
    } = this.props;
    const { show: definitivelyShow } = this.state;
    if (show || definitivelyShow) {
      return (
        <div className={`lightbox-wrapper ${show ? '' : 'close'}`}>
          <div
            className='overlay'
            onClick={onCloseClick}
            onKeyPress={onCloseClick}
            role='button'
            tabIndex={-1}
          />

          <div className={`lightbox ${className || ''}`}>
            <div className='header'>
              <div>
                <Button
                  type='icon'
                  icon='close'
                  onClick={onCloseClick}
                />
              </div>
              <div><span>{title}</span></div>
              <div>{topComponent}</div>
            </div>
            <div className='content'>
              { children }
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}
