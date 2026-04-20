import { Html, Head, Body, Container, Text, Heading, Hr } from "@react-email/components";

type ContactEmailProps = {
  email: string;
  message: string;
};

export default function ContactEmail({ email, message }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4", padding: "20px" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px" }}>
          <Heading style={{ color: "#333" }}>New Contact Form Submission</Heading>
          <Hr />
          <Text style={{ fontSize: "16px" }}>
            <strong>From:</strong> {email}
          </Text>
          <Text style={{ fontSize: "16px" }}>
            <strong>Message:</strong>
          </Text>
          <Text style={{ fontSize: "14px", whiteSpace: "pre-wrap" }}>{message}</Text>
        </Container>
      </Body>
    </Html>
  );
}
