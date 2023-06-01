import {
   ReactElement,
   useState,
   useEffect,
   useRef,
   KeyboardEvent,
} from 'react';

import Textarea from './components/Textarea';
import useOpenAI from './hooks/useOpenAI';
import { OpenAIProps } from './types';

import './assets/scss/index.scss';

const App = (): ReactElement => {
	const [funcOne, setFuncOne] = useState<string>('');
   const [funcTwo, setFuncTwo] = useState<string>('');
   const [functionsNotValid, setFunctionsNotValid] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [response, setResponse] = useState<string>('');

   // Focus textarea when the page loads
   const textAreaRef = useRef<HTMLTextAreaElement>(null);
   useEffect(() => textAreaRef.current?.focus(), []);

   // Accessibility on {{ Command / Control + Enter }} keys press
   const handleKeyPress = (e: KeyboardEvent): null | void =>
      (e.metaKey || e.ctrlKey) && e.key === 'Enter'
         ? handleCompareFunctions()
         : null;

   const handleCompareFunctions = (): void => {
      const functionsAreInvalid = funcOne === '' || funcTwo === '';

      try {
         if (functionsAreInvalid) throw new Error();
         setFunctionsNotValid(false);

         compareFunctions();
      } catch (error) {
         setFunctionsNotValid(true);
      }
   };

   const compareFunctions = useOpenAI({
      funcOne,
      funcTwo,
      setResponse,
      setIsLoading,
   } as OpenAIProps);

   return (
      <>
         <h1>Algorithms Complexity Comparator</h1>
         <div className="inputs-container">
            <Textarea
               onChange={(e) => setFuncOne(e.target.value)}
               onKeyDown={handleKeyPress}
               innerRef={textAreaRef}
            />
            <Textarea
               onChange={(e) => setFuncTwo(e.target.value)}
               onKeyDown={handleKeyPress}
            />
         </div>

         {functionsNotValid && (
            <div style={{ color: 'red' }}>Insert valid functions.</div>
         )}

         <button onClick={handleCompareFunctions}>Compare</button>

         <div>{isLoading && 'Loading...'}</div>

         <div>{response}</div>
      </>
   );
};

export default App;
