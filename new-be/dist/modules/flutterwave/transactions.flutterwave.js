class Transactions {
    /**
     * Initializes a new instance of the Payments class.
     *
     * @param arg - An instance of Base.
     */
    constructor(arg) {
        this.rave = arg;
    }
    /**
     * Handles the response from the API request.
     *
     * @param data - The payload for the request.
     * @returns A promise that resolves with the response data.
     */
    async processResponse(path, data, method) {
        try {
            const resp = await this.rave.request(`v3/${path}`, data, method);
            return resp.data;
        }
        catch (error) {
            // Handle error here if needed
            throw new Error(`${error}`);
        }
    }
    /**
     * This method helps query the final status of a transaction.
     * It can be used to check transactions of all payment types after they have been attempted.
     *
     * @param data - The payload for creating a payment.
     * @returns A promise that resolves with the payment response.
     */
    async verify(data) {
        return this.processResponse(`transactions/${data.id}/verify`, data, 'GET');
    }
}
export default Transactions;
//# sourceMappingURL=transactions.flutterwave.js.map