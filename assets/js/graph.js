let chart;

// Initialize the chart with fixed axes and bold lines at x=0 and y=0
function initializeChart() {
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Empty initially, will be updated later
            datasets: [
                {
                    label: 'Graph',
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Game Graph',
                    data: [],
                    borderColor: 'rgba(255, 0, 0, 1)', // Red color for game graph
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: -100,
                    max: 100,
                    grid: {
                        color: function(context) {
                            if (context.tick.value === 0) {
                                return 'black'; // Bold line for x=0
                            }
                            return 'rgba(0, 0, 0, 0.1)';
                        },
                        lineWidth: function(context) {
                            if (context.tick.value === 0) {
                                return 2; // Bold line for x=0
                            }
                            return 1;
                        }
                    }
                },
                y: {
                    min: -100,
                    max: 100,
                    grid: {
                        color: function(context) {
                            if (context.tick.value === 0) {
                                return 'black'; // Bold line for y=0
                            }
                            return 'rgba(0, 0, 0, 0.1)';
                        },
                        lineWidth: function(context) {
                            if (context.tick.value === 0) {
                                return 2; // Bold line for y=0
                            }
                            return 1;
                        }
                    }
                }
            },
            plugins: {
                zoom: {
                    zoom: {
                        pinch: {
                            enabled: true // Enable zooming with pinch gesture
                        },
                        mode: 'xy'
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                        modifierKey: 'ctrl', // Use right-click for dragging
                        onPan: function({chart}) {
                            chart.update('none');
                        }
                    }
                }
            }
        }
    });
}

function zoomIn() {
    chart.zoom(1.1);
}

function zoomOut() {
    chart.zoom(0.9);
}

// Plot the graph based on the equation
function plotGraph() {
    const equation = document.getElementById('inputEquation').value;
    const expr = math.compile(equation);

    // Generate data points
    const xValues = math.range(-100, 100, 0.5).toArray();
    const yValues = xValues.map(x => {
        try {
            const y = expr.evaluate({ x });
            if (isNaN(y) || !isFinite(y)) throw new Error("Invalid value");
            return y;
        } catch (error) {
            return NaN; // Handle invalid values
        }
    });

    // Update the chart with new data
    chart.data.labels = xValues;
    chart.data.datasets[0].data = yValues;
    chart.data.datasets[0].label = `Grafik dari f(x) = ${equation}`;
    chart.update();
}

function clearUserGraph() {
    chart.data.datasets[0].data = [];
    chart.update();
}

let gameEquation = { a: 0, b: 0, c: 0 };

function setLevelAndStartGame(level) {
    setLevel(level);
    startGame();
    plotGameGraph();
}

function startGame() {
    document.getElementById('gameArea').style.display = 'block';
    generateRandomEquation();
    plotGameGraph();
}

function generateRandomEquation() {
    const levelEquation = getLevelEquation();
    gameEquation = levelEquation;
}

function plotGameGraph() {
    const equation = getLevelEquation();
    if (!equation) return;
    
    try {
        const expr = math.compile(equation);
        const xValues = [];
        const yValues = [];
        
        // Generate more points around the origin for smooth curves
        for (let x = -100; x <= 100; x += 0.1) {
            try {
                const y = expr.evaluate({ x: x });
                // Only filter extremely large values
                if (!isNaN(y) && isFinite(y)) {
                    // Allow larger range but prevent extreme values
                    const clampedY = Math.max(-1000, Math.min(1000, y));
                    xValues.push(x);
                    yValues.push(clampedY);
                }
            } catch (error) {
                continue;
            }
        }

        // Create data points
        const dataPoints = xValues.map((x, i) => ({
            x: x,
            y: yValues[i]
        }));

        chart.data.datasets[1].data = dataPoints;
        chart.data.datasets[1].label = 'Game Graph';
        chart.update();
    } catch (error) {
        console.error('Error plotting game graph:', error);
    }
}

async function submitGuess() {
    const inputEquation = document.getElementById('inputEquation').value;
    const gameEquation = getLevelEquation();

    if (inputEquation === gameEquation) {
        document.getElementById('gameMessage').innerText = 'Jawaban Anda benar!';
        
        // Get current level from URL or game state
        const currentLevelMatch = document.querySelector('button.active')?.textContent.toLowerCase() || 'level1';
        
        // Update progress in Firestore
        await updateUserProgress(currentLevelMatch);
        
        // Optional: Show success message with score
        setTimeout(() => {
            alert('Level completed! +10 points');
        }, 500);
    } else {
        document.getElementById('gameMessage').innerText = 'Jawaban Anda salah. Coba lagi!';
    }
}

function resetGame() {
    chart.data.datasets[1].data = [];
    chart.update();
}

// Initialize the chart when the page loads
window.onload = initializeChart;

// Make functions available globally
window.plotGraph = plotGraph;
window.clearUserGraph = clearUserGraph;
window.setLevelAndStartGame = setLevelAndStartGame;
window.submitGuess = submitGuess;
window.resetGame = resetGame;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;