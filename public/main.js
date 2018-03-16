document.addEventListener('DOMContentLoaded', function(){
	console.log("page has been loaded");
});


var tableColumns = ["name","reps","weight","date"];
var tableId = "mainTable";

var showTable = function(id,columns){
	var myTable = makeTable(id,columns);
	var req = new XMLHttpRequest();
	var url ="/show";
	req.open('GET',url,true);
	req.addEventListener('load',function(){
		if(req.status>=200 && req.status<400){
			var json = JSON.parse(req.responseText);
			if (json.length >=1)
				fillTable(json,columns,myTable);		
		}
	});
	req.send(null);
	document.getElementById('workTableSection').appendChild(myTable);
};

var showTableBound = showTable.bind(null,tableId,tableColumns);


document.addEventListener('DOMContentLoaded', showTableBound);

document.getElementById("addForm").addEventListener("submit", function(e) {
	var form = document.getElementById("addForm");
	var req = new XMLHttpRequest();
	var name = form.elements.name.value;
	var reps = form.elements.reps.value;
	var weight = form.elements.weight.value;
	var date = form.elements.date.value;
	var lbs = form.elements.lbs.value;
	if (!name){
		//make this change box to be red
		alert("Can't submit workout without a name!");
		e.preventDefault();
		return;
	}
	var url ="/insert?name="+name+"&reps="+reps+"&weight="+weight+"&date="+date+"&lbs="+lbs;
	req.open('GET',url,true);
	req.addEventListener('load',function(){
		if(req.status>=200 && req.status<400){
			var json = JSON.parse(req.responseText);
			if (json.length >=1){
				var myTable = document.getElementById("mainTable");
				addToTable(json[0],myTable,tableColumns);
			}
		}
	});
	req.send(null);
	e.preventDefault();
});

function addToTable(objectIn, myTable, columns){
	var tbody = myTable.querySelector('tbody');
	makeRow(tbody,objectIn,columns);
}

function makeRow(tbody, objectIn, columns){
	var newRow = document.createElement('tr');
	for (var i=0;i<columns.length;i++){
		var newCell = document.createElement('td');
		newCell.textContent = objectIn[columns[i]];
		newRow.appendChild(newCell);
	}
	var deleteCell = makeDeleteCell(objectIn.id, newRow, tbody);
	newRow.appendChild(deleteCell);
	var editCell = makeEditCell(objectIn, newRow, tbody);
	newRow.appendChild(editCell);
	tbody.appendChild(newRow);
}

function makeTable(id,columns){
	console.log("making table");
	var myTable = document.createElement('table');
	var head = document.createElement('thead');
	var newRow = document.createElement('tr');
	for (var i=0;i<columns.length;i++){
		var cell = document.createElement('th');
		if (columns[i] == "weight")
			cell.textContent = "weight (lbs)";
		else
			cell.textContent = columns[i];
		newRow.appendChild(cell);
	}
	head.appendChild(newRow);
	myTable.appendChild(head);
	var tbody = document.createElement('tbody');
	myTable.appendChild(tbody);
	myTable.setAttribute("id",id);
	return myTable;
}
	
function fillTable(json,columns,myTable){
	console.log("filling table");
	var tbody = myTable.querySelector('tbody');
	for (var i=0;i<json.length;i++)
		makeRow(tbody,json[i],columns);
}

function makeDeleteCell(id, row, tbody){
	var deleteCell = document.createElement('td');
	deleteCell.className += "deleteCell";
	var deleteButton = document.createElement('button');
	deleteButton.setAttribute("data-deleteId",id);
	deleteButton.textContent = "delete";
	deleteButton.addEventListener("click", function(e){
		tbody.removeChild(row);
		var req = new XMLHttpRequest();
		var url ="/delete?id="+id;
		req.open('GET',url,true);
		req.addEventListener('load',function(){
			if(req.status>=200 && req.status<400){
				console.log(req.responseText);
			}
		});
		req.send(null);
	});
	deleteCell.appendChild(deleteButton);
	return deleteCell;
}

function makeEditCell(objectIn, row, tbody){
	var editCell = document.createElement('td');
	editCell.className += "editCell";
	var editForm = document.createElement('form');
	editForm.setAttribute('method','post');
	editForm.setAttribute('action','/edit');
	var input = document.createElement('input');
	input.setAttribute('type','hidden');
	input.setAttribute('name','id');
	input.setAttribute('value',objectIn.id);
	editForm.appendChild(input);
	var editButton = document.createElement('button');
	editButton.setAttribute('type','submit');
	editButton.textContent = 'edit';
	editForm.appendChild(editButton);
	editCell.appendChild(editForm);
	return editCell;
}	


	
		
