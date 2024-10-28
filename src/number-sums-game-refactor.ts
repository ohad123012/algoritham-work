import combinations from "combinations";

// let numbersGrid = [
//   [0, 17, 8, 14, 18, 11, 10],
//   [2, 1, 5, 3, 4, 1, 4],
//   [13, 1, 9, 8, 9, 1, 3],
//   [14, 7, 7, 5, 9, 1, 4],

//   [13, 8, 6, 2, 7, 5, 7],

//   [19, 6, 3, 9, 3, 4, 3],

//   [17, 7, 5, 5, 5, 3, 6],
// ];

// let numbersGrid = [
//   [0, 9, 7, 24, 10, 24, 25, 6, 1],
//   [14, 2, 7, 9, 2, 2, 3, 9, 6],
//   [11, 7, 3, 1, 2, 9, 6, 7, 1],
//   [15, 2, 5, 6, 9, 9, 2, 5, 7],
//   [12, 1, 1, 1, 8, 9, 3, 6, 8],
//   [14, 3, 1, 5, 7, 1, 3, 6, 4],
//   [8, 4, 4, 3, 3, 1, 9, 3, 1],
//   [11, 8, 5, 1, 8, 9, 3, 7, 8],
//   [21, 9, 7, 9, 8, 5, 7, 9, 9],
// ];

let numbersGrid = [
  [0, 32, 4, 8, 27, 15, 16, 4, 1],
  [14, 8, 4, 7, 1, 2, 2, 8, 1],
  [14, 1, 6, 8, 6, 7, 1, 7, 9],
  [16, 2, 1, 9, 7, 5, 7, 3, 2],
  [13, 4, 6, 7, 1, 2, 8, 8, 3],
  [10, 7, 5, 8, 2, 1, 5, 8, 1],
  [18, 9, 6, 4, 5, 4, 8, 4, 9],
  [16, 1, 7, 6, 6, 3, 9, 2, 6],
  [6, 1, 4, 1, 1, 4, 6, 8, 4],
];

const counterCircleGrid = Array.from({ length: numbersGrid.length }, () =>
  Array.from({ length: numbersGrid[0].length }, () => 0)
);
for (let i = 1; i < numbersGrid[0].length; i++) {
  counterCircleGrid[0][i] = numbersGrid[0][i];
}
for (let i = 1; i < numbersGrid.length; i++) {
  counterCircleGrid[i][0] = numbersGrid[i][0];
}

const getCol = (numbersGrid: number[][], colIndex: number) =>
  numbersGrid.map((numbers) => numbers[colIndex]);

const setCol = (
  numbersGrid: number[][],
  colIndex: number,
  colToReplace: number[]
) => {
  return numbersGrid.map((row, rowIndex) => {
    const newRow = [...row];
    newRow[colIndex] = colToReplace[rowIndex];
    return newRow;
  });
};

const checkIfAnswerRight = (answer: number, answerArray: number[]) => {
  let sumArr = 0;
  for (let i = 1; i < answerArray.length; i++) {
    if (!Number.isNaN(answerArray[i])) {
      sumArr += answerArray[i];
    }
  }

  if (sumArr == answer) {
    return true;
  }
  return false;
};

const createIndexArray = (numbersArray: number[]) => {
  const indexArray = numbersArray.map((num, i) => {
    return i;
  });
  return indexArray;
};

const getSumArrayByIndexes = (
  numbersArray: number[],
  indexesArray: number[]
) => {
  let sumOfArray = 0;

  for (let i = 0; i < indexesArray.length; i++) {
    sumOfArray += numbersArray[indexesArray[i]];
  }

  return sumOfArray;
};

const fillRightArray = (
  finishedArray: number[],
  arrayIndex: number,
  isRow: boolean
) => {
  console.log("fill this array: ", finishedArray, arrayIndex, isRow);
  for (let i = 1; i < finishedArray.length; i++) {
    if (isRow) {
      console.log(finishedArray[i], counterCircleGrid[arrayIndex][i]);
      if (
        !Number.isNaN(finishedArray[i]) &&
        counterCircleGrid[arrayIndex][i] != 1
      ) {
        console.log("entered if for: ", i, isRow);
        counterCircleGrid[arrayIndex][i] = 2; // might need 2
        ///// might change
        console.log(numbersGrid[arrayIndex][0]);
      }
      numbersGrid[arrayIndex][0] = NaN;
    } else {
      if (
        !Number.isNaN(finishedArray[i]) &&
        counterCircleGrid[i][arrayIndex] != 1
      ) {
        console.log("entered if for: ", i, isRow);

        counterCircleGrid[i][arrayIndex] = 2; // might need 2
        numbersGrid[0][arrayIndex] = NaN;
      }
      numbersGrid[0][arrayIndex] = NaN;
    }
  }
};

