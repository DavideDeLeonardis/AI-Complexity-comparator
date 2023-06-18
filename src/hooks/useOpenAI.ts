import { Configuration, OpenAIApi } from 'openai';

import { OpenAIProps } from '../types-interfaces';

const useOpenAI = ({
   functionsInserted,
   setRawResponse,
   setIsLoading,
   language,
}: OpenAIProps): (() => Promise<void>) => {
   const configuration = new Configuration({
      organization: 'org-AlpRwR46uvQzcxDJssQbo3M7',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
   });
   const openai = new OpenAIApi(configuration);

   const getHelp = async (): Promise<void> => {
      const { inputFuncOne, inputFuncTwo } = functionsInserted;
      setIsLoading(true);
      setRawResponse('');

      try {
         const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            temperature: 0,
            messages: [
               {
                  content: `You are an expert software engineer. Your job is to determine the time complexities of two functions written in ${language} and output the results in a given format written between triple backticks.`,
                  role: 'system',
               },
               {
                  content:
                     'Determine the time complexities of two functions and set which one is faster. \n  Results must be outputted with this format: \n  ``` 	[{"isFunction": "{{ isFunctionBoolean }}", "name": "{{ functionName }}", "complexity": "{{ complexityOfTheFunction }}", "isFaster": "{{ isFasterBoolean }}",}, {"isFunction": "{{ isFunction }}", "name": "{{ functionName }}", "complexity": "{{ complexityOfTheFunction }}", "isFaster": "{{ isFasterBoolean }}"}]  ``` \n  Instead of {{ isFunctionBoolean }} write a boolean value true if the input inserted is an actual single programming language function, not a variable assigment and not formed with something before or after the function declaration, else write boolean false. \n Instead of {{ functionName }} write the actual string name of the function inserted. \n Instead of {{ complexityOfTheFunction }} write the actual string complexity of the function inserted. \n  Instead of {{ isFasterBoolean }} write a boolean value  determined by which function has the smallest time complexity, ad example if the first function takes less time to execute than the second one write true, otherwise write false. If both functions have the same complexity write false for each object. Count that the time complexity scale is O(1) < O(log n) < O(sqrt(n)) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!) so if one time complexity is minor than the next, set isFaster to true respoct that function object. \n  Remember: output ONLY the content in the triple backticks without giving any other explanations or notes.',
                  role: 'user',
               },
               {
                  content: 'What are the two functions?',
                  role: 'assistant',
               },
               {
                  content: `
							Remember: ouput ONLY the content in the triple backticks without giving any other explanations or notes. \n
							The functions are: ${inputFuncOne} and ${inputFuncTwo}
						`,
                  role: 'user',
               },
            ],
         });

         const content = response.data.choices?.[0]?.message?.content;
         console.log(content);

         if (content) setRawResponse(content);
      } catch (e) {
         setRawResponse('SOMETHING WENT WRONG');
         console.error(e);
      } finally {
         setIsLoading(false);
      }
   };

   return getHelp;
};

export default useOpenAI;
