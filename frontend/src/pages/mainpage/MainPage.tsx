import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  font-family: 'Pretendard Variable', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Helvetica, Arial, sans-serif;
`;

const MainPage = () => {
  return (
    <Container>
      {/* Header */}
      <Header>
        <Logo>LOGO</Logo>
        <Nav>
          <NavLink>HOME</NavLink>
          <NavLink>ABOUT</NavLink>
          <NavLink>FUNCTION</NavLink>
          <NavLink>COMMUNITY</NavLink>
        </Nav>
        <AuthLinks>
          <NavLink>LOGIN</NavLink>
          <NavLink>SIGNUP</NavLink>
        </AuthLinks>
      </Header>

      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <Subtitle>AI SKELETAL ANALYSIS SERVICE</Subtitle>
          <MainTitle>
            Find Your
            <br />
            Originality.
          </MainTitle>
          <Description>
            골격과 체형, 골밀도 파악 골반에정을 수치화하여, <br />
            그에 맞는 스타일링 제안을 받으세요.
          </Description>
          <CTAButton>내 골격 진단하기 →</CTAButton>
        </HeroContent>
      </HeroSection>

      {/* Category Bar */}
      <CategoryBar>
        <Category>AI SKELETAL TYPE</Category>
        <Category>BONE TYPE</Category>
        <Category>MATERIAL TYPE</Category>
        <Category>WRINKLE TERMINOLOGY</Category>
        <Category>FOREHEAD SIZE</Category>
        <Category>PERSONALIZE STYLING</Category>
        <Category>STRAIGHT TYPE</Category>
        <Category>GAME TYPE</Category>
        <Category>NATURAL CARE</Category>
      </CategoryBar>

      {/* Data Driven Section */}
      <DataDrivenSection>
        <DataDrivenContent>
          <DataDrivenTitle>
            <Subtitle>HOW IT WORKS</Subtitle>
            <Title>Data Driven</Title>
            <Subtitle>Styling Process.</Subtitle>
          </DataDrivenTitle>
          <DataDrivenDescription>
            당신을 추천한 AI 기술로 <br />
            스타일을 재정의하는 경험을 받게 됩니다.
          </DataDrivenDescription>
        </DataDrivenContent>

        <CardGrid>
          <Card>
            <CardIcon>⛏️</CardIcon>
            <CardTitle>01. AI Skeletal Analysis</CardTitle>
            <CardDescription>
              당신의 두뇌/얼굴 분석 기술 골밀도 <br />
              우리는 정확한 수치 기반의 스타일을 제시합니다
            </CardDescription>
          </Card>
          <Card>
            <CardIcon>📊</CardIcon>
            <CardTitle>02. Best vs Worst Report</CardTitle>
            <CardDescription>
              당신에 맞춘 '성공' 과 '실패' 를 제시하는
              지향하는 일이 아닌 개인의 특징을 강조해 드립니다.
            </CardDescription>
          </Card>
          <Card>
            <CardIcon>👗</CardIcon>
            <CardTitle>03. AI Virtual Fitting</CardTitle>
            <CardDescription>
              당신의 두뇌/얼굴 분석 기술 거나 남은 보여주는
              당신을 비사하는 실시간 AI 피팅을 받을 수 있습니다.
            </CardDescription>
          </Card>
        </CardGrid>
      </DataDrivenSection>

      {/* Beyond the Trend Section */}
      <BeyondTrendSection>
        <ImageBox>
          <PlaceholderImage>
            <ImageText>Model Image</ImageText>
          </PlaceholderImage>
          <AnalysisLabel>Analysis Result</AnalysisLabel>
        </ImageBox>

        <TrendContent>
          <TrendTitle>Beyond the Trend,</TrendTitle>
          <TrendSubtitle>Back to Basic.</TrendSubtitle>
          <TrendDescription>
            당신의 모습 수준의 광의적 정의가 아닌<br />
            다양하는 도인의 작업 선택 거쳐서,<br />
            기본 적인-고유의 스타일을 정의합니다.
          </TrendDescription>
          <BulletList>
            <BulletItem>체형별 맞춤 가상 피팅 서비스</BulletItem>
            <BulletItem>같은 체형 유저들과 스타일 공유 커뮤니티</BulletItem>
            <BulletItem>AI가 매일 업데이트하는 추천 아이템</BulletItem>
          </BulletList>
          <ViewCommunityButton>View Community &gt;</ViewCommunityButton>
        </TrendContent>
      </BeyondTrendSection>

      {/* CTA Section */}
      <FinalCTASection>
        <FinalTitle>Ready to find yours?</FinalTitle>
        <FinalDescription>
            지금 바로 AI 골격 진단을 시작하고, 나만의 스타일을 찾아보세요.
        </FinalDescription>
        <FinalCTAButton>지금 무료로 진단하기</FinalCTAButton>
      </FinalCTASection>
    </Container>
  );
};

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 48px;
  border-bottom: 1px solid #e5e5e5;
`;

