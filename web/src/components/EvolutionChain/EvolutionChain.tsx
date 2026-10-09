import { Fragment } from "react";
import { Link } from "react-router";
import type { EvolutionStep } from "../../api/types";
import { cx } from "../styleVars";
import styles from "./EvolutionChain.module.css";

interface EvolutionChainProps {
  stages: EvolutionStep[][];
  currentId: number;
}

export function EvolutionChain({ stages, currentId }: EvolutionChainProps) {
  if (stages.length < 2) {
    return <p className={styles.none}>No evoluciona.</p>;
  }

  const mon = (step: EvolutionStep, showTrigger: boolean) => (
    <Link
      to={`/pokemon/${step.id}`}
      className={cx(styles.mon, step.id === currentId && styles.current)}
      aria-current={step.id === currentId ? "page" : undefined}
    >
      <img src={step.artworkUrl} alt="" width={64} height={64} loading="lazy" />
      <span className={styles.name}>{step.name}</span>
      {showTrigger && step.trigger && <small className={styles.trigger}>{step.trigger}</small>}
    </Link>
  );

  return (
    <ol className={styles.chain}>
      {stages.map((stage, i) => {
        const branches = stage.length > 1;
        const arrow =
          i === 0 ? null : (
            <li className={styles.arrow} aria-hidden="true">
              <span>{branches ? `${stage.length} caminos` : stage[0].trigger}</span>
            </li>
          );
        return (
          <Fragment key={stage.map((s) => s.id).join("-")}>
            {arrow}
            {branches ? (
              <li className={styles.branches}>
                {stage.map((step) => (
                  <Fragment key={step.id}>{mon(step, true)}</Fragment>
                ))}
              </li>
            ) : (
              <li>{mon(stage[0], false)}</li>
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
