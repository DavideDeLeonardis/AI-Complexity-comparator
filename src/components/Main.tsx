import { ReactElement, useEffect, useState } from 'react';

import Intro from './Intro';
import Select from './Select';
import Textareas from './Textareas/Textareas';
import CompareButton from './CompareButton';
import Outputs from './Outputs/Outputs';
import ErrorMessage from './ErrorMessage';
import Loading from './Loading';

import useOpenAI from '../hooks/useOpenAI';
import useCheckInputsNotEmpty from '../hooks/useCheckInputsNotEmpty';
import useConversionAndPropChecking from '../hooks/useConversionAndPropChecking';
import useRefsAndScrollToElement from '../hooks/useRefsAndScrollToElement';

import {
   InputFunctionsInserted,
   OpenAIProps,
   CompareValidFunction,
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
   const { textAreaRef, loadingRef, errorRef } = useRefsAndScrollToElement({
      isLoading,
   });

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
         setFinalResponse(null);
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

         <Loading isLoading={isLoading} innerRef={loadingRef} />

         <Outputs finalResponse={finalResponse} isLoading={isLoading} />

         <ErrorMessage
            inputsAreValid={inputsAreValid}
            finalResponse={finalResponse}
            language={language}
            innerRef={errorRef}
         />
      </main>
   );
};

export default Main;
