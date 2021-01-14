import React, { useCallback, useRef, useState } from "react";
import produce from "immer";

const NROWS = 50;
const NCOLS = 50;
const SIZE = 20;
const SPEED = 100;
const RAND_R = 0.7;
const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
];

const generateEmpty = () => {
    const newGrid = [];
    for (let i = 0; i < NROWS; i++) {
        newGrid.push(Array.from(Array(NCOLS), () => 0));
    }
    return newGrid;
};
const generateRandom = () => {
    const newGrid = [];
    for (let i = 0; i < NROWS; i++) {
        newGrid.push(
            Array.from(Array(NCOLS), () => (Math.random() > RAND_R ? 1 : 0))
        );
    }
    return newGrid;
};

const App = () => {
    const [grid, setGrid] = useState(generateEmpty());
    const [isRunning, setIsRunning] = useState(false);
    const runningRef = useRef(isRunning);
    runningRef.current = isRunning;

    const runSim = useCallback(() => {
        if (!runningRef.current) {
            return;
        }
        setGrid((g) => {
            return produce(g, (gridCopy) => {
                for (let i = 0; i < NROWS; i++) {
                    for (let j = 0; j < NCOLS; j++) {
                        let neighbours = 0;
                        operations.forEach(([x, y]) => {
                            const newI = i + x;
                            const newJ = j + y;
                            if (
                                newI >= 0 &&
                                newI < NROWS &&
                                newJ >= 0 &&
                                newJ < NCOLS
                            ) {
                                neighbours += g[newI][newJ];
                            }
                        });
                        if (neighbours < 2 || neighbours > 3) {
                            gridCopy[i][j] = 0;
                        } else if (neighbours === 3 && g[i][j] === 0) {
                            gridCopy[i][j] = 1;
                        }
                    }
                }
            });
        });
        setTimeout(runSim, SPEED);
    }, []);

    return (
        <div>
            <button
                onClick={() => {
                    setIsRunning(!isRunning);
                    if (!isRunning) {
                        runningRef.current = true;
                        runSim();
                    }
                }}
            >
                {isRunning ? "STOP" : "START"}
            </button>
            <button
                disabled={isRunning}
                onClick={() => {
                    setGrid(generateRandom());
                }}
            >
                Random
            </button>
            <button
                disabled={isRunning}
                onClick={() => {
                    setGrid(generateEmpty());
                }}
            >
                Clear
            </button>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${NCOLS},${SIZE}px)`,
                }}
            >
                {grid.map((row, i) =>
                    row.map((col, j) => (
                        <div
                            key={`${i}-${j}`}
                            onClick={() => {
                                const newGrid = produce(grid, (gridCopy) => {
                                    gridCopy[i][j] = grid[i][j] ? 0 : 1;
                                });
                                setGrid(newGrid);
                            }}
                            style={{
                                width: SIZE,
                                height: SIZE,
                                backgroundColor: grid[i][j]
                                    ? "pink"
                                    : undefined,
                                border: "solid 1px black",
                            }}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default App;
