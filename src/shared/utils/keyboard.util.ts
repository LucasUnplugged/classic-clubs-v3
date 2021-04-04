import * as React from 'react';

export type KeyDownEventHandler = (
  event: React.KeyboardEvent<HTMLButtonElement>
) => void;

export function getKeyConfirmHandler(
  handler: KeyDownEventHandler
): KeyDownEventHandler {
  return (event: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'Enter') {
      handler(event);
    }
  };
}