const removeBiggerThanAnswerNumbers = (numbersGrid: number[][]) => {
  for (let i = 1; i < numbersGrid.length; i++) {
    for (let j = 1; j < numbersGrid[0].length; j++) {
      if (
        (counterCircleGrid[i][0] < numbersGrid[i][j] &&
          counterCircleGrid[i][0] != 0) ||
        (counterCircleGrid[0][j] < numbersGrid[i][j] &&
          counterCircleGrid[0][j] != 0) // was numbersGrid instaed of counterCircleGrid
      ) {
        console.log(
          "set number ",
          numbersGrid[i][j],
          "to NaN at position",
          i,
          j,
          "because bigger than answer"
        );
        numbersGrid[i][j] = NaN;
        counterCircleGrid[i][j] = -1;
      }
    }
  }
  return numbersGrid;
};

const updateCounterTable = (numbersGrid: number[][]) => {
  for (let i = 1; i < numbersGrid.length; i++) {
    const col = getCol(numbersGrid, i);
    console.log(
      "row: ",
      i,
      checkIfAnswerRight(numbersGrid[i][0], numbersGrid[i])
    );
    if (checkIfAnswerRight(numbersGrid[i][0], numbersGrid[i])) {
      fillRightArray(numbersGrid[i], i, true);
    } else if (checkIfAnswerRight(numbersGrid[0][i], col)) {
      fillRightArray(col, i, false);
    } else {
      console.log(
        "make overall smaller ",
        i,
        checkIfAnswerRight(numbersGrid[i][0], numbersGrid[i])
      );
      for (let j = 1; j < numbersGrid[0].length; j++) {
        if (counterCircleGrid[i][j] == 2) {
          if (counterCircleGrid[i][0] - numbersGrid[i][j] >= 0) {
            counterCircleGrid[i][0] =
              counterCircleGrid[i][0] - numbersGrid[i][j];
          }
          if (counterCircleGrid[0][j] - numbersGrid[i][j] >= 0) {
            counterCircleGrid[0][j] =
              counterCircleGrid[0][j] - numbersGrid[i][j];
          }
          console.log("position ", i, j, "became 1: ", counterCircleGrid[i][j]);
          counterCircleGrid[i][j] = 1;
        }
      }
    }
  }
};

const getAllAnswersOfAnArrayIndexes = (
  numbersArray: number[],
  arrayAnswer: number
) => {
  const arrayWithoutAnswer = numbersArray.slice(1);
  const indexArray = createIndexArray(arrayWithoutAnswer);
  const allCombinationsIndexes = combinations(indexArray);
  const goodCombinations = [];

  for (let i = 0; i < allCombinationsIndexes.length; i++)
    if (
      getSumArrayByIndexes(arrayWithoutAnswer, allCombinationsIndexes[i]) ==
      arrayAnswer
    ) {
      goodCombinations.push(allCombinationsIndexes[i]);
    }

  return goodCombinations;
};

const removeUnusedNumbersRow = (numbersGrid: number[][]) => {
  for (let i = 1; i < numbersGrid.length; i++) {
    if (!Number.isNaN(counterCircleGrid[i][0])) {
      const allGoodCombinations = getAllAnswersOfAnArrayIndexes(
        numbersGrid[i],
        counterCircleGrid[i][0]
      );
      const indexArray = createIndexArray(numbersGrid[i].slice(1));

      let appearancesArray = Array.apply(
        null,
        Array(numbersGrid[i].length)
      ).map(Number.prototype.valueOf, 0);

      for (let j = 0; j < indexArray.length; j++) {
        for (let c = 0; c < allGoodCombinations.length; c++) {
          if (allGoodCombinations[c].includes(indexArray[j])) {
            appearancesArray[j] = appearancesArray[j] + 1;
          }
        }
      }
      console.log("line row number: ", i);
      console.log("current numbers array: ", numbersGrid[i]);
      console.log("current index table  array: ", counterCircleGrid[i]);
      console.log("all good combinations: ", allGoodCombinations);

      console.log("appearances: ", appearancesArray);

      if (!Number.isNaN(numbersGrid[i][0])) {
        const hasToAppearArray = [];
        const allZeroPositions = [];
        appearancesArray.forEach((number, n) => {
          if (number == 0) {
            allZeroPositions.push(n);
          }
          console.log(
            "for line: ",
            i,
            "the length of combinations i: ",
            allGoodCombinations.length,
            number
          );
          console.log(
            "for line: ",
            i,
            "the length of combinations i: ",
            allGoodCombinations.length,
            number,
            "for row"
          );
          if (
            number == allGoodCombinations.length &&
            allGoodCombinations.length != 0
          ) {
            hasToAppearArray.push(n);
            console.log(
              "all good combinations length: ",
              allGoodCombinations.length
            );
          }
          //  if(number == allGoodCombinations[]) /// if number has as many appearances as combinations = 1
        });
        allZeroPositions.map((position) => {
          if (
            position < indexArray.length &&
            counterCircleGrid[i][position + 1] != 1 &&
            counterCircleGrid[i][position + 1] != 2
          ) {
            console.log("position entered if: ", position);

            console.log(
              "set number ",
              numbersGrid[i][position + 1],
              "to NaN from line: ",
              i,
              position + 1
            );
            numbersGrid[i][position + 1] = NaN;
            counterCircleGrid[i][position + 1] = -1;
            console.log(counterCircleGrid[i]);
          }
        });
        hasToAppearArray.map((position) => {
          if (
            position < indexArray.length &&
            counterCircleGrid[i][position + 1] != -1 &&
            counterCircleGrid[i][position + 1] != 1 &&
            counterCircleGrid[i][position + 1] != 2
          ) {
            console.log(
              "this number has to appear at position: ",
              i,
              position + 1
            );
            counterCircleGrid[i][position + 1] = 2;
          }
        });
      }
    }
  }
  return numbersGrid;
};

