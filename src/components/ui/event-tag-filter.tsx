"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EventData {
  title: string;
  description: string;
  eventDate: string;
  endDate?: string;
  location: string;
  tags?: string[];
  registrationUrl?: string;
  slug: string;
}

interface EventTagFilterProps {
  events: EventData[];
  tags: string[];
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export function EventTagFilter({ events, tags }: EventTagFilterProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearTags = () => setSelectedTags([]);

  const now = new Date();

  const filteredEvents = useMemo(() => {
    if (selectedTags.length === 0) return events;
    return events.filter((event) =>
      event.tags?.some((tag) => selectedTags.includes(tag))
    );
  }, [events, selectedTags]);

  const upcomingEvents = filteredEvents
    .filter((e) => new Date(e.eventDate) >= now)
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  const pastEvents = filteredEvents
    .filter((e) => new Date(e.eventDate) < now)
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  return (
    <div>
      {/* Tag Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          onClick={clearTags}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            selectedTags.length === 0
              ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
              : "bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20"
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              selectedTags.includes(tag)
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30"
                : "bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            Upcoming Events
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Don't miss out on these exciting opportunities
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {upcomingEvents.map((event) => (
                <motion.div
                  key={event.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative p-6 rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-gray-800/40 hover:border-orange-500/30 transition-colors group"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-2">
                      {event.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-semibold text-orange-400 uppercase tracking-wider px-2 py-1 bg-orange-500/10 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {event.title}
                    </h3>
                    <div className="text-gray-400 text-sm mb-4 space-y-1">
                      <p>📅 {formatDate(event.eventDate)}</p>
                      <p>
                        🕐 {formatTime(event.eventDate)}
                        {event.endDate && ` - ${formatTime(event.endDate)}`}
                      </p>
                      <p>📍 {event.location}</p>
                    </div>
                    <p className="text-gray-300 mb-6 flex-grow line-clamp-3">
                      {event.description}
                    </p>
                    <div className="flex gap-3">
                      <a
                        href={`/events/${event.slug}`}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-orange-500/30 text-orange-400 text-sm font-semibold hover:bg-orange-500/10 transition-colors"
                      >
                        Learn More
                      </a>
                      {event.registrationUrl && (
                        <a
                          href={event.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition-colors"
                        >
                          Register Now
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {upcomingEvents.length === 0 && (
        <div className="text-center py-12 mb-16">
          <p className="text-gray-400 text-lg">
            {selectedTags.length > 0
              ? "No upcoming events match the selected tags."
              : "No upcoming events at the moment. Check back soon!"}
          </p>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className="border-t border-gray-700/50 pt-16">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            Past Events
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Highlights from our previous activities
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {pastEvents.map((event) => (
                <motion.a
                  key={event.slug}
                  href={`/events/${event.slug}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="block p-6 rounded-xl bg-gray-900/60 border border-gray-700/50 hover:border-orange-500/30 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {event.tags?.slice(0, 1).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-gray-200 mt-2 mb-1 group-hover:text-orange-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    {formatDate(event.eventDate)}
                  </p>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {event.description}
                  </p>
                </motion.a>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventTagFilter;
