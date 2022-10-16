import React, {useCallback, useState, useRef} from 'react';
import produce from 'immer';




const numRows = 35;
const numCols = 60;

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

  
  const value = useRef()

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

    //"fragment" below; can normally only return ONE thing, so we return ONE fragment... that contains multiple things
    <> 
    <div style = {{
      color: '#00b0dc',
      fontSize: '40px',
      fontWeight: '900',
      margin: 'auto',
      backgroundColor: 'rgb(50,50,50)',
      //width: '50%',
      border: 'solid 8px #00b0dc',
      textAlign: 'center',
      padding: '2px',
      height: '60px',
      textShadow: '#000 0px 0px 15px',
      WebkitFontSmoothing: 'antialiased',
    }}>CONWAY'S GAME OF LIFE</div>



    <button onClick ={() =>{
      setRunning(!running);
      if(!running) {
      runningRef.current = true;
      runSimulation();
      }}}>
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




    <div style = {{
      display: 'grid', 
      gridTemplateColumns: `repeat(${numCols}, 20px)`,
      marginLeft: '15px',
      //marginRight: 'auto',
      width: '85%',
      //justifyItems: 'center',
      
    }}>
    {grid.map((rows, i) => rows.map((col, j) => ( 
    <div 
    key={`${i}-${j}`} //Arrays need this. Research further. This is a NONSTANDARD way to write a key.

    onClick={() => {
      const newGrid = produce(grid, gridCopy => {
        gridCopy[i][j] = grid[i][j] ? 0 : 1; //if 0, click makes 1, and vice-versa
      });
      setGrid(newGrid);
    }}

  

    style = {{
      width: 20, 
      height: 20, 
      backgroundColor: grid[i][j] ? '#00b0dc' : undefined, //if grid[i][j] == 1, else leave "off"
      border: 'solid 1px',
      color: 'rgb(90, 90, 90)',
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
