import React from "react";
import { GetData_iteration } from "../gqlTypes/GetData";
import styles from "./styles.module.css";

export interface EnvProps {
  data: GetData_iteration;
}

const Env: React.FC<EnvProps> = ({ data }) => (
  <div className={styles.root}>
    <div className={styles.data}>
      <div>{data?.number}</div>
      <div className={styles.dataLabel}>Current Iteration</div>
    </div>

    <div className={styles.data}>
      <div>{data?.waste.toxicity.toFixed(3)}</div>
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
