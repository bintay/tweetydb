import React, { Component } from 'react';
import templateToHTML from '../util/templateToHTML';
import './Question.css';

class Question extends Component {
   constructor (props) {
      super(props);

      this.state = {
         pressedNext: false
      };
   }

   onSubmit = (e) => {
      if (!this.state.pressedNext) {
         this.props.setNextQuestion(e);
         this.setState({
            pressedNext: true
         });
      }
   }

   render = () => (
      <div className='question'>
         <p dangerouslySetInnerHTML={{ __html: this.props.question }} />
         <br />
         <div className='queryInput'>
            <p className='databaseType'>&gt; {this.props.type}</p>
            <div dangerouslySetInnerHTML={{ __html: templateToHTML(this.props.template, this.props.id) }} />
         </div>
         <br />
         <button onClick={this.onSubmit}>Submit</button>
      </div>
   )
}

export default Question;
