'use client';

import { useState, useEffect } from 'react';
import styles from 'app/results/styles/results.module.css';
import { useRouter } from 'next/navigation';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip,
  Legend,
  PolarAreaController,
  ArcElement,
} from 'chart.js';
import { PolarArea, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import PolarChart from './components/PolarChart';
import BarChart from './components/BarChart';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Tooltip,
  Legend,
  PolarAreaController,
  ArcElement,
  ChartDataLabels
);

const TYPE_COLORS = {
  1: 'rgba(255, 87, 87, 0.9)',    // Type 1 - Red
  2: 'rgba(56, 161, 105, 0.9)',   // Type 2 - Green
  3: 'rgba(255, 182, 73, 0.9)',   // Type 3 - Yellow/Gold
  4: 'rgba(72, 87, 140, 0.9)',    // Type 4 - Blue
  5: 'rgba(90, 205, 244, 1)',     // Type 5 - Light Blue
  6: 'rgba(76, 76, 76, 0.9)',     // Type 6 - Grey/Brown
  7: 'rgba(255, 159, 64, 0.9)',   // Type 7 - Orange
  8: 'rgba(128, 0, 0, 0.9)',      // Type 8 - Dark Red/Maroon
  9: 'rgba(97, 166, 125, 1)',     // Type 9 - Sage Green
};

const TYPE_NAMES = {
  1: 'The Idealist',
  2: 'The Connector',
  3: 'The Go-Getter',
  4: 'The Dreamer',
  5: 'The Analyst',
  6: 'The Loyalist',
  7: 'The Adventurer',
  8: 'The Challenger',
  9: 'The Harmonizer'
};

// Add this constant for sub-descriptors
const TYPE_DESCRIPTORS = {
  1: 'Dreamer',
  2: 'Empath',
  3: 'Achiever',
  4: 'Romantic',
  5: 'Thinker',
  6: 'Guardian',
  7: 'Explorer',
  8: 'Leader',
  9: 'Peacemaker'
};

// Update TRAIT_SCORING to include all traits
const TRAIT_SCORING = {
  discipline: {
    'question-1': [35, 28, 0, -10, -25],
    'question-7': [35, 25, 10, -10, -30],
    'question-10': [40, 30, 5, -10, -25],
    'question-23': [45, 35, 10, -15, -40],
    'question-30': [45, 35, 15, -15, -40]
  },
  control: {
    'question-1': [22, 15, 5, -18, -30],
    'question-8': [50, 35, 10, -20, -45]
  },
  selfExpression: {
    'question-2': [30, 20, 0, -15, -35],
    'question-11': [45, 35, 15, -10, -30]
  },
  emotionProcessing: {
    'question-2': [25, 18, 5, -20, -30],
    'question-19': [40, 30, 10, -15, -35],
    'question-28': [30, 20, 10, -10, -25]
  },
  empathy: {
    'question-3': [40, 30, 0, -10, -25],
    'question-17': [45, 35, 15, -10, -30],
    'question-24': [50, 35, 15, -10, -30],
    'question-31': [50, 40, 10, -20, -40],
    'question-32': [45, 30, 15, -10, -30]
  },
  knowledgeSeeking: {
    'question-4': [35, 25, 0, -20, -40],
    'question-13': [50, 40, 15, -10, -35],
    'question-25': [45, 35, 15, -10, -40],
    'question-34': [45, 35, 10, -15, -35]
  },
  ambition: {
    'question-5': [50, 35, 10, -15, -40],
    'question-12': [50, 35, 10, -15, -40],
    'question-21': [45, 35, 15, -15, -40],
    'question-33': [50, 40, 15, -15, -40]
  },
  confidence: {
    'question-5': [25, 20, 5, -10, -30],
    'question-10': [30, 20, 5, -15, -30],
    'question-23': [30, 25, 10, -10, -30],
    'question-33': [30, 20, 5, -10, -25]
  },
  security: {
    'question-7': [40, 30, 5, -15, -35],
    'question-18': [50, 35, 10, -15, -40],
    'question-26': [50, 35, 10, -15, -40],
    'question-30': [30, 20, 5, -10, -30],
    'question-36': [50, 35, 10, -15, -40]
  },
  adaptability: {
    'question-9': [45, 35, 15, -10, -30],
    'question-14': [40, 30, 15, -10, -25],
    'question-27': [40, 30, 15, -10, -25],
    'question-35': [40, 30, 10, -15, -35]
  },
  resilience: {
    'question-8': [35, 25, 5, -15, -30],
    'question-16': [50, 40, 10, -20, -45],
    'question-22': [50, 35, 10, -15, -40],
    'question-29': [40, 30, 5, -15, -35]
  },
  harmonySeeking: {
    'question-3': [25, 15, 5, -10, -25],
    'question-6': [30, 20, 5, -15, -30],
    'question-15': [45, 30, 15, -15, -30],
    'question-20': [50, 40, 15, -15, -35],
    'question-26': [35, 25, 5, -10, -30],
    'question-31': [35, 25, 10, -10, -25]
  }
};

