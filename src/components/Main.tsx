import { ReactElement, useEffect, useState, useRef } from 'react';

import Intro from './Intro';
import Select from './Select';
import Textareas from './Textareas/Textareas';
import CompareButton from './CompareButton';
import Output from './Output';
import ErrorMessage from './ErrorMessage';
import Loading from './Loading';

import useOpenAI from '../hooks/useOpenAI';
import useCheckInputsNotEmpty from '../hooks/useCheckInputsNotEmpty';
import useConversionAndPropChecking from '../hooks/useConversionAndPropChecking';

import {
   InputFunctionsInserted,
   OpenAIProps,
   CompareValidFunction,
   FunctionInserted,
   FinalResponse,
} from '../types-interfaces';

const Main = (): ReactElement => {
   // Created BEFORE OpenAI model could output results in JSON format

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

   // Functions to convert string response in array and validate its properties
   const cF = useConversionAndPropChecking();

   const checkInsertedInputsConditions = (): boolean | void => {
      if (isLoading) return;
      if (!language) {
         setLanguage('');
         return;
      }

      return true;
   };

   const compareValidFunctions: CompareValidFunction = async () => {
      const initialConditionsAreMet = checkInsertedInputsConditions();

      try {
         if (!initialConditionsAreMet) return;

         useCheckInputsNotEmpty(inputFunctionsInserted, setInputsAreValid);

         await useOpenAI({
            functionsInserted: inputFunctionsInserted,
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

   const convertRawResponseInArray = (): FinalResponse | Error | void => {
      if (!rawResponse) return;

      const convertedResponse: FinalResponse =
         cF.convertRawResponseInArray(rawResponse);

      if (!Array.isArray(convertedResponse))
         throw new Error('Parsing in array error');

      cF.convertISValuesToBoolean(convertedResponse);
      cF.checkIfBothSameComplexity(convertedResponse);

      return convertedResponse;
   };

   useEffect(() => {
      const checkAndSetFinalResponse = (): void => {
         if (!rawResponse) return;

         try {
            const convertedResponse =
               convertRawResponseInArray() as FinalResponse;

            if (cF.checkIfNotFunction(convertedResponse)) {
               setFinalResponse(null);
               setInputsAreValid(false);
               return;
            }

            setFinalResponse(convertedResponse);
         } catch (e) {
            setFinalResponse('SOMETHING WENT WRONG');
            console.error(e);
         } finally {
            setIsLoading(false);
         }
      };

      checkAndSetFinalResponse();
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
