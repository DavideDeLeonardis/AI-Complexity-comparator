import { ReactElement, KeyboardEvent, ChangeEvent, RefObject } from 'react';

interface TextareaProps {
   isLoading: boolean;
   onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
   onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void | null;
   innerRef?: RefObject<HTMLTextAreaElement>;
}

const Textarea = ({
   onChange,
   onKeyDown,
   innerRef,
   isLoading,
}: TextareaProps): ReactElement => {
   return (
      <div className="input-container">
         <textarea
            placeholder="Insert function to compare"
            ref={innerRef}
            onChange={onChange}
            onKeyDown={onKeyDown}
            disabled={isLoading}
         />
      </div>
   );
};

export default Textarea;
