import { Dispatch, SetStateAction } from 'react';

export interface OpenAIProps {
   funcOne: string;
   funcTwo: string;
   setResponse: Dispatch<SetStateAction<string>>;
   setIsLoading: Dispatch<SetStateAction<boolean>>;
}
