import React from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
  FormLabel,
  useColorModeValue,
} from "@chakra-ui/react"
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik"
import * as Yup from "yup"
import { useRemoveDeployment } from "../lib/ghostcloud"
import { useDisplayError } from "../helpers/errors"

const RemoveDeploymentModal = ({
  isOpen,
  onClose,
  deploymentName,
}: {
  isOpen: boolean
  onClose: () => void
  deploymentName: string
}) => {
  const mutation = useRemoveDeployment()
  const displayError = useDisplayError()
  const altTextColor = useColorModeValue(
    "modes.light.altText",
    "modes.dark.altText",
  )
  const handleSubmit = async (
    values: { confirmationField: string },
    actions: FormikHelpers<any>,
  ) => {
    actions.setSubmitting(true)

    try {
      await mutation.mutateAsync(values.confirmationField)
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
        <ModalHeader>Are You Sure?</ModalHeader>
        <Formik
          initialValues={{ confirmationField: "" }}
          validationSchema={Yup.object().shape({
            confirmationField: Yup.string()
              .required("Required")
              .oneOf(
                [deploymentName],
                "You must enter the correct value to proceed",
              ),
          })}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalBody>
                <FormLabel></FormLabel>
                <FormLabel>
                  Enter the deployment name to confirm removal.
                </FormLabel>
                <FormLabel color={altTextColor}>{deploymentName}</FormLabel>
                <Field
                  as={Input}
                  name="confirmationField"
                  placeholder={deploymentName}
                />
                <ErrorMessage name="confirmationField" />
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  colorScheme="blue"
                  mr={3}
                  isLoading={isSubmitting}
                  loadingText="Submitting"
                  disabled={isSubmitting}
                >
                  Confirm
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  )
}

export default RemoveDeploymentModal
