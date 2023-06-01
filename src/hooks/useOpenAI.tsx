import { Configuration, OpenAIApi } from 'openai';

import { OpenAIProps } from '../types';

const useOpenAI = ({
   funcOne,
   funcTwo,
   setResponse,
   setIsLoading,
}: OpenAIProps): (() => void) => {
   const configuration = new Configuration({
      organization: 'org-AlpRwR46uvQzcxDJssQbo3M7',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
   });
	delete configuration.baseOptions.headers['User-Agent'];
   const openai = new OpenAIApi(configuration);

   const prompt = `
		Act like a software engineer. Your job is to compare the time complexity of two functions. 
		Output, depending on which function is faster, ONLY 
			' Function {{ nameOfTheFunction }} is faster. Complexity: {{ complexityOfTheFunction }} '.
		Instead of 'nameOfTheFunction' write actual name of the function inserted.
		Instead of 'complexityOfTheFunction' write the actual complexity of the functions inserted.
		Remember, output ONLY what's in the ''.
		The two functions are ${funcOne} and ${funcTwo}
	`;

   const APICall = async () => {
      const response = await openai.createChatCompletion({
         model: 'gpt-3.5-turbo',
         messages: [
            {
               content: prompt,
               role: 'system',
            },
         ],
      });

      return response;
   };

   const compareFunctions = (): void => {
      setResponse('');
      setIsLoading(true);

      APICall()
         .then((res) => {
            const content = res.data.choices?.[0]?.message?.content;
            if (content) setResponse(content);
         })
         .catch((e) => {
            console.log(e);
         })
         .finally(() => {
            setIsLoading(false);
         });
   };

   return compareFunctions;
};

export default useOpenAI;
