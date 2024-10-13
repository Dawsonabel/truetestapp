const SecureCheckout = ({ openModal }) => (
  <div className="w-full max-w-md mx-auto flex flex-col items-center mt-2 px-4">
    {/* Button */}
    <div className="w-full mb-4 mt-4 flex justify-center">
      <button
        id="card-button"
        onClick={openModal}
        className="w-11/12 bg-green-600 text-white font-bold py-3 rounded-lg shadow-none hover:bg-green-700 transition-transform"
      >
        GET MY REPORT
      </button>
    </div>

    <div className="flex items-center justify-center mb-7 mt-2">
      <svg width="23" height="23" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#5dda5f" className="mr-2">
        <path d="M19.42,3.83,12.24,2h0A.67.67,0,0,0,12,2a.67.67,0,0,0-.2,0h0L4.58,3.83A2,2,0,0,0,3.07,5.92l.42,5.51a12,12,0,0,0,7.24,10.11l.88.38h0a.91.91,0,0,0,.7,0h0l.88-.38a12,12,0,0,0,7.24-10.11l.42-5.51A2,2,0,0,0,19.42,3.83ZM15.71,9.71l-4,4a1,1,0,0,1-1.42,0l-2-2a1,1,0,0,1,1.42-1.42L11,11.59l3.29-3.3a1,1,0,0,1,1.42,1.42Z" />
      </svg>
      <p className="mr-0.5 text-sm leading-none">Secure Payments by</p>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 420 170"
        className="h-4 inline-block align-baseline"
        style={{ marginTop: '-0.25rem', marginLeft: '-0.15rem' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <path 
          fill="#635bff" 
          fillRule="evenodd" 
          d="M414 113.4c0-25.6-12.4-45.8-36.1-45.8-23.8 0-38.2 20.2-38.2 45.6 0 30.1 17 45.3 41.4 45.3 11.9 0 20.9-2.7 27.7-6.5v-20c-6.8 3.4-14.6 5.5-24.5 5.5-9.7 0-18.3-3.4-19.4-15.2h48.9c0-1.3.2-6.5.2-8.9zm-49.4-9.5c0-11.3 6.9-16 13.2-16 6.1 0 12.6 4.7 12.6 16h-25.8zM301.1 67.6c-9.8 0-16.1 4.6-19.6 7.8l-1.3-6.2h-22v116.6l25-5.3.1-28.3c3.6 2.6 8.9 6.3 17.7 6.3 17.9 0 34.2-14.4 34.2-46.1-.1-29-16.6-44.8-34.1-44.8zm-6 68.9c-5.9 0-9.4-2.1-11.8-4.7l-.1-37.1c2.6-2.9 6.2-4.9 11.9-4.9 9.1 0 15.4 10.2 15.4 23.3 0 13.4-6.2 23.4-15.4 23.4zM223.8 61.7l25.1-5.4V36l-25.1 5.3zM223.8 69.3h25.1v87.5h-25.1zM196.9 76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7 15.9-6.3 19-5.2v-23c-3.2-1.2-14.9-3.4-20.8 7.4zM146.9 47.6l-24.4 5.2-.1 80.1c0 14.8 11.1 25.7 25.9 25.7 8.2 0 14.2-1.5 17.5-3.3V135c-3.2 1.3-19 5.9-19-8.9V90.6h19V69.3h-19l.1-21.7zM79.3 94.7c0-3.9 3.2-5.4 8.5-5.4 7.6 0 17.2 2.3 24.8 6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5 67.6 54 78.2 54 95.9c0 27.6 38 23.2 38 35.1 0 4.6-4 6.1-9.6 6.1-8.3 0-18.9-3.4-27.3-8v23.8c9.3 4 18.7 5.7 27.3 5.7 20.8 0 35.1-10.3 35.1-28.2-.1-29.8-38.2-24.5-38.2-35.7z"
        />
      </svg>
    </div>

    <div>
      <p className="text-gray-600 text-xs text-center">
        You are signing up for a monthly subscription to the TRAITLY service. 
        By proceeding, you acknowledge that unless you cancel before the end of the 7-day trial, 
        a recurring charge of $40 will be automatically applied every 30 days until you cancel through your account settings. 
        The charge will show on your bill as traitly.me. For more information on cancellation and refunds, 
        please refer to the{" "}
        <a href="/subscription" className="underline">
          Subscription Policy.
        </a>
      </p>
    </div>
  </div>
);

export default SecureCheckout;