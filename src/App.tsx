import React, {useState} from 'react';
import produce from 'immer';

const numRows = 50;
const numCols = 50;

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for(let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0))  
    }
    return rows;
  }); //grid state stored here; values in grid will be changing obviously
  
  console.log(grid); //will print in the console(obviously)

  //line DIRECTLY below turns single column of boxes into a full grid, `repeat... 2px` is surrounded by BACKTICKS!!!
  return (
    <div style = {{display: 'grid', gridTemplateColumns: `repeat(${numCols}, 20px)`}}> 
    {grid.map((rows, i) => rows.map((col, k) => ( 
    <div 
    key={`${i}-${k}`} //Arrays need this. Research further. This is a NONSTANDARD way to write a key.

    onClick={() => {
      const newGrid = produce(grid, gridCopy => {
        gridCopy[i][k] = grid[i][k] ? 0: 1; //if 0, click makes 1, and vice-versa
      });
      setGrid(newGrid);
      //grid[i][k] = 1 UPDATING STATE VARIABLE LIKE THIS IS BAD! use "immer" library!
    }}

    style = {{
      width: 20, 
      height: 20, 
      backgroundColor: grid[i][k] ? 'pink' : undefined, //if grid[i][k] == 1, else leave "off"
      border: 'solid 1px black'
  }} 
  /> 
  ))
    )}
  </div> //updates page everytime i save!
  );
}

export default App;
