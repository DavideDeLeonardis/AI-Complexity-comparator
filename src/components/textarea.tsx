import { ReactElement, KeyboardEvent, ChangeEvent, RefObject } from 'react';

interface TextareaProps {
   complexity: string;
   isLoading: boolean;
   onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
   onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void | null;
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
            disabled={isLoading}
         />
         {!isLoading && <div>{complexity}</div>}
      </div>
   );
};

export default Textarea;
