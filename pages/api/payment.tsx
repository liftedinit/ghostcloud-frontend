import crypto from "crypto"
import logger from "../../lib/logger"
import type { NextApiRequest, NextApiResponse } from "next"
import {
  fetchBalance,
  isTokenTransferSuccessful,
  sendTokens,
} from "../../lib/ghostcloud"
import { IncomingHttpHeaders } from "node:http"
import { PaymentStatus } from "../../types/payment/types"
import { getBankAccountAddress } from "../../config/ghostcloud-chain"

const INVALID_BODY = "Invalid request body"
const INVALID_HEADER = "Invalid request header"
const INVALID_METHOD = "Invalid method. Only POST allowed"
const INVALID_KEY = "Invalid notifications key"
const SIGNATURE_MISMATCH = "Signature missmatch"
const INVALID_SIGNATURE_LENGTH = "Invalid signature length"
const INVALID_SIGNATURE_CONTENT =
  "Invalid signature content. Expected hexadecimal characters"
const INVALID_PAYMENT_STATUS = "Invalid payment status"
const INVALID_SIGNATURE_TYPE = "Invalid signature type, expected string"
const INVALID_ORDER_DESCRIPTION_FORMAT = "Invalid order description format"

const SIGNATURE_KEY = "x-nowpayments-sig"
const PAYMENT_STATUS_KEY = "payment_status"
const INVOICE_ID_KEY = "invoice_id"
const PAYMENT_ID_KEY = "payment_id"
const PURCHASE_ID_KEY = "purchase_id"
const ORDER_DESCRIPTION_KEY = "order_description"

type ResponseData = {
  message: string
}

type Header = IncomingHttpHeaders

interface Body {
  [PAYMENT_STATUS_KEY]: keyof typeof PaymentStatus
  [INVOICE_ID_KEY]: string
  [PAYMENT_ID_KEY]: string
  [PURCHASE_ID_KEY]: string
  [ORDER_DESCRIPTION_KEY]: string
}

// Sort an object recursively in alphabetical order by key.
function sortObject(obj: Record<string, any>): Record<string, any> {
  return Object.keys(obj)
    .sort()
    .reduce((result: Record<string, any>, key: string) => {
      result[key] =
        obj[key] && typeof obj[key] === "object"
          ? sortObject(obj[key])
          : obj[key]
      return result
    }, {})
}

// Check if the given fields are present AND non-null in the given object.
function isValid<T extends Record<string, unknown>>(
  data: any,
  fields: (keyof T)[],
): data is T {
  return fields.every(field => field in data && data[field] !== null)
}

// Validate the request header and body.
// Throws an error if the request is invalid.
function validateRequest(header: Header, body: Body) {
  logger.debug("Validating header keys")
  if (!isValid(header, [SIGNATURE_KEY])) {
    throw new Error(INVALID_HEADER)
  }

  logger.debug("Validating body keys")
  if (
    !isValid(body, [
      PAYMENT_STATUS_KEY,
      INVOICE_ID_KEY,
      PAYMENT_ID_KEY,
      PURCHASE_ID_KEY,
      ORDER_DESCRIPTION_KEY,
    ])
  ) {
    throw new Error(INVALID_BODY)
  }

  // The signature is a HMAC-SHA512 hash of the sorted JSON body.
  logger.debug("Validating signature")
  validateSignature(header, body)
}

// Validate the signature of the request.
// Throws an error if the signature is invalid.
function validateSignature(header: Header, body: Body) {
  logger.debug("Sanitizing header signature")
  const signature = sanitizeHeaderSignature(header[SIGNATURE_KEY])
  logger.debug("Signature is sanitized")

  logger.debug("Retrieving notifications key from environment")
  const notificationsKey = process.env.IPN_SECRET_KEY
  if (!notificationsKey) {
    throw new Error(INVALID_KEY)
  }
  logger.debug("Notifications key retrieved")

  // Create a new HMAC object and update it with the sorted JSON string.
  logger.debug("Calculating signature")
  const hmac = crypto.createHmac("sha512", notificationsKey)
  hmac.update(JSON.stringify(sortObject(body)))
  const bodySignature = hmac.digest("hex")

  // Compare the signature from the request header with the signature we calculated.
  if (
    !crypto.timingSafeEqual(Buffer.from(bodySignature), Buffer.from(signature))
  ) {
    throw new Error(SIGNATURE_MISMATCH)
  }
  logger.debug("Signature is valid")
}

// Sanitize the signature from the request header.
// Throws an error if the signature is invalid.
function sanitizeHeaderSignature(signature: any): string {
  logger.debug("Checking signature type")
  if (typeof signature !== "string") {
    throw new Error(INVALID_SIGNATURE_TYPE)
  }
  logger.debug("Signature type is valid")

  // Check that the signature is 128 characters long.
  logger.debug("Checking signature length")
  if (signature.length !== 128) {
    throw new Error(INVALID_SIGNATURE_LENGTH)
  }
  logger.debug("Signature length is valid")

  // Check that the signature only contains hexadecimal characters.
  logger.debug("Checking signature content")
  if (!/^[0-9a-fA-F]+$/.test(signature)) {
    throw new Error(INVALID_SIGNATURE_CONTENT)
  }
  logger.debug("Signature content is valid")

  return signature
}

