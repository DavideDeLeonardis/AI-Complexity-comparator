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
import {
   hasFunctionConstruct,
   convertResponseInArray,
   convertISValuesToBoolean,
} from './utils';
import { OpenAIProps } from './interfaces';

import './assets/scss/index.scss';

type FunctionInserted = {
   isFunction: boolean | undefined;
   name: string;
   complexity: string;
   isFaster: boolean | undefined;
};

type FinalResponse = FunctionInserted[] | string | null;

const App = (): ReactElement => {
   const [language, setLanguage] = useState<string | null>(null);
   const [funcOne, setFuncOne] = useState<string>('');
   const [funcTwo, setFuncTwo] = useState<string>('');
   const [rawResponse, setRawResponse] = useState<string | null>(null);
   const [finalResponse, setFinalResponse] = useState<FinalResponse>(null);
   const [inputsAreEmpty, setInputsAreEmpty] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   // Define refs and focus textarea when the page loads
   const selectRef = useRef<HTMLSelectElement>(null);
   const textAreaRef = useRef<HTMLTextAreaElement>(null);
   useEffect(() => textAreaRef.current?.focus(), []);

   // validateAndCompareFunctions() on pressing {{ Command / Control + Enter }} keys
   const handleKeyPress = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter')
         validateAndCompareFunctions();
   };

   // Validate functions, make API call and set initial state
   const validateAndCompareFunctions = async (): Promise<void> => {
      if (isLoading || !language) return;

      try {
         checkInputsValidity();
         setFinalResponse(null);

         await useOpenAI({
            functionsInserted: { funcOne, funcTwo },
            setRawResponse,
            setIsLoading,
            language,
         } as OpenAIProps)();
      } catch (e) {
         setIsLoading(false);
         setInputsAreEmpty(true);
         console.warn('Inputs not valid: ', e);
      }
   };

   const checkInputsValidity = (): void => {
      const textareaNotContainsFunctions: boolean =
         !hasFunctionConstruct(funcOne) || !hasFunctionConstruct(funcTwo);
      const textareasAreEmpty: boolean =
         funcOne.trim() === '' || funcTwo.trim() === '';

      if (textareasAreEmpty || textareaNotContainsFunctions) throw new Error();

      setInputsAreEmpty(false);
   };

   // Convert initial raw response in [] and set new state
   useEffect(() => {
      if (rawResponse)
         try {
            const convertedResponse: FinalResponse =
               convertResponseInArray<FinalResponse>(rawResponse);

            console.log('RAW: ', rawResponse);
            console.log('CONVERTED: ', convertedResponse);

            if (Array.isArray(convertedResponse)) {
               convertISValuesToBoolean<FinalResponse>(convertedResponse);
               setFinalResponse(convertedResponse);
            } else {
               throw new Error('Parsing in array error');
            }
         } catch (e) {
            setFinalResponse('SOMETHING WENT WRONG');
            console.error(e);
         } finally {
            setIsLoading(false);
         }
   }, [rawResponse]);

   // Extract FunctionInserted objects and check types
   const [funcOneObj, funcTwoObj] = (() => {
      try {
         if (finalResponse !== null && Array.isArray(finalResponse))
            return finalResponse as FunctionInserted[];
         else return [] as FunctionInserted[];
      } catch {
         return [] as FunctionInserted[];
      }
   })();
   finalResponse && console.log(funcOneObj, funcTwoObj);

   return (
      <>
         <h1>Algorithms Complexity Comparator</h1>
         <Select
            onChange={(e) => {
               setLanguage(e.target.value);
               textAreaRef.current?.focus();
            }}
            innerRef={selectRef}
         />
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

         {inputsAreEmpty && (
            <div style={{ color: 'red' }}>Insert 2 valid functions.</div>
         )}
         {finalResponse === 'SOMETHING WENT WRONG' && (
            <div style={{ color: 'red' }}>
               Something went wrong. RETRY or check language inserted.
            </div>
         )}

         <button onClick={validateAndCompareFunctions}>Compare</button>

         <div>{isLoading && 'Loading...'}</div>
      </>
   );
};

export default App;
