/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AreaInput } from "./../../gqlTypes/globalTypes";

// ====================================================
// GraphQL query operation: GetData
// ====================================================

export interface GetData_iteration_procreation_species_cellTypes {
  __typename: "CellType";
  id: number;
  diet: string[];
}

export interface GetData_iteration_procreation_species {
  __typename: "Species";
  id: number;
  cellTypes: GetData_iteration_procreation_species_cellTypes[];
  diet: string[];
}

export interface GetData_iteration_procreation {
  __typename: "IterationProcreation";
  maxHeight: number;
  minHeight: number;
  species: GetData_iteration_procreation_species[];
}

export interface GetData_iteration_waste {
  __typename: "IterationWaste";
  maxTolerance: number;
  minTolerance: number;
  toxicity: number;
}

export interface GetData_iteration {
  __typename: "Iteration";
  number: number;
  aliveCellCount: number;
  procreation: GetData_iteration_procreation;
  waste: GetData_iteration_waste;
}

export interface GetData_speciesGrid_position {
  __typename: "Point";
  x: number;
  y: number;
}

export interface GetData_speciesGrid_species {
  __typename: "Species";
  id: number;
}

export interface GetData_speciesGrid {
  __typename: "SpeciesGridElement";
  position: GetData_speciesGrid_position;
  species: GetData_speciesGrid_species[];
}

export interface GetData_organismList_cells_type {
  __typename: "CellType";
  id: number;
}

export interface GetData_organismList_cells_position {
  __typename: "Point";
  x: number;
  y: number;
}

export interface GetData_organismList_cells {
  __typename: "Cell";
  id: number;
  type: GetData_organismList_cells_type;
  position: GetData_organismList_cells_position;
}

export interface GetData_organismList_position {
  __typename: "Point";
  x: number;
  y: number;
}

export interface GetData_organismList_species {
  __typename: "Species";
  id: number;
}

export interface GetData_organismList {
  __typename: "Organism";
  id: number;
  bornAt: number;
  cells: GetData_organismList_cells[];
  position: GetData_organismList_position;
  species: GetData_organismList_species;
}

export interface GetData_organism_species {
  __typename: "Species";
  id: number;
}

export interface GetData_organism {
  __typename: "Organism";
  id: number;
  bornAt: number;
  species: GetData_organism_species;
}

export interface GetData {
  iteration: GetData_iteration;
  speciesGrid: GetData_speciesGrid[];
  organismList: GetData_organismList[];
  organism: GetData_organism | null;
}

export interface GetDataVariables {
  area: AreaInput;
  id: number;
}
