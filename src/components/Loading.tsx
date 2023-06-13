import { ReactElement } from 'react';

interface LoadingProps {
   isLoading: boolean;
}

const Loading = ({ isLoading }: LoadingProps): ReactElement => (
   <div>{isLoading && 'Loading...'}</div>
);

export default Loading;
