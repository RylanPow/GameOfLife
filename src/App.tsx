import React, {useCallback, useState, useRef} from 'react';
import produce from 'immer';

const numRows = 25;
const numCols = 120;

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
    <div style =  {{
      color: 'blue',
      //WebkitTextFillColor: 'transparent',
      fontSize: '40px',
      fontWeight: '900',
      margin: 'auto',
      backgroundColor: 'rgb(50,50,50)',
      //width: '50%',
      border: 'linearGradient(blue, red) 40px',//solid 8px #00b0dc',

      backgroundImage: 'linear-gradient(to right, rgb(80, 80, 80), black 95%)',

      borderImage: 'linear-gradient(45deg, #0098FF , blue, #002482)',
      borderWidth: '10px',
      borderStyle: 'solid',
      backgroundClip: 'content-box, border-box',
      backgroundOrigin: 'border-box',
      borderImageSlice: '1',

      textAlign: 'center',
      //padding: '2px',
      height: '60px',
      textShadow: '#000 0px 0px 9px',
      WebkitFontSmoothing: 'antialiased',
    }}>CONWAY'S GAME OF LIFE</div>



    <button onClick ={() =>{
      setRunning(!running);
      if(!running) {
      runningRef.current = true;
      runSimulation();
      }}}
      style = {{
      marginTop:'20px',
      border: 'solid 5px #00b0dc',
      color: '#00b0dc',
      backgroundColor: 'rgb(40, 40, 40)',
      fontWeight: 'bold',
      fontSize: '16px',
      }}
      >
      {running ? 'Stop' : 'Start'}</button>
    

    <button onClick={() => { //generate random grid
      const rows = [];
      for(let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => (Math.random() - 0.35 > Math.random() ? 1 : 0)));
      }
      setGrid(rows);
    }}
    style = {{
      marginLeft:'-5px',
      marginTop: '20px',
      border: 'solid 5px #00b0dc',
      color: '#00b0dc',
      backgroundColor: 'rgb(40, 40, 40)',
      fontWeight: 'bold',
      fontSize: '16px',
    }}
    > Random </button>




<button onClick={() => { //generate random grid
      //const newGrid = produce(grid, gridCopy)

      const rows = [];
      for(let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => (1)));
      }
      setGrid(rows);
    }}
    style = {{
      marginLeft:'-5px',
      marginTop: '20px',
      border: 'solid 5px #00b0dc',
      color: '#00b0dc',
      backgroundColor: 'rgb(40, 40, 40)',
      fontWeight: 'bold',
      fontSize: '16px',
    }}
    > Save </button>




    <button onClick={() => { //clear button
      setGrid(generateEmptyGrid());
    }}
    style = {{
      marginLeft: '-5px',
      marginTop: '20px',
      border: 'solid 5px #00b0dc',
      color: '#00b0dc',
      backgroundColor: 'rgb(40, 40, 40)',
      fontWeight: 'bold',
      fontSize: '16px',
    }}
    > Clear </button>



    <div style = {{
      display: 'grid', 
      gridTemplateColumns: `repeat(${numCols}, 20px)`,
      alignItems: 'center',
      justifyItems: 'center',
    }}>
    {grid.map((rows, i) => rows.map((col, j) => ( 
    <div 
    key={`${i}-${j}`} //Arrays need this. Research further. This is a NONSTANDARD way to write a key.

    onMouseDown={() => {
      const newGrid = produce(grid, gridCopy => {
        gridCopy[i][j] = grid[i][j] ? 0 : 1; //if 0, click makes 1, and vice-versa
      });
      setGrid(newGrid);
    }}

  

    style = {{
      width: 20, 
      height: 20, 
      backgroundColor: grid[i][j] ? '#00b0dc' : 'rgb(75, 255, 75)', //if grid[i][j] == 1, else leave "off"
      border: 'solid 1px',
      color: 'rgb(90, 90, 90)',
  }} 
  /> 
  ))
    )}
  </div>
  <p style = {{
    color: 'white',
    fontSize: '35',
    marginLeft: '20px'
  }}
  >Conway's Game of Life is a cellular automaton invented by the late British mathematician John Conway.  
  <br/>It is a famous and extremely simple demonstration of how chaos and self governance can arise 
  out of a set intial state. <br/><br/>The rules are as follows: <br/><br/>
 {'>'}A cell that is ON, or "alive", will die if it has fewer than 2 neighbors, as if by underpopulation<br/>
 {'>'}A cell that is ON, or "alive", will die if it has more than 3 neighbors, as if by overpopulation<br/>
 {'>'}A cell that is OFF, or "dead", will revive if it has EXACTLY 3 neighbors<br/>
 </p> 
  </>
  );
  
}


//updates page everytime i save!
export default App;
