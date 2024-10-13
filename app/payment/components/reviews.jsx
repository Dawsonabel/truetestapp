import React from 'react';

const Review = ({ stars, username, date, review, initials, color }) => (
  <div className="bg-gray-100 bg-opacity-60 rounded-lg p-3 mb-3 text-sm">
    <div className="flex items-center mb-1">
      <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white font-bold mr-2 text-xs`}>
        {initials}
      </div>
      <div>
        <div className="font-bold">{username}</div>
        <div className="text-xs text-gray-600">{date}</div>
      </div>
    </div>
    <div className="mb-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-sm ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      ))}
    </div>
    <p className="text-gray-700 text-sm">{review}</p>
  </div>
);

const Reviews = () => {
  const reviewsData = [
    {
      stars: 5,
      username: "kinsley_r",
      date: "September 26, 2024",
      review: "This personality test was incredibly insightful! It helped me understand myself better.",
      initials: "KI",
      color: "bg-[#975cf6]"  // Purple
    },
    {
      stars: 4,
      username: "muktidhaara",
      date: "July 29, 2024",
      review: "Very much accurate results. The AI relationship advice was very helpful for me specially.",
      initials: "MU",
      color: "bg-[#975cf6]"  // Purple
    },
    {
      stars: 5,
      username: "jwt12",
      date: "July 5, 2024",
      review: "No lie I was skeptical, but the AI Chat feature was very cool, surprisingly accurate and actionable advice.",
      initials: "JW",
      color: "bg-[#0F9D58]"  // Google green
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto mt-6 px-3">
      <h2 className="text-2xl font-bold text-center mb-4 mt-8">What Our Users Say</h2>
      {reviewsData.map((review, index) => (
        <Review key={index} {...review} />
      ))}
    </div>
  );
};

export default Reviews;
