'use client';

import { useRouter } from 'next/navigation';
import styles from 'styles/startButton.module.css';

export default function StartButton() {
    const router = useRouter();

    const handleClick = () => {
        router.push('/test');
    };

    return (
        <button className={`${styles.startButton} py-2 text-sm`} onClick={handleClick}>
            Start Now
        </button>        
    );
}
