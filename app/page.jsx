"use client";

import styles from '../styles/home.module.css';
import HomeHeader from '../components/homeHeader';
import StartButton from '../components/startButton';
import Circle from '../components/SVGs/circle';
import EnneagramSvg from '../components/SVGs/enneagram';
import Reviews2 from '../components/reviews2';

export default function Page() {
  const handleMainClick = () => {
    console.log('Main area clicked');
  };

  return (
    <div className={styles.fullWidthContainer}>
      <div className={styles.pageContainer} onClick={handleMainClick}>
        <div className={styles.pageBackground}>
          <Circle className={styles.backgroundCircle} />
        </div>
        <HomeHeader /> 
        <main className="flex flex-col items-center justify-start p-4 relative z-10">
          <div className="flex flex-col items-center justify-start flex-grow mt-17 mb-0 pb-0">
            <h1 className="text-4xl font-bold mb-2">KNOW YOURSELF</h1>
            <p className="text-lg font-normal mt-3 text-center max-w-[550px]">
              Hannah has biglys
            </p>
            <StartButton />        
            <p className="text-xs mt-2 text-gray-600">Take the test</p>
          </div>
          {/* Added a spacer div with large margin */}
          <div className="w-full mt-25 md:mt-28 lg:mt-30"></div>
          <div className="w-full max-w-[500px] mb-8">
            <img src="/images/artificial-intelligence.png" alt="AI Image" className="w-3/4 h-auto mb-4 mx-auto" />
            <div className="flex items-center mb-2">
              <h2 className="text-2xl font-bold text-left">What is Traitly?</h2>
              <EnneagramSvg className={styles.smallEnneagram} />
            </div>
            <p className="text-md font-normal mt-0 text-left">
              We&apos;re here to help you understand yourself and level up every connection in your life.
              <span className={styles.softUnderline}>&nbsp;Traitly is the most personalized wellness tool</span>, built on research-backed Enneagram insights.
            </p>
            <div className="flex items-center mt-3">
              <p className="text-md font-normal text-left mr-2">
                Join Traitly, and you&apos;ll get
              </p>
              <span className={styles.orangeArrow}>⤵</span>
            </div>
            
            {/* New Traitly Features Card */}
            <div className="bg-blue-500 bg-opacity-10 p-6 mt-4">
              <h3 className="text-xl font-bold mb-4">Discover Your Traitly Journey</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                  <span>Personalized Enneagram Assessment</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                  <span>AI Relationship Advice Chat</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  <span>Relationship Compatibility Analysis</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  <span>Daily Reflection Prompts</span>
                </li>
              </ul>
            </div>

            {/* New smaller cards */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-blue-500 bg-opacity-10 p-2 flex flex-col items-center">
                <svg className="w-12 h-12 mb-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                <span className="text-sm font-semibold text-center mb-3">Personality Assessment</span>
                <span className="text-sm font-medium text-left bg-white bg-opacity-30 p-2 rounded-md">
                  This is how we give you highly personalized insights. 
                  The test is backed by 20 years of research on the Enneagram. 
                  Most other wellness tools use broad and general advice. 
                  With Traitly, your results are unique to you.                
                </span>
              </div>
              <div className="bg-blue-500 bg-opacity-10 p-2 flex flex-col items-center">
                <svg className="w-12 h-12 mb-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                <span className="text-sm font-semibold text-center mb-3">AI Relationship Advice Chat</span>
                <span className="text-sm font-medium text-left bg-white bg-opacity-30 p-2 rounded-md">
                  This is how we give you highly personalized insights. 
                  The test is backed by 20 years of research on the Enneagram. 
                  Most other wellness tools use broad and general advice. 
                  With Traitly, your results are unique to you.
                </span>
              </div>
              <div className="bg-blue-500 bg-opacity-10 p-2 flex flex-col items-center">
                <svg className="w-12 h-12 mb-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                <span className="text-sm font-semibold text-center mb-3">Compatibility Analysis Report</span>
                <span className="text-sm font-medium text-left bg-white bg-opacity-30 p-2 rounded-md">
                  This is how we give you highly personalized insights. 
                  The test is backed by 20 years of research on the Enneagram. 
                  Most other wellness tools use broad and general advice. 
                  With Traitly, your results are unique to you.
                </span>
              </div>
              <div className="bg-blue-500 bg-opacity-10 p-2 flex flex-col items-center">
                <svg className="w-12 h-12 mb-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                <span className="text-sm font-semibold text-center mb-3">Daily Reflection Prompts</span>
                <span className="text-sm font-medium text-left bg-white bg-opacity-30 p-2 rounded-md">
                  This is how we give you highly personalized insights. 
                  The test is backed by 20 years of research on the Enneagram. 
                  Most other wellness tools use broad and general advice. 
                  With Traitly, your results are unique to you.
                </span>
              </div>
            </div>
              <div className="mt-24">
              <Reviews2 />
              </div>
            <div className="flex flex-col items-center justify-start flex-grow mt-24 mb-10 pb-0">
              <h1 className="text-3xl font-bold mb-2 text-center">So... what&apos;s your plan?</h1>
              <p className="text-lg font-normal mt-3 text-center max-w-[550px]">
                Your personality and wellness is like a fitness journey. 
                You don&apos;t just wake up one day and decide to be fit. 
                You need a plan, a coach, and the right tools. 
                That&apos;s what Traitly is.
              </p>
              <StartButton />        
              <p className="text-xs mt-2 text-gray-600">Take the test</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}