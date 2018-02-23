// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Config from 'Config';
import Image from './image';
import { Lightbox } from '../Lightbox';
import { Carousel } from '../Carousel';

import type {
  Viewport, StoreProps as ImageType,
} from './image';

export type StoreProps = {
  images: ImageType[],
  className?: string,
  viewports?: Viewport[],

  lightbox?: boolean,
  lightboxTitle?: string,
}

export type Actions = {
  toggleLightbox?: Function,
};
type Props = StoreProps & Actions;

type Default = {
  lightbox: boolean,
  lightboxTitle: string,
};
type State = {
  show: boolean
};

export default class ImagesList extends React.PureComponent<Props, State> {
  static defaultProps: Default = {
    lightbox: false,
    lightboxTitle: '',
  };
  state: State = {
    show: false,
  };

  @autobind
  onToggle(event: SyntheticEvent<*>) {
    event.stopPropagation();
    this.setState({ show: !this.state.show });
  }

  @autobind
  renderLightbox() {
    const {
      toggleLightbox, lightboxTitle,
    } = this.props;
    const { show } = this.state;

    return (
      <Lightbox
        className='imageList-lightbox'
        title={lightboxTitle}
        show={show}
        onCloseClick={() => { this.setState({ show: !this.state.show }); }}
        onToggleLightbox={toggleLightbox}
      >
        <Carousel
          key='1'
          images={this.props.images}
        />
      </Lightbox>
    );
  }

  @autobind
  renderImage(image: ImageType, index: number) {
    const {
      src, alt, srcSizes,
    } = image;
    const { lightbox } = this.props;

    if (src) {
      if (lightbox) {
        return (
          <div className='img-wrap' key={index}>
            <div
              className='container'
            >
              <Image
                alt={alt}
                src={src}
                srcSizes={srcSizes}
                viewports={image.viewports || this.props.viewports}
              />
              <div
                className='overlay'
                onClick={this.onToggle} // eslint-disable-line
                onKeyPress={this.onToggle} // eslint-disable-line
                role='button'
                tabIndex={0}
              >
                <span className={`${Config.mermando.icons.classPrefix}${Config.mermando.icons.zoom}`} />
              </div>
            </div>
          </div>
        );
      }
      return (
        <div className='img-wrap' key={index}>
          <Image
            alt={alt}
            src={src}
            srcSizes={srcSizes}
            viewports={image.viewports || this.props.viewports}
          />
        </div>
      );
    }
    return null;
  }

  render() {
    const { images, lightbox, className } = this.props;
    const imagesRender = images.map(this.renderImage);
    if (lightbox) {
      return (
        <div className={`images-list ${className || ''}`}>
          {imagesRender}
          {this.renderLightbox()}
        </div>
      );
    }
    return (
      <div className={`images-list ${className || ''}`}>
        {imagesRender}
      </div>
    );
  }
}
