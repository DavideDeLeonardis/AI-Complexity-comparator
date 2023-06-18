import { FunctionInserted, FinalResponse } from '../types-interfaces';

interface ConversionProps {
   convertRawResponseInArray: (rawResponse: string) => FinalResponse | null;
   convertISValuesToBoolean: (arr: FinalResponse) => FinalResponse | void;
   checkIfNotFunction: (arr: FinalResponse) => boolean | void;
   checkIfBothSameComplexity: (arr: FinalResponse) => FinalResponse | void;
}

const convertRawResponseInArray = (
   rawResponse: string
): FinalResponse | null => {
   const match = rawResponse.match(/```([\s\S]+?)```/);

   if (match) {
      const cleanedContent = match[1].replace(/'/g, '"');

      try {
         const parsedArray = eval(cleanedContent);
         if (Array.isArray(parsedArray)) return parsedArray as FinalResponse;
      } catch (error) {
         console.error('Error parsing extracted content: ', error);
      }
   } else if (rawResponse.match(/([\s\S]+?)/))
      return JSON.parse(rawResponse.replace(/'/g, '"'));

   return null;
};

const convertISValuesToBoolean = (arr: FinalResponse): FinalResponse | void => {
   if (arr === null) return;

   if (Array.isArray(arr))
      arr.forEach((obj: FunctionInserted) => {
         if (typeof obj.isFunction === 'string')
            obj.isFunction = obj.isFunction === 'true';
         if (typeof obj.isFaster === 'string')
            obj.isFaster = obj.isFaster === 'true';
      });

   return arr;
};

const checkIfNotFunction = (arr: FinalResponse): boolean | void => {
   if (arr === null) return;

   if (Array.isArray(arr))
      if (!arr[0].isFunction || !arr[1].isFunction) return true;
};

const checkIfBothSameComplexity = (
   arr: FinalResponse
): FinalResponse | void => {
   if (arr === null) return;

   if (Array.isArray(arr))
      if (arr[0].complexity === arr[1].complexity)
         arr.forEach((func) => (func.isFaster = false));
};

const useConversionAndPropChecking = (): ConversionProps => {
   return {
      convertRawResponseInArray,
      convertISValuesToBoolean,
      checkIfNotFunction,
      checkIfBothSameComplexity,
   };
};

export default useConversionAndPropChecking;
