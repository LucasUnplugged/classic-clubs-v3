import * as React from 'react';
import ReactDOM from 'react-dom';
import Button from '../Button/Button';
import './Panel.css';

interface PanelProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function Panel(props: PanelProps) {
  const { children, isOpen, onClose } = props;
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  // Render the panel at the root level of the DOM, via a portal
  const portalRoot = document.getElementById('portal-root');
  // The panel should transition between opened/closed if either
  // `isOpen` or `isVisible` is false.
  const className = isOpen && isVisible ? 'Panel visible' : 'Panel';

  React.useEffect((): void => {
    if (isOpen && !isVisible) {
      setIsVisible(true);
    } else if (!isOpen && isVisible) {
      setTimeout((): void => {
        setIsVisible(false);
      }, 250); // Give the panel time to animate the closing transition
    }
  }, [isOpen, isVisible]);

  return !isOpen && !isVisible
    ? null
    : ReactDOM.createPortal(
        <aside className={className}>
          <header>
            <Button aria-label="Close" onClick={onClose}>
              x
            </Button>
          </header>
          {children}
        </aside>,
        portalRoot
      );
}
