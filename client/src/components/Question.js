import React, { Component } from 'react';
import templateToHTML from '../util/templateToHTML';
import Table from './Table';
import './Question.css';
import Confetti from 'react-confetti';

const APIPrefix = process.env.NODE_ENV === 'production' ? 'https://tweetydb.com/api' : 'http://localhost:4000'

class Question extends Component {
   constructor (props) {
      super(props);

      this.state = {
         isOnNextQuestion: false,
         error: '',
         result: [],
         loading: false,
         showResults: false,
         showNext: false,
         numberIncorrect: 0,
         showConfetti: false
      };
   }

   componentDidMount () {
      const editable = document.getElementsByClassName('input');
      for (const element of editable) {
         element.removeEventListener("paste", this.pasteRawText);
         element.addEventListener("paste", this.pasteRawText);
      }
   }

   pasteRawText (e) {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertHTML', false, text);
   }

   onSubmit = (e) => {
      const answer = document.getElementById(`question-${this.props.id}-answer`).innerText;
      this.setState({
         loading: true
      }, () => {
         fetch(APIPrefix + '/submit', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
               query: answer, 
               type: this.props.type, id: this.props.id,
               name: this.props.name,
               password: this.props.password
            })
         }).then(res => res.json()).then((res) => {
            if (res.error) {
               this.setState({
                  error: `There was an error with your query! Check table and column names, and please reach out to a moderator if you're stuck!`,
                  result: [],
                  loading: false,
                  showResults: true,
                  numberIncorrect: this.state.numberIncorrect + 1
               });
            } else if (!res.correct) {
               this.setState({
                  error: `Your query ran, but the results weren't quite correct. Double check your logic, and please reach out to a moderator if you're stuck!`,
                  result: JSON.parse(res.result),
                  loading: false,
                  showResults: true,
                  numberIncorrect: this.state.numberIncorrect + 1
               });
            } else {
               this.setState({
                  error: '',
                  result: JSON.parse(res.result),
                  loading: false,
                  showResults: true,
                  showNext: true,
                  showConfetti: true
               }, () => {
                  setTimeout(() => {
                     this.setState({ showConfetti: false });
                  }, 10000)
               });
            }
         });
      });
   }

   nextQuestion = (e) => {
      if (!this.state.isOnNextQuestion) {
         this.props.setNextQuestion(e);
         this.setState({
            isOnNextQuestion: true,
         });
      }
   }

   render = () => (
      <div className='question'>
         <p dangerouslySetInnerHTML={{ __html: this.props.question }} />
         <br />
         <div className='queryInput'>
            <p className='databaseType'>&gt; {this.props.type}</p>
            <div 
               id={`question-${this.props.id}-answer`} 
               dangerouslySetInnerHTML={{ __html: templateToHTML(this.props.template, this.props.id) }} 
            />
         </div>
         <p className='error'>{ this.state.error }</p>
         {
            this.state.result && Array.isArray(this.state.result) && this.state.result.length > 0
            ? <Table rows={this.state.result} title='Query Results' />
            : this.state.showResults 
            ? <p>no results to display</p>
            : this.state.loading
            ? <p>loading...</p>
            : <br />
         }
         {
            this.state.showNext
            ? <button onClick={this.nextQuestion} className='yellow'>Next</button>
            : <button onClick={this.onSubmit}>Submit</button>
         }
         {
            this.state.numberIncorrect > 3 && !this.state.showNext
            ? <button onClick={this.nextQuestion} className='red'>Skip</button>
            : null
         }
         {
            this.state.showConfetti
            ? <Confetti
               width={window.innerWidth}
               height={window.innerHeight}
               colors={['rgb(255,255,77)']}
               style={{ position: 'fixed' }}
               recycle={false}
            />
            : null
         }
      </div>
   )
}

export default Question;
