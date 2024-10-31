import fs from "fs";
import path from "path";

export interface Node {
  name: string;
  weight: number;
  children: Node[] | Node | null;
  maxStations: number;
}

type fieldsForRecord = "stringCombination" | "amountAppearance";
type appearanceType = Record<fieldsForRecord, string | number>;

let allStringCombinationsAppearance: appearanceType[] = [];

const JsonFile = fs.readFileSync(path.resolve("assets/question1.json"), {
  encoding: "utf-8",
});

const jsonObject = JSON.parse(JsonFile);

const roots: Node = jsonObject;
const enteredTree = roots.children;

const parseArmamentChain = (roots: Node[]) => {
  roots.forEach((root) => {
    runThroguhNodes(root.children);
  });
};

const runThroguhNodes = (roots: Node[] | Node) => {
  const canisterBombCheck: appearanceType[] = [];

  if (!Array.isArray(roots)) {
    if (roots.maxStations == 1) {
      return runThroguhNodes(roots.children);
    } else if (roots.maxStations > 1) {
      AddCanisterToGlobalString(roots.name);
      if (Array.isArray(roots.children)) {
        for (const child of roots.children) {
          addToLocalString(child.name, canisterBombCheck);
        }
      }
    }
    console.log(canisterBombCheck);
  }
};
const addToLocalString = (
  bombName: string,
  canisterBombToAdd: appearanceType[]
) => {
  const doesHaveValue = canisterBombToAdd.some(
    (bombWithCounter) => bombWithCounter.stringCombination === bombName
  );

  if (doesHaveValue) {
    canisterBombToAdd.forEach((bombWithCounter) => {
      if (bombWithCounter.stringCombination === bombName) {
        bombWithCounter.amountAppearance =
          (bombWithCounter.amountAppearance as number) + 1;
      }
    });
  } else {
    canisterBombToAdd.push({
      stringCombination: bombName,
      amountAppearance: 1,
    });
  }
};

const addBombsToGlobalString = (
  bombName: string,
  amountOfBomb: number,
  maxStations: number,
  weight: number
) => {
  // const bombCombinationString = amountOfBomb/maxStations bombName
  const doesHaveValue = allStringCombinationsAppearance.some(
    (valueInAppearance) =>
      valueInAppearance.stringCombination === bombCombinationString
  );
};

const AddCanisterToGlobalString = (canisterName: string) => {
  const doesHaveValue = allStringCombinationsAppearance.some(
    (valueInAppearance) => valueInAppearance.stringCombination === canisterName
  );

  if (doesHaveValue) {
    allStringCombinationsAppearance.forEach((valueInAppearance) => {
      if (valueInAppearance.stringCombination === canisterName) {
        valueInAppearance.amountAppearance =
          (valueInAppearance.amountAppearance as number) + 1;
      }
    });
  } else {
    allStringCombinationsAppearance.push({
      stringCombination: canisterName,
      amountAppearance: 1,
    });
  }
};
parseArmamentChain(enteredTree as Node[]);
