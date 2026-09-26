import config from '@payload-config'
import { getPayload } from 'payload'

/** Singleton Payload local API client (cached by Payload across calls). */
export const getPayloadClient = () => getPayload({ config })
