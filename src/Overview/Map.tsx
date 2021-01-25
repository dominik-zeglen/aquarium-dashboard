import React from "react";
import { AreaInput, PointInput } from "../../gqlTypes/globalTypes";
import {} from "../gqlTypes/Area";
import {
  GetData_iteration_procreation_species,
  GetData_organismList,
  GetData_miniMap,
} from "../gqlTypes/GetData";
import classes from "./styles.module.css";
import {
  drawCell,
  getColorFromHex,
  getDistanceInDimension,
  getPixelColorHex,
} from "./utils";

export interface MapProps {
  area: GetData_organismList[];
  grid: GetData_miniMap[];
  selectedArea: AreaInput;
  selectedOrganismId: number;
  setSelectedArea: (area: AreaInput) => void;
  species: GetData_iteration_procreation_species[];
  onCellClick: (id: number) => void;
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
      const color = getPixelColorHex(block.diets);

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
      const organismSpecies = species.find((s) => s.id === organism.species.id);
      ctx.strokeStyle = organismSpecies
        ? getColorFromHex(getPixelColorHex(organismSpecies.diet))
        : "#000000";

      drawCell(
        ctx,
        (organism.position.x - selectedArea.start.x) / 2,
        (organism.position.y - selectedArea.start.y) / 2
      );
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
