import React, { useEffect, useState } from 'react';
import styles from './CoinFlip.module.scss';
import { useBalance } from '../contexts/balanceContext';
import currency from 'currency.js';
import { BonusGameProps } from '../types/BonusgameTypes';

const Coin = (props: BonusGameProps) => {
  const balance = useBalance()
  const [spin, setSpin] = useState<number>(0)
  const [flipping, setFlipping] = useState<boolean>(false)

  //localwinnings to trigger useEffect based on winnings state
  const [localWinnings, setLocalwinnings] = useState<number>(0)
  const [selectedMultipliers, setSelectedMultipliers] = useState<number[]>([])
  const multipliers = [3, 5, 7, 10, 15, 20, 25, 50, 100]
  const weights = [40, 30, 20, 10, 5, 3, 2, 1, 0.5]

  useEffect(() => {
    const multiplierOne = getRandomMultiplier(multipliers)
    let multiplierTwo = getRandomMultiplier(multipliers)

    while (multiplierTwo === multiplierOne) {
      multiplierTwo = getRandomMultiplier(multipliers);
    }
    if (multiplierOne && multiplierTwo) {
      setSelectedMultipliers([multiplierOne, multiplierTwo])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!flipping && localWinnings > 0) {
      balance?.updateBalance(
        currency(balance.current)
          .add(props.currentBetOnBonus)
          .add(props.winnings).value
      )
      const winningModal = document.getElementById("winningsModal") as HTMLDialogElement | null
      if (winningModal) {
        winningModal.showModal()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipping])

  const getRandomMultiplier = (multiplierList: number[]) => {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
    let random = Math.random() * totalWeight
    for (let i = 0; i < multiplierList.length; i++) {
      if (random < weights[i]) {
        return multipliers[i]
      }
      random -= weights[i]
    }
  }

  const handleSpin = () => {
    if (!flipping) {
      setFlipping(true)
      const spinVariations = [spin + 5 * 360, spin + 11 * 180]
      const random = Math.floor(Math.random() * spinVariations.length)
      const result = spinVariations[random]
      setSpin(result)
      if (result % 360 == 0) {
        const calculatedWinnings = currency(selectedMultipliers[0]).multiply(props.currentBetOnBonus).value
        console.log(calculatedWinnings)
        props.setWinnings(calculatedWinnings)
        setLocalwinnings(calculatedWinnings)

      } else {
        const calculatedWinnings = currency(selectedMultipliers[1]).multiply(props.currentBetOnBonus).value
        console.log(calculatedWinnings)
        props.setWinnings(calculatedWinnings)
        setLocalwinnings(calculatedWinnings)
      }
      setTimeout(() => {
        setFlipping(false)
      }, 5000)
      setTimeout(() => {
        props.setCurrentGame('default');
      }, 7000)
    }
  }

  return (
    <div
      onClick={handleSpin}
      className={`${styles.coin}`}
      style={{
        transform: `rotateX(30deg) rotateY(${spin}deg) rotateZ(0deg)`
      }}
    >
      <div className={`${styles.face} ${styles.front}`}>
        <div className={`${styles.symbol}`}>{selectedMultipliers[0]}x</div>
        <div className={`${styles.circle}`}></div>
      </div>
      <div className={`${styles.face} ${styles.back}`}>
        <div className={`${styles.symbol}`}>{selectedMultipliers[1]}x</div>
        <div className={`${styles.circle}`}></div>
      </div>
      {Array.from({ length: 30 }).map((_, index) => (
        <figure key={index} className={`${styles.side}`}></figure>
      ))}
    </div>
  )
};

const CoinFlip = (props: BonusGameProps) => (
  <div className={styles.wrapper}>
    <div className={styles.container}>
      <Coin
        setCurrentGame={props.setCurrentGame}
        winnings={props.winnings}
        setWinnings={props.setWinnings}
        currentBetOnBonus={props.currentBetOnBonus}
      />
    </div>
  </div>
);

export default CoinFlip;
