// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import { Lightbox } from './';
import { Button, ButtonContainer } from '../Button';

type OptionType = {
  title: string,
  strain: string, // 'main' or 'link'
  size: string,
  linkColor: string,
}

export type StoreProps = {
  title: string,
  options: OptionType[],
  children: React.Node,
  show: boolean,
};
export type Actions = {
  onOptionSelect: Function,
  onCloseClick: Function,
  onToggleLightbox: Function,
};
type Props = StoreProps & Actions;
type State = {
};

export default class ConfirmBox extends React.PureComponent<Props, State> {
  static defaultProps: Props = {
    title: '',
    options: [],
    show: true,
    onOptionSelect: () => {},
    onCloseClick: () => {},
    onToggleLightbox: () => {},
  };
  state: State = {};

  renderOptions = () => {
    const { options, onOptionSelect } = this.props;
    return (
      <ButtonContainer className='options'>
        { options.map(({
          title, strain, size, linkColor,
        }, i) => (
          <Button
            key={i}
            className='option'
            strain={strain}
            size={size}
            linkColor={linkColor}
            onClick={() => onOptionSelect(title)}
          >
            {title}
          </Button>
        )) }
      </ButtonContainer>
    );
  }

  render() {
    const {
      title, onCloseClick, onToggleLightbox, children, show,
    } = this.props;
    return (
      <Lightbox
        title={title}
        children={children}
        show={show}
        onCloseClick={onCloseClick}
        onToggleLightbox={onToggleLightbox}
        footerComponent={this.renderOptions()}
      >
        { children }
      </Lightbox>
    );
  }
}
