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
   setIsLoadingCallback: Dispatch<SetStateAction<boolean>>;
}

export interface TextareaProps {
   complexity: string;
   isLoading: boolean;
   onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
   onKeyDown: (
      e: KeyboardEvent<HTMLTextAreaElement>
   ) => Promise<void> | null | undefined;
   innerRef?: RefObject<HTMLTextAreaElement>;
}
