import { Row } from "antd";
import { withTranslation } from "react-i18next";
import Container from "../../common/Container";
import { SvgIcon } from "../../common/SvgIcon";

import i18n from "i18next";
import {
  Extra,
  FooterContainer,
  FooterSection,
  LogoContainer,
  NavLink,
} from "./styles";

interface SocialLinkProps {
  href: string;
  src: string;
}

const Footer = ({ t }: any) => {
  const handleChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  const SocialLink = ({ href, src }: SocialLinkProps) => {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        key={src}
        aria-label={src}
      >
        <SvgIcon src={src} width="25px" height="25px" />
      </a>
    );
  };

  return (
    <>
      <FooterSection></FooterSection>
      <Extra>
        <Container border={true}>
          <Row
            justify="space-between"
            align="middle"
            style={{ paddingTop: "3rem" }}
          >
            <NavLink to="/">
              <LogoContainer>One Dev</LogoContainer>
            </NavLink>
            <FooterContainer>
              <SocialLink
                href="https://github.com/Owbird/One-Dev"
                src="/img/svg/github.svg"
              />

              <small>
                Built with{" "}
                <a href="https://github.com/Adrinlol/landy-react-template">
                  https://github.com/Adrinlol/landy-react-template
                </a>
              </small>
            </FooterContainer>
          </Row>
        </Container>
      </Extra>
    </>
  );
};

export default withTranslation()(Footer);
