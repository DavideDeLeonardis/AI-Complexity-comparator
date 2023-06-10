export const isType = <T>(el: any): el is T => true;

export const hasFunctionConstruct = (s: string): boolean => {
   const regex =
      /(function|func|def|const|let|...)\s+\w+\s*\([^)]*\)\s*{[^}]*}/;
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
   }

   return null;
};
