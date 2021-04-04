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
  padding?: CardPadding;
}

export default function Card(props: CardProps) {
  const { children, padding = CardPadding.md } = props;
  return <article className={`Card ${padding}`}>{children}</article>;
}
