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

const sumOfArray = (numbersArray: number[]) => {
  let sum = 0;
  for (let i = 1; i < numbersArray.length; i++) {
    sum += numbersArray[i];
  }
  return sum;
};

const seperateAnswersRow = (numbersGrid: number[][]) => {
  const answerRows = [];
  for (let i = 1; i < numbersGrid.length; i++) {
    answerRows.push(numbersGrid[i][0]);
  }
  return answerRows;
};

const seperateAnswerCol = (numbersGrid: number[][]) => {
  const answerCols = [];
  for (let i = 1; i < numbersGrid[0].length; i++) {
    answerCols.push(numbersGrid[0][i]);
  }
  return answerCols;
};

const findSmallestAnswer = (rowsArray: number[], colsArray: number[]) => {
  let rowSmallestAnswer = rowsArray[0];
  let colSmallestAnswer = colsArray[0];
  let indexRow = 0;
  let indexColumn = 0;
  for (let i = 0; i < rowsArray.length; i++) {
    if (rowsArray[i] <= rowSmallestAnswer && rowsArray[i] != 0) {
      rowSmallestAnswer = rowsArray[i];
      indexRow = i + 1;
    }
  }

  for (let i = 0; i < colsArray.length; i++) {
    if (colsArray[i] <= colSmallestAnswer && colsArray[i] != 0) {
      colSmallestAnswer = colsArray[i];
      indexColumn = i + 1;
    }
  }

  return rowSmallestAnswer < colSmallestAnswer
    ? { answer: rowSmallestAnswer, index: indexRow, isRow: true }
    : { answer: colSmallestAnswer, index: indexColumn, isRow: false };
};

let answerRows = seperateAnswersRow(numbersGrid);
let answerCols = seperateAnswerCol(numbersGrid);

