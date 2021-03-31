import React, { useState } from 'react';
import Question from '../components/Question';
import Success from '../components/Success';
import questions from '../content/questions.json';
import sha256 from 'js-sha256';
import './DatabaseDashboard.css';

const DatabaseDashboard = (props) => {
   const [ currentQuestion, setCurrentQuestion ] = useState(
      sha256(props.password) === 'a8c2299252a5b982235b1806dc09b477dd2681e94dfa3760326d73aa25d56b84'
      ? 6
      : 0
   );
   
   const setNextQuestion = (e) => {
      setCurrentQuestion(currentQuestion + 1);
      scrollTo(e.target.offsetTop, 2);
   }

   const scrollTo = (scroll, maxAmount) => {
      const difference = scroll - window.scrollY;
      if (Math.abs(difference) > 5) {
         const unclampedAmount = difference / 2;
         const amount = Math.min(unclampedAmount, maxAmount);
         window.scrollTo(0, window.scrollY + amount);
         requestAnimationFrame(() => scrollTo(scroll, maxAmount * 1.1));
      }
   }

   return (
      <div>
         {
            questions.slice(0, currentQuestion + 1).map(q => 
               <Question 
                  key={q.id}
                  template={q.template} 
                  question={q.question} 
                  id={q.id} 
                  type={q.db_type} 
                  name={props.name}
                  password={props.password}
                  setNextQuestion={setNextQuestion}
               />
            )
         }
         {
            currentQuestion >= questions.length
            ? <Success />
            : null
         }
      </div>
   )
}

export default DatabaseDashboard;
