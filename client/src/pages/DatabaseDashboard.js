import React, { useState } from 'react';
import Question from '../components/Question';
import questions from '../content/questions.json';

const DatabaseDashboard = (props) => {
   const [ currentQuestion, setCurrentQuestion ] = useState(0);
   
   const setNextQuestion = (e) => {
      setCurrentQuestion(currentQuestion + 1);
      console.log(e.target);
      scrollTo(e.target.offsetTop, 2);
   }

   const scrollTo = (scroll, maxAmount) => {
      const difference = scroll - window.scrollY;
      console.log(difference);
      if (Math.abs(difference) > 5) {
         const unclampedAmount = difference / 2;
         const amount = Math.min(unclampedAmount, maxAmount);
         console.log(amount);
         window.scrollTo(0, window.scrollY + amount);
         requestAnimationFrame(() => scrollTo(scroll, maxAmount * 1.1));
      }
   }

   return (
      <div>
         {
            questions.slice(0, currentQuestion + 1).map(q => 
               <Question 
                  template={q.template} 
                  question={q.question} 
                  id={q.id} 
                  type={q.db_type} 
                  setNextQuestion={setNextQuestion}
               />
            )
         }
      </div>
   )
}

export default DatabaseDashboard;
