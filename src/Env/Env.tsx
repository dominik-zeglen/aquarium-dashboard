import React from "react";
import styles from "./styles.module.css";

export interface EnvProps {
  data: APIData;
}

const Env: React.FC<EnvProps> = ({ data }) => (
  <div className={styles.root}>
    <div className={styles.data}>
      <div>{data?.iteration}</div>
      <div className={styles.dataLabel}>Current Iteration</div>
    </div>

    <div className={styles.data}>
      <div>{data?.waste.waste.toFixed(3)}</div>
      <div className={styles.dataLabel}>Waste</div>
    </div>

    <div className={styles.data}>
      <div>{data?.aliveCellCount}</div>
      <div className={styles.dataLabel}>Alive Cells</div>
    </div>
  </div>
);

Env.displayName = "Env";
export default Env;
