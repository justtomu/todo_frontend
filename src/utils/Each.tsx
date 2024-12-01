import React, { ReactNode } from 'react';

interface EachProps<T> {
  render: (item: T, index: number) => ReactNode;
  of: T[];
}

export const Each = <T,>({ render, of }: EachProps<T>) => (
  <>
    {of.map((item, index) => (
      <React.Fragment key={index}>{render(item, index)}</React.Fragment>
    ))}
  </>
);
