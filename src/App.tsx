import { ReactElement, useState } from 'react';

import Input from './components/Input';

import './assets/scss/index.scss';

const App = (): ReactElement => {
   const [functionsNotValid, setFunctionsNotValid] = useState<boolean>(false);

   const compareFunctions = (): void => {
      try {
         // if ('exeption case') throw new Error();

         console.log('Compared');
      } catch (error) {
         setFunctionsNotValid(true);
      }
   };

   return (
      <>
         <h1>Complexity Comparator</h1>
         <div>
            <Input />
            <Input />
            <button onClick={compareFunctions}>Compare</button>
            {functionsNotValid && (
               <div style={{ color: 'red' }}>Insert valid functions</div>
            )}
         </div>
      </>
   );
};

export default App;
