import type { Stats } from "../../api/types";
import { MAX_STAT, RADAR_AXES, statTotal } from "../../lib/radar";
import styles from "./StatBars.module.css";

const ORDER: Array<keyof Stats> = [
  "hp",
  "attack",
  "defense",
  "specialAttack",
  "specialDefense",
  "speed",
];
const LABELS = Object.fromEntries(RADAR_AXES.map((a) => [a.key, a.label])) as Record<
  keyof Stats,
  string
>;

export function StatBars({ stats }: { stats: Stats }) {
  return (
    <dl className={styles.bars}>
      {ORDER.map((key) => (
        <div key={key} className={styles.row}>
          <dt>{LABELS[key]}</dt>
          <dd className={styles.value}>{stats[key]}</dd>
          <dd className={styles.track} aria-hidden="true">
            <i style={{ width: `${((stats[key] / MAX_STAT) * 100).toFixed(1)}%` }} />
          </dd>
        </div>
      ))}
      <div className={`${styles.row} ${styles.total}`}>
        <dt>Total</dt>
        <dd className={styles.value}>{statTotal(stats)}</dd>
      </div>
    </dl>
  );
}
