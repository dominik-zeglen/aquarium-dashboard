import React from "react";
import styles from "./App.module.css";
import Env from "./Env/Env";
import Overview from "./Overview/Overview";
import { useApolloClient, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client/core";
import {
  GetData,
  GetData_iteration,
  GetData_iteration_procreation,
} from "./gqlTypes/GetData";
import { Area, AreaVariables } from "./gqlTypes/Area";
import { AreaInput } from "../gqlTypes/globalTypes";

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

const areaQuery = gql`
  query Area($area: AreaInput!) {
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

    cellList(filter: { area: $area }) {
      edges {
        node {
          position {
            x
            y
          }
          species {
            id
          }
        }
      }
    }
  }
`;

const resolution = 2;

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
  const client = useApolloClient();
  const data = useQuery<GetData>(query, {
    fetchPolicy: "no-cache",
  });
  const area = useQuery<Area, AreaVariables>(areaQuery, {
    fetchPolicy: "no-cache",
    variables: {
      area: selectedArea,
    },
  });

  React.useEffect(() => {
    apiInterval.current = (setInterval(async () => {
      area.refetch();
      try {
        const response = await data.refetch();
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
  }, [client]);

  return (
    <div className={styles.root}>
      {area.data && data?.data && dataSequence.length > 0 && (
        <>
          <Env data={data.data?.iteration} />
          <Overview
            area={area.data?.cellList.edges.map((edge) => edge.node)}
            data={data.data?.iteration}
            grid={area.data?.speciesGrid}
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
