import { FieldProps, useFormikContext } from "formik"
import { useDropzone } from "react-dropzone"
import { Flex, Icon, Text, useTheme } from "@chakra-ui/react"
import { BiSolidCloudUpload } from "react-icons/bi"
import { BsFileEarmarkFill } from "react-icons/bs"

const FileUpload = ({ field }: FieldProps) => {
  const { setFieldValue } = useFormikContext()
  const theme = useTheme()
  const onDrop = (acceptedFiles: File[]) => {
    setFieldValue(field.name, acceptedFiles[0]).catch((err: any) =>
      // TODO: Handle error
      console.log(err),
    )
  }
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: { "application/zip": [] },
    onDrop,
  })

  return (
    <Flex
      {...getRootProps()}
      justify="center"
      align="center"
      direction="column"
      p={4}
      mb={2}
      sx={{
        borderWidth: 1,
        borderRadius: 6,
        cursor: "pointer",
        height: 100,
      }}
    >
      {acceptedFiles.length ? (
        <Flex {...getRootProps()} justify="center" align="center">
          <Icon
            as={BsFileEarmarkFill}
            boxSize={6}
            color={theme.colors.gray[500]}
            mr={2}
          />
          <Text align="center">{acceptedFiles[0].name}</Text>
        </Flex>
      ) : (
        <>
          <Icon
            as={BiSolidCloudUpload}
            boxSize={10}
            color={theme.colors.gray[500]}
            mb={2}
          />
          <Text align="center">
            Drag and drop file here, or click to select file
          </Text>
        </>
      )}

      <input {...getInputProps()} />
    </Flex>
  )
}

export default FileUpload
