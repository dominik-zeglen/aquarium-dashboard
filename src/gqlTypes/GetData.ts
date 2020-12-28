/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AreaInput } from "./../../gqlTypes/globalTypes";

// ====================================================
// GraphQL query operation: GetData
// ====================================================

export interface GetData_iteration_procreation_species_edges_node_cells {
  __typename: "CellConnection";
  count: number;
}

export interface GetData_iteration_procreation_species_edges_node {
  __typename: "Species";
  carnivore: number;
  funghi: number;
  herbivore: number;
  id: number;
  cells: GetData_iteration_procreation_species_edges_node_cells;
}

export interface GetData_iteration_procreation_species_edges {
  __typename: "SpeciesConnectionEdge";
  node: GetData_iteration_procreation_species_edges_node;
}

export interface GetData_iteration_procreation_species {
  __typename: "SpeciesConnection";
  count: number;
  edges: GetData_iteration_procreation_species_edges[];
}

export interface GetData_iteration_procreation {
  __typename: "IterationProcreation";
  maxHeight: number;
  minHeight: number;
  species: GetData_iteration_procreation_species;
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

export interface GetData_cellList_edges_node_position {
  __typename: "Point";
  x: number;
  y: number;
}

export interface GetData_cellList_edges_node_species {
  __typename: "Species";
  id: number;
}

export interface GetData_cellList_edges_node {
  __typename: "Cell";
  position: GetData_cellList_edges_node_position;
  species: GetData_cellList_edges_node_species;
}

export interface GetData_cellList_edges {
  __typename: "CellConnectionEdge";
  node: GetData_cellList_edges_node;
}

export interface GetData_cellList {
  __typename: "CellConnection";
  edges: GetData_cellList_edges[];
}

export interface GetData {
  iteration: GetData_iteration;
  speciesGrid: GetData_speciesGrid[];
  cellList: GetData_cellList;
}

export interface GetDataVariables {
  area: AreaInput;
}
