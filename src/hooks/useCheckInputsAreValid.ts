const useCheckInputsAreValid = (funcOne: string, funcTwo: string): boolean => {
   const hasFunctionConstruct = (s: string): boolean => {
      const regex = /.*/;
      // /^(async\s+)?(const|function|func|def|let|\.\.\.)\s+\w+\s*=\s*(async\s*)?\([^)]*\)\s*(?::\s*\w+)?\s*=>\s*\{[^}]*\}\s*;?$/;

      return regex.test(s);
   };

   const textareasAreEmpty: boolean =
      funcOne.trim() === '' || funcTwo.trim() === '';
   const textareaNotContainsFunctions: boolean =
      !hasFunctionConstruct(funcOne) || !hasFunctionConstruct(funcTwo);

   if (textareasAreEmpty || textareaNotContainsFunctions)
      throw new Error('Inputs not valid');

   return true;
};

export default useCheckInputsAreValid;
