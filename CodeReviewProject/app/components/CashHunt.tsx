/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useState } from 'react'
import { BonusGameProps } from '../types/BonusgameTypes'
import styles from './CashHunt.module.css'
import { useBalance } from '../contexts/balanceContext'
import currency from 'currency.js';

interface multiplierItem {
  value: number,
  flipped: boolean
}

const CashHunt = (props: BonusGameProps) => {
  const balance = useBalance()
  const [multiplierChoices, setMultiplierChoices] = useState<multiplierItem[]>([])
  const [defaultRotation, setDefaultRotation] = useState<number>(0)
  const [chosen, setChosen] = useState<number | null>(null)

  useEffect(() => {

    //multiplier randomizer
    const multiplierList: number[] = [5, 7, 10, 15, 20, 25, 30, 35, 50, 75, 100]
    const weights: number[] = [40, 30, 20, 10, 5, 3, 2, 1, 0.6, 0.5, 0.4, 0.3, 0.2]
    const getRandomMultiplier = (multiplierList: number[]): number => {
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
      let random = Math.random() * totalWeight
      for (let i = 0; i < multiplierList.length; i++) {
        if (random < weights[i]) {
          return multiplierList[i]
        }
        random -= weights[i]
      }
      return multiplierList[0]
    }

    //multiplier generator
    const createMultipliers = () => {
      const bufferList: multiplierItem[] = []
      for (let i = 0; i < 25; i++) {
        const randomValue = getRandomMultiplier(multiplierList)
        bufferList.push({ value: randomValue, flipped: false })
      }
      setMultiplierChoices(bufferList)
    }
    createMultipliers()
  }, [])

  useEffect(() => {
    if (chosen) {
      //show modal and update balance after 5s
      setTimeout(() => {
      const winningModal = document.getElementById("winningsModal") as HTMLDialogElement | null
      if (winningModal) {
        winningModal.showModal()
        const newBalance = currency(balance?.current as number)
            .add(props.winnings).add(props.currentBetOnBonus).value
        balance?.updateBalance(newBalance)
      }
      },5000)
      setTimeout(() => {
        props.setCurrentGame('default')
      }, 7000)
    }

  }, [chosen])

  const handleChoice = (selectedMultiplier: multiplierItem) => {
    if (!chosen) {

      //update multipliers with selected multiplier flipped
      setMultiplierChoices(prevChoices =>
        prevChoices.map(multiplier =>
          multiplier === selectedMultiplier
            ? { ...multiplier, flipped: !multiplier.flipped }
            : multiplier))
      const calculatedWinnings = currency(selectedMultiplier.value).multiply(props.currentBetOnBonus).value
      props.setWinnings(calculatedWinnings)

      setTimeout(() => {
        setDefaultRotation(180)
      }, 1500)
      setChosen(selectedMultiplier.value)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.multipliers}>
        {multiplierChoices.map((multiplier, index) => (
          <div key={index}
            onClick={() => handleChoice(multiplier)}
            className={`${styles.multiplierItem}`}
            style={{
              transform: multiplier.flipped ? 'rotateY(180deg)' : `rotateY(${defaultRotation}deg)`,
            }}
          >
            <div className={styles.multiplierBack}
              style={{
                background: multiplier.flipped ? 'gray' : ''
              }}
            >
              {multiplier.value}x
            </div>
            <div className={styles.multiplierFront}>?</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CashHunt