// Add this function to calculate trait percentages
const calculateTraitPercentage = (rawAnswers, traitScoring) => {
  let totalScore = 0;
  let maxPossibleScore = 0;
  let minPossibleScore = 0;

  // First, format all answers into a flat structure
  const answers = {};
  Object.entries(rawAnswers).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([qKey, qValue]) => {
        if (qKey.startsWith('question-') && typeof qValue === 'number' && qValue !== -1) {
          answers[qKey] = qValue;
        }
      });
    }
  });

  // Now calculate trait scores using the formatted answers
  Object.entries(traitScoring).forEach(([question, scores]) => {
    const answer = answers[question];
    
    if (typeof answer === 'number' && !isNaN(answer)) {
      // Convert 1-5 answer to 0-4 index
      const scoreIndex = answer - 1;
      totalScore += scores[scoreIndex];

      // Add maximum and minimum possible scores for this question
      maxPossibleScore += scores[0];
      minPossibleScore += Math.min(...scores);
    }
  });

  // Guard against division by zero
  if (maxPossibleScore === minPossibleScore) return 0;

  // Calculate percentage with adjusted scaling
  const range = maxPossibleScore - minPossibleScore;
  const normalizedScore = totalScore - minPossibleScore;
  
  // 1. First normalize to 0-1 range
  let normalizedPercentage = normalizedScore / range;
  
  // 2. Apply a curve that spreads out the middle values
  // This will create more variation in the 30-70% range
  normalizedPercentage = Math.pow(normalizedPercentage, 0.7);
  
  // 3. Convert to percentage and adjust range to be 20-95 instead of 0-100
  let percentage = Math.round(20 + (normalizedPercentage * 75));

  // Ensure percentage stays within bounds
  if (percentage > 95) percentage = 95;
  if (percentage < 20) percentage = 20;

  return percentage;
};

