import { Button } from '@themeshift/ui/components/Button';
import { Heading } from '@themeshift/ui/components/Heading';

export default function HomePage() {
  return (
    <main className="page-root">
      <section className="hero">
        <Heading level={1}>Hello world</Heading>
        <p className="hero-copy">This is the ThemeShift UI demo app.</p>
        <Button>Primary Action</Button>
      </section>
    </main>
  );
}
