import { OpenloginAdapter, type PrivateKeyProvider } from "@web3auth/openlogin-adapter";

const createOpenloginAdapter = (privateKeyProvider: PrivateKeyProvider) => {
  return new OpenloginAdapter({
    privateKeyProvider,
    adapterSettings: {
      mfaSettings: {
        deviceShareFactor: {
          enable: true,
          priority: 1,
          mandatory: true,
        },
        backUpShareFactor: {
          enable: true,
          priority: 2,
          mandatory: false,
        },
        socialBackupFactor: {
          enable: true,
          priority: 3,
          mandatory: false,
        },
        passwordFactor: {
          enable: true,
          priority: 4,
          mandatory: false,
        },
      },
    },
  });
}

export default createOpenloginAdapter;