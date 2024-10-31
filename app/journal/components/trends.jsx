import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import styles from '../styles/trends.module.css';

const TrendsComponent = ({ isOpen, onClose, journalEntries }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [calendarData, setCalendarData] = useState({});

  useEffect(() => {
    if (!isOpen || !journalEntries.length) return;

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const filteredEntries = journalEntries.filter(entry => 
      entry.type === 'mood' && new Date(entry.dateTime) >= sevenDaysAgo
    );
    console.log('Filtered entries:', filteredEntries);

    const moodsByDate = filteredEntries.reduce((acc, entry) => {
      const date = new Date(entry.dateTime);
      const dateKey = date.toISOString().split('T')[0];
      
      const moodValue = Number(entry.responses[0]);
      if (isNaN(moodValue)) return acc;
      
      if (!acc[dateKey]) {
        acc[dateKey] = { sum: 0, count: 0 };
      }
      acc[dateKey].sum += moodValue;
      acc[dateKey].count += 1;

      console.log(`Date ${dateKey}:`, {
        newValue: moodValue,
        currentSum: acc[dateKey].sum,
        currentCount: acc[dateKey].count,
        average: acc[dateKey].sum / acc[dateKey].count
      });

      return acc;
    }, {});

    console.log('Final moodsByDate:', moodsByDate);

    const allDates = Array.from({length: 7}, (_, i) => {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      return date;
    });

    const dates = allDates.map(date => 
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    
    const moods = allDates.map(date => {
      const dateKey = date.toISOString().split('T')[0];
      const dayData = moodsByDate[dateKey];
      const moodValue = dayData ? dayData.sum / dayData.count : null;
      
      console.log(`Calculating mood for ${dateKey}:`, {
        dayData,
        calculatedMood: moodValue
      });

      return moodValue;
    });

    console.log('Final dates array:', dates);
    console.log('Final moods array:', moods);

    if (moods.length === 0) {
      console.log('No mood entries found');
      return;
    }

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const moodColors = {
      1: 'rgba(230, 112, 112, 0.9)', // Softer red
      2: 'rgba(230, 165, 112, 0.9)', // Softer orange
      3: 'rgba(235, 216, 115, 0.9)', // Softer yellow
      4: 'rgba(112, 207, 105, 0.9)', // Softer green
      5: 'rgba(36, 162, 118, 0.9)'   // Softer teal
    };

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Mood',
          data: moods,
          backgroundColor: createGradient(ctx),
          segment: {
            borderColor: (ctx) => {
              const currentMood = ctx.p1.parsed.y;
              return currentMood ? moodColors[Math.round(currentMood)] : 'transparent';
            }
          },
          spanGaps: true,
          fill: {
            target: 'origin',
            below: createGradient(ctx)
          },
          borderWidth: 3,
          tension: 0.2,
          pointStyle: (context) => {
            const mood = Math.round(context.raw);
            if (!mood) return null; // For null values
            
            const img = new Image();
            img.src = `/images/emotions/emotion${mood}.png`;
            img.width = 29;  // Set explicit width
            img.height = 26; // Set explicit height
            return img;
          },
          pointRadius: undefined, // Remove this as we're controlling size directly on the image
          pointHoverRadius: undefined, // Remove this as well
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 5,
            right: 20,
            top: 20,
            bottom: 20
          }
        },
        scales: {
          y: {
            min: 0.01,
            max: 5.99,
            reverse: false,
            position: 'left',
            border: {
              display: false
            },
            ticks: {
              display: false,
              stepSize: 1,
              callback: function(value) {
                return Math.floor(value);
              }
            },
            grid: {
              drawBorder: false,
              offset: false,
              display: true,
              color: 'rgba(99, 102, 241, 0.1)',  // Lighter indigo for grid lines
              drawTicks: false,
              z: -1,
              drawOnChartArea: true,
              tickValues: [1, 2, 3, 4]
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              padding: 10,
              color: '#6366f1',  // Indigo for labels
              font: {
                size: 14,
                weight: '500'
              },
              maxRotation: 45,
              minRotation: 45,
              autoSkip: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };

  }, [journalEntries, isOpen]);

  useEffect(() => {
    if (!journalEntries.length) return;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthEntries = journalEntries.reduce((acc, entry) => {
      const entryDate = new Date(entry.dateTime);
      if (entryDate.getMonth() === currentMonth && 
          entryDate.getFullYear() === currentYear && 
          entry.type === 'mood') {
        const day = entryDate.getDate();
        const moodValue = Number(entry.responses[0]);
        if (!isNaN(moodValue)) {
          acc[day] = Math.round(moodValue);
        }
      }
      return acc;
    }, {});

    setCalendarData(monthEntries);
  }, [journalEntries]);

  function generateCalendarDays() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const days = Array(firstDay.getDay()).fill(null);
    
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push({
        date: d,
        mood: calendarData[d] || null
      });
    }
    
    while (days.length % 7 !== 0) {
      days.push(null);
    }
    
    return days;
  }

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Trends</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.chartCard}>
          <div className={styles.chartContainer}>
            <canvas ref={chartRef} />
          </div>
        </div>
        <div className={styles.calendarCard}>
          <div className={styles.calendarHeader}>
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
          <div className={styles.calendarGrid}>
            {generateCalendarDays().map((day, index) => (
              <div key={index} className={styles.calendarDay}>
                {day && day.date && (
                  <>
                    {!day.mood && <span className={styles.dayNumber}>{day.date}</span>}
                    {day.mood && (
                      <div 
                        className={styles.moodIndicator} 
                        style={{
                          '--base-color': {
                            1: '#e67070',
                            2: '#e6a570',
                            3: '#ebd873',
                            4: '#70cf69',
                            5: '#24a276'
                          }[day.mood],
                          '--base-color-light': {
                            1: '#ff8a8a',
                            2: '#ffb584',
                            3: '#ffe083',
                            4: '#8aeb83',
                            5: '#2ec18c'
                          }[day.mood],
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

function createGradient(ctx) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');  // Indigo
  gradient.addColorStop(1, 'rgba(99, 102, 241, 0.02)'); // Transparent indigo
  return gradient;
}

export default TrendsComponent;