import type { Weakness } from "../../api/types";
import { groupWeaknesses } from "../../lib/format";
import { TypeChip } from "../TypeChip/TypeChip";
import styles from "./WeaknessTable.module.css";

const TONE: Record<number, string> = {
  4: styles.bad,
  2: styles.bad,
  0.5: styles.good,
  0.25: styles.good,
  0: styles.none,
};

// Los multiplicadores los calcula el backend; acá sólo se agrupan y se pintan.
export function WeaknessTable({ weaknesses }: { weaknesses: Weakness[] }) {
  return (
    <dl className={styles.table}>
      {groupWeaknesses(weaknesses).map((group) => (
        <div key={group.multiplier} className={styles.row}>
          <dt className={`${styles.multiplier} ${TONE[group.multiplier]}`}>
            <span aria-hidden="true">{group.symbol}</span>
            <span className={styles.label}>{group.label}</span>
          </dt>
          <dd className={styles.types}>
            {group.types.map((t) => (
              <TypeChip key={t.name} type={t} />
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
