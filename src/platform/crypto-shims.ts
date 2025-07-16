import { install } from 'react-native-quick-crypto'
install()

/**
 * Override crypto functions in ethers.js to use react-native-quick-crypto
 * https://docs.ethers.org/v6/cookbook/react-native/
 */
import { ethers } from 'ethers'

import crypto from 'react-native-quick-crypto'

ethers.randomBytes.register((length) => {
  return new Uint8Array(crypto.randomBytes(length))
})

ethers.computeHmac.register((algo, key, data) => {
  return crypto.createHmac(algo, key).update(data).digest()
})

// @ts-ignore
ethers.pbkdf2.register((passwd, salt, iter, keylen, algo) => {
  return crypto.pbkdf2Sync(passwd, salt, iter, keylen, algo)
})

ethers.sha256.register((data) => {
  // @ts-ignore
  return crypto.createHash('sha256').update(data).digest()
})

ethers.sha512.register((data) => {
  // @ts-ignore
  return crypto.createHash('sha512').update(data).digest()
})
