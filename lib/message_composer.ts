import { cosmos, ghostcloud } from "@liftedinit/gcjs"
import { GHOSTCLOUD_DENOM } from "../config/ghostcloud-chain"
import { DeploymentData } from "../components/create-deployment"
import { fileToArrayBuffer } from "../helpers/files"

async function createPayload(file: File | null) {
  if (!file) {
    return
  }
  const buffer = await fileToArrayBuffer(file)
  return ghostcloud.ghostcloud.Payload.fromPartial({
    archive: ghostcloud.ghostcloud.Archive.fromPartial({
      type: ghostcloud.ghostcloud.ArchiveType.Zip,
      content: buffer,
    }),
  })
}

export async function createCreateDeploymentMsg(
  data: DeploymentData,
  creator: string,
) {
  const payload = await createPayload(data.file)
  const { createDeployment } = ghostcloud.ghostcloud.MessageComposer.withTypeUrl
  return createDeployment({
    meta: {
      creator,
      name: data.name,
      description: data.description,
      domain: data.domain,
    },
    payload,
  })
}

export async function createUpdateDeploymentMsg(
  data: DeploymentData,
  creator: string,
) {
  const payload = await createPayload(data.file)
  const { updateDeployment } = ghostcloud.ghostcloud.MessageComposer.withTypeUrl
  return updateDeployment({
    meta: {
      creator,
      name: data.name,
      description: data.description,
      domain: data.domain,
    },
    payload,
  })
}

export function createRemoveDeploymentMsg(name: string, creator: string) {
  const { removeDeployment } = ghostcloud.ghostcloud.MessageComposer.withTypeUrl
  return removeDeployment({
    creator,
    name: name,
  })
}

export function createSendMsg(from: string, to: string, amount: string) {
  const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl
  return send({
    fromAddress: from,
    toAddress: to,
    amount: [
      {
        denom: GHOSTCLOUD_DENOM,
        amount: amount,
      },
    ],
  })
}
