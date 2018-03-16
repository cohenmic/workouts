function dateValidate(dateIn, forForm){
	if (dateIn != '0000-00-00'){
		if(!forForm)
			return dateFormat(dateIn, 'mm/dd/yyyy');
		else
			return dateFormat(dateIn, 'yyyy-mm-dd');
	}
	else
		return 'undefined';
}

function poundsCalc(weightIn, unitIn){
	if (!weightIn)
		return 'undefined';
	if (unitIn == 0) //if kilos, convert to pounds
		return (weightIn*2.2).toFixed(0);
	else
		return weightIn;
}

function repsValidate(repsIn, forForm){
	if (!repsIn){
		if(forForm)
			return "";
		else
			return "N/A";
	}
	else
		return repsIn;
}
/*
function weightValidate(weightIn, forForm){
	if (!weightIn){
		if (forForm)
			return "";
		else
			return "N/A"
	}
	else
		return weightIn;
} */
