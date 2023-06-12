export const isType = <T>(el: any): el is T => true;

export const hasFunctionConstruct = (s: string): boolean => {
   const regex = /\b(const|function|func|def|let)\b.*\(.*\)/;
   // /^(async\s+)?(const|function|func|def|let|\.\.\.)\s+\w+\s*=\s*(async\s*)?\([^)]*\)\s*(?::\s*\w+)?\s*=>\s*\{[^}]*\}\s*;?$/;

   return regex.test(s);
};

export const convertResponseInArray = <T>(res: string): T | null => {
   const match = res.match(/```([\s\S]+?)```/);

   if (match) {
      const cleanedContent = match[1].replace(/'/g, '"');

      try {
         const parsedArray: T = eval(cleanedContent);
         if (Array.isArray(parsedArray)) return parsedArray;
      } catch (error) {
         console.error('Error parsing extracted content: ', error);
      }
   } else if (res.match(/([\s\S]+?)/))
      return JSON.parse(res.replace(/'/g, '"'));

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
