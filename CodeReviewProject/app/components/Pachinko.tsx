/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import Matter, { Pair, IEventCollision, Composite, Engine, Runner, Render, World, Bodies, Events } from 'matter-js';
import styles from './Pachinko.module.css';
import { BonusGameProps } from '../types/BonusgameTypes';
import currency from 'currency.js';
import { useBalance } from '../contexts/balanceContext';

const Pachinko = (props: BonusGameProps) => {
  const scene = useRef<HTMLDivElement | null>(null);
  const engine = useRef(Engine.create());
  const renderRef = useRef<Render | null>(null)
  const [currentBucket, setCurrentBucket] = useState<number | null>(null)
  const balance = useBalance()
  const [multiplierChoices, setMultiplierChoices] = useState<number[]>([])

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
      const bufferList: number[] = []
      for (let i = 0; i < 16; i++) {
        const randomValue = getRandomMultiplier(multiplierList)
        bufferList.push(randomValue)
      }
      setMultiplierChoices(bufferList)
    }
    createMultipliers()
  }, [])

  useEffect(() => {
    if (currentBucket !== null) {
      //show modal and update balance after 5s
      const selectedMultiplier = multiplierChoices[currentBucket]
      const calculatedWinnings = currency(props.currentBetOnBonus).multiply(selectedMultiplier).value
      props.setWinnings(calculatedWinnings)
      console.log(selectedMultiplier)
      setTimeout(() => {
        const winningModal = document.getElementById("winningsModal") as HTMLDialogElement | null
        if (winningModal) {
          winningModal.showModal()
          const newBalance = currency(balance?.current as number)
            .add(calculatedWinnings).add(props.currentBetOnBonus).value
          balance?.updateBalance(newBalance)
        }
      }, 1000)
      setTimeout(() => {
        props.setCurrentGame('default')
      }, 5000)
    }
  }, [currentBucket])


  //create scene on first render
  useEffect(() => {
    const getRandomPosX = () => {
      return Math.floor(40 + Math.random() * 710)
    }

    const renderScene = () => {
      if (renderRef.current || !scene.current) return;
      const width = 800;
      const height = 800;
      const world = engine.current.world
      const render = Render.create({
        element: scene.current,
        engine: engine.current,
        options: {
          width: width,
          height: height,
          wireframes: false,
          background: "#cd3aa4"
        }
      });

      //prevent multiple renders by having reference to last render
      renderRef.current = render;
      Render.run(render);

      const runner = Runner.create();
      Runner.run(runner, engine.current);

      const obstacles = []
      let row = 1
      let column = 1
      let offset = 0
      for (let i = 1; i < 32 * 19; i++) {
        if (i % 32 === 0) {
          row += 1
          column = 1
        }
        if (row % 2 !== 0) {
          offset = -25
        } else {
          offset = 0
        }
        const obstacle = Bodies.circle(offset + 50 * column, 20 + 35 * row, 2, {
          isStatic: true,
          render: {
            strokeStyle: 'white',
            lineWidth: 2,
            fillStyle: 'snow'
          }
        })
        column++
        obstacles.push(obstacle)
      }

      //const balls = []
      //for (let i = 0; i < 100; i++) {
      //  const ball = Bodies.circle(getRandomPosX(), 0, 13, { restitution: 0.7 });
      //  balls.push(ball)
      //}

      const ball = Bodies.circle(getRandomPosX(), 0, 13, {
        restitution: 0.8,
        render: {
          strokeStyle: 'black',
          lineWidth: 4,
          fillStyle: 'white'
        }
      });
      ball.label = 'ball'

      const walls = [
        Bodies.rectangle(400, 800, width, 45, { isStatic: true }),
        Bodies.rectangle(800, 400, 45, height, { isStatic: true }),
        Bodies.rectangle(0, 400, 45, height, { isStatic: true })
      ]

      const totalWidth = 800;
      const bucketCount = 16;
      const borderWidth = 5;
      const bucketWidth = totalWidth / bucketCount - borderWidth / 2;

      const buckets: Matter.Body[][] = [];
      for (let i = 0; i < bucketCount; i++) {
        const xPosition = i * bucketWidth + bucketWidth / 2 + 20;
        const bucket = [
          Bodies.rectangle(xPosition - bucketWidth / 2, 760, borderWidth, 50, { isStatic: true }),
          Bodies.rectangle(xPosition + bucketWidth / 2, 760, borderWidth, 50, { isStatic: true }),
          Bodies.rectangle(xPosition, 780, bucketWidth, borderWidth, { isStatic: true })
        ];
        buckets.push(bucket);
      }

      buckets.forEach((bucket) => {
        Composite.add(world, bucket);
      })
      Composite.add(world, [ball, ...obstacles, ...walls]);


      // Add collision detection to buckets
      Events.on(engine.current, 'collisionActive', (event: IEventCollision<Engine>) => {
        //pairs are formed whenever there is a collision
        const pairs: Pair[] = event.pairs;
        pairs.forEach((pair) => {
          const { bodyA, bodyB } = pair;
          if (bodyA.label === 'ball' || bodyB.label === 'ball') {
            buckets.forEach((bucket, index) => {
              //if ball is colliding with bucket bottom setCurrentBucket
              if (!currentBucket && (bucket[2] === bodyA || bucket[2] === bodyB)) {
                setCurrentBucket(index)
              }
            });
          }
        });
      });    
      Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 800 }
      });

      return () => {
        Render.stop(render);
        World.clear(engine.current.world, false);
        Engine.clear(engine.current);
        render.canvas.remove();
        renderRef.current = null;
      };
    };
    renderScene();
  }, []);

  return (
    <div className={styles.container}>
      <div ref={scene} />
      <div className={styles.multipliers}>
        {multiplierChoices.map((multiplier, index) => (
          <div className='w-6 text-center' key={index}>{multiplier}x</div>
        ))}
      </div>
    </div>
  );
};

export default Pachinko;
