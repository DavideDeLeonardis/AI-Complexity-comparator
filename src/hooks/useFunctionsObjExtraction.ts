import { FunctionInserted, FinalResponse } from '../types-interfaces';

const useFunctionExtraction = (finalResponse: FinalResponse) => {
   // Extract FunctionInserted objects with type checking
   const [funcOneObj, funcTwoObj] = (() => {
      try {
         if (finalResponse !== null && Array.isArray(finalResponse))
            return finalResponse as [FunctionInserted, FunctionInserted];
         else return [] as FunctionInserted[];
      } catch {
         return [] as FunctionInserted[];
      }
   })();

   return [funcOneObj, funcTwoObj];
};

export default useFunctionExtraction;
