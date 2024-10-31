import fs from "fs";
import path from "path";

export interface Node {
  name: string;
  weight: number;
  children: Node[] | Node | null;
  maxStations: number;
}

type fieldsForRecord = "stringCombination" | "amountAppearance" | "weight";
type appearanceType = Record<fieldsForRecord, string | number>;

let allStringCombinationsAppearance: appearanceType[] = [];

const JsonFile = fs.readFileSync(path.resolve("assets/question5.json"), {
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
      AddCanisterToGlobalString(roots.name, roots.weight);
      if (Array.isArray(roots.children)) {
        for (const child of roots.children) {
          addToLocalString(child.name, canisterBombCheck, child.weight);
        }
      }
    }

    canisterBombCheck.forEach((specificBombInCanister) => {
      addBombsToGlobalString(
        specificBombInCanister.stringCombination as string,
        specificBombInCanister.amountAppearance as number,
        roots.maxStations,
        specificBombInCanister.weight as number
      );
    });
  }
};
const addToLocalString = (
  bombName: string,
  canisterBombToAdd: appearanceType[],
  weight: number
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
      weight: weight,
    });
  }
};

const addBombsToGlobalString = (
  bombName: string,
  amountOfBomb: number,
  maxStations: number,
  weight: number
) => {
  let stringArray = [
    amountOfBomb.toString(),
    "/",
    maxStations.toString(),
    " ",
    bombName,
  ];
  const bombCombinationString = stringArray.join("");
  const doesHaveValue = allStringCombinationsAppearance.some(
    (valueInAppearance) =>
      valueInAppearance.stringCombination === bombCombinationString
  );
  if (doesHaveValue) {
    allStringCombinationsAppearance.forEach((valueInAppearance) => {
      if (valueInAppearance.stringCombination === bombCombinationString) {
        valueInAppearance.amountAppearance =
          (valueInAppearance.amountAppearance as number) + 1;
      }
    });
  } else {
    allStringCombinationsAppearance.push({
      stringCombination: bombCombinationString,
      amountAppearance: 1,
      weight: weight,
    });
  }
};

const AddCanisterToGlobalString = (canisterName: string, weight: number) => {
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
      weight: weight,
    });
  }
};

const createCanistersStringForCnf = () => {
  let stringBombsCombination = "";
  allStringCombinationsAppearance.forEach((combination) => {
    if (combination.amountAppearance === 1) {
      let stringArray = [`(${combination.stringCombination as string})`, "+"];
      stringBombsCombination += stringArray.join("");
    } else {
      let stringArray = [
        combination.amountAppearance.toString(),
        "x",
        `(${combination.stringCombination as string})`,
        "+",
      ];
      stringBombsCombination += stringArray.join("");
    }
  });
  stringBombsCombination = stringBombsCombination.slice(0, -1);

  return stringBombsCombination;
};

const createMultiplyString = () => {
  let totalWeight = 0;
  allStringCombinationsAppearance.forEach((combination) => {
    const numberOfBombs = (combination.stringCombination as string).substring(
      0,
      1
    );

    if (!isNaN(Number(numberOfBombs))) {
      totalWeight +=
        Number(numberOfBombs) *
        (combination.amountAppearance as number) *
        (combination.weight as number);
    } else {
      totalWeight +=
        (combination.amountAppearance as number) *
        (combination.weight as number);
    }
  });
  return totalWeight;
};
const createCnf = (bombString: string, totalWeight: number) => {
  const stringForCnf = `${bombString}\n = ${totalWeight}`;

  fs.writeFile(path.resolve("assets/answer5.cnf"), stringForCnf, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("done");
  });
};

parseArmamentChain(enteredTree as Node[]);
const bombString = createCanistersStringForCnf();
const totalWeight = createMultiplyString();
createCnf(bombString, totalWeight);
