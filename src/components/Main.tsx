import { ReactElement, useEffect, useState, useRef } from 'react';

import Intro from './Intro';
import Select from './Select';
import Textareas from './Textareas/Textareas';
import Output from './Output';
import ErrorMessage from './ErrorMessage';
import Loading from './Loading';

import useOpenAI from '../hooks/useOpenAI';
import useCheckInputsNotEmpty from '../hooks/useCheckInputsNotEmpty';

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
import CompareButton from './CompareButton';

const Main = (): ReactElement => {
   const [language, setLanguage] = useState<string | null>(null);
   const [inputFunctionsInserted, setInputFunctionsInserted] =
      useState<InputFunctionsInserted>({
         inputFuncOne: '',
         inputFuncTwo: '',
      });
   const [rawResponse, setRawResponse] = useState<string | null>(null);
   const [finalResponse, setFinalResponse] = useState<FinalResponse>(null);
   const [inputsAreValid, setInputsAreValid] = useState<boolean>(true);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const textAreaRef = useRef<HTMLTextAreaElement>(null);

   const checkInsertedInputsConditions = (): boolean | Error | void => {
      if (isLoading) return;
      if (!language) {
         setLanguage('');
         return;
      }
      setFinalResponse(null);

      return true;
   };

   const compareValidFunctions = async (): Promise<void> => {
      const initialConditionsAreMet = checkInsertedInputsConditions();

      try {
         if (initialConditionsAreMet) {
            useCheckInputsNotEmpty(inputFunctionsInserted, setInputsAreValid);

            await useOpenAI({
               functionsInserted: inputFunctionsInserted,
               setRawResponse,
               setIsLoading,
               language,
            } as OpenAIProps)();
         }
      } catch (e) {
         setIsLoading(false);
         setInputsAreValid(false);
         console.warn(e);
      }
   };

   // Check if inputs are functions and have same complexity
   // Convert initial raw response in [] and set new state
   useEffect(() => {
      if (!rawResponse) return;

      try {
         // Created BEFORE OpenAI model could output results in JSON format
         const convertedResponse: FinalResponse =
            convertRawResponseInArray(rawResponse);

         if (!Array.isArray(convertedResponse))
            throw new Error('Parsing in array error');

         convertISValuesToBoolean(convertedResponse);
         if (checkIfNotFunction(convertedResponse, setInputsAreValid)) return;
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

         <Textareas
            inputFunctionsInserted={inputFunctionsInserted}
            setInputFunctionsInserted={setInputFunctionsInserted}
            isLoading={isLoading}
            textAreaRef={textAreaRef}
            compareValidFunctions={compareValidFunctions}
         />

         <CompareButton
            isLoading={isLoading}
            compareValidFunctions={compareValidFunctions}
         />

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
