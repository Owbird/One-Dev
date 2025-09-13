import { data } from "@go/models";
import { FC, Fragment } from "react";
import { Chart } from "react-charts";

interface IRepoContributorsProps {
  contributors: data.RepoContributors[];
}

const RepoContributors: FC<IRepoContributorsProps> = ({ contributors }) => {
  if (contributors === undefined || contributors.length === 0) {
    return <p className="text-muted-foreground">No Contributors</p>;
  }

  return (
    <Fragment>
      <div className="w-96 h-96">
        <Chart
          options={{
            interactionMode: "closest",
            getDatumStyle: (datum) =>
              ({
                circle: { r: parseInt(datum.originalDatum.percentage) },
              }) as any,
            primaryAxis: {
              getValue: (datum) => `${datum.percentage}%`,
            },
            secondaryAxes: [
              {
                getValue: (datum) => datum.totalCommits,
                elementType: "bubble",
              },
            ],
            data: contributors.map(
              ({ totalCommits, percentage, contributor }) => ({
                label: contributor,
                data: [
                  {
                    totalCommits,
                    percentage,
                  },
                ],
              }),
            ),
          }}
        />
      </div>
    </Fragment>
  );
};

export default RepoContributors;
