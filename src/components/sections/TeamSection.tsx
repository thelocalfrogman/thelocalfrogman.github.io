"use client";
import { motion } from "framer-motion";
import { TeamGrid, type TeamMember } from "@ui/team-card";
import { SectionHeading } from "@ui/section-heading";
import { Button } from "@ui/button";

interface Division {
  name: string;
  description: string;
  members: TeamMember[];
}

export const TeamSection = ({
  executives,
  showFullTeam = false,
}: {
  executives: TeamMember[];
  showFullTeam?: boolean;
}) => {
  return (
    <section id="team" className="py-24 section-themed relative">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Meet the Team"
          subtitle="The passionate people behind DUCA's mission"
        />

        <TeamGrid members={executives} className="mt-12" />

        {!showFullTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button href="/meet-the-team" variant="outline">
              View Full Team & Divisions
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export const DivisionSection = ({
  division,
}: {
  division: Division;
}) => {
  return (
    <section className="py-16 section-themed">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {division.name}
          </h2>
          <p className="text-gray-400 italic mb-8 max-w-3xl">
            {division.description}
          </p>
        </motion.div>

        <TeamGrid members={division.members} />
      </div>
    </section>
  );
};

export default TeamSection;
