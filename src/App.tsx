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
import { convertResponseInArray } from './utils';
import { OpenAIProps } from './interfaces';

import './assets/scss/index.scss';

type FinalResults =
   | {
        isFunction: boolean;
        name: string;
        complexity: string;
        isFaster: boolean;
     }[]
   | unknown;

const App = (): ReactElement => {
   const [language, setLanguage] = useState<string>('');
   const [funcOne, setFuncOne] = useState<string>('');
   const [funcTwo, setFuncTwo] = useState<string>('');
   const [rawResponse, setRawResponse] = useState<string | null>(null);
   const [finalResponse, setFinalResponse] = useState<FinalResults>(null);
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
         if (funcOne.trim() === '' || funcTwo.trim() === '') throw new Error();
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
            const convertedResponse: FinalResults =
               convertResponseInArray<FinalResults>(rawResponse!);

            if (Array.isArray(convertedResponse))
               setFinalResponse(convertedResponse);
            else setFinalResponse('SOMETHING WENT WRONG');
         } catch {
            setFinalResponse('SOMETHING WENT WRONG');
         }
      }
   }, [rawResponse]);

   if (finalResponse) console.log(finalResponse);

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
