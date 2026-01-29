import styled from "styled-components";

import { loginPalette } from "../styles/LoginModal.styles";

type FooterProps = {
  email?: string;
};

export const LoginFooter = ({ email = "tantanbo@gmail.com" }: FooterProps) => (
  <Wrap>
    <Inner>
      <Col $align="center">
        <Title>CONTACT</Title>
        <Text>{email}</Text>
      </Col>

      <Col $align="center">
        <Title>FUNCTION</Title>
        <Text>Skeletal Diagnosis</Text>
      </Col>

      <Col $align="right">
        <Title>COMMUNITY</Title>
        <Text>Style Share</Text>
      </Col>
    </Inner>
  </Wrap>
);

const Wrap = styled.footer`
  width: 100%;
  padding: 2.5rem 0;
  border-top: 1px solid ${loginPalette.whiteLine};
  background: ${loginPalette.cardDark};
  display: flex;
  justify-content: center;
`;

const Inner = styled.div`
  width: 100%;
  max-width: 896px;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }
`;

const Col = styled.div<{ $align?: "left" | "center" | "right" }>`
  display: flex;
  flex-direction: column;
  gap: 12px;

  align-items: center;

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const Title = styled.div`
  color: ${loginPalette.slate100};
  font-family:
    "Pretendard",
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    sans-serif;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.2px;
`;

const Text = styled.div`
  color: ${loginPalette.slate400};
  font-family:
    "Pretendard",
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    sans-serif;
  font-size: 12px;
  font-weight: 300;
  line-height: 16px;
  word-break: break-word;
`;
