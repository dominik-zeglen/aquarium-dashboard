import React from "react";
import { API_URL } from "./env";
import styles from "./App.module.css";
import Env from "./Env/Env";
import Overview from "./Overview/Overview";

const App: React.FC = () => {
  const apiInterval = React.useRef<number | null>(null);
  const [data, setData] = React.useState<APIData>();
  const [dataSequence, setDataSequence] = React.useState<APIDataSequence[]>([]);

  React.useEffect(() => {
    apiInterval.current = (setInterval(async () => {
      const response = await fetch(API_URL);
      const responseData: APIData = await response.json();
      setData(responseData);
      setDataSequence((prev) => {
        const newData = [
          ...prev,
          {
            ...responseData,
            procreation: {
              ...responseData.procreation,
              species: undefined,
            },
          },
        ];
        return newData.length > 60 * 60
          ? newData.slice(1, 60 * 60 + 1)
          : newData;
      });
    }, 1000) as unknown) as number;

    return () => clearInterval(apiInterval.current as number);
  }, []);

  return (
    <div className={styles.root}>
      {data && dataSequence.length > 0 && (
        <>
          <Env data={data} />
          <Overview data={data} sequence={dataSequence} />
        </>
      )}
    </div>
  );
};

App.displayName = "App";
export default App;
