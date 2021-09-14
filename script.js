let sampleMinerAddress = "0x239bb422Cc8254b64838f396555C64c8cB68dcf7"
let sampleReportedHashrate = 31.3
let sampleHashLosses = 2.75 //in percent
let sampleDailyElectrictyCost = 0.7955697024000000 //sgd
let sampleMiningBeganTimestamp = "2021-04-24T10:52:00+08:00"
let sampleInitialCost = 0
let sampleBreaksFromMining = 2.93 //in days

const varToString = varObj => Object.keys(varObj)[0]

function getEtherPrice() {
	//for ETH to SGD
	let apiUrl = "https://api.coinbase.com/v2/exchange-rates?currency=sgd"
	return new Promise(resolve => {
		axios
		.get(apiUrl)
		.then(response => {
			// console.log(response.data.data)
			resolve(response.data.data.rates.ETH**-1)
		})
		.catch(error => {
			console.error(error)
			resolve("failed to get ETH-SGD")
		});
	});
}

function getethWalletInfo(minerAddress){
	// let apiUrl = "https://api.ethplorer.io/getAddressInfo/" + minerAddress + "?apiKey=freekey"
	let apiUrl = "https://api.etherscan.io/api?module=account&action=balance&address=" + minerAddress + "&tag=latest&apikey=SZD4DD5Q6C6R8M3FP88IG9CWRMDZVQR5XA"
	// console.log(apiUrl)
	return new Promise(resolve => {
		axios
		.get(apiUrl)
		.then(response => {
			// console.log(response.data.data)

			resolve(response.data.result/10**18)
		})
		.catch(error => {
			console.error(error)
			// resolve(-999999999)
		});
	});	
}

function getEthermineDashboard(minerAddress) {
	let apiUrl = "https://api.ethermine.org/miner/" + minerAddress + "/dashboard"
	return new Promise(resolve => {
		axios
		.get(apiUrl)
		.then(response => {
			// console.log(response.data.data)
			// console.log(response.data.data.currentStatistics.unpaid);
			resolve(response.data.data)
		})
		.catch(error => console.error(error));
	});
}

function getEthermineCurrentStats(minerAddress) {
	let apiUrl = "https://api.ethermine.org/miner/" + minerAddress + "/currentStats"
	return new Promise(resolve => {
		axios
		.get(apiUrl)
		.then(response => {
			// console.log(response.data.data)
			resolve(response.data.data)
		})
		.catch(error => console.error(error));
	});
}

function getEthermineWorkerInfo(minerAddress) {
	let apiUrl = "https://api.ethermine.org/miner/" + minerAddress + "/workers"
	return new Promise(resolve => {
		axios
		.get(apiUrl)
		.then(response => {
			// console.log(response.data.data)
			resolve(response.data.data)
		})
		.catch(error => console.error(error));
	});
}

function showSample(){
	console.log("showing sample")
	document.getElementById("minerAddress").value = sampleMinerAddress
	// console.log(sampleReportedHashrate)
	document.getElementById("referenceReportedHashrate").value = sampleReportedHashrate
	// document.getElementById("reportedHashrate").value = 34343
	document.getElementById("hashLosses").value = sampleHashLosses
	document.getElementById("dailyElectrictyCost").value = sampleDailyElectrictyCost
	document.getElementById("miningBeganTimestamp").value = sampleMiningBeganTimestamp
	document.getElementById("initialCost").value = sampleInitialCost
	document.getElementById("breaksFromMining").value = sampleBreaksFromMining
}

function showSettings(){
		document.getElementById("minerAddress").value = minerAddress
		document.getElementById("referenceReportedHashrate").value = reportedHashrate
		document.getElementById("hashLosses").value = hashLosses
		document.getElementById("dailyElectrictyCost").value = dailyElectrictyCost
		document.getElementById("miningBeganTimestamp").value = miningBeganTimestamp
		document.getElementById("initialCost").value = initialCost
		document.getElementById("breaksFromMining").value = breaksFromMining
}

