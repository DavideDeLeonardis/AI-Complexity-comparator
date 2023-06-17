import {
   ReactElement,
   useEffect,
   useState,
   useRef,
   KeyboardEvent,
} from 'react';

import Intro from './Intro';
import Select from './Select';
import Textarea from './Textarea';
import Output from './Output';
import ErrorMessage from './ErrorMessage';
import Loading from './Loading';

import useOpenAI from '../hooks/useOpenAI';
import useCheckInputsAreValid from '../hooks/useCheckInputsAreValid';

import {
   convertRawResponseInArray,
   convertISValuesToBoolean,
   checkIfNotFunction,
   checkIfBothSameComplexity,
} from '../utils/checkAndConvertFuncObj';
import {
   InputFunctionsInserted,
   OpenAIProps,
   FunctionInserted,
   FinalResponse,
} from '../types-interfaces';

const Main = (): ReactElement => {
   const [language, setLanguage] = useState<string | null>(null);
   const [functionsInserted, setFunctionsInserted] =
      useState<InputFunctionsInserted>({
         inputFuncOne: '',
         inputFuncTwo: '',
      });
   const [rawResponse, setRawResponse] = useState<string | null>(null);
   const [finalResponse, setFinalResponse] = useState<FinalResponse>(null);
   const [inputsAreValid, setInputsAreValid] = useState<boolean>(true);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const textAreaRef = useRef<HTMLTextAreaElement>(null);

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

         if (useCheckInputsAreValid(inputFuncOne, inputFuncTwo))
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
               convertRawResponseInArray(rawResponse);

            if (!Array.isArray(convertedResponse))
               throw new Error('Parsing in array error');

            convertISValuesToBoolean(convertedResponse);
            if (checkIfNotFunction(convertedResponse, setInputsAreValid))
               return;
            checkIfBothSameComplexity(convertedResponse);
            setFinalResponse(convertedResponse);
         } catch (e) {
            setFinalResponse('SOMETHING WENT WRONG');
            console.error(e);
         } finally {
            setIsLoading(false);
         }
   }, [rawResponse]);

   const outputs =
      !isLoading &&
      Array.isArray(finalResponse) &&
      finalResponse.map((funcObj: FunctionInserted, key) => (
         <Output key={key} funcObj={funcObj} />
      ));

   return (
      <main>
         <Intro />

         <Select
            onChange={(e) => {
               setLanguage(e.target.value);
               textAreaRef.current?.focus();
            }}
         />

         <section className="inputs">
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
         </section>

         <button
            className="compare"
            disabled={isLoading}
            onClick={validateAndCompareFunctions}
         >
            Compare
         </button>

         {finalResponse && <div className="outputs">{outputs}</div>}

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