const smallestAnswerIndex = findSmallestAnswer(answerRows, answerCols);

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
const findAnswersSmallest = (
  numbersGrid: number[][],
  answerIndex: number,
  isRow: boolean
) => {
  let sum = 0;
  const answer = numbersGrid[answerIndex][0];
  // sum + new num < answer ? can be a couple options though...
  if (isRow == true) {
    for (let i = 1; i < numbersGrid[0].length; i++) {
      if (
        numbersGrid[answerIndex][i] != 0 &&
        numbersGrid[answerIndex][i] + sum <= answer
      ) {
        sum += numbersGrid[answerIndex][i];
      } else {
        numbersGrid[answerIndex][i] = NaN;
      }
    }
    numbersGrid[answerIndex][0] = NaN;
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

const circleNumbersForAnsweredArray = (
  numbersArray: number[],
  arrayIndex: number,
  isRow: boolean
) => {
  for (let i = 1; i < numbersArray.length; i++) {
    if (!Number.isNaN(numbersArray[i])) {
      console.log(numbersArray);
      if (isRow) {
        counterCircleGrid[arrayIndex][i] = 1;
      } else {
        counterCircleGrid[i][arrayIndex] = 1;
      }
      // } else {
      //   if (isRow) {
      //     counterCircleGrid[arrayIndex][i] = -1;
      //   } else {
      //     counterCircleGrid[i][arrayIndex] = -1;
      //   }
    }
  }
};

const solveDetriminsticSolution = (numbersGrid: number[][]) => {
  for (let i = 1; i < numbersGrid.length; i++) {
    console.log(sumOfArray(numbersGrid[i]));
    if (checkIfAnswerRight(numbersGrid[i][0], numbersGrid[i])) {
      numbersGrid[i][0] = NaN;
      counterCircleGrid[i][0] = 0;
      circleNumbersForAnsweredArray(numbersGrid[i], i, true);
    }
  }
  for (let i = 1; i < numbersGrid[0].length; i++) {
    const numColumn = getCol(numbersGrid, i);

    if (checkIfAnswerRight(numbersGrid[0][i], numColumn)) {
      numbersGrid[0][i] = NaN;
      counterCircleGrid[0][i] = 0;
      circleNumbersForAnsweredArray(numColumn, i, false);
    }
  }
  return numbersGrid;
};

const getCurrentSums = (numbersGrid: number[][]) => {
  for (let i = 1; i < numbersGrid.length; i++) {
    for (let j = 1; j < numbersGrid[0].length; j++) {
      if (counterCircleGrid[i][j] == 1 && !Number.isNaN(numbersGrid[i][j])) {
        if (counterCircleGrid[i][0] - numbersGrid[i][j] >= 0) {
          counterCircleGrid[i][0] = counterCircleGrid[i][0] - numbersGrid[i][j];
        }

        if (counterCircleGrid[0][j] - numbersGrid[i][j] >= 0) {
          counterCircleGrid[0][j] = counterCircleGrid[0][j] - numbersGrid[i][j];
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
  console.log(goodCombinations);
  return goodCombinations;
};

const dismantleAllUnusedIndexes = (
  numbersGrid: number[][],
  indexInMatrix: number,
  isRow: boolean
) => {
  let arrayAnswer;
  let numbersArray = [];
  if (isRow) {
    numbersArray = numbersGrid[indexInMatrix];
    arrayAnswer = counterCircleGrid[indexInMatrix][0];
  } else {
    numbersArray = getCol(numbersGrid, indexInMatrix);
    arrayAnswer = counterCircleGrid[0][indexInMatrix];
  }
  const arrayWithoutAnswer = numbersArray.slice(1);
  const indexArray = createIndexArray(arrayWithoutAnswer);
  if (Number.isNaN(arrayAnswer)) {
    return;
  }
  const allGoodCombinations = getAllAnswersOfAnArrayIndexes(
    numbersArray,
    arrayAnswer
  );
  const appearancesArray = Array.apply(null, Array(indexArray.length)).map(
    Number.prototype.valueOf,
    0
  );

  for (let i = 0; i < indexArray.length; i++) {
    for (let j = 0; j < allGoodCombinations.length; j++) {
      if (allGoodCombinations[j].includes(indexArray[i])) {
        appearancesArray[i] = appearancesArray[i] + 1;
      }
    }
  }
  for (let i = 0; i < appearancesArray.length; i++) {
    if (appearancesArray[i] == allGoodCombinations.length) {
      console.log(i);
      if (isRow) {
        handleHasToAppearNumber(indexInMatrix + 1, i + 1);
      } else {
        handleHasToAppearNumber(i + 1, indexInMatrix + 1);
      }
    }
  }

  const allZeroPositions = [];
  appearancesArray.filter((number, i) => {
    if (number == 0) {
      allZeroPositions.push(i);
    }
  });
  allZeroPositions.map((position, index) => {
    numbersArray[position + 1] = NaN;
    if (isRow) {
      //console.log(numbersGrid[position + 1][index]);
    } else {
      // counterCircleGrid[index][position + 1] = -1;
    }
  });
  if (isRow) {
    numbersGrid[indexInMatrix] = numbersArray;
  } else {
    setCol(numbersGrid, indexInMatrix, indexArray);
  }
};

const handleHasToAppearNumber = (rowIndex: number, colIndex: number) => {
  counterCircleGrid[rowIndex][colIndex] = 1;
  if (!Number.isNaN(numbersGrid[rowIndex][colIndex])) {
    if (counterCircleGrid[rowIndex][0] - numbersGrid[rowIndex][colIndex] >= 0) {
      //console.log(counterCircleGrid);
      //console.log(counterCircleGrid[rowIndex][0]);
      counterCircleGrid[rowIndex][0] =
        counterCircleGrid[rowIndex][0] - numbersGrid[rowIndex][colIndex];
    }
    if (counterCircleGrid[0][colIndex] - numbersGrid[rowIndex][colIndex] >= 0) {
      counterCircleGrid[0][colIndex] =
        counterCircleGrid[0][colIndex] - numbersGrid[rowIndex][colIndex];
    }
  }
};

const checkIfGameEnded = (numbersGrid: number[][]) => {
  let counter = 0;
  for (let i = 1; i < numbersGrid.length; i++) {
    counter = Number.isNaN(numbersGrid[i][0]) ? (counter += 1) : counter;
  }
  for (let i = 1; i < numbersGrid.length; i++) {
    const col = getCol(numbersGrid, i);

    counter = Number.isNaN(numbersGrid[0][i]) ? (counter += 1) : counter;
  }
  //console.log(counter);
  return counter == numbersGrid.length + numbersGrid.length - 3;
};

const runGame = () => {
  console.log("hello welcome to the game , starting board: ");
  // let k = 0;
  // while (k < 4) {
  numbersGrid = removeBiggerThanAnswerNumbers(numbersGrid);
  numbersGrid = solveDetriminsticSolution(numbersGrid);
  dismantleAllUnusedIndexes(numbersGrid, 1, true);
  console.log(numbersGrid);

  getCurrentSums(numbersGrid);

  console.log(counterCircleGrid);

  // for (let i = 1; i < numbersGrid.length; i++) {
  //   if (!Number.isNaN(numbersGrid[i][0])) {
  //     dismantleAllUnusedIndexes(numbersGrid, i, true);
  //     getCurrentSums(numbersGrid);
  //     numbersGrid = solveDetriminsticSolution(numbersGrid);
  //   }
  // }
  // for (let i = 1; i < numbersGrid[0].length; i++) {
  //   if (!Number.isNaN(numbersGrid[0][i])) {
  //     dismantleAllUnusedIndexes(numbersGrid, i, false);
  //     getCurrentSums(numbersGrid);

  //     numbersGrid = solveDetriminsticSolution(numbersGrid);
  //   }
  // }
  //   k++;
  // }
  // console.log(numbersGrid, counterCircleGrid);
};
runGame();
