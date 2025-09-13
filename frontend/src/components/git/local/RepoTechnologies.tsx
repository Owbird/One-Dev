import { data } from "@go/models";
import { FC, Fragment } from "react";
import { Chart } from "react-charts";

interface IRepoTechnologiesProps {
  technologies: data.RepoTechnologies[];
}

const RepoTechnologies: FC<IRepoTechnologiesProps> = ({ technologies }) => {
  if (technologies === undefined || technologies.length === 0) {
    return <p className="text-muted-foreground">No Technologies</p>;
  }

  return (
    <Fragment>
      <div className="w-96 h-96">
        <Chart
          options={{
            primaryAxis: {
              getValue: (datum) => datum.count,
            },
            secondaryAxes: [
              {
                getValue: (datum) => datum.count,
                elementType: "bar",
              },
            ],
            data: technologies.map(({ count, technology }) => ({
              label: technology,
              data: [
                {
                  count,
                },
              ],
            })),
          }}
        />
      </div>
    </Fragment>
  );
};

export default RepoTechnologies;
