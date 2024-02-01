import { Box, Container, Heading, Text } from "@chakra-ui/react"

export function TermsOfService() {
  return (
    <Container maxW="4xl">
      <Box py={10} px={6}>
        <Heading as="h1" size="xl" mt={6} mb={5}>
          Terms Of Service
        </Heading>
        <Text>
          Welcome to GhostCloud (&quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;). By accessing or using our website or application
          (the &quot;Service&quot;), you agree to be bound by these Terms of
          Service (&quot;Terms&quot;). If you disagree with any part of these
          Terms, please refrain from using our Service.
        </Text>
        <Heading as="h2" size="md" mt={8} mb={2}>
          Use of the Service
        </Heading>
        <Text>
          The Service is designed predominantly for informational and personal
          use. Engaging in illegal, unauthorized, or prohibited activities is
          strictly forbidden while using the Service.
        </Text>
        <Heading as="h2" size="md" mt={8} mb={2}>
          User Accounts
        </Heading>
        <Text>
          Creating a user account may be necessary to access specific features
          or areas of the Service. You are responsible for maintaining the
          confidentiality of your account information and bear full
          responsibility for any and all activities conducted through your
          account.
        </Text>
        <Heading as="h2" size="md" mt={8} mb={2}>
          Intellectual Property
        </Heading>
        <Text mb={4}>
          While the Service, encompassing text, graphics, images, logos,
          trademarks, and software, remains the property of GhostCloud and its
          licensors, protected by applicable intellectual property laws, any
          content, data, or intellectual property you provide or create
          (&quot;User Content&quot;) remains solely yours. You retain all rights
          and intellectual property interests in your User Content, and
          GhostCloud claims no ownership, right, title, or interest in any User
          Content you create, upload, or share on or through the Service.
        </Text>
        <Text mb={4}>
          You grant GhostCloud a limited, non-exclusive, royalty-free license to
          use, host, and display your User Content solely for the purpose of
          providing, improving, and developing the Service, subject to these
          Terms.
        </Text>
        <Text mb={4}>
          Prior written consent from us is required should you wish to use,
          reproduce, modify, distribute, or display any portion of the Service,
          excluding your User Content.
        </Text>
        <Heading as="h2" size="md" mt={8} mb={2}>
          Disclaimer of Warranties
        </Heading>
        <Text>
          The Service is provided &quot;as is&quot; and &quot;as
          available&quot;, devoid of any warranties, express, or implied. We
          neither assure uninterrupted, error-free, nor secure utilization of
          the Service. Your access and use of the Service are at your own risk.
        </Text>
        <Heading as="h2" size="md" mt={8} mb={2}>
          Limitation of Liability
        </Heading>
        <Text>
          GhostCloud shall not be held liable for any indirect, incidental,
          special, consequential, or punitive damages arising out of or related
          to your use of the Service or these Terms.
        </Text>
        <Heading as="h2" size="md" mt={8} mb={2}>
          Governing Law
        </Heading>
        <Text>
          These Terms are governed by and constructed in compliance with
          applicable law.
        </Text>
        <Heading as="h2" size="md" mt={8} mb={2}>
          Changes to these Terms
        </Heading>
        <Text>
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time without prior notice. Continuing to access or
          use our Service after those revisions become effective, you agree to
          be bound by the revised terms.
        </Text>
        <Heading as="h2" size="md" mt={8} mb={2}>
          Contact Us
        </Heading>
        <Text>
          If you have any questions or concerns about these Terms, please
          contact us at{" "}
          <a href="mailto:ghostcloud@liftedinit.org">
            ghostcloud@liftedinit.org
          </a>
        </Text>
      </Box>
    </Container>
  )
}

export default TermsOfService
