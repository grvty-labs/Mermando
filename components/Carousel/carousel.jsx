// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Config from 'Config';
import { Image } from '../Images';
import { breakpoints } from '../../js/images';
import type { ImageStoreProps } from '../Images';

export type ImageType = {
  id: number | string,
} & ImageStoreProps;

type Viewport = {
  breakpoint: $Keys<typeof breakpoints>,
  width: string,
};

export type StoreProps = {
  images: Array<ImageType>,
  time?: number,
  autoScroll?: boolean,
  viewports: Array<Viewport>,
};
export type Actions = {

};
type Props = StoreProps & Actions;
type Default = {
  time: number,
  autoScroll: boolean,
};
type State = {
  selected: number,
  lastSelected: number,
  slideSide: 'left' | 'right',
};

export default class Carousel extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    time: 6000,
    autoScroll: true,
  };

  state: State = {
    selected: 0,
    lastSelected: 0,
    slideSide: 'right',
  };

  componentDidMount() {
    this.onSelect(0);
  }

  @autobind
  onSelect(index: number) {
    this.setState({
      slideSide: index > this.state.selected ? 'right' : 'left',
      lastSelected: this.state.selected,
      selected: index,
    }, () => {
      if (this.props.autoScroll) {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          const { images } = this.props;
          const { selected } = this.state;
          const nextIndex = selected < images.length - 1
            ? selected + 1
            : 0;
          this.onSelect(nextIndex);
        }, this.props.time);
      }
    });
  }

  timeout: number;

  @autobind
  renderButton(side: 'left' | 'right') {
    const { images } = this.props;
    const { selected } = this.state;
    const { icons } = Config.mermando;
    const className = `${icons.classPrefix}${
      side === 'left' ? icons.carouselLeft : icons.carouselRight}`;
    const index = side === 'right'
      ? selected < images.length - 1
        ? selected + 1
        : 0
      : selected === 0
        ? images.length - 1
        : selected - 1;
    return (
      <span
        className={className}
        onClick={() => this.onSelect(index)}
        onKeyPress={() => this.onSelect(index)}
        role='button'
        tabIndex={0}
      />
    );
  }

  @autobind
  renderDots() {
    const { images } = this.props;
    const { selected, lastSelected, slideSide } = this.state;

    if (images.length) {
      const dots = images.map((image, index: number) => (
        <div
          key={image.id}
          className={`${
            selected === index
            ? `selected ${slideSide}`
            : lastSelected === index
              ? `last ${slideSide}`
              : ''
            }`}
          onClick={() => this.onSelect(index)}
          onKeyPress={() => this.onSelect(index)}
          role='button'
          tabIndex={0}
        />
      ));

      return (
        <div className='dots'>
          {dots}
        </div>
      );
    }

    return null;
  }

  render() {
    const { selected } = this.state;
    const { images, viewports } = this.props;

    return (
      <div className='carousel-wrapper'>
        <div className='content'>
          <div className='carousel'>
            { images.map((image: ImageType, index: number) => (
              <div
                className='pic-wrap'
                key={image.id}
                style={index === 0 ? { marginLeft: `-${selected * 100}%` } : undefined}
              >
                <Image
                  alt={image.alt}
                  src={image.src}
                  srcSizes={image.srcSizes}
                  viewports={viewports}
                />
              </div>
            )) }
          </div>
          <div className='controls'>
            { this.renderButton('left') }
            { this.renderButton('right') }
          </div>
        </div>
        <div className='footer'>
          { this.renderDots() }
        </div>
      </div>
    );
  }
}
