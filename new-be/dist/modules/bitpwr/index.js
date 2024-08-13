import { AccountBitpwr } from './account.bitpwr';
import { AddressBitpwr } from './address.bitpwr';
import { AssetsBitpwr } from './assets.bitpwr';
import Base, { getClassInstance } from './base.bitpwr';
import { SubAccountBitpwr } from './subaccount.bitpwr';
import { TransactionBitpwr } from './transaction.bitpwr';
import { TransferBitpwr } from './transfer.bitpwr';
/* The BitPwr class is a TypeScript class that extends the Base class and initializes the public key,
private key, and base URL, and creates an instance of the AccountBitpwr class. */
class BitPwr extends Base {
    /**
     * The constructor of the BitPwr class initializes properties and creates instances of other classes.
     *
     * @param publicKey A string representing the public key used for authentication and authorization in
     * the BitPwr API. This key is typically provided by the BitPwr service and is unique to each user or
     * application.
     * @param privateKey The `privateKey` parameter is a string that represents the private key used for
     * authentication and encryption in the BitPwr class. It is typically a long string of characters
     * that is kept secret and used to sign transactions and authenticate requests to the BitPwr API.
     * @param baseUrl The `baseUrl` parameter is an optional parameter that represents the base URL of
     * the API endpoint. It is used to specify the base URL for making API requests. If no `baseUrl` is
     * provided, it will default to a predefined value.
     */
    constructor(publicKey, privateKey, baseUrl) {
        /* The `super(publicKey, privateKey, baseUrl);` line is calling the constructor of the `Base`
        class, which `BitPwr` extends. It passes the `publicKey`, `privateKey`, and `baseUrl` parameters
        to the `Base` class constructor, allowing it to initialize those values. This is necessary
        because the `BitPwr` class inherits properties and methods from the `Base` class and needs to
        ensure that those properties are properly initialized. */
        super(publicKey, privateKey, baseUrl);
        this.Base = getClassInstance(publicKey, privateKey, baseUrl);
        this.AccountBitpwr = new AccountBitpwr(this.Base);
        this.AddressBitpwr = new AddressBitpwr(this.Base);
        this.AssetsBitpwr = new AssetsBitpwr(this.Base);
        this.SubAccountBitpwr = new SubAccountBitpwr(this.Base);
        this.TransferBitpwr = new TransferBitpwr(this.Base);
        this.TransactionBitpwr = new TransactionBitpwr(this.Base);
    }
}
export default BitPwr;
//# sourceMappingURL=index.js.map