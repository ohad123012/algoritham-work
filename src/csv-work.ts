import fs from "fs";
import path, { delimiter } from "path";
import arrayToCsv from "arrays-to-csv";
import CsvWriter from "csv-writer";
import { convertArrayToCSV } from "convert-array-to-csv";
import promptSync from "prompt-sync";

const promptF = promptSync(); // Initialize the prompt here

const csvToString = fs.readFileSync(path.resolve("assets/table.csv"), {
  encoding: "utf-8",
});

const replaceAllBack = (allRowItems: string[]) => {
  allRowItems.forEach((item, i) => {
    if (item.includes(";") == true) {
      allRowItems[i] = item.replace(/;/g, ",");
      allRowItems[i] = item.replace(/"/g, "");
    }
  });

  return allRowItems;
};

const splitRow = (csvRow: string) => {
  const positionCommaSeperator = csvRow.indexOf('"');
  let allRowItems = [];
  if (positionCommaSeperator == -1) {
    allRowItems = csvRow.split(",");
  } else {
    const originalSubStringWithCommas = csvRow.substring(
      csvRow.indexOf('"'),
      csvRow.lastIndexOf('"')
    );

    const subStringWithNoCommas = originalSubStringWithCommas.replace(
      /,/g,
      ";"
    );

    csvRow = csvRow.replace(originalSubStringWithCommas, subStringWithNoCommas);
    csvRow = csvRow.replace(/"/g, "");

    allRowItems = csvRow.split(",");

    allRowItems = replaceAllBack(allRowItems);
    console.log(allRowItems);
  }
  return allRowItems;
};

const stringToArray = (csvString: string) => {
  const csvArray = csvString.split(`\n`);
  const fullMatrix = csvArray.map((csvRow, i) => {
    const allRowItems = splitRow(csvRow);

    return allRowItems;
  });
  return fullMatrix;
};

const exportCsv = (
  csvHeader: string[],
  csvMatrix: string[][],
  numberOfTable?: number,
  nameOfTable?: string
) => {
  const csvFromArrayOfArray = convertArrayToCSV(csvMatrix, {
    header: csvHeader,
    separator: ",",
  });
  if (numberOfTable != 0) {
    fs.writeFile(
      path.resolve(`assets/ohad-table ${numberOfTable}.csv`),
      csvFromArrayOfArray,
      (err) => {
        if (err) {
          console.log("error");
        }
        console.log("done");
      }
    );
  }

  if (numberOfTable == 0) {
    fs.writeFile(
      path.resolve(`assets/ohad-table ${nameOfTable}.csv`),
      csvFromArrayOfArray,
      (err) => {
        if (err) {
          console.log("error");
        }
        console.log("done");
      }
    );
  }
};

const paginateCsv = (csvToString: string, paginationNumber: number) => {
  if (paginationNumber < 1 || paginationNumber > 50) {
    console.log("bad number!!! ");
    return;
  }
  const csvMatrix = stringToArray(csvToString);
  const csvMatrixWithoutHeader = csvMatrix.slice(1);
  const csvHeader = csvMatrix[0];
  let tableNum = 0;
  for (let i = 0; i < csvMatrix.length; i += paginationNumber) {
    tableNum++;
    exportCsv(
      csvHeader,
      csvMatrixWithoutHeader.slice(i, i + paginationNumber),
      tableNum
    );
  }
};

const equalFilter = (
  csvMatrix: string[][],
  numberOfColumn: number,
  filteringNumber: number
) => {
  const filteredArray = [];
  for (let i = 0; i < csvMatrix.length; i++) {
    if (parseFloat(csvMatrix[i][numberOfColumn]) == filteringNumber) {
      filteredArray.push(csvMatrix[i]);
    }
  }

  return filteredArray;
};

const lessThanFilter = (
  csvMatrix: string[][],
  numberOfColumn: number,
  filteringNumber: number
) => {
  const filteredArray = [];
  for (let i = 0; i < csvMatrix.length; i++) {
    if (parseFloat(csvMatrix[i][numberOfColumn]) < filteringNumber) {
      filteredArray.push(csvMatrix[i]);
    }
  }
  return filteredArray;
};

const moreThanFilter = (
  csvMatrix: string[][],
  numberOfColumn: number,
  filteringNumber: number
) => {
  const filteredArray = [];
  for (let i = 0; i < csvMatrix.length; i++) {
    if (parseFloat(csvMatrix[i][numberOfColumn]) > filteringNumber) {
      filteredArray.push(csvMatrix[i]);
    }
  }
  return filteredArray;
};

const stringInFilter = (
  csvMatrix: string[][],
  numberOfColumn: number,
  filteringString: string
) => {
  const filteredArray = [];
  for (let i = 0; i < csvMatrix.length; i++) {
    if (csvMatrix[i][numberOfColumn].includes(filteringString)) {
      filteredArray.push(csvMatrix[i]);
    }
  }
  return filteredArray;
};

const filterCsv = (
  numberOfColumn: number,
  filter: string,
  filteringVariable
) => {
  // need to fix in docs write filtering instead of sorting and less than and change is in to string in .....
  let exportArray = [];
  const ArrayCsv = stringToArray(csvToString);

  switch (filter) {
    case "equal":
      exportArray = equalFilter(ArrayCsv, numberOfColumn, filteringVariable);
      break;

    case "more-than":
      exportArray = moreThanFilter(ArrayCsv, numberOfColumn, filteringVariable);
      break;

    case "less-than":
      exportArray = lessThanFilter(ArrayCsv, numberOfColumn, filteringVariable);
      break;

    case "string-in":
      exportArray = stringInFilter(ArrayCsv, numberOfColumn, filteringVariable);
      break;

    default:
      break;
  }
  const csvMatrixWithoutHeader = exportArray.slice(1);
  const csvHeader = exportArray[0];
  exportCsv(csvHeader, csvMatrixWithoutHeader, 0, filter);
};

const switchRowsMatrix = (csvMatrix: string[][], numberOfRow: number) => {
  let saveRow = [];
  for (let i = 0; i < csvMatrix[0].length; i++) {
    saveRow.push(csvMatrix[numberOfRow][i]);
  }
  for (let i = 0; i < csvMatrix[0].length; i++) {
    csvMatrix[numberOfRow][i] = csvMatrix[numberOfRow + 1][i];
  }
  for (let i = 0; i < csvMatrix[0].length; i++) {
    csvMatrix[numberOfRow + 1][i] = saveRow[i];
  }
};

const AscSort = (csvMatrix: string[][], numberOfColumn: number) => {
  const checkTypeVar = csvMatrix[1][numberOfColumn];

  for (let i = 1; i < csvMatrix.length; i++) {
    for (let j = 0; j < csvMatrix.length - 1; j++) {
      if (!Number.isNaN(parseFloat(checkTypeVar))) {
        if (
          parseFloat(csvMatrix[j][numberOfColumn]) >
          parseFloat(csvMatrix[j + 1][numberOfColumn])
        ) {
          switchRowsMatrix(csvMatrix, j);
        }
      }

      if (Number.isNaN(parseFloat(checkTypeVar))) {
        if (csvMatrix[j][numberOfColumn] > csvMatrix[j + 1][numberOfColumn]) {
          switchRowsMatrix(csvMatrix, j);
        }
      }
    }
  }
  return csvMatrix;
};

const DescSort = (csvMatrix: string[][], numberOfColumn: number) => {
  const checkTypeVar = csvMatrix[1][numberOfColumn];

  for (let i = 1; i < csvMatrix.length; i++) {
    for (let j = 0; j < csvMatrix.length - 1; j++) {
      if (!Number.isNaN(parseFloat(checkTypeVar))) {
        if (
          parseFloat(csvMatrix[j][numberOfColumn]) <
          parseFloat(csvMatrix[j + 1][numberOfColumn])
        ) {
          switchRowsMatrix(csvMatrix, j);
        }
      }

      if (Number.isNaN(parseFloat(checkTypeVar))) {
        if (csvMatrix[j][numberOfColumn] < csvMatrix[j + 1][numberOfColumn]) {
          switchRowsMatrix(csvMatrix, j);
        }
      }
    }
  }
  return csvMatrix;
};

const sortCsv = (numberOfColumn: number, order: string) => {
  let exportArray = [];
  const ArrayCsv = stringToArray(csvToString);
  switch (order) {
    case "ASC":
      exportArray = AscSort(ArrayCsv, numberOfColumn);
      break;

    case "DESC":
      exportArray = DescSort(ArrayCsv, numberOfColumn);
      break;
  }
  const csvMatrixWithoutHeader = exportArray.slice(1);
  const csvHeader = exportArray[0];
  exportCsv(csvHeader, csvMatrixWithoutHeader, 0, order);
};

const runCode = () => {
  const typeOfChange = promptF("hello enter the change you want on the csv: ");

  if (typeOfChange == "pagination") {
    const paginationNumber = promptF("enter your pagination number: ");
    paginateCsv(csvToString, parseInt(paginationNumber));
  } else if (typeOfChange == "sort") {
    const numberOfColumn = promptF("enter your column number: ");
    const sortingDir = promptF("enter your sorting direction: ");
    sortCsv(parseInt(numberOfColumn), sortingDir);
  } else if (typeOfChange == "filter") {
    const numberOfColumn = promptF("enter your column number: ");
    const filter = promptF("enter your filter : ");
    const filterVar = promptF("enter your filter variable: ");

    Number.isNaN(parseFloat(filterVar))
      ? filterCsv(parseInt(numberOfColumn), filter, filterVar)
      : filterCsv(parseInt(numberOfColumn), filter, parseFloat(filterVar));
  } else {
    console.log("bad input!!  ");
  }
};

runCode();“[#exercise - #question]: final answer”
