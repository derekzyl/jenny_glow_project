class Payments {
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
     * Initiates a create payment.
     *
     * @param data - The payload for creating a payment.
     * @returns A promise that resolves with the payment response.
     */
    async createPayment(data) {
        return this.processResponse('payments', data, 'POST');
    }
}
export default Payments;
//# sourceMappingURL=payments.flutterwave.js.map