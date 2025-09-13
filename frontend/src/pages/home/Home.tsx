import FileSystems from "@src/components/home/FileSystems";
import Greeting from "@src/components/home/Greeting";
import Processess from "@src/components/home/Processess";
import Resources from "@src/components/home/Resources";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@src/components/ui/tabs";
import { Fragment } from "react";

const Home = () => {
  return (
    <Fragment>
      <Greeting />
      <div className="flex flex-col items-start space-y-4">
        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="processes">Processes</TabsTrigger>
            <TabsTrigger value="filesystems">File Systems</TabsTrigger>
          </TabsList>
          <TabsContent value="resources" className="mt-4">
            <Resources />
          </TabsContent>
          <TabsContent value="processes" className="mt-4">
            <Processess />
          </TabsContent>
          <TabsContent value="filesystems" className="mt-4">
            <FileSystems />
          </TabsContent>
        </Tabs>
      </div>
    </Fragment>
  );
};

export default Home;
