import { ReactElement } from 'react';

import SingleOutput from './SingleOutput';

import { FinalResponse, FunctionInserted } from '../../types-interfaces';

interface OutputsProps {
   finalResponse: FinalResponse;
   isLoading: boolean;
}

const Outputs = ({
   finalResponse,
   isLoading,
}: OutputsProps): ReactElement | null => {
   return !isLoading && Array.isArray(finalResponse) ? (
      <div className="outputs">
         {finalResponse.map((funcObj: FunctionInserted, key) => (
            <SingleOutput key={key} funcObj={funcObj} />
         ))}
      </div>
   ) : null;
};

export default Outputs;
