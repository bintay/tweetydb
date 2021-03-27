import React, { Component } from 'react';
import templateToHTML from '../util/templateToHTML';
import Table from './Table';
import './Question.css';

const APIPrefix = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000'

class Question extends Component {
   constructor (props) {
      super(props);

      this.state = {
         isOnNextQuestion: false,
         error: '',
         result: [],
         loading: false,
         showResults: false
      };
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
            body: JSON.stringify({ query: answer, type: this.props.type, id: this.props.id })
         }).then(res => res.json()).then((res) => {
            if (res.error) {
               this.setState({
                  error: `There was an error with your query! Check table and column names, and please reach out to a moderator if you're stuck!`,
                  result: [],
                  loading: false,
                  showResults: true
               });
            } else if (!res.correct) {
               this.setState({
                  error: `Your query ran, but the results weren't quite correct. Double check your logic, and please reach out to a moderator if you're stuck!`,
                  result: JSON.parse(res.result),
                  loading: false,
                  showResults: true
               });
            } else {
               this.setState({
                  error: '',
                  result: JSON.parse(res.result),
                  loading: false,
                  showResults: true
               });

               if (!this.state.isOnNextQuestion) {
                  this.props.setNextQuestion(e);
                  this.setState({
                     isOnNextQuestion: true,
                  });
               }
            }
         });
      });
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
         <button onClick={this.onSubmit}>Submit</button>
      </div>
   )
}

export default Question;
