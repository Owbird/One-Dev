import { data } from "@go/models";
import Loader from "@src/components/shared/Loader";
import { FC } from "react";
import RepoContributedDays from "./RepoContributedDays";
import RepoContributors from "./RepoContributors";
import RepoTechnologies from "./RepoTechnologies";

interface IRepoAnalyticsProps {
  analytics: data.RepoAnalytics;
  totalCommits: number;
}

const RepoAnalytics: FC<IRepoAnalyticsProps> = ({
  analytics,
  totalCommits,
}) => {
  if (analytics === undefined) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-3 gap-5">
      <div>
        <h2 className="text-green-500 text-xl font-semibold mb-2">
          {totalCommits} Commits
        </h2>
        <h2 className="text-xl font-semibold mb-2">
          Contributors ({analytics.contributors.length})
        </h2>
        <div className="overflow-y-auto max-h-96">
          <RepoContributors contributors={analytics.contributors!} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Days Contributed</h2>
        <div className="overflow-y-auto max-h-96">
          <RepoContributedDays days={analytics.contributedDays!} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">
          Technologies ({analytics.technologies.length})
        </h2>
        <div className="overflow-y-auto max-h-96">
          <RepoTechnologies technologies={analytics.technologies!} />
        </div>
      </div>
    </div>
  );
};

export default RepoAnalytics;
