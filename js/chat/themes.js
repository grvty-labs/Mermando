// @flow
const rgb2hex: string => string = (rgb) => {
  const rgbRX = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgbRX && rgbRX.length === 4)
    ? `#${(`0${parseInt(rgbRX[1], 10).toString(16)}`).slice(-2)}${
      (`0${parseInt(rgbRX[2], 10).toString(16)}`).slice(-2)}${
      (`0${parseInt(rgbRX[3], 10).toString(16)}`).slice(-2)}`
    : '';
};

function changeColorRecursive(root: Node, oldColor: string, newColor: string): void {
  if (root.style) {
    const backgroundColorStyle = window.getComputedStyle(root).backgroundColor;
    if (backgroundColorStyle) {
      if (rgb2hex(backgroundColorStyle) === oldColor) {
        root.style.backgroundColor = newColor;
      }
    }
  }

  if (root.childNodes) {
    for (let i = 0; i < root.childNodes.length; i += 1) {
      changeColorRecursive(root.childNodes[i], oldColor, newColor);
    }
  }
}

export { changeColorRecursive };
