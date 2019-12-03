/* eslint-disable camelcase */
/* eslint camelcase: "error" */
let meals = {
	results: [
		{
			vendor_id: 1, // Vendor 1 will be serving
			client_id: 10, // Client 10 on
			datetime: "2017-01-01 13:30:00" // January 1st, 2017 at 1:30 pm
		},
		{
			vendor_id: 1,
			client_id: 40,
			datetime: "2017-01-01 14:30:00"
		},
		{
			vendor_id: 2,
			client_id: 20,
			datetime: "2017-01-01 13:30:00"
		}
	]
};

// Driver information per vendor.
let vendors = {
	results: [
		{
			vendor_id: 1,
			drivers: 1
		},
		{
			vendor_id: 2,
			drivers: 3
		}
	]
};

const blackoutMinutesAhead = 30;
const blackoutMinutesAfter = 10;

/*                           _                               _ _       _     _
(_)___  __   _____ _ __   __| | ___  _ __    __ ___   ____ _(_) | __ _| |__ | | ___
| / __| \ \ / / _ \ '_ \ / _` |/ _ \| '__|  / _` \ \ / / _` | | |/ _` | '_ \| |/ _ \
| \__ \  \ V /  __/ | | | (_| | (_) | |    | (_| |\ V / (_| | | | (_| | |_) | |  __/
|_|___/   \_/ \___|_| |_|\__,_|\___/|_|     \__,_| \_/ \__,_|_|_|\__,_|_.__/|_|\___| */

const is_vendor_available = (vendor_id, date_time) => {
	const targetDeliveryTime = new Date(date_time); // convert to date object
	const arrVendorMatches = vendors.results.filter(v => v.vendor_id === vendor_id);// find vendors by ID

	if (arrVendorMatches.length < 1) return false; // check if chosen Vendor exists
	if (arrVendorMatches[0].drivers < 1) return false; // check if vendor has drivers

	let arrScheduledDeliveries = meals.results.filter(v => v.vendor_id === vendor_id); // find deliveries by vendor ID
	if (arrVendorMatches[0].drivers > arrScheduledDeliveries.length) return true; // check if available drivers exceeds deliveries

	let arrActualConflicts = arrScheduledDeliveries.filter(meal => { // filter all deliveries that show timing conflict
		let conflictDeliveryTime = new Date(meal.datetime); // convert to date object
		if (targetDeliveryTime >= conflictDeliveryTime.getTime() - blackoutMinutesAhead * 60 * 1000) { // check blackout start
			if (targetDeliveryTime <= conflictDeliveryTime.getTime() + blackoutMinutesAfter * 60 * 1000) { // check blackout end
				return true; // Callback return to array (notice block scope): this delivery time conflicts with existing delivery time
			}
		}
	});

	if (arrActualConflicts.length >= arrVendorMatches[0].drivers) return false; // check if # conflicting deliveries exceeds available drivers
	return true; // we can do this!!
};

// ==========================================================================================

console.clear();
let affirm; // used to log the result of the testing function
// affirm = is_vendor_available(1, '2017-01-01 14:30:00'); // should be false
// affirm = is_vendor_available(1, '2017-01-02 14:00:00'); // should be true
affirm = is_vendor_available(1, '2017-01-01 14:00:00');
console.log((affirm) ? 'true' : 'false');
