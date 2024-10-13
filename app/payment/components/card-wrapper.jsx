import styles from "app/payment/styles/cardWrapper.module.css";
import GoalHeart from "components/SVGs/goal-heart.jsx";
import GoalSmile from "components/SVGs/goal-smile.jsx";
import PricingDetails from './pricing-details';

const CardWrapper = ({ price }) => {
  return (
    <div id="report-card" className={styles["card-wrapper"]}>
      <div className={styles["card"]}>
        <div className={styles["discount-border"]}>
          <p>DISCOUNT</p>
        </div>
        <div className="bg-gray-50 rounded-lg mt-9 
          relative w-full max-w-95 flex flex-col items-center pb-5">
          <p className="mt-3 text-black text-lg font-semibold text-center">Your Personalized Report &</p>
          <span></span>
          <p className="text-black text-lg font-semibold text-center">AI Relationship Advice is ready.</p>

          <div className="w-full flex justify-start transform scale-90">
            <GoalHeart />
          </div>
          <div className="w-full flex justify-start transform scale-90">
            <GoalSmile />
          </div>
        </div>

        <PricingDetails price={price} />
      </div>
    </div>
  );
};

export default CardWrapper;