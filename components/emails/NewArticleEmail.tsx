import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Img,
  Tailwind
} from '@react-email/components';

interface NewArticleEmailProps {
  title: string;
  excerpt: string;
  articleUrl: string;
  imageUrl?: string;
  authorName?: string;
}

export const NewArticleEmail = ({
  title,
  excerpt,
  articleUrl,
  imageUrl,
  authorName = 'FizikHub Ekibi',
}: NewArticleEmailProps) => {
  const previewText = `${title} başlıklı yeni makale FizikHub'da yayında!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              {/* If you have a logo, you can use it here */}
              <Text className="text-[#000000] text-[24px] font-bold text-center p-0 my-[30px] mx-0">
                FizikHub
              </Text>
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Yeni Makale Yayında!
            </Heading>
            
            {imageUrl && (
              <Section className="w-full mb-[24px]">
                <Img
                  src={imageUrl}
                  alt={title}
                  width="100%"
                  height="200"
                  className="object-cover rounded-md"
                />
              </Section>
            )}

            <Text className="text-black text-[18px] font-semibold leading-[24px]">
              {title}
            </Text>

            <Text className="text-gray-600 text-[14px] leading-[24px]">
              {excerpt}
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Link
                href={articleUrl}
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
              >
                Makaleyi Oku
              </Link>
            </Section>

            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Bu e-postayı FizikHub bildirim ayarlarınız açık olduğu için aldınız.
              Bildirimleri kapatmak için profil ayarlarınızı ziyaret edebilirsiniz.
            </Text>
            
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Sevgilerle,<br />
              {authorName}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewArticleEmail;