// Sanitize the payment status from the request body.
// Throws an error if the payment status is invalid.
function sanitizePaymentStatus(
  paymentStatus: keyof typeof PaymentStatus,
): PaymentStatus {
  logger.debug("Checking payment status")
  if (!(paymentStatus in PaymentStatus)) {
    throw new Error(INVALID_PAYMENT_STATUS)
  }
  logger.debug("Payment status is valid")

  return PaymentStatus[paymentStatus]
}

async function verifyTokenTransferAlreadyProcessed(
  address: string,
  invoiceId: number,
  paymentId: number,
  purchaseId: number,
) {
  if (
    await isTokenTransferSuccessful(
      getBankAccountAddress(),
      address,
      invoiceId,
      paymentId,
      purchaseId,
    )
  ) {
    throw new Error("Payment already exists")
  }
}

function getBankAccountKey() {
  // TODO: Get the private key from a Vault instance
  const key = process.env.BANK_ACCOUNT_KEY
  if (!key) {
    throw new Error("Bank account key is not set")
  }
  return key
}

async function performTokenTransfer(
  address: string,
  amount: number,
  invoiceId: number,
  paymentId: number,
  purchaseId: number,
) {
  logger.debug("Sending tokens")
  logger.debug(`Address: ${address}`)
  logger.debug(`Amount: ${amount}`)
  logger.debug(`Invoice ID: ${invoiceId}`)
  logger.debug(`Payment ID: ${paymentId}`)
  logger.debug(`Purchase ID: ${purchaseId}`)

  // TODO: Don't use mnemonic, use a private key instead
  const mnemonic = getBankAccountKey()
  const res = await sendTokens(
    address,
    mnemonic,
    amount,
    invoiceId,
    paymentId,
    purchaseId,
  )
  logger.debug("Tokens sent")
  return res
}

function getTransferAmount() {
  const amount = process.env.TRANSFER_AMOUNT
  if (!amount) {
    throw new Error("Transfer amount is not set")
  }
  const amountNumber = Number(amount)
  if (isNaN(amountNumber)) {
    throw new Error("Transfer amount is not a number")
  }
  return amountNumber
}

function getTransferAmountGasBuffer() {
  const amount = process.env.TRANSFER_AMOUNT_GAS_BUFFER
  if (!amount) {
    throw new Error("Transfer amount gas buffer is not set")
  }
  const amountNumber = Number(amount)
  if (isNaN(amountNumber)) {
    throw new Error("Transfer amount gas buffer is not a number")
  }
  return amountNumber
}

async function checkBankAccountBalance() {
  const balance = await fetchBalance(getBankAccountAddress())
  const amount = Number(balance.amount)
  if (isNaN(amount)) {
    throw new Error("Bank account balance is invalid")
  }
  if (amount + getTransferAmountGasBuffer() < getTransferAmount()) {
    throw new Error("Bank account has insufficient funds")
  }
}

// Process the payment status.
// Throws an error if the payment status is invalid.
async function processPayment(
  status: PaymentStatus,
  invoiceId: number,
  paymentId: number,
  purchaseId: number,
  orderDescription: string,
) {
  logger.info(`Processing payment status: ${status}`)

  // We only implement the case where the payment has finished.
  if (status === PaymentStatus.finished) {
    const match = RegExp(/^Token purchase for (.+)$/).exec(orderDescription)
    if (!match) {
      throw new Error(INVALID_ORDER_DESCRIPTION_FORMAT)
    }
    logger.debug("Order description is valid")
    logger.debug("Verifying payment on chain")
    await verifyTokenTransferAlreadyProcessed(
      match[1],
      invoiceId,
      paymentId,
      purchaseId,
    )
    logger.debug("Token transfer not processed yet")
    logger.debug("Checking bank account balance")
    await checkBankAccountBalance()
    logger.debug("Bank account has sufficient funds")

    logger.debug("Transferring tokens to user wallet")
    const response = await performTokenTransfer(
      match[1],
      getTransferAmount(),
      invoiceId,
      paymentId,
      purchaseId,
    )
    if (!response) {
      throw new Error("Could not transfer tokens")
    }
    logger.debug("Tokens transferred")
    logger.debug(`Token transfer height: ${response.height}`)
    logger.debug(`Token transfer transaction hash: ${response.transactionHash}`)
  } else {
    logger.debug(`Payment status handling for ${status} is unimplemented`)
  }
}

function validateMethod(method: string | undefined) {
  logger.debug("Validating method")
  if (method && method !== "POST") {
    throw new Error(INVALID_METHOD)
  }
  logger.debug("Method is valid")
}

// TODO: implement rate-limiting to this endpoint
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  validateMethod(req.method)

  const header = req.headers
  const body = req.body

  try {
    logger.debug("Validating request")
    validateRequest(header, body)
    logger.debug("Request is valid")
    // At this point we know that the signed request is valid, and we can process it.
    logger.debug("Request is valid, processing payment")
    await processPayment(
      sanitizePaymentStatus(body[PAYMENT_STATUS_KEY]),
      body[INVOICE_ID_KEY],
      body[PAYMENT_ID_KEY],
      body[PURCHASE_ID_KEY],
      body[ORDER_DESCRIPTION_KEY],
    )
    logger.debug("Payment processed")
  } catch (e) {
    logger.error((e as Error).message)
    res.status(400).json({ message: (e as Error).message })
    return
  }

  res.status(200).json({ message: "OK" })
}
