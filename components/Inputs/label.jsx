// @flow
import * as React from 'react';

type Props = {
  htmlFor: string | number,
};

const Label = (props: Props) => {
  const {
    htmlFor,
    ...otherProps
  } = props;

  return (
    <label
      htmlFor={`${htmlFor}`}
      onClick={(e: SyntheticEvent<*>) => { if (e) e.stopPropagation(); }}
      {...otherProps}
    />
  );
};

export default Label;
