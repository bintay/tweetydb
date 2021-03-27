import React from 'react';
import './Table.css';

const Table = (props) => {
   if (props.rows.length === 0) return (<div />);
   const columns = Object.keys(props.rows[0]);

   return (
      <div className={`${props.noMaxHeight ? 'table' : 'scrollTable'}`} style={props.style}>
         <h2>{props.title}</h2>
         <table>
            <tbody>
               <tr>
                  {columns.map(column => (<th key={column}>{column}</th>))}
               </tr>
               {props.rows.map((row, index) => (
                  <tr key={index} style={{ borderLeft: row.correct ? '1px solid green' : (row.correct === false ? '1px solid red' : '') }}>
                     {columns.map(column => (<td key={column}><div className='cell-content'>{JSON.stringify(row[column])}</div></td>))}
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};

export default Table;
