import { ReactElement } from 'react';

import { TextareaProps } from '../interfaces';

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
