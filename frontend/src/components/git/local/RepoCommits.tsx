import { Input } from "@src/components/ui/input";
import { Separator } from "@src/components/ui/separator";
import { GetCommitDiff } from "@go/main/App";
import { data } from "@go/models";
import { FC, Fragment, useEffect, useState } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";

interface IRepoCommitsProps {
  repo: string;
  commits: data.RepoCommit[];
}

const RepoCommits: FC<IRepoCommitsProps> = ({ repo, commits }) => {
  const [diffs, setDiffs] = useState<data.CommitDiff[]>([]);
  const [contents, setContents] = useState<(typeof diffs)[number]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCommits, setFilteredCommits] = useState(commits);
  const [activeHash, setActiveHash] = useState("");

  const handleViewCommit = async (hash: string) => {
    setActiveHash(hash);

    const currentHashIndex = commits.findIndex((x) => x.hash === hash);

    const prevHash = commits[currentHashIndex + 1].hash;

    const diffs = await GetCommitDiff(repo, hash, prevHash);

    setDiffs(() => diffs);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query === "") {
      setFilteredCommits(commits);
      return;
    }

    setFilteredCommits(
      commits.filter((commit) =>
        commit.message.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  };

  if (commits === undefined || commits.length === 0) {
    return <p className="text-muted-foreground">No Commits</p>;
  }

  useEffect(() => {
    if (commits && commits.length > 0) {
      setActiveHash(commits[0].hash);
      handleViewCommit(commits[0].hash);
    }
  }, []);

  useEffect(() => {
    setContents(diffs[0]);
  }, [diffs]);

  return (
    <Fragment>
      <div className="grid grid-cols-12 gap-3">
        {/* Commits List */}
        <div className="col-span-4">
          <Input
            value={searchQuery}
            onChange={(event) => handleSearch(event.target.value)}
            className="mb-4"
            placeholder="Search commit message"
          />
          <div className="overflow-y-scroll h-[53vh] p-4 border border-border rounded-md">
            {filteredCommits.map((commit) => (
              <div
                key={commit.hash}
                onClick={() => handleViewCommit(commit.hash)}
                className={`rounded-lg p-2 cursor-pointer transition-colors ${
                  activeHash === commit.hash
                    ? "bg-orange-600 text-white"
                    : "hover:bg-muted"
                }`}
              >
                <p className="text-lg font-medium break-words">{commit.message}</p>
                <p
                  className={`text-sm ${
                    activeHash === commit.hash
                      ? "text-white"
                      : "text-muted-foreground"
                  }`}
                >
                  {`${commit.committerName} <${commit.committerEmail}> | ${commit.date}`}
                </p>
                <Separator className="my-2" />
              </div>
            ))}
          </div>
        </div>

        {/* File Diffs List */}
        <div className="col-span-2">
          {diffs.length > 0 && (
            <div className="overflow-y-scroll h-[60vh]">
              {diffs.map((diff) => (
                <div
                  key={diff.file}
                  className={`rounded-lg p-2 cursor-pointer transition-colors ${
                    contents?.file === diff.file
                      ? "bg-orange-600 text-white"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => {
                    setContents(() => diff);
                  }}
                >
                  <p className="text-lg font-medium break-words">{diff.file}</p>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Diff Viewer */}
        <div className="col-span-6">
          {contents && (
            <div className="overflow-y-scroll h-[62vh]">
              <ReactDiffViewer
                oldValue={contents.prevContent}
                newValue={contents.currentContent}
                splitView={false}
              />
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default RepoCommits;
