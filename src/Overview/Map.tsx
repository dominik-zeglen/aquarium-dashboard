import React from "react";
import { AreaInput, PointInput } from "../../gqlTypes/globalTypes";
import {} from "../gqlTypes/Area";
import {
  GetData_iteration_procreation_species,
  GetData_organismList,
  GetData_speciesGrid,
} from "../gqlTypes/GetData";
import classes from "./styles.module.css";

export interface MapProps {
  area: GetData_organismList[];
  grid: GetData_speciesGrid[];
  selectedArea: AreaInput;
  selectedOrganismId: number;
  setSelectedArea: (area: AreaInput) => void;
  species: GetData_iteration_procreation_species[];
  onCellClick: (id: number) => void;
}

function getPixelColorHex(diet: string[]): number {
  let pixel = 0x0;

  if (diet.includes("herbivore")) {
    pixel |= 0x00aa00;
  }
  if (diet.includes("funghi")) {
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

function getDistanceInDimension(a: number, b: number): number {
  return (a - b) * (a - b);
}

function findInArea(
  point: PointInput,
  selectedArea: PointInput,
  organisms: GetData_organismList[]
): GetData_organismList {
  return organisms
    .map((o) => ({
      ...o,
      distance:
        getDistanceInDimension(point.x, (o.position.x - selectedArea.x) / 2) +
        getDistanceInDimension(point.y, (o.position.y - selectedArea.y) / 2),
    }))
    .sort((a, b) => (a.distance > b.distance ? 1 : -1))[0];
}

const Map: React.FC<MapProps> = ({
  area,
  grid,
  species,
  selectedArea,
  selectedOrganismId,
  setSelectedArea,
  onCellClick,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const drawMiniMap = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(400, 400, 100, 100);
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#333333";
    ctx.beginPath();
    ctx.rect(400, 400, 99, 99);
    ctx.stroke();

    grid.forEach((block) => {
      const gridSpecies = species.filter((s) =>
        block.species.map((sp) => sp.id).includes(s.id)
      );

      let color = gridSpecies.reduce(
        (pixel, s) => pixel | getPixelColorHex(s.diet),
        0x0
      );

      ctx.fillStyle = getColorFromHex(color);
      ctx.fillRect(400 + block.position.x, 400 + block.position.y, 1, 1);
    });

    ctx.strokeStyle = "#333333";
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
    area.forEach((organism) => {
      organism.cells.forEach((cell) => {
        const organismSpecies = species.find(
          (s) => s.id === organism.species.id
        );
        const cellType = organismSpecies?.cellTypes.find(
          (ct) => ct.id === cell.type.id
        );
        ctx.strokeStyle = cellType
          ? getColorFromHex(getPixelColorHex(cellType.diet))
          : "#000000";
        const x = organism.position.x + cell.position.x;
        const y = organism.position.y + cell.position.y;

        ctx.beginPath();
        ctx.moveTo(
          (x - selectedArea.start.x) / 2 - 2,
          (y - selectedArea.start.y) / 2 - 2
        );
        ctx.lineTo(
          (x - selectedArea.start.x) / 2 + 2,
          (y - selectedArea.start.y) / 2 + 2
        );
        ctx.moveTo(
          (x - selectedArea.start.x) / 2 - 2,
          (y - selectedArea.start.y) / 2 + 2
        );
        ctx.lineTo(
          (x - selectedArea.start.x) / 2 + 2,
          (y - selectedArea.start.y) / 2 - 2
        );
        ctx.stroke();
      });
    });
  };

  const drawSelected = (ctx: CanvasRenderingContext2D) => {
    const selectedOrganism = area.find((o) => o.id === selectedOrganismId);

    if (selectedOrganism) {
      ctx.strokeStyle = "#c7c7c7";
      ctx.beginPath();
      ctx.arc(
        (selectedOrganism.position.x - selectedArea.start.x) / 2,
        (selectedOrganism.position.y - selectedArea.start.y) / 2,
        7,
        0,
        2 * Math.PI
      );
      ctx.stroke();
      ctx.closePath();
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#c7c7c7";
    ctx.rect(1, 1, 498, 498);
    ctx.stroke();

    drawArea(ctx);
    drawMiniMap(ctx);
    drawSelected(ctx);
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
    } else {
      onCellClick(findInArea(point, selectedArea.start, area).id);
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
