/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from 'react';
import styles from './Jackpot.module.css'
import { BonusGameProps } from '../types/BonusgameTypes';
import { SliceWithoutTarget, startingSlices } from '../data/jackpotSlices';
import currency from 'currency.js';
import { useBalance } from '../contexts/balanceContext';

const Jackpot = (props: BonusGameProps) => {

  const balance = useBalance()
  const [spinning, setSpinning] = useState<boolean>(false)
  const [spinnable, setSpinnable] = useState<boolean>(true)
  const [selectedSlice, setSelectedSlice] = useState<SliceWithoutTarget | null>(null);
  const [showLabel, setShowLabel] = useState<boolean>(true)
  const [slices, setSlices] = useState<SliceWithoutTarget[]>(startingSlices);

  useEffect(() => {
    if (!spinning && selectedSlice) {
      const handleDouble = () => {
        const newSlices = slices.map((slice) => {
          const newValue = slice.value * 2;
          return {
            ...slice,
            value: newValue,
            label: slice.label === 'Double' ? 'Double' : newValue.toString(),
          };
        });
        setTimeout(() => {
          setShowLabel(false)
        }, 1000);
        setTimeout(() => {
          setSlices(newSlices);
          setShowLabel(true)
        }, 1500);
      }
      console.log(selectedSlice)
      if (selectedSlice.double) {
        handleDouble()
        setSpinnable(true)
      }
      else {
        const calculatedWinnings = currency(selectedSlice?.value).multiply(props.currentBetOnBonus).value
        props.setWinnings(calculatedWinnings)
        setTimeout(() => {
          const winningModal = document.getElementById("winningsModal") as HTMLDialogElement | null
          if (winningModal) {
            winningModal.showModal()
            const newBalance = currency(balance?.current as number)
              .add(calculatedWinnings).add(props.currentBetOnBonus).value
            balance?.updateBalance(newBalance)
          }
        }, 4000)
        setTimeout(() => {
          props.setCurrentGame('default')
        }, 6000)
      }
    }
  }, [spinning])



  const [angle, setAngle] = useState<number>(0)

  const handleSpin = () => {
    if (spinning || !spinnable) {
      return
    }
    setTimeout(() => {
      setSpinning(false)
    }, 2000)
    setSpinning(true)
    const randomAngle = Math.round(Math.random() * 360 * 9) + 360;
    const newAngle = angle + randomAngle;
    const sliceAmount = slices.length
    const angleBySlice = 360 / sliceAmount
    const offset = angleBySlice / 2
    setAngle(newAngle);

    const deg = Math.abs(Math.round((newAngle + offset) % 360));

    const selectedIndex = (sliceAmount - Math.floor(deg / angleBySlice)) % sliceAmount;
    setSelectedSlice(slices[selectedIndex]);
    setSpinnable(false)
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
                  backgroundColor: slice.color,
                  zIndex: -1,
                  transform: `rotate(${index * (360 / slices.length)}deg)`,
                  clipPath: "polygon(50% 50%, -14.5% 100%, 10.5% 100%)",
                  borderRadius: "50%",
                  //align slices with selector arrow
                  rotate: "134.3deg"
                }}
              >
              </div>
              <div
                className={styles.sector}
                style={{
                  transform: `rotate(${index * (360 / slices.length)}deg)`,
                  //text alignment
                  rotate: "-90.5deg"
                }}
              >
                <p
                  className={styles.label}
                  style={{
                    transform: `${showLabel ? 'translateY(48%)' : 'translateY(-48%)'}
`                    }}
                >{slice.label == 'Double' ? slice.label : `${slice.label}x`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Jackpot
