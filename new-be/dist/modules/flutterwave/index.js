import VirtualAccount from './accounts.flutterwave';
import Base, { getClassInstance } from './base.flutterwave';
import Bills from './bills.flutterwave';
import Payments from './payments.flutterwave';
import SubVirtualAccount from './subaccounts.flutterwave';
import Transactions from './transactions.flutterwave';
import Transfers from './transfers.flutterwave';
class Flutterwave extends Base {
    /**
     * Initializes a new instance of the Bills class.
     *
     * @param arg - An instance of FlutterwaveBase.
     */
    constructor(publicKey, secretKey, baseUrl) {
        super(publicKey, secretKey, baseUrl);
        this.Base = getClassInstance(publicKey, secretKey, baseUrl);
        this.Bills = new Bills(this.Base);
        this.Payments = new Payments(this.Base);
        this.Transactions = new Transactions(this.Base);
        this.VirtualAccount = new VirtualAccount(this.Base);
        this.Transfers = new Transfers(this.Base);
        this.SubVirtualAccount = new SubVirtualAccount(this.Base);
    }
}
export default Flutterwave;
export { Bills, Payments, Transactions };
//# sourceMappingURL=index.js.map