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

   const [complexityFuncOne, setComplexityFuncOne] = useState<string>('');
   const [, setFuncOneIsLoading] = useState<boolean>(false);

   const [complexityFuncTwo, setComplexityFuncTwo] = useState<string>('');
   const [, setFuncTwoIsLoading] = useState<boolean>(false);

   const [whosFaster, setWhosFaster] = useState<string>('');
   const [, setWhoFasterIsLoading] = useState<boolean>(false);

   const [isLoading, setAllIsLoading] = useState<boolean>(false);

   // Focus textarea when the page loads
   const textAreaRef = useRef<HTMLTextAreaElement>(null);
   useEffect(() => textAreaRef.current?.focus(), []);

   // compareFunctions() as accessibility on {{ Command / Control + Enter }} keys press
   const handleKeyPress = (
      e: KeyboardEvent
   ): Promise<void> | null | undefined => {
      if (isLoading) return;
      (e.metaKey || e.ctrlKey) && e.key === 'Enter' ? compareFunctions() : null;
   };

   const getPrompt = (func: string) => `
		Act like an experienced and concise software engineer. Your job is to determine the time complexity of a function. 
		Output only the time complexity of the function in this format: " {{ complexityOfTheFunction }} ".
		Instead of {{ complexityOfTheFunction }} write the actual complexity of the functions inserted.
		IF is not a function output ONLY " NOT A FUNCTION ".
		Remember, output ONLY what's in the double quotes of the format.
		The function is: ${func}		
	`;

   const { getHelp: handleComplexityFuncOne } = useOpenAI({
      prompt: getPrompt(funcOne),
      setResponse: setComplexityFuncOne,
      setIsLoadingCallback: setFuncOneIsLoading,
   } as OpenAIProps);

   const { getHelp: handleComplexityFuncTwo } = useOpenAI({
      prompt: getPrompt(funcTwo),
      setResponse: setComplexityFuncTwo,
      setIsLoadingCallback: setFuncTwoIsLoading,
   } as OpenAIProps);

   const { getHelp: handleWhosFaster } = useOpenAI({
      prompt: `
			Act like a software engineer. Your job is to compare the time complexity of two functions. 
			Output, depending on which function is faster, ONLY in this format:
			" Function {{ nameOfTheFunction }} is faster ".
			Instead of {{ nameOfTheFunction }} write actual name of the function inserted.
			IF is not a function output ONLY " NOT A FUNCTION ".
			Remember, output ONLY what's the double quotes of the format.
			The two functions are ${funcOne} and ${funcTwo}
		`,
      setResponse: setWhosFaster,
      setIsLoadingCallback: setWhoFasterIsLoading,
   } as OpenAIProps);

   const compareFunctions = async () => {
      if (isLoading) return;

      try {
         if (funcOne === '' || funcTwo === '') throw new Error();
         setFunctionsNotValid(false);

         setAllIsLoading(true);

         await Promise.all([
            handleComplexityFuncOne(),
            handleComplexityFuncTwo(),
            handleWhosFaster(),
         ]);

         setAllIsLoading(false);
      } catch (error) {
         setFunctionsNotValid(true);
         setAllIsLoading(false);
      }
   };

   return (
      <>
         <h1>Algorithms Complexity Comparator</h1>
         <div className="inputs-container">
            <Textarea
               onChange={(e) => setFuncOne(e.target.value)}
               onKeyDown={handleKeyPress}
               complexity={complexityFuncOne.replace(/^"(.*)"$/, '$1')}
               isLoading={isLoading}
               innerRef={textAreaRef}
            />
            <Textarea
               onChange={(e) => setFuncTwo(e.target.value)}
               onKeyDown={handleKeyPress}
               complexity={complexityFuncTwo.replace(/^"(.*)"$/, '$1')}
               isLoading={isLoading}
            />
         </div>

         {functionsNotValid && (
            <div style={{ color: 'red' }}>Insert valid functions.</div>
         )}

         <button onClick={compareFunctions}>Compare</button>

         <div>{isLoading ? 'Loading...' : whosFaster}</div>
      </>
   );
};

export default App;
