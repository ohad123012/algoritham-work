import fs from "fs";
import path from "path";
let allStringCombinationsAppearance = [];
const JsonFile = fs.readFileSync(path.resolve("assets/question1.json"), {
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
const addToLocalString = (bombName, canisterBombToAdd) => {
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
        });
    }
};
const addBombsToGlobalString = (name, amountOfBomb, maxStations, weight) => { };
const AddCanisterToGlobalString = (canisterName) => {
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
        });
    }
};
parseArmamentChain(enteredTree);
//# sourceMappingURL=cnf-format.js.map