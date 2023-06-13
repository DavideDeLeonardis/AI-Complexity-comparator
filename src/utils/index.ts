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

export const convertISValuesToBoolean = <T>(arr: T | null): T | void => {
   if (arr === null) return;

   if (Array.isArray(arr))
      arr.forEach(
         (obj: {
            isFunction: string | boolean;
            isFaster: string | boolean;
         }) => {
            if (typeof obj.isFunction === 'string')
               obj.isFunction = obj.isFunction === 'true';
            if (typeof obj.isFaster === 'string')
               obj.isFaster = obj.isFaster === 'true';
         }
      );

   return arr;
};

const hasFunctionConstruct = (s: string): boolean => {
   const regex = /\b(const|function|func|def|let)\b.*\(.*\)/;
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
