// @flow
import * as React from 'react';
import Config from 'Config';
import autobind from 'autobind-decorator';
import { breakpoints } from '../../js/images';

type Size = {
  src: string,
  width: number, // The src image size (px)
};

type Viewport = {
  breakpoint: $Keys<typeof breakpoints>,
  width: string, // The element size on the viewport when rendered. (px, vw, calc, etc).
};

type Image = {
  alt?: string,
  src: string,
  srcSizes: Array<Size>,
  viewports?: Array<Viewport>,
}

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
  renderImage(element: Image, index: number) {
    return (
      <img
        key={index}
        className='fluid-img'
        src={element.src}
        alt=''
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
