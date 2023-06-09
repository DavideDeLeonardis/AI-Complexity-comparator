import { Configuration, OpenAIApi } from 'openai';

import { OpenAIProps } from '../interfaces';

const useOpenAI = ({
   functionsInserted,
   setRawResponse,
   setIsLoading,
	language
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
      setRawResponse('');

      try {
         const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            temperature: 0,
            messages: [
               {
                  content:
                     `You are an expert software engineer. Your job is to determine the time complexities of two functions written in ${language} and output the results in a given format written between triple backticks.`,
                  role: 'system',
               },
               {
                  content:
                     'Determine the time complexities of two functions and set which one is faster. \n  Results must be outputted with this format: \n  ``` 	[{"isFunction": "{{ isFunctionBoolean }}", "name": "{{ functionName }}", "complexity": "{{ complexityOfTheFunction }}", "isFaster": "{{ isFasterBoolean }}",}, {"isFunction": "{{ isFunction }}", "name": "{{ functionName }}", "complexity": "{{ complexityOfTheFunction }}", "isFaster": "{{ isFasterBoolean }}",}, ]  ``` \n  Instead of {{ isFunctionBoolean }} write a boolean if the input inserted is an actual programming language function, not a variable assigment. \n Instead of {{ functionName }} write the actual string name of the function inserted. \n Instead of {{ complexityOfTheFunction }} write the actual string complexity of the function inserted. \n  Instead of {{ isFasterBoolean }} write a boolean determined by which function is faster, ad example if the first function is faster write true in the first object and false in the second. If both functins have tha same complexity write false for each object. \n  Remember: output ONLY what\'s in the triple backticks without giving any other explanations or notes.',
                  role: 'user',
               },
               {
                  content: 'What are the two functions?',
                  role: 'assistant',
               },
               {
                  content: `
							Remember: ouput ONLY what's in the triple backticks without giving any other explanations or notes. \n
							The functions are: ${funcOne} and ${funcTwo}
						`,
                  role: 'user',
               },
            ],
         });

         const content = response.data.choices?.[0]?.message?.content;
         if (content) setRawResponse(content);
      } catch (e) {
         setRawResponse('SOMETHING WENT WRONG IN THE CALL.');
         console.error(e);
      } finally {
         setIsLoading(false);
      }
   };

   return getHelp;
};

export default useOpenAI;
