import { Configuration, OpenAIApi } from 'openai';

import { OpenAIProps } from '../interfaces';

const useOpenAI = ({
   functionsInserted,
   setResponse,
   setIsLoading,
}: OpenAIProps): (() => void) => {
   const configuration = new Configuration({
      organization: 'org-AlpRwR46uvQzcxDJssQbo3M7',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
   });
   delete configuration.baseOptions.headers['User-Agent'];
   const openai = new OpenAIApi(configuration);

   const getHelp = async (): Promise<void> => {
      const { funcOne, funcTwo } = functionsInserted;
      setIsLoading(true);
      setResponse('');

      try {
         const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
               {
                  content: `
							Act like an experienced software engineer. Your job is to determine the time complexities of two functions and determine which one is faster. 
							Output results in a JS object having as keys the names of the functions and for values another object having the format: 'complexity: {{ complexityOfTheFunction }}', 'isFaster: {{ isFaster }}'.
							Instead of {{ complexityOfTheFunction }} write the actual string complexity of the functions inserted.
							Instead of {{ isFaster }} write a boolean determined by which function is faster, ad example if function one is faster write true.
							Remember, output ONLY the JS object.
							IF one of the function inserted is not a function output ONLY " NOT A FUNCTION " as a string.
							The functions are: ${funcOne} and ${funcTwo}
						`,
                  role: 'system',
               },
            ],
         });

         const content = response.data.choices?.[0]?.message?.content;
         if (content) setResponse(content);
      } catch (e) {
         setResponse('');
         console.warn(e);
      } finally {
         setIsLoading(false);
      }
   };

   return getHelp;
};

export default useOpenAI;
