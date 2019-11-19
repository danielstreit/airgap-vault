import { Injectable } from '@angular/core'
import { AccountShareResponse, AirGapWallet, IACMessageDefinitionObject, IACMessageType, Serializer } from 'airgap-coin-lib'

function serializedDataToUrlString(data: string[], host: string = 'airgap-wallet://', parameter: string = 'd'): string {
  return `${host}?${parameter}=${data.join(',')}`
}

@Injectable({
  providedIn: 'root'
})
export class ShareUrlService {
  constructor() {
    //
  }

  public async generateShareURL(wallet: AirGapWallet): Promise<string> {
    const serializer: Serializer = new Serializer()

    const accountShareResponse: AccountShareResponse = {
      publicKey: wallet.publicKey,
      isExtendedPublicKey: wallet.isExtendedPublicKey,
      derivationPath: wallet.derivationPath
    }

    const deserializedTxSigningRequest: IACMessageDefinitionObject = {
      protocol: wallet.protocolIdentifier,
      type: IACMessageType.AccountShareResponse,
      payload: accountShareResponse
    }

    const serializedTx: string[] = await serializer.serialize([deserializedTxSigningRequest], 10)

    return serializedDataToUrlString(serializedTx, 'airgap-wallet://')
  }
}
