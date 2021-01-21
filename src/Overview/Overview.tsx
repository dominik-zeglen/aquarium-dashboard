import classes from "./styles.module.css";
import React from "react";
import Card from "../Card/Card";
import { LineChart, XAxis, YAxis, Line, CartesianGrid } from "recharts";
import { GetData_iteration, GetData_organismList } from "../gqlTypes/GetData";
import { APIDataSequence } from "../App";
import { Area_speciesGrid } from "../gqlTypes/Area";
import Map from "./Map";
import { AreaInput } from "../../gqlTypes/globalTypes";

export interface OverviewProps {
  area: GetData_organismList[];
  grid: Area_speciesGrid[];
  data: GetData_iteration;
  sequence: APIDataSequence[];
  selectedArea: AreaInput;
  selectedOrganismId: number;
  setSelectedArea: (area: AreaInput) => void;
  onCellClick: (id: number) => void;
}

const Overview: React.FC<OverviewProps> = ({
  area,
  grid,
  data,
  sequence,
  selectedArea,
  selectedOrganismId,
  setSelectedArea,
  onCellClick,
}) => {
  const [resolution, setResolution] = React.useState(1);

  const lastSeconds = 60 * resolution;

  const herbivores = data?.procreation.species.reduce(
    (acc, species) => (species.diet.includes("herbivore") ? acc + 1 : acc),
    0
  );
  const carnivores = 0;
  const funghi = data?.procreation.species.reduce(
    (acc, species) => (species.diet.includes("funghi") ? acc + 1 : acc),
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

  const selectedOrganism = area.find((o) => o.id === selectedOrganismId);
  const selectedOrganismSpecies = data.procreation.species.find(
    (s) => selectedOrganism?.species.id === s.id
  );

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
                    {data.procreation.species.length}
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
          <div>
            {selectedOrganism && (
              <Card header="Selected Organism">
                <table>
                  <colgroup>
                    <col className={classes.colName} />
                    <col className={classes.colValue} />
                  </colgroup>
                  <tr>
                    <td>ID</td>
                    <td className={classes.colValue}>{selectedOrganism.id}</td>
                  </tr>
                  <tr>
                    <td>Born</td>
                    <td className={classes.colValue}>
                      {data.number - selectedOrganism.bornAt} ago
                    </td>
                  </tr>
                </table>
                <hr />
                Cells
                <table>
                  <colgroup>
                    <col className={classes.colName} />
                    <col className={classes.colValue} />
                  </colgroup>
                  {selectedOrganism.cells.map((cell) => (
                    <>
                      <tr>
                        <td>ID</td>
                        <td className={classes.colValue}>{cell.id}</td>
                      </tr>
                      <tr>
                        <td>Cell Type ID</td>
                        <td className={classes.colValue}>{cell.type.id}</td>
                      </tr>
                    </>
                  ))}
                </table>
              </Card>
            )}
          </div>
          <Card header="Map" className={classes.map}>
            <Map
              area={area}
              grid={grid}
              selectedArea={selectedArea}
              selectedOrganismId={selectedOrganismId}
              setSelectedArea={setSelectedArea}
              species={data.procreation.species}
              onCellClick={onCellClick}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

Overview.displayName = "Overview";
export default Overview;
