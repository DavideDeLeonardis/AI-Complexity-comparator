import { Dispatch, SetStateAction } from 'react';

export interface OpenAIProps {
   setResponse: Dispatch<SetStateAction<string>>;
	prompt: string;
	setIsLoadingCallback: Dispatch<SetStateAction<boolean>>;
}
