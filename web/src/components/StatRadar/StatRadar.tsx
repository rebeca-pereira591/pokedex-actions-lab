import type { Stats } from "../../api/types";
import { axisPoint, RADAR_AXES, radarPoints, toSvgPoints } from "../../lib/radar";
import styles from "./StatRadar.module.css";

interface StatRadarProps {
  stats: Stats;
  name: string;
  /** Sin etiquetas queda el hexágono solo, para tamaños chicos. */
  labels?: boolean;
}

const RADIUS = 100;
const CENTER = { x: 180, y: 165 };
const RINGS = [0.2, 0.4, 0.6, 0.8, 1];

// Hexágono de las 6 estadísticas base, en SVG propio. Toma el color de --t.
export function StatRadar({ stats, name, labels = true }: StatRadarProps) {
  const ring = (fraction: number) =>
    toSvgPoints(RADAR_AXES.map((_, i) => axisPoint(i, fraction, RADIUS, CENTER)));
  const values = radarPoints(stats, RADIUS, CENTER);
  const viewBox = labels
    ? "0 0 360 330"
    : `${CENTER.x - RADIUS * 0.87 - 6} ${CENTER.y - RADIUS - 6} ${RADIUS * 1.74 + 12} ${RADIUS * 2 + 12}`;
  const description = RADAR_AXES.map(({ key, label }) => `${label} ${stats[key]}`).join(", ");

  return (
    <svg
      className={styles.radar}
      viewBox={viewBox}
      role="img"
      aria-label={`Estadísticas de ${name}: ${description}`}
    >
      {RINGS.map((f) => (
        <polygon key={f} className={styles.ring} points={ring(f)} />
      ))}
      {RADAR_AXES.map(({ key }, i) => {
        const end = axisPoint(i, 1, RADIUS, CENTER);
        return (
          <line
            key={key}
            className={styles.ring}
            x1={CENTER.x}
            y1={CENTER.y}
            x2={end.x}
            y2={end.y}
          />
        );
      })}
      <polygon className={styles.shape} points={toSvgPoints(values)} />
      {values.map((p, i) => (
        <circle key={RADAR_AXES[i].key} className={styles.dot} cx={p.x} cy={p.y} r={3.5} />
      ))}
      {labels &&
        RADAR_AXES.map(({ key, label }, i) => {
          const at = axisPoint(i, 1.28, RADIUS, CENTER);
          const anchor = i === 0 || i === 3 ? "middle" : i < 3 ? "start" : "end";
          return (
            <g key={key} textAnchor={anchor}>
              <text className={styles.label} x={at.x} y={at.y - 5}>
                {label}
              </text>
              <text className={styles.value} x={at.x} y={at.y + 13}>
                {stats[key]}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
