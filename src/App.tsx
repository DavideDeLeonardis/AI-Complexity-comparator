import { ReactElement, useState, ChangeEvent, KeyboardEvent } from 'react';

import Textarea from './components/textarea';

import './assets/scss/index.scss';

const App = (): ReactElement => {
   const [functionsNotValid, setFunctionsNotValid] = useState<boolean>(false);
   const [funcOne, setFuncOne] = useState<string>('');
   const [funcTwo, setFuncTwo] = useState<string>('');

   const compareFunctions = (): void => {
      const functionsAreInvalid = funcOne === '' || funcTwo === '';

      try {
         if (functionsAreInvalid) throw new Error();
         setFunctionsNotValid(false);

         console.log(funcOne);
         console.log(funcTwo);
      } catch (error) {
         setFunctionsNotValid(true);
      }
   };

   const handleFuncOneChange = (e: ChangeEvent<HTMLTextAreaElement>): void =>
      setFuncOne(e.target.value);

   const handleFuncTwoChange = (e: ChangeEvent<HTMLTextAreaElement>): void =>
      setFuncTwo(e.target.value);

   const handleKeyPress = (e: KeyboardEvent): void | null =>
      (e.metaKey || e.ctrlKey) && e.key === 'Enter' ? compareFunctions() : null;

   return (
      <>
         <h1>Complexity Comparator</h1>
         <div className="inputs-container">
            <Textarea
               onChange={handleFuncOneChange}
               onKeyDown={handleKeyPress}
            />
            <Textarea
               onChange={handleFuncTwoChange}
               onKeyDown={handleKeyPress}
            />
         </div>

         {functionsNotValid && (
            <div style={{ color: 'red' }}>Insert valid functions.</div>
         )}

         <button onClick={compareFunctions}>Compare</button>
      </>
   );
};

export default App;
