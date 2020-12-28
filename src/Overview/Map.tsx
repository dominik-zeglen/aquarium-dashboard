import React from "react";
import { AreaInput, PointInput } from "../../gqlTypes/globalTypes";
import { Area_cellList_edges_node, Area_speciesGrid } from "../gqlTypes/Area";
import { GetData_iteration_procreation_species_edges_node } from "../gqlTypes/GetData";
import classes from "./styles.module.css";

export interface MapProps {
  area: Area_cellList_edges_node[];
  grid: Area_speciesGrid[];
  selectedArea: AreaInput;
  setSelectedArea: (area: AreaInput) => void;
  species: GetData_iteration_procreation_species_edges_node[];
}

function getPixelColorHex(
  s: GetData_iteration_procreation_species_edges_node
): number {
  let pixel = 0x0;
  if (s.carnivore > 0) {
    pixel |= 0xaa0000;
  }
  if (s.herbivore > 0) {
    pixel |= 0x00aa00;
  }
  if (s.funghi > 0) {
    pixel |= 0x0000aa;
  }

  return pixel;
}
function getColorFromHex(hex: number): string {
  let colorStr = hex.toString(16);
  if (colorStr.length < 6) {
    colorStr =
      Array(6 - colorStr.length)
        .fill(0)
        .reduce((acc, v) => acc + v, "") + colorStr;
  }

  return "#" + colorStr;
}

const Map: React.FC<MapProps> = ({
  area,
  grid,
  species,
  selectedArea,
  setSelectedArea,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const drawMiniMap = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(400, 400, 100, 100);
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#8a8a8a";
    ctx.beginPath();
    ctx.rect(400, 400, 99, 99);
    ctx.stroke();

    grid.forEach((block) => {
      const gridSpecies = species.filter((s) =>
        block.species.map((sp) => sp.id).includes(s.id)
      );

      let color = gridSpecies.reduce(
        (pixel, s) => pixel | getPixelColorHex(s),
        0x0
      );

      ctx.fillStyle = getColorFromHex(color);
      ctx.fillRect(400 + block.position.x, 400 + block.position.y, 1, 1);
    });

    ctx.strokeStyle = "#c7c7c7";
    ctx.beginPath();
    ctx.rect(
      selectedArea.start.x / 100 + 400,
      selectedArea.start.y / 100 + 400,
      10,
      10
    );
    ctx.stroke();
  };

  const drawArea = (ctx: CanvasRenderingContext2D) => {
    const sortedArea = area
      .map((cell) => {
        const cellSpecies = species.find((s) => s.id === cell.species.id);

        return {
          ...cell,
          color: cellSpecies
            ? getColorFromHex(getPixelColorHex(cellSpecies))
            : "#000000",
        };
      })
      .sort((a, b) => (a.color > b.color ? 1 : -1));

    sortedArea.forEach((cell) => {
      if (ctx.strokeStyle !== cell.color) {
        ctx.strokeStyle = cell.color;
      }

      ctx.beginPath();
      ctx.moveTo(
        (cell.position.x - selectedArea.start.x) / 2 - 2,
        (cell.position.y - selectedArea.start.y) / 2 - 2
      );
      ctx.lineTo(
        (cell.position.x - selectedArea.start.x) / 2 + 2,
        (cell.position.y - selectedArea.start.y) / 2 + 2
      );
      ctx.moveTo(
        (cell.position.x - selectedArea.start.x) / 2 - 2,
        (cell.position.y - selectedArea.start.y) / 2 + 2
      );
      ctx.lineTo(
        (cell.position.x - selectedArea.start.x) / 2 + 2,
        (cell.position.y - selectedArea.start.y) / 2 - 2
      );
      ctx.stroke();
    });
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#c7c7c7";
    ctx.rect(1, 1, 498, 498);
    ctx.stroke();

    drawArea(ctx);
    drawMiniMap(ctx);
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");

      if (context) {
        draw(context);
      }
    }

    return () => {
      if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    };
  }, [area, species]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const point: PointInput = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    if (point.x > 400 && point.y > 400) {
      setSelectedArea({
        end: {
          x: (point.x + 5 - 400) * 100,
          y: (point.y + 5 - 400) * 100,
        },
        start: {
          x: (point.x - 5 - 400) * 100,
          y: (point.y - 5 - 400) * 100,
        },
      });
    }
  };

  return (
    <canvas
      className={classes.mapCanvas}
      onMouseDown={handleMouseDown}
      ref={canvasRef}
      height={500}
      width={500}
    />
  );
};

export default Map;
