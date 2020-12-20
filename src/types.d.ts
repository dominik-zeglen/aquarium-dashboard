interface Species {
  id: number;
  emergedAt: number;
  extinct: boolean;
  herbivore: number;
  carnivore: number;
  funghi: number;
  timeToDie: number;
  wasteTolerance: number;
}
type Waste = Record<"waste" | "minTolerance" | "maxTolerance", number>;
interface Procreation {
  canProcreate: bool;
  minCd: number;
  maxCd: number;
  minHeight: number;
  maxHeight: number;
  species: Species[];
}

interface APIData {
  cellCount: number;
  aliveCellCount: number;
  waste: Waste;
  iteration: number;
  procreation: Procreation;
}

interface APIDataSequence extends APIData {
  procreation: Omit<Procreation, "species">;
}
