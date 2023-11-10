import { lazy } from "react";
import AfterFeaturesContent from "../../content/AfterFeaturesContent.json";
import DirectoriesContent from "../../content/DirectoriesContent.json";
import GitNGithubContent from "../../content/GitNGithubContent.json";
import IntroContent from "../../content/IntroContent.json";
import MiddleBlockContent from "../../content/MiddleBlockContent.json";
import SystemMonitorContent from "../../content/SystemMonitorContent.json";

const Contact = lazy(() => import("../../components/ContactForm"));
const MiddleBlock = lazy(() => import("../../components/MiddleBlock"));
const Container = lazy(() => import("../../common/Container"));
const ScrollToTop = lazy(() => import("../../common/ScrollToTop"));
const ContentBlock = lazy(() => import("../../components/ContentBlock"));

const Home = () => {
  return (
    <Container>
      <ScrollToTop />
      <ContentBlock
        type="right"
        title={IntroContent.title}
        content={IntroContent.text}
        button={IntroContent.button}
        icon={IntroContent.image}
        id="intro"
      />
      <MiddleBlock
        title={MiddleBlockContent.title}
        content={MiddleBlockContent.text}
        button={""}
      />
      <ContentBlock
        type="right"
        title={SystemMonitorContent.title}
        content={SystemMonitorContent.text}
        section={SystemMonitorContent.section}
        icon={SystemMonitorContent.image}
        id="systemMonitor"
      />
      <ContentBlock
        type="left"
        title={GitNGithubContent.title}
        content={GitNGithubContent.text}
        section={GitNGithubContent.section}
        icon={GitNGithubContent.image}
        id="gitNgithub"
      />
      <ContentBlock
        type="right"
        title={DirectoriesContent.title}
        content={DirectoriesContent.text}
        section={DirectoriesContent.section}
        icon={DirectoriesContent.image}
        id="directories"
      />
      <MiddleBlock
        title={AfterFeaturesContent.title}
        content={AfterFeaturesContent.text}
        button={""}
      />
    </Container>
  );
};

export default Home;
