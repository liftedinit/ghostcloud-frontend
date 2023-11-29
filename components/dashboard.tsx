import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  IconButton,
  Spinner,
} from "@chakra-ui/react"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { useFetchMetas } from "../lib/ghostcloud"
import { useState } from "react"
import CreateDeploymentModal from "./create-deployment"

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: metas, isLoading: isMetaLoading } = useFetchMetas()

  const handleUpdate = (name: string) => {
    // Logic for Update
    console.log("Update", name)
  }

  const handleRemove = (name: string) => {
    // Logic for Remove
    console.log("Remove", name)
  }

  return (
    <Box>
      {isMetaLoading ? <Spinner /> : null}
      {metas ? (
        <>
          <Button onClick={() => setIsModalOpen(true)} float="right" mb={2}>
            Create Deployment
          </Button>
          <CreateDeploymentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Domain</Th>
                <Th>URL</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {metas.meta.map((meta, index) => (
                <Tr key={index}>
                  <Td>{meta.name}</Td>
                  <Td>{meta.description}</Td>
                  <Td>{meta.domain}</Td>
                  {/*<Td><Link href={deployment.url} isExternal>{deployment.url}</Link></Td>*/}
                  <Td>TODO URL</Td>
                  <Td>
                    <IconButton
                      onClick={() => handleUpdate(meta.name)}
                      aria-label="Update"
                      icon={<EditIcon />}
                      size="sm"
                      mr={2}
                    >
                      Update
                    </IconButton>
                    <IconButton
                      onClick={() => handleRemove(meta.name)}
                      aria-label="Remove"
                      icon={<DeleteIcon />}
                      size="sm"
                    >
                      Remove
                    </IconButton>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      ) : (
        <div>Error fetching deployments. Is the backend online?</div>
      )}
    </Box>
  )
}

export default Dashboard
