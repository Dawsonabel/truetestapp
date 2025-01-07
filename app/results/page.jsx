'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Results() {
  const [iqScore, setIqScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchOrGenerateIQ = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/.netlify/functions/get-results', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch results: ${response.status}`);
      }

      const data = await response.json();

      if (!data.iqScore) {
        const newIqScore = Math.floor(Math.random() * (133 - 99 + 1)) + 99;

        const storeResponse = await fetch('/.netlify/functions/store-iq', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ iqScore: newIqScore })
        });

        if (storeResponse.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }

        if (!storeResponse.ok) {
          throw new Error('Failed to store IQ score');
        }

        setIqScore(newIqScore);
      } else {
        setIqScore(data.iqScore);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchOrGenerateIQ();
  }, [fetchOrGenerateIQ]);

  const calculatePercentile = (score) => {
    const percentiles = {
      140: 0.4,
      138: 0.7,
      136: 0.9,
      134: 1.2,
      132: 1.6,
      130: 2.0,
      128: 2.5,
      126: 3.5,
      124: 5.0,
      122: 7.0,
      120: 9.0,
      118: 11.5,
      116: 13.5,
      114: 17.0,
      112: 20.0,
      110: 25.0,
      108: 30.0,
      106: 34.0,
      104: 39.0,
      102: 45.0,
      100: 50.0,
      98: 55.0,
      96: 61.0,
      94: 66.0,
      92: 71.0,
      90: 75.0,
      88: 79.0,
      86: 82.0,
      84: 85.0
    };
    
    // Find the closest score in our lookup table
    const scores = Object.keys(percentiles).map(Number);
    const closestScore = scores.reduce((prev, curr) => {
      return Math.abs(curr - score) < Math.abs(prev - score) ? curr : prev;
    });
    
    return percentiles[closestScore];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 max-w-[400px] mx-auto mt-18">
      <div className="w-full h-[220px] mb-4 relative">
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">IQ</p>
          <p className="text-3xl font-semibold text-zinc-800 dark:text-zinc-200">{iqScore}</p>
        </div>
        <Line
          data={{
            labels: Array.from({ length: 101 }, (_, i) => i + 50), // Keep 101 labels to match data points
            datasets: [
              {
                label: 'Full Distribution',
                data: Array.from({ length: 101 }, (_, i) => {
                  const x = i + 50;
                  return 100 * Math.exp(-Math.pow((x - 100) / 15, 2) / 2);
                }),
                borderColor: 'rgba(75, 85, 99, 0.5)',
                backgroundColor: 'transparent',
                fill: false,
                tension: 0.4,
                pointRadius: 0,
                z: 1
              },
              {
                label: 'IQ Distribution',
                data: Array.from({ length: 101 }, (_, i) => {
                  const x = i + 50;
                  return x <= iqScore ? 
                    100 * Math.exp(-Math.pow((x - 100) / 15, 2) / 2) : 
                    null;
                }),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                fill: {
                  target: 'origin',
                  above: 'rgba(59, 130, 246, 0.2)'
                },
                tension: 0.4,
                pointRadius: 0,
                z: 2
              },
              {
                label: 'Fill Area',
                data: Array.from({ length: 101 }, (_, i) => {
                  const x = i + 50;
                  return x <= iqScore ? 
                    100 * Math.exp(-Math.pow((x - 100) / 15, 2) / 2) : 
                    null;
                }),
                borderColor: 'transparent',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                z: 3
              }
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 10  // Add padding to prevent cutoff
              }
            },
            scales: {
              x: {
                title: {
                  display: false
                },
                min: 50,
                max: 150,
                grid: {
                  display: false
                },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 11,
                  includeBounds: true
                }
              },
              y: {
                display: false,
                beginAtZero: true,
                grid: {
                  display: false
                },
                suggestedMax: 100
              }
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false
              }
            }
          }}
        />
      </div>
      
      <div className="text-center bg-blue-500/5 px-6 py-3 rounded-2xl mb-2">
        <div className="flex flex-row items-center justify-center gap-3">
          <img 
            src="/images/logo.webp" 
            alt="TrueTest Logo" 
            className="w-8 h-8"
          />
          <p className="text-blue-600 dark:text-blue-400 text-3xl font-semibold">TrueTest.pro</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-center bg-zinc-900/5 dark:bg-zinc-100/5 backdrop-blur-sm px-6 py-3 rounded-2xl">
          <p className="text-zinc-600 dark:text-zinc-300 font-medium mb-2 text-xl">
            Your IQ is in the top <span className="inline-block bg-blue-500/10 px-2 rounded-lg text-black">{calculatePercentile(iqScore).toFixed(1)}%</span>
          </p>
          <p className="text-zinc-600 dark:text-zinc-300 font-medium text-xl">
            You&apos;re smarter than <span className="inline-block bg-blue-500/10 px-2 rounded-lg text-black">{(100 - calculatePercentile(iqScore)).toFixed(1)}%</span> <br />of people
          </p>
        </div>

        <div className="relative mt-4 bg-zinc-900/5 dark:bg-zinc-100/5 backdrop-blur-sm px-6 py-6 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 dark:via-black/80 to-white dark:to-black z-10" 
               style={{
                 background: 'linear-gradient(to bottom, transparent 15%, rgba(255,255,255,0.8) 30%, white 45%)' // For light mode
               }}
          ></div>
          <div className="dark:hidden absolute inset-0 z-10" 
               style={{
                 background: 'linear-gradient(to bottom, transparent 15%, rgba(255,255,255,0.8) 30%, white 45%)'
               }}
          ></div>
          <div className="hidden dark:block absolute inset-0 z-10" 
               style={{
                 background: 'linear-gradient(to bottom, transparent 15%, rgba(0,0,0,0.8) 30%, black 45%)'
               }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center py-2">
              <div className="animate-pulse mb-2">
                <svg className="w-8 h-8 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-medium text-zinc-700 dark:text-zinc-300">Detailed Analysis Processing</p>
              <p className="text-sm text-blue-500 dark:text-blue-400">Check back in ~1 hour</p>
            </div>
          </div>
          
          <div className="opacity-20">
            <p className="text-sm italic text-zinc-600 dark:text-zinc-400 mb-4">
              Your complete analysis contains detailed insights about your unique cognitive profile, personalized recommendations, and much more...
            </p>

            <h3 className="font-medium text-lg mb-2">Cognitive Strengths Analysis</h3>
            <p className="mb-4">Your test results indicate exceptional performance in pattern recognition and logical reasoning tasks. This suggests strong analytical capabilities...</p>
            
            <h3 className="font-medium text-lg mb-2">Career Compatibility</h3>
            <p className="mb-4">Based on your cognitive profile, you show high potential for roles requiring strategic thinking and complex problem-solving...</p>
            
            <h3 className="font-medium text-lg mb-2">Learning Style Assessment</h3>
            <p className="mb-4">Your response patterns suggest you excel with visual and abstract learning approaches...</p>
            
            <h3 className="font-medium text-lg mb-2">Cognitive Development Recommendations</h3>
            <p>Personalized strategies to further enhance your intellectual capabilities...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
