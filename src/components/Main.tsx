import {
   ReactElement,
   useEffect,
   useState,
   useRef,
   KeyboardEvent,
} from 'react';

import Select from './Select';
import Textarea from './Textarea';
import ErrorMessage from './ErrorMessage';
import Loading from './Loading';

import useOpenAI from '../hooks/useOpenAI';
import useFunctionsObjExtraction from '../hooks/useFunctionsObjExtraction';

import {
   checkInputsAreValid,
   convertRawResponseInArray,
   convertISValuesToBoolean,
} from '../utils';
import {
   InputFunctionsInserted,
   OpenAIProps,
   FinalResponse,
   FunctionInserted,
} from '../types-interfaces';
import Output from './Output';

const Main = (): ReactElement => {
   // Define refs and focus textarea when the page loads
   const selectRef = useRef<HTMLSelectElement>(null);
   const textAreaRef = useRef<HTMLTextAreaElement>(null);
   useEffect(() => textAreaRef.current?.focus(), []);

   const [language, setLanguage] = useState<string | null>(null);
   const [functionsInserted, setFunctionsInserted] =
      useState<InputFunctionsInserted>({
         inputFuncOne: '',
         inputFuncTwo: '',
      });
   const [rawResponse, setRawResponse] = useState<string | null>(null);
   const [finalResponse, setFinalResponse] = useState<FinalResponse>(null);
   const [funcOneObj, funcTwoObj] = useFunctionsObjExtraction(finalResponse);
   const [inputsAreValid, setInputsAreValid] = useState<boolean>(true);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   // Execute validateAndCompareFunctions() on pressing {{ Command / Control + Enter }} keys
   const handleKeyPress = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter')
         validateAndCompareFunctions();
   };

   // Validate functions, make API call and set raw response (initial state)
   const validateAndCompareFunctions = async (): Promise<void> => {
      if (isLoading) return;
      if (!language) {
         setLanguage('');
         return;
      }
      setFinalResponse(null);

      try {
         const { inputFuncOne, inputFuncTwo } = functionsInserted;

         if (checkInputsAreValid(inputFuncOne, inputFuncTwo))
            setInputsAreValid(true);
         else setInputsAreValid(false);

         await useOpenAI({
            functionsInserted: { inputFuncOne, inputFuncTwo },
            setRawResponse,
            setIsLoading,
            language,
         } as OpenAIProps)();
      } catch (e) {
         setIsLoading(false);
         setInputsAreValid(false);
         console.warn(e);
      }
   };

   // Check if inputs are functions, convert initial raw response in [] and set new state
   useEffect(() => {
      if (rawResponse)
         try {
            // Created BEFORE OpenAI model could output results in JSON format
            const convertedResponse: FinalResponse =
               convertRawResponseInArray<FinalResponse>(rawResponse);

            if (Array.isArray(convertedResponse)) {
               convertISValuesToBoolean(convertedResponse);

               if (
                  !convertedResponse[0].isFunction ||
                  !convertedResponse[1].isFunction
               ) {
                  setInputsAreValid(false);
                  return;
               }

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

   console.log(finalResponse);

   return (
      <main>
         <Select
            onChange={(e) => {
               setLanguage(e.target.value);
               textAreaRef.current?.focus();
            }}
            innerRef={selectRef}
         />

         <div className="inputs">
            <Textarea
               onChange={(e) =>
                  setFunctionsInserted({
                     ...functionsInserted,
                     inputFuncOne: e.target.value,
                  })
               }
               onKeyDown={handleKeyPress}
               isLoading={isLoading}
               innerRef={textAreaRef}
            />
            <Textarea
               onChange={(e) =>
                  setFunctionsInserted({
                     ...functionsInserted,
                     inputFuncTwo: e.target.value,
                  })
               }
               onKeyDown={handleKeyPress}
               isLoading={isLoading}
            />
         </div>

         <button
            className="compare"
            disabled={isLoading}
            onClick={validateAndCompareFunctions}
         >
            Compare
         </button>

         {!isLoading && Array.isArray(finalResponse) && (
            <div className="outputs">
               {finalResponse.map((funcObj: FunctionInserted, key) => (
                  <Output key={key} funcObj={funcObj} />
               ))}
            </div>
         )}

         <Loading isLoading={isLoading} />

         <ErrorMessage
            inputsAreValid={inputsAreValid}
            finalResponse={finalResponse}
            language={language}
         />
      </main>
   );
};

export default Main;
