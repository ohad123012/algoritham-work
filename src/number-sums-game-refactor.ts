import combinations from "combinations";

let numbersGrid = [
  [0, 17, 8, 14, 18, 11, 10],
  [2, 1, 5, 3, 4, 1, 4],
  [13, 1, 9, 8, 9, 1, 3],
  [14, 7, 7, 5, 9, 1, 4],

  [13, 8, 6, 2, 7, 5, 7],

  [19, 6, 3, 9, 3, 4, 3],

  [17, 7, 5, 5, 5, 3, 6],
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
  for (let i = 1; i < finishedArray.length; i++) {
    if (isRow) {
      if (!Number.isNaN(finishedArray[i])) {
        counterCircleGrid[arrayIndex][i] = 1;
        numbersGrid[arrayIndex][0] = NaN; ///// might change
      }
    } else {
      if (!Number.isNaN(finishedArray[i])) {
        counterCircleGrid[i][arrayIndex] = 1;
      }
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
        numbersGrid[i][j] = NaN;
        counterCircleGrid[i][j] = -1;
      }
    }
  }
  return numbersGrid;
};

const updateCounterTable = (numbersGrid: number[][]) => {
  for (let i = 1; i < numbersGrid.length; i++) {
    if (checkIfAnswerRight(numbersGrid[i][0], numbersGrid[i])) {
      fillRightArray(numbersGrid[i], i, true);
    } else {
      for (let j = 0; j < numbersGrid[0].length; j++) {
        if (counterCircleGrid[i][j] == 1) {
          if (counterCircleGrid[i][0] - numbersGrid[i][j] >= 0) {
            counterCircleGrid[i][0] =
              counterCircleGrid[i][0] - numbersGrid[i][j];
          }
          if (counterCircleGrid[0][j] - numbersGrid[i][j] >= 0) {
            counterCircleGrid[0][j] =
              counterCircleGrid[0][j] - numbersGrid[i][j];
          }
          //console.log(counterCircleGrid[0][j], counterCircleGrid);
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
      console.log(allGoodCombinations);
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

      if (!Number.isNaN(numbersGrid[i][0])) {
        const allZeroPositions = [];
        appearancesArray.filter((number, i) => {
          if (number == 0) {
            allZeroPositions.push(i);
          }
          //  if(number == allGoodCombinations[]) /// if number has as many appearances as combinations = 1
        });
        allZeroPositions.map((position) => {
          if (
            position < indexArray.length
            // counterCircleGrid[i][position + 1] != 1
          ) {
            numbersGrid[i][position + 1] = NaN;
            counterCircleGrid[i][position + 1] = -1;
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
      console.log(allGoodCombinations);
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

      if (!Number.isNaN(numbersGrid[0][i])) {
        const allZeroPositions = [];
        appearancesArray.filter((number, i) => {
          if (number == 0) {
            allZeroPositions.push(i);
          }
        });
        allZeroPositions.map((position) => {
          if (
            position < indexArray.length
            //  counterCircleGrid[i][position + 1] != 1
          ) {
            numbersGrid[position + 1][i] = NaN;
            counterCircleGrid[position + 1][i] = -1;
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

const runGame = () => {
  numbersGrid = removeBiggerThanAnswerNumbers(numbersGrid);
  updateCounterTable(numbersGrid);

  numbersGrid = removeUnusedNumbers(numbersGrid);
  updateCounterTable(numbersGrid);

  console.log(counterCircleGrid);
};

runGame();
