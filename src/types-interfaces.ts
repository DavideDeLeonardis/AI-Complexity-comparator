import { Dispatch, SetStateAction } from 'react';

/**
 *
 * TYPES
 *
 */

export type FunctionInserted = {
   isFunction: boolean | string;
   name: string;
   complexity: string;
   isFaster: boolean | string;
};

export type FinalResponse = FunctionInserted[] | string | null;

/**
 *
 * INTERFACES
 *
 */

export interface OpenAIProps {
   functionsInserted: { funcOne: string; funcTwo: string };
   setRawResponse: Dispatch<SetStateAction<string | null>>;
   setIsLoading: Dispatch<SetStateAction<boolean>>;
   language: string;
}
