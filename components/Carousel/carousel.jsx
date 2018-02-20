// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Config from 'Config';
import ReactPlayer from 'react-player';

import { Image } from '../Images';
import { breakpoints } from '../../js/images';
import type { ImageStoreProps } from '../Images';

export type ImageType = {
  id: number | string,
  type?: 'image',
} & ImageStoreProps;

export type VideoType = {
  id: number | string,
  type?: 'video',
  url: string,
}

type Viewport = {
  breakpoint: $Keys<typeof breakpoints>,
  width: string,
};

export type StoreProps = {
  images?: ImageType[],
  videos?: VideoType[],
  videoWidth?: number,
  videoHeight?: number,
  time?: number,
  autoScroll?: boolean,
  viewports?: Viewport[],
};
export type Actions = {

};
type Props = StoreProps & Actions;
type Default = {
  time: number,
  autoScroll: boolean,
  videoWidth: number,
  videoHeight: number,
};
type State = {
  selected: number,
  lastSelected: number,
  slideSide: 'left' | 'right',
  elements: ImageType[] | VideoType[],
};


export default class Carousel extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    time: 6000,
    autoScroll: true,
    videoWidth: 853,
    videoHeight: 480,
  };

  state: State = {
    elements: [],
    selected: 0,
    lastSelected: 0,
    slideSide: 'right',
  };

  componentWillMount() {
    this.setElements(this.props);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setElements(nextProps);
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
          const { selected } = this.state;
          const nextIndex = selected < this.state.elements.length - 1
            ? selected + 1
            : 0;
          this.onSelect(nextIndex);
        }, this.props.time);
      }
    });
  }

  @autobind
  setElements(props: Props) {
    const { images = [], videos = [] } = props;
    let elements = [];
    if (images && images.length) {
      elements = [
        ...images.map(img => ({ ...img, type: 'image' })),
      ];
    }
    if (videos && videos.length) {
      elements = [
        ...elements,
        ...videos.map(vid => ({ ...vid, type: 'video' })),
      ];
    }
    this.setState({ elements }, () => { this.onSelect(0); });
  }

  timeout: number;

  @autobind
  renderButton(side: 'left' | 'right') {
    const { selected, elements } = this.state;
    const { icons } = Config.mermando;
    const className = `${icons.classPrefix}${
      side === 'left' ? icons.carouselLeft : icons.carouselRight}`;
    const index = side === 'right'
      ? selected < elements.length - 1
        ? selected + 1
        : 0
      : selected === 0
        ? elements.length - 1
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
    const {
      selected, lastSelected, slideSide, elements,
    } = this.state;

    if (elements && elements.length) {
      const dots = elements.map((element, index: number) => (
        <div
          key={element.id}
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
    const { selected, elements } = this.state;
    const {
      viewports, videoWidth, videoHeight,
    } = this.props;

    return (
      <div className='carousel-wrapper'>
        <div className='content'>
          <div className='carousel'>
            { elements && elements.length
              ? elements.map((element: ImageType | VideoType, index: number) => (
                <div
                  className='pic-wrap'
                  key={element.id}
                  style={index === 0 ? { marginLeft: `-${selected * 100}%` } : undefined}
                >
                  { element.type === 'image'
                    ? (
                      <Image
                        alt={element.alt}
                        src={element.src}
                        srcSizes={element.srcSizes}
                        viewports={viewports}
                      />
                    )
                    : (
                      <ReactPlayer
                        url={element.url}
                        controls
                        width={`${videoWidth}px`}
                        height={`${videoHeight}px`}
                        onPlay={() => {
                          clearTimeout(this.timeout);
                        }}
                        onPause={() => {
                          this.onSelect(this.state.selected);
                        }}
                        onEnded={() => {
                          this.onSelect(this.state.selected);
                        }}
                      />
                    )
                  }
                </div>
              ))
              : null}
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
