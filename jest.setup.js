// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"
import { TextEncoder, TextDecoder } from "node:util"
import { webcrypto } from "node:crypto"

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.crypto = webcrypto
