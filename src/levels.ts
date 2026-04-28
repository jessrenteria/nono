import levels5x5 from "@/data/levels/5x5.json";
import { type PuzzleData } from '@/puzzle-data';

type StringLevelSetId = {
  type: 'string';
  levelSet: string;
};

type DimsLevelSetId = {
  type: 'dims';
  rows: number,
  columns: number,
};

type LevelSetId =
  | StringLevelSetId
  | DimsLevelSetId;

export function getLevelSet(id: LevelSetId) : PuzzleData[] | undefined {
  switch (id.type) {
    case 'string':
      switch (id.levelSet) {
        case '5x5':
          return levels5x5.puzzles as PuzzleData[];
      }
      break;
    case 'dims':
      if (id.rows === 5 && id.columns === 5) {
        return levels5x5.puzzles as PuzzleData[];
      }
      break;
  }
  return undefined;
}
