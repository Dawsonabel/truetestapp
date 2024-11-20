import { Bar } from 'react-chartjs-2';
import styles from 'app/results/styles/barChart.module.css';

const BarChart = ({ data }) => {
  // Get the maximum value from the dataset
  const maxValue = Math.max(...data.datasets[0].data);
  
  return (
    <div className={styles.chartWrapper}>
      <Bar 
        data={data}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
              },
              ticks: {
                callback: function(value) {
                  return `${(value / maxValue * 100).toFixed(0)}%`;
                },
                count: 6
              },
              max: maxValue
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            datalabels: {
              display: false
            }
          }
        }}
      />
    </div>
  );
};

export default BarChart;