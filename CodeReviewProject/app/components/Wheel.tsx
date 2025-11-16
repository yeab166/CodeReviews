"use client";

import { useState } from 'react';
import styles from './Wheel.module.css'
import { Slice } from '../wheeloffortune/page';

interface WheelProps {
  spinning: boolean
  setSpinning: (arg0: boolean) => void
  setSelectedSlice: (arg0: Slice) => void
}

const Wheel = (props: WheelProps) => {
const slices: Slice[] = [
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--five)', label: '5', value: 5, bonus: false, target: 'five' },
  { color: 'var(--two)', label: '2', value: 2, bonus: false, target: 'two' },
  { color: 'var(--ten)', label: '10', value: 10, bonus: false, target: 'ten' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--pch)', label: 'Pachinko', value: 0, bonus: true, target: 'pch' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--two)', label: '2', value: 2, bonus: false, target: 'two' },
  { color: 'var(--five)', label: '5', value: 5, bonus: false, target: 'five' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--two)', label: '2', value: 2, bonus: false, target: 'two' },
  { color: 'var(--cf)', label: 'Coin Flip', value: 0, bonus: true, target: 'cf' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--ten)', label: '10', value: 10, bonus: false, target: 'ten' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--five)', label: '5', value: 5, bonus: false, target: 'five' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--ch)', label: 'Cash Hunt', value: 0, bonus: true, target: 'ch' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--two)', label: '2', value: 2, bonus: false, target: 'two' },
  { color: 'var(--five)', label: '5', value: 5, bonus: false, target: 'five' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--two)', label: '2', value: 2, bonus: false, target: 'two' },
  { color: 'var(--cf)', label: 'Coin Flip', value: 0, bonus: true, target: 'cf' },
  { color: 'var(--two)', label: '2', value: 2, bonus: false, target: 'two' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--ten)', label: '10', value: 10, bonus: false, target: 'ten' },
  { color: 'var(--two)', label: '2', value: 2, bonus: false, target: 'two' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--jp)', label: 'Jackpot', value: 0, bonus: true, target: 'jp' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--two)', label: '2', value: 2, bonus: false, target: 'two' },
  { color: 'var(--five)', label: '5', value: 5, bonus: false, target: 'five' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--two)', label: '2', value: 2, bonus: false, target: 'two' },
  { color: 'var(--pch)', label: 'Pachinko', value: 0, bonus: true, target: 'pch' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--five)', label: '5', value: 5, bonus: false, target: 'five' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--two)', label: '2', value: 2, bonus: false, target: 'two' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--cf)', label: 'Coin Flip', value: 0, bonus: true, target: 'cf' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--two)', label: '2', value: 2, bonus: false, target: 'two' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--ten)', label: '10', value: 10, bonus: false, target: 'ten' },
  { color: 'var(--two)', label: '2', value: 2, bonus: false, target: 'two' },
  { color: 'var(--ch)', label: 'Cash Hunt', value: 0, bonus: true, target: 'ch' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--two)', label: '2', value: 2, bonus: false, target: 'two' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--five)', label: '5', value: 5, bonus: false, target: 'five' },
  { color: 'var(--one)', label: '1', value: 1, bonus: false, target: 'one' },
  { color: 'var(--cf)', label: 'Coin Flip', value: 0, bonus: true, target: 'cf' }
];

//const slices: Slice[] = [
//  { color: 'var(--pch)', label: 'Pachinko', value: 0, bonus: true, target: 'pch' },
//  { color: 'var(--cf)', label: 'Coin Flip', value: 0, bonus: true, target: 'cf' },
//  { color: 'var(--ch)', label: 'Cash Hunt', value: 0, bonus: true, target: 'ch' },
//  { color: 'var(--pch)', label: 'Pachinko', value: 0, bonus: true, target: 'pch' },
//  { color: 'var(--ch)', label: 'Cash Hunt', value: 0, bonus: true, target: 'ch' },
//  { color: 'var(--cf)', label: 'Coin Flip', value: 0, bonus: true, target: 'cf' },
//];


  const [angle, setAngle] = useState<number>(0)

  const handleSpin = () => {
    if (props.spinning) {
      return
    }
    setTimeout(() => {
      props.setSpinning(false)
    }, 4000)
    props.setSpinning(true)
    const randomAngle = Math.round(Math.random() * 360 * 9) + 360;
    const newAngle = angle + randomAngle;
    const sliceAmount = slices.length
    const angleBySlice = 360 / sliceAmount
    const offset = angleBySlice / 2
    setAngle(newAngle);

    const deg = Math.abs(Math.round((newAngle + offset) % 360));

    const selectedIndex = (sliceAmount - Math.floor(deg / angleBySlice)) % sliceAmount;
    props.setSelectedSlice(slices[selectedIndex]);
  }

  return (
    <div>
      <div className={`${styles.container}`}>
        <div className={`${styles.arrow}`} />
        <div className={`${styles.middlebutton}`}
          onClick={handleSpin}
        >Spin</div>
        <div className={`${styles.wheel}`} style={{ transform: `rotate(${angle}deg)` }}>
          {slices.map((slice, index) => (
            <div
              key={index} >
              <div
                className={styles.sector}
                style={{
                  backgroundColor: `${slice.color}`,
                  zIndex: -1,
                  transform: `rotate(${index * (360 / slices.length)}deg)`,
                  clipPath: "polygon(50% 50%, -7.7% 100%, 4% 100%)",
                  borderRadius: "50%",
                  //line up text and slices
                  rotate: "133.7deg"
                }}
              >
              </div>
              <div
                className={styles.sector}
                style={{
                  transform: `rotate(${index * (360 / slices.length)}deg)`,
                  //ghetto offset
                  rotate: "-0.5deg"
                }}
              >
                <p className={slice.bonus ? styles.bonusSector : ''}>{slice.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wheel
