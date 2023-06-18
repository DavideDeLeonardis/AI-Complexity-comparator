import { InputFunctionsInserted } from '../types-interfaces';

const hasFunctionConstruct = (s: string): boolean => {
   const regex = /.*/;
   // /^(async\s+)?(const|function|func|def|let|\.\.\.)\s+\w+\s*=\s*(async\s*)?\([^)]*\)\s*(?::\s*\w+)?\s*=>\s*\{[^}]*\}\s*;?$/;

   return regex.test(s);
};

const useCheckInputsAreEmpty = ({
   inputFuncOne,
   inputFuncTwo,
}: InputFunctionsInserted): boolean => {
   const textareasAreEmpty: boolean =
      inputFuncOne.trim() === '' || inputFuncTwo.trim() === '';
   const textareaNotContainsFunctions: boolean =
      !hasFunctionConstruct(inputFuncOne) ||
      !hasFunctionConstruct(inputFuncTwo);

   if (textareasAreEmpty || textareaNotContainsFunctions) return true;

   return false;
};

export default useCheckInputsAreEmpty;
