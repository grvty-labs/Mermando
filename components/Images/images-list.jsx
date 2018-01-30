// @flow
import * as React from 'react';
import autobind from 'autobind-decorator';
import Image from './image';

import type {
  Viewport, StoreProps as ImageType,
} from './image';

export type StoreProps = {
  images: ImageType[],
  viewports?: Viewport[],
}

export type Actions = {};
type Props = StoreProps & Actions;

type Default = {};
type State = {};

export default class ImagesList extends React.PureComponent<Props, State> {
  static defaultProps: Default = {};
  state: State = {};

  @autobind
  renderImage(image: ImageType, index: number) {
    const {
      src, alt, srcSizes,
    } = image;

    if (src) {
      return (
        <Image
          key={index}
          alt={alt}
          src={src}
          srcSizes={srcSizes}
          viewports={image.viewports || this.props.viewports}
        />
      );
    }
    return null;
  }

  render() {
    const { images } = this.props;
    const imagesRender = images.map(this.renderImage);
    return (
      <div className='images-list'>
        {imagesRender}
      </div>
    );
  }
}
