"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from 'app/choice/styles/choice.module.css';
import AmountButton from 'app/choice/components/AmountButton';
import UsersChoice from 'app/choice/components/UsersChoice';

const PayWhatYouWish = () => {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState(null);

  useEffect(() => {
    // Clear any existing selectedPrice when component mounts
    localStorage.removeItem('selectedPrice');
  }, []);

  const amounts = [
    { value: 1, label: "$1" },
    { value: 5, label: "$5" },
    { value: 9, label: "$9" },
    { value: 12.47, label: "$12.47" }
  ];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
  };

  const handleContinue = () => {
    if (selectedAmount) {
      // Store the selected amount in localStorage
      localStorage.setItem('selectedPrice', selectedAmount);
      router.push('/payment');
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-start ${styles['bg-custom-pink']}`}>
      <div className="p-7 w-full max-w-[390px]">
        <p className="text-black text-center mb-3 mt-9 text-2xl font-semibold">
        Choose what works for you
        </p>

        <hr className="border-t border-black my-4 mx-2" />
          
        <div className="px-0.5">
          <p className="text-black text-left mb-3 mt-0">
          Traitly sets the standard for understanding yourself and your relationships.
          Thousands of people just like you rely on us.
          </p>
          <p className="text-black font-normal text-left mb-2">
          </p>
          <p className="text-black text-left mb-2">
          Look, we get it... Money&apos;s tight.
          </p>
          <p className="text-black text-left mb-2">
          
          </p>
          <p className="text-black text-left mb-2">
          But your peace of mind? Priceless.
          We strongly believe no one should feel like they can&apos;t afford to be happy.

          </p>
          <p className="text-black text-left mb-2">
          </p>
          <p className="text-black text-left mb-2 font-semibold">
          That&apos;s why we let you choose your amount.
          </p>
        </div>
        <p className="text-mixed-600 font-medium text-left mb-4">
        It costs us $12.47 to offer a 7-day trial, but please 
        choose the price that works for you.
        </p>
        <div className="flex justify-between mb-3 relative">
          {amounts.map((amount) => (
            <AmountButton
              key={amount.value}
              amount={amount}
              selectedAmount={selectedAmount}
              handleAmountSelect={handleAmountSelect}
            />
          ))}
        </div>
        <div className="flex justify-start items-center mb-4">
          <span className=" text-xsm text-black ml-4 mt-1">Supports lower trial prices for those who need it!</span>
          <div className="text-md ml-1 text-mixed-600 font-extrabold">
            <p >⤴</p>
          </div>
        </div>
        {/* <UsersChoice /> */}
        <button
          onClick={handleContinue}
          disabled={!selectedAmount}
          className={`w-full py-3 rounded-lg text-white font-bold transition-all mt-14 ${
            selectedAmount
              ? `${styles['selected-button']} hover:opacity-90`
              : 'bg-gray-300 cursor-not-allowed rounded-[15px]'
          }`}
        >
          See my report
        </button>
      </div>
    </div>
  );
};

export default PayWhatYouWish;