// Before you can run this you must deploy the Livepeer protocol and Balancer factories

const LivepeerStaker = artifacts.require("LivepeerStaker")
const ERC20 = artifacts.require("ERC20")
const BPOOL = artifacts.require("IBPool")
module.exports = function(callback) {
    (async function() {
        try {
            const accounts = await web3.eth.getAccounts()
            const livepeerStaker = await LivepeerStaker.deployed()

            console.log("Initial Share Price:", web3.utils.fromWei(await livepeerStaker.sharePrice()).toString())

            const lptAddress = await livepeerStaker.token()
            const tenderLptAddress = await livepeerStaker.tenderToken()

            const lpt = await ERC20.at(lptAddress)
            const tenderLpt = await ERC20.at(tenderLptAddress)

            const deposit = web3.utils.toWei("5000")

            console.log("===== Deposit =====")
            console.log("LPT Balance Before: ", web3.utils.fromWei(await lpt.balanceOf(accounts[0])))
            console.log("tLPT Balance Before: ", web3.utils.fromWei(await tenderLpt.balanceOf(accounts[0])))

            await lpt.approve(livepeerStaker.address, deposit)
            await livepeerStaker.deposit(deposit)

            console.log("LPT Balance After Deposit: ", web3.utils.fromWei(await lpt.balanceOf(accounts[0])))
            console.log("tLPT Balance After Deposit: ", web3.utils.fromWei(await tenderLpt.balanceOf(accounts[0])))

            // console.log("==== Withdraw ====")
            // await tenderLpt.approve(livepeerStaker.address, deposit)
            // await livepeerStaker.withdraw(deposit)
            // console.log("LPT Balance After Withdraw: ", web3.utils.fromWei(await lpt.balanceOf(accounts[0])))
            // console.log("tLPT Balance After Withdraw: ", web3.utils.fromWei(await tenderLpt.balanceOf(accounts[0]))) 

            const bpool = (await livepeerStaker.balancer()).pool
            const pool = await BPOOL.at(bpool)
            const spotPrice = await pool.getSpotPrice(lptAddress, tenderLptAddress)

            console.log("After Share Price:", web3.utils.fromWei(await livepeerStaker.sharePrice()).toString())
            console.log("SpotPrice:", web3.utils.fromWei(spotPrice))
            callback(null)
        } catch (err) {
            callback(err)
        }
    }())
}