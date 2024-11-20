import { Bar } from 'react-chartjs-2';
import styles from 'app/results/styles/barChart.module.css';

const BarChart = ({ data }) => {
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
                  return `${(value / 5 * 100).toFixed(0)}%`;
                },
                count: 2
              },
              max: 5
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