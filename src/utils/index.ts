import { Dispatch, SetStateAction } from 'react';
import { FunctionInserted, FinalResponse } from '../types-interfaces';

const hasFunctionConstruct = (s: string): boolean => {
   const regex = /.*/;
   // /^(async\s+)?(const|function|func|def|let|\.\.\.)\s+\w+\s*=\s*(async\s*)?\([^)]*\)\s*(?::\s*\w+)?\s*=>\s*\{[^}]*\}\s*;?$/;

   return regex.test(s);
};

export const checkInputsAreValid = (
   funcOne: string,
   funcTwo: string
): boolean => {
   const textareasAreEmpty: boolean =
      funcOne.trim() === '' || funcTwo.trim() === '';
   const textareaNotContainsFunctions: boolean =
      !hasFunctionConstruct(funcOne) || !hasFunctionConstruct(funcTwo);

   if (textareasAreEmpty || textareaNotContainsFunctions)
      throw new Error('Inputs not valid');

   return true;
};

export const convertRawResponseInArray = <T>(rawResponse: string): T | null => {
   const match = rawResponse.match(/```([\s\S]+?)```/);

   if (match) {
      const cleanedContent = match[1].replace(/'/g, '"');

      try {
         const parsedArray: T = eval(cleanedContent);
         if (Array.isArray(parsedArray)) return parsedArray;
      } catch (error) {
         console.error('Error parsing extracted content: ', error);
      }
   } else if (rawResponse.match(/([\s\S]+?)/))
      return JSON.parse(rawResponse.replace(/'/g, '"'));

   return null;
};

export const convertISValuesToBoolean = (
   arr: FinalResponse
): FinalResponse | void => {
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

export const checkIfNotFunction = (
   arr: FinalResponse,
   setInputsAreValid: Dispatch<SetStateAction<boolean>>
): boolean | void => {
   if (arr === null) return;

   if (Array.isArray(arr))
      if (!arr[0].isFunction || !arr[1].isFunction) {
         setInputsAreValid(false);
         return true;
      }

   return false;
};

export const checkIfBothSameComplexity = (
   arr: FinalResponse
): FinalResponse | void => {
   if (arr === null) return;

   if (Array.isArray(arr))
      if (arr[0].complexity === arr[1].complexity)
         arr.forEach((func) => (func.isFaster = false));
};
