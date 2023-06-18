import { ReactElement, RefObject } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

interface LoadingProps {
   isLoading: boolean;
   innerRef?: RefObject<HTMLDivElement>;
}

const Loading = ({
   isLoading,
   innerRef,
}: LoadingProps): ReactElement | null => {
   return isLoading ? (
      <div className="loading" ref={innerRef}>
         <FontAwesomeIcon icon={faCircleNotch} />
      </div>
   ) : null;
};

export default Loading;
