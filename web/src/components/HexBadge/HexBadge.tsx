import type { ReactNode } from "react";
import styles from "./HexBadge.module.css";

// Insignia hexagonal con el color de --t, como las de la referencia de diseño.
export function HexBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.badge}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value}>{value}</dd>
    </div>
  );
}

export function HexBadges({ children }: { children: ReactNode }) {
  return <dl className={styles.list}>{children}</dl>;
}
