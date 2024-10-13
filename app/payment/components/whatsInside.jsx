import React from 'react';

const Details = () => {
  return (
    <div className="w-full max-w-md mx-auto mt-14 px-4">
      <h2 className="text-2xl font-bold text-center mb-2">What&apos;s Inside</h2>
      <div className="bg-gray-100 bg-opacity-40 rounded-lg p-4">
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="mr-2 text-xl">🧠</span>
            <span>Detailed personality analysis based on your responses</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-xl">💬</span>
            <span>1:1 AI relationship advice chat</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-xl">💡</span>
            <span>Strengths and weaknesses insignts</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-xl">💕</span>
            <span>Find the most compatible partner</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-xl">🚀</span>
            <span>Personal & professional development</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Details;
