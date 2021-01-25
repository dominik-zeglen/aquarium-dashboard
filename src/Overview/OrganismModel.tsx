import React from "react";
import {
  GetData_iteration_procreation_species,
  GetData_organism,
} from "../gqlTypes/GetData";
import classes from "./styles.module.css";
import { drawCell, getColorFromHex, getPixelColorHex } from "./utils";

export interface OrganismModelProps {
  organism: GetData_organism;
  species: GetData_iteration_procreation_species[];
}

const OrganismModel: React.FC<OrganismModelProps> = ({ organism, species }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const drawModel = (ctx: CanvasRenderingContext2D) => {
    organism.cells.forEach((cell) => {
      const m = 7;
      const x = cell.position.x * m + 100;
      const y = cell.position.y * m + 100;

      const organismSpecies = species.find((s) => s.id === organism.species.id);
      const cellType = organismSpecies?.cellTypes.find(
        (ct) => ct.id === cell.type.id
      );

      ctx.strokeStyle =
        cell.alive && cellType
          ? getColorFromHex(getPixelColorHex(cellType.diet))
          : "#000000";
      drawCell(ctx, x, y);
    });
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    drawModel(ctx);

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#c7c7c7";
    ctx.rect(1, 1, 198, 198);
    ctx.stroke();
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
  }, [organism]);

  return (
    <canvas
      className={classes.mapCanvas}
      ref={canvasRef}
      height={200}
      width={200}
    />
  );
};

export default OrganismModel;
