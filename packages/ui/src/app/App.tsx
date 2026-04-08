import { useState } from 'react';

import { Button, Heading } from '@/components';
import { useTheme } from '@/contexts';

import styles from './App.module.scss';

function App() {
  const [count, setCount] = useState(0);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <section>
        <Heading level={1}>Heading 1</Heading>
        <Heading level={2}>Heading 2</Heading>
        <Heading level={3}>Heading 3</Heading>
        <Heading level={4}>Heading 4</Heading>
        <Heading level={5}>Heading 5</Heading>
        <Heading level={6}>Heading 6</Heading>

        <Heading muted level={1}>
          Heading 1
        </Heading>
        <Heading muted level={2}>
          Heading 2
        </Heading>
        <Heading muted level={3}>
          Heading 3
        </Heading>
        <Heading muted level={4}>
          Heading 4
        </Heading>
        <Heading muted level={5}>
          Heading 5
        </Heading>
        <Heading muted level={6}>
          Heading 6
        </Heading>
      </section>

      <div>
        <section>
          <Heading level={2}>Pink button</Heading>
          <Button onClick={toggleTheme} className={styles.pinkButton}>
            {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          </Button>
        </section>

        <section>
          <Heading level={2}>Sizes</Heading>
          <div>
            <Button size="small" onClick={() => setCount((count) => count + 1)}>
              Count: {count}
            </Button>
            <Button onClick={() => setCount((count) => count + 1)}>
              Count: {count}
            </Button>
            <Button size="large" onClick={() => setCount((count) => count + 1)}>
              Count: {count}
            </Button>
          </div>
        </section>

        <section>
          <Heading level={2}>Intents</Heading>
          <p>Intents are used to indicate the purpose for the buttons</p>
          <ul>
            <li>
              <strong>primary</strong>: This is for the default action a user
              should take. Generally you should also add{' '}
              <code>type="submit"</code> to these buttons so that this button
              can submit forms
            </li>
            <li>
              <strong>secondary</strong>: This is for the any secondary actions
              the user, like cancel
            </li>
            <li>
              <strong>tertiary</strong>: This is for the any actions that might
              only be tertially related to the other buttons and renders as a
              link
            </li>
            <li>
              <strong>constructive</strong>: This intent renders with a green
              colour, and is for buttons that have a constructive outcome, like
              creating new records (like new users, new data, etc). Generally
              anything that you'd use an HTTP PUT for should have this intent
            </li>
            <li>
              <strong>destructive</strong>: This intent renders with a red
              colour, and is for buttons that have a destructive outcomes, like
              removing records or data. Generally anything that you'd use an
              HTTP DELETE for should have this intent
            </li>
          </ul>

          <Button
            onClick={() => setCount((count) => count + 1)}
            intent="primary"
          >
            Count: {count}
          </Button>

          <Button
            onClick={() => setCount((count) => count + 1)}
            intent="secondary"
          >
            Count: {count}
          </Button>
          <Button
            onClick={() => setCount((count) => count + 1)}
            intent="tertiary"
          >
            Count: {count}
          </Button>
          <Button
            onClick={() => setCount((count) => count + 1)}
            intent="constructive"
          >
            Count: {count}
          </Button>
          <Button
            onClick={() => setCount((count) => count + 1)}
            intent="destructive"
          >
            Count: {count}
          </Button>
        </section>

        <section>
          <Heading level={2}>Disabled</Heading>
          <p>
            Buttons are disabled, they can't be focused or clicked, and receive
            special cursor treatment to indicate this
          </p>

          <Button
            onClick={() => setCount((count) => count + 1)}
            intent="primary"
            disabled
          >
            Count: {count}
          </Button>

          <Button
            onClick={() => setCount((count) => count + 1)}
            intent="secondary"
            disabled
          >
            Count: {count}
          </Button>

          <Button
            onClick={() => setCount((count) => count + 1)}
            intent="tertiary"
            disabled
          >
            Count: {count}
          </Button>

          <Button
            onClick={() => setCount((count) => count + 1)}
            intent="constructive"
            disabled
          >
            Count: {count}
          </Button>
          <Button
            onClick={() => setCount((count) => count + 1)}
            intent="destructive"
            disabled
          >
            Count: {count}
          </Button>
        </section>

        <section>
          <Heading level={2}>Visually disabled </Heading>
          <p>
            Buttons are still focusable and clickable, but appear disabled. This
            gives developers the ability to hook up hints for the user when the
            reason why the buttons are disabled aren't clear.
          </p>

          <Button
            onClick={() => setCount((count) => count + 1)}
            intent="primary"
            visuallyDisabled
          >
            Count: {count}
          </Button>

          <Button
            onClick={() => setCount((count) => count + 1)}
            intent="secondary"
            visuallyDisabled
          >
            Count: {count}
          </Button>

          <Button
            onClick={() => setCount((count) => count + 1)}
            intent="tertiary"
            visuallyDisabled
          >
            Count: {count}
          </Button>

          <Button
            onClick={() => setCount((count) => count + 1)}
            intent="constructive"
            visuallyDisabled
          >
            Count: {count}
          </Button>
          <Button
            onClick={() => setCount((count) => count + 1)}
            intent="destructive"
            visuallyDisabled
          >
            Count: {count}
          </Button>
        </section>
      </div>
    </>
  );
}

export default App;
