import React from 'react';
import dynamic from 'next/dynamic';
import annotationPlugin from 'chartjs-plugin-annotation';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  CategoryScale,
  Filler,
} from 'chart.js';

// Dynamically import Line chart with SSR disabled
const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false,
});

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale, Filler, annotationPlugin);

const Graph = () => {
  const data = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Life Satisfaction',
        data: [0, 10, 35, 37, 60, 62, 95],
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
          gradient.addColorStop(0, 'rgba(255, 180, 180, 0.6)');  // Slightly softer red
          gradient.addColorStop(1, 'rgba(180, 255, 180, 0.6)');  // Slightly softer green
          return gradient;
        },
        borderColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
          gradient.addColorStop(0, 'rgba(255, 100, 100, 0.8)');    // Softer red
          gradient.addColorStop(0.2, 'rgba(255, 180, 100, 0.8)');  // Softer orange
          gradient.addColorStop(0.4, 'rgba(255, 255, 100, 0.8)');  // Softer yellow
          gradient.addColorStop(0.6, 'rgba(180, 255, 100, 0.8)');  // Softer lime
          gradient.addColorStop(0.8, 'rgba(100, 255, 180, 0.8)');  // Softer spring green
          gradient.addColorStop(1, 'rgba(100, 255, 100, 0.8)');    // Softer green
          return gradient;
        },
        tension: 0.4,  // Add this line to make the curve smoother
        pointRadius: [0, 9, 0, 9, 0, 0, 9],
        pointHoverRadius: [0, 9, 0, 9, 0, 0, 9], // Match pointRadius to prevent shrinking
        pointBackgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return null;
          }
          const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
          gradient.addColorStop(0, 'rgba(255, 100, 100, 1)');    // Fully opaque red
          gradient.addColorStop(0.2, 'rgba(255, 180, 100, 1)');  // Fully opaque orange
          gradient.addColorStop(0.4, 'rgba(255, 255, 100, 1)');  // Fully opaque yellow
          gradient.addColorStop(0.6, 'rgba(180, 255, 100, 1)');  // Fully opaque lime
          gradient.addColorStop(0.8, 'rgba(100, 255, 180, 1)');  // Fully opaque spring green
          gradient.addColorStop(1, 'rgba(100, 255, 100, 1)');    // Fully opaque green
          return gradient;
        },
        pointHoverBackgroundColor: (context) => {
          // Use the same function as pointBackgroundColor
          return context.dataset.pointBackgroundColor(context);
        },
        pointBorderColor: ['transparent', 'black', 'transparent', 'black', 'transparent', 'transparent', 'black'],
        pointHoverBorderColor: ['transparent', 'black', 'transparent', 'black', 'transparent', 'transparent', 'black'],
        pointBorderWidth: 1, // Thin black border
        pointHoverBorderWidth: 1, // Match pointBorderWidth
        hitRadius: 0, // Disable hit detection on points
        pointShadowColor: 'rgba(0, 0, 0, 1)', // Shadow color with increased opacity
        pointShadowBlur: 6, // Increased shadow blur radius
        pointShadowOffsetX: 1, // Slight horizontal shadow offset
        pointShadowOffsetY: 3, // Increased vertical shadow offset
        pointStyle: 'circle', // Ensure points are circles
        borderWidth: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 115,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
          drawTicks: false,
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false, // Disable tooltips to remove click effects
      },
      annotation: {
        annotations: {
          label1: {
            type: 'label',
            xValue: 1.1,
            yValue: 25, 
            content: 'Low confidence',
            color: 'black',
            font: {
              family: "'Roboto', sans-serif",
              size: 12,
              weight: 'bold'
            },
            backgroundColor: 'transparent',
            borderColor: 'transparent', // Changed to transparent
            borderWidth: 0, // Changed to 0
            borderRadius: 4,
            padding: {
              top: 4,
              bottom: 4,
              left: 8,
              right: 8
            },
            textAlign: 'center',
          },
          label2: {
            type: 'label',
            xValue: 3,
            yValue: 52,
            content: 'Growing peace',
            color: 'black',
            font: {
              family: "'Roboto', sans-serif",
              size: 12,
              weight: 'bold'
            },
            backgroundColor: 'transparent',
            borderColor: 'transparent', // Changed to transparent
            borderWidth: 0, // Changed to 0
            borderRadius: 4,
            padding: {
              top: 4,
              bottom: 4,
              left: 8,
              right: 8
            },
            textAlign: 'center',
          },
          label3: {
            type: 'label',
            xValue: 5.1,
            yValue: 107,
            content: 'Dream life',
            color: 'rgb(0, 70, 0)', // Darker green
            font: {
              family: "'Roboto', sans-serif",
              size: 15,
              weight: 700,
            },
            backgroundColor: 'rgba(144, 238, 144, 1)', // Pastel and very transparent green
            borderColor: 'rgba(144, 238, 144, 1)',
            borderWidth: 2,
            borderRadius: 4,
            padding: {
              top: 4,
              bottom: 4,
              left: 8,
              right: 8
            },
            textAlign: 'center',
          }
        }
      },
      customBackground: {
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          const chartArea = chart.chartArea;
          const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
          gradient.addColorStop(0, 'rgba(255, 180, 180, 0.6)');
          gradient.addColorStop(1, 'rgba(180, 255, 180, 0.6)');
          
          ctx.save();
          ctx.fillStyle = gradient;
          ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
          ctx.restore();
        }
      }
    },
    layout: {
      padding: {
        top: 10, // Reduced from 30 to 10
        right: 10,
        bottom: 0,
        left: 10
      },
    },
    hover: {
      mode: null, // Disable hover mode
    },
    events: [], // Disable all events
  };

  // Add this function to calculate the date 1 month from now
  const getOneMonthFromNow = () => {
    const now = new Date();
    const oneMonthFromNow = new Date(now.setMonth(now.getMonth() + 1));
    return oneMonthFromNow.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 px-4">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500">
          We estimate you&apos;ll</p> 
          <p className="text-sm text-gray-500"><strong>unlock your potential by {getOneMonthFromNow()}</strong>
        </p>
        <div className="bg-red-200 text-red-800 font-semibold py-2 px-4 rounded-md inline-block mt-2">
         Growth challenges detected: HIGH - 8.93
        </div>
      </div>

      <div className="relative bg-lightgray-70 rounded-lg overflow-hidden pt-2 pb-2 px-2">
        <h2 className="text-md font-extrabold text-center mb-0">YOUR INNER PEACE LEVEL</h2>
        <div className="h-64">
          {/* Chart rendered only on the client side */}
          <Line data={data} options={options} />
        </div>
      </div>

      <div className="mt-2 text-center text-xsm text-gray-500 mb-10">
        This graph simulates results of using Traitly.me
      </div>
    </div>
  );
};

export default Graph;