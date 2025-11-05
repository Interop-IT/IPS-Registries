import { ResultsCards } from '../ResultsCards';

export default function ResultsCardsExample() {
  const results = [
    {
      company: "Epic Systems Corporation",
      profile: "International Patient Summary",
      actor: "Content Consumer",
      year: "2025",
      event: "North America 2025"
    },
    {
      company: "Siemens Healthineers AG",
      profile: "International Patient Summary",
      actor: "Content Creator",
      year: "2025",
      event: "North America 2025"
    },
    {
      company: "Altera Digital Health",
      profile: "International Patient Summary",
      actor: "Content Consumer",
      year: "2024",
      event: "Europe 2024"
    }
  ];

  return (
    <div className="p-8">
      <ResultsCards results={results} />
    </div>
  );
}
