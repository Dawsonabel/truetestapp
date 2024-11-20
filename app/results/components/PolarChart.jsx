import { PolarArea } from 'react-chartjs-2';
import styles from 'app/results/styles/polarChart.module.css';

const PolarChart = ({ data }) => {
  return (
    <div className={styles.chartWrapper}>
      <div className={styles.polarContainer}>
        <PolarArea
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            layout: {
              padding: { top: 6, bottom: 6, left: 6, right: 6 }
            },
            scales: {
              r: {
                display: false,
                suggestedMin: 0,
                suggestedMax: 6
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const score = context.raw;
                    const percentage = ((score / 45) * 100).toFixed(0);
                    return `Type ${context.label.split(' ')[1]}: ${percentage}%`;
                  }
                }
              },
              datalabels: {
                display: true,
                align: 'end',
                anchor: 'end',
                offset: 5,
                formatter: function(value, context) {
                  return context.chart.data.labels[context.dataIndex].split(' ')[1];
                },
                color: function(context) {
                  const pastelColors = [
                    'rgba(255, 87, 87, 0.9)',    // Type 1 - Red
                    'rgba(56, 161, 105, 0.9)',   // Type 2 - Green
                    'rgba(255, 182, 73, 0.9)',   // Type 3 - Yellow/Gold
                    'rgba(72, 87, 140, 0.9)',    // Type 4 - Blue
                    'rgba(90, 205, 244, 1)',     // Type 5 - Light Blue
                    'rgba(76, 76, 76, 0.9)',     // Type 6 - Grey/Brown
                    'rgba(255, 159, 64, 0.9)',   // Type 7 - Orange
                    'rgba(128, 0, 0, 0.9)',      // Type 8 - Dark Red/Maroon
                    'rgba(97, 166, 125, 1)',     // Type 9 - Sage Green
                  ];
                  return pastelColors[context.dataIndex];
                },
                font: {
                  size: 13,
                  weight: 'bold'
                },
                rotation: () => 0,
                textAlign: 'left'
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default PolarChart;