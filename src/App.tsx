import { ReactElement, useState } from 'react';

import Textarea from './components/textarea';

import { textareaChangeEvent } from './types';

import './assets/scss/index.scss';

const App = (): ReactElement => {
   const [functionsNotValid, setFunctionsNotValid] = useState<boolean>(false);
   const [funcOne, setFuncOne] = useState<string>('');
   const [funcTwo, setFuncTwo] = useState<string>('');

   const compareFunctions = (): void => {
      try {
         // if ('exeption case') throw new Error();
         console.log(funcOne);
         console.log(funcTwo);
      } catch (error) {
         setFunctionsNotValid(true);
      }
   };

   const setTextareaValueONE = (e: textareaChangeEvent): void =>
      setFuncOne(e.target.value);

   const setTextareaValueTWO = (e: textareaChangeEvent): void =>
      setFuncTwo(e.target.value);

   return (
      <>
         <h1>Complexity Comparator</h1>
         <div className="inputs-container">
            <Textarea onTextareaChangeValue={setTextareaValueONE} />
            <Textarea onTextareaChangeValue={setTextareaValueTWO} />
         </div>

         <button onClick={compareFunctions}>Compare</button>
			
         {functionsNotValid && (
            <div style={{ color: 'red' }}>Insert valid functions.</div>
         )}
      </>
   );
};

export default App;
