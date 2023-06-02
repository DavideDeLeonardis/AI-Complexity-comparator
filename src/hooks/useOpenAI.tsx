import { useState, useEffect } from 'react';
import { Configuration, OpenAIApi } from 'openai';

import { OpenAIProps } from '../types';

const useOpenAI = ({
   prompt,
   setResponse,
   setIsLoadingCallback,
}: OpenAIProps): { getHelp: () => void } => {
   const configuration = new Configuration({
      organization: 'org-AlpRwR46uvQzcxDJssQbo3M7',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
   });
   delete configuration.baseOptions.headers['User-Agent'];
   const openai = new OpenAIApi(configuration);

   const [isLoading, setIsLoading] = useState<boolean>(false);

   useEffect(() => {
      if (setIsLoadingCallback) setIsLoadingCallback(isLoading);
   }, [isLoading, setIsLoadingCallback]);

   const getHelp = async (): Promise<void> => {
      setIsLoading(true);
      setResponse('');

      try {
         const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
               {
                  content: prompt,
                  role: 'system',
               },
            ],
         });

         const content = response.data.choices?.[0]?.message?.content;
         if (content) setResponse(content);
      } catch (error) {
         console.warn(error);
			setResponse('ERROR')
      } finally {
         setIsLoading(false);
      }
   };

   return { getHelp };
};

export default useOpenAI;
