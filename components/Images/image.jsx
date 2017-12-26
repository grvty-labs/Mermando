// @flow
import * as React from 'react';
import Config from 'Config';
import autobind from 'autobind-decorator';
import { breakpoints } from '../../js/images';

type Size = {
  src: string,
  width: number, // The src image size
};

type Viewport = {
  breakpoint: $Keys<typeof breakpoints>,
  width: string, // The element size on the viewport when rendered. (px, vw, calc, etc).
};

export type StoreProps = {
  alt: string,
  src: string,
  srcSizes: Array<Size>,
  viewports?: Array<Viewport>,
};
export type Actions = {};
type Props = StoreProps & Actions;

type Default = {};
type State = {};

export default class FluidImage extends React.PureComponent<Props, State> {
  static defaultProps: Default = {};
  state: State = {};

  @autobind
  generateSourceSets() {
    const { srcSizes } = this.props;
    let sourceSet = '';
    srcSizes.forEach((size) => {
      const newSource = `${size.src} ${size.width}w`;
      sourceSet = `${sourceSet}${sourceSet ? `, ${newSource}` : newSource}`;
    });
    return sourceSet;
  }

  @autobind
  generateSizes() {
    const { viewports } = this.props;
    let sizeSet = '';
    if (viewports) {
      viewports.forEach((viewport) => {
        const newSize = `${Config.mermando.breakpoints[viewport.breakpoint]} ${viewport.width}`;
        sizeSet = `${sizeSet}${sizeSet ? `, ${newSize}` : newSize}`;
      });
    }
    return sizeSet;
  }

  render() {
    return (
      <img
        className='fluid-img'
        srcSet={this.generateSourceSets()}
        sizes={this.generateSizes()}
        src={this.props.src}
        alt={this.props.alt}
      />
    );
  }
}
