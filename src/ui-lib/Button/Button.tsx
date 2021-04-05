import * as React from 'react';
import './Button.css';

type ClickEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

interface ButtonProps {
  onClick: (event: ClickEvent) => void;
  'aria-label'?: string;
  children: string;
  isActive?: boolean;
  isDisabled?: boolean;
  isIcon?: boolean;
  isLink?: boolean;
  isPrimary?: boolean;
  role?: string;
  title?: string;
}

export default function Button(props: ButtonProps) {
  const {
    onClick,
    children,
    isActive,
    isDisabled,
    isIcon,
    isLink,
    isPrimary,
    title,
    ...optionalProps
  } = props;
  const titleText = title ?? props['aria-label'];

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
  if (isIcon) {
    className += ' icon';
  } else if (isLink) {
    className += isActive ? ' active link' : ' link';
  } else if (isPrimary) {
    className += ' primary';
  }

  return (
    <button
      {...optionalProps}
      className={className}
      disabled={isDisabled}
      onClick={clickHandler}
      title={titleText}
      type="button"
    >
      {children}
    </button>
  );
}
