// @flow
import * as React from 'react';

type Props = {
  htmlFor: string,
};

const Label = (props: Props) => {
  const {
    htmlFor,
    ...otherProps
  } = props;

  return (
    <label htmlFor={htmlFor} {...otherProps} />
  );
};

export default Label;