function applySettings(){
	minerAddress = document.getElementById("minerAddress").value
	reportedHashrate = document.getElementById("referenceReportedHashrate").value
	hashLosses = document.getElementById("hashLosses").value
	dailyElectrictyCost = document.getElementById("dailyElectrictyCost").value
	miningBeganTimestamp = document.getElementById("miningBeganTimestamp").value
	initialCost = document.getElementById("initialCost").value
	breaksFromMining = document.getElementById("breaksFromMining").value		

	setCookie(varToString({minerAddress}),minerAddress)
	setCookie(varToString({hashLosses}),hashLosses)
	setCookie(varToString({reportedHashrate}),reportedHashrate)
	setCookie(varToString({dailyElectrictyCost}),dailyElectrictyCost)
	setCookie(varToString({miningBeganTimestamp}),miningBeganTimestamp)
	setCookie(varToString({initialCost}),initialCost)
	setCookie(varToString({breaksFromMining}),breaksFromMining)
	console.log(document.cookie)

	location.reload()
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function setCookie(cname, cvalue) {
	var expires = "expires="+ "2037-03-24T18:00:00.000+08:00";
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


async function asyncCall() {
	console.log('calling');
	let ethermineDashboard = getEthermineDashboard(minerAddress);
	let ethPrice = getEtherPrice() //in SGD, using coinbase
	let ethermineCurrentStats = getEthermineCurrentStats(minerAddress)
	let ethermineWorkerInfo = getEthermineWorkerInfo(minerAddress)
	let ethWalletInfo = getethWalletInfo(minerAddress)
	
	ethermineDashboard = await ethermineDashboard
	ethPrice = await ethPrice
	ethermineCurrentStats = await ethermineCurrentStats
	ethermineWorkerInfo = await ethermineWorkerInfo
	ethWalletInfo = await ethWalletInfo

	console.log({ethermineDashboard});	//to get unpaid eth value
	console.log({ethPrice})
	console.log({ethermineCurrentStats})	//to get coinsPerMin and avgHashrate
	console.log({ethermineWorkerInfo})	//to get another sample of avgHashrate
	console.log({ethWalletInfo})
	console.log("")


	let unpaidEth = ethermineDashboard.currentStatistics.unpaid/10**18
	console.log({unpaidEth})
	let walletEth = ethWalletInfo
	console.log({walletEth})
	let totalEth = walletEth + unpaidEth
	console.log({totalEth})
	console.log("")
	
	
	/*
	ethermine provides REWARDS PER UNIT TIME based on your AVERAGE hashrate over the last 24 hours.

	Thus, if you did not mine for a full 24 hours, your AVERAGE hashrate will be lower than your INSTANTANEOUS hashrate

	Your instantaneous REWARDS PER UNIT TIME is estimated here, by multiplying by (instantaneous hashrate)/(last 24hr avg hashrate)

	ethermine provides 2 values for (last 24hr avg hashrate), both are displayed below. currentstats seems to provide the more accurate value.
	*/
	ethPerDay = 0
	dailyProfitSgd = 0
	dailyRevenueSgd = 0
	acceptedHashrate = reportedHashrate*(100-hashLosses)/100
	currentProfitMargin = "--"
	currentReportedHashrate = 0
	currentElectricityCost = 0
	if (ethermineCurrentStats != 'NO DATA'){
		console.log("unmodified daily payrate: " + ethermineCurrentStats.coinsPerMin*60*24)			
		console.log("currentstats api avg    : " + ethermineCurrentStats.averageHashrate/10**6)
		console.log("currentstats api payrate: " + ethermineCurrentStats.coinsPerMin*60*24*acceptedHashrate/(ethermineCurrentStats.averageHashrate/10**6))
		console.log("workerinfo   api avg    : " + ethermineWorkerInfo[0].averageHashrate/10**6)
		console.log("workerinfo   api payrate: " + ethermineCurrentStats.coinsPerMin*60*24*acceptedHashrate/(ethermineWorkerInfo[0].averageHashrate/10**6))
		console.log("")
		// let avgHashrateOverLastDay = ethermineWorkerInfo[0].averageHashrate/10**6
		avgHashrateOverLastDay = ethermineCurrentStats.averageHashrate/10**6			
		
		ethPerDay = ethermineCurrentStats.coinsPerMin*60*24*acceptedHashrate/avgHashrateOverLastDay
		dailyProfitSgd = ethPerDay*ethPrice - dailyElectrictyCost
		// console.log(ethPerDay)
		dailyRevenueSgd = ethPerDay*ethPrice
		currentProfitMargin = (dailyProfitSgd/dailyRevenueSgd*100).toFixed(0)
		currentReportedHashrate = ethermineDashboard.currentStatistics.reportedHashrate/10**6
		currentElectricityCost = dailyElectrictyCost
		
	}
	gpuUsage = currentReportedHashrate/reportedHashrate*100


	let totalBalSgd = totalEth*ethPrice
	





	currentTime = new Date()
	miningBegan = new Date(miningBeganTimestamp);
	// console.log(currentTime)
	// console.log(miningBegan)
	daysElapsed = (currentTime - miningBegan)/24/60/60/1000
	// console.log(daysElapsed)
	daysMined = daysElapsed - breaksFromMining
	// console.log(daysMined)
	totalCost = daysMined*dailyElectrictyCost
	// console.log(typeof initialCost)
	totalCost += Number(initialCost)
	// console.log(totalCost)
	// console.log(totalCost)
	profitSgd = totalBalSgd - totalCost
	
	
	avgProfitMargin = profitSgd/totalBalSgd*100


	if (reportedHashrate=="" || hashLosses ==""){
		document.getElementById("incompleteSettingsWarning").style.display = "block"
	}
	else {
		document.getElementById("totalEth").innerText = totalEth.toFixed(5);
		document.getElementById("profitSgd").innerText = profitSgd.toFixed(2);
		document.getElementById("dailyEth").innerText = ethPerDay.toFixed(5)
		document.getElementById("dailyProfitSgd").innerText = dailyProfitSgd.toFixed(2)
		document.getElementById("totalCost").innerText = totalCost.toFixed(2)
		// console.log(dailyElectrictyCost)
		document.getElementById("dailyCost").innerText = (currentElectricityCost*1).toFixed(2) //*1 to convert to number
		document.getElementById("revenueSgd").innerText = totalBalSgd.toFixed(2)
		document.getElementById("dailyRevenueSgd").innerText = dailyRevenueSgd.toFixed(2)
		document.getElementById("avgProfitMargin").innerText = avgProfitMargin.toFixed(0)
		document.getElementById("currentProfitMargin").innerText = currentProfitMargin
		document.getElementById("currentReportedHashrate").innerText = currentReportedHashrate.toFixed(1)
		document.getElementById("gpuUsage").innerText = gpuUsage.toFixed(0)
		document.getElementById("ethPrice").innerText = ethPrice.toFixed(2)
	}
}

let minerAddress = getCookie("minerAddress")
let hashLosses = getCookie("hashLosses") 
let breaksFromMining = getCookie("breaksFromMining")
let dailyElectrictyCost = getCookie("dailyElectrictyCost")
let miningBeganTimestamp = getCookie("miningBeganTimestamp")
let initialCost = getCookie("initialCost")
let reportedHashrate = getCookie("reportedHashrate")


if (!(minerAddress || hashLosses || breaksFromMining || dailyElectrictyCost || miningBeganTimestamp || reportedHashrate || initialCost)){
	console.log("No cookies set")
	minerAddress = sampleMinerAddress
	hashLosses = sampleHashLosses
	breaksFromMining = sampleBreaksFromMining
	dailyElectrictyCost = sampleDailyElectrictyCost
	miningBeganTimestamp = sampleMiningBeganTimestamp
	initialCost = sampleInitialCost
	reportedHashrate = sampleReportedHashrate

	setCookie(varToString({minerAddress}),minerAddress)
	setCookie(varToString({hashLosses}),hashLosses)
	setCookie(varToString({dailyElectrictyCost}),dailyElectrictyCost)
	setCookie(varToString({miningBeganTimestamp}),miningBeganTimestamp)
	setCookie(varToString({initialCost}),initialCost)
	setCookie(varToString({breaksFromMining}),breaksFromMining)
	setCookie(varToString({reportedHashrate}),reportedHashrate)
}


window.onload = function() {
    showSettings()
};

asyncCall();