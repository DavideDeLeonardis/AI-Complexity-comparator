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
} from '../types-interfaces';

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

   // Validate functions, make API call and set initial state
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

   // Convert initial raw response in [] and set new state
   useEffect(() => {
      if (rawResponse)
         try {
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

   finalResponse && console.log(funcOneObj, funcTwoObj);

   return (
      <>
         <Select
            onChange={(e) => {
               setLanguage(e.target.value);
               textAreaRef.current?.focus();
            }}
            innerRef={selectRef}
         />

         <div className="inputs-container">
            <Textarea
               onChange={(e) =>
                  setFunctionsInserted({
                     ...functionsInserted,
                     inputFuncOne: e.target.value,
                  })
               }
               onKeyDown={handleKeyPress}
               complexity={funcOneObj ? funcOneObj.complexity : ''}
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
               complexity={funcTwoObj ? funcTwoObj.complexity : ''}
               isLoading={isLoading}
            />
         </div>

         <button onClick={validateAndCompareFunctions}>Compare</button>

         <ErrorMessage
            inputsAreValid={inputsAreValid}
            finalResponse={finalResponse}
            language={language}
         />

         <Loading isLoading={isLoading} />
      </>
   );
};

export default Main;