const ResultsPage = () => {
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullResultsAvailable, setIsFullResultsAvailable] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Check if full results should be available
    const completionTime = localStorage.getItem('assessmentCompletionTime');
    if (completionTime) {
      const timePassed = Date.now() - parseInt(completionTime);
      const minutesPassed = Math.floor(timePassed / (1000 * 60));
      setIsFullResultsAvailable(minutesPassed >= 75);
    }

    const fetchResults = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-results', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Server response:', response.status, errorData);
          throw new Error(`Failed to fetch results: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received data:', data);
        setResults(data);

        // Set completion time if not already set
        if (!localStorage.getItem('assessmentCompletionTime')) {
          localStorage.setItem('assessmentCompletionTime', Date.now().toString());
        }
      } catch (err) {
        console.error('Error fetching results:', err);
        setError('Failed to load your results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    // Check every minute if results should be unlocked
    const interval = setInterval(() => {
      const completionTime = localStorage.getItem('assessmentCompletionTime');
      if (completionTime) {
        const timePassed = Date.now() - parseInt(completionTime);
        const minutesPassed = Math.floor(timePassed / (1000 * 60));
        setIsFullResultsAvailable(minutesPassed >= 75);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [router]);

  const calculateTypeScores = (rawAnswers) => {
    // Question to Type mapping
    const questionTypeMap = {
      'question-1': 1, 'question-2': 2,
      'question-3': 3, 'question-4': 4,
      'question-5': 5, 'question-6': 6,
      'question-7': 7, 'question-8': 8,
      'question-9': 9, 'question-10': 1,
      'question-11': 2, 'question-12': 3,
      'question-13': 4, 'question-14': 5,
      'question-15': 6, 'question-16': 7,
      'question-17': 8, 'question-18': 9,
      'question-19': 1, 'question-20': 2,
      'question-21': 3, 'question-22': 4,
      'question-23': 5, 'question-24': 6,
      'question-25': 7, 'question-26': 8,
      'question-27': 9, 'question-28': 1,
      'question-29': 2, 'question-30': 3,
      'question-31': 4, 'question-32': 5,
      'question-33': 6, 'question-34': 7,
    };

    // Initialize scores for each type
    const typeScores = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
      6: 0, 7: 0, 8: 0, 9: 0
    };

    // Process each answer section
    Object.entries(rawAnswers).forEach(([section, answers]) => {
      Object.entries(answers).forEach(([question, score]) => {
        if (question.startsWith('question-') && typeof score === 'number') {
          const typeNumber = questionTypeMap[question];
          if (typeNumber) {
            typeScores[typeNumber] += score;
          }
        }
      });
    });

    return typeScores;
  };

  const determineTypes = (typeScores) => {
    // Convert to array of [type, score] pairs and sort by score (descending)
    const sortedScores = Object.entries(typeScores)
      .map(([type, score]) => ({ type: parseInt(type), score }))
      .sort((a, b) => b.score - a.score || b.type - a.type); // If scores tie, higher type number wins

    return {
      mainType: sortedScores[0].type,
      subTypes: [sortedScores[1].type, sortedScores[2].type]
    };
  };

  const prepareChartData = (typeScores) => {
    const labels = Object.keys(typeScores).map(type => `Type ${type}`);
    const scores = Object.values(typeScores);
    
    // Define colors once to ensure consistency between charts
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

    return {
      polar: {
        labels,
        datasets: [{
          data: scores,
          backgroundColor: pastelColors,
          borderColor: pastelColors.map(color => color.replace('0.9', '1')),
          borderWidth: 1,
        }]
      },
      bar: {
        labels,
        datasets: [{
          data: scores,
          backgroundColor: pastelColors,
          borderColor: pastelColors.map(color => color.replace('0.9', '1')),
          borderWidth: 1,
          borderRadius: 8,
        }]
      }
    };
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <svg viewBox="0 0 50 50" className={styles.spinner}>
            <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4"/>
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.glassCard}>
          <svg className={styles.errorIcon} viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <p className={styles.error}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.resultsContainer}>
        {results?.rawAnswers && (
          <div className={styles.resultContainer}>
            <h1 className={styles.resultsTitle}>Your Results</h1>
            <div className={styles.resultContent}>
              <img 
                src={`/images/results/type${determineTypes(calculateTypeScores(results.rawAnswers)).mainType}.png`}
                alt="Type Result"
                className={styles.typeImage}
              />
              <div className={styles.typeDetails}>
                <div 
                  className={styles.mainType}
                  style={{ 
                    color: TYPE_COLORS[determineTypes(calculateTypeScores(results.rawAnswers)).mainType] 
                  }}
                >
                  {TYPE_NAMES[determineTypes(calculateTypeScores(results.rawAnswers)).mainType]}
                  <span> (Type {determineTypes(calculateTypeScores(results.rawAnswers)).mainType})</span>
                </div>
                <div className={styles.subType}>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className={styles.label}>
                    {TYPE_DESCRIPTORS[determineTypes(calculateTypeScores(results.rawAnswers)).mainType]}
                  </span>
                </div>
                <div className={styles.subTypes}>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className={styles.label}>
                    Subtypes: {determineTypes(calculateTypeScores(results.rawAnswers)).subTypes.join(' and ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Type Scores Display */}
        <div className={styles.descriptionCard}>
          {results?.rawAnswers && (
            <div className={styles.chartsContainer}>
              <PolarChart data={prepareChartData(calculateTypeScores(results.rawAnswers)).polar} />
              <BarChart data={prepareChartData(calculateTypeScores(results.rawAnswers)).bar} />
            </div>
          )}
        </div>

        <div className={styles.traitCardsContainer}>
          <div className={`${styles.traitCard} ${styles.discipline}`}>
            <div className={styles.traitName}>Discipline</div>
            <div className={styles.traitPercentage}>
              {results?.rawAnswers ? 
                `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.discipline)}%` : 
                '0%'}
            </div>
          </div>
          <div className={`${styles.traitCard} ${styles.control}`}>
            <div className={styles.traitName}>Control</div>
            <div className={styles.traitPercentage}>
              {results?.rawAnswers ? 
                `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.control)}%` : 
                '0%'}
            </div>
          </div>
          <div className={`${styles.traitCard} ${styles.selfExpression}`}>
            <div className={styles.traitName}>Self-expression</div>
            <div className={styles.traitPercentage}>
              {results?.rawAnswers ? 
                `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.selfExpression)}%` : 
                '0%'}
            </div>
          </div>
        </div>

        <div className={styles.traitCardsContainer}>
          <div className={`${styles.traitCard} ${styles.emotionProcessing}`}>
            <div className={styles.traitName}>Emotion Processing</div>
            <div className={styles.traitPercentage}>
              {results?.rawAnswers ? 
                `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.emotionProcessing)}%` : 
                '0%'}
            </div>
          </div>
          <div className={`${styles.traitCard} ${styles.empathy}`}>
            <div className={styles.traitName}>Empathy</div>
            <div className={styles.traitPercentage}>
              {results?.rawAnswers ? 
                `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.empathy)}%` : 
                '0%'}
            </div>
          </div>
          <div className={`${styles.traitCard} ${styles.knowledgeSeeking}`}>
            <div className={styles.traitName}>Knowledge Seeking</div>
            <div className={styles.traitPercentage}>
              {results?.rawAnswers ? 
                `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.knowledgeSeeking)}%` : 
                '0%'}
            </div>
          </div>
        </div>

        <div className={styles.traitCardsContainer}>
          <div className={`${styles.traitCard} ${styles.ambition}`}>
            <div className={styles.traitName}>Ambition</div>
            <div className={styles.traitPercentage}>
              {results?.rawAnswers ? 
                `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.ambition)}%` : 
                '0%'}
            </div>
          </div>
          <div className={`${styles.traitCard} ${styles.confidence}`}>
            <div className={styles.traitName}>Confidence</div>
            <div className={styles.traitPercentage}>
              {results?.rawAnswers ? 
                `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.confidence)}%` : 
                '0%'}
            </div>
          </div>
          <div className={`${styles.traitCard} ${styles.security}`}>
            <div className={styles.traitName}>Security</div>
            <div className={styles.traitPercentage}>
              {results?.rawAnswers ? 
                `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.security)}%` : 
                '0%'}
            </div>
          </div>
        </div>

        <div className={styles.traitCardsContainer}>
          <div className={`${styles.traitCard} ${styles.adaptability}`}>
            <div className={styles.traitName}>Adaptability</div>
            <div className={styles.traitPercentage}>
              {results?.rawAnswers ? 
                `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.adaptability)}%` : 
                '0%'}
            </div>
          </div>
          <div className={`${styles.traitCard} ${styles.resilience}`}>
            <div className={styles.traitName}>Resilience</div>
            <div className={styles.traitPercentage}>
              {results?.rawAnswers ? 
                `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.resilience)}%` : 
                '0%'}
            </div>
          </div>
          <div className={`${styles.traitCard} ${styles.harmonySeeking}`}>
            <div className={styles.traitName}>Harmony Seeking</div>
            <div className={styles.traitPercentage}>
              {results?.rawAnswers ? 
                `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.harmonySeeking)}%` : 
                '0%'}
            </div>
          </div>
        </div>

        {!isFullResultsAvailable && <div className={styles.shadowOverlay} />}

        {isFullResultsAvailable ? (
          <>
            <div className={styles.traitCardsContainer}>
              <div className={`${styles.traitCard} ${styles.discipline}`}>
                <div className={styles.traitName}>Discipline</div>
                <div className={styles.traitPercentage}>
                  {results?.rawAnswers ? 
                    `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.discipline)}%` : 
                    '0%'}
                </div>
              </div>
              <div className={`${styles.traitCard} ${styles.control}`}>
                <div className={styles.traitName}>Control</div>
                <div className={styles.traitPercentage}>
                  {results?.rawAnswers ? 
                    `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.control)}%` : 
                    '0%'}
                </div>
              </div>
              <div className={`${styles.traitCard} ${styles.selfExpression}`}>
                <div className={styles.traitName}>Self-expression</div>
                <div className={styles.traitPercentage}>
                  {results?.rawAnswers ? 
                    `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.selfExpression)}%` : 
                    '0%'}
                </div>
              </div>
            </div>

            <div className={styles.traitCardsContainer}>
              <div className={`${styles.traitCard} ${styles.emotionProcessing}`}>
                <div className={styles.traitName}>Emotion Processing</div>
                <div className={styles.traitPercentage}>
                  {results?.rawAnswers ? 
                    `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.emotionProcessing)}%` : 
                    '0%'}
                </div>
              </div>
              <div className={`${styles.traitCard} ${styles.empathy}`}>
                <div className={styles.traitName}>Empathy</div>
                <div className={styles.traitPercentage}>
                  {results?.rawAnswers ? 
                    `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.empathy)}%` : 
                    '0%'}
                </div>
              </div>
              <div className={`${styles.traitCard} ${styles.knowledgeSeeking}`}>
                <div className={styles.traitName}>Knowledge Seeking</div>
                <div className={styles.traitPercentage}>
                  {results?.rawAnswers ? 
                    `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.knowledgeSeeking)}%` : 
                    '0%'}
                </div>
              </div>
            </div>

            <div className={styles.traitCardsContainer}>
              <div className={`${styles.traitCard} ${styles.ambition}`}>
                <div className={styles.traitName}>Ambition</div>
                <div className={styles.traitPercentage}>
                  {results?.rawAnswers ? 
                    `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.ambition)}%` : 
                    '0%'}
                </div>
              </div>
              <div className={`${styles.traitCard} ${styles.confidence}`}>
                <div className={styles.traitName}>Confidence</div>
                <div className={styles.traitPercentage}>
                  {results?.rawAnswers ? 
                    `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.confidence)}%` : 
                    '0%'}
                </div>
              </div>
              <div className={`${styles.traitCard} ${styles.security}`}>
                <div className={styles.traitName}>Security</div>
                <div className={styles.traitPercentage}>
                  {results?.rawAnswers ? 
                    `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.security)}%` : 
                    '0%'}
                </div>
              </div>
            </div>

            <div className={styles.traitCardsContainer}>
              <div className={`${styles.traitCard} ${styles.adaptability}`}>
                <div className={styles.traitName}>Adaptability</div>
                <div className={styles.traitPercentage}>
                  {results?.rawAnswers ? 
                    `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.adaptability)}%` : 
                    '0%'}
                </div>
              </div>
              <div className={`${styles.traitCard} ${styles.resilience}`}>
                <div className={styles.traitName}>Resilience</div>
                <div className={styles.traitPercentage}>
                  {results?.rawAnswers ? 
                    `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.resilience)}%` : 
                    '0%'}
                </div>
              </div>
              <div className={`${styles.traitCard} ${styles.harmonySeeking}`}>
                <div className={styles.traitName}>Harmony Seeking</div>
                <div className={styles.traitPercentage}>
                  {results?.rawAnswers ? 
                    `${calculateTraitPercentage(results.rawAnswers, TRAIT_SCORING.harmonySeeking)}%` : 
                    '0%'}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.lockedResultsContainer}>
            <div className={styles.lockedContent}>
              <svg className={styles.loadingIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"
                />
              </svg>
              <h3>Full Results Loading...</h3>
              <p>Check back in an hour to see your complete personality analysis.</p>
              <p>This waiting period allows for deeper reflection and more accurate results.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
