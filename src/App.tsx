import React, {useCallback, useState, useRef} from 'react';
import produce from 'immer';

const numRows = 40;
const numCols = 50;
const cellSize = 20; //in px

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });//grid state stored here; values in grid will be changing obviously
  
  //console.log(grid); //will print in the console(obviously)

  const [running, setRunning] = useState(false); //false by default

  const runningRef = useRef(running);
  runningRef.current = running

  const runSimulation = useCallback(() => {
      if(!runningRef.current) {
        return;
      }
      //this gridcopy below allows us to mutate grid
      setGrid(g => {
        return produce(g, gridCopy =>{
          for(let i = 0; i < numRows; i++) {
            for(let j = 0; j < numCols; j++)  {
              let neighbors = 0;
                operations.forEach(([x, y]) => {
                  const newI = i + x;
                  const newJ = j + y;
                  if(newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) { //out of bounds checking
                    neighbors += g[newI][newJ];
                  }
              });
                //cell logic
                if(neighbors < 2 || neighbors > 3) { 
                  gridCopy[i][j] = 0;
                } else if(g[i][j] == 0 && neighbors == 3) {
                  gridCopy[i][j] = 1;
                }
              
            }
          }
        });
      });
      
      setTimeout(runSimulation, 200); //1000 ms delay
  }, []); //empty array as second argument, to make sure function is only created once

  //line DIRECTLY below turns single column of boxes into a full grid, `repeat... 2px` is surrounded by BACKTICKS!!!
  return (
    //"fragment" below
    <> 
    <button onClick ={() =>{
      setRunning(!running);
      if(!running) {
      runningRef.current = true;
      runSimulation();
      }
    }}
    >
      {running ? 'stop' : 'start'}</button>
    



    <button onClick={() => { //clear button
      setGrid(generateEmptyGrid());
    }}> Clear </button>

    <button onClick={() => { //generate random grid
      const rows = [];
      for(let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => (Math.random() - 0.35 > Math.random() ? 1 : 0)));
      }
      setGrid(rows);
    }}> Random </button>



    <div style = {{display: 'grid', gridTemplateColumns: `repeat(${numCols}, 20px)`}}> 
    {grid.map((rows, i) => rows.map((col, j) => ( 
    <div 
    key={`${i}-${j}`} //Arrays need this. Research further. This is a NONSTANDARD way to write a key.

    onClick={() => {
      const newGrid = produce(grid, gridCopy => {
        gridCopy[i][j] = grid[i][j] ? 0 : 1; //if 0, click makes 1, and vice-versa
      });
      setGrid(newGrid);
      //grid[i][j] = 1 UPDATING STATE VARIABLE LIKE THIS IS BAD! use "immer" library!
    }}

    style = {{
      width: cellSize, 
      height: cellSize, 
      backgroundColor: grid[i][j] ? 'skyblue' : undefined, //if grid[i][j] == 1, else leave "off"
      border: 'solid 1px darkgray',

  }} 
  /> 
  ))
    )}
  </div> 
  </>
  );
}
//updates page everytime i save!
export default App;
