"use client"; // Ensure this line is at the top

import styles from 'app/offer/styles/offer.module.css';
import { useRouter } from 'next/navigation';

const OfferPage = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/discount');
  };

  return (
    <div style={{
      backgroundColor: '#ffeae6',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      <div className={styles.offerContainer} style={{ maxWidth: '400px', width: '100%' }}>
        <div className={styles.topSection}>
          <svg className={`${styles.abstractImage}`} viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
            {/* Greenish shape */}
            <path d="M240 290 C180 350, 280 470, 420 290 C360 140, 240 210, 240 290 Z" fill="rgba(106, 124, 115, 0.6)" />
            {/* Yellow shape */}
            <path d="M320 360 C250 420, 380 540, 580 360 C500 200, 320 270, 320 360 Z" fill="rgba(216, 162, 67, 0.7)" />
            {/* Hand-drawn swirl lines */}
            <path d="M110 310 Q180 260, 260 300 Q340 360, 410 310 Q480 260, 550 310" stroke="rgba(0, 0, 0, 0.2)" strokeWidth="2" fill="none" />
            <path d="M150 350 Q220 300, 300 350 Q380 400, 450 350 Q520 300, 590 350" stroke="rgba(0, 0, 0, 0.2)" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <h1 className={styles.secretDiscountText}>Secret Discount!</h1>

        {/* Transparent card */}
        <div className={styles.cardContainer}>
          <div className={styles.emojiShocked} role="img" aria-label="hush">
            🤩
          </div>
          <h1 className="font-bold text-4xl text-black mb-0">Get 67% off!</h1>

          <div className={styles.benefits}>
            <div className="benefits">
              <span role="img" aria-label="fire" className={styles.icon}>🙌</span>
              67% off on your personal plan
            </div>
            <div className="benefits">
              <span role="img" aria-label="gift" className={styles.icon}>🗓️</span>
              7-day trial
            </div>
            <div className="benefits">
              <span role="img" aria-label="cancel" className={styles.icon}>✓</span>
              Cancel anytime
            </div>
          </div>

          <div className="mb-2">
            <span className={styles.pricingText}>$19</span> <span className={styles.blandPricingText}>instead of $60</span>
          </div>

          <button className={styles.ctaButton} onClick={handleButtonClick}>
            Get secret discount!
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferPage;