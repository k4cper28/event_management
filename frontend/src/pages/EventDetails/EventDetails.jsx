import { useParams } from 'react-router-dom';

function EventDetails() {
  const { id } = useParams();

  // Tutaj możesz użyć ID do pobrania szczegółów wydarzenia z API

  return (
    <div>
      <h2>Event Details for Event ID: {id}</h2>
      {/* Tutaj wyświetl szczegóły wydarzenia */}
    </div>
  );
}

export default EventDetails;