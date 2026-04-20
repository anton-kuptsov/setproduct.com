import { Html, Head, Body, Container, Text, Heading, Hr } from "@react-email/components";

type SubscribeEmailProps = {
  email: string;
};

export default function SubscribeEmail({ email }: SubscribeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4", padding: "20px" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px" }}>
          <Heading style={{ color: "#333" }}>New Newsletter Subscription</Heading>
          <Hr />
          <Text style={{ fontSize: "16px" }}>
            <strong>Email:</strong> {email}
          </Text>
          <Text style={{ fontSize: "14px", color: "#666" }}>
            This user has subscribed to the Setproduct newsletter.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
