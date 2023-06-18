import { ReactElement, RefObject } from 'react';

import SingleOutput from './SingleOutput';

import { FunctionInserted, FinalResponse } from '../../types-interfaces';

interface OutputsProps {
   finalResponse: FinalResponse;
   isLoading: boolean;
   innerRef: RefObject<HTMLDivElement>;
}

const Outputs = ({
   finalResponse,
   isLoading,
   innerRef,
}: OutputsProps): ReactElement | null => {
   return !isLoading && Array.isArray(finalResponse) ? (
      <div className="outputs" ref={innerRef}>
         {finalResponse.map((funcObj: FunctionInserted, key) => (
            <SingleOutput key={key} funcObj={funcObj} />
         ))}
      </div>
   ) : null;
};

export default Outputs;
