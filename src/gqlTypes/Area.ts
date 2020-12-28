/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AreaInput } from "./../../gqlTypes/globalTypes";

// ====================================================
// GraphQL query operation: Area
// ====================================================

export interface Area_speciesGrid_position {
  __typename: "Point";
  x: number;
  y: number;
}

export interface Area_speciesGrid_species {
  __typename: "Species";
  id: number;
}

export interface Area_speciesGrid {
  __typename: "SpeciesGridElement";
  position: Area_speciesGrid_position;
  species: Area_speciesGrid_species[];
}

export interface Area_cellList_edges_node_position {
  __typename: "Point";
  x: number;
  y: number;
}

export interface Area_cellList_edges_node_species {
  __typename: "Species";
  id: number;
}

export interface Area_cellList_edges_node {
  __typename: "Cell";
  position: Area_cellList_edges_node_position;
  species: Area_cellList_edges_node_species;
}

export interface Area_cellList_edges {
  __typename: "CellConnectionEdge";
  node: Area_cellList_edges_node;
}

export interface Area_cellList {
  __typename: "CellConnection";
  edges: Area_cellList_edges[];
}

export interface Area {
  speciesGrid: Area_speciesGrid[];
  cellList: Area_cellList;
}

export interface AreaVariables {
  area: AreaInput;
}
