import React from 'react';
import './Table.css';

const Table = (props) => {
   if (props.length === 0) return (<div />);
   const columns = Object.keys(props.rows[0]);

   return (
      <div className='scrollTable'>
         <h2>{props.title}</h2>
         <table>
            <tbody>
               <tr>
                  {columns.map(column => (<th key={column}>{column}</th>))}
               </tr>
               {props.rows.map((row, index) => (
                  <tr key={index}>
                     {columns.map(column => (<td key={column}>{row[column]}</td>))}
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};

export default Table;
