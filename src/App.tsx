import { useState } from "react";
import "./App.css";

function createInitialGrid() {
  const grid: number[][] = [];
  for (let i = 0; i < 9; i++) {
    grid.push([]);
    for (let j = 0; j < 9; j++) {
      grid[i].push(0);
    }
  }
  return grid;
}

function App() {
  const [grid, setGrid] = useState(createInitialGrid());

  function changeCellValue(
    rowIndex: number,
    colIndex: number,
    cellValue: number
  ) {
    let newGrid = [...grid];
    newGrid[rowIndex][colIndex] = cellValue;
    setGrid(newGrid);
  }

  function clear() {
    setGrid(createInitialGrid());
  }

  async function solve() {
    let gridString = "";
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] === 0) {
          gridString += ".";
        } else {
          gridString += grid[i][j];
        }
      }
    }

    const response = await fetch("http://127.0.0.1:5000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: `{"sudoku":["${gridString}"]}`,
    });
    const jsonResponse = await response.json();
    const solution = jsonResponse.data[0].solution;

    let newGrid = [...grid];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        newGrid[i][j] = solution[i * 9 + j];
      }
    }
    setGrid(newGrid);
  }

  return (
    <div className="App">
      <div className="grid">
        {grid.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className="row">
              {row.map((cellValue, colIndex) => {
                return (
                  <div key={colIndex} className="cell">
                    <input
                      value={grid[rowIndex][colIndex] === 0 ? "" : cellValue}
                      onChange={(e) =>
                        changeCellValue(
                          rowIndex,
                          colIndex,
                          parseInt(e.target.value) || 0
                        )
                      }
                    ></input>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <button onClick={solve}>Solve</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
}

export default App;
