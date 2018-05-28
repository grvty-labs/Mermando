// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import { Lightbox } from './';
import { Button, ButtonContainer } from '../Button';

export type StoreProps = {
  title: string,
  options: string[],
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
    options: ['Cancelar'],
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
        { options.map((option, i) => (
          <Button
            key={i}
            className='option'
            strain='main'
            size='small'
            linkColor='success'
            onClick={() => onOptionSelect(option)}
          >
            {option}
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
