# Plan: Contact Form Email Integration

## Requirements Summary
Add email sending functionality to ContactModal form using react-email for templates and Resend for delivery. Emails should be sent to hello@setproduct.com when users submit the contact form.

## RALPLAN-DR Summary

### Principles (4)
1. **Server-side only**: API keys must never be exposed to the client
2. **User feedback**: Form must show loading/success/error states
3. **Minimal dependencies**: Use only react-email and resend as specified
4. **Type safety**: Full TypeScript coverage for email payloads

### Decision Drivers (top 3)
1. **Security**: Resend API key must stay server-side (Next.js API route)
2. **User experience**: Clear feedback on submission status
3. **Maintainability**: Clean separation between template and send logic

### Viable Options

#### Option A: Next.js API Route + react-email + resend (Recommended)
**Approach**: Create `/api/contact` endpoint that uses resend to send emails with react-email template

**Pros**:
- API key stays server-side
- Standard Next.js pattern
- Type-safe email templates
- Easy to test and maintain

**Cons**:
- Requires environment variable setup

#### Option B: Server Action (Next.js 14+)
**Approach**: Use React Server Actions for form submission

**Pros**:
- No separate API route needed
- Progressive enhancement

**Cons**:
- Requires "use server" directive
- Less explicit request/response flow
- Pages Router doesn't fully support Server Actions

**Invalidation rationale for Option B**: The project uses Next.js Pages Router (evident from `pages/` directory structure). Server Actions are primarily designed for App Router. Option A is the correct pattern for Pages Router.

## Acceptance Criteria
1. [ ] `resend` and `react-email` packages installed
2. [ ] Email template component exists at `emails/ContactEmail.tsx`
3. [ ] API route exists at `pages/api/contact.ts`
4. [ ] ContactModal calls API on submit with email and message
5. [ ] Form shows loading state during submission
6. [ ] Form shows success message on successful send
7. [ ] Form shows error message on failure
8. [ ] Email arrives at hello@setproduct.com with sender email and message
9. [ ] RESEND_API_KEY environment variable documented
10. [ ] TypeScript compiles with no errors

## Implementation Steps

### Step 1: Install dependencies
```bash
npm install resend @react-email/components
```

### Step 2: Create email template
**File**: `emails/ContactEmail.tsx`
```tsx
import { Html, Head, Body, Container, Text, Heading } from '@react-email/components';

type ContactEmailProps = {
  email: string;
  message: string;
};

export default function ContactEmail({ email, message }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Heading>New Contact Form Submission</Heading>
          <Text><strong>From:</strong> {email}</Text>
          <Text><strong>Message:</strong></Text>
          <Text>{message}</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

### Step 3: Create API route
**File**: `pages/api/contact.ts`
```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import ContactEmail from '../../emails/ContactEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required' });
  }

  try {
    await resend.emails.send({
      from: 'Setproduct Contact <contact@setproduct.com>',
      to: 'hello@setproduct.com',
      subject: `Contact form: ${email}`,
      react: ContactEmail({ email, message }),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
```

### Step 4: Update ContactModal
**File**: `components/modals/ContactModal.tsx`
- Add loading state (`isSubmitting`)
- Add error state (`errorMessage`)
- Replace mock submit with fetch to `/api/contact`
- Show loading spinner/text during submission
- Show error message if request fails

### Step 5: Environment setup
**File**: `.env.local` (create if not exists)
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**File**: `.env.example` (document for team)
```
RESEND_API_KEY=your_resend_api_key_here
```

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Missing API key in production | Add startup check, fail fast with clear error |
| Email delivery failures | Catch errors, show user-friendly message, log for debugging |
| Spam submissions | Future: add rate limiting or CAPTCHA (out of scope for MVP) |
| Invalid email format | HTML5 email validation + server-side check |

## Verification Steps
1. Run `npm run build` — TypeScript compiles without errors
2. Start dev server, open modal, submit form — see loading state
3. Check Resend dashboard — email appears in sent list
4. Check hello@setproduct.com inbox — email received with correct content
5. Test error handling: remove API key, submit — error message shown

## ADR

**Decision**: Use Next.js API Route with Resend + react-email

**Drivers**: Security (server-side API key), Pages Router compatibility, explicit request flow

**Alternatives considered**: Server Actions (rejected: Pages Router incompatibility)

**Why chosen**: Standard pattern for Pages Router, clear separation of concerns, type-safe templates

**Consequences**: Requires RESEND_API_KEY env var; email template is separate component

**Follow-ups**: Consider rate limiting for spam prevention in future iteration
