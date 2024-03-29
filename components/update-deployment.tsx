import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik"
import * as Yup from "yup"
import {
  Box,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react"
import { useUpdateDeployment } from "../lib/ghostcloud"
import FileUpload from "./file-upload"
import { useDisplayError } from "../helpers/errors"
import Info from "./info"

export interface DeploymentData {
  name: string
  description: string
  domain: string
  memo: string
  file: File | null
}

const UpdateDeploymentModal = ({
  isOpen,
  onClose,
  deploymentName,
  deploymentDescription,
  deploymentDomain,
}: {
  isOpen: boolean
  onClose: () => void
  deploymentName: string
  deploymentDescription: string
  deploymentDomain: string
}) => {
  const mutation = useUpdateDeployment()
  const displayError = useDisplayError()

  const handleSubmit = async (
    values: DeploymentData,
    actions: FormikHelpers<any>,
  ) => {
    actions.setSubmitting(true)

    try {
      await mutation.mutateAsync(values)
      onClose()
    } catch (error) {
      displayError("Error during submission", error as Error)
    } finally {
      actions.setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Deployment</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            name: deploymentName,
            description: deploymentDescription,
            domain: deploymentDomain,
            memo: "",
            file: null,
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .max(12, "Must be 12 characters or less")
              .required("Name is required"),
            description: Yup.string()
              .max(500, "Must be 500 characters or less")
              .required("Description is required"),
            domain: Yup.string().max(253, "Must be 253 characters or less"),
            memo: Yup.string().max(500, "Must be 500 characters or less"),
            file: Yup.mixed()
              .nullable()
              .test(
                "fileSize",
                "File is too large",
                value => value === null || (value as File).size <= 5242880,
              ),
          })}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalBody>
                <FormControl isRequired>
                  <Flex align="center">
                    <FormLabel>Name</FormLabel>
                    <Box ml="auto">
                      <Info id="name" />
                    </Box>
                  </Flex>
                  <Field as={Input} isReadOnly name="name" type="text" />
                  <ErrorMessage name="name" component={Text} />
                </FormControl>

                <FormControl isRequired mt={4}>
                  <Flex align="center">
                    <FormLabel>Description</FormLabel>
                    <Box ml="auto">
                      <Info id="description" />
                    </Box>
                  </Flex>
                  <Field as={Textarea} name="description" type="textarea" />
                  <ErrorMessage name="description" component={Text} />
                </FormControl>

                <FormControl mt={4}>
                  <Flex align="center">
                    <FormLabel>Domain</FormLabel>
                    <Box ml="auto">
                      <Info id="domain" />
                    </Box>
                  </Flex>
                  <Field as={Input} name="domain" type="text" />
                  <ErrorMessage name="domain" component={Text} />
                </FormControl>

                <FormControl mt={4}>
                  <Flex align="center">
                    <FormLabel>Memo</FormLabel>
                    <Box ml="auto">
                      <Info id="memo" />
                    </Box>
                  </Flex>
                  <Field as={Textarea} name="memo" type="textarea" />
                  <ErrorMessage name="memo" component={Text} />
                </FormControl>

                <FormControl mt={4}>
                  <Flex align="center">
                    <FormLabel>File (Max 5MB)</FormLabel>
                    <Box ml="auto">
                      <Info id="file" />
                    </Box>
                  </Flex>
                  <Field name="file" component={FileUpload} />
                  <ErrorMessage name="file" component={Text} />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Submitting"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  )
}

export default UpdateDeploymentModal
