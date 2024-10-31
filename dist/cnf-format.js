import fs from "fs";
import path from "path";
let allStringCombinationsAppearance = [];
const JsonFile = fs.readFileSync(path.resolve("assets/question5.json"), {
    encoding: "utf-8",
});
const jsonObject = JSON.parse(JsonFile);
const roots = jsonObject;
const enteredTree = roots.children;
const parseArmamentChain = (roots) => {
    roots.forEach((root) => {
        runThroguhNodes(root.children);
    });
};
const runThroguhNodes = (roots) => {
    const canisterBombCheck = [];
    if (!Array.isArray(roots)) {
        if (roots.maxStations == 1) {
            return runThroguhNodes(roots.children);
        }
        else if (roots.maxStations > 1) {
            AddCanisterToGlobalString(roots.name, roots.weight);
            if (Array.isArray(roots.children)) {
                for (const child of roots.children) {
                    addToLocalString(child.name, canisterBombCheck, child.weight);
                }
            }
        }
        canisterBombCheck.forEach((specificBombInCanister) => {
            addBombsToGlobalString(specificBombInCanister.stringCombination, specificBombInCanister.amountAppearance, roots.maxStations, specificBombInCanister.weight);
        });
    }
};
const addToLocalString = (bombName, canisterBombToAdd, weight) => {
    const doesHaveValue = canisterBombToAdd.some((bombWithCounter) => bombWithCounter.stringCombination === bombName);
    if (doesHaveValue) {
        canisterBombToAdd.forEach((bombWithCounter) => {
            if (bombWithCounter.stringCombination === bombName) {
                bombWithCounter.amountAppearance =
                    bombWithCounter.amountAppearance + 1;
            }
        });
    }
    else {
        canisterBombToAdd.push({
            stringCombination: bombName,
            amountAppearance: 1,
            weight: weight,
        });
    }
};
const addBombsToGlobalString = (bombName, amountOfBomb, maxStations, weight) => {
    let stringArray = [
        amountOfBomb.toString(),
        "/",
        maxStations.toString(),
        " ",
        bombName,
    ];
    const bombCombinationString = stringArray.join("");
    //   console.log(bombCombinationString);
    const doesHaveValue = allStringCombinationsAppearance.some((valueInAppearance) => valueInAppearance.stringCombination === bombCombinationString);
    if (doesHaveValue) {
        allStringCombinationsAppearance.forEach((valueInAppearance) => {
            if (valueInAppearance.stringCombination === bombCombinationString) {
                valueInAppearance.amountAppearance =
                    valueInAppearance.amountAppearance + 1;
            }
        });
    }
    else {
        allStringCombinationsAppearance.push({
            stringCombination: bombCombinationString,
            amountAppearance: 1,
            weight: weight,
        });
    }
};
const AddCanisterToGlobalString = (canisterName, weight) => {
    const doesHaveValue = allStringCombinationsAppearance.some((valueInAppearance) => valueInAppearance.stringCombination === canisterName);
    if (doesHaveValue) {
        allStringCombinationsAppearance.forEach((valueInAppearance) => {
            if (valueInAppearance.stringCombination === canisterName) {
                valueInAppearance.amountAppearance =
                    valueInAppearance.amountAppearance + 1;
            }
        });
    }
    else {
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
            let stringArray = [`(${combination.stringCombination})`, "+"];
            stringBombsCombination += stringArray.join("");
        }
        else {
            let stringArray = [
                combination.amountAppearance.toString(),
                "x",
                `(${combination.stringCombination})`,
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
        const numberOfBombs = combination.stringCombination.substring(0, 1);
        if (!isNaN(Number(numberOfBombs))) {
            totalWeight +=
                Number(numberOfBombs) *
                    combination.amountAppearance *
                    combination.weight;
        }
        else {
            totalWeight +=
                combination.amountAppearance *
                    combination.weight;
        }
    });
    console.log(totalWeight);
    return totalWeight;
};
const createCnf = (bombString, totalWeight) => {
    const stringForCnf = `${bombString}\n = ${totalWeight}`;
    fs.writeFile(path.resolve("assets/answer5.cnf"), stringForCnf, (err) => {
        if (err) {
            console.log(err);
        }
        console.log("done");
    });
    console.log("created file");
};
parseArmamentChain(enteredTree);
console.log(allStringCombinationsAppearance);
const bombString = createCanistersStringForCnf();
const totalWeight = createMultiplyString();
createCnf(bombString, totalWeight);
//# sourceMappingURL=cnf-format.js.map