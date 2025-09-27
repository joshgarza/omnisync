import { useCardActions } from './hooks/useCardActions';
import { Card } from './components/Card';
import { ControlsBar } from './components/ControlsBar';
import { useTheme } from './hooks/useTheme';

function App() {
  // Consume all state and actions from the custom hook
  const { status, sortBy, setSortBy, handleCardClick, handleReset, sortedCardsForDisplay, cards } =
    useCardActions();
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'var(--header-color)' }}>Omnisync Card Tracker</h1>
      <p style={{ color: cards.length > 0 ? 'green' : 'red' }}>Status: {status}</p>

      {/* Controls Bar and Reset Button */}
      <ControlsBar
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleReset}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {cards.length === 0 && <p>Waiting for data or no cards found...</p>}

      {/* Card Grid Layout (Responsive) */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        {sortedCardsForDisplay.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}

export default App;
