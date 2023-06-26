import { ReactElement, useEffect, useState, useRef } from 'react';

import Intro from './Intro';
import Select from './Select';
import Textareas from './Textareas/Textareas';
import CompareButton from './CompareButton';
import Loading from './Loading';
import Outputs from './Outputs/Outputs';
import ErrorMessage from './ErrorMessage';

import useOpenAI from '../hooks/useOpenAI';
import useCheckInputsAreEmpty from '../hooks/useCheckInputsAreEmpty';
import useConversionAndPropChecking from '../hooks/useConversionAndPropChecking';
import useRefsAndScrollToElement from '../hooks/useRefsAndScrollToElement';

import {
   InputFunctionsInserted,
   HandleSelectChange,
   CompareValidFunction,
   FinalResponse,
   OpenAIProps,
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

   // Handle the window scroll to an element
   const { loadingRef, outputsRef } = useRefsAndScrollToElement({
      isLoading,
      finalResponse,
   });

   // Functions to convert raw response in array and validate its properties
   const utils = useConversionAndPropChecking();

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

         if (useCheckInputsAreEmpty(inputFunctionsInserted))
            throw new Error('Inputs empty or not valid');
         else setInputsAreValid(true);

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

   const convertRawInFinalResponse = (): FinalResponse | Error | void => {
      if (!rawResponse) return;

      const convertedResponse: FinalResponse =
         utils.convertRawResponseInArray(rawResponse);

      if (!Array.isArray(convertedResponse))
         throw new Error('Parsing in array error');

      utils.convertISValuesToBoolean(convertedResponse);
      utils.checkIfBothSameComplexity(convertedResponse);

      return convertedResponse;
   };

   useEffect(() => {
      const checkAndSetFinalResponse = (): void => {
         if (!rawResponse) return;

         try {
            const convertedResponse =
               convertRawInFinalResponse() as FinalResponse;

            if (utils.checkIfNotFunction(convertedResponse)) {
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

   const handleSelectChange: HandleSelectChange = (e) => {
      setLanguage(e.target.value);
      textAreaRef.current?.focus();
   };

   return (
      <main>
         <Intro />

         <Select onChange={handleSelectChange} />

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

         <Outputs
            finalResponse={finalResponse}
            isLoading={isLoading}
            innerRef={outputsRef}
         />

         <ErrorMessage
            inputsAreValid={inputsAreValid}
            finalResponse={finalResponse}
            language={language}
         />
      </main>
   );
};

export default Main;
