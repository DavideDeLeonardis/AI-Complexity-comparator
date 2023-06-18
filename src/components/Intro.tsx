import { ReactElement } from 'react';

const Intro = (): ReactElement => {
   return (
      <section className="intro">
         <h2>
            Insert the code snippets representing your functions into the
            designated boxes and specify the programming languages used.
         </h2>
         <p>
            The comparator will analyze the time complexities of the functions
            and provide a comprehensive comparison.{' '}
         </p>
         <p>
            - This comparator utilizes the{' '}
            <span className="model">OpenAI GPT-3.5 Model</span> to generate
            results for a wide range of functions written in various programming
            languages.
         </p>
      </section>
   );
};

export default Intro;
