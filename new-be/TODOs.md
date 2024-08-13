# TODOs (Design for pay paddy project what needs to be integrated)

## Core Services

- Authorization/Authentication Service (Registration First Name, Last Name, Email and password | Login => Email and password) [Completed]

- KYC Service (the multiple stage => Different Levels of verification | Manual and automatic verification | Integrated into Withdrawal system to limit user Withdrawals and Deposits) [basically three levels - Tier 1, Tier 2, Tier 3] [Almost Complete]

- Cryptocurrency Exchange Service (Minimized, customer to business model, not more than 5 cryptocurrencies | Instant exchange model | Custodian or Non Custodian model - you would choose) <would this be done from scratch OR and API can be used?>

- Deposit and Withdrawal Service (Cryptocurrency, local currency | Naira Deposit and Withdrawal will cost an additional fee because you would need to provide the provider to be implemented, e.g paga, providus e.t.c | Ability to separate Withdrawal from Deposits - security)

- Virtual Card Service (USD and local currency (NGN) | You would provide the provider to be implemented, e.g interswitch, e.t.c)

- Bills Pay and Airtime service (You'd also provide the provider to be implemented e.g flutterwave e.t.c)

check for exchange liquidity (crypto exchange orders)

- [] Add Withdrawal and deposit fee to wallet and transfers
- [] Giftcard Exchange Service (Minimized, customer to business model)
- [x] Currency Exchange
- [x] Deposit and Withdrawal Service
- [x] Authorization/Authentication Service for user
- [x] Admin should be able to set asset price rate(percentage) for the exchanges using the standard market price + percentage (market price difference - i.e the price that would be quoted for the user)

## Core Services again

- Authorization/Authentication Service (Registration First Name, Last Name, Email and password | Login => Email and password) [Completed]

- KYC Service (the multiple stage => Different Levels of verification | Manual and automatic verification | Integrated into Withdrawal system to limit user Withdrawals and Deposits) [basically three levels - Tier 1, Tier 2, Tier 3] [Almost Complete]

- Cryptocurrency Exchange Service (Minimized, customer to business model, not more than 5 cryptocurrencies | Instant exchange model | Custodian or Non Custodian model - you would choose) <would this be done from scratch OR and API can be used?>

- Deposit and Withdrawal Service (Cryptocurrency, local currency | Naira Deposit and Withdrawal will cost an additional fee because you would need to provide the provider to be implemented, e.g paga, providus e.t.c | Ability to separate Withdrawal from Deposits - security)

- Virtual Card Service (USD and local currency (NGN) | You would provide the provider to be implemented, e.g interswitch, e.t.c)

- Bills Pay and Airtime service (You'd also provide the provider to be implemented e.g flutterwave e.t.c)
- Giftcard Exchange Service (Minimized, customer to business model)

## Staff roles and Permissions(Platform Settings)

- Accountant will only be doing or. Cross checking payments on d platform
- Super will have the role of all 4 staff
- Crypto traders/Traders are employees who will be receiving coins and gift cards from suppliers
- Reconcillers are staff that come to sort dispute on trade if there is any

I would need the definition of roles i.e what each role does

PS:
Admin should be able to set the USD/local currency(NGN) price rate for the exchanges
Admin should be able to set asset price rate(percentage) for the exchanges using the standard market price + percentage (market price difference - i.e the price that would be quoted for the user)
Admin should be able to set the price chinese rmb rate for the giftcard exchanges
Admin should be able to set profit margin for the giftcard exchanges
Transaction Details (Know who handled a trade) (Giftcard)
Transaction Transfer (Ability to transfer trade btw staffs) (Giftcard)
Ability to set profit margin as well chinese rmb rates
Notifications (Email, SMS and Push notifications) | [Live Trade chat notification => (provides updates on trades or trading opportunities as they happen, allowing traders to receive immediate information about price movements, market news, or specific trade executions.)]

Others:
Panda exchange
Obiex exchange
