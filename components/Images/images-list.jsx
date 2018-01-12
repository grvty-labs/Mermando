// @flow
import * as React from 'react';
import Config from 'Config';
import autobind from 'autobind-decorator';

import type {
  Size, Viewport, StoreProps as Image,
} from './image';

export type StoreProps = {
  images: Array<Image>,
}

export type Actions = {};
type Props = StoreProps & Actions;

type Default = {};
type State = {};

export default class ImagesList extends React.PureComponent<Props, State> {
  static defaultProps: Default = {};
  state: State = {};

  @autobind
  generateSourceSets(srcSizes: Array<Size>) {
    let sourceSet = '';
    srcSizes.forEach((size) => {
      const newSource = `${size.src} ${size.width}w`;
      sourceSet = `${sourceSet}${sourceSet ? `, ${newSource}` : newSource}`;
    });
    return sourceSet;
  }

  @autobind
  generateSizes(viewports?: Array<Viewport>) {
    let sizeSet = '';
    if (viewports) {
      viewports.forEach((viewport) => {
        const newSize = `${Config.mermando.breakpoints[viewport.breakpoint]} ${viewport.width}`;
        sizeSet = `${sizeSet}${sizeSet ? `, ${newSize}` : newSize}`;
      });
    }
    return sizeSet;
  }

  @autobind
  renderImage(image: Image, index: number) {
    const {
      src, alt, srcSizes, viewports,
    } = image;
    return (
      <img
        key={index}
        className='fluid-img'
        srcSet={this.generateSourceSets(srcSizes)}
        sizes={this.generateSizes(viewports)}
        src={src}
        alt={alt}
      />
    );
  }

  render() {
    const { images } = this.props;
    const imagesRender = images.map(this.renderImage);
    return (
      <div className='image-list-wrapper'>
        {imagesRender}
      </div>
    );
  }
}
