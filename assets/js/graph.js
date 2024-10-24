let chart;

// Initialize the chart with fixed axes and bold lines at x=0 and y=0
function initializeChart() {
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Empty initially, will be updated later
            datasets: [{
                label: 'Graph',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
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
            }
        }
    });
}

// Plot the graph based on the equation
function plotGraph() {
    const a = parseFloat(document.getElementById('inputA').value);
    const b = parseFloat(document.getElementById('inputB').value);
    const c = parseFloat(document.getElementById('inputC').value);

    const equation = `${a}*x^2 + ${b}*x + ${c}`;
    const expr = math.compile(equation);

    // Generate data points
    const xValues = math.range(-100, 100, 0.5).toArray();
    const yValues = xValues.map(x => expr.evaluate({ x }));

    // Update the chart with new data
    chart.data.labels = xValues;
    chart.data.datasets[0].data = yValues;
    chart.data.datasets[0].label = `Grafik dari ${equation}`;
    chart.update();
}



// Initialize the chart when the page loads
window.onload = initializeChart;