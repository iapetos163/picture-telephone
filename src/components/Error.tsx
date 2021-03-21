import React, { FC } from 'react';

interface ErrorProps {
  message: string;
}

const ErrorComponent: FC<ErrorProps> = ({ message }) => {
  return <p id="error">{message}</p>;
}
export default ErrorComponent;