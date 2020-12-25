import classes from "./styles.module.css";
import React from "react";
import Card from "../Card/Card";
import clsx from "clsx";
import { LineChart, XAxis, YAxis, Line, CartesianGrid } from "recharts";
import uniqBy from "lodash/uniqBy";
import {
  GetData_iteration,
  GetData_iteration_procreation_species_edges,
  GetData_iteration_procreation_species_edges_node,
} from "../gqlTypes/GetData";
import { APIDataSequence } from "../App";

export interface OverviewProps {
  data: GetData_iteration;
  sequence: APIDataSequence[];
}

interface SortBy {
  asc: boolean;
  col: keyof GetData_iteration_procreation_species_edges_node;
}

const Overview: React.FC<OverviewProps> = ({ data, sequence }) => {
  const [resolution, setResolution] = React.useState(1);
  const [sortBy, setSortBy] = React.useState<SortBy>({
    asc: true,
    col: "id",
  });

  const lastSeconds = 60 * resolution;

  const herbivores = data?.procreation.species.edges.reduce(
    (acc, species) => (species.node.herbivore > 8 ? acc + 1 : acc),
    0
  );
  const carnivores = data?.procreation.species.edges.reduce(
    (acc, species) => (species.node.carnivore > 8 ? acc + 1 : acc),
    0
  );
  const funghi = data?.procreation.species.edges.reduce(
    (acc, species) => (species.node.funghi > 8 ? acc + 1 : acc),
    0
  );
  const trimmedSequence = [...sequence]
    .reverse()
    .slice(0, lastSeconds)
    .reverse()
    .filter((_, index) => index % resolution === 0);
  const chartData: APIDataSequence[] =
    trimmedSequence.length < lastSeconds / resolution
      ? [...Array(lastSeconds - trimmedSequence.length), ...trimmedSequence]
      : trimmedSequence;

  const sortSpecies = (
    a: GetData_iteration_procreation_species_edges,
    b: GetData_iteration_procreation_species_edges
  ) => {
    let result = 1;
    if (sortBy.col === "cells") {
      result = a.node.cells.count > b.node.cells.count ? 1 : -1;
    } else {
      result = a.node[sortBy.col] > b.node[sortBy.col] ? 1 : -1;
    }
    if (!sortBy.asc) {
      return -result;
    }

    return result;
  };

  const handleSort = (
    sort: keyof GetData_iteration_procreation_species_edges_node
  ) => {
    if (sortBy.col === sort) {
      setSortBy((prev) => ({
        ...prev,
        asc: !prev.asc,
      }));
    } else {
      setSortBy({
        asc: true,
        col: sort,
      });
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.grid}>
          <div>
            <Card header="Diet">
              <table>
                <colgroup>
                  <col className={classes.colName} />
                  <col className={classes.colValue} />
                </colgroup>
                <tr>
                  <td>Herbivores</td>
                  <td className={classes.colValue}>{herbivores}</td>
                </tr>
                <tr>
                  <td>Carnivores</td>
                  <td className={classes.colValue}>{carnivores}</td>
                </tr>
                <tr>
                  <td>Funghi</td>
                  <td className={classes.colValue}>{funghi}</td>
                </tr>
              </table>
            </Card>
            <Card header="Charts">
              <select
                onChange={(event) =>
                  setResolution(parseInt(event.target.value, 0))
                }
              >
                <option value={1}>5 Minutes</option>
                <option value={2}>10 Minutes</option>
                <option value={3}>15 Minutes</option>
                <option value={6}>30 Minutes</option>
                <option value={12}>1 Hour</option>
              </select>
            </Card>
          </div>
          <Card className={classes.waste} header="Waste">
            Waste tolerance: {data?.waste.minTolerance.toFixed(3)} -{" "}
            {data?.waste.maxTolerance.toFixed(3)}
            <div className={classes.divider} />
            <LineChart
              width={450}
              height={300}
              data={chartData.map((s) => ({
                x: s?.number,
                waste: s?.waste.toxicity,
              }))}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis dataKey="waste" />
              <Line
                animationDuration={0}
                connectNulls={false}
                dot={false}
                type="monotone"
                dataKey="waste"
                shapeRendering="optimizeSpeed"
                stroke="rgba(254, 211, 48,1.0)"
              />
            </LineChart>
          </Card>
          <div />
          <div>
            <Card header="Species">
              <table>
                <colgroup>
                  <col className={classes.colName} />
                  <col className={classes.colValue} />
                </colgroup>
                <tr>
                  <td>All</td>
                  <td className={classes.colValue}>
                    {data.procreation.species.count}
                  </td>
                </tr>
              </table>
            </Card>
          </div>
          <Card className={classes.waste} header="Population">
            <LineChart
              width={450}
              height={300}
              data={chartData.map((s) => ({
                x: s?.number,
                cells: s?.aliveCellCount,
              }))}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis dataKey="cells" />
              <Line
                connectNulls={false}
                dot={false}
                type="monotone"
                dataKey="cells"
                animationDuration={0}
                stroke="rgba(38, 222, 129,1.0)"
              />
            </LineChart>
          </Card>
          <div />
          <div />
          <Card className={classes.waste} header="Depth">
            <LineChart
              width={450}
              height={300}
              data={chartData.map((s) => ({
                x: s?.number,
                maxHeight: s?.procreation.maxHeight,
                minHeight: s?.procreation.minHeight,
              }))}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis dataKey="maxHeight" />
              <Line
                connectNulls={false}
                dot={false}
                type="monotone"
                dataKey="minHeight"
                animationDuration={0}
                stroke="rgba(252, 92, 101,1.0)"
              />
              <Line
                connectNulls={false}
                dot={false}
                type="monotone"
                dataKey="maxHeight"
                animationDuration={0}
                stroke="rgba(252, 92, 101,1.0)"
              />
            </LineChart>
          </Card>
          <div />
          <div />
          <Card header="Species" className={classes.species}>
            <table className={classes.speciesTable}>
              <colgroup>
                <col className={classes.colName} />
                <col className={classes.colHerbivore} />
                <col className={classes.colCarnivore} />
                <col className={classes.colFunghi} />
                <col className={classes.colSpecimens} />
              </colgroup>
              <thead>
                <tr>
                  <th
                    className={clsx(classes.colHeader, classes.colName, {
                      [classes.colActive]: sortBy.col === "id",
                    })}
                    onClick={() => handleSort("id")}
                  >
                    ID
                  </th>
                  <th
                    className={clsx(classes.colHeader, classes.colHerbivore, {
                      [classes.colActive]: sortBy.col === "herbivore",
                    })}
                    onClick={() => handleSort("herbivore")}
                  >
                    Herbivore
                  </th>
                  <th
                    className={clsx(classes.colHeader, classes.colCarnivore, {
                      [classes.colActive]: sortBy.col === "carnivore",
                    })}
                    onClick={() => handleSort("carnivore")}
                  >
                    Carnivore
                  </th>
                  <th
                    className={clsx(classes.colHeader, classes.colFunghi, {
                      [classes.colActive]: sortBy.col === "funghi",
                    })}
                    onClick={() => handleSort("funghi")}
                  >
                    Funghi
                  </th>
                  <th
                    className={clsx(classes.colHeader, classes.colSpecimens, {
                      [classes.colActive]: sortBy.col === "cells",
                    })}
                    onClick={() => handleSort("cells")}
                  >
                    Specimens
                  </th>
                </tr>
              </thead>
              <tbody>
                {uniqBy(data.procreation.species.edges, "node.id")
                  .sort(sortSpecies)
                  .map((species) => (
                    <tr key={species.node.id}>
                      <td className={classes.colName}>{species.node.id}</td>
                      <td className={classes.colHerbivore}>
                        {species.node.herbivore}
                      </td>
                      <td className={classes.colCarnivore}>
                        {species.node.carnivore}
                      </td>
                      <td className={classes.colFunghi}>
                        {species.node.funghi}
                      </td>
                      <td className={classes.colSpecimens}>
                        {species.node.cells.count}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Card>
          {/* <div />
          <div />
          <Card header="Species" className={classes.species}>
              
          </Card> */}
        </div>
      </div>
    </div>
  );
};

Overview.displayName = "Overview";
export default Overview;
