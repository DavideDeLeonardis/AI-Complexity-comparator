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
   const [response, setResponse] = useState<string>('');
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
      prompt: `
			Act like an experienced software engineer. Your job is to determine the time complexities of two functions and determine which one is faster. 
			Output results in a JS object having as keys the names of the functions and for values another object having the format: 'complexity: {{ complexityOfTheFunction }}', 'isFaster: {{ isFaster }}'.
			Instead of {{ complexityOfTheFunction }} write the actual string complexity of the functions inserted.
			Instead of {{ isFaster }} write a boolean determined by which function is faster, ad example if function one is faster write true.
			Remember, output ONLY the JS object.
			IF one of the function inserted is not a function output ONLY " NOT A FUNCTION " as a string.
			The functions are: ${funcOne} and ${funcTwo}
		`,
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

         <div>{isLoading ? 'Loading...' : response}</div>
      </>
   );
};

export default App;
