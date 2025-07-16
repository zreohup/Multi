import crypto from 'crypto'
jest.mock('react-native-quick-crypto', () => require('crypto'))
import {
  decodeLegacyData,
  SecuredDataFile,
  SerializedDataFile,
  LegacyDataPasswordError,
  LegacyDataFormatError,
  LegacyDataCorruptedError,
} from './legacyData'

describe('decodeLegacyData', () => {
  it('decodes encrypted file', () => {
    const password = 'test-password'
    const data: SerializedDataFile = { version: '1.0', data: { hello: 'world' } }
    const salt = crypto.randomBytes(32)
    const key = crypto.pbkdf2Sync(Buffer.from(password, 'utf8'), salt, 100000, 32, 'sha256')
    const iv = crypto.randomBytes(12)
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
    const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()])
    const tag = cipher.getAuthTag()
    const combined = Buffer.concat([iv, encrypted, tag])
    const file: SecuredDataFile = {
      version: '1.0',
      algo: 'aes-256-gcm',
      salt: salt.toString('base64'),
      rounds: 100000,
      data: combined.toString('base64'),
    }

    const decoded = decodeLegacyData(file, password)
    expect(decoded).toEqual(data)
  })

  it('throws LegacyDataFormatError for unsupported version', () => {
    const file = {
      version: '2.0',
      algo: 'aes-256-gcm',
      salt: 'dGVzdC1zYWx0',
      rounds: 100000,
      data: 'dGVzdC1kYXRh',
    } as unknown as SecuredDataFile

    expect(() => decodeLegacyData(file, 'password')).toThrow(LegacyDataFormatError)
  })

  it('throws LegacyDataFormatError for unsupported algorithm', () => {
    const file = {
      version: '1.0',
      algo: 'aes-128-cbc',
      salt: 'dGVzdC1zYWx0',
      rounds: 100000,
      data: 'dGVzdC1kYXRh',
    } as unknown as SecuredDataFile

    expect(() => decodeLegacyData(file, 'password')).toThrow(LegacyDataFormatError)
  })

  it('throws LegacyDataPasswordError for wrong password', () => {
    const password = 'correct-password'
    const wrongPassword = 'wrong-password'
    const data: SerializedDataFile = { version: '1.0', data: { hello: 'world' } }
    const salt = crypto.randomBytes(32)
    const key = crypto.pbkdf2Sync(Buffer.from(password, 'utf8'), salt, 100000, 32, 'sha256')
    const iv = crypto.randomBytes(12)
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
    const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final()])
    const tag = cipher.getAuthTag()
    const combined = Buffer.concat([iv, encrypted, tag])
    const file: SecuredDataFile = {
      version: '1.0',
      algo: 'aes-256-gcm',
      salt: salt.toString('base64'),
      rounds: 100000,
      data: combined.toString('base64'),
    }

    expect(() => decodeLegacyData(file, wrongPassword)).toThrow(LegacyDataPasswordError)
  })

  it('throws LegacyDataCorruptedError for invalid JSON after successful decryption', () => {
    const password = 'test-password'
    const invalidJsonData = 'invalid json content'
    const salt = crypto.randomBytes(32)
    const key = crypto.pbkdf2Sync(Buffer.from(password, 'utf8'), salt, 100000, 32, 'sha256')
    const iv = crypto.randomBytes(12)
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
    const encrypted = Buffer.concat([cipher.update(invalidJsonData, 'utf8'), cipher.final()])
    const tag = cipher.getAuthTag()
    const combined = Buffer.concat([iv, encrypted, tag])
    const file: SecuredDataFile = {
      version: '1.0',
      algo: 'aes-256-gcm',
      salt: salt.toString('base64'),
      rounds: 100000,
      data: combined.toString('base64'),
    }

    expect(() => decodeLegacyData(file, password)).toThrow(LegacyDataCorruptedError)
  })

  it('throws LegacyDataFormatError for invalid base64 data', () => {
    const file: SecuredDataFile = {
      version: '1.0',
      algo: 'aes-256-gcm',
      salt: 'dGVzdC1zYWx0',
      rounds: 100000,
      data: 'invalid base64!@#$%',
    }

    expect(() => decodeLegacyData(file, 'password')).toThrow(LegacyDataFormatError)
  })
})
