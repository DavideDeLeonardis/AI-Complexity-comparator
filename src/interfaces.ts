import {
   KeyboardEvent,
   ChangeEvent,
   Dispatch,
   SetStateAction,
   RefObject,
} from 'react';

export interface SelectProps {
   onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	innerRef?: RefObject<HTMLSelectElement>;
}

export interface TextareaProps {
   complexity: string;
   isLoading: boolean;
   onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
   onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void | null;
   innerRef?: RefObject<HTMLTextAreaElement>;
}

export interface OpenAIProps {
   functionsInserted: { funcOne: string; funcTwo: string };
   setRawResponse: Dispatch<SetStateAction<string>>;
   setIsLoading: Dispatch<SetStateAction<boolean>>;
   language: string;
}