const Logo = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #000;
`;

const Nav = styled.nav`
  display: flex;
  gap: 32px;
`;

const NavLink = styled.a`
  font-size: 14px;
  font-weight: 500;
  color: #000;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #666;
  }
`;

const AuthLinks = styled.div`
  display: flex;
  gap: 24px;
`;

const HeroSection = styled.section`
  padding: 120px 48px;
  text-align: center;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, transparent 100%);
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Subtitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #666;
  letter-spacing: 2px;
  margin-bottom: 16px;
  text-transform: uppercase;
`;

const MainTitle = styled.h1`
  font-size: 80px;
  font-weight: 800;
  color: #000;
  margin-bottom: 24px;
  line-height: 1.1;
`;

const Title = styled.h2`
  font-size: 48px;
  font-weight: 800;
  color: #000;
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 32px;
`;

const CTAButton = styled.button`
  background-color: #000;
  color: #fff;
  border: none;
  padding: 14px 32px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const CategoryBar = styled.div`
  background-color: #000;
  color: #fff;
  padding: 20px 48px;
  display: flex;
  gap: 32px;
  overflow-x: auto;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #fff;
    border-radius: 2px;
  }
`;

const Category = styled.div`
  white-space: nowrap;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const DataDrivenSection = styled.section`
  padding: 80px 48px;
  background-color: #f8f8f8;
`;

const DataDrivenContent = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;
  gap: 60px;
`;

const DataDrivenTitle = styled.div`
  flex: 1;
`;

const DataDrivenDescription = styled.p`
  flex: 1;
  font-size: 16px;
  color: #666;
  line-height: 1.8;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  padding: 40px 32px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }
`;

const CardIcon = styled.div`
  font-size: 48px;
  margin-bottom: 24px;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin-bottom: 16px;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.7;
`;

const BeyondTrendSection = styled.section`
  padding: 80px 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ImageBox = styled.div`
  position: relative;
`;

const PlaceholderImage = styled.div`
  background-color: #e0e0e0;
  aspect-ratio: 3 / 4;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const ImageText = styled.div`
  color: #999;
  font-size: 14px;
`;

const AnalysisLabel = styled.div`
  font-size: 12px;
  color: #666;
  font-weight: 600;
`;

const TrendContent = styled.div``;

const TrendTitle = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #000;
`;

const TrendSubtitle = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #666;
  margin-bottom: 24px;
`;

const TrendDescription = styled.p`
  font-size: 15px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 24px;
`;

const BulletList = styled.div`
  list-style: none;
  margin-bottom: 32px;
`;

const BulletItem = styled.li`
  font-size: 14px;
  color: #000;
  margin-bottom: 12px;
  font-weight: 500;
`;

const ViewCommunityButton = styled.button`
  background-color: transparent;
  color: #000;
  border: none;
  padding: 0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const FinalCTASection = styled.section`
  background-color: #000;
  color: #fff;
  padding: 120px 48px;
  text-align: center;
`;

const FinalTitle = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const FinalDescription = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 32px;
`;

const FinalCTAButton = styled.button`
  background-color: #fff;
  color: #000;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);
  }
`;

export default MainPage;
