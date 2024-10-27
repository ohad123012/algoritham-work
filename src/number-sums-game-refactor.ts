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

// let numbersGrid = [
//   [0, 17, 15, 7, 3, 8, 35, 10],
//   [16, 3, 3, 1, 2, 6, 8, 9],
//   [20, 9, 6, 7, 8, 8, 5, 9],
//   [8, 5, 9, 6, 6, 8, 6, 2],
//   [16, 5, 5, 7, 8, 2, 9, 4],
//   [12, 8, 8, 6, 1, 1, 8, 2],
//   [12, 9, 4, 1, 6, 2, 8, 1],
//   [11, 4, 4, 4, 7, 5, 5, 2],
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
//   [21, 9, 9, 9, 9, 9, 9, 9, 9],
// ];

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
        numbersGrid[0][arrayIndex] = NaN;
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
    const col = getCol(numbersGrid, i);
    if (checkIfAnswerRight(numbersGrid[i][0], numbersGrid[i])) {
      fillRightArray(numbersGrid[i], i, true);
    } else if (checkIfAnswerRight(numbersGrid[0][i], col)) {
      // might delete
      fillRightArray(col, i, false);
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
      //   console.log(allGoodCombinations);
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
            position < indexArray.length &&
            counterCircleGrid[i][position + 1] != 1
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

      if (!Number.isNaN(numbersGrid[0][i])) {
        console.log(allGoodCombinations, allGoodCombinations.length);

        const allZeroPositions = [];
        // const hasToAppearArray = [];
        appearancesArray.filter((number, i) => {
          if (number == 0) {
            allZeroPositions.push(i);
          }
          //   if (
          //     number == allGoodCombinations.length &&
          //     allGoodCombinations.length != 0
          //   ) {
          //     hasToAppearArray.push(i);
          //   }
        });
        allZeroPositions.map((position) => {
          if (
            position < indexArray.length &&
            counterCircleGrid[position + 1][i] != 1
          ) {
            numbersGrid[position + 1][i] = NaN;
            counterCircleGrid[position + 1][i] = -1;
          }
        });
        // hasToAppearArray.map((position)=> {

        // })
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
  console.log(numbersGrid);

  while (!checkIfGameEnded(numbersGrid)) {
    // console.log("entered while ");
    numbersGrid = removeUnusedNumbers(numbersGrid);
    updateCounterTable(numbersGrid);
  }

  console.log("the game has ended , the ending table is: ", numbersGrid);
  //   console.log(counterCircleGrid);

  //   numbersGrid = removeUnusedNumbers(numbersGrid);
  //   updateCounterTable(numbersGrid);

  //   numbersGrid = removeUnusedNumbers(numbersGrid);
  //   updateCounterTable(numbersGrid);

  //   numbersGrid = removeUnusedNumbers(numbersGrid);
  //   updateCounterTable(numbersGrid);

  console.log(numbersGrid);
  //   numbersGrid = removeBiggerThanAnswerNumbers(numbersGrid);
  //   numbersGrid = removeUnusedNumbers(numbersGrid);
  //   updateCounterTable(numbersGrid);

  //   numbersGrid = removeBiggerThanAnswerNumbers(numbersGrid);
  //   numbersGrid = removeUnusedNumbers(numbersGrid);
  //   updateCounterTable(numbersGrid);

  //   console.log(counterCircleGrid);

  //   numbersGrid = removeBiggerThanAnswerNumbers(numbersGrid);
  //   numbersGrid = removeUnusedNumbers(numbersGrid);
  //   updateCounterTable(numbersGrid);

  //   console.log(counterCircleGrid);

  //   numbersGrid = removeUnusedNumbers(numbersGrid);
  //   updateCounterTable(numbersGrid);
};

runGame();
