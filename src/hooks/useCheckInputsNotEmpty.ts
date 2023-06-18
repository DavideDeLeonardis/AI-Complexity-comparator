import { Dispatch, SetStateAction } from 'react';

import { InputFunctionsInserted } from '../types-interfaces';

const useCheckInputsAreValid = (
   { inputFuncOne, inputFuncTwo }: InputFunctionsInserted,
   setInputsAreValid: Dispatch<SetStateAction<boolean>>
): boolean | Error => {
   const hasFunctionConstruct = (s: string): boolean => {
      const regex = /.*/;
      // /^(async\s+)?(const|function|func|def|let|\.\.\.)\s+\w+\s*=\s*(async\s*)?\([^)]*\)\s*(?::\s*\w+)?\s*=>\s*\{[^}]*\}\s*;?$/;

      return regex.test(s);
   };

   const textareasAreEmpty: boolean =
      inputFuncOne.trim() === '' || inputFuncTwo.trim() === '';
   const textareaNotContainsFunctions: boolean =
      !hasFunctionConstruct(inputFuncOne) ||
      !hasFunctionConstruct(inputFuncTwo);

   if (textareasAreEmpty || textareaNotContainsFunctions) {
      setInputsAreValid(false);
      throw new Error('Inputs not valid');
   }

   setInputsAreValid(true);

   return true;
};

export default useCheckInputsAreValid;
