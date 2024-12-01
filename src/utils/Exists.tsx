import React, { FC } from 'react';

interface Props {
  visible: boolean;
  children: React.ReactNode;
}
export const Exists: FC<Props> = ({ visible, children }) => {
  return visible ? <>{children}</> : null;
};
