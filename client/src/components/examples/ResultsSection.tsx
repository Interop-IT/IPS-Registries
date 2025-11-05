import { ResultsSection } from '../ResultsSection';

export default function ResultsSectionExample() {
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
    }
  ];

  return <ResultsSection results={results} />;
}
