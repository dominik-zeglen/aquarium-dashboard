import React from "react";
import styles from "./App.module.css";
import Env from "./Env/Env";
import Overview from "./Overview/Overview";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client/core";
import {
  GetData,
  GetData_iteration,
  GetData_iteration_procreation,
  GetDataVariables,
} from "./gqlTypes/GetData";
import { AreaInput } from "../gqlTypes/globalTypes";

const query = gql`
  query GetData($area: AreaInput!) {
    iteration {
      number
      aliveCellCount
      number
      procreation {
        maxHeight
        minHeight
        species {
          id
          cellTypes {
            id
            diet
          }
          diet
        }
      }
      waste {
        maxTolerance
        minTolerance
        toxicity
      }
    }
    speciesGrid(
      area: { start: { x: 0, y: 0 }, end: { x: 1e5, y: 1e5 }, scale: 100 }
    ) {
      position {
        x
        y
      }
      species {
        id
      }
    }

    organismList(filter: { area: $area }) {
      id
      bornAt
      cells {
        id
        type {
          id
        }
        position {
          x
          y
        }
      }
      position {
        x
        y
      }
      species {
        id
      }
    }
  }
`;

const resolution = 1;

export interface APIDataSequence
  extends Omit<GetData_iteration, "procreation"> {
  procreation: Omit<GetData_iteration_procreation, "species">;
}
const App: React.FC = () => {
  const apiInterval = React.useRef<number | null>(null);
  const [dataSequence, setDataSequence] = React.useState<APIDataSequence[]>([]);
  const [selectedArea, setSelectedArea] = React.useState<AreaInput>({
    end: { x: 1000, y: 1000 },
    start: { x: 0, y: 0 },
  });
  const data = useQuery<GetData, GetDataVariables>(query, {
    fetchPolicy: "no-cache",
    variables: {
      area: selectedArea,
    },
  });

  React.useEffect(() => {
    apiInterval.current = (setInterval(async () => {
      try {
        const response = await data.refetch();
        const title = document.querySelector("title");

        if (title) {
          title.innerHTML = `Iteration ${response.data.iteration.number}`;
        }

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
          return newData.length > (60 * 60) / resolution
            ? newData.slice(1)
            : newData;
        });
      } catch {
        console.warn("Failed to fetch");
      }
    }, resolution * 1000) as unknown) as number;

    return () => clearInterval(apiInterval.current as number);
  }, []);

  return (
    <div className={styles.root}>
      {data?.data && dataSequence.length > 0 && (
        <>
          <Env data={data.data?.iteration} />
          <Overview
            area={data.data?.organismList}
            data={data.data?.iteration}
            grid={data.data?.speciesGrid}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            sequence={dataSequence}
          />
        </>
      )}
    </div>
  );
};

App.displayName = "App";
export default App;
