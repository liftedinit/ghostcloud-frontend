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
import UpdateDeploymentModal from "./update-deployment"

const Dashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedDeploymentName, setSelectedDeploymentName] =
    useState<string>("")
  const [selectedDeploymentDescription, setSelectedDeploymentDescription] =
    useState<string>("")
  const [selectedDeploymentDomain, setSelectedDeploymentDomain] =
    useState<string>("")
  const { data: metas, isLoading: isMetaLoading } = useFetchMetas()

  const handleUpdate = (name: string, description: string, domain: string) => {
    setSelectedDeploymentName(name)
    setSelectedDeploymentDescription(description)
    setSelectedDeploymentDomain(domain)
    setIsUpdateModalOpen(true)
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
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            float="right"
            mb={2}
          >
            Create Deployment
          </Button>
          <CreateDeploymentModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
          <UpdateDeploymentModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            deploymentName={selectedDeploymentName}
            deploymentDescription={selectedDeploymentDescription}
            deploymentDomain={selectedDeploymentDomain}
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
                      onClick={() =>
                        handleUpdate(meta.name, meta.description, meta.domain)
                      }
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