const removeUnusedNumbersCol = (numbersGrid: number[][]) => {
  for (let i = 1; i < numbersGrid[0].length; i++) {
    const col = getCol(numbersGrid, i);
    if (!Number.isNaN(counterCircleGrid[0][i])) {
      const allGoodCombinations = getAllAnswersOfAnArrayIndexes(
        col,
        counterCircleGrid[0][i]
      );
      //   console.log(allGoodCombinations);
      const indexArray = createIndexArray(col.slice(1));

      let appearancesArray = Array.apply(null, Array(col.length)).map(
        Number.prototype.valueOf,
        0
      );

      for (let j = 0; j < indexArray.length; j++) {
        for (let c = 0; c < allGoodCombinations.length; c++) {
          if (allGoodCombinations[c].includes(indexArray[j])) {
            appearancesArray[j] = appearancesArray[j] + 1;
          }
        }
      }
      console.log("line col number: ", i);
      console.log("current numbers array: ", col);
      console.log("all good combinations: ", allGoodCombinations);

      console.log("appearances: ", appearancesArray);
      if (!Number.isNaN(numbersGrid[0][i])) {
        const allZeroPositions = [];
        const hasToAppearArray = [];
        appearancesArray.forEach((number, n) => {
          if (number == 0) {
            allZeroPositions.push(n);
          }
          console.log(
            "for line: ",
            i,
            "the length of combinations i: ",
            allGoodCombinations.length,
            number,
            "for col"
          );
          if (
            number == allGoodCombinations.length &&
            allGoodCombinations.length != 0
          ) {
            hasToAppearArray.push(n);
            console.log(
              "all good combinations length: ",
              allGoodCombinations.length
            );
          }
        });
        allZeroPositions.map((position) => {
          if (
            position < indexArray.length &&
            counterCircleGrid[position + 1][i] != 1 &&
            counterCircleGrid[position + 1][i] != 2
          ) {
            numbersGrid[position + 1][i] = NaN;
            counterCircleGrid[position + 1][i] = -1;
            console.log(
              "this number is set to -1 for having no combinations: ",
              position + 1,
              i,
              numbersGrid[position + 1][i],
              appearancesArray[position + 1]
            );
          }
        });
        hasToAppearArray.map((position) => {
          if (
            position < indexArray.length &&
            counterCircleGrid[position + 1][i] != -1 &&
            counterCircleGrid[position + 1][i] != 1 &&
            counterCircleGrid[position + 1][i] != 2
          ) {
            console.log(
              "this number has to appear at position: ",
              position + 1,
              i,
              appearancesArray[position + 1]
            );

            counterCircleGrid[position + 1][i] = 2;
          }
        });
      }
    }
  }

  return numbersGrid;
};
const removeUnusedNumbers = (numbersGrid: number[][]) => {
  numbersGrid = removeUnusedNumbersRow(numbersGrid);
  numbersGrid = removeUnusedNumbersCol(numbersGrid);
  return numbersGrid;
};

const checkIfGameEnded = (numbersGrid: number[][]) => {
  let rightAnswerRow = 0;
  let rightAnswerCol = 0;

  for (let i = 0; i < numbersGrid.length; i++) {
    if (Number.isNaN(numbersGrid[i][0])) {
      rightAnswerRow++;
    }
  }

  for (let i = 0; i < numbersGrid[0].length; i++) {
    if (Number.isNaN(numbersGrid[0][i])) {
      rightAnswerCol++;
    }
  }

  return (
    rightAnswerRow == numbersGrid.length - 1 &&
    rightAnswerCol == numbersGrid[0].length - 1
  );
};

const runGame = () => {
  numbersGrid = removeBiggerThanAnswerNumbers(numbersGrid);
  updateCounterTable(numbersGrid);

  numbersGrid = removeBiggerThanAnswerNumbers(numbersGrid);
  numbersGrid = removeUnusedNumbers(numbersGrid);
  updateCounterTable(numbersGrid);
  while (!checkIfGameEnded(numbersGrid)) {
    numbersGrid = removeUnusedNumbers(numbersGrid);
    updateCounterTable(numbersGrid);
  }

  console.log("the game has ended, this is the last matrix: ", numbersGrid);
};

runGame();
