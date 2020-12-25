import React from "react";
import styles from "./App.module.css";
import Env from "./Env/Env";
import Overview from "./Overview/Overview";
import { useApolloClient } from "@apollo/client/react";
import { gql } from "@apollo/client/core";
import {
  GetData,
  GetData_iteration,
  GetData_iteration_procreation,
} from "./gqlTypes/GetData";

const query = gql`
  query GetData {
    iteration {
      number
      aliveCellCount
      number
      procreation {
        maxHeight
        minHeight
        species {
          count
          edges {
            node {
              carnivore
              funghi
              herbivore
              id
              cells {
                count
              }
            }
          }
        }
      }
      waste {
        maxTolerance
        minTolerance
        toxicity
      }
    }
  }
`;

export interface APIDataSequence
  extends Omit<GetData_iteration, "procreation"> {
  procreation: Omit<GetData_iteration_procreation, "species">;
}
const App: React.FC = () => {
  const apiInterval = React.useRef<number | null>(null);
  const [data, setData] = React.useState<GetData>();
  const [dataSequence, setDataSequence] = React.useState<APIDataSequence[]>([]);
  const client = useApolloClient();

  React.useEffect(() => {
    apiInterval.current = (setInterval(async () => {
      const response = await client.query<GetData>({
        query,
        fetchPolicy: "no-cache",
      });
      setData(response.data);
      setDataSequence((prev) => {
        const newData = [
          ...prev,
          {
            ...response.data.iteration,
            procreation: {
              ...response.data.iteration.procreation,
              species: undefined,
            },
          },
        ];
        return newData.length > (60 * 60) / 5 ? newData.slice(1) : newData;
      });
    }, 5000) as unknown) as number;

    return () => clearInterval(apiInterval.current as number);
  }, [client]);

  return (
    <div className={styles.root}>
      {data && dataSequence.length > 0 && (
        <>
          <Env data={data?.iteration} />
          <Overview data={data?.iteration} sequence={dataSequence} />
        </>
      )}
    </div>
  );
};

App.displayName = "App";
export default App;
