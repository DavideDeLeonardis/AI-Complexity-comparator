import { ReactElement } from 'react';

const Intro = (): ReactElement => {
   return (
      <section className="intro">
         <h2>
            Insert the code snippets representing your functions into the
            designated boxes and specify the programming languages used.
         </h2>
         <p>
            <span className="model">OpenAI GPT-3.5 Model</span> will analyze the
            time complexities of the functions inserted and output a
            comprehensive comparison.
         </p>
         <p>
            - This comparator is able to generate results for a wide range of
            functions written in various programming languages.
         </p>
         <p className="accessibility">
            Accessibility: Press {'{{ Command / Control + Enter }}'} keys to compare
         </p>
      </section>
   );
};

export default Intro;
