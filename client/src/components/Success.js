import React from 'react';
import useWindowSize from '../util/useWindowSize';
import Confetti from 'react-confetti'

const Success = () => {
   const { width, height } = useWindowSize()

   return (
      <div>
         <Confetti
            width={width}
            height={height}
            colors={['rgb(255,255,77)']}
            style={{ position: 'fixed' }}
         />
         <h2 style={{ color: 'rgb(255,255,77)', fontSize: 40 }}>All systems operational!</h2>
         <img src='/tweety.png' alt='Tweety the spaceship' style={{ width: 400, marginTop: -100 }} className='animateBounce' />
      </div>
   )
}

export default Success;
