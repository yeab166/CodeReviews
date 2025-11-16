'use client';
import Wheel from '@/app/components/Wheel'
import React, { useEffect, useState } from 'react'
import styles from './page.module.css'
import currency from 'currency.js';
import PokerChipSVG from '@/public/pokerchip.svg'
import WinningsModal from '../components/WinningsModal';
import CoinFlip from '../components/CoinFlip';
import { useBalance } from '../contexts/balanceContext';
import CashHunt from '../components/CashHunt';
import Pachinko from '../components/Pachinko';
import Jackpot from '../components/Jackpot';

export type CurrentGame = 'normal' | 'Coin Flip' | 'Pachinko' | 'Cash Hunt' | 'Jackpot'

export type Bets = {
  [key: string]: number
}
export type BetChoices = 0.1 | 0.2 | 0.5 | 1 | 2
export interface Slice {
  color: string;
  label: string;
  value: number;
  bonus: boolean;
  target: keyof Bets;
}

interface NumberGames {
  one: 1,
  two: 2,
  five: 5,
  ten: 10,
}

type Game = {
  game: number | string
}

interface BonusGames {
  cf: 'Coin Flip',
  pch: 'Pachinko',
  ch: 'Cash Hunt',
  jp: 'Jackpot',
}

const WheelOfFortune = () => {
  const balance = useBalance()
  //format placed bets
  const startingBets: Bets = { one: 0, two: 0, five: 0, ten: 0, ct: 0, ch: 0, pch: 0, cf: 0 }
  const betOptions: BetChoices[] = [0.1, 0.2, 0.5, 1, 2]

  const [totalBets, setTotalBets] = useState<Bets>(startingBets)
  const [spinning, setSpinning] = useState<boolean>(false)
  const [selectedBet, setSelectedBet] = useState<BetChoices>(0.1)
  const [selectedSlice, setSelectedSlice] = useState<Slice | null>(null);
  const [winnings, setWinnings] = useState<number>(0);
  const [currentGame, setCurrentGame] = useState<CurrentGame | string>('default')
  const [currentBetOnBonus, setCurrentBetOnBonus] = useState<number>(0)

  useEffect(() => {
    if (!spinning && selectedSlice) {
      const currentBetOnChoice = totalBets[selectedSlice?.target]
      const calculatedWinnings = currency(selectedSlice?.value).multiply(currentBetOnChoice).value

      //if bonusgame, show bonusgame and hide normal wheel
      if (selectedSlice.bonus && currentBetOnChoice) {
        setCurrentBetOnBonus(currentBetOnChoice)
        setCurrentGame(selectedSlice.label)
      }

      //show winnings modal if won
      if (calculatedWinnings > 0 && !selectedSlice.bonus) {
        setWinnings(calculatedWinnings)
        balance?.updateBalance(currency(balance.current).add(calculatedWinnings).add(currentBetOnChoice).value)
        const winningModal = document.getElementById("winningsModal") as HTMLDialogElement | null
        if (winningModal) {
          winningModal.showModal()
        }
      }

      //reset Bets
      const resetBets = startingBets
      setTotalBets(resetBets)
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning])

  const handleBet = (betAmount: number, multiplier: keyof Bets, multiple=false) => {
    if (!spinning && currentGame == 'default') {
      if (!multiple) {
        const newBalance = currency(balance?.current as number).subtract(betAmount).value
        if (newBalance < 0) {
          return
        }
        balance?.updateBalance(newBalance)
      }
      setTotalBets(prevBets => ({
        ...prevBets, [multiplier]: currency(prevBets[multiplier]).add(betAmount).value
      }))
    }
  }

  const handleMultipleBet = (betAmount: number, gameType: 'numbers' | 'bonus') => {
    if (!spinning && currentGame == 'default') {
      const numberGames: NumberGames = {
        one: 1,
        two: 2,
        five: 5,
        ten: 10,
      }
      const bonusGames: BonusGames = {
        cf: 'Coin Flip',
        pch: 'Pachinko',
        ch: 'Cash Hunt',
        jp: 'Jackpot',
      };

      const chosenGame = gameType == 'numbers' ? numberGames : bonusGames

      Object.entries(chosenGame).forEach((game) => {
        const newBalance = currency(balance?.current as number).subtract(betAmount*4).value
        if (newBalance < 0) {
          return
        }
        balance?.updateBalance(newBalance)
        handleBet(betAmount, game[0], true)
      });

    }
  }

  //control sector bet multipliers/bonus
  const sectors = {
    one: 1,
    two: 2,
    cf: 'Coin Flip',
    pch: 'Pachinko',
    five: 5,
    ten: 10,
    ch: 'Cash Hunt',
    jp: 'Jackpot',
  };


  const sectorColors = {
    one: 'bg-one',
    two: 'bg-two',
    cf: 'bg-cf',
    pch: 'bg-pch',
    five: 'bg-five',
    ten: 'bg-ten',
    ch: 'bg-ch',
    jp: 'bg-jp',
  };

  const pokerChipColors = {
    0.1: 'fill-0.1',
    0.2: 'fill-0.2',
    0.5: 'fill-0.5',
    1: 'fill-1',
    2: 'fill-2',
  };

  const renderGameComponent = () => {
    switch (currentGame) {
      case 'Coin Flip':
        return <CoinFlip setCurrentGame={setCurrentGame} winnings={winnings} setWinnings={setWinnings} currentBetOnBonus={currentBetOnBonus} />
      case 'Pachinko':
        return <Pachinko setCurrentGame={setCurrentGame} winnings={winnings} setWinnings={setWinnings} currentBetOnBonus={currentBetOnBonus} />
      case 'Cash Hunt':
        return <CashHunt setCurrentGame={setCurrentGame} winnings={winnings} setWinnings={setWinnings} currentBetOnBonus={currentBetOnBonus} />
      case 'Jackpot':
        return <Jackpot setCurrentGame={setCurrentGame} winnings={winnings} setWinnings={setWinnings} currentBetOnBonus={currentBetOnBonus} />
      default:
        return <Wheel
          spinning={spinning} setSpinning={setSpinning}
          setSelectedSlice={setSelectedSlice}
        />
    }
  }

  return (
    <div>
      <WinningsModal winnings={winnings} />
      {renderGameComponent()}
      <div className='flex justify-center mt-6 font-mono'>Balance: {`${balance?.current}`}</div>
      <div className={`${styles.playSelectorContainer}`}>
        <div className={`${styles.playSelector}`}>
          {Object.entries(sectors).map((sector, index) => (
            <div
              key={index}
              onClick={() => handleBet(selectedBet, sector[0])}
              className={`${styles.betItem} ${sectorColors[sector[0] as keyof typeof sectorColors]}`}
            >
              <p>{sector[1]}</p>
              {totalBets[sector[0]] > 0 && (
                <div className='text-lg'>{`${totalBets[sector[0]]}€`}</div>
              )}
            </div>
          ))}
          <div className={styles.playMultiple}>
            <div onClick={() => handleMultipleBet(selectedBet, 'numbers')} className={styles.playNumbers}></div>
            <div onClick={() => handleMultipleBet(selectedBet, 'bonus')} className={styles.playBonus}></div>
          </div>
        </div>
      </div>

      <div className={`${styles.betOptionContainer} flex gap-4 mt-6 justify-center` }>
        {(betOptions).map((betValue, index) => (
          <div key={index}
            className={`
              ${styles.betOption} 
              ${pokerChipColors[betValue]} 
              ${selectedBet === betValue ? 'opacity-100' : 'opacity-50'}
            `}
            onClick={() => setSelectedBet(betValue)}
          >
            <p className='font-bold text-xl'>{betValue}</p>
            <PokerChipSVG className={`${styles.pokerchipSvg} `} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WheelOfFortune

