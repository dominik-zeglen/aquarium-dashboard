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
  query GetData($area: AreaInput!, $id: Int!) {
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

    miniMap {
      position {
        x
        y
      }
      diets
    }

    organismList(filter: { area: $area }) {
      id
      bornAt
      position {
        x
        y
      }
      species {
        id
      }
    }

    organism(id: $id) {
      id
      bornAt
      cells {
        id
        alive
        type {
          id
        }
        position {
          x
          y
        }
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
  const [id, setId] = React.useState(0);
  const data = useQuery<GetData, GetDataVariables>(query, {
    fetchPolicy: "no-cache",
    variables: {
      area: selectedArea,
      id,
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
            grid={data.data?.miniMap}
            selectedOrganism={data.data?.organism}
            selectedOrganismId={id}
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            sequence={dataSequence}
            onCellClick={setId}
          />
        </>
      )}
    </div>
  );
};

App.displayName = "App";
export default App;
