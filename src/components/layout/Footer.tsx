export function Footer({ moduleCount }: { moduleCount: number }) {
  return (
    <footer>
      <div className="container">
        <p>
          The AI-Native PM · {moduleCount} modules · Built for product managers
        </p>
      </div>
    </footer>
  );
}
