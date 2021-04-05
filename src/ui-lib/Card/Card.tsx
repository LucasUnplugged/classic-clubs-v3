import * as React from 'react';
import './Card.css';

export enum CardPadding {
  lg = 'padding-lg',
  md = 'padding-md',
  none = 'padding-none',
  sm = 'padding-sm',
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  role?: string;
  padding?: CardPadding;
  tag?: 'article' | 'div' | 'li';
}

export default function Card(props: CardProps) {
  const {
    children,
    className = '',
    padding = CardPadding.md,
    tag: Tag = 'article',
    ...optionalProps
  } = props;
  return (
    <Tag {...optionalProps} className={`Card ${padding} ${className}`}>
      {children}
    </Tag>
  );
}
