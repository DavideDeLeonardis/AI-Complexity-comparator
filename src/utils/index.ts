export const isType = <Type extends unknown>(el: any): el is Type => true;

export const convertResponseInArray = <T>(res: string): T | null => {
   const match = res.match(/```([\s\S]+?)```/);

   if (match) {
      const cleanedContent = match[1].replace(/'/g, '"');

      try {
         const parsedArray: T = eval(cleanedContent);
         if (Array.isArray(parsedArray)) return parsedArray;
      } catch (error) {
         console.error('Error parsing extracted content:', error);
      }
   }

   return null;
};
