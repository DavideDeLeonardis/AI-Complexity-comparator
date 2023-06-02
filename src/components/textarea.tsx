import { ReactElement, ChangeEvent, KeyboardEvent, RefObject } from 'react';

interface TextareaProps {
   complexity: string;
   isLoading: boolean;
   onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
   onKeyDown: (
      e: KeyboardEvent<HTMLTextAreaElement>
   ) => Promise<void> | null | undefined;
   innerRef?: RefObject<HTMLTextAreaElement>;
}

const Textarea = ({
   onChange,
   onKeyDown,
   innerRef,
   complexity,
   isLoading,
}: TextareaProps): ReactElement => {
   return (
      <div className="container">
         <textarea
            placeholder="Insert function to compare"
            ref={innerRef}
            onChange={onChange}
            onKeyDown={onKeyDown}
         ></textarea>
         {!isLoading && <div>{complexity}</div>}
      </div>
   );
};

export default Textarea;
