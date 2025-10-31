import React, { useEffect, useState } from "react";
import API from "../api";
import ExperienceCard from "../components/ExperienceCard";

export default function Home({ searchQuery }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/api/experiences")
      .then((res) => setExperiences(res.data))
      .catch((err) => setError("Failed to load experiences"))
      .finally(() => setLoading(false));
  }, []);

  const filteredExperiences = experiences.filter((exp) =>
    exp.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return <div className="py-20 text-center">Loading experiences...</div>;
  if (error)
    return <div className="py-20 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {filteredExperiences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredExperiences.map((exp) => (
            <ExperienceCard key={exp._id} exp={exp} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500">
          {searchQuery
            ? `No experiences found matching "${searchQuery}"`
            : "No experiences found."}
        </div>
      )}
    </div>
  );
}
