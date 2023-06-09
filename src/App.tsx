import {
   ReactElement,
   useState,
   useEffect,
   useRef,
   KeyboardEvent,
} from 'react';

import Textarea from './components/Textarea';
import Select from './components/Select';
import useOpenAI from './hooks/useOpenAI';
import { isFunction, convertResponseInArray } from './utils';
import { OpenAIProps } from './interfaces';

import './assets/scss/index.scss';

type FunctionInserted = {
   isFunction: boolean;
   name: string;
   complexity: string;
   isFaster: boolean;
};

type FinalResponse = FunctionInserted[] | string | null;

const App = (): ReactElement => {
   const [language, setLanguage] = useState<string>('');
   const [funcOne, setFuncOne] = useState<string>('');
   const [funcTwo, setFuncTwo] = useState<string>('');
   const [rawResponse, setRawResponse] = useState<string | null>(null);
   const [finalResponse, setFinalResponse] = useState<FinalResponse>(null);
   const [inputsAreEmpty, setInputsAreEmpty] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   // Focus textarea when the page loads
   const textAreaRef = useRef<HTMLTextAreaElement>(null);
   useEffect(() => textAreaRef.current?.focus(), []);

   // compareFunctions() on pressing {{ Command / Control + Enter }} keys
   const handleKeyPress = (e: KeyboardEvent): void => {
      if (isLoading) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') compareFunctions();
   };

   // Set initial state response
   const compareFunctions = async (): Promise<void> => {
      if (isLoading) return;

      try {
         const textareaNotContainsFunctions: boolean =
            !isFunction(funcOne) || !isFunction(funcTwo);
         const textareaAreEmpty: boolean =
            funcOne.trim() === '' || funcTwo.trim() === '';

         if (textareaAreEmpty || textareaNotContainsFunctions)
            throw new Error();
         setInputsAreEmpty(false);

         await getHelp();
      } catch {
         setIsLoading(false);
         setInputsAreEmpty(true);
      }
   };

   const getHelp = useOpenAI({
      functionsInserted: { funcOne, funcTwo },
      setRawResponse,
      setIsLoading,
      language,
   } as OpenAIProps);

   // Convert initial response in array and set new state
   useEffect(() => {
      if (rawResponse) {
         try {
            const convertedResponse: FinalResponse =
               convertResponseInArray<FinalResponse>(rawResponse!);

            if (Array.isArray(convertedResponse))
               setFinalResponse(convertedResponse);
            else setFinalResponse('SOMETHING WENT WRONG');
         } catch {
            setFinalResponse('SOMETHING WENT WRONG');
         }
      }
   }, [rawResponse]);

   return (
      <>
         <h1>Algorithms Complexity Comparator</h1>
         <Select onChange={(e) => setLanguage(e.target.value)} />
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

         {(inputsAreEmpty || typeof finalResponse === 'string') && (
            <div style={{ color: 'red' }}>Insert 2 valid functions.</div>
         )}

         <button onClick={compareFunctions}>Compare</button>

         <div>{isLoading && 'Loading...'}</div>
      </>
   );
};

export default App;
