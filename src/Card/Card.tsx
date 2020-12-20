import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: React.ReactNode;
  header?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  actions,
  children,
  className,
  header,
  ...rest
}) => (
  <div {...rest} className={clsx(className, styles.root)}>
    {header && <div className={styles.header}>{header}</div>}
    {children}
  </div>
);

Card.displayName = "Card";
export default Card;
