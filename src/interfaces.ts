import {
   KeyboardEvent,
   ChangeEvent,
   Dispatch,
   SetStateAction,
   RefObject,
} from 'react';

export interface OpenAIProps {
   setResponse: Dispatch<SetStateAction<string>>;
   prompt: string;
   setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export interface TextareaProps {
   complexity: string;
   isLoading: boolean;
   onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
   onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void | null;
   innerRef?: RefObject<HTMLTextAreaElement>;
}
