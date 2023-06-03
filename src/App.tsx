import {
   ReactElement,
   useState,
   useEffect,
   useRef,
   KeyboardEvent,
} from 'react';

import Textarea from './components/Textarea';
import useOpenAI from './hooks/useOpenAI';
import { OpenAIProps } from './interfaces';

import './assets/scss/index.scss';

const App = (): ReactElement => {
   const [funcOne, setFuncOne] = useState<string>('');
   const [funcTwo, setFuncTwo] = useState<string>('');
   const [responseString, setResponseString] = useState<string>('');
   const [functionsNotValid, setFunctionsNotValid] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   // Focus textarea when the page loads
   const textAreaRef = useRef<HTMLTextAreaElement>(null);
   useEffect(() => textAreaRef.current?.focus(), []);

   // compareFunctions() as accessibility on {{ Command / Control + Enter }} keys press
   const handleKeyPress = (e: KeyboardEvent): void | null => {
      if (isLoading) return;
      (e.metaKey || e.ctrlKey) && e.key === 'Enter' ? compareFunctions() : null;
   };

   const compareFunctions = (): void => {
      if (isLoading) return;

      try {
         if (funcOne === '' || funcTwo === '') throw new Error();
         setFunctionsNotValid(false);

         getHelp();
      } catch (error) {
         setFunctionsNotValid(true);
         setIsLoading(false);
      }
   };

   const getHelp = useOpenAI({
      functionsInserted: { funcOne, funcTwo },
      setResponseString,
      setIsLoading,
   } as OpenAIProps);

   return (
      <>
         <h1>Algorithms Complexity Comparator</h1>
         <div className="inputs-container">
            <Textarea
               onChange={(e) => setFuncOne(e.target.value)}
               onKeyDown={handleKeyPress}
               complexity={''}
               isLoading={isLoading}
               innerRef={textAreaRef}
            />
            <Textarea
               onChange={(e) => setFuncTwo(e.target.value)}
               onKeyDown={handleKeyPress}
               complexity={''}
               isLoading={isLoading}
            />
         </div>

         {functionsNotValid && (
            <div style={{ color: 'red' }}>Insert valid functions.</div>
         )}

         <button onClick={compareFunctions}>Compare</button>

         <div>{isLoading ? 'Loading...' : responseString}</div>
      </>
   );
};

export default App;
