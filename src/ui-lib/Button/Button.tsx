import * as React from 'react';
import './Button.css';

type ClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

interface ButtonProps {
  onClick: (event: ClickEvent) => void;
  'aria-label'?: string;
  children: string;
  isActive?: boolean;
  isDisabled?: boolean;
  isLink?: boolean;
  isPrimary?: boolean;
}

export default function Button(props: ButtonProps) {
  const { onClick, children, isActive, isDisabled, isLink, isPrimary, ...optionalProps } = props;

  const clickHandler = React.useCallback(
    (event: ClickEvent): void => {
      const isButton = (document.activeElement as HTMLInputElement).type === 'button';
      // If this was an actual click event, clear its focus, to avoid
      // a "sticky hover state" effect.
      if (event.detail && isButton) {
        (document.activeElement as HTMLElement).blur();
      }
      onClick(event);
    },
    [onClick]
  );

  let className = 'Button';
  if (isLink) {
    className += isActive ? ' active link' : ' link';
  } else if (isPrimary) {
    className += ' primary';
  }

  return (
    <button
      type="button"
      {...optionalProps}
      className={className}
      disabled={isDisabled}
      onClick={clickHandler}
    >
      {children}
    </button>
  );
}
